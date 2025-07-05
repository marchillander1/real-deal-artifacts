
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Users, TrendingUp, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-20">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-sm"></div>
      
      <div className="relative z-10 max-w-6xl mx-auto text-center">
        <div className="mb-8">
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-6">
            <Zap className="h-4 w-4 mr-2" />
            AI-Powered Consultant Matching
          </span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
          Find Perfect
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {" "}Consultants{" "}
          </span>
          in Minutes
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-4xl mx-auto leading-relaxed">
          Revolutionary AI technology that analyzes CVs, LinkedIn profiles, and soft skills 
          to match you with the perfect consultants for any project.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
          <Link to="/cv-upload">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
              <Upload className="h-5 w-5 mr-2" />
              Upload Your CV
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
          
          <Link to="/matchwiseai">
            <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20 px-8 py-4 text-lg font-semibold rounded-xl backdrop-blur-sm">
              Explore Platform
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center p-6 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20">
            <Users className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">500+ Consultants</h3>
            <p className="text-gray-300">Verified experts across all industries</p>
          </div>
          
          <div className="text-center p-6 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20">
            <Zap className="h-12 w-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">AI Matching</h3>
            <p className="text-gray-300">95% accuracy in consultant matching</p>
          </div>
          
          <div className="text-center p-6 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20">
            <TrendingUp className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">60% Faster</h3>
            <p className="text-gray-300">Reduce hiring time dramatically</p>
          </div>
        </div>
      </div>
    </section>
  );
};
