import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';

interface NewThreadFormProps {
  onSubmit: (value: number) => void;
  disabled?: boolean;
}

export const NewThreadForm = ({ onSubmit, disabled = false }: NewThreadFormProps) => {
  const [inputValue, setInputValue] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseFloat(inputValue);
    if (!isNaN(value)) {
      onSubmit(value);
      setInputValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card rounded-lg p-5 border border-border/50 mb-6">
      <div className="flex items-center gap-4">
        <Input
          type="number"
          step="any"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={disabled ? "Login to start a calculation..." : "Start a new calculation thread with any number..."}
          className="flex-1 font-mono text-lg bg-secondary border-border placeholder:text-muted-foreground"
          disabled={disabled}
        />
        <Button type="submit" disabled={!inputValue || disabled}>
          <Plus className="w-4 h-4 mr-2" />
          Post thread
        </Button>
      </div>
    </form>
  );
};
