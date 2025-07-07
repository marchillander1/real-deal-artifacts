
import React from 'react';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import Automations from "./pages/Automations";
import MatchWiseAI from "./pages/MatchWiseAI";
import CVUpload from "./pages/CVUpload";
import CVUploadModern from "./pages/CVUploadModern";
import Analysis from "./pages/Analysis";
import Reports from "./pages/Reports";
import MyProfile from "./pages/MyProfile";
import AdminPortal from "./pages/AdminPortal";
import Demo from "./pages/Demo";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/automations" element={<Automations />} />
            <Route path="/matchwiseai" element={<MatchWiseAI />} />
            <Route path="/dashboard" element={<MatchWiseAI />} />
            <Route path="/cv-upload" element={<CVUpload />} />
            <Route path="/cv-upload-new" element={<CVUploadModern />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/my-profile" element={<MyProfile />} />
            <Route path="/admin" element={<AdminPortal />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
