import { IsString, IsNumber, IsArray, IsOptional, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CartCustomizationDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsString()
  customizationId: string;
}

export class AddCartItemDto {
  @ApiProperty({
    description: 'Menu item ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  menuItemId: string;

  @ApiProperty({
    description: 'Quantity',
    example: 2,
    minimum: 0.001,
  })
  @IsNumber()
  @Min(0.001)
  quantity: number;

  @ApiPropertyOptional({
    description: 'Selected customizations',
    type: [CartCustomizationDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartCustomizationDto)
  customizations?: CartCustomizationDto[];

  @ApiPropertyOptional({
    description: 'Special instructions',
    example: 'Extra sauce, no onions',
  })
  @IsOptional()
  @IsString()
  specialInstructions?: string;
}