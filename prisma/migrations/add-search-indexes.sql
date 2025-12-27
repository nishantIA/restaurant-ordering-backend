-- ============================================================================
-- SEARCH INDEXES FOR RESTAURANT ORDERING SYSTEM
-- Run after: npx prisma migrate dev
-- ============================================================================

-- Enable fuzzy search extension
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ============================================================================
-- MENU ITEMS - Search & Filter Performance
-- ============================================================================

-- Fuzzy name search: "piza" → finds "pizza"
CREATE INDEX IF NOT EXISTS idx_menu_items_name_trgm 
ON menu_items USING GIN (name gin_trgm_ops);

-- Fuzzy description search
CREATE INDEX IF NOT EXISTS idx_menu_items_description_trgm 
ON menu_items USING GIN (description gin_trgm_ops);

-- Full-text search (name + description)
CREATE INDEX IF NOT EXISTS idx_menu_items_name_fts 
ON menu_items USING GIN (to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- Fast category + availability + price filtering
CREATE INDEX IF NOT EXISTS idx_menu_items_filters 
ON menu_items ("categoryId", "isAvailable", "basePrice") 
WHERE "isAvailable" = true;

-- Price range queries
CREATE INDEX IF NOT EXISTS idx_menu_items_price 
ON menu_items ("basePrice") 
WHERE "isAvailable" = true;

-- Slug lookups (e.g., /menu/margherita-pizza)
CREATE INDEX IF NOT EXISTS idx_menu_items_slug 
ON menu_items (slug) 
WHERE "isAvailable" = true;

-- ============================================================================
-- CATEGORIES - Navigation
-- ============================================================================

-- Category URL lookups
CREATE INDEX IF NOT EXISTS idx_categories_slug 
ON categories (slug) 
WHERE "isActive" = true;

-- Hierarchical category queries (parent → children)
CREATE INDEX IF NOT EXISTS idx_categories_parent 
ON categories ("parentCategoryId") 
WHERE "isActive" = true;

-- Sorted category display
CREATE INDEX IF NOT EXISTS idx_categories_display_order 
ON categories ("displayOrder") 
WHERE "isActive" = true;

-- ============================================================================
-- ORDERS - Customer & Kitchen Queries
-- ============================================================================

-- Customer's order history
CREATE INDEX IF NOT EXISTS idx_orders_session_status 
ON orders ("sessionId", status);

-- Recent orders (newest first)
CREATE INDEX IF NOT EXISTS idx_orders_created 
ON orders ("createdAt" DESC);

-- Kitchen dashboard (active orders only)
CREATE INDEX IF NOT EXISTS idx_orders_status_created 
ON orders (status, "createdAt" DESC) 
WHERE status IN ('RECEIVED', 'PREPARING', 'READY');

-- ============================================================================
-- ORDER ITEMS - Order Details
-- ============================================================================

-- Fetch items for an order
CREATE INDEX IF NOT EXISTS idx_order_items_order 
ON order_items ("orderId");

-- Menu item analytics (popular items)
CREATE INDEX IF NOT EXISTS idx_order_items_menu_item 
ON order_items ("menuItemId");

-- ============================================================================
-- ORDER STATUS HISTORY - Tracking
-- ============================================================================

-- Order timeline
CREATE INDEX IF NOT EXISTS idx_order_status_history_order_created 
ON order_status_history ("orderId", "createdAt" DESC);

-- Recent status changes
CREATE INDEX IF NOT EXISTS idx_order_status_history_created 
ON order_status_history ("createdAt" DESC);

-- ============================================================================
-- CUSTOMIZATION NODES - DAG Performance
-- ============================================================================

-- Fetch customization tree for a menu item
CREATE INDEX IF NOT EXISTS idx_customization_nodes_menu_item 
ON customization_nodes ("menuItemId") 
WHERE "isActive" = true;

-- Render customization UI in order
CREATE INDEX IF NOT EXISTS idx_customization_nodes_type_order 
ON customization_nodes ("menuItemId", type, "displayOrder") 
WHERE "isActive" = true;

-- ============================================================================
-- ANALYTICS (Optional)
-- ============================================================================

-- Popular items report
CREATE INDEX IF NOT EXISTS idx_order_items_analytics 
ON order_items ("menuItemId", "createdAt" DESC);
