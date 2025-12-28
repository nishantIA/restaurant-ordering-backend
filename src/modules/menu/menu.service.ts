import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { MenuRepository } from './menu.repository';
import { GetMenuItemsDto } from './dto/get-menu-items.dto';
import { GetCategoriesDto } from './dto/get-categories.dto';
import { RedisService } from '../../shared/redis/redis.service';
import { createPaginatedResponse, createSuccessResponse, calculatePaginationMetadata } from '../../shared/dto/api-response.dto';

@Injectable()
export class MenuService {
  private readonly logger = new Logger(MenuService.name);
  private readonly CACHE_TTL = 300; // 5 minutes
  private readonly CACHE_PREFIX = {
    CATEGORIES: 'menu:categories',
    ITEMS: 'menu:items',
    ITEM_DETAIL: 'menu:item',
  };

  constructor(
    private readonly repository: MenuRepository,
    private readonly redis: RedisService,
  ) {}

  /**
   * Get all categories with caching
   */
  async getCategories(dto: GetCategoriesDto) {
    const cacheKey = `${this.CACHE_PREFIX.CATEGORIES}:${JSON.stringify(dto)}`;

    try {
      // Try cache first
      const cached = await this.redis.get(cacheKey);
      if (cached) {
        this.logger.debug(`Cache hit for categories: ${cacheKey}`);
        return createSuccessResponse(cached);
      }
    } catch (error) {
      this.logger.warn('Redis cache read failed, continuing without cache', error);
    }

    // Fetch from database
    const categories = await this.repository.findCategories(dto);

    // Cache the result
    try {
      await this.redis.set(cacheKey, categories, this.CACHE_TTL);
    } catch (error) {
      this.logger.warn('Redis cache write failed, continuing without cache', error);
    }

    return createSuccessResponse(categories);
  }

  /**
   * Get single category by ID or slug
   */
  async getCategoryByIdOrSlug(idOrSlug: string) {
    const cacheKey = `${this.CACHE_PREFIX.CATEGORIES}:${idOrSlug}`;

    try {
      const cached = await this.redis.get(cacheKey);
      if (cached) {
        this.logger.debug(`Cache hit for category: ${cacheKey}`);
        return createSuccessResponse(cached);
      }
    } catch (error) {
      this.logger.warn('Redis cache read failed, continuing without cache', error);
    }

    const category = await this.repository.findCategoryByIdOrSlug(idOrSlug);

    if (!category) {
      throw new NotFoundException(`Category with ID or slug '${idOrSlug}' not found`);
    }

    try {
      await this.redis.set(cacheKey, category, this.CACHE_TTL);
    } catch (error) {
      this.logger.warn('Redis cache write failed, continuing without cache', error);
    }

    return createSuccessResponse({
      ...category,
      itemCount: category.menuItems?.length || 0,
      menuItems: undefined,
    });
  }

  /**
   * Get menu items with filtering, search, and pagination
   */
  async getMenuItems(dto: GetMenuItemsDto) {
    const cacheKey = `${this.CACHE_PREFIX.ITEMS}:${JSON.stringify(dto)}`;

    try {
      const cached = await this.redis.get(cacheKey);
      if (cached) {
        this.logger.debug(`Cache hit for menu items: ${cacheKey}`);
        return cached;
      }
    } catch (error) {
      this.logger.warn('Redis cache read failed, continuing without cache', error);
    }

    // Fetch from database
    const { items, total } = await this.repository.findMenuItems(dto);

    // Transform items to response format
    const transformedItems = items.map((item) => this.transformMenuItem(item, false));

    // Create paginated response
    const response = createPaginatedResponse(
      transformedItems,
      calculatePaginationMetadata(dto.page, dto.limit, total),
    );

    // Cache the result
    try {
      await this.redis.set(cacheKey, response, this.CACHE_TTL);
    } catch (error) {
      this.logger.warn('Redis cache write failed, continuing without cache', error);
    }

    return response;
  }

  /**
   * Get single menu item by ID or slug with full customization details
   */
  async getMenuItemByIdOrSlug(idOrSlug: string) {
    const cacheKey = `${this.CACHE_PREFIX.ITEM_DETAIL}:${idOrSlug}`;

    try {
      const cached = await this.redis.get(cacheKey);
      if (cached) {
        this.logger.debug(`Cache hit for menu item: ${cacheKey}`);
        return createSuccessResponse(cached);
      }
    } catch (error) {
      this.logger.warn('Redis cache read failed, continuing without cache', error);
    }

    const item = await this.repository.findMenuItemByIdOrSlug(idOrSlug);

    if (!item) {
      throw new NotFoundException(`Menu item with ID or slug '${idOrSlug}' not found`);
    }

    const transformed = this.transformMenuItem(item, true);

    try {
      await this.redis.set(cacheKey, transformed, this.CACHE_TTL);
    } catch (error) {
      this.logger.warn('Redis cache write failed, continuing without cache', error);
    }

    return createSuccessResponse(transformed);
  }

  /**
   * Transform menu item to response DTO
   */
  private transformMenuItem(item: any, includeFullCustomizations = false) {
    const base = {
      id: item.id,
      name: item.name,
      slug: item.slug,
      description: item.description,
      imageUrl: item.imageUrl,
      basePrice: Number(item.basePrice),
      quantityType: item.quantityType,
      unit: item.unit,
      minQuantity: Number(item.minQuantity),
      maxQuantity: item.maxQuantity ? Number(item.maxQuantity) : null,
      stepQuantity: Number(item.stepQuantity),
      isAvailable: item.isAvailable,
      availableQuantity: item.availableQuantity ? Number(item.availableQuantity) : null,
      prepTime: item.prepTime,
      dietaryTags: item.dietaryTags || [],
      allergens: item.allergens || [],
      customizationType: item.customizationType,
      category: {
        id: item.category.id,
        name: item.category.name,
        slug: item.category.slug,
        description: item.category.description,
        imageUrl: item.category.imageUrl,
        displayOrder: item.category.displayOrder,
        isActive: item.category.isActive,
      },
      taxes: item.taxes?.map((mt: any) => ({
        id: mt.tax.id,
        name: mt.tax.name,
        type: mt.tax.type,
        value: Number(mt.tax.value),
        isInclusive: mt.tax.isInclusive,
      })) || [],
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };

    // Add customizations based on type
    if (item.customizationType === 'SIMPLE' && includeFullCustomizations) {
      return {
        ...base,
        simpleCustomizations: item.customizations?.map((mc: any) => ({
          id: mc.customization.id,
          name: mc.customization.name,
          type: mc.customization.type,
          price: Number(mc.customization.price),
          isActive: mc.customization.isActive,
          isRequired: mc.isRequired,
          minSelections: mc.minSelections,
          maxSelections: mc.maxSelections,
        })) || [],
      };
    }

    if (item.customizationType === 'COMPLEX_DAG' && includeFullCustomizations) {
      const tree = this.repository.buildCustomizationTree(item.customizationNodes || []);
      return {
        ...base,
        dagCustomizations: tree,
      };
    }

    return base;
  }

  /**
   * Clear cache (useful for admin operations)
   */
  async clearCache() {
    try {
      await this.redis.deletePattern('menu:*');
      this.logger.log('Menu cache cleared successfully');
    } catch (error) {
      this.logger.error('Failed to clear menu cache', error);
    }
  }
}