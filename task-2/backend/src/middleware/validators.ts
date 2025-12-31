import { body, param, validationResult, ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

/**
 * Validation result checker
 */
export const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
    return;
  }
  next();
};

/**
 * User registration validation
 */
export const validateRegistration: ValidationChain[] = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

/**
 * User login validation
 */
export const validateLogin: ValidationChain[] = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

/**
 * Profile update validation
 */
export const validateProfileUpdate: ValidationChain[] = [
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('avatarUrl')
    .optional()
    .isURL()
    .withMessage('Avatar URL must be a valid URL'),
];

/**
 * Start calculation validation
 */
export const validateStartCalculation: ValidationChain[] = [
  body('initialValue')
    .isNumeric()
    .withMessage('Initial value must be a number'),
];

/**
 * Add operation validation
 */
export const validateAddOperation: ValidationChain[] = [
  body('parentId')
    .isUUID()
    .withMessage('Parent ID must be a valid UUID'),
  body('operation')
    .isIn(['ADD', 'SUB', 'MUL', 'DIV'])
    .withMessage('Operation must be one of: ADD, SUB, MUL, DIV'),
  body('inputValue')
    .isNumeric()
    .withMessage('Input value must be a number'),
];

/**
 * UUID parameter validation
 */
export const validateUUID: ValidationChain[] = [
  param('id')
    .isUUID()
    .withMessage('ID must be a valid UUID'),
];
