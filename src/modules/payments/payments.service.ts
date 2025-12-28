import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PaymentsRepository } from './payments.repository';
import { OrdersRepository } from '../orders/orders.repository';
import { ProcessPaymentDto } from './dto/payment.dto';
import { PaymentStatus } from '@prisma/client';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly repository: PaymentsRepository,
    private readonly ordersRepository: OrdersRepository,
  ) {}

  /**
   * Process payment (mock)
   */
  async processPayment(dto: ProcessPaymentDto) {
    // 1. Verify order exists
    const order = await this.ordersRepository.findById(dto.orderId);
    if (!order) {
      throw new NotFoundException(`Order with ID '${dto.orderId}' not found`);
    }

    // 2. Check if payment already exists
    const existingPayment = await this.repository.findByOrderId(dto.orderId);
    if (existingPayment) {
      throw new BadRequestException('Payment already processed for this order');
    }

    // 3. Verify amount matches order total
    const orderTotal = Number(order.totalAmount);
    if (Math.abs(dto.amount - orderTotal) > 0.01) {
      throw new BadRequestException(
        `Payment amount $${dto.amount} does not match order total $${orderTotal}`,
      );
    }

    // 4. Mock payment processing
    const paymentResult = this.mockPaymentGateway(dto);

    // 5. Create payment record
    const payment = await this.repository.create({
      orderId: dto.orderId,
      amount: dto.amount,
      paymentMethod: dto.paymentMethod,
      status: paymentResult.status,
      transactionId: paymentResult.transactionId,
      gatewayResponse: paymentResult.gatewayResponse,
    });

    this.logger.log(
      `Payment ${paymentResult.status} for order ${order.orderNumber}: ${paymentResult.transactionId}`,
    );

    return this.transformPayment(payment);
  }

  /**
   * Get payment by ID
   */
  async getPayment(id: string) {
    const payment = await this.repository.findById(id);

    if (!payment) {
      throw new NotFoundException(`Payment with ID '${id}' not found`);
    }

    return this.transformPayment(payment);
  }

  /**
   * Get payment by order ID
   */
  async getPaymentByOrder(orderId: string) {
    const payment = await this.repository.findByOrderId(orderId);

    if (!payment) {
      throw new NotFoundException(`No payment found for order '${orderId}'`);
    }

    return this.transformPayment(payment);
  }

  /**
   * Mock payment gateway
   */
  private mockPaymentGateway(dto: ProcessPaymentDto): {
    status: PaymentStatus;
    transactionId: string;
    gatewayResponse: any;
  } {
    // Generate transaction ID
    const transactionId = this.generateTransactionId();

    // Mock: 95% success rate (or always success for MOCK method)
    const shouldSucceed = dto.paymentMethod === 'MOCK' || Math.random() > 0.05;

    if (shouldSucceed) {
      return {
        status: PaymentStatus.SUCCESS,
        transactionId,
        gatewayResponse: {
          success: true,
          message: 'Payment processed successfully',
          transactionId,
          timestamp: new Date().toISOString(),
          gatewayCode: 'APPROVED',
          cardLast4: dto.paymentMethod === 'CARD' ? '4242' : undefined,
        },
      };
    } else {
      return {
        status: PaymentStatus.FAILED,
        transactionId,
        gatewayResponse: {
          success: false,
          message: 'Payment declined - Insufficient funds',
          transactionId,
          timestamp: new Date().toISOString(),
          gatewayCode: 'DECLINED',
          errorCode: 'INSUFFICIENT_FUNDS',
        },
      };
    }
  }

  /**
   * Generate transaction ID
   */
  private generateTransactionId(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();

    return `TXN-${year}${month}${day}-${random}`;
  }

  /**
   * Transform payment to response DTO
   */
  private transformPayment(payment: any) {
    return {
      id: payment.id,
      orderId: payment.orderId,
      amount: Number(payment.amount),
      status: payment.status,
      paymentMethod: payment.paymentMethod,
      transactionId: payment.transactionId,
      gatewayResponse: payment.gatewayResponse,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    };
  }
}