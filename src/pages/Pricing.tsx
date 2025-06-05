
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
      'Full access to consultant search and filtering',
      'View detailed profiles incl. soft skills and CVs',
      'Save favorites & download CVs',
      '1 admin + 2 standard users',
      'Email support'
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
      'Extended user access',
      'Role-based access control',
      'Priority email support',
      'Early feature access',
      'Export consultant lists'
    ]
  },
  {
    name: 'Enterprise',
    price: 599,
    subtitle: 'For organizations using Free Talent Pool',
    popular: false,
    color: 'red',
    features: [
      'Unlimited searches in the open consultant database',
      'Direct access to incoming freelance CVs',
      'Premium visibility settings for your jobs',
      'Integration possibilities (API access upon request)',
      'Dedicated onboarding',
      'SLA-backed support'
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
              Pricing Overview
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
