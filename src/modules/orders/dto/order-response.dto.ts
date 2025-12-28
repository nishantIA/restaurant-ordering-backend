import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OrderItemCustomizationResponseDto {
  @ApiProperty({ example: 'Large' })
  name: string;

  @ApiProperty({ example: 'SIZE' })
  type: string;

  @ApiProperty({ example: 2.50 })
  price: number;
}

export class OrderItemResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'Margherita Pizza' })
  itemName: string;

  @ApiProperty({ example: 12.99 })
  itemBasePrice: number;

  @ApiProperty({ example: 2 })
  quantity: number;

  @ApiProperty({ example: 'UNIT' })
  quantityType: string;

  @ApiPropertyOptional({ example: 'piece' })
  unit?: string;

  @ApiProperty({ type: [OrderItemCustomizationResponseDto] })
  customizations: OrderItemCustomizationResponseDto[];

  @ApiPropertyOptional({ example: 'Extra sauce' })
  specialInstructions?: string;

  @ApiProperty({ example: 30.98 })
  itemSubtotal: number;

  @ApiProperty({ example: 5.58 })
  itemTaxAmount: number;

  @ApiProperty({ example: 36.56 })
  itemTotal: number;
}

export class OrderTaxResponseDto {
  @ApiProperty({ example: 'Sales Tax' })
  taxName: string;

  @ApiProperty({ example: 'PERCENTAGE' })
  taxType: string;

  @ApiProperty({ example: 18.0 })
  taxValue: number;

  @ApiProperty({ example: 5.58 })
  calculatedAmount: number;
}

export class OrderUserResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiPropertyOptional({ example: '1234567890' })
  phone?: string;

  @ApiPropertyOptional({ example: 'customer@example.com' })
  email?: string;

  @ApiPropertyOptional({ example: 'John Doe' })
  name?: string;
}

export class OrderResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'ORD-20241228-001' })
  orderNumber: string;

  @ApiProperty({ example: 'RECEIVED', enum: ['RECEIVED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'] })
  status: string;

  @ApiPropertyOptional({ type: OrderUserResponseDto })
  user?: OrderUserResponseDto;

  @ApiProperty({ type: [OrderItemResponseDto] })
  items: OrderItemResponseDto[];

  @ApiProperty({ type: [OrderTaxResponseDto] })
  taxes: OrderTaxResponseDto[];

  @ApiProperty({ example: 30.98 })
  subtotal: number;

  @ApiProperty({ example: 5.58 })
  taxAmount: number;

  @ApiProperty({ example: 36.56 })
  totalAmount: number;

  @ApiPropertyOptional({ example: 'Please call when ready' })
  specialInstructions?: string;

  @ApiPropertyOptional({ example: 25 })
  estimatedPrepTime?: number;

  @ApiProperty({ example: '2024-12-28T10:30:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-12-28T10:30:00.000Z' })
  updatedAt: Date;
}