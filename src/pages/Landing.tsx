
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

  // Count only network consultants (type === 'new') and limit to 1 for display
  const networkConsultants = consultants.filter(consultant => consultant.type === 'new').slice(0, 1);
  const totalNetworkConsultants = networkConsultants.length;

  console.log('Total consultants:', consultants.length);
  console.log('Network consultants:', networkConsultants);
  console.log('Network consultant count:', totalNetworkConsultants);

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
            <h2 className="text-4xl font-bold text-white mb-4">See Our AI in Action</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Experience real-time matching that analyzes the whole person in seconds
            </p>
          </div>
          <AIMatchingPreview />
        </div>
      </section>

      <SolutionSection />
      <ComparisonSection />

      {/* About MatchWise Section */}
      <section id="about" className="py-20 bg-slate-800/50 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">About MatchWise</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
              Matching consultants with the right opportunities – based on both skills and personality.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <p className="text-lg text-slate-300 leading-relaxed">
              At MatchWise, we believe that successful consulting engagements depend not only on experience, but on the right human connection. That's why we've built an AI-powered matchmaking platform that goes beyond the traditional CV.
            </p>
            
            <p className="text-lg text-slate-300 leading-relaxed">
              We help companies find top-tier consultants faster, and smarter – by factoring in soft values such as communication style, team dynamics, and culture fit. Meanwhile, consultants can showcase who they really are, not just what they've done.
            </p>
            
            <div className="py-8">
              <h3 className="text-2xl font-bold text-white mb-4">Our mission is simple:</h3>
              <p className="text-lg text-slate-300 leading-relaxed">
                To make finding and hiring consultants smoother, smarter, and more human.
              </p>
            </div>
            
            <p className="text-lg text-slate-300 leading-relaxed mb-8">
              Whether you're a company looking for your next expert, or a consultant ready for your next challenge – MatchWise helps you connect with precision and purpose.
            </p>
            
            <div className="text-center pt-8">
              <p className="text-xl font-semibold text-white mb-2">Join the new era of consultant matchmaking.</p>
              <p className="text-lg text-blue-400 font-medium">Smarter matches. Stronger results.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-slate-900/90 backdrop-blur-sm relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Contact Us</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Ready to transform your consultant matching? Get in touch with us today.
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-slate-300 mb-2">
                  Company
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your company"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tell us about your consultant matching needs..."
                  required
                ></textarea>
              </div>
              
              <div className="text-center">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 shadow-lg"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ROI Calculator Section */}
      <section className="py-20 bg-slate-800/50 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Calculate Your ROI</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              See exactly how much MatchWise AI can save your company
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
