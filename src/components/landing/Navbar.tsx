
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';

export default function Navbar() {
  return (
    <nav className="bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Logo size="md" variant="full" />
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild className="text-slate-300 hover:text-white hover:bg-slate-800">
              <Link to="/demo">Try Demo</Link>
            </Button>
            <Button variant="ghost" asChild className="text-slate-300 hover:text-white hover:bg-slate-800">
              <Link to="/demo">Try Our System</Link>
            </Button>
            <Button variant="ghost" onClick={() => window.open('/cv-upload', '_blank')} className="text-slate-300 hover:text-white hover:bg-slate-800">
              Upload CV
            </Button>
            <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
              <Link to="/pricing-auth">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
