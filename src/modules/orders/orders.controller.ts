import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Headers,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader, ApiParam, ApiQuery } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { createSuccessResponse } from '../../shared/dto/api-response.dto';

@ApiTags('Orders')
@Controller({
  path: 'orders',
  version: '1',
})
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create order from cart',
    description: 'Create a new order from cart with optional customer information',
  })
  @ApiHeader({
    name: 'x-session-id',
    description: 'Session ID',
    required: true,
  })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully',
    type: OrderResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - cart empty or items unavailable',
  })
  async createOrder(
    @Headers('x-session-id') sessionId: string,
    @Body() dto: CreateOrderDto,
  ) {
    const order = await this.ordersService.createOrder(sessionId, dto);
    return createSuccessResponse(order);
  }

  @Get(':idOrOrderNumber')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get order by ID or order number',
    description: 'Retrieve order details by UUID or order number (e.g., ORD-20241228-001)',
  })
  @ApiParam({
    name: 'idOrOrderNumber',
    description: 'Order ID (UUID) or Order Number',
    example: 'ORD-20241228-001',
  })
  @ApiResponse({
    status: 200,
    description: 'Order retrieved successfully',
    type: OrderResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found',
  })
  async getOrder(@Param('idOrOrderNumber') idOrOrderNumber: string) {
    const order = await this.ordersService.getOrder(idOrOrderNumber);
    return createSuccessResponse(order);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get orders',
    description: 'Get orders by session ID',
  })
  @ApiHeader({
    name: 'x-session-id',
    description: 'Session ID',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Orders retrieved successfully',
    type: [OrderResponseDto],
  })
  async getOrders(@Headers('x-session-id') sessionId: string) {
    const orders = await this.ordersService.getOrdersBySession(sessionId);
    return createSuccessResponse(orders);
  }

  @Get('history/search')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get order history by phone or email',
    description: 'Search order history using phone number or email',
  })
  @ApiQuery({
    name: 'phone',
    description: 'Phone number',
    required: false,
    example: '1234567890',
  })
  @ApiQuery({
    name: 'email',
    description: 'Email address',
    required: false,
    example: 'customer@example.com',
  })
  @ApiResponse({
    status: 200,
    description: 'Order history retrieved successfully',
    type: [OrderResponseDto],
  })
  @ApiResponse({
    status: 400,
    description: 'Phone or email is required',
  })
  async getOrderHistory(
    @Query('phone') phone?: string,
    @Query('email') email?: string,
  ) {
    const orders = await this.ordersService.getOrderHistory(phone, email);
    return createSuccessResponse(orders);
  }
}