export type OperationType = 'START' | 'ADD' | 'SUB' | 'MUL' | 'DIV';

export interface CalculationNode {
  id: string;
  author: string;
  avatarUrl: string;
  createdAt: string;
  
  // Math Data
  operation: OperationType;
  inputValue: number;
  calculatedValue: number;
  
  // Tree Data
  children: CalculationNode[];
}

export const OPERATION_SYMBOLS: Record<OperationType, string> = {
  START: '=',
  ADD: '+',
  SUB: '−',
  MUL: '×',
  DIV: '÷',
};

export const calculateResult = (
  parentValue: number,
  operation: OperationType,
  inputValue: number
): number => {
  switch (operation) {
    case 'ADD':
      return parentValue + inputValue;
    case 'SUB':
      return parentValue - inputValue;
    case 'MUL':
      return parentValue * inputValue;
    case 'DIV':
      return inputValue !== 0 ? parentValue / inputValue : 0;
    case 'START':
    default:
      return inputValue;
  }
};
