
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from '@/pages/Landing';
import Demo from '@/pages/Demo';
import CVUploadModern from '@/pages/CVUploadModern';
import CVUploadComplete from '@/pages/CVUploadComplete';
import AnalysisPage from '@/pages/AnalysisPage';
import NetworkSuccess from '@/pages/NetworkSuccess';
import Pricing from '@/pages/Pricing';
import { PricingAuth } from '@/components/PricingAuth';
import Auth from '@/pages/Auth';
import { Dashboard } from '@/components/Dashboard';
import NotFound from '@/pages/NotFound';
import { AuthGuard } from '@/components/AuthGuard';
import { AuthProvider } from '@/hooks/useAuth';
import { Toaster } from '@/components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MyProfile from '@/pages/MyProfile';

const queryClient = new QueryClient();

function App() {
  return (
    <Router>
      <div className="App">
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/demo" element={<Demo />} />
              <Route path="/cv-upload" element={<CVUploadModern />} />
              <Route path="/cv-upload-complete" element={<CVUploadComplete />} />
              <Route path="/analysis" element={<AnalysisPage />} />
              <Route path="/network-success" element={<NetworkSuccess />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/pricing-auth" element={<PricingAuth />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/my-profile" element={<MyProfile />} />
              <Route
                path="/matchwiseai"
                element={
                  <AuthGuard>
                    <Dashboard />
                  </AuthGuard>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </AuthProvider>
        </QueryClientProvider>
      </div>
    </Router>
  );
}

export default App;
