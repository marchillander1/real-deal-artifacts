
import React, { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { AuthGuard } from "@/components/AuthGuard";
import { Assignment } from "./types/consultant";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import CVUpload from "./pages/CVUpload";
import Pricing from "./pages/Pricing";

const queryClient = new QueryClient();

const AppContent = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  const handleMatch = (assignment: Assignment) => {
    console.log("Matching assignment:", assignment);
  };

  const handleAssignmentCreated = (assignment: Assignment) => {
    setAssignments(prev => [...prev, assignment]);
    console.log("Assignment created:", assignment);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("File uploaded:", event.target.files);
  };

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/cv-upload" element={<CVUpload />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route 
        path="/matchwiseai" 
        element={
          <AuthGuard>
            <Dashboard 
              assignments={assignments}
              onMatch={handleMatch}
              onAssignmentCreated={handleAssignmentCreated}
              onFileUpload={handleFileUpload}
            />
          </AuthGuard>
        } 
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
        <Toaster />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
