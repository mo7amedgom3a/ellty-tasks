import { Request, Response, NextFunction } from 'express';
import CalculationService from '../services/CalculationService';
import { OperationType } from '../types/entities';

/**
 * Calculation Controller
 * Handles HTTP requests for calculation operations
 */
class CalculationController {
  /**
   * Start a new calculation
   * POST /calculations/start
   */
  async startCalculation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { initialValue } = req.body;
      const userId = req.user!.id;

      const rootNode = await CalculationService.startCalculation(userId, initialValue);

      res.status(201).json({
        success: true,
        message: 'Calculation started successfully',
        data: rootNode,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Add an operation to calculation tree
   * POST /calculations/add-operation
   */
  async addOperation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { parentId, operation, inputValue } = req.body;
      const userId = req.user!.id;

      const newNode = await CalculationService.addOperation(
        parentId,
        operation as OperationType,
        inputValue,
        userId
      );

      res.status(201).json({
        success: true,
        message: 'Operation added successfully',
        data: newNode,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get calculation tree
   * GET /calculations/:id
   */
  async getCalculationTree(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const tree = await CalculationService.getCalculationTree(id);

      res.status(200).json({
        success: true,
        data: tree,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all user calculations
   * GET /calculations/user/me
   */
  async getUserCalculations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;

      const calculations = await CalculationService.getUserCalculations(userId);

      res.status(200).json({
        success: true,
        data: calculations,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a calculation
   * DELETE /calculations/:id
   */
  async deleteCalculation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      await CalculationService.deleteCalculation(id, userId);

      res.status(200).json({
        success: true,
        message: 'Calculation deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all calculations (public endpoint)
   * GET /calculations
   */
  async getAllCalculations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const calculations = await CalculationService.getAllCalculations();

      res.status(200).json({
        success: true,
        data: calculations,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new CalculationController();
