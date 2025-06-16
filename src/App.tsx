
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import Index from "./pages/Index";
import { CVUpload } from "./pages/CVUpload";
import Landing from "./pages/Landing";
import Pricing from "./pages/Pricing";
import Auth from "./pages/Auth";
import { AuthProvider } from "./hooks/useAuth";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const showNavbar = location.pathname !== '/';

  // Set up API route for book-meeting
  React.useEffect(() => {
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
      const [url, options] = args;
      
      if (typeof url === 'string' && url.startsWith('/api/book-meeting')) {
        const supabaseUrl = 'https://sxqmqnfopqzcdqwtjcpd.supabase.co/functions/v1/book-meeting';
        return originalFetch(supabaseUrl, {
          ...options,
          headers: {
            ...options?.headers,
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
        });
      }
      
      return originalFetch.apply(this, args);
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/matchwiseai" element={<Index />} />
        <Route path="/cv-upload" element={<CVUpload />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
