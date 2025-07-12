
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap, Shield, Brain, Target, Users, BarChart3, Upload, Building2, ArrowRight, Play, Clock, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';
import Navbar from '@/components/landing/Navbar';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import PricingSection from '@/components/landing/PricingSection';
import ContactSection from '@/components/landing/ContactSection';
import Footer from '@/components/landing/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-sm"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          {/* Intro Tagline */}
          <p className="text-lg text-blue-200 mb-6 font-medium italic">
            "Resumes tell a story. But the human behind it brings it to life."
          </p>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
            Stop guessing.
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent block">
              Start knowing.
            </span>
          </h1>
          
          <p className="text-xl text-gray-200 mb-8 max-w-4xl mx-auto leading-relaxed">
            Match the whole person — not just the CV.<br />
            Our Human-First AI analyzes skills, personality, values, and hidden strengths. No endless interviews. Just real matches that deliver.
          </p>

          {/* Live Indicator */}
          <div className="flex items-center justify-center mb-12">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-full px-6 py-3">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                <span className="text-white font-semibold">🚀 54 consultants ready to match today</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link to="/cv-upload">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-semibold rounded-xl flex items-center">
                <Upload className="h-5 w-5 mr-2" />
                Upload CV
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            
            <Link to="/talent-activation">
              <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20 px-8 py-4 text-lg font-semibold rounded-xl backdrop-blur-sm">
                <Zap className="h-5 w-5 mr-2" />
                Activate Talent
              </Button>
            </Link>

            <Link to="/matchwiseai">
              <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20 px-8 py-4 text-lg font-semibold rounded-xl backdrop-blur-sm">
                <Users className="h-5 w-5 mr-2" />
                Log In
              </Button>
            </Link>
          </div>

          {/* Try Now Button */}
          <div className="flex justify-center mb-16">
            <Link to="/demo">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl flex items-center">
                <Play className="h-5 w-5 mr-2" />
                Try Now
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Differentiation Section */}
      <section className="py-20 bg-slate-800/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Traditional matching misses what matters.
          </h2>
          <p className="text-xl text-slate-300 mb-6 max-w-3xl mx-auto">
            60% of project failures happen because of poor human fit — not technical shortcomings.<br />
            Stop paying for "maybe." Only pay when you win.
          </p>
          <p className="text-2xl font-bold text-white">
            💎 No risk. No lock-ins. Just 2% when you land the right consultant.
          </p>
        </div>
      </section>

      {/* Value Proposition Blocks */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {/* For Companies */}
            <div className="bg-slate-800/50 p-8 rounded-xl border border-slate-700 text-center">
              <Building2 className="h-12 w-12 text-blue-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">For Companies</h3>
              <p className="text-lg text-slate-300 mb-6">Slash hiring guesswork. Only pay when your consultant starts.</p>
              <ul className="space-y-3 text-slate-300 text-left">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-400 mr-3 mt-0.5" />
                  Access pre-vetted, market-ready consultants.
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-400 mr-3 mt-0.5" />
                  Search, filter & shortlist with deep insights.
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-400 mr-3 mt-0.5" />
                  Only pay 2% success fee when they start.
                </li>
              </ul>
            </div>

            {/* For Consulting Firms */}
            <div className="bg-slate-800/50 p-8 rounded-xl border border-slate-700 text-center">
              <Users className="h-12 w-12 text-purple-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">For Consulting Firms</h3>
              <p className="text-lg text-slate-300 mb-6">Keep your bench active and billable — always.</p>
              <ul className="space-y-3 text-slate-300 text-left">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-400 mr-3 mt-0.5" />
                  Upload and activate your entire team.
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-400 mr-3 mt-0.5" />
                  Control pricing, visibility, and availability.
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-400 mr-3 mt-0.5" />
                  Zero upfront costs. Just 2% when placed.
                </li>
              </ul>
            </div>

            {/* For Independent Consultants */}
            <div className="bg-slate-800/50 p-8 rounded-xl border border-slate-700 text-center">
              <Target className="h-12 w-12 text-green-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">For Independent Consultants</h3>
              <p className="text-lg text-slate-300 mb-6">Stop being invisible. Become irresistible.</p>
              <ul className="space-y-3 text-slate-300 text-left">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-400 mr-3 mt-0.5" />
                  Upload CV & LinkedIn in minutes.
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-400 mr-3 mt-0.5" />
                  Get an AI-crafted, ready-to-pitch profile.
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-400 mr-3 mt-0.5" />
                  Get noticed. Win more gigs.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-20 bg-slate-800/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="text-center">
              <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Upload & Analyze</h3>
              <p className="text-slate-300">
                Show us who you are — beyond keywords.<br />
                Our Human-First AI deeply analyzes your skills, personality, values, and hidden strengths.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="bg-purple-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Match & Shortlist</h3>
              <p className="text-slate-300">
                We match the whole person to ensure a true human and technical fit — not just "paper perfect."
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Win & Grow</h3>
              <p className="text-slate-300">
                Win new projects with confidence. Only pay when it's real.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <PricingSection />

      {/* About MatchWise AI */}
      <section className="py-20 bg-slate-800/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            About MatchWise AI
          </h2>
          <div className="max-w-4xl mx-auto text-slate-300 text-lg space-y-6">
            <p>
              We're revolutionizing the way companies find IT consultants through our AI-powered matching platform.
              Our mission? Connect the right talent with the right opportunities — in record time.
            </p>
            <p className="text-xl text-white font-semibold">
              Human-First AI that truly understands. MatchWise AI analyzes the <em>whole person</em> — both technical skills and soft factors — to guarantee the perfect fit.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Teaser */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Want to see exactly how it all works?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Choose your path. Upload. Analyze. Match. Win.
          </p>
          <Link to="/how-it-works">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl">
              See How It Works
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Ready to match the whole person and win?
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/cv-upload">
              <Button size="lg" className="bg-white text-blue-600 px-8 py-4 text-lg font-semibold rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <Upload className="h-5 w-5 mr-2" />
                Upload CV
              </Button>
            </Link>
            
            <Link to="/talent-activation">
              <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20 px-8 py-4 text-lg font-semibold rounded-xl backdrop-blur-sm">
                <Zap className="h-5 w-5 mr-2" />
                Activate Talent
              </Button>
            </Link>

            <Link to="/matchwiseai">
              <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20 px-8 py-4 text-lg font-semibold rounded-xl backdrop-blur-sm">
                <Users className="h-5 w-5 mr-2" />
                Log In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
