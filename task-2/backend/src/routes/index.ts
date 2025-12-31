import express, { Request, Response } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import calculationRoutes from './calculationRoutes';

const router = express.Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/calculations', calculationRoutes);

// Health check endpoint
router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;
