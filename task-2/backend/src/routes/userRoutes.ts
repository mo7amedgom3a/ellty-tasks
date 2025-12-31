import express from 'express';
import UserController from '../controllers/UserController';
import { authenticate, requireAdmin } from '../middleware/authMiddleware';
import { validateProfileUpdate, validateUUID, validate } from '../middleware/validators';

const router = express.Router();

/**
 * @route   GET /users/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', authenticate, (req, res, next) => {
  UserController.getProfile(req, res, next);
});

/**
 * @route   PUT /users/profile
 * @desc    Update current user profile
 * @access  Private
 */
router.put('/profile', authenticate, validateProfileUpdate, validate, (req, res, next) => {
  UserController.updateProfile(req, res, next);
});

/**
 * @route   GET /users
 * @desc    Get all users (admin only)
 * @access  Private (Admin)
 */
router.get('/', authenticate, requireAdmin, (req, res, next) => {
  UserController.getAllUsers(req, res, next);
});

/**
 * @route   DELETE /users/:id
 * @desc    Delete user account
 * @access  Private
 */
router.delete('/:id', authenticate, validateUUID, validate, (req, res, next) => {
  UserController.deleteUser(req, res, next);
});

export default router;
