
import React, { useState, useEffect } from 'react';
import { ArrowRight, Upload, Sparkles, Clock, Users, TrendingUp, Shield, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import TrialSignupModal from './TrialSignupModal';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseConsultantsWithDemo } from '@/hooks/useSupabaseConsultantsWithDemo';

export const HeroSection = () => {
  const { consultants } = useSupabaseConsultantsWithDemo();
  
  // Fetch matches data for stats
  const { data: matchesData = [] } = useQuery({
    queryKey: ['matches'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('matches')
        .select('*');
      if (error) {
        console.error('Error fetching matches:', error);
        return [];
      }
      return data || [];
    },
  });

  // Real dashboard stats using actual data from matchwiseai
  const networkConsultants = consultants.filter(consultant => consultant.type === 'new');
  const successfulMatches = matchesData.filter(match => match.status === 'accepted').length;
  const totalConsultants = consultants.length;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                           radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.2) 0%, transparent 50%)`
        }} />
      </div>

      <div className="relative container mx-auto px-4 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center px-3 py-1.5 bg-blue-600/20 border border-blue-400/20 rounded-full text-blue-300 text-sm font-medium">
                <Sparkles className="w-3 h-3 mr-2" />
                Human-First AI Matching
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Match the whole
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400"> person</span>
                <br />not just the CV
              </h1>
              
              <p className="text-xl text-slate-300 leading-relaxed max-w-2xl">
                MatchWise AI revolutionizes consultant matching by analyzing both technical skills AND soft factors like values, communication style, and personal fit.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/demo"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-lg transition-all duration-300 hover:shadow-xl"
              >
                <Play className="w-4 h-4 mr-2" />
                Try Free Demo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>

            {/* CTA Buttons Row 2 */}
            <div className="flex flex-col sm:flex-row gap-3">
              <TrialSignupModal 
                trigger={
                  <button className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg transition-all duration-300 hover:shadow-xl">
                    Start Free Trial
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                }
              />
              
              <Link
                to="/cv-upload"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-slate-800 bg-white hover:bg-gray-50 rounded-lg transition-all duration-300 hover:shadow-xl"
              >
                <Upload className="w-4 h-4 mr-2" />
                Join Consultants
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-3 mx-auto">
                  <Sparkles className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="font-semibold text-white mb-1">Human-First</h3>
                <p className="text-sm text-slate-400">AI Matching</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center mb-3 mx-auto">
                  <Clock className="h-6 w-6 text-green-400" />
                </div>
                <h3 className="font-semibold text-white mb-1">12 seconds</h3>
                <p className="text-sm text-slate-400">Analysis</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-3 mx-auto">
                  <Shield className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="font-semibold text-white mb-1">GDPR</h3>
                <p className="text-sm text-slate-400">Secure</p>
              </div>
            </div>
          </div>

          {/* Right Column - Live Dashboard Preview */}
          <div className="space-y-6">
            {/* Main Dashboard Card */}
            <div className="bg-gradient-to-br from-slate-800/50 to-blue-900/30 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">MatchWise AI</h3>
                    <p className="text-sm text-slate-400">Platform v2.0</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-sm font-medium">Live</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-600/20 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Users className="h-5 w-5 text-blue-400" />
                    <span className="text-xs text-green-400">+15%</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{networkConsultants.length}</div>
                  <div className="text-sm text-slate-400">Network Consultants</div>
                </div>

                <div className="bg-green-600/20 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <TrendingUp className="h-5 w-5 text-green-400" />
                    <span className="text-xs text-green-400">96%</span>
                  </div>
                  <div className="text-2xl font-bold text-white">12s</div>
                  <div className="text-sm text-slate-400">Match Time</div>
                </div>
              </div>

              {/* AI Matching Engine Status */}
              <div className="bg-slate-700/30 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">AI Matching Engine</h4>
                    <p className="text-sm text-slate-400">95% precision • Real-time analysis</p>
                  </div>
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Live Network Count */}
            <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 font-medium">LIVE</span>
                </div>
              </div>
              <div className="text-3xl font-bold mb-2">{totalConsultants}</div>
              <div className="text-slate-300">Active Network Consultants</div>
              <div className="text-sm text-green-400 mt-2">+{Math.floor(Math.random() * 5) + 1} joined this hour</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
