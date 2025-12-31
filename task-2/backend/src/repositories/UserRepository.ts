import { prisma } from '../data/prisma';
import User from '../models/User';
import { User as PrismaUser } from '@prisma/client';

/**
 * User Repository
 * Handles all database operations for users using Prisma
 */
class UserRepository {
  /**
   * Create a new user
   */
  async create(userData: {
    username: string;
    passwordHash: string;
    avatarUrl?: string | null;
    role?: 'user' | 'admin';
  }): Promise<User> {
    const user = await prisma.user.create({
      data: {
        username: userData.username,
        password_hash: userData.passwordHash,
        avatar_url: userData.avatarUrl || null,
        role: userData.role || 'user',
      },
    });

    return new User(this.mapPrismaUser(user));
  }

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return null;
    }

    return new User(this.mapPrismaUser(user));
  }

  /**
   * Find user by username
   */
  async findByUsername(username: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return null;
    }

    return new User(this.mapPrismaUser(user));
  }

  /**
   * Get all users
   */
  async findAll(): Promise<User[]> {
    const users = await prisma.user.findMany({
      orderBy: { created_at: 'desc' },
    });

    return users.map(user => new User(this.mapPrismaUser(user)));
  }

  /**
   * Update user
   */
  async update(id: string, updates: {
    username?: string;
    avatarUrl?: string;
    role?: 'user' | 'admin';
  }): Promise<User | null> {
    const updateData: any = {};

    if (updates.username !== undefined) {
      updateData.username = updates.username;
    }
    if (updates.avatarUrl !== undefined) {
      updateData.avatar_url = updates.avatarUrl;
    }
    if (updates.role !== undefined) {
      updateData.role = updates.role;
    }

    if (Object.keys(updateData).length === 0) {
      return this.findById(id);
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    return new User(this.mapPrismaUser(user));
  }

  /**
   * Delete user
   */
  async delete(id: string): Promise<boolean> {
    try {
      await prisma.user.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Map Prisma User to UserEntity
   */
  private mapPrismaUser(user: PrismaUser) {
    return {
      id: user.id,
      username: user.username,
      password_hash: user.password_hash,
      avatar_url: user.avatar_url,
      role: user.role as 'user' | 'admin',
      created_at: user.created_at,
    };
  }
}

export default new UserRepository();
