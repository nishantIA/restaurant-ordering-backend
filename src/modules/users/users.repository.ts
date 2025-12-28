import { Injectable } from '@nestjs/common';
import { User, UserRole } from '@prisma/client';
import { PrismaService } from '../../shared/database/prisma.service';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Find user by phone
   */
  async findByPhone(phone: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { phone },
    });
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  /**
   * Create new user
   */
  async create(data: {
    phone?: string;
    email?: string;
    name?: string;
    role?: UserRole;
  }): Promise<User> {
    return this.prisma.user.create({
      data: {
        phone: data.phone,
        email: data.email,
        name: data.name,
        role: data.role || UserRole.CUSTOMER,
      },
    });
  }

  /**
   * Update user
   */
  async update(
    id: string,
    data: {
      phone?: string;
      email?: string;
      name?: string;
    },
  ): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  /**
   * Find or create user by phone or email
   */
  async findOrCreate(data: {
    phone?: string;
    email?: string;
    name?: string;
  }): Promise<User> {
    // Try to find by phone first
    if (data.phone) {
      const existing = await this.findByPhone(data.phone);
      if (existing) {
        // Update name if provided and different
        if (data.name && existing.name !== data.name) {
          return this.update(existing.id, { name: data.name });
        }
        return existing;
      }
    }

    // Try to find by email
    if (data.email) {
      const existing = await this.findByEmail(data.email);
      if (existing) {
        // Update name if provided and different
        if (data.name && existing.name !== data.name) {
          return this.update(existing.id, { name: data.name });
        }
        return existing;
      }
    }

    // Create new user
    return this.create(data);
  }
}