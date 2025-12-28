import { Injectable } from '@nestjs/common';
import { Payment, PaymentStatus } from '@prisma/client';
import { PrismaService } from '../../shared/database/prisma.service';

@Injectable()
export class PaymentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create payment record
   */
  async create(data: {
    orderId: string;
    amount: number;
    paymentMethod: string;
    status: PaymentStatus;
    transactionId?: string;
    gatewayResponse?: any;
  }): Promise<Payment> {
    return this.prisma.payment.create({
      data,
    });
  }

  /**
   * Find payment by order ID
   */
  async findByOrderId(orderId: string): Promise<Payment | null> {
    return this.prisma.payment.findUnique({
      where: { orderId },
    });
  }

  /**
   * Find payment by ID
   */
  async findById(id: string): Promise<Payment | null> {
    return this.prisma.payment.findUnique({
      where: { id },
    });
  }

  /**
   * Find payment by transaction ID
   */
  async findByTransactionId(transactionId: string): Promise<Payment | null> {
    return this.prisma.payment.findUnique({
      where: { transactionId },
    });
  }

  /**
   * Update payment status
   */
  async updateStatus(
    id: string,
    status: PaymentStatus,
    gatewayResponse?: any,
  ): Promise<Payment> {
    return this.prisma.payment.update({
      where: { id },
      data: {
        status,
        gatewayResponse,
      },
    });
  }
}