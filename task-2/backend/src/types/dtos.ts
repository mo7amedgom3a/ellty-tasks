/**
 * Data Transfer Objects (DTOs)
 * Types for API requests and responses
 */

import { OperationType } from './entities';

// ============================================
// Authentication DTOs
// ============================================

export interface RegisterDTO {
  username: string;
  password: string;
  avatarUrl?: string;
}

export interface LoginDTO {
  username: string;
  password: string;
}

export interface AuthResponseDTO {
  user: UserProfileDTO;
  token: string;
}

export interface JWTPayload {
  id: string;
  username: string;
  role: 'user' | 'admin';
}

// ============================================
// User DTOs
// ============================================

export interface UserProfileDTO {
  id: string;
  username: string;
  avatarUrl: string | null;
  role: 'user' | 'admin';
  createdAt: Date;
}

export interface UpdateProfileDTO {
  username?: string;
  avatarUrl?: string;
}

// ============================================
// Calculation DTOs
// ============================================

export interface StartCalculationDTO {
  initialValue: number;
}

export interface AddOperationDTO {
  parentId: string;
  operation: OperationType;
  inputValue: number;
}

export interface CalculationNodeDTO {
  id: string;
  rootId: string;
  parentId: string | null;
  operation: OperationType;
  inputValue: number;
  calculatedValue: number;
  userId: string;
  createdAt: Date;
  children?: CalculationNodeDTO[];
}

export type CalculationTreeDTO = CalculationNodeDTO;

// ============================================
// Enhanced Calculation DTOs with User Data
// ============================================

export interface CalculationWithUserDTO {
  id: string;
  rootId: string;
  parentId: string | null;
  operation: OperationType;
  inputValue: number;
  calculatedValue: number;
  createdAt: Date;
  user: {
    id: string;
    username: string;
    avatarUrl: string | null;
  };
  children?: CalculationWithUserDTO[];
}

export type PublicCalculationTreeDTO = CalculationWithUserDTO;

