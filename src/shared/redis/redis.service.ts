import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Redis } from '@upstash/redis';

@Injectable()
export class RedisService implements OnModuleInit {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis;

  constructor() {
    const redisUrl = process.env.REDIS_URL;
    const redisToken = process.env.REDIS_TOKEN;

    if (!redisUrl || !redisToken) {
      throw new Error('REDIS_URL and REDIS_TOKEN must be defined in environment variables');
    }

    this.client = new Redis({
      url: redisUrl,
      token: redisToken,
    });
  }

  async onModuleInit() {
    try {
      // Test connection
      await this.client.ping();
      this.logger.log('✅ Redis connected successfully');
    } catch (error) {
      this.logger.error('❌ Redis connection failed', error);
      throw error;
    }
  }

  /**
   * Get value by key
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.client.get<T>(key);
      return value;
    } catch (error) {
      this.logger.error(`Error getting key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Set value with optional TTL (in seconds)
   */
  async set<T>(key: string, value: T, ttl?: number): Promise<'OK' | string> {
    try {
      if (ttl) {
        return await this.client.set(key, value, { ex: ttl }) as 'OK' | string;
      }
      return await this.client.set(key, value) as 'OK' | string;
    } catch (error) {
      this.logger.error(`Error setting key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Delete key
   */
  async del(key: string): Promise<number> {
    try {
      return await this.client.del(key);
    } catch (error) {
      this.logger.error(`Error deleting key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Check if key exists
   */
  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      this.logger.error(`Error checking existence of key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Set expiration on key (in seconds)
   */
  async expire(key: string, seconds: number): Promise<boolean> {
    try {
      const result = await this.client.expire(key, seconds);
      return result === 1;
    } catch (error) {
      this.logger.error(`Error setting expiration on key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Get TTL of key (in seconds)
   */
  async ttl(key: string): Promise<number> {
    try {
      return await this.client.ttl(key);
    } catch (error) {
      this.logger.error(`Error getting TTL of key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Increment value by 1
   */
  async incr(key: string): Promise<number> {
    try {
      return await this.client.incr(key);
    } catch (error) {
      this.logger.error(`Error incrementing key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Get multiple keys by pattern
   */
  async keys(pattern: string): Promise<string[]> {
    try {
      return await this.client.keys(pattern);
    } catch (error) {
      this.logger.error(`Error getting keys with pattern ${pattern}:`, error);
      throw error;
    }
  }

  /**
   * Delete all keys matching pattern
   */
  async deletePattern(pattern: string): Promise<number> {
    try {
      const keys = await this.keys(pattern);
      if (keys.length === 0) return 0;
      
      return await this.client.del(...keys);
    } catch (error) {
      this.logger.error(`Error deleting keys with pattern ${pattern}:`, error);
      throw error;
    }
  }

  /**
   * Get the raw Redis client (for advanced operations)
   */
  getClient(): Redis {
    return this.client;
  }
}