import { Module } from '@nestjs/common';
import { OrdersGateway } from './websocket.gateway';
import { WebSocketService } from './websocket.service';

@Module({
  providers: [OrdersGateway, WebSocketService],
  exports: [WebSocketService],
})
export class WebSocketModule {}