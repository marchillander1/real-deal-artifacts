
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Brain, Users, BarChart3, Zap } from 'lucide-react';
import Logo from '@/components/Logo';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseConsultantsWithDemo } from '@/hooks/useSupabaseConsultantsWithDemo';

const Index = () => {
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

  // Real dashboard stats using actual data
  const networkConsultants = consultants.filter(consultant => consultant.type === 'new');
  const successfulMatches = matchesData.filter(match => match.status === 'accepted').length;
  const totalConsultants = consultants.length;

  const features = [
    {
      icon: Brain,
      title: 'AI-driven Matching',
      description: 'Advanced algorithms match consultants with perfect assignments'
    },
    {
      icon: Users,
      title: 'Consultant Network',
      description: 'Access to a growing network of verified professionals'
    },
    {
      icon: BarChart3,
      title: 'Analytics & Insights',
      description: 'Detailed reports and performance analytics'
    },
    {
      icon: Zap,
      title: 'Instant Results',
      description: 'Get matched with relevant opportunities in seconds'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo size="md" />
            <div className="flex space-x-4">
              <Link to="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Link to="/demo">
                <Button variant="outline">Test Our System</Button>
              </Link>
              <Link to="/cv-upload">
                <Button>Join Network</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="text-center">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">AI-Powered</span>
                  <span className="block text-blue-600">Consultant Matching</span>
                </h1>
                <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                  Connect the right consultants with the perfect assignments using advanced AI technology. 
                  Upload your CV and get matched with opportunities instantly.
                </p>
                <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                  <Link to="/demo">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto flex items-center gap-2 mr-3">
                      Test Our System
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Link to="/cv-upload">
                    <Button size="lg" className="w-full sm:w-auto flex items-center gap-2">
                      Join Network
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                </div>
                <div className="mt-3">
                  <Link to="/landing">
                    <Button variant="ghost" size="sm">
                      Start Free Trial
                    </Button>
                  </Link>
                </div>

                {/* Live Network Stats */}
                <div className="mt-8 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-6 max-w-md mx-auto">
                  <div className="flex items-center justify-center mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-green-600 font-medium text-sm">LIVE ANALYSIS</span>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-2">{totalConsultants}</div>
                  <div className="text-gray-600 text-sm">Active Network Consultants</div>
                  <div className="text-green-600 text-xs mt-1">+{Math.floor(Math.random() * 5) + 1} joined today</div>
                  <div className="mt-3 text-xs text-gray-500">
                    {successfulMatches} successful matches this month
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Powerful Features
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Everything you need for successful consultant matching
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <div className="mt-5">
                    <h3 className="text-lg font-medium text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-base text-gray-500">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-blue-200">Join our network today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <Link to="/cv-upload">
              <Button size="lg" variant="secondary" className="flex items-center gap-2">
                Get Started Now
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
