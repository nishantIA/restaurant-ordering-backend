import { Module } from '@nestjs/common';
import { KitchenController } from './kitchen.controller';
import { KitchenService } from './kitchen.service';
import { KitchenRepository } from './kitchen.repository';
import { WebSocketModule } from '../websocket/websocket.module';

@Module({
  imports: [WebSocketModule],
  controllers: [KitchenController],
  providers: [KitchenService, KitchenRepository],
  exports: [KitchenService, KitchenRepository],
})
export class KitchenModule {}