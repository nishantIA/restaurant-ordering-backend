import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '../../shared/redis/redis.service';

export interface CartCustomization {
  customizationId: string;
  name: string;
  type: string;
  price: number;
}

export interface CartItem {
  id: string;
  menuItemId: string;
  menuItemSlug: string;
  name: string;
  imageUrl?: string;
  basePrice: number;
  quantity: number;
  quantityType: string;
  unit?: string;
  customizations: CartCustomization[];
  specialInstructions?: string;
  itemSubtotal: number;
  itemTaxAmount: number;
  itemTotal: number;
  isAvailable: boolean;
  availableQuantity?: number;
}

export interface Cart {
  sessionId: string;
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  taxAmount: number;
  total: number;
  canCheckout: boolean;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
}

@Injectable()
export class CartRepository {
  private readonly logger = new Logger(CartRepository.name);
  private readonly CART_PREFIX = 'cart';
  private readonly CART_TTL = 86400; // 24 hours in seconds

  constructor(private readonly redis: RedisService) {}

  /**
   * Get cart key for Redis
   */
  private getCartKey(sessionId: string): string {
    return `${this.CART_PREFIX}:${sessionId}`;
  }

  /**
   * Get cart from Redis
   */
  async getCart(sessionId: string): Promise<Cart | null> {
    try {
      const key = this.getCartKey(sessionId);
      const cart = await this.redis.get<Cart>(key);
      
      if (cart) {
        this.logger.debug(`Cart found for session: ${sessionId}`);
      }
      
      return cart;
    } catch (error) {
      this.logger.error(`Error getting cart for session ${sessionId}:`, error);
      throw error;
    }
  }

  /**
   * Save cart to Redis
   */
  async saveCart(cart: Cart): Promise<void> {
    try {
      const key = this.getCartKey(cart.sessionId);
      await this.redis.set(key, cart, this.CART_TTL);
      this.logger.debug(`Cart saved for session: ${cart.sessionId}`);
    } catch (error) {
      this.logger.error(`Error saving cart for session ${cart.sessionId}:`, error);
      throw error;
    }
  }

  /**
   * Delete cart from Redis
   */
  async deleteCart(sessionId: string): Promise<void> {
    try {
      const key = this.getCartKey(sessionId);
      await this.redis.del(key);
      this.logger.debug(`Cart deleted for session: ${sessionId}`);
    } catch (error) {
      this.logger.error(`Error deleting cart for session ${sessionId}:`, error);
      throw error;
    }
  }

  /**
   * Check if cart exists
   */
  async cartExists(sessionId: string): Promise<boolean> {
    try {
      const key = this.getCartKey(sessionId);
      return await this.redis.exists(key);
    } catch (error) {
      this.logger.error(`Error checking cart existence for session ${sessionId}:`, error);
      throw error;
    }
  }

  /**
   * Get cart TTL
   */
  async getCartTTL(sessionId: string): Promise<number> {
    try {
      const key = this.getCartKey(sessionId);
      return await this.redis.ttl(key);
    } catch (error) {
      this.logger.error(`Error getting cart TTL for session ${sessionId}:`, error);
      throw error;
    }
  }

  /**
   * Create empty cart
   */
  createEmptyCart(sessionId: string): Cart {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + this.CART_TTL * 1000);

    return {
      sessionId,
      items: [],
      itemCount: 0,
      subtotal: 0,
      taxAmount: 0,
      total: 0,
      canCheckout: false,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
    };
  }
}