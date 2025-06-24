
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Index from "./pages/Index"
import Dashboard from "./pages/Dashboard"
import Reports from "./pages/Reports"
import CVUpload from "./pages/CVUpload"
import CVUploadModern from "./pages/CVUploadModern"
import CVUploadComplete from "./pages/CVUploadComplete"
import NetworkSuccess from "./pages/NetworkSuccess"
import AnalysisResults from "./pages/AnalysisResults"
import AnalysisPage from "./pages/AnalysisPage"
import Analysis from "./pages/Analysis"
import Auth from "./pages/Auth"
import MyProfile from "./pages/MyProfile"
import UserProfile from "./pages/UserProfile"
import Landing from "./pages/Landing"
import Demo from "./pages/Demo"
import Pricing from "./pages/Pricing"
import MatchWiseAI from "./pages/MatchWiseAI"
import AdminPortal from "./pages/AdminPortal"
import NotFound from "./pages/NotFound"

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/cv-upload" element={<CVUpload />} />
            <Route path="/cv-upload-modern" element={<CVUploadModern />} />
            <Route path="/cv-upload-complete" element={<CVUploadComplete />} />
            <Route path="/network-success" element={<NetworkSuccess />} />
            <Route path="/analysis-results" element={<AnalysisResults />} />
            <Route path="/analysis-page" element={<AnalysisPage />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/my-profile" element={<MyProfile />} />
            <Route path="/user-profile" element={<UserProfile />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/matchwise-ai" element={<MatchWiseAI />} />
            <Route path="/admin" element={<AdminPortal />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  )
}

export default App
