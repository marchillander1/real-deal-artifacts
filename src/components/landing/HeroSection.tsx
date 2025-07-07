
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Users, Clock, Shield, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-20">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-sm"></div>
      
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Main Content */}
          <div>
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100/20 border border-blue-200/30 text-blue-200 text-sm font-medium backdrop-blur-sm">
                <Sparkles className="h-4 w-4 mr-2" />
                Human-First AI Matching
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
              Match the whole
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent block">
                person
              </span>
              not just the CV
            </h1>
            
            <p className="text-xl text-gray-200 mb-12 max-w-2xl leading-relaxed">
              MatchWise AI revolutionizes consultant matching by analyzing both technical skills AND soft factors like values, communication style, and personal fit.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link to="/demo">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-semibold rounded-xl flex items-center">
                  <Play className="h-5 w-5 mr-2" />
                  Try Free Demo
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              
              <Link to="/cv-upload-new">
                <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20 px-8 py-4 text-lg font-semibold rounded-xl backdrop-blur-sm">
                  <Users className="h-5 w-5 mr-2" />
                  Join Consultants
                </Button>
              </Link>
            </div>

            {/* Bottom Features */}
            <div className="grid grid-cols-3 gap-8">
              <div className="text-center">
                <Sparkles className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-1">Human-First</h3>
                <p className="text-gray-300 text-sm">AI Matching</p>
              </div>
              
              <div className="text-center">
                <Clock className="h-8 w-8 text-green-400 mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-1">12 seconds</h3>
                <p className="text-gray-300 text-sm">Analysis</p>
              </div>
              
              <div className="text-center">
                <Shield className="h-8 w-8 text-purple-400 mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-1">GDPR</h3>
                <p className="text-gray-300 text-sm">Secure</p>
              </div>
            </div>
          </div>

          {/* Right Column - Live Stats Card */}
          <div className="flex justify-center lg:justify-end">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 w-full max-w-md">
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-green-400 font-semibold text-sm uppercase tracking-wide">LIVE</span>
                </div>
                
                <div className="text-6xl font-bold text-white mb-2">54</div>
                <p className="text-gray-300 text-lg mb-4">Active Network Consultants</p>
                
                <div className="text-green-400 text-sm">
                  +2 joined this hour
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
