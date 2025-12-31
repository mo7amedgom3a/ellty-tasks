import { Request, Response, NextFunction } from 'express';
import UserService from '../services/UserService';

/**
 * User Controller
 * Handles HTTP requests for user operations
 */
class UserController {
  /**
   * Get current user profile
   * GET /users/profile
   */
  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const profile = await UserService.getUserProfile(userId);

      res.status(200).json({
        success: true,
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update current user profile
   * PUT /users/profile
   */
  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const updates = req.body;

      const updatedProfile = await UserService.updateProfile(userId, updates);

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: updatedProfile,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all users (admin only)
   * GET /users
   */
  async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await UserService.getAllUsers();

      res.status(200).json({
        success: true,
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete user account
   * DELETE /users/:id
   */
  async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      
      // Users can only delete their own account unless they're admin
      if (req.user!.id !== id && req.user!.role !== 'admin') {
        res.status(403).json({
          success: false,
          message: 'Unauthorized to delete this account',
        });
        return;
      }

      await UserService.deleteUser(id);

      res.status(200).json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
