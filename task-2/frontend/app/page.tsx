'use client';

import { useState, useEffect } from 'react';
import { CalculationNode, OperationType } from '@/types/calculation';
import { NodeTree } from '@/components/NodeTree';
import { NewThreadForm } from '@/components/NewThreadForm';
import { AuthDialog } from '@/components/AuthDialog';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import { Calculator, LogIn, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

function HomePage() {
  const { user, logout, isAuthenticated } = useAuth();
  const [threads, setThreads] = useState<CalculationNode[]>([]);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [authDialogTab, setAuthDialogTab] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch calculations on mount
  useEffect(() => {
    fetchCalculations();
  }, []);

  const fetchCalculations = async () => {
    try {
      setIsLoading(true);
      const calculations: any = await apiClient.getAllCalculations();
      setThreads(calculations || []);
    } catch (error) {
      console.error('Failed to fetch calculations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewThread = async (value: number) => {
    if (!isAuthenticated) {
      setAuthDialogTab('login');
      setIsAuthDialogOpen(true);
      return;
    }

    try {
      await apiClient.startCalculation(value);
      await fetchCalculations();
    } catch (error) {
      console.error('Failed to create calculation:', error);
    }
  };

  const handleAddReply = async (
    parentId: string,
    operation: OperationType,
    inputValue: number
  ) => {
    if (!isAuthenticated) {
      setAuthDialogTab('login');
      setIsAuthDialogOpen(true);
      return;
    }

    try {
      await apiClient.addOperation(parentId, operation, inputValue);
      await fetchCalculations();
    } catch (error) {
      console.error('Failed to add operation:', error);
    }
  };

  const handleLogin = () => {
    setAuthDialogTab('login');
    setIsAuthDialogOpen(true);
  };

  const handleRegister = () => {
    setAuthDialogTab('register');
    setIsAuthDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background gradient-bg">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                <Calculator className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Social Math</h1>
                <p className="text-sm text-muted-foreground">
                  Reply to numbers, build calculations together
                </p>
              </div>
            </div>

            {/* Auth Section */}
            <div className="flex items-center gap-2">
              {isAuthenticated && user ? (
                <>
                  <div className="flex items-center gap-2 mr-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.avatarUrl || undefined} alt={user.username} />
                      <AvatarFallback>
                        <User className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{user.username}</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={logout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" onClick={handleLogin}>
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                  <Button size="sm" onClick={handleRegister}>
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-3xl mx-auto px-4 py-6">
        <NewThreadForm onSubmit={handleNewThread} disabled={!isAuthenticated} />

        {!isAuthenticated && (
          <div className="mb-4 p-3 bg-muted/50 rounded-lg border border-border/50">
            <p className="text-sm text-muted-foreground text-center">
              👋 You can view all calculations, but you need to{' '}
              <button
                onClick={handleLogin}
                className="text-primary hover:underline font-medium"
              >
                login
              </button>{' '}
              or{' '}
              <button
                onClick={handleRegister}
                className="text-primary hover:underline font-medium"
              >
                sign up
              </button>{' '}
              to create or reply to calculations.
            </p>
          </div>
        )}

        {/* Threads List */}
        {isLoading ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">Loading calculations...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {threads.map((thread) => (
              <div key={thread.id} className="animate-fade-in">
                <NodeTree
                  node={thread}
                  onAddReply={handleAddReply}
                  isRoot
                  canReply={isAuthenticated}
                />
              </div>
            ))}
          </div>
        )}

        {!isLoading && threads.length === 0 && (
          <div className="text-center py-16">
            <Calculator className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-lg font-medium text-foreground mb-2">
              No calculations yet
            </h2>
            <p className="text-muted-foreground">
              {isAuthenticated
                ? 'Start a new thread with any number!'
                : 'Login to start the first calculation!'}
            </p>
          </div>
        )}
      </main>

      {/* Auth Dialog */}
      <AuthDialog
        open={isAuthDialogOpen}
        onOpenChange={setIsAuthDialogOpen}
        defaultTab={authDialogTab}
      />
    </div>
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <HomePage />
    </AuthProvider>
  );
}
