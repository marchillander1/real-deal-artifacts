
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';

export const ModernNavbar: React.FC = () => {
  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Logo size="md" variant="full" />
          </Link>
          
          <div className="flex items-center">
            <Link to="/auth" className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-200 transform hover:scale-105">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
