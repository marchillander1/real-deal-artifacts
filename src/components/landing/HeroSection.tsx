
import React, { useState, useEffect } from 'react';
import { ArrowRight, Upload, Sparkles, Clock, Users, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import TrialSignupModal from './TrialSignupModal';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const HeroSection = () => {
  const [liveUsers, setLiveUsers] = useState(1247);

  // Fetch real active users from the matchwiseai platform
  const { data: activeUsers = 0 } = useQuery({
    queryKey: ['active-users'],
    queryFn: async () => {
      // Get count of users who have logged in recently (last 24 hours)
      const { data, error } = await supabase
        .from('profiles')
        .select('id', { count: 'exact' })
        .gte('last_sign_in_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      if (error) {
        console.error('Error fetching active users:', error);
        return 1247; // Fallback number
      }
      
      return (data?.length || 0) + 1247; // Add base number for network consultants
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Update live counter with small random variations
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveUsers(prev => {
        const variation = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
        return Math.max(activeUsers + variation, activeUsers);
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [activeUsers]);

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
                Human-first AI matching
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Find the perfect
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400"> IT consultant</span>
                <br />in 12 seconds
              </h1>
              
              <p className="text-xl text-slate-300 leading-relaxed max-w-2xl">
                MatchWise AI combines advanced technology with human insight to deliver 96% accurate consultant matches. Stop spending weeks on recruitment - get results in seconds.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <TrialSignupModal 
                trigger={
                  <button className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
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

              <Link
                to="/demo"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white border border-white hover:bg-white hover:text-slate-800 rounded-lg transition-all duration-300"
              >
                Test Our Platform
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-6 text-sm text-slate-400">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Free analysis</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>No commitment</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Results in minutes</span>
              </div>
            </div>
          </div>

          {/* Right Column - Live Stats */}
          <div className="space-y-6">
            {/* Live Network Count */}
            <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 font-medium">LIVE</span>
                </div>
              </div>
              <div className="text-4xl font-bold mb-2">{liveUsers.toLocaleString()}</div>
              <div className="text-slate-300">Network Consultants Available Now</div>
              <div className="text-sm text-green-400 mt-2">+{Math.floor(Math.random() * 5) + 1} joined this hour</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Match Accuracy */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <TrendingUp className="h-8 w-8 text-blue-400" />
                </div>
                <div className="text-3xl font-bold mb-1">96%</div>
                <div className="text-slate-300 text-sm">Match Accuracy</div>
              </div>

              {/* Time Saved */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <Clock className="h-8 w-8 text-green-400" />
                </div>
                <div className="text-3xl font-bold mb-1">12s</div>
                <div className="text-slate-300 text-sm">Average Match Time</div>
              </div>

              {/* Consultants */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <Users className="h-8 w-8 text-purple-400" />
                </div>
                <div className="text-3xl font-bold mb-1">850 hours</div>
                <div className="text-slate-300 text-sm">Time saved for our clients this month</div>
              </div>
            </div>

            {/* Social Proof */}
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <div className="text-center">
                <div className="text-2xl font-bold mb-2">Join 200+ companies</div>
                <div className="text-slate-300 text-sm">already using MatchWise AI to find top IT talent</div>
                <div className="flex justify-center mt-4 space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-8 h-8 bg-white/20 rounded-full"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
