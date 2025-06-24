import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';

import { QueryClient } from '@tanstack/react-query';

import { LandingPage } from '@/pages/LandingPage';
import { CVUploadPage } from '@/pages/CVUploadPage';
import { PricingPage } from '@/pages/PricingPage';
import { BlogPage } from '@/pages/BlogPage';
import { ContactPage } from '@/pages/ContactPage';
import { TermsPage } from '@/pages/TermsPage';
import { PrivacyPage } from '@/pages/PrivacyPage';
import { MyConsultantPage } from '@/pages/MyConsultantPage';
import { PublishProfilePage } from '@/pages/PublishProfilePage';
import { AssignmentsPage } from '@/pages/AssignmentsPage';
import { FindConsultantPage } from '@/pages/FindConsultantPage';
import { GDPRCompliancePage } from '@/pages/GDPRCompliancePage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { ComingSoonPage } from '@/pages/ComingSoonPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { SkillAlertsPage } from '@/pages/SkillAlertsPage';
import { AccountSettingsPage } from '@/pages/AccountSettingsPage';
import { BillingPage } from '@/pages/BillingPage';
import { SavedProfilesPage } from '@/pages/SavedProfilesPage';
import { SavedAssignmentsPage } from '@/pages/SavedAssignmentsPage';
import { MessagesPage } from '@/pages/MessagesPage';
import { OnboardingPage } from '@/pages/OnboardingPage';
import { useUser } from '@clerk/clerk-react';
import { redirect } from 'react-router-dom';
import AnalysisResults from '@/pages/AnalysisResults';

function App() {
  return (
    <QueryClient>
      <div className="min-h-screen bg-background">
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/cv-upload" element={<CVUploadPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/my-consultant" element={<MyConsultantPage />} />
            <Route path="/publish-profile" element={<PublishProfilePage />} />
            <Route path="/assignments" element={<AssignmentsPage />} />
            <Route path="/find-consultant" element={<FindConsultantPage />} />
            <Route path="/gdpr-compliance" element={<GDPRCompliancePage />} />
            <Route path="/not-found" element={<NotFoundPage />} />
            <Route path="/coming-soon" element={<ComingSoonPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/skill-alerts" element={<SkillAlertsPage />} />
            <Route path="/account-settings" element={<AccountSettingsPage />} />
            <Route path="/billing" element={<BillingPage />} />
            <Route path="/saved-profiles" element={<SavedProfilesPage />} />
            <Route path="/saved-assignments" element={<SavedAssignmentsPage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/analysis" element={<AnalysisResults />} />
          </Routes>
        </BrowserRouter>
      </div>
    </QueryClient>
  );
}

export default App;
