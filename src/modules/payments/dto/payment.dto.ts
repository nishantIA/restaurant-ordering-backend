import { IsString, IsNumber, IsEnum, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProcessPaymentDto {
  @ApiProperty({
    description: 'Order ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  orderId: string;

  @ApiProperty({
    description: 'Payment amount',
    example: 14.14,
  })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({
    description: 'Payment method',
    enum: ['CARD', 'CASH', 'UPI', 'MOCK'],
    example: 'CARD',
  })
  @IsEnum(['CARD', 'CASH', 'UPI', 'MOCK'])
  paymentMethod: 'CARD' | 'CASH' | 'UPI' | 'MOCK';
}

export class PaymentResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  orderId: string;

  @ApiProperty({ example: 14.14 })
  amount: number;

  @ApiProperty({ example: 'SUCCESS', enum: ['PENDING', 'SUCCESS', 'FAILED', 'REFUNDED'] })
  status: string;

  @ApiProperty({ example: 'CARD' })
  paymentMethod: string;

  @ApiProperty({ example: 'TXN-20251228-001' })
  transactionId: string;

  @ApiProperty()
  gatewayResponse: any;

  @ApiProperty({ example: '2025-12-28T10:30:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-12-28T10:30:00.000Z' })
  updatedAt: Date;
}