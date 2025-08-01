
import React from 'react';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { AuthGuard } from "@/components/AuthGuard";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import HowItWorks from "./pages/HowItWorks";
import Automations from "./pages/Automations";
import MatchWiseAI from "./pages/MatchWiseAI";
import CVUpload from "./pages/CVUpload";
import CVUploadModern from "./pages/CVUploadModern";
import TalentActivation from "./pages/TalentActivation";
import Analysis from "./pages/Analysis";
import Reports from "./pages/Reports";
import MyProfile from "./pages/MyProfile";
import DemoConsultant from "./pages/DemoConsultant";
import AdminPortal from "./pages/AdminPortal";
import Demo from "./pages/Demo";
import Auth from "./pages/Auth";
import AIPowerBriefing from "./pages/AIPowerBriefing";
import ICPOutreach from "./pages/ICPOutreach";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <AuthGuard>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/landing" element={<Landing />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/automations" element={<Automations />} />
                <Route path="/matchwiseai" element={<MatchWiseAI />} />
                <Route path="/dashboard" element={<MatchWiseAI />} />
                <Route path="/cv-upload" element={<CVUpload />} />
                <Route path="/cv-upload-new" element={<CVUploadModern />} />
                <Route path="/talent-activation" element={<TalentActivation />} />
                <Route path="/analysis" element={<Analysis />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/my-profile" element={<MyProfile />} />
                <Route path="/demo-consultant" element={<DemoConsultant />} />
                <Route path="/admin" element={<AdminPortal />} />
                <Route path="/aipowerbriefing" element={<AIPowerBriefing />} />
                <Route path="/icp-outreach" element={<ICPOutreach />} />
                
                <Route path="/demo" element={<Demo />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthGuard>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
