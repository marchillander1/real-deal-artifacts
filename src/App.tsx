import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { AuthGuard } from "@/components/AuthGuard";
import { Navbar } from "@/components/Navbar";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import { PricingAuth } from "./components/PricingAuth";
import NotFound from "./pages/NotFound";
import Pricing from "./pages/Pricing";
import CVUpload from "./pages/CVUpload";
import CVUploadModern from "./pages/CVUploadModern";
import AnalysisPage from "./pages/AnalysisPage";
import Demo from "./pages/Demo";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <BrowserRouter>
            <div className="min-h-screen bg-background font-sans antialiased">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/demo" element={<Demo />} />
                <Route path="/pricing-auth" element={<PricingAuth />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/cv-upload" element={<CVUploadModern />} />
                <Route path="/analysis" element={<AnalysisPage />} />
                
                {/* Legacy CV upload (keep for backwards compatibility) */}
                <Route path="/cv-upload-legacy" element={<CVUpload />} />
                
                {/* Protected routes */}
                <Route path="/matchwiseai" element={
                  <AuthGuard>
                    <Navbar />
                    <Index />
                  </AuthGuard>
                } />
                
                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
