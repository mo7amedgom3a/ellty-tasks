/**
 * Express type extensions
 * Extend Express Request interface to include user property
 */

import { JWTPayload } from './dtos';

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export {};
