import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserRepository from '../repositories/UserRepository';
import User from '../models/User';
import authConfig from '../config/auth';
import { AuthResponseDTO, JWTPayload } from '../types/dtos';
import { generateAvatar } from '../data/avatars';

/**
 * Authentication Service
 * Handles user authentication and authorization
 */
class AuthService {
  /**
   * Register a new user
   */
  async register(
    username: string,
    password: string
  ): Promise<AuthResponseDTO> {
    // Validate input
    const errors = User.validate({ username, password });
    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }

    // Check if user already exists
    const existingUser = await UserRepository.findByUsername(username);
    if (existingUser) {
      throw new Error('Username already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, authConfig.bcryptSaltRounds);

    // Auto-generate avatar
    const avatarUrl = generateAvatar();

    // Create user
    const user = await UserRepository.create({
      username,
      passwordHash,
      avatarUrl,
      role: 'user',
    });

    // Generate token
    const token = this.generateToken(user);

    return {
      user: user.toJSON(),
      token,
    };
  }

  /**
   * Login user
   */
  async login(username: string, password: string): Promise<AuthResponseDTO> {
    // Find user
    const user = await UserRepository.findByUsername(username);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Generate token
    const token = this.generateToken(user);

    return {
      user: user.toJSON(),
      token,
    };
  }

  /**
   * Generate JWT token
   */
  generateToken(user: User): string {
    const payload: JWTPayload = {
      id: user.id,
      username: user.username,
      role: user.role,
    };

    return jwt.sign(payload, authConfig.jwtSecret, {
      expiresIn: authConfig.jwtExpiresIn,
    } as jwt.SignOptions);
  }

  /**
   * Verify JWT token
   */
  verifyToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, authConfig.jwtSecret) as JWTPayload;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }
}

export default new AuthService();
