import { Request, Response, NextFunction } from 'express';
import AuthService from '../services/AuthService';

/**
 * Authentication Controller
 * Handles HTTP requests for authentication
 */
class AuthController {
  /**
   * Register a new user
   * POST /auth/register
   */
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { username, password } = req.body;

      const result = await AuthService.register(username, password);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Login user
   * POST /auth/login
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { username, password } = req.body;

      const result = await AuthService.login(username, password);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
