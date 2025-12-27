import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PrismaService } from '../shared/database/prisma.service';
import { RedisService } from '../shared/redis/redis.service';

@ApiTags('Health')
@Controller({
  path: 'health',
  version: '1',
})
export class HealthController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ 
    status: 200, 
    description: 'Service is healthy',
    schema: {
      example: {
        success: true,
        data: {
          status: 'ok',
          timestamp: '2024-12-28T10:30:00.000Z',
          uptime: 12345,
          services: {
            database: 'connected',
            redis: 'connected'
          }
        },
        metadata: {
          timestamp: '2024-12-28T10:30:00.000Z'
        }
      }
    }
  })
  async check() {
    const [databaseStatus, redisStatus] = await Promise.allSettled([
      this.checkDatabase(),
      this.checkRedis(),
    ]);

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: {
        database: databaseStatus.status === 'fulfilled' ? 'connected' : 'disconnected',
        redis: redisStatus.status === 'fulfilled' ? 'connected' : 'disconnected',
      },
    };
  }

  private async checkDatabase(): Promise<void> {
    await this.prisma.$queryRaw`SELECT 1`;
  }

  private async checkRedis(): Promise<void> {
    await this.redis.getClient().ping();
  }
}
