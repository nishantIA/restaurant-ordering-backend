import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/database/prisma.service';
import { GetMenuItemsDto } from './dto/get-menu-items.dto';
import { GetCategoriesDto } from './dto/get-categories.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class MenuRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get all categories with optional hierarchy and item counts
   */
  async findCategories(dto: GetCategoriesDto) {
    const where: Prisma.CategoryWhereInput = {
      ...(dto.onlyActive && { isActive: true }),
      parentCategoryId: null, // Only root categories
    };

    const categories = await this.prisma.category.findMany({
      where,
      orderBy: { displayOrder: 'asc' },
      include: {
        ...(dto.includeChildren && {
          childCategories: {
            where: dto.onlyActive ? { isActive: true } : {},
            orderBy: { displayOrder: 'asc' },
          },
        }),
        ...(dto.includeItemCount && {
          menuItems: {
            where: { isAvailable: true },
            select: { id: true },
          },
        }),
      },
    });

    // Add item count if requested
    if (dto.includeItemCount) {
      return categories.map((category) => ({
        ...category,
        itemCount: category.menuItems?.length || 0,
        menuItems: undefined, // Remove the items array, keep only count
        ...(dto.includeChildren && {
          childCategories: category.childCategories?.map((child: any) => ({
            ...child,
            itemCount: 0, // Could be enhanced to count child items
          })),
        }),
      }));
    }

    return categories;
  }

  /**
   * Get single category by ID or slug
   */
  async findCategoryByIdOrSlug(idOrSlug: string) {
    // Check if it's a valid UUID format
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
    
    return this.prisma.category.findFirst({
      where: isUUID 
        ? { id: idOrSlug }  // Search by ID if UUID
        : { slug: idOrSlug },  // Search by slug otherwise
      include: {
        childCategories: {
          where: { isActive: true },
          orderBy: { displayOrder: 'asc' },
        },
        menuItems: {
          where: { isAvailable: true },
          select: { id: true },
        },
      },
    });
  }

  /**
   * Get menu items with advanced filtering and search
   */
  async findMenuItems(dto: GetMenuItemsDto) {
    const where: Prisma.MenuItemWhereInput = {
      ...(dto.categoryId && { categoryId: dto.categoryId }),
      ...(!dto.includeUnavailable && { isAvailable: true }),
      ...(dto.minPrice !== undefined && {
        basePrice: { gte: dto.minPrice },
      }),
      ...(dto.maxPrice !== undefined && {
        basePrice: { lte: dto.maxPrice },
      }),
      ...(dto.dietaryTags?.length && {
        dietaryTags: {
          hasSome: dto.dietaryTags,
        },
      }),
    };

    // Fuzzy search using pg_trgm (with fallback to ILIKE)
    if (dto.search) {
        
      try {
        // Use SIMILARITY() with threshold 0.1 for fuzzy matching
        const items = await this.prisma.$queryRaw<any[]>`
          SELECT 
            mi.*,
            SIMILARITY(mi.name, ${dto.search}) as similarity
          FROM menu_items mi
          WHERE 
            SIMILARITY(mi.name, ${dto.search}) > 0.1
            ${dto.categoryId ? Prisma.sql`AND mi."categoryId" = ${dto.categoryId}::uuid` : Prisma.empty}
            ${!dto.includeUnavailable ? Prisma.sql`AND mi."isAvailable" = true` : Prisma.empty}
            ${dto.minPrice !== undefined ? Prisma.sql`AND mi."basePrice" >= ${dto.minPrice}` : Prisma.empty}
            ${dto.maxPrice !== undefined ? Prisma.sql`AND mi."basePrice" <= ${dto.maxPrice}` : Prisma.empty}
          ORDER BY similarity DESC, mi."${Prisma.raw(dto.sortBy)}" ${Prisma.raw(dto.sortOrder.toUpperCase())}
          LIMIT ${dto.take}
          OFFSET ${dto.skip}
        `;

        // Get total count for fuzzy search
        const countResult = await this.prisma.$queryRaw<[{ count: bigint }]>`
          SELECT COUNT(*) as count
          FROM menu_items mi
          WHERE 
            SIMILARITY(mi.name, ${dto.search}) > 0.1
            ${dto.categoryId ? Prisma.sql`AND mi."categoryId" = ${dto.categoryId}::uuid` : Prisma.empty}
            ${!dto.includeUnavailable ? Prisma.sql`AND mi."isAvailable" = true` : Prisma.empty}
        `;

        const total = Number(countResult[0].count);

        // Get full item details with relations
        const itemIds = items.map((item) => item.id);
        
        if (itemIds.length === 0) {
          return { items: [], total: 0 };
        }

        const fullItems = await this.prisma.menuItem.findMany({
          where: { id: { in: itemIds } },
          include: this.getMenuItemIncludes(),
        });

        // Preserve fuzzy search order
        const orderedItems = itemIds.map((id) =>
          fullItems.find((item) => item.id === id),
        );

        return { items: orderedItems, total };
      } catch (error) {
        // Fallback to ILIKE search if pg_trgm is not available
        
        const searchWhere = {
          ...where,
          name: {
            contains: dto.search,
            mode: 'insensitive' as const,
          },
        };

        const [items, total] = await Promise.all([
          this.prisma.menuItem.findMany({
            where: searchWhere,
            include: this.getMenuItemIncludes(),
            orderBy: { [dto.sortBy]: dto.sortOrder },
            skip: dto.skip,
            take: dto.take,
          }),
          this.prisma.menuItem.count({ where: searchWhere }),
        ]);

        return { items, total };
      }
    }

    // Regular query without search
    const [items, total] = await Promise.all([
      this.prisma.menuItem.findMany({
        where,
        include: this.getMenuItemIncludes(),
        orderBy: { [dto.sortBy]: dto.sortOrder },
        skip: dto.skip,
        take: dto.take,
      }),
      this.prisma.menuItem.count({ where }),
    ]);

    return { items, total };
  }

  /**
   * Get single menu item by ID or slug with full details
   */
  async findMenuItemByIdOrSlug(idOrSlug: string) {
    // Check if it's a valid UUID format
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
    
    return this.prisma.menuItem.findFirst({
      where: isUUID 
        ? { id: idOrSlug }  // Search by ID if UUID
        : { slug: idOrSlug },  // Search by slug otherwise
      include: this.getMenuItemIncludes(true), // Include full customization tree
    });
  }

  /**
   * Helper: Get menu item includes for queries
   */
  private getMenuItemIncludes(includeFullTree = false) {
    return {
      category: true,
      taxes: {
        include: {
          tax: true,
        },
        orderBy: {
          applyOrder: 'asc' as const,
        },
      },
      customizations: {
        where: { customization: { isActive: true } },
        include: {
          customization: true,
        },
        orderBy: {
          displayOrder: 'asc' as const,
        },
      },
      ...(includeFullTree && {
        customizationNodes: {
          where: { isActive: true },
          include: {
            parentEdges: {
              include: {
                parentNode: true,
              },
              orderBy: {
                displayOrder: 'asc' as const,
              },
            },
            childEdges: {
              include: {
                childNode: true,
              },
              orderBy: {
                displayOrder: 'asc' as const,
              },
            },
          },
          orderBy: {
            displayOrder: 'asc' as const,
          },
        },
      }),
    };
  }

  /**
   * Build DAG tree from flat customization nodes
   */
  buildCustomizationTree(nodes: any[]): any[] {
    if (!nodes || nodes.length === 0) return [];

    // Find root nodes (nodes with no parent edges)
    const rootNodes = nodes.filter(
      (node) => !node.parentEdges || node.parentEdges.length === 0,
    );

    const buildNode = (node: any): any => {
      const children =
        node.childEdges?.map((edge: any) => {
          const childNode = nodes.find((n) => n.id === edge.childNodeId);
          return {
            ...buildNode(childNode),
            constraints: edge.constraints,
          };
        }) || [];

      return {
        id: node.id,
        type: node.type,
        name: node.name,
        description: node.description,
        price: node.price,
        displayOrder: node.displayOrder,
        data: node.data,
        ...(children.length > 0 && { children }),
      };
    };

    return rootNodes.map(buildNode);
  }
}