import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrdersRepository } from './orders.repository';
import { CartModule } from '../cart/cart.module';
import { MenuModule } from '../menu/menu.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [CartModule, MenuModule, UsersModule],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository],
  exports: [OrdersService, OrdersRepository],
})
export class OrdersModule {}