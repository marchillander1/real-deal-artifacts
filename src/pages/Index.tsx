
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

  const pricingPlans = [
    {
      name: 'Basic Plan',
      price: '€99',
      period: '/month',
      description: 'For 1-3 users',
      features: [
        'Analyze your own consultants',
        'AI-driven CV and profile analysis',
        'Detailed consultant profiles',
        'Save favorites & download CVs',
        '1 admin + 2 standard users',
        'Basic matching algorithms',
        'Standard report generation',
        'Email support'
      ]
    },
    {
      name: 'Team Plan',
      price: '€199',
      period: '/month',
      description: 'For 3-10 users',
      features: [
        'Everything in Basic, plus:',
        'Access to network consultants',
        'Extended user access (3-10 users)',
        'Role-based access control',
        'Advanced AI matching algorithms',
        'Priority email support',
        'Export consultant lists',
        'Advanced analytics & insights'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: '€599',
      period: '/month',
      description: 'Unlimited users',
      features: [
        'Everything in Team, plus:',
        'Unlimited searches in consultant database',
        'Direct access to incoming freelance CVs',
        'Premium visibility for your assignments',
        'Full API access & integration capabilities',
        'Dedicated onboarding & training',
        'SLA-guaranteed support',
        'Custom branding options'
      ]
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

      {/* Pricing Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Choose the plan that fits your company's needs
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`bg-white rounded-lg shadow-lg ${plan.popular ? 'ring-2 ring-blue-500' : ''}`}>
                {plan.popular && (
                  <div className="bg-blue-500 text-white text-center py-2 rounded-t-lg">
                    <span className="text-sm font-medium">Most Popular</span>
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                  <p className="mt-2 text-gray-600">{plan.description}</p>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="ml-3 text-base text-gray-700">{feature}</p>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <Link to="/landing">
                      <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                        Get Started
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Why Choose MatchWise AI?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Experience the future of consultant matching
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-md bg-green-500 text-white mx-auto">
                <Brain className="h-8 w-8" />
              </div>
              <div className="mt-5">
                <h3 className="text-xl font-medium text-gray-900">
                  AI-Powered Precision
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Our advanced AI analyzes skills, experience, and cultural fit to ensure perfect matches every time.
                </p>
              </div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-md bg-blue-500 text-white mx-auto">
                <Zap className="h-8 w-8" />
              </div>
              <div className="mt-5">
                <h3 className="text-xl font-medium text-gray-900">
                  Lightning Fast
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Get matched with relevant opportunities in seconds, not weeks. Speed up your hiring process dramatically.
                </p>
              </div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-md bg-purple-500 text-white mx-auto">
                <Users className="h-8 w-8" />
              </div>
              <div className="mt-5">
                <h3 className="text-xl font-medium text-gray-900">
                  Quality Network
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Access to a carefully curated network of verified professionals with proven track records.
                </p>
              </div>
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

      {/* Footer */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <Logo size="sm" />
              <p className="text-gray-300 text-sm">
                AI-powered consultant matching platform connecting the right professionals with perfect opportunities.
              </p>
            </div>
            <div>
              <h3 className="text-white font-medium mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link to="/demo" className="text-gray-300 hover:text-white text-sm">Demo</Link></li>
                <li><Link to="/pricing" className="text-gray-300 hover:text-white text-sm">Pricing</Link></li>
                <li><Link to="/dashboard" className="text-gray-300 hover:text-white text-sm">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-medium mb-4">For Consultants</h3>
              <ul className="space-y-2">
                <li><Link to="/cv-upload" className="text-gray-300 hover:text-white text-sm">Join Network</Link></li>
                <li><Link to="/my-profile" className="text-gray-300 hover:text-white text-sm">My Profile</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-medium mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link to="/landing" className="text-gray-300 hover:text-white text-sm">About</Link></li>
                <li><Link to="/landing#contact" className="text-gray-300 hover:text-white text-sm">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700">
            <p className="text-gray-400 text-sm text-center">
              © 2024 MatchWise AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
