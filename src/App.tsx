
import React from 'react';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import Automations from "./pages/Automations";
import MatchWiseAI from "./pages/MatchWiseAI";
import Dashboard from "./pages/Dashboard";
import CVUpload from "./pages/CVUpload";
import Analysis from "./pages/Analysis";
import Reports from "./pages/Reports";
import MyProfile from "./pages/MyProfile";
import AdminPortal from "./pages/AdminPortal";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/automations" element={<Automations />} />
          <Route path="/matchwiseai" element={<MatchWiseAI />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cv-upload" element={<CVUpload />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path="/admin" element={<AdminPortal />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
