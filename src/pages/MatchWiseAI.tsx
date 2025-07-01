
import React from 'react';
import { AuthGuard } from '@/components/AuthGuard';
import { DashboardTabs } from '@/components/DashboardTabs';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import Logo from '@/components/Logo';

const MatchWiseAI: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Logo size="md" variant="full" />
              <div className="text-sm text-gray-600">
                Dashboard
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>{user?.email}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={signOut}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">MatchWise AI Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Welcome to your MatchWise dashboard. Manage consultants, assignments, and view analytics.
            </p>
          </div>
          <DashboardTabs />
        </main>
      </div>
    </AuthGuard>
  );
};

export default MatchWiseAI;
