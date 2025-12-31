import express from 'express';
import AuthController from '../controllers/AuthController';
import { validateRegistration, validateLogin, validate } from '../middleware/validators';

const router = express.Router();

/**
 * @route   POST /auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', validateRegistration, validate, (req, res, next) => {
  AuthController.register(req, res, next);
});

/**
 * @route   POST /auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', validateLogin, validate, (req, res, next) => {
  AuthController.login(req, res, next);
});

export default router;
