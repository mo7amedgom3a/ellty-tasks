import { useState } from 'react';
import { CalculationNode, OperationType, calculateResult } from '@/types/calculation';
import { OperatorBadge } from './OperatorBadge';
import { ReplyForm } from './ReplyForm';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MessageSquare, MoreHorizontal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface NodeTreeProps {
  node: CalculationNode;
  parentValue?: number;
  onAddReply: (parentId: string, operation: OperationType, inputValue: number) => void;
  isRoot?: boolean;
  canReply?: boolean;
}

export const NodeTree = ({ node, parentValue, onAddReply, isRoot = false, canReply = true }: NodeTreeProps) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const isChildNode = parentValue !== undefined;

  const handleReply = (operation: OperationType, value: number) => {
    onAddReply(node.id, operation, value);
    setShowReplyForm(false);
  };

  const formattedDate = formatDistanceToNow(new Date(node.createdAt), { addSuffix: true });

  return (
    <div className={isChildNode ? 'tree-connector' : ''}>
      <div className="bg-card rounded-lg p-5 card-hover border border-border/50">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-9 h-9">
              <AvatarImage src={node.avatarUrl} alt={node.author} />
              <AvatarFallback className="bg-secondary text-foreground text-sm">
                {node.author.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <span className="font-medium text-foreground">{node.author}</span>
              <span className="text-muted-foreground text-sm ml-2">{formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Math Display */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          {isChildNode ? (
            <>
              <span className="font-mono text-lg text-muted-foreground">
                {parentValue}
              </span>
              <OperatorBadge operation={node.operation} />
              <span className="font-mono text-lg text-foreground">
                {node.inputValue}
              </span>
              <span className="text-muted-foreground text-lg">=</span>
              <span className="font-mono text-2xl font-bold text-primary result-glow">
                {Number.isInteger(node.calculatedValue) 
                  ? node.calculatedValue 
                  : node.calculatedValue.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="font-mono text-3xl font-bold text-primary result-glow">
              {node.calculatedValue}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="text-muted-foreground hover:text-foreground"
            disabled={!canReply}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Reply
          </Button>
        </div>

        {/* Reply Form */}
        {showReplyForm && canReply && (
          <ReplyForm
            parentValue={node.calculatedValue}
            onSubmit={handleReply}
            onCancel={() => setShowReplyForm(false)}
          />
        )}
      </div>

      {/* Render Children Recursively */}
      {node.children.length > 0 && (
        <div className="mt-3 space-y-3">
          {node.children.map((child) => (
            <NodeTree
              key={child.id}
              node={child}
              parentValue={node.calculatedValue}
              onAddReply={onAddReply}
              canReply={canReply}
            />
          ))}
        </div>
      )}
    </div>
  );
};
