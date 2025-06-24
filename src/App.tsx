
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Index from '@/pages/Index';
import Landing from '@/pages/Landing';
import Dashboard from '@/pages/Dashboard';
import Auth from '@/pages/Auth';
import CVUpload from '@/pages/CVUpload';
import CVUploadModern from '@/pages/CVUploadModern';
import CVUploadComplete from '@/pages/CVUploadComplete';
import NetworkSuccess from '@/pages/NetworkSuccess';
import Analysis from '@/pages/Analysis';
import AnalysisPage from '@/pages/AnalysisPage';
import AnalysisResults from '@/pages/AnalysisResults';
import Demo from '@/pages/Demo';
import Pricing from '@/pages/Pricing';
import UserProfile from '@/pages/UserProfile';
import MyProfile from '@/pages/MyProfile';
import AdminPortal from '@/pages/AdminPortal';
import MatchWiseAI from '@/pages/MatchWiseAI';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/cv-upload" element={<CVUpload />} />
            <Route path="/cv-upload-modern" element={<CVUploadModern />} />
            <Route path="/cv-upload-complete" element={<CVUploadComplete />} />
            <Route path="/network-success" element={<NetworkSuccess />} />
            <Route path="/analysis" element={<AnalysisResults />} />
            <Route path="/analysis-page" element={<AnalysisPage />} />
            <Route path="/analysis-old" element={<Analysis />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/user-profile" element={<UserProfile />} />
            <Route path="/my-profile" element={<MyProfile />} />
            <Route path="/admin" element={<AdminPortal />} />
            <Route path="/matchwise-ai" element={<MatchWiseAI />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
    </QueryClientProvider>
  );
}

export default App;
