/*
  Warnings:

  - The primary key for the `categories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `display_order` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `categories` table. All the data in the column will be lost.
  - The `id` column on the `categories` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `name` on the `categories` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - The primary key for the `menu_items` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `base_price` on the `menu_items` table. All the data in the column will be lost.
  - You are about to drop the column `category_id` on the `menu_items` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `menu_items` table. All the data in the column will be lost.
  - You are about to drop the column `dietary_tags` on the `menu_items` table. All the data in the column will be lost.
  - You are about to drop the column `image_url` on the `menu_items` table. All the data in the column will be lost.
  - You are about to drop the column `is_available` on the `menu_items` table. All the data in the column will be lost.
  - You are about to drop the column `preparation_time` on the `menu_items` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `menu_items` table. All the data in the column will be lost.
  - The `id` column on the `menu_items` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `name` on the `menu_items` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(200)`.
  - The primary key for the `order_items` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `base_price` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `customizations` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `item_total` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `menu_item_id` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `menu_item_name` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `order_id` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `special_instructions` on the `order_items` table. All the data in the column will be lost.
  - The `id` column on the `order_items` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `quantity` on the `order_items` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,3)`.
  - The primary key for the `order_status_history` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `changed_by` on the `order_status_history` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `order_status_history` table. All the data in the column will be lost.
  - You are about to drop the column `order_id` on the `order_status_history` table. All the data in the column will be lost.
  - The `id` column on the `order_status_history` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `orders` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `customer_email` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `customer_name` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `customer_phone` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `payment_method` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `payment_status` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `session_id` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `special_instructions` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `tax` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `orders` table. All the data in the column will be lost.
  - The `id` column on the `orders` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `orders` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `payments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `order_id` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `payment_method` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `transaction_id` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `payments` table. All the data in the column will be lost.
  - The `id` column on the `payments` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `payments` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[slug]` on the table `categories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `menu_items` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[orderNumber]` on the table `orders` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[orderId]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[transactionId]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `basePrice` to the `menu_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `menu_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `menu_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `menu_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itemBasePrice` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itemName` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itemSubtotal` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itemTotal` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `menuItemId` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderId` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantityType` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderId` to the `order_status_history` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `order_status_history` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `orderNumber` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sessionId` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalAmount` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderId` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentMethod` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "QuantityType" AS ENUM ('UNIT', 'WEIGHT', 'VOLUME', 'SERVING');

-- CreateEnum
CREATE TYPE "CustomizationType" AS ENUM ('NONE', 'SIMPLE', 'COMPLEX_DAG');

-- CreateEnum
CREATE TYPE "SimpleCustomizationType" AS ENUM ('SIZE', 'ADDON', 'MODIFIER', 'OPTION');

-- CreateEnum
CREATE TYPE "TaxType" AS ENUM ('PERCENTAGE', 'FIXED');

-- CreateEnum
CREATE TYPE "NodeType" AS ENUM ('GROUP', 'OPTION', 'MODIFIER');

-- CreateEnum
CREATE TYPE "EdgeType" AS ENUM ('HAS_OPTION', 'REQUIRES', 'EXCLUDES');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('RECEIVED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED');

-- DropForeignKey
ALTER TABLE "menu_items" DROP CONSTRAINT "menu_items_category_id_fkey";

-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_menu_item_id_fkey";

-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_order_id_fkey";

-- DropForeignKey
ALTER TABLE "order_status_history" DROP CONSTRAINT "order_status_history_order_id_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_order_id_fkey";

-- DropIndex
DROP INDEX "menu_items_category_id_idx";

-- DropIndex
DROP INDEX "menu_items_is_available_idx";

-- DropIndex
DROP INDEX "order_items_order_id_idx";

-- DropIndex
DROP INDEX "order_status_history_order_id_created_at_idx";

-- DropIndex
DROP INDEX "orders_created_at_idx";

-- DropIndex
DROP INDEX "orders_session_id_idx";

-- DropIndex
DROP INDEX "payments_order_id_idx";

-- AlterTable
ALTER TABLE "categories" DROP CONSTRAINT "categories_pkey",
DROP COLUMN "created_at",
DROP COLUMN "display_order",
DROP COLUMN "is_active",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "displayOrder" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "imageUrl" VARCHAR(500),
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "parentCategoryId" UUID,
ADD COLUMN     "slug" VARCHAR(100) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ALTER COLUMN "name" SET DATA TYPE VARCHAR(100),
ADD CONSTRAINT "categories_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "menu_items" DROP CONSTRAINT "menu_items_pkey",
DROP COLUMN "base_price",
DROP COLUMN "category_id",
DROP COLUMN "created_at",
DROP COLUMN "dietary_tags",
DROP COLUMN "image_url",
DROP COLUMN "is_available",
DROP COLUMN "preparation_time",
DROP COLUMN "updated_at",
ADD COLUMN     "allergens" TEXT[],
ADD COLUMN     "availableQuantity" DECIMAL(10,3),
ADD COLUMN     "basePrice" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "categoryId" UUID NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "customizationType" "CustomizationType" NOT NULL DEFAULT 'NONE',
ADD COLUMN     "dietaryTags" TEXT[],
ADD COLUMN     "imageUrl" VARCHAR(500),
ADD COLUMN     "isAvailable" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "maxQuantity" DECIMAL(10,3),
ADD COLUMN     "minQuantity" DECIMAL(10,3) NOT NULL DEFAULT 1.000,
ADD COLUMN     "prepTime" INTEGER,
ADD COLUMN     "quantityType" "QuantityType" NOT NULL DEFAULT 'UNIT',
ADD COLUMN     "slug" VARCHAR(200) NOT NULL,
ADD COLUMN     "stepQuantity" DECIMAL(10,3) NOT NULL DEFAULT 1.000,
ADD COLUMN     "unit" VARCHAR(20),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ALTER COLUMN "name" SET DATA TYPE VARCHAR(200),
ADD CONSTRAINT "menu_items_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_pkey",
DROP COLUMN "base_price",
DROP COLUMN "created_at",
DROP COLUMN "customizations",
DROP COLUMN "item_total",
DROP COLUMN "menu_item_id",
DROP COLUMN "menu_item_name",
DROP COLUMN "order_id",
DROP COLUMN "special_instructions",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "customizationTotal" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
ADD COLUMN     "itemBasePrice" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "itemName" VARCHAR(200) NOT NULL,
ADD COLUMN     "itemSubtotal" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "itemTaxAmount" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
ADD COLUMN     "itemTotal" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "menuItemId" UUID NOT NULL,
ADD COLUMN     "orderId" UUID NOT NULL,
ADD COLUMN     "prepTime" INTEGER,
ADD COLUMN     "quantityType" "QuantityType" NOT NULL,
ADD COLUMN     "specialInstructions" TEXT,
ADD COLUMN     "unit" VARCHAR(20),
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ALTER COLUMN "quantity" SET DATA TYPE DECIMAL(10,3),
ADD CONSTRAINT "order_items_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "order_status_history" DROP CONSTRAINT "order_status_history_pkey",
DROP COLUMN "changed_by",
DROP COLUMN "created_at",
DROP COLUMN "order_id",
ADD COLUMN     "changedBy" VARCHAR(100),
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "orderId" UUID NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
DROP COLUMN "status",
ADD COLUMN     "status" "OrderStatus" NOT NULL,
ADD CONSTRAINT "order_status_history_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "orders" DROP CONSTRAINT "orders_pkey",
DROP COLUMN "created_at",
DROP COLUMN "customer_email",
DROP COLUMN "customer_name",
DROP COLUMN "customer_phone",
DROP COLUMN "payment_method",
DROP COLUMN "payment_status",
DROP COLUMN "session_id",
DROP COLUMN "special_instructions",
DROP COLUMN "tax",
DROP COLUMN "total",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "estimatedPrepTime" INTEGER,
ADD COLUMN     "orderNumber" VARCHAR(50) NOT NULL,
ADD COLUMN     "sessionId" VARCHAR(255) NOT NULL,
ADD COLUMN     "specialInstructions" TEXT,
ADD COLUMN     "taxAmount" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
ADD COLUMN     "totalAmount" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
DROP COLUMN "status",
ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'RECEIVED',
ADD CONSTRAINT "orders_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "payments" DROP CONSTRAINT "payments_pkey",
DROP COLUMN "created_at",
DROP COLUMN "metadata",
DROP COLUMN "order_id",
DROP COLUMN "payment_method",
DROP COLUMN "transaction_id",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "gatewayResponse" JSONB,
ADD COLUMN     "orderId" UUID NOT NULL,
ADD COLUMN     "paymentMethod" VARCHAR(50) NOT NULL,
ADD COLUMN     "transactionId" VARCHAR(100),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
DROP COLUMN "status",
ADD COLUMN     "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
ADD CONSTRAINT "payments_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "taxes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL,
    "type" "TaxType" NOT NULL,
    "value" DECIMAL(10,4) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isInclusive" BOOLEAN NOT NULL DEFAULT false,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "taxes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menu_item_taxes" (
    "menuItemId" UUID NOT NULL,
    "taxId" UUID NOT NULL,
    "applyOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "menu_item_taxes_pkey" PRIMARY KEY ("menuItemId","taxId")
);

-- CreateTable
CREATE TABLE "customizations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL,
    "type" "SimpleCustomizationType" NOT NULL,
    "price" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menu_item_customizations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "menuItemId" UUID NOT NULL,
    "customizationId" UUID NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "minSelections" INTEGER NOT NULL DEFAULT 0,
    "maxSelections" INTEGER NOT NULL DEFAULT 1,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "menu_item_customizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customization_nodes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "menuItemId" UUID NOT NULL,
    "type" "NodeType" NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "data" JSONB,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customization_nodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customization_edges" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "parentNodeId" UUID NOT NULL,
    "childNodeId" UUID NOT NULL,
    "edgeType" "EdgeType" NOT NULL DEFAULT 'HAS_OPTION',
    "constraints" JSONB,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customization_edges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_item_customizations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "orderItemId" UUID NOT NULL,
    "customizationName" VARCHAR(100) NOT NULL,
    "customizationType" VARCHAR(20) NOT NULL,
    "customizationPrice" DECIMAL(10,2) NOT NULL,
    "customizationNodeId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_item_customizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_taxes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "orderId" UUID NOT NULL,
    "taxId" UUID NOT NULL,
    "taxName" VARCHAR(100) NOT NULL,
    "taxType" "TaxType" NOT NULL,
    "taxValue" DECIMAL(10,4) NOT NULL,
    "calculatedAmount" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_taxes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "taxes_isActive_idx" ON "taxes"("isActive");

-- CreateIndex
CREATE INDEX "menu_item_taxes_menuItemId_idx" ON "menu_item_taxes"("menuItemId");

-- CreateIndex
CREATE INDEX "customizations_type_idx" ON "customizations"("type");

-- CreateIndex
CREATE INDEX "customizations_isActive_idx" ON "customizations"("isActive");

-- CreateIndex
CREATE INDEX "menu_item_customizations_menuItemId_idx" ON "menu_item_customizations"("menuItemId");

-- CreateIndex
CREATE UNIQUE INDEX "menu_item_customizations_menuItemId_customizationId_key" ON "menu_item_customizations"("menuItemId", "customizationId");

-- CreateIndex
CREATE INDEX "customization_nodes_menuItemId_idx" ON "customization_nodes"("menuItemId");

-- CreateIndex
CREATE INDEX "customization_nodes_type_idx" ON "customization_nodes"("type");

-- CreateIndex
CREATE INDEX "customization_nodes_isActive_idx" ON "customization_nodes"("isActive");

-- CreateIndex
CREATE INDEX "customization_edges_parentNodeId_idx" ON "customization_edges"("parentNodeId");

-- CreateIndex
CREATE INDEX "customization_edges_childNodeId_idx" ON "customization_edges"("childNodeId");

-- CreateIndex
CREATE UNIQUE INDEX "customization_edges_parentNodeId_childNodeId_key" ON "customization_edges"("parentNodeId", "childNodeId");

-- CreateIndex
CREATE INDEX "order_item_customizations_orderItemId_idx" ON "order_item_customizations"("orderItemId");

-- CreateIndex
CREATE INDEX "order_taxes_orderId_idx" ON "order_taxes"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE INDEX "categories_parentCategoryId_idx" ON "categories"("parentCategoryId");

-- CreateIndex
CREATE INDEX "categories_isActive_idx" ON "categories"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "menu_items_slug_key" ON "menu_items"("slug");

-- CreateIndex
CREATE INDEX "menu_items_categoryId_idx" ON "menu_items"("categoryId");

-- CreateIndex
CREATE INDEX "menu_items_isAvailable_idx" ON "menu_items"("isAvailable");

-- CreateIndex
CREATE INDEX "menu_items_basePrice_idx" ON "menu_items"("basePrice");

-- CreateIndex
CREATE INDEX "menu_items_slug_idx" ON "menu_items"("slug");

-- CreateIndex
CREATE INDEX "menu_items_categoryId_isAvailable_basePrice_idx" ON "menu_items"("categoryId", "isAvailable", "basePrice");

-- CreateIndex
CREATE INDEX "menu_items_dietaryTags_idx" ON "menu_items" USING GIN ("dietaryTags");

-- CreateIndex
CREATE INDEX "menu_items_allergens_idx" ON "menu_items" USING GIN ("allergens");

-- CreateIndex
CREATE INDEX "order_items_orderId_idx" ON "order_items"("orderId");

-- CreateIndex
CREATE INDEX "order_status_history_orderId_idx" ON "order_status_history"("orderId");

-- CreateIndex
CREATE INDEX "order_status_history_createdAt_idx" ON "order_status_history"("createdAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "orders_orderNumber_key" ON "orders"("orderNumber");

-- CreateIndex
CREATE INDEX "orders_sessionId_idx" ON "orders"("sessionId");

-- CreateIndex
CREATE INDEX "orders_status_idx" ON "orders"("status");

-- CreateIndex
CREATE INDEX "orders_orderNumber_idx" ON "orders"("orderNumber");

-- CreateIndex
CREATE INDEX "orders_createdAt_idx" ON "orders"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "payments_orderId_key" ON "payments"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_transactionId_key" ON "payments"("transactionId");

-- CreateIndex
CREATE INDEX "payments_status_idx" ON "payments"("status");

-- CreateIndex
CREATE INDEX "payments_transactionId_idx" ON "payments"("transactionId");

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parentCategoryId_fkey" FOREIGN KEY ("parentCategoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_items" ADD CONSTRAINT "menu_items_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_item_taxes" ADD CONSTRAINT "menu_item_taxes_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "menu_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_item_taxes" ADD CONSTRAINT "menu_item_taxes_taxId_fkey" FOREIGN KEY ("taxId") REFERENCES "taxes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_item_customizations" ADD CONSTRAINT "menu_item_customizations_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "menu_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_item_customizations" ADD CONSTRAINT "menu_item_customizations_customizationId_fkey" FOREIGN KEY ("customizationId") REFERENCES "customizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customization_nodes" ADD CONSTRAINT "customization_nodes_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "menu_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customization_edges" ADD CONSTRAINT "customization_edges_parentNodeId_fkey" FOREIGN KEY ("parentNodeId") REFERENCES "customization_nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customization_edges" ADD CONSTRAINT "customization_edges_childNodeId_fkey" FOREIGN KEY ("childNodeId") REFERENCES "customization_nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "menu_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item_customizations" ADD CONSTRAINT "order_item_customizations_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "order_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item_customizations" ADD CONSTRAINT "order_item_customizations_customizationNodeId_fkey" FOREIGN KEY ("customizationNodeId") REFERENCES "customization_nodes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_taxes" ADD CONSTRAINT "order_taxes_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_taxes" ADD CONSTRAINT "order_taxes_taxId_fkey" FOREIGN KEY ("taxId") REFERENCES "taxes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_status_history" ADD CONSTRAINT "order_status_history_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
