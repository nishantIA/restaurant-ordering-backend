import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { FindOrCreateUserDto } from './dto/user.dto';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  /**
   * Find or create user
   */
  async findOrCreateUser(dto: FindOrCreateUserDto): Promise<User> {
    // Validate: at least phone or email is required
    if (!dto.phone && !dto.email) {
      throw new BadRequestException('Either phone or email is required');
    }

    return this.repository.findOrCreate({
      phone: dto.phone,
      email: dto.email,
      name: dto.name,
    });
  }

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<User | null> {
    return this.repository.findById(id);
  }

  /**
   * Find user by phone
   */
  async findByPhone(phone: string): Promise<User | null> {
    return this.repository.findByPhone(phone);
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findByEmail(email);
  }
}