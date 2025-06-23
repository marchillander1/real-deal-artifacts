
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

import Landing from './pages/Landing';
import Demo from './pages/Demo';
import Pricing from './pages/Pricing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import CVUploadComplete from './pages/CVUploadComplete';
import CVUploadModern from './pages/CVUploadModern';
import NetworkSuccess from './pages/NetworkSuccess';
import AnalysisPage from './pages/AnalysisPage';
import MyProfile from './pages/MyProfile';
import UserProfile from './pages/UserProfile';
import NotFound from './pages/NotFound';
import AdminPortal from './pages/AdminPortal';
import Navbar from './components/Navbar';
import { AuthGuard } from './components/AuthGuard';
import { useAuth } from '@/hooks/useAuth';
import Logo from '@/components/Logo';
import CVUpload from './pages/CVUpload';

const queryClient = new QueryClient();

function App() {
  const { toast } = useToast();
  const { user } = useAuth();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      toast({
        title: "File Uploaded!",
        description: `You uploaded ${file.name}`,
      });
    }
  };

  const handleMatch = (assignment: any) => {
    toast({
      title: "Matching Started",
      description: `Finding consultants for ${assignment.title}`,
    });
  };

  const handleAssignmentCreated = (newAssignment: any) => {
    toast({
      title: "Assignment Created!",
      description: `New assignment ${newAssignment.title} added`,
    });
  };

  const demoAssignments = [
    { 
      id: 1, 
      title: "Frontend Developer", 
      description: "React experience required",
      company: "Tech Corp",
      clientLogo: "",
      requiredSkills: ["React", "TypeScript"],
      workload: "Full-time",
      duration: "6 months",
      location: "Stockholm",
      urgency: "High" as const,
      budget: "100000",
      hourlyRate: 800,
      status: "open" as const,
      matchedConsultants: 0,
      createdAt: new Date().toISOString(),
      remote: "Yes",
      teamSize: "5-10",
      teamCulture: "Collaborative",
      industry: "Technology"
    },
    { 
      id: 2, 
      title: "Backend Engineer", 
      description: "Node.js and Express expertise",
      company: "Dev Studio",
      clientLogo: "",
      requiredSkills: ["Node.js", "Express"],
      workload: "Part-time",
      duration: "3 months",
      location: "Gothenburg",
      urgency: "Medium" as const,
      budget: "75000",
      hourlyRate: 750,
      status: "open" as const,
      matchedConsultants: 0,
      createdAt: new Date().toISOString(),
      remote: "No",
      teamSize: "3-5",
      teamCulture: "Agile",
      industry: "Software"
    }
  ];

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/auth" element={<Auth />} />
            <Route 
              path="/adminportal" 
              element={
                <AuthGuard>
                  <AdminPortal />
                </AuthGuard>
              } 
            />
            <Route 
              path="/matchwiseai" 
              element={
                <AuthGuard>
                  <div className="min-h-screen bg-gray-50">
                    <Navbar onFileUpload={handleFileUpload} />
                    <Dashboard 
                      assignments={demoAssignments}
                      onMatch={handleMatch}
                      onAssignmentCreated={handleAssignmentCreated}
                      onFileUpload={handleFileUpload}
                    />
                  </div>
                </AuthGuard>
              } 
            />
            <Route 
              path="/cv-upload" 
              element={
                <div className="min-h-screen bg-gray-50">
                  <CVUpload />
                </div>
              } 
            />
            <Route 
              path="/cv-upload-modern" 
              element={
                <div className="min-h-screen bg-gray-50">
                  <CVUploadModern />
                </div>
              } 
            />
            <Route 
              path="/cv-upload-complete" 
              element={
                <div className="min-h-screen bg-gray-50">
                  <CVUploadComplete />
                </div>
              } 
            />
            <Route 
              path="/network-success" 
              element={
                <div className="min-h-screen bg-gray-50">
                  <NetworkSuccess />
                </div>
              } 
            />
            <Route 
              path="/analysis" 
              element={
                <AuthGuard>
                  <AnalysisPage />
                </AuthGuard>
              } 
            />
            <Route 
              path="/my-profile" 
              element={
                <AuthGuard>
                  <MyProfile />
                </AuthGuard>
              } 
            />
            <Route 
              path="/account" 
              element={
                <AuthGuard>
                  <UserProfile />
                </AuthGuard>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
    </QueryClientProvider>
  );
}

export default App;
