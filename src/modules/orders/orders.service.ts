import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
import { CartRepository } from '../cart/cart.repository';
import { MenuRepository } from '../menu/menu.repository';
import { UsersService } from '../users/users.service';
import { WebSocketService } from '../websocket/websocket.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { RedisService } from '../../shared/redis/redis.service';
import { generateOrderNumber } from '../../shared/utils/order-number-generator';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private readonly repository: OrdersRepository,
    private readonly cartRepository: CartRepository,
    private readonly menuRepository: MenuRepository,
    private readonly usersService: UsersService,
    private readonly redis: RedisService,
    private readonly webSocketService: WebSocketService,
  ) {}

  /**
   * Create order from cart
   */
  async createOrder(sessionId: string, dto: CreateOrderDto) {
    // 1. Get cart
    const cart = await this.cartRepository.getCart(sessionId);
    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // 2. Validate all items are available
    if (!cart.canCheckout) {
      throw new BadRequestException('Some items in cart are unavailable');
    }

    // 3. Find or create user (if phone/email provided)
    let userId: string | undefined;
    let user: any;
    if (dto.phone || dto.email) {
      user = await this.usersService.findOrCreateUser({
        phone: dto.phone,
        email: dto.email,
        name: dto.name,
      });
      userId = user.id;
      this.logger.log(`User ${userId} linked to order`);
    }

    // 4. Recalculate prices and validate stock
    const { orderItems, orderTaxes, stockUpdates } = await this.prepareOrderData(cart);

    // 5. Calculate totals
    const subtotal = orderItems.reduce((sum, item) => sum + Number(item.itemSubtotal), 0);
    const taxAmount = orderItems.reduce((sum, item) => sum + Number(item.itemTaxAmount), 0);
    const totalAmount = subtotal + taxAmount;

    // 6. Calculate estimated prep time
    const estimatedPrepTime = Math.max(...orderItems.map(item => item.prepTime || 0), 15);

    // 7. Generate order number
    const orderCount = await this.repository.getTodayOrderCount();
    const orderNumber = generateOrderNumber(orderCount + 1);

    // 8. Create order (with transaction for stock management)
    const order = await this.repository.createOrder({
      sessionId,
      userId,
      orderNumber,
      subtotal,
      taxAmount,
      totalAmount,
      specialInstructions: dto.specialInstructions,
      estimatedPrepTime,
      items: orderItems,
      taxes: orderTaxes,
      stockUpdates,
    });

    // 9. Clear cart
    await this.cartRepository.deleteCart(sessionId);

    this.logger.log(`Order ${orderNumber} created successfully`);

    // 10. Emit WebSocket event to kitchen
    this.webSocketService.notifyNewOrder({
      orderId: order.id,
      orderNumber: order.orderNumber,
      items: orderItems.map(item => ({
        name: item.itemName,
        quantity: Number(item.quantity),
        customizations: item.customizations?.create || [],
      })),
      totalAmount,
      estimatedPrepTime,
      user: user ? {
        phone: user.phone,
        name: user.name,
      } : undefined,
      timestamp: new Date().toISOString(),
    });

    return this.transformOrder(order);
  }

  /**
   * Get order by ID or order number
   */
  async getOrder(idOrOrderNumber: string) {
    // Check if UUID or order number
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrOrderNumber);

    const order = isUUID
      ? await this.repository.findById(idOrOrderNumber)
      : await this.repository.findByOrderNumber(idOrOrderNumber);

    if (!order) {
      throw new NotFoundException(`Order '${idOrOrderNumber}' not found`);
    }

    return this.transformOrder(order);
  }

  /**
   * Get orders by session
   */
  async getOrdersBySession(sessionId: string) {
    const orders = await this.repository.findBySessionId(sessionId);
    return orders.map(order => this.transformOrder(order));
  }

  /**
   * Get order history by phone or email
   */
  async getOrderHistory(phone?: string, email?: string) {
    if (!phone && !email) {
      throw new BadRequestException('Either phone or email is required');
    }

    // Find user
    let user;
    if (phone) {
      user = await this.usersService.findByPhone(phone);
    } else if (email) {
      user = await this.usersService.findByEmail(email);
    }

    if (!user) {
      return []; // No user found = no orders
    }

    const orders = await this.repository.findByUserId(user.id);
    return orders.map(order => this.transformOrder(order));
  }

  /**
   * Prepare order data from cart
   */
  private async prepareOrderData(cart: any) {
    const orderItems: any[] = [];
    const orderTaxes: any[] = [];
    const stockUpdates: { menuItemId: string; quantity: number }[] = [];

    // Process each cart item
    for (const cartItem of cart.items) {
      // Fetch current menu item
      const menuItem = await this.menuRepository.findMenuItemByIdOrSlug(cartItem.menuItemId);

      if (!menuItem) {
        throw new BadRequestException(`Menu item '${cartItem.name}' no longer exists`);
      }

      if (!menuItem.isAvailable) {
        throw new BadRequestException(`Item '${menuItem.name}' is no longer available`);
      }

      // Check stock
      if (menuItem.availableQuantity !== null) {
        const available = Number(menuItem.availableQuantity);
        if (cartItem.quantity > available) {
          throw new BadRequestException(
            `Only ${available} ${menuItem.unit}(s) available for '${menuItem.name}'`,
          );
        }

        // Add to stock updates
        stockUpdates.push({
          menuItemId: menuItem.id,
          quantity: cartItem.quantity,
        });
      }

      // Create order item with customizations
      const customizations = cartItem.customizations.map((c: any) => ({
        customizationName: c.name,
        customizationType: c.type,
        customizationPrice: c.price,
      }));

      orderItems.push({
        menuItemId: menuItem.id,
        itemName: menuItem.name,
        itemBasePrice: Number(menuItem.basePrice),
        quantity: cartItem.quantity,
        quantityType: menuItem.quantityType,
        unit: menuItem.unit,
        specialInstructions: cartItem.specialInstructions,
        customizationTotal: customizations.reduce((sum: number, c: any) => sum + c.customizationPrice, 0),
        itemSubtotal: cartItem.itemSubtotal,
        itemTaxAmount: cartItem.itemTaxAmount,
        itemTotal: cartItem.itemTotal,
        prepTime: menuItem.prepTime,
        customizations: {
          create: customizations,
        },
      });
    }

    // Get unique taxes from all items
    const taxMap = new Map();
    for (const cartItem of cart.items) {
      const menuItem = await this.menuRepository.findMenuItemByIdOrSlug(cartItem.menuItemId);
      if (menuItem && menuItem.taxes) {
        for (const taxRelation of menuItem.taxes) {
          const tax = taxRelation.tax;
          const key = tax.id;
          if (!taxMap.has(key)) {
            taxMap.set(key, {
              taxId: tax.id,
              taxName: tax.name,
              taxType: tax.type,
              taxValue: Number(tax.value),
              calculatedAmount: 0,
            });
          }
        }
      }
    }

    // Calculate tax amounts
    const subtotal = orderItems.reduce((sum, item) => sum + Number(item.itemSubtotal), 0);
    for (const [_, taxData] of taxMap) {
      if (taxData.taxType === 'PERCENTAGE') {
        taxData.calculatedAmount = (subtotal * taxData.taxValue) / 100;
      } else if (taxData.taxType === 'FIXED') {
        taxData.calculatedAmount = taxData.taxValue;
      }
      orderTaxes.push(taxData);
    }

    return { orderItems, orderTaxes, stockUpdates };
  }

  /**
   * Transform order to response DTO
   */
  private transformOrder(order: any) {
    return {
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      user: order.user ? {
        id: order.user.id,
        phone: order.user.phone,
        email: order.user.email,
        name: order.user.name,
      } : undefined,
      items: order.items.map((item: any) => ({
        id: item.id,
        itemName: item.itemName,
        itemBasePrice: Number(item.itemBasePrice),
        quantity: Number(item.quantity),
        quantityType: item.quantityType,
        unit: item.unit,
        customizations: item.customizations.map((c: any) => ({
          name: c.customizationName,
          type: c.customizationType,
          price: Number(c.customizationPrice),
        })),
        specialInstructions: item.specialInstructions,
        itemSubtotal: Number(item.itemSubtotal),
        itemTaxAmount: Number(item.itemTaxAmount),
        itemTotal: Number(item.itemTotal),
      })),
      taxes: order.taxes.map((t: any) => ({
        taxName: t.taxName,
        taxType: t.taxType,
        taxValue: Number(t.taxValue),
        calculatedAmount: Number(t.calculatedAmount),
      })),
      subtotal: Number(order.subtotal),
      taxAmount: Number(order.taxAmount),
      totalAmount: Number(order.totalAmount),
      specialInstructions: order.specialInstructions,
      estimatedPrepTime: order.estimatedPrepTime,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }
}