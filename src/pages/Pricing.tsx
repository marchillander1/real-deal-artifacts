
import React from 'react';
import { Navbar } from '@/components/Navbar';
import { StripeCheckout } from '@/components/StripeCheckout';

const pricingPlans = [
  {
    name: 'Basic Plan',
    price: 99,
    subtitle: 'For 1-3 users',
    popular: false,
    color: 'blue',
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
    name: 'Team Plan',
    price: 199,
    subtitle: 'For 3-10 users',
    popular: true,
    color: 'green',
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
    name: 'Enterprise',
    price: 599,
    subtitle: 'Unlimited users',
    popular: false,
    color: 'red',
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

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center mb-4">
            <span className="text-2xl mr-2">💰</span>
            <h1 className="text-4xl font-bold">
              Pricing Plans
            </h1>
          </div>
          <p className="text-xl text-gray-300">
            Choose the plan that fits your company's needs
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <StripeCheckout
              key={index}
              planName={plan.name}
              price={plan.price}
              features={plan.features}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
