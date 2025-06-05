
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Play, Heart, Clock, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';
import { useAuth } from '@/hooks/useAuth';

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <header className="border-b border-gray-700 bg-gray-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Logo />
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#solution" className="text-gray-300 hover:text-white transition-colors">Solution</a>
            <a href="#benefits" className="text-gray-300 hover:text-white transition-colors">Benefits</a>
            <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
          </nav>
          <div className="flex items-center space-x-4">
            {user ? (
              <Link to="/matchwiseai">
                <Button>
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Content */}
            <div>
              <Badge className="mb-6 bg-blue-600/20 text-blue-300 border-blue-500">
                <Heart className="w-3 h-3 mr-1" />
                Human-First AI Matching
              </Badge>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Match the
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 block">
                  Whole Person
                </span>
                <span className="text-white">not just the CV</span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
                MatchWise AI revolutionizes consultant matching by analyzing both technical skills AND soft factors 
                like values, communication style, and personal fit.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button size="lg" className="px-8 py-3 text-lg bg-blue-600 hover:bg-blue-700">
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
                {!user && (
                  <Link to="/auth">
                    <Button variant="outline" size="lg" className="px-8 py-3 text-lg border-gray-600 text-white hover:bg-gray-800">
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                )}
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Heart className="h-5 w-5 text-pink-400 mr-2" />
                    <span className="text-white font-medium">Human-First</span>
                  </div>
                  <span className="text-gray-400 text-sm">Matching</span>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Clock className="h-5 w-5 text-blue-400 mr-2" />
                    <span className="text-white font-medium">12-Second</span>
                  </div>
                  <span className="text-gray-400 text-sm">Analysis</span>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Shield className="h-5 w-5 text-purple-400 mr-2" />
                    <span className="text-white font-medium">GDPR</span>
                  </div>
                  <span className="text-gray-400 text-sm">Secure</span>
                </div>
              </div>
            </div>

            {/* Right side - Dashboard Preview */}
            <div className="relative">
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                      <Logo />
                      <span className="text-white font-semibold">Platform v2.0</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-green-400 text-sm">Active</span>
                    </div>
                  </div>

                  <p className="text-gray-400 mb-6">Real-time insights and performance metrics</p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <Card className="bg-gray-700/50 border-gray-600">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-300 text-sm">Active Consultants</span>
                          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">👥</span>
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-white mb-1">5</div>
                        <div className="text-green-400 text-xs">+12 this week</div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-700/50 border-gray-600">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-300 text-sm">Open Assignments</span>
                          <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">📋</span>
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-white mb-1">3</div>
                        <div className="text-green-400 text-xs">+5 today</div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="bg-gray-700/30 border-gray-600">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm">🤖</span>
                          </div>
                          <div>
                            <div className="text-white font-medium">AI Matching Engine</div>
                            <div className="text-gray-400 text-sm">95% accuracy • 12-second analysis</div>
                          </div>
                        </div>
                        <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-700 bg-gray-900/80 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <Logo />
              <p className="text-gray-400 mt-2">AI-driven consultant matching</p>
            </div>
            <div className="text-gray-400 text-sm">
              © 2024 MatchWise AI. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
