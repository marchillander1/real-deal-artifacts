import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, ArrowRight, Users, Zap, Shield, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { PricingAuth } from '@/components/PricingAuth';

interface PricingPlan {
  name: string;
  price: number;
  description: string;
  features: string[];
  badge?: string;
  mostPopular?: boolean;
}

const Pricing = () => {
  const [activePlan, setActivePlan] = useState<string | null>(null);

  const plans: PricingPlan[] = [
    {
      name: "Basic",
      price: 0,
      description: "Perfect for exploring MatchWise AI",
      features: [
        "Limited CV Scans",
        "Basic Profile Analysis",
        "Community Support",
      ],
    },
    {
      name: "Pro",
      price: 49,
      description: "Unlock full potential for consultants",
      features: [
        "Unlimited CV Scans",
        "Advanced Profile Analysis",
        "Priority Support",
        "Enhanced Matching Algorithm",
      ],
      mostPopular: true,
      badge: "Most Popular",
    },
    {
      name: "Business",
      price: 99,
      description: "For agencies and teams",
      features: [
        "Everything in Pro",
        "Team Collaboration Features",
        "Dedicated Account Manager",
        "Custom Integrations",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar onFileUpload={() => {}} />
      <div className="container mx-auto py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose the plan that's right for you
          </h1>
          <p className="text-gray-600 text-lg">
            Simple, transparent pricing. Upgrade or cancel anytime.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`shadow-xl hover:shadow-2xl transition-shadow duration-300 ${
                plan.mostPopular ? "border-2 border-blue-500" : ""
              }`}
            >
              <CardHeader className="text-center">
                {plan.badge && (
                  <Badge className="mb-2 bg-blue-100 text-blue-800 border-none">
                    <Star className="h-4 w-4 mr-2" />
                    {plan.badge}
                  </Badge>
                )}
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-4">
                  <span className="text-4xl font-semibold">
                    ${plan.price}
                  </span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-gray-700 mb-6">{plan.description}</p>
                <ul className="text-left mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center mb-2">
                      <Check className="h-4 w-4 mr-2 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                {activePlan === plan.name ? (
                  <Button disabled>
                    Current Plan <Check className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <PricingAuth>
                    <Button onClick={() => setActivePlan(plan.name)}>
                      Choose Plan <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </PricingAuth>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-12 text-center">
          <p className="text-gray-500">
            Need a custom plan?{" "}
            <Link to="/contact" className="text-blue-600 hover:underline">
              Contact us
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
