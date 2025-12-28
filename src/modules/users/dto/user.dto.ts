import { IsString, IsEmail, IsOptional, IsEnum, MaxLength, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FindOrCreateUserDto {
  @ApiPropertyOptional({
    description: 'User phone number',
    example: '1234567890',
  })
  @IsOptional()
  @IsString()
  @Matches(/^[0-9]{10,15}$/, { message: 'Phone must be 10-15 digits' })
  phone?: string;

  @ApiPropertyOptional({
    description: 'User email',
    example: 'customer@example.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'User name',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;
}

export class UserResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiPropertyOptional({ example: '1234567890' })
  phone?: string;

  @ApiPropertyOptional({ example: 'customer@example.com' })
  email?: string;

  @ApiPropertyOptional({ example: 'John Doe' })
  name?: string;

  @ApiProperty({ example: 'CUSTOMER', enum: ['CUSTOMER', 'KITCHEN_STAFF', 'ADMIN'] })
  role: string;

  @ApiProperty({ example: '2024-12-28T10:30:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-12-28T10:30:00.000Z' })
  updatedAt: Date;
}