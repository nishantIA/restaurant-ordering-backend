import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { ProcessPaymentDto, PaymentResponseDto } from './dto/payment.dto';
import { createSuccessResponse } from '../../shared/dto/api-response.dto';

@ApiTags('Payments')
@Controller({
  path: 'payments',
  version: '1',
})
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('process')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Process payment',
    description: 'Process payment for an order using mock payment gateway. 95% success rate for testing.',
  })
  @ApiResponse({
    status: 201,
    description: 'Payment processed successfully',
    type: PaymentResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - payment already exists or amount mismatch',
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found',
  })
  async processPayment(@Body() dto: ProcessPaymentDto) {
    const payment = await this.paymentsService.processPayment(dto);
    return createSuccessResponse(payment);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get payment by ID',
    description: 'Retrieve payment details by payment ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Payment ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Payment retrieved successfully',
    type: PaymentResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Payment not found',
  })
  async getPayment(@Param('id') id: string) {
    const payment = await this.paymentsService.getPayment(id);
    return createSuccessResponse(payment);
  }

  @Get('order/:orderId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get payment by order ID',
    description: 'Retrieve payment details for a specific order',
  })
  @ApiParam({
    name: 'orderId',
    description: 'Order ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Payment retrieved successfully',
    type: PaymentResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Payment not found for this order',
  })
  async getPaymentByOrder(@Param('orderId') orderId: string) {
    const payment = await this.paymentsService.getPaymentByOrder(orderId);
    return createSuccessResponse(payment);
  }
}