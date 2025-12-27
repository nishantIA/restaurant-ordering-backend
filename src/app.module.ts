import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './shared/database/prisma.module';
import { RedisModule } from './shared/redis/redis.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    // Environment Variables
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database
    PrismaModule,

    // Redis Cache
    RedisModule,

    // Health Check
    HealthModule,

    // Feature Modules (will add later)
    // MenuModule,
    // CartModule,
    // OrdersModule,
    // KitchenModule,
    // PaymentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
