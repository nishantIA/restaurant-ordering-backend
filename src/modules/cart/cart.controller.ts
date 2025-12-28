import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Headers,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader, ApiParam } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CartResponseDto } from './dto/cart-response.dto';
import { createSuccessResponse } from '../../shared/dto/api-response.dto';


@ApiTags('Cart')
@Controller({
  path: 'cart',
  version: '1',
})
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('items')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Add item to cart',
    description: 'Add a menu item to the shopping cart with customizations',
  })
  @ApiHeader({
    name: 'x-session-id',
    description: 'Session ID (optional - will be generated if not provided)',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Item added to cart successfully',
    type: CartResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed',
  })
  @ApiResponse({
    status: 404,
    description: 'Menu item not found',
  })
  async addItem(
    @Headers('x-session-id') sessionId: string | undefined,
    @Body() dto: AddCartItemDto,
  ) {
    const cart = await this.cartService.addItem(sessionId, dto);
    return createSuccessResponse(cart);
  }

  @Put('items/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update cart item',
    description: 'Update quantity, customizations, or special instructions for a cart item',
  })
  @ApiHeader({
    name: 'x-session-id',
    description: 'Session ID',
    required: true,
  })
  @ApiParam({
    name: 'id',
    description: 'Cart item ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Cart item updated successfully',
    type: CartResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Cart or cart item not found',
  })
  async updateItem(
    @Headers('x-session-id') sessionId: string,
    @Param('id') itemId: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    const cart = await this.cartService.updateItem(sessionId, itemId, dto);
    return createSuccessResponse(cart);
  }

  @Delete('items/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Remove item from cart',
    description: 'Remove a specific item from the shopping cart',
  })
  @ApiHeader({
    name: 'x-session-id',
    description: 'Session ID',
    required: true,
  })
  @ApiParam({
    name: 'id',
    description: 'Cart item ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Item removed from cart successfully',
    type: CartResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Cart or cart item not found',
  })
  async removeItem(
    @Headers('x-session-id') sessionId: string,
    @Param('id') itemId: string,
  ) {
    const cart = await this.cartService.removeItem(sessionId, itemId);
    return createSuccessResponse(cart);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get cart',
    description: 'Get shopping cart with recalculated prices and availability checks',
  })
  @ApiHeader({
    name: 'x-session-id',
    description: 'Session ID',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Cart retrieved successfully',
    type: CartResponseDto,
  })
  async getCart(@Headers('x-session-id') sessionId: string | undefined) {
    const cart = await this.cartService.getCart(sessionId);
    
    if (!cart) {
      // Return empty cart structure
      return createSuccessResponse({
        sessionId: null,
        items: [],
        itemCount: 0,
        summary: {
          subtotal: 0,
          taxAmount: 0,
          total: 0,
        },
        canCheckout: false,
        expiresAt: null,
        createdAt: null,
        updatedAt: null,
      });
    }

    return createSuccessResponse(cart);
  }
}