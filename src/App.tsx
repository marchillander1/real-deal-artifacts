
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import MatchWiseAI from "./pages/MatchWiseAI";
import CVUpload from "./pages/CVUpload";
import CVUploadModern from "./pages/CVUploadModern";
import CVUploadComplete from "./pages/CVUploadComplete";
import Analysis from "./pages/Analysis";
import AnalysisPage from "./pages/AnalysisPage";
import AnalysisResults from "./pages/AnalysisResults";
import MyProfile from "./pages/MyProfile";
import UserProfile from "./pages/UserProfile";
import NetworkSuccess from "./pages/NetworkSuccess";
import Demo from "./pages/Demo";
import Pricing from "./pages/Pricing";
import Reports from "./pages/Reports";
import AdminPortal from "./pages/AdminPortal";
import NotFound from "./pages/NotFound";
import { CVUploadPage } from "./components/cv-upload-new/CVUploadPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/matchwiseai" element={<MatchWiseAI />} />
          <Route path="/cv-upload" element={<CVUpload />} />
          <Route path="/cv-upload-new" element={<CVUploadPage />} />
          <Route path="/cv-upload-modern" element={<CVUploadModern />} />
          <Route path="/cv-upload-complete" element={<CVUploadComplete />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/analysis/:id" element={<AnalysisPage />} />
          <Route path="/analysis-results" element={<AnalysisResults />} />
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/network-success" element={<NetworkSuccess />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/admin" element={<AdminPortal />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
