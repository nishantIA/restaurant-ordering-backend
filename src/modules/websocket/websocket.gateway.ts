import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import {
  ClientToServerEvents,
  ServerToClientEvents,
  OrderStatusUpdatePayload,
  NewOrderPayload,
} from './interfaces/websocket-events.interface';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/orders',
})
export class OrdersGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server<ClientToServerEvents, ServerToClientEvents>;

  private readonly logger = new Logger(OrdersGateway.name);

  /**
   * Handle client connection
   */
  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    
    // Send connection confirmation
    client.emit('connected', { socketId: client.id });
  }

  /**
   * Handle client disconnection
   */
  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  /**
   * Customer subscribes to order updates
   */
  @SubscribeMessage('order:subscribe')
  handleOrderSubscribe(
    @ConnectedSocket() client: Socket,
    @MessageBody() orderId: string,
  ) {
    const roomName = `order:${orderId}`;
    client.join(roomName);
    this.logger.log(`Client ${client.id} subscribed to ${roomName}`);
    
    return { success: true, message: `Subscribed to order ${orderId}` };
  }

  /**
   * Customer unsubscribes from order updates
   */
  @SubscribeMessage('order:unsubscribe')
  handleOrderUnsubscribe(
    @ConnectedSocket() client: Socket,
    @MessageBody() orderId: string,
  ) {
    const roomName = `order:${orderId}`;
    client.leave(roomName);
    this.logger.log(`Client ${client.id} unsubscribed from ${roomName}`);
    
    return { success: true, message: `Unsubscribed from order ${orderId}` };
  }

  /**
   * Kitchen staff connects
   */
  @SubscribeMessage('kitchen:connect')
  handleKitchenConnect(@ConnectedSocket() client: Socket) {
    client.join('kitchen:staff');
    this.logger.log(`Kitchen staff connected: ${client.id}`);
    
    return { success: true, message: 'Connected to kitchen dashboard' };
  }

  /**
   * Kitchen staff disconnects
   */
  @SubscribeMessage('kitchen:disconnect')
  handleKitchenDisconnect(@ConnectedSocket() client: Socket) {
    client.leave('kitchen:staff');
    this.logger.log(`Kitchen staff disconnected: ${client.id}`);
    
    return { success: true, message: 'Disconnected from kitchen dashboard' };
  }

  /**
   * Emit order status update to customer
   */
  emitOrderStatusUpdate(payload: OrderStatusUpdatePayload) {
    const roomName = `order:${payload.orderId}`;
    this.server.to(roomName).emit('order:statusUpdate', payload);
    this.logger.log(`Emitted status update to ${roomName}: ${payload.status}`);
  }

  /**
   * Emit new order to kitchen
   */
  emitNewOrderToKitchen(payload: NewOrderPayload) {
    this.server.to('kitchen:staff').emit('kitchen:newOrder', payload);
    this.logger.log(`Emitted new order to kitchen: ${payload.orderNumber}`);
  }

  /**
   * Emit order update to kitchen
   */
  emitOrderUpdateToKitchen(payload: OrderStatusUpdatePayload) {
    this.server.to('kitchen:staff').emit('kitchen:orderUpdate', payload);
    this.logger.log(`Emitted order update to kitchen: ${payload.orderNumber}`);
  }
}