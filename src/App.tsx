
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import CVUpload from "./pages/CVUpload";
import Analysis from "./pages/Analysis";
import MyProfile from "./pages/MyProfile";
import CVUploadModern from "./pages/CVUploadModern";
import CVUploadComplete from "./pages/CVUploadComplete";
import NetworkSuccess from "./pages/NetworkSuccess";
import NotFound from "./pages/NotFound";
import Landing from "./pages/Landing";
import Demo from "./pages/Demo";
import Auth from "./pages/Auth";
import Pricing from "./pages/Pricing";
import UserProfile from "./pages/UserProfile";
import AdminPortal from "./pages/AdminPortal";
import AnalysisPage from "./pages/AnalysisPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index assignments={[]} onMatch={() => {}} onAssignmentCreated={() => {}} onFileUpload={() => {}} />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard assignments={[]} onMatch={() => {}} onAssignmentCreated={() => {}} onFileUpload={() => {}} />} />
          <Route path="/cv-upload" element={<CVUpload />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path="/cv-upload-modern" element={<CVUploadModern />} />
          <Route path="/cv-upload-complete" element={<CVUploadComplete />} />
          <Route path="/network-success" element={<NetworkSuccess />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/admin-portal" element={<AdminPortal />} />
          <Route path="/analysis-page" element={<AnalysisPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
