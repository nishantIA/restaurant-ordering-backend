import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// Simple Customization Response
export class SimpleCustomizationDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'Large' })
  name: string;

  @ApiProperty({ example: 'SIZE', enum: ['SIZE', 'ADDON', 'MODIFIER', 'OPTION'] })
  type: string;

  @ApiProperty({ example: 2.5 })
  price: number;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: false })
  isRequired: boolean;

  @ApiProperty({ example: 0 })
  minSelections: number;

  @ApiProperty({ example: 1 })
  maxSelections: number;
}

// DAG Customization Node Response
export class CustomizationNodeDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'GROUP', enum: ['GROUP', 'OPTION', 'MODIFIER'] })
  type: string;

  @ApiProperty({ example: 'Choose your protein' })
  name: string;

  @ApiPropertyOptional({ example: 'Select one protein option' })
  description?: string;

  @ApiProperty({ example: 0 })
  price: number;

  @ApiProperty({ example: 0 })
  displayOrder: number;

  @ApiPropertyOptional()
  data?: any;

  @ApiPropertyOptional({ type: [Object] })
  children?: CustomizationNodeDto[];

  @ApiPropertyOptional()
  constraints?: {
    min?: number;
    max?: number;
    required?: boolean;
    default?: string;
  };
}

// Category Response
export class CategoryDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'Main Course' })
  name: string;

  @ApiProperty({ example: 'main-course' })
  slug: string;

  @ApiPropertyOptional({ example: 'Delicious main course items' })
  description?: string;

  @ApiPropertyOptional({ example: 'https://example.com/category.jpg' })
  imageUrl?: string;

  @ApiProperty({ example: 1 })
  displayOrder: number;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiPropertyOptional({ example: 15 })
  itemCount?: number;

  @ApiPropertyOptional({ type: [CategoryDto] })
  children?: CategoryDto[];
}

// Tax Response
export class TaxDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'Sales Tax' })
  name: string;

  @ApiProperty({ example: 'PERCENTAGE', enum: ['PERCENTAGE', 'FIXED'] })
  type: string;

  @ApiProperty({ example: 18.0 })
  value: number;

  @ApiProperty({ example: false })
  isInclusive: boolean;
}

// Menu Item Response
export class MenuItemDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'Margherita Pizza' })
  name: string;

  @ApiProperty({ example: 'margherita-pizza' })
  slug: string;

  @ApiPropertyOptional({ example: 'Classic pizza with tomato and mozzarella' })
  description?: string;

  @ApiPropertyOptional({ example: 'https://example.com/pizza.jpg' })
  imageUrl?: string;

  @ApiProperty({ example: 12.99 })
  basePrice: number;

  @ApiProperty({ example: 'UNIT', enum: ['UNIT', 'WEIGHT', 'VOLUME', 'SERVING'] })
  quantityType: string;

  @ApiPropertyOptional({ example: 'piece' })
  unit?: string;

  @ApiProperty({ example: 1 })
  minQuantity: number;

  @ApiPropertyOptional({ example: 10 })
  maxQuantity?: number;

  @ApiProperty({ example: 1 })
  stepQuantity: number;

  @ApiProperty({ example: true })
  isAvailable: boolean;

  @ApiPropertyOptional({ example: 50 })
  availableQuantity?: number;

  @ApiPropertyOptional({ example: 15 })
  prepTime?: number;

  @ApiProperty({ example: ['vegetarian'], type: [String] })
  dietaryTags: string[];

  @ApiProperty({ example: ['dairy'], type: [String] })
  allergens: string[];

  @ApiProperty({ example: 'SIMPLE', enum: ['NONE', 'SIMPLE', 'COMPLEX_DAG'] })
  customizationType: string;

  @ApiProperty({ type: CategoryDto })
  category: CategoryDto;

  @ApiProperty({ type: [TaxDto] })
  taxes: TaxDto[];

  @ApiPropertyOptional({ type: [SimpleCustomizationDto] })
  simpleCustomizations?: SimpleCustomizationDto[];

  @ApiPropertyOptional({ type: [CustomizationNodeDto] })
  dagCustomizations?: CustomizationNodeDto[];

  @ApiProperty({ example: '2024-12-28T10:30:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-12-28T10:30:00.000Z' })
  updatedAt: Date;
}