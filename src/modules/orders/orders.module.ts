import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrdersRepository } from './orders.repository';
import { CartModule } from '../cart/cart.module';
import { MenuModule } from '../menu/menu.module';
import { UsersModule } from '../users/users.module';
import { WebSocketModule } from '../websocket/websocket.module';

@Module({
  imports: [CartModule, MenuModule, UsersModule, WebSocketModule],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository],
  exports: [OrdersService, OrdersRepository],
})
export class OrdersModule {}