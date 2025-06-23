
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';

export default function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "€297",
      period: "per month",
      description: "Perfect for small consulting firms",
      features: [
        "Up to 50 consultant profiles",
        "Basic AI matching",
        "Standard analytics",
        "Email support",
        "5 active assignments"
      ],
      popular: false,
      cta: "Start Free Trial"
    },
    {
      name: "Professional",
      price: "€597",
      period: "per month", 
      description: "For growing consulting businesses",
      features: [
        "Up to 200 consultant profiles",
        "Advanced AI matching",
        "Advanced analytics & insights",
        "Priority support",
        "20 active assignments",
        "Custom branding",
        "API access"
      ],
      popular: true,
      cta: "Start Free Trial"
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact us",
      description: "For large consulting organizations",
      features: [
        "Unlimited consultant profiles",
        "Enterprise AI matching",
        "Custom analytics dashboard",
        "Dedicated success manager",
        "Unlimited assignments",
        "White-label solution",
        "Custom integrations",
        "SLA guarantee"
      ],
      popular: false,
      cta: "Contact Sales"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Logo size="md" />
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost">Back to Home</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Choose Your <span className="text-blue-600">Perfect Plan</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Transform your consulting business with AI-powered matching. 
            Start with a 14-day free trial, no credit card required.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
            <Shield className="h-4 w-4" />
            <span>14-day free trial • No setup fees • Cancel anytime</span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative shadow-lg hover:shadow-xl transition-all duration-300 ${
              plan.popular ? 'border-blue-500 scale-105' : 'hover:scale-105'
            }`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white px-4 py-1">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold text-slate-900">{plan.name}</CardTitle>
                <CardDescription className="text-slate-600 mt-2">{plan.description}</CardDescription>
                <div className="mt-6">
                  <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                  <span className="text-slate-600 ml-2">/{plan.period}</span>
                </div>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full py-3 text-lg font-semibold ${
                    plan.popular 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                How does the free trial work?
              </h3>
              <p className="text-slate-600">
                Start with our 14-day free trial with full access to all Professional plan features. 
                No credit card required. Upgrade or downgrade anytime.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Can I change plans later?
              </h3>
              <p className="text-slate-600">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately 
                and we'll prorate the billing accordingly.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                What's included in the Enterprise plan?
              </h3>
              <p className="text-slate-600">
                Enterprise plans include dedicated support, custom integrations, white-label options, 
                and SLA guarantees. Contact our sales team for a custom quote.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center bg-white rounded-2xl p-12 shadow-lg">
          <Zap className="h-16 w-16 text-blue-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Ready to Transform Your Consulting Business?
          </h2>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            Join hundreds of consulting firms who've already revolutionized their matching process with AI.
          </p>
          <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 text-lg">
            Start Your Free Trial Today
          </Button>
        </div>
      </div>
    </div>
  );
}
