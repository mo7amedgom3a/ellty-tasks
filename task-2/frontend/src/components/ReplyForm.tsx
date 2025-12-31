import { useState } from 'react';
import { OperationType, OPERATION_SYMBOLS } from '@/types/calculation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calculator } from 'lucide-react';

interface ReplyFormProps {
  parentValue: number;
  onSubmit: (operation: OperationType, value: number) => void;
  onCancel: () => void;
}

export const ReplyForm = ({ parentValue, onSubmit, onCancel }: ReplyFormProps) => {
  const [operation, setOperation] = useState<OperationType>('ADD');
  const [inputValue, setInputValue] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseFloat(inputValue);
    if (!isNaN(value)) {
      onSubmit(operation, value);
      setInputValue('');
    }
  };

  const operations: OperationType[] = ['ADD', 'SUB', 'MUL', 'DIV'];

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in mt-4 p-4 bg-secondary/50 rounded-lg border border-border">
      <div className="flex items-center gap-3 flex-wrap">
        <span className="font-mono text-lg text-muted-foreground">{parentValue}</span>
        
        <select
          value={operation}
          onChange={(e) => setOperation(e.target.value as OperationType)}
          className="bg-accent border border-border rounded-lg px-3 py-2 font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {operations.map((op) => (
            <option key={op} value={op}>
              {OPERATION_SYMBOLS[op]}
            </option>
          ))}
        </select>

        <Input
          type="number"
          step="any"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter a number"
          className="w-32 font-mono bg-accent border-border"
          autoFocus
        />

        <span className="text-muted-foreground">=</span>
        
        <span className="font-mono text-xl font-bold text-primary">
          {inputValue ? (() => {
            const val = parseFloat(inputValue);
            if (isNaN(val)) return '?';
            switch (operation) {
              case 'ADD': return parentValue + val;
              case 'SUB': return parentValue - val;
              case 'MUL': return parentValue * val;
              case 'DIV': return val !== 0 ? (parentValue / val).toFixed(2) : '∞';
              default: return val;
            }
          })() : '?'}
        </span>

        <div className="flex gap-2 ml-auto">
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" size="sm" disabled={!inputValue}>
            <Calculator className="w-4 h-4 mr-2" />
            Calculate
          </Button>
        </div>
      </div>
    </form>
  );
};
