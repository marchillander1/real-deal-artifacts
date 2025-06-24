
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AnalysisResults from '@/pages/AnalysisResults';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<div className="p-8 text-center"><h1 className="text-2xl">Welcome to MatchWise</h1><p>Navigate to /analysis?id=your-analysis-id to view results</p></div>} />
            <Route path="/analysis" element={<AnalysisResults />} />
          </Routes>
        </BrowserRouter>
      </div>
    </QueryClientProvider>
  );
}

export default App;
