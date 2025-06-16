
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSupabaseConsultantsDedup } from '@/hooks/useSupabaseConsultantsDedup';
import AIMatchingPreview from '@/components/AIMatchingPreview';
import ROICalculator from '@/components/ROICalculator';
import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import ProblemSection from '@/components/landing/ProblemSection';
import SolutionSection from '@/components/landing/SolutionSection';
import ComparisonSection from '@/components/landing/ComparisonSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import PricingSection from '@/components/landing/PricingSection';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/landing/Footer';

export default function Landing() {
  const { user } = useAuth();
  const { consultants } = useSupabaseConsultantsDedup();

  // Count only network consultants
  const networkConsultants = consultants.filter(consultant => consultant.type === 'existing');
  const totalNetworkConsultants = networkConsultants.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 -left-40 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 right-40 w-60 h-60 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <Navbar />
      <HeroSection user={user} totalNetworkConsultants={totalNetworkConsultants} />
      <ProblemSection />
      
      {/* Live AI Matching Demo */}
      <section className="py-20 bg-slate-900/90 backdrop-blur-sm relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Se vår AI i funktion</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Upplev realtidsmatchning som analyserar hela personen på några sekunder
            </p>
          </div>
          <AIMatchingPreview />
        </div>
      </section>

      <SolutionSection />
      <ComparisonSection />

      {/* ROI Calculator Section */}
      <section className="py-20 bg-slate-800/90 backdrop-blur-sm relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Beräkna din ROI</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Se exakt hur mycket MatchWise AI kan spara ditt företag
            </p>
          </div>
          <ROICalculator />
        </div>
      </section>

      <TestimonialsSection />
      <PricingSection />
      <CTASection user={user} />
      <Footer />
    </div>
  );
}
