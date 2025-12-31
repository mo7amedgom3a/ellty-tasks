import UserRepository from '../repositories/UserRepository';
import { UserProfileDTO, UpdateProfileDTO } from '../types/dtos';

/**
 * User Service
 * Handles business logic for user operations
 */
class UserService {
  /**
   * Get user profile by ID
   */
  async getUserProfile(userId: string): Promise<UserProfileDTO> {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return user.toJSON();
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, updates: UpdateProfileDTO): Promise<UserProfileDTO> {
    // Validate that user exists
    const existingUser = await UserRepository.findById(userId);
    if (!existingUser) {
      throw new Error('User not found');
    }

    // If username is being updated, check it's not taken
    if (updates.username && updates.username !== existingUser.username) {
      const userWithUsername = await UserRepository.findByUsername(updates.username);
      if (userWithUsername) {
        throw new Error('Username already taken');
      }
    }

    // Update user
    const updatedUser = await UserRepository.update(userId, updates);
    if (!updatedUser) {
      throw new Error('Failed to update user');
    }

    return updatedUser.toJSON();
  }

  /**
   * Get all users (admin function)
   */
  async getAllUsers(): Promise<UserProfileDTO[]> {
    const users = await UserRepository.findAll();
    return users.map(user => user.toJSON());
  }

  /**
   * Delete user account
   */
  async deleteUser(userId: string): Promise<boolean> {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return await UserRepository.delete(userId);
  }
}

export default new UserService();
