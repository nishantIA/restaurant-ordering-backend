import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { KitchenService } from './kitchen.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { createSuccessResponse } from '../../shared/dto/api-response.dto';

@ApiTags('Kitchen')
@Controller({
  path: 'kitchen',
  version: '1',
})
export class KitchenController {
  constructor(private readonly kitchenService: KitchenService) {}

  @Get('orders')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all orders for kitchen',
    description: 'Get all orders or filter by status. If no status provided, returns only active orders (RECEIVED, PREPARING, READY)',
  })
  @ApiQuery({
    name: 'status',
    description: 'Filter by order status',
    required: false,
    enum: ['RECEIVED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'],
  })
  @ApiResponse({
    status: 200,
    description: 'Orders retrieved successfully',
  })
  async getOrders(
    @Query('status') status?: 'RECEIVED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED',
  ) {
    const orders = await this.kitchenService.getOrders(status);
    return createSuccessResponse(orders);
  }

  @Get('orders/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get order details',
    description: 'Get detailed information about a specific order',
  })
  @ApiParam({
    name: 'id',
    description: 'Order ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Order retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found',
  })
  async getOrder(@Param('id') id: string) {
    const order = await this.kitchenService.getOrder(id);
    return createSuccessResponse(order);
  }

  @Patch('orders/:id/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update order status',
    description: 'Update the status of an order with notes. Valid transitions: RECEIVED→PREPARING→READY→COMPLETED. Any status can go to CANCELLED.',
  })
  @ApiParam({
    name: 'id',
    description: 'Order ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Order status updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid status transition',
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found',
  })
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    const order = await this.kitchenService.updateOrderStatus(id, dto);
    return createSuccessResponse(order);
  }

  @Get('stats')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get kitchen statistics',
    description: 'Get count of orders by status',
  })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
  })
  async getStats() {
    const stats = await this.kitchenService.getStats();
    return createSuccessResponse(stats);
  }
}