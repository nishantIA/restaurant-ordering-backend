import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateOrderStatusDto {
  @ApiProperty({
    description: 'New order status',
    enum: ['RECEIVED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'],
    example: 'PREPARING',
  })
  @IsEnum(['RECEIVED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'])
  status: 'RECEIVED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';

  @ApiPropertyOptional({
    description: 'Notes about status change',
    example: 'Started cooking',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    description: 'Who changed the status',
    example: 'Kitchen Staff',
  })
  @IsOptional()
  @IsString()
  changedBy?: string;
}