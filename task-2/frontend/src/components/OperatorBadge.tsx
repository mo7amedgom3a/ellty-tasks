import { OperationType, OPERATION_SYMBOLS } from '@/types/calculation';
import { cn } from '@/lib/utils';

interface OperatorBadgeProps {
  operation: OperationType;
  className?: string;
}

const operatorColors: Record<OperationType, string> = {
  START: 'bg-primary/20 text-primary',
  ADD: 'bg-operator-add/20 text-operator-add',
  SUB: 'bg-operator-sub/20 text-operator-sub',
  MUL: 'bg-operator-mul/20 text-operator-mul',
  DIV: 'bg-operator-div/20 text-operator-div',
};

export const OperatorBadge = ({ operation, className }: OperatorBadgeProps) => {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center w-8 h-8 rounded-lg font-mono font-bold text-lg',
        operatorColors[operation],
        className
      )}
    >
      {OPERATION_SYMBOLS[operation]}
    </span>
  );
};
