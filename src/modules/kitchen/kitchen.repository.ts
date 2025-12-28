import { Injectable, Logger } from '@nestjs/common';
import { Order, OrderStatus } from '@prisma/client';
import { PrismaService } from '../../shared/database/prisma.service';

@Injectable()
export class KitchenRepository {
  private readonly logger = new Logger(KitchenRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get all orders with optional status filter
   */
  async findOrders(status?: OrderStatus): Promise<Order[]> {
    const where = status ? { status } : {};

    return this.prisma.order.findMany({
      where,
      include: {
        user: true,
        items: {
          include: {
            customizations: true,
          },
        },
        taxes: true,
        statusHistory: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 5, // Last 5 status changes
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Get active orders (not completed or cancelled)
   */
  async findActiveOrders(): Promise<Order[]> {
    return this.prisma.order.findMany({
      where: {
        status: {
          in: [OrderStatus.RECEIVED, OrderStatus.PREPARING, OrderStatus.READY],
        },
      },
      include: {
        user: true,
        items: {
          include: {
            customizations: true,
          },
        },
        taxes: true,
        statusHistory: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 5,
        },
      },
      orderBy: {
        createdAt: 'asc', // Oldest first for kitchen queue
      },
    });
  }

  /**
   * Get order by ID
   */
  async findById(id: string): Promise<Order | null> {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        user: true,
        items: {
          include: {
            customizations: true,
          },
        },
        taxes: true,
        statusHistory: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
  }

  /**
   * Update order status
   */
  async updateStatus(
    orderId: string,
    status: OrderStatus,
    changedBy?: string,
    notes?: string,
  ): Promise<Order> {
    return this.prisma.order.update({
      where: { id: orderId },
      data: {
        status,
        statusHistory: {
          create: {
            status,
            changedBy: changedBy || 'kitchen',
            notes,
          },
        },
      },
      include: {
        user: true,
        items: {
          include: {
            customizations: true,
          },
        },
        taxes: true,
        statusHistory: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
  }

  /**
   * Get order statistics
   */
  async getOrderStats() {
    const [received, preparing, ready, completed, cancelled] = await Promise.all([
      this.prisma.order.count({ where: { status: OrderStatus.RECEIVED } }),
      this.prisma.order.count({ where: { status: OrderStatus.PREPARING } }),
      this.prisma.order.count({ where: { status: OrderStatus.READY } }),
      this.prisma.order.count({ where: { status: OrderStatus.COMPLETED } }),
      this.prisma.order.count({ where: { status: OrderStatus.CANCELLED } }),
    ]);

    return {
      received,
      preparing,
      ready,
      completed,
      cancelled,
      active: received + preparing + ready,
    };
  }
}