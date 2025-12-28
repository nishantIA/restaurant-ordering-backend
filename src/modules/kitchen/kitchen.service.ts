import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { KitchenRepository } from './kitchen.repository';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { WebSocketService } from '../websocket/websocket.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class KitchenService {
  private readonly logger = new Logger(KitchenService.name);

  constructor(
    private readonly repository: KitchenRepository,
    private readonly webSocketService: WebSocketService,
  ) {}

  /**
   * Get all orders or filter by status
   */
  async getOrders(status?: OrderStatus) {
    let orders;

    if (status) {
      orders = await this.repository.findOrders(status);
      this.logger.log(`Fetched ${orders.length} orders with status: ${status}`);
    } else {
      orders = await this.repository.findActiveOrders();
      this.logger.log(`Fetched ${orders.length} active orders`);
    }

    return orders.map(order => this.transformOrder(order));
  }

  /**
   * Get single order
   */
  async getOrder(id: string) {
    const order = await this.repository.findById(id);

    if (!order) {
      throw new NotFoundException(`Order with ID '${id}' not found`);
    }

    return this.transformOrder(order);
  }

  /**
   * Update order status
   */
  async updateOrderStatus(id: string, dto: UpdateOrderStatusDto) {
    // Get current order
    const currentOrder = await this.repository.findById(id);

    if (!currentOrder) {
      throw new NotFoundException(`Order with ID '${id}' not found`);
    }

    const previousStatus = currentOrder.status;

    // Validate status transition
    this.validateStatusTransition(previousStatus, dto.status);

    // Update status
    const updatedOrder = await this.repository.updateStatus(
      id,
      dto.status,
      dto.changedBy,
      dto.notes,
    );

    this.logger.log(
      `Order ${updatedOrder.orderNumber} status updated: ${previousStatus} → ${dto.status}`,
    );

    // Emit WebSocket events
    const statusPayload = {
      orderId: updatedOrder.id,
      orderNumber: updatedOrder.orderNumber,
      status: dto.status,
      previousStatus,
      changedBy: dto.changedBy,
      notes: dto.notes,
      timestamp: new Date().toISOString(),
    };

    // Notify customer
    this.webSocketService.notifyOrderStatusUpdate(statusPayload);

    // Notify kitchen
    this.webSocketService.notifyOrderUpdate(statusPayload);

    return this.transformOrder(updatedOrder);
  }

  /**
   * Get kitchen statistics
   */
  async getStats() {
    return this.repository.getOrderStats();
  }

  /**
   * Validate status transition
   */
  private validateStatusTransition(currentStatus: OrderStatus, newStatus: OrderStatus) {
    // Define valid transitions
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      RECEIVED: [OrderStatus.PREPARING, OrderStatus.CANCELLED],
      PREPARING: [OrderStatus.READY, OrderStatus.CANCELLED],
      READY: [OrderStatus.COMPLETED, OrderStatus.CANCELLED],
      COMPLETED: [], // Cannot change from completed
      CANCELLED: [], // Cannot change from cancelled
    };

    const allowedTransitions = validTransitions[currentStatus];

    if (!allowedTransitions.includes(newStatus)) {
      throw new BadRequestException(
        `Invalid status transition: ${currentStatus} → ${newStatus}`,
      );
    }
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
        prepTime: item.prepTime,
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
      statusHistory: order.statusHistory?.map((h: any) => ({
        status: h.status,
        changedBy: h.changedBy,
        notes: h.notes,
        createdAt: h.createdAt,
      })),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }
}