import { UserEntity, OperationType } from '../types/entities';
import { UserProfileDTO } from '../types/dtos';

/**
 * User Model
 * Represents a user in the system
 */
class User {
  id: string;
  username: string;
  passwordHash: string;
  avatarUrl: string | null;
  role: 'user' | 'admin';
  createdAt: Date;

  constructor(data: UserEntity) {
    this.id = data.id;
    this.username = data.username;
    this.passwordHash = data.password_hash;
    this.avatarUrl = data.avatar_url;
    this.role = data.role;
    this.createdAt = data.created_at;
  }

  /**
   * Convert to JSON (exclude sensitive data)
   */
  toJSON(): UserProfileDTO {
    return {
      id: this.id,
      username: this.username,
      avatarUrl: this.avatarUrl,
      role: this.role,
      createdAt: this.createdAt,
    };
  }

  /**
   * Validate user data
   */
  static validate(data: { username: string; password: string }): string[] {
    const errors: string[] = [];

    if (!data.username || data.username.length < 3 || data.username.length > 50) {
      errors.push('Username must be between 3 and 50 characters');
    }

    if (!data.password || data.password.length < 6) {
      errors.push('Password must be at least 6 characters');
    }

    return errors;
  }
}

export default User;
