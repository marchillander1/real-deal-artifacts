
import React from 'react';
import { Navbar } from '@/components/Navbar';
import { StripeCheckout } from '@/components/StripeCheckout';

const pricingPlans = [
  {
    name: 'Basic Plan',
    price: 999,
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
    price: 1999,
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
    price: 5999,
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
            <div key={index} className="relative">
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              <div className={`
                rounded-lg border-2 p-8 bg-gray-800 h-full flex flex-col
                ${plan.color === 'blue' ? 'border-blue-500' : ''}
                ${plan.color === 'green' ? 'border-green-500' : ''}
                ${plan.color === 'red' ? 'border-red-500' : ''}
              `}>
                <div className="mb-6">
                  <div className="flex items-center mb-2">
                    <div className={`
                      w-6 h-6 rounded mr-3
                      ${plan.color === 'blue' ? 'bg-blue-500' : ''}
                      ${plan.color === 'green' ? 'bg-green-500' : ''}
                      ${plan.color === 'red' ? 'bg-red-500' : ''}
                    `}></div>
                    <h3 className="text-2xl font-bold">{plan.name}</h3>
                  </div>
                  <p className="text-gray-400 mb-4">{plan.subtitle}</p>
                  <div className="text-4xl font-bold mb-2">
                    {plan.price.toLocaleString()} SEK
                    <span className="text-lg font-normal text-gray-400">/month</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mt-0.5">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-sm leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto">
                  <button className={`
                    w-full py-3 px-6 rounded-lg font-medium transition-colors
                    ${plan.popular 
                      ? 'bg-green-500 hover:bg-green-600 text-white' 
                      : 'border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white'
                    }
                  `}>
                    {plan.popular ? 'Start Free Trial' : 'Start Free Trial'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
