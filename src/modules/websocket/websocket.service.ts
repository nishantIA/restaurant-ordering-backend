import { Injectable } from '@nestjs/common';
import { OrdersGateway } from './websocket.gateway';
import {
  OrderStatusUpdatePayload,
  NewOrderPayload,
} from './interfaces/websocket-events.interface';

@Injectable()
export class WebSocketService {
  constructor(private readonly gateway: OrdersGateway) {}

  /**
   * Notify customer of order status update
   */
  notifyOrderStatusUpdate(payload: OrderStatusUpdatePayload) {
    this.gateway.emitOrderStatusUpdate(payload);
  }

  /**
   * Notify kitchen of new order
   */
  notifyNewOrder(payload: NewOrderPayload) {
    this.gateway.emitNewOrderToKitchen(payload);
  }

  /**
   * Notify kitchen of order update
   */
  notifyOrderUpdate(payload: OrderStatusUpdatePayload) {
    this.gateway.emitOrderUpdateToKitchen(payload);
  }
}