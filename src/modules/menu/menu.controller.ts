import { Controller, Get, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { MenuService } from './menu.service';
import { GetMenuItemsDto } from './dto/get-menu-items.dto';
import { GetCategoriesDto } from './dto/get-categories.dto';
import { MenuItemDto, CategoryDto } from './dto/menu-response.dto';

@ApiTags('Menu')
@Controller({
  path: 'menu',
  version: '1',
})
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get('categories')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all menu categories',
    description: 'Retrieve all categories with optional hierarchy and item counts',
  })
  @ApiResponse({
    status: 200,
    description: 'Categories retrieved successfully',
    type: [CategoryDto],
  })
  async getCategories(@Query() dto: GetCategoriesDto) {
    return this.menuService.getCategories(dto);
  }

  @Get('categories/:idOrSlug')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get category by ID or slug',
    description: 'Retrieve a single category with details',
  })
  @ApiParam({
    name: 'idOrSlug',
    description: 'Category ID (UUID) or slug',
    example: 'main-course',
  })
  @ApiResponse({
    status: 200,
    description: 'Category retrieved successfully',
    type: CategoryDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found',
  })
  async getCategoryByIdOrSlug(@Param('idOrSlug') idOrSlug: string) {
    return this.menuService.getCategoryByIdOrSlug(idOrSlug);
  }

  @Get('items')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all menu items',
    description: 'Retrieve menu items with filtering, search, and pagination. Supports fuzzy search on item names.',
  })
  @ApiResponse({
    status: 200,
    description: 'Menu items retrieved successfully',
    type: [MenuItemDto],
  })
  async getMenuItems(@Query() dto: GetMenuItemsDto) {
    return this.menuService.getMenuItems(dto);
  }

  @Get('items/:idOrSlug')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get menu item by ID or slug',
    description: 'Retrieve a single menu item with full customization details',
  })
  @ApiParam({
    name: 'idOrSlug',
    description: 'Menu item ID (UUID) or slug',
    example: 'margherita-pizza',
  })
  @ApiResponse({
    status: 200,
    description: 'Menu item retrieved successfully',
    type: MenuItemDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Menu item not found',
  })
  async getMenuItemByIdOrSlug(@Param('idOrSlug') idOrSlug: string) {
    return this.menuService.getMenuItemByIdOrSlug(idOrSlug);
  }
}