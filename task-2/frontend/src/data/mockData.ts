import { CalculationNode } from '@/types/calculation';

export const mockThreads: CalculationNode[] = [
  {
    id: '1',
    author: 'Alex Chen',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    createdAt: '2025-12-30T10:30:00Z',
    operation: 'START',
    inputValue: 100,
    calculatedValue: 100,
    children: [
      {
        id: '2',
        author: 'Sarah Miller',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        createdAt: '2025-12-30T11:15:00Z',
        operation: 'ADD',
        inputValue: 50,
        calculatedValue: 150,
        children: [
          {
            id: '4',
            author: 'Mike Johnson',
            avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
            createdAt: '2025-12-30T12:00:00Z',
            operation: 'MUL',
            inputValue: 2,
            calculatedValue: 300,
            children: [],
          },
        ],
      },
      {
        id: '3',
        author: 'Emma Davis',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
        createdAt: '2025-12-30T11:45:00Z',
        operation: 'DIV',
        inputValue: 4,
        calculatedValue: 25,
        children: [],
      },
    ],
  },
  {
    id: '5',
    author: 'Jordan Lee',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan',
    createdAt: '2025-12-29T09:00:00Z',
    operation: 'START',
    inputValue: 42,
    calculatedValue: 42,
    children: [
      {
        id: '6',
        author: 'Chris Park',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chris',
        createdAt: '2025-12-29T09:30:00Z',
        operation: 'SUB',
        inputValue: 12,
        calculatedValue: 30,
        children: [
          {
            id: '7',
            author: 'Taylor Swift',
            avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor',
            createdAt: '2025-12-29T10:00:00Z',
            operation: 'ADD',
            inputValue: 13,
            calculatedValue: 43,
            children: [],
          },
        ],
      },
    ],
  },
];
