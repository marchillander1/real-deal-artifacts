
import React from 'react';
import { Navbar } from '@/components/Navbar';
import { StripeCheckout } from '@/components/StripeCheckout';

const pricingPlans = [
  {
    name: 'Basic',
    price: 499,
    features: [
      'Upp till 10 konsulter',
      'Grundläggande AI-matchning',
      'Export till PDF',
      'Email support'
    ]
  },
  {
    name: 'Premium',
    price: 999,
    features: [
      'Upp till 50 konsulter',
      'Avancerad AI-matchning',
      'Kalenderintegration',
      'Prioriterat support',
      'Analytics dashboard'
    ]
  },
  {
    name: 'Enterprise',
    price: 1999,
    features: [
      'Obegränsat antal konsulter',
      'Anpassad AI-matchning',
      'API-åtkomst',
      'Dedikerat support',
      'Custom integrations'
    ]
  }
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Välj din plan
          </h1>
          <p className="text-xl text-gray-600">
            Hitta den perfekta planen för ditt företag
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
