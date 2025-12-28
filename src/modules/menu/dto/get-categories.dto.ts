import { IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetCategoriesDto {
  @ApiPropertyOptional({
    description: 'Include child categories in hierarchy',
    example: true,
    default: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  includeChildren?: boolean = false;

  @ApiPropertyOptional({
    description: 'Include item count for each category',
    example: true,
    default: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  includeItemCount?: boolean = true;

  @ApiPropertyOptional({
    description: 'Include only active categories',
    example: true,
    default: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  onlyActive?: boolean = true;
}