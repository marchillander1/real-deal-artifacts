
import React from 'react';
import { Navbar } from '@/components/Navbar';
import { StripeCheckout } from '@/components/StripeCheckout';

const pricingPlans = [
  {
    name: 'Basic Plan',
    price: 99,
    subtitle: 'För 1-3 användare',
    popular: false,
    color: 'blue',
    features: [
      'Analysera dina egna konsulter',
      'AI-driven analys av CV och profiler',
      'Detaljerade konsultprofiler',
      'Spara favoriter & ladda ner CV',
      '1 admin + 2 standardanvändare',
      'Email support'
    ]
  },
  {
    name: 'Team Plan',
    price: 199,
    subtitle: 'För 3-10 användare',
    popular: true,
    color: 'green',
    features: [
      'Allt i Basic, plus:',
      'Tillgång till nätverkskonsulter',
      'Utökad användaråtkomst (3-10 användare)',
      'Rollbaserad åtkomstkontroll',
      'Prioriterad email support',
      'Tidig tillgång till nya funktioner',
      'Exportera konsultlistor'
    ]
  },
  {
    name: 'Enterprise',
    price: 599,
    subtitle: 'Obegränsat antal användare',
    popular: false,
    color: 'red',
    features: [
      'Obegränsade sökningar i hela konsultdatabasen',
      'Direkt tillgång till inkommande freelance CV',
      'Premium synlighet för dina uppdrag',
      'API-åtkomst och integrationsmöjligheter',
      'Dedikerad onboarding',
      'SLA-garanterad support',
      'Obegränsat antal användare'
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
              Prisöversikt
            </h1>
          </div>
          <p className="text-xl text-gray-300">
            Välj den plan som passar ditt företags behov
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
