/**
 * Database Entity Types
 * These types match the database schema exactly
 */

export interface UserEntity {
  id: string;              // UUID
  username: string;
  password_hash: string;
  avatar_url: string | null;
  role: 'user' | 'admin';
  created_at: Date;
}

export type OperationType =
  | 'START'
  | 'ADD'
  | 'SUB'
  | 'MUL'
  | 'DIV';

export interface CalculationNodeEntity {
  id: string;              // UUID

  root_id: string;
  parent_id: string | null;

  operation: OperationType;
  input_value: number;
  calculated_value: number;

  user_id: string;

  created_at: Date;
}
