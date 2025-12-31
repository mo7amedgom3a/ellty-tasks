import express from 'express';
import CalculationController from '../controllers/CalculationController';
import { authenticate } from '../middleware/authMiddleware';
import {
  validateStartCalculation,
  validateAddOperation,
  validateUUID,
  validate,
} from '../middleware/validators';

const router = express.Router();

/**
 * @route   GET /calculations
 * @desc    Get all calculations (public)
 * @access  Public
 */
router.get('/', (req, res, next) => {
  CalculationController.getAllCalculations(req, res, next);
});

/**
 * @route   POST /calculations/start
 * @desc    Start a new calculation
 * @access  Private
 */
router.post('/start', authenticate, validateStartCalculation, validate, (req, res, next) => {
  CalculationController.startCalculation(req, res, next);
});

/**
 * @route   POST /calculations/add-operation
 * @desc    Add an operation to calculation tree
 * @access  Private
 */
router.post('/add-operation', authenticate, validateAddOperation, validate, (req, res, next) => {
  CalculationController.addOperation(req, res, next);
});

/**
 * @route   GET /calculations/user/me
 * @desc    Get all calculations for current user
 * @access  Private
 */
router.get('/user/me', authenticate, (req, res, next) => {
  CalculationController.getUserCalculations(req, res, next);
});

/**
 * @route   GET /calculations/:id
 * @desc    Get calculation tree by root ID
 * @access  Private
 */
router.get('/:id', authenticate, validateUUID, validate, (req, res, next) => {
  CalculationController.getCalculationTree(req, res, next);
});

/**
 * @route   DELETE /calculations/:id
 * @desc    Delete a calculation tree
 * @access  Private
 */
router.delete('/:id', authenticate, validateUUID, validate, (req, res, next) => {
  CalculationController.deleteCalculation(req, res, next);
});

export default router;
