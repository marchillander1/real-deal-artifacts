
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const packages = [
  {
    id: 'basic',
    name: 'Basic Plan',
    price: '99',
    currency: 'EUR',
    period: 'month',
    description: 'For 1-3 users',
    icon: <Star className="h-6 w-6" />,
    color: 'border-blue-200 bg-blue-50',
    features: [
      'Analyze your own consultants',
      'AI-driven CV and profile analysis',
      'Detailed consultant profiles',
      'Save favorites & download CVs',
      '1 admin + 2 standard users',
      'Basic matching algorithms',
      'Standard report generation',
      'Email support',
      'Basic analytics dashboard',
      'Consultant database management'
    ]
  },
  {
    id: 'team',
    name: 'Team Plan',
    price: '199',
    currency: 'EUR',
    period: 'month',
    description: 'For 3-10 users',
    icon: <Zap className="h-6 w-6" />,
    color: 'border-green-200 bg-green-50',
    popular: true,
    features: [
      'Everything in Basic, plus:',
      'Access to network consultants',
      'Extended user access (3-10 users)',
      'Role-based access control',
      'Advanced AI matching algorithms',
      'Priority email support',
      'Early access to new features',
      'Export consultant lists',
      'Advanced analytics & insights',
      'Custom search filters',
      'Bulk operations & management',
      'Integration API access'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '599',
    currency: 'EUR',
    period: 'month',
    description: 'Unlimited users',
    icon: <Crown className="h-6 w-6" />,
    color: 'border-purple-200 bg-purple-50',
    features: [
      'Everything in Team, plus:',
      'Unlimited searches in consultant database',
      'Direct access to incoming freelance CVs',
      'Premium visibility for your assignments',
      'Full API access & integration capabilities',
      'Dedicated onboarding & training',
      'SLA-guaranteed support',
      'Unlimited number of users',
      'Custom branding options',
      'Advanced reporting & analytics',
      'White-label solutions',
      'Dedicated customer success manager',
      'Custom integrations & workflows'
    ]
  }
];

export const PricingAuth = () => {
  const [selectedPackage, setSelectedPackage] = useState<string>('team');
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handleSelectPackage = async (packageId: string) => {
    setSelectedPackage(packageId);
    setIsProcessing(true);

    try {
      // Here you would integrate with Stripe for payment
      // For now, we'll simulate the payment process
      
      console.log(`Processing payment for package: ${packageId}`);
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // After successful payment, redirect to registration
      toast.success('Payment successful! You can now create your account.');
      navigate('/auth', { 
        state: { 
          packageId,
          packageName: packages.find(p => p.id === packageId)?.name,
          paymentComplete: true 
        } 
      });
      
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select a package to get access to our consultant network and start your journey with MatchWise AI
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {packages.map((pkg) => (
            <Card 
              key={pkg.id} 
              className={`relative ${pkg.color} ${selectedPackage === pkg.id ? 'ring-2 ring-blue-500' : ''} ${pkg.popular ? 'border-2 border-green-400' : ''}`}
            >
              {pkg.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-500 text-white">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center pb-6">
                <div className="flex justify-center mb-4">
                  {pkg.icon}
                </div>
                <CardTitle className="text-2xl font-bold">{pkg.name}</CardTitle>
                <CardDescription className="text-gray-600">
                  {pkg.description}
                </CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">€{pkg.price}</span>
                  <span className="text-gray-600 ml-1">/{pkg.period}</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full"
                  variant={selectedPackage === pkg.id ? "default" : "outline"}
                  onClick={() => handleSelectPackage(pkg.id)}
                  disabled={isProcessing}
                >
                  {isProcessing && selectedPackage === pkg.id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    `Choose ${pkg.name}`
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-gray-500">
            All plans include 30-day money-back guarantee
          </p>
        </div>
      </div>
    </div>
  );
};
