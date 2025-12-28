import { IsNumber, IsArray, IsOptional, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CartCustomizationDto } from './add-cart-item.dto';

export class UpdateCartItemDto {
  @ApiPropertyOptional({
    description: 'Updated quantity',
    example: 3,
    minimum: 0.001,
  })
  @IsOptional()
  @IsNumber()
  @Min(0.001)
  quantity?: number;

  @ApiPropertyOptional({
    description: 'Updated customizations',
    type: [CartCustomizationDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartCustomizationDto)
  customizations?: CartCustomizationDto[];

  @ApiPropertyOptional({
    description: 'Updated special instructions',
    example: 'No onions',
  })
  @IsOptional()
  @IsOptional()
  specialInstructions?: string;
}