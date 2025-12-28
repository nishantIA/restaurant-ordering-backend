import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { CartRepository, Cart, CartItem, CartCustomization } from './cart.repository';
import { MenuRepository } from '../menu/menu.repository';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { v4 as uuidv4 } from 'uuid';
import { generateSessionId } from '../../shared/utils/session-id-generator';

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name);

  constructor(
    private readonly cartRepository: CartRepository,
    private readonly menuRepository: MenuRepository,
  ) {}

  /**
   * Add item to cart
   */
  async addItem(sessionId: string | undefined, dto: AddCartItemDto): Promise<Cart> {
    // Generate session if not provided
    if (!sessionId) {
      sessionId = generateSessionId();
      this.logger.log(`Generated new session ID: ${sessionId}`);
    }

    // Get or create cart
    let cart = await this.cartRepository.getCart(sessionId);
    if (!cart) {
      cart = this.cartRepository.createEmptyCart(sessionId);
      this.logger.log(`Created new cart for session: ${sessionId}`);
    }

    // Fetch menu item from database
    const menuItem = await this.menuRepository.findMenuItemByIdOrSlug(dto.menuItemId);
    if (!menuItem) {
      throw new NotFoundException(`Menu item with ID '${dto.menuItemId}' not found`);
    }

    // Validate item availability
    if (!menuItem.isAvailable) {
      throw new BadRequestException(`Item '${menuItem.name}' is currently unavailable`);
    }

    // Validate quantity
    this.validateQuantity(menuItem, dto.quantity);

    // Validate stock
    this.validateStock(menuItem, dto.quantity);

    // Validate and map customizations
    const customizations = await this.validateAndMapCustomizations(
      menuItem,
      dto.customizations || [],
    );

    // Calculate prices
    const itemSubtotal = this.calculateItemSubtotal(Number(menuItem.basePrice), customizations, dto.quantity);
    const itemTaxAmount = this.calculateItemTax(itemSubtotal, menuItem.taxes);
    const itemTotal = itemSubtotal + itemTaxAmount;

    // Create cart item
    const cartItem: CartItem = {
      id: uuidv4(),
      menuItemId: menuItem.id,
      menuItemSlug: menuItem.slug,
      name: menuItem.name,
      imageUrl: menuItem.imageUrl,
      basePrice: Number(menuItem.basePrice),
      quantity: dto.quantity,
      quantityType: menuItem.quantityType,
      unit: menuItem.unit,
      customizations,
      specialInstructions: dto.specialInstructions,
      itemSubtotal: Number(itemSubtotal.toFixed(2)),
      itemTaxAmount: Number(itemTaxAmount.toFixed(2)),
      itemTotal: Number(itemTotal.toFixed(2)),
      isAvailable: menuItem.isAvailable,
      availableQuantity: menuItem.availableQuantity ? Number(menuItem.availableQuantity) : undefined,
    };

    // Add to cart
    cart.items.push(cartItem);

    // Recalculate cart totals
    cart = this.recalculateCartTotals(cart);
    cart.updatedAt = new Date().toISOString();

    // Save cart
    await this.cartRepository.saveCart(cart);

    this.logger.log(`Added item '${menuItem.name}' to cart for session: ${sessionId}`);

    return cart;
  }

  /**
   * Update cart item
   */
  async updateItem(
    sessionId: string,
    cartItemId: string,
    dto: UpdateCartItemDto,
  ): Promise<Cart> {
    // Get cart
    const cart = await this.getCartOrThrow(sessionId);

    // Find cart item
    const cartItemIndex = cart.items.findIndex((item) => item.id === cartItemId);
    if (cartItemIndex === -1) {
      throw new NotFoundException(`Cart item with ID '${cartItemId}' not found`);
    }

    const cartItem = cart.items[cartItemIndex];

    // Fetch current menu item for validation
    const menuItem = await this.menuRepository.findMenuItemByIdOrSlug(cartItem.menuItemId);
    if (!menuItem) {
      throw new NotFoundException(`Menu item no longer exists`);
    }

    // Update quantity if provided
    if (dto.quantity !== undefined) {
      this.validateQuantity(menuItem, dto.quantity);
      this.validateStock(menuItem, dto.quantity);
      cartItem.quantity = dto.quantity;
    }

    // Update customizations if provided
    if (dto.customizations !== undefined) {
      const customizations = await this.validateAndMapCustomizations(
        menuItem,
        dto.customizations,
      );
      cartItem.customizations = customizations;
    }

    // Update special instructions if provided
    if (dto.specialInstructions !== undefined) {
      cartItem.specialInstructions = dto.specialInstructions;
    }

    // Recalculate item prices
    const itemSubtotal = this.calculateItemSubtotal(
      Number(menuItem.basePrice),
      cartItem.customizations,
      cartItem.quantity,
    );
    const itemTaxAmount = this.calculateItemTax(itemSubtotal, menuItem.taxes);
    
    cartItem.basePrice = Number(menuItem.basePrice);
    cartItem.itemSubtotal = Number(itemSubtotal.toFixed(2));
    cartItem.itemTaxAmount = Number(itemTaxAmount.toFixed(2));
    cartItem.itemTotal = Number((itemSubtotal + itemTaxAmount).toFixed(2));
    cartItem.isAvailable = menuItem.isAvailable;

    // Update cart
    cart.items[cartItemIndex] = cartItem;
    cart.updatedAt = new Date().toISOString();

    // Recalculate cart totals
    const updatedCart = this.recalculateCartTotals(cart);

    // Save cart
    await this.cartRepository.saveCart(updatedCart);

    this.logger.log(`Updated cart item '${cartItem.name}' for session: ${sessionId}`);

    return updatedCart;
  }

  /**
   * Remove item from cart
   */
  async removeItem(sessionId: string, cartItemId: string): Promise<Cart> {
    // Get cart
    const cart = await this.getCartOrThrow(sessionId);

    // Find and remove item
    const itemIndex = cart.items.findIndex((item) => item.id === cartItemId);
    if (itemIndex === -1) {
      throw new NotFoundException(`Cart item with ID '${cartItemId}' not found`);
    }

    const removedItem = cart.items[itemIndex];
    cart.items.splice(itemIndex, 1);
    cart.updatedAt = new Date().toISOString();

    // Recalculate totals
    const updatedCart = this.recalculateCartTotals(cart);

    // Save cart
    await this.cartRepository.saveCart(updatedCart);

    this.logger.log(`Removed item '${removedItem.name}' from cart for session: ${sessionId}`);

    return updatedCart;
  }

  /**
   * Get cart and recalculate prices
   */
  async getCart(sessionId: string | undefined): Promise<Cart | null> {
    if (!sessionId) {
      return null;
    }

    let cart = await this.cartRepository.getCart(sessionId);
    if (!cart) {
      return null;
    }

    // Recalculate prices with current menu data
    cart = await this.recalculateCartWithCurrentPrices(cart);

    return cart;
  }

  /**
   * Validate quantity
   */
  private validateQuantity(menuItem: any, quantity: number): void {
    const minQty = Number(menuItem.minQuantity);
    const maxQty = menuItem.maxQuantity ? Number(menuItem.maxQuantity) : null;
    const stepQty = Number(menuItem.stepQuantity);

    if (quantity < minQty) {
      throw new BadRequestException(
        `Minimum quantity for '${menuItem.name}' is ${minQty} ${menuItem.unit}`,
      );
    }

    if (maxQty !== null && quantity > maxQty) {
      throw new BadRequestException(
        `Maximum quantity for '${menuItem.name}' is ${maxQty} ${menuItem.unit}`,
      );
    }

    // Check step quantity
    const remainder = (quantity - minQty) % stepQty;
    if (Math.abs(remainder) > 0.001) {
      throw new BadRequestException(
        `Quantity must be in increments of ${stepQty} ${menuItem.unit}`,
      );
    }
  }

  /**
   * Validate stock
   */
  private validateStock(menuItem: any, quantity: number): void {
    if (menuItem.availableQuantity !== null) {
      const available = Number(menuItem.availableQuantity);
      if (quantity > available) {
        throw new BadRequestException(
          `Only ${available} ${menuItem.unit}(s) available for '${menuItem.name}'`,
        );
      }
    }
  }

  /**
   * Validate and map customizations
   */
  private async validateAndMapCustomizations(
    menuItem: any,
    customizationDtos: any[],
  ): Promise<CartCustomization[]> {
    const customizations: CartCustomization[] = [];

    // Handle SIMPLE customizations
    if (menuItem.customizationType === 'SIMPLE' && menuItem.customizations) {
      for (const dto of customizationDtos) {
        const menuCustomization = menuItem.customizations.find(
          (mc: any) => mc.customization.id === dto.customizationId,
        );

        if (!menuCustomization) {
          throw new BadRequestException(
            `Invalid customization ID: ${dto.customizationId}`,
          );
        }

        customizations.push({
          customizationId: menuCustomization.customization.id,
          name: menuCustomization.customization.name,
          type: menuCustomization.customization.type,
          price: Number(menuCustomization.customization.price),
        });
      }
    }

    // Handle COMPLEX_DAG customizations
    if (menuItem.customizationType === 'COMPLEX_DAG' && menuItem.customizationNodes) {
      const allNodes = menuItem.customizationNodes;

      for (const dto of customizationDtos) {
        const node = allNodes.find((n: any) => n.id === dto.customizationId);

        if (!node) {
          throw new BadRequestException(
            `Invalid customization node ID: ${dto.customizationId}`,
          );
        }

        customizations.push({
          customizationId: node.id,
          name: node.name,
          type: node.type,
          price: Number(node.price),
        });
      }
    }

    return customizations;
  }

  /**
   * Calculate item subtotal
   */
  private calculateItemSubtotal(
    basePrice: number,
    customizations: CartCustomization[],
    quantity: number,
  ): number {
    const customizationTotal = customizations.reduce((sum, c) => sum + c.price, 0);
    return (basePrice + customizationTotal) * quantity;
  }

  /**
   * Calculate item tax
   */
  private calculateItemTax(subtotal: number, taxes: any[]): number {
    let taxAmount = 0;

    for (const taxRelation of taxes) {
      const tax = taxRelation.tax;
      if (!tax.isInclusive) {
        if (tax.type === 'PERCENTAGE') {
          taxAmount += (subtotal * Number(tax.value)) / 100;
        } else if (tax.type === 'FIXED') {
          taxAmount += Number(tax.value);
        }
      }
    }

    return taxAmount;
  }

  /**
   * Recalculate cart totals
   */
  private recalculateCartTotals(cart: Cart): Cart {
    cart.itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cart.subtotal = Number(
      cart.items.reduce((sum, item) => sum + item.itemSubtotal, 0).toFixed(2),
    );
    cart.taxAmount = Number(
      cart.items.reduce((sum, item) => sum + item.itemTaxAmount, 0).toFixed(2),
    );
    cart.total = Number((cart.subtotal + cart.taxAmount).toFixed(2));
    cart.canCheckout = cart.items.length > 0 && cart.items.every((item) => item.isAvailable);

    return cart;
  }

  /**
   * Recalculate cart with current prices from database
   */
  private async recalculateCartWithCurrentPrices(cart: Cart): Promise<Cart> {
    // Fetch current menu items
    for (const item of cart.items) {
      const menuItem = await this.menuRepository.findMenuItemByIdOrSlug(item.menuItemId);

      if (menuItem) {
        // Update availability
        item.isAvailable = menuItem.isAvailable;
        item.availableQuantity = menuItem.availableQuantity
          ? Number(menuItem.availableQuantity)
          : undefined;

        // Recalculate with current prices
        const currentBasePrice = Number(menuItem.basePrice);
        const itemSubtotal = this.calculateItemSubtotal(
          currentBasePrice,
          item.customizations,
          item.quantity,
        );
        const itemTaxAmount = this.calculateItemTax(itemSubtotal, menuItem.taxes);

        item.basePrice = currentBasePrice;
        item.itemSubtotal = Number(itemSubtotal.toFixed(2));
        item.itemTaxAmount = Number(itemTaxAmount.toFixed(2));
        item.itemTotal = Number((itemSubtotal + itemTaxAmount).toFixed(2));
      } else {
        // Item deleted from menu
        item.isAvailable = false;
      }
    }

    // Recalculate cart totals
    cart = this.recalculateCartTotals(cart);
    cart.updatedAt = new Date().toISOString();

    // Save updated cart
    await this.cartRepository.saveCart(cart);

    return cart;
  }

  /**
   * Get cart or throw error
   */
  private async getCartOrThrow(sessionId: string): Promise<Cart> {
    const cart = await this.cartRepository.getCart(sessionId);
    if (!cart) {
      throw new NotFoundException(`Cart not found for session: ${sessionId}`);
    }
    return cart;
  }
}