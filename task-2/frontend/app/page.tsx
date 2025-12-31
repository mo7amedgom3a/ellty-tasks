'use client';

import { useState } from 'react';
import { CalculationNode, OperationType, calculateResult } from '@/types/calculation';
import { mockThreads } from '@/data/mockData';
import { NodeTree } from '@/components/NodeTree';
import { NewThreadForm } from '@/components/NewThreadForm';
import { Calculator, TrendingUp } from 'lucide-react';

export default function Home() {
  const [threads, setThreads] = useState<CalculationNode[]>(mockThreads);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addReplyToNode = (
    nodes: CalculationNode[],
    parentId: string,
    operation: OperationType,
    inputValue: number
  ): CalculationNode[] => {
    return nodes.map((node) => {
      if (node.id === parentId) {
        const newChild: CalculationNode = {
          id: generateId(),
          author: 'You',
          avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=User',
          createdAt: new Date().toISOString(),
          operation,
          inputValue,
          calculatedValue: calculateResult(node.calculatedValue, operation, inputValue),
          children: [],
        };
        return {
          ...node,
          children: [...node.children, newChild],
        };
      }
      return {
        ...node,
        children: addReplyToNode(node.children, parentId, operation, inputValue),
      };
    });
  };

  const handleAddReply = (parentId: string, operation: OperationType, inputValue: number) => {
    setThreads((prev) => addReplyToNode(prev, parentId, operation, inputValue));
  };

  const handleNewThread = (value: number) => {
    const newThread: CalculationNode = {
      id: generateId(),
      author: 'You',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=User',
      createdAt: new Date().toISOString(),
      operation: 'START',
      inputValue: value,
      calculatedValue: value,
      children: [],
    };
    setThreads((prev) => [newThread, ...prev]);
  };

  return (
    <div className="min-h-screen bg-background gradient-bg">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
              <Calculator className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Social Math</h1>
              <p className="text-sm text-muted-foreground">Reply to numbers, build calculations together</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-3xl mx-auto px-4 py-6">
        <NewThreadForm onSubmit={handleNewThread} />

        {/* Threads List */}
        <div className="space-y-6">
          {threads.map((thread) => (
            <div key={thread.id} className="animate-fade-in">
              <NodeTree
                node={thread}
                onAddReply={handleAddReply}
                isRoot
              />
            </div>
          ))}
        </div>

        {threads.length === 0 && (
          <div className="text-center py-16">
            <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-lg font-medium text-foreground mb-2">No calculations yet</h2>
            <p className="text-muted-foreground">Start a new thread with any number!</p>
          </div>
        )}
      </main>
    </div>
  );
}
