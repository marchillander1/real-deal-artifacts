import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import Logo from './Logo';

export function Navbar() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Utloggad!');
    } catch (error: any) {
      toast.error('Kunde inte logga ut');
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <Logo />
        
        <div className="flex items-center gap-4">
          {user && (
            <span className="text-sm text-gray-600">
              Inloggad som {user.email}
            </span>
          )}
          <Button 
            variant="outline" 
            onClick={handleSignOut}
            size="sm"
          >
            Logga ut
          </Button>
        </div>
      </div>
    </nav>
  );
}
