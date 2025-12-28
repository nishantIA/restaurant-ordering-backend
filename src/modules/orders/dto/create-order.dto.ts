import { IsString, IsOptional, IsEmail, MaxLength, Matches } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOrderDto {
  // Customer Info (Optional)
  @ApiPropertyOptional({
    description: 'Customer phone number',
    example: '1234567890',
  })
  @IsOptional()
  @IsString()
  @Matches(/^[0-9]{10,15}$/, { message: 'Phone must be 10-15 digits' })
  phone?: string;

  @ApiPropertyOptional({
    description: 'Customer email',
    example: 'customer@example.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Customer name',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  // Order Info
  @ApiPropertyOptional({
    description: 'Special instructions for the order',
    example: 'Please make it extra spicy',
  })
  @IsOptional()
  @IsString()
  specialInstructions?: string;
}