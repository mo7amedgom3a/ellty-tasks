import { CalculationNodeEntity, OperationType } from '../types/entities';
import { CalculationNodeDTO } from '../types/dtos';

/**
 * CalculationNode Model
 * Represents a node in the calculation tree
 */
class CalculationNode {
  id: string;
  rootId: string;
  parentId: string | null;
  operation: OperationType;
  inputValue: number;
  calculatedValue: number;
  userId: string;
  createdAt: Date;

  constructor(data: CalculationNodeEntity) {
    this.id = data.id;
    this.rootId = data.root_id;
    this.parentId = data.parent_id;
    this.operation = data.operation;
    this.inputValue = data.input_value;
    this.calculatedValue = data.calculated_value;
    this.userId = data.user_id;
    this.createdAt = data.created_at;
  }

  /**
   * Convert to JSON
   */
  toJSON(): CalculationNodeDTO {
    return {
      id: this.id,
      rootId: this.rootId,
      parentId: this.parentId,
      operation: this.operation,
      inputValue: this.inputValue,
      calculatedValue: this.calculatedValue,
      userId: this.userId,
      createdAt: this.createdAt,
    };
  }

  /**
   * Valid operations
   */
  static get OPERATIONS() {
    return {
      START: 'START' as OperationType,
      ADD: 'ADD' as OperationType,
      SUB: 'SUB' as OperationType,
      MUL: 'MUL' as OperationType,
      DIV: 'DIV' as OperationType,
    };
  }

  /**
   * Validate calculation node data
   */
  static validate(data: { operation: string; inputValue: number }): string[] {
    const errors: string[] = [];

    const validOperations: OperationType[] = ['START', 'ADD', 'SUB', 'MUL', 'DIV'];
    if (!data.operation || !validOperations.includes(data.operation as OperationType)) {
      errors.push('Invalid operation. Must be one of: START, ADD, SUB, MUL, DIV');
    }

    if (data.inputValue === undefined || data.inputValue === null) {
      errors.push('Input value is required');
    }

    if (typeof data.inputValue !== 'number') {
      errors.push('Input value must be a number');
    }

    if (data.operation === CalculationNode.OPERATIONS.DIV && data.inputValue === 0) {
      errors.push('Cannot divide by zero');
    }

    return errors;
  }
}

export default CalculationNode;
