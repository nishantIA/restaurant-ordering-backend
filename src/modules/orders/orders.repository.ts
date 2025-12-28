import { Injectable, Logger } from '@nestjs/common';
import { Order, OrderStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../../shared/database/prisma.service';

@Injectable()
export class OrdersRepository {
  private readonly logger = new Logger(OrdersRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create order with stock management (transaction)
   */
  async createOrder(data: {
    sessionId: string;
    userId?: string;
    orderNumber: string;
    subtotal: number;
    taxAmount: number;
    totalAmount: number;
    specialInstructions?: string;
    estimatedPrepTime: number;
    items: any[];
    taxes: any[];
    stockUpdates: { menuItemId: string; quantity: number }[];
  }): Promise<Order> {
    return this.prisma.$transaction(async (tx) => {
      // 1. Update stock atomically (handles concurrency!)
      for (const stock of data.stockUpdates) {
        const updated = await tx.menuItem.update({
          where: { id: stock.menuItemId },
          data: {
            availableQuantity: {
              decrement: stock.quantity,
            },
          },
          select: {
            id: true,
            name: true,
            availableQuantity: true,
          },
        });

        // Check if stock went negative (shouldn't happen with constraint)
        if (updated.availableQuantity !== null && Number(updated.availableQuantity) < 0) {
          throw new Error(`Insufficient stock for ${updated.name}`);
        }

        this.logger.debug(
          `Stock updated for ${updated.name}: ${updated.availableQuantity}`,
        );
      }

      // 2. Create order
      const order = await tx.order.create({
        data: {
          sessionId: data.sessionId,
          userId: data.userId,
          orderNumber: data.orderNumber,
          status: OrderStatus.RECEIVED,
          subtotal: data.subtotal,
          taxAmount: data.taxAmount,
          totalAmount: data.totalAmount,
          specialInstructions: data.specialInstructions,
          estimatedPrepTime: data.estimatedPrepTime,
          items: {
            create: data.items,
          },
          taxes: {
            create: data.taxes,
          },
          statusHistory: {
            create: {
              status: OrderStatus.RECEIVED,
              changedBy: 'system',
              notes: 'Order placed',
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
          statusHistory: true,
        },
      });

      this.logger.log(`Order created: ${order.orderNumber}`);

      return order;
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
   * Get order by order number
   */
  async findByOrderNumber(orderNumber: string): Promise<Order | null> {
    return this.prisma.order.findUnique({
      where: { orderNumber },
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
   * Get orders by session ID
   */
  async findBySessionId(sessionId: string): Promise<Order[]> {
    return this.prisma.order.findMany({
      where: { sessionId },
      include: {
        user: true,
        items: {
          include: {
            customizations: true,
          },
        },
        taxes: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Get orders by user ID
   */
  async findByUserId(userId: string): Promise<Order[]> {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            customizations: true,
          },
        },
        taxes: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Get today's order count (for order number generation)
   */
  async getTodayOrderCount(): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.prisma.order.count({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });
  }
}