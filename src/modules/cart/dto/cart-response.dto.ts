import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CartCustomizationResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  customizationId: string;

  @ApiProperty({ example: 'Large' })
  name: string;

  @ApiProperty({ example: 'SIZE' })
  type: string;

  @ApiProperty({ example: 2.5 })
  price: number;
}

export class CartItemResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  menuItemId: string;

  @ApiProperty({ example: 'margherita-pizza' })
  menuItemSlug: string;

  @ApiProperty({ example: 'Margherita Pizza' })
  name: string;

  @ApiPropertyOptional({ example: 'https://example.com/pizza.jpg' })
  imageUrl?: string;

  @ApiProperty({ example: 12.99 })
  basePrice: number;

  @ApiProperty({ example: 2 })
  quantity: number;

  @ApiProperty({ example: 'UNIT' })
  quantityType: string;

  @ApiPropertyOptional({ example: 'piece' })
  unit?: string;

  @ApiProperty({ type: [CartCustomizationResponseDto] })
  customizations: CartCustomizationResponseDto[];

  @ApiPropertyOptional({ example: 'Extra sauce' })
  specialInstructions?: string;

  @ApiProperty({ example: 30.98 })
  itemSubtotal: number;

  @ApiProperty({ example: 5.58 })
  itemTaxAmount: number;

  @ApiProperty({ example: 36.56 })
  itemTotal: number;

  @ApiProperty({ example: true })
  isAvailable: boolean;

  @ApiPropertyOptional({ example: 50 })
  availableQuantity?: number;
}

export class CartSummaryDto {
  @ApiProperty({ example: 45.97 })
  subtotal: number;

  @ApiProperty({ example: 8.27 })
  taxAmount: number;

  @ApiProperty({ example: 54.24 })
  total: number;
}

export class CartResponseDto {
  @ApiProperty({ example: 'sess_abc123...' })
  sessionId: string;

  @ApiProperty({ type: [CartItemResponseDto] })
  items: CartItemResponseDto[];

  @ApiProperty({ example: 3 })
  itemCount: number;

  @ApiProperty({ type: CartSummaryDto })
  summary: CartSummaryDto;

  @ApiProperty({ example: true })
  canCheckout: boolean;

  @ApiProperty({ example: '2024-12-29T10:30:00.000Z' })
  expiresAt: string;

  @ApiProperty({ example: '2024-12-28T10:30:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2024-12-28T10:30:00.000Z' })
  updatedAt: string;
}