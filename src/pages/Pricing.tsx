
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';
import TrialSignupModal from '@/components/landing/TrialSignupModal';

export default function Pricing() {
  const plans = [
    {
      name: "Basic Plan",
      price: "€99",
      period: "per month",
      description: "For 1-3 users",
      features: [
        "Analyze your own consultants",
        "AI-driven CV and profile analysis",
        "Detailed consultant profiles",
        "Save favorites & download CVs",
        "1 admin + 2 standard users",
        "Basic matching algorithms",
        "Standard report generation",
        "Email support"
      ],
      popular: false,
      cta: "Start Free Trial"
    },
    {
      name: "Team Plan",
      price: "€199",
      period: "per month", 
      description: "For 3-10 users",
      features: [
        "Everything in Basic, plus:",
        "Access to network consultants",
        "Extended user access (3-10 users)",
        "Role-based access control",
        "Advanced AI matching algorithms",
        "Priority email support",
        "Export consultant lists",
        "Advanced analytics & insights"
      ],
      popular: true,
      cta: "Start Free Trial"
    },
    {
      name: "Enterprise",
      price: "€599",
      period: "per month",
      description: "Unlimited users",
      features: [
        "Everything in Team, plus:",
        "Unlimited searches in consultant database",
        "Direct access to incoming freelance CVs",
        "Premium visibility for your assignments",
        "Full API access & integration capabilities",
        "Dedicated onboarding & training",
        "SLA-guaranteed support",
        "Custom branding options"
      ],
      popular: false,
      cta: "Contact Sales"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <div className="bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Logo size="md" />
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            💰 Simple, Transparent <span className="text-blue-400">Pricing</span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Choose the plan that fits your company's needs. 
            Start with a free trial, no credit card required.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
            <Shield className="h-4 w-4" />
            <span>14-day free trial • No setup fees • Cancel anytime</span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className={`bg-slate-800/50 border-slate-600 hover:bg-slate-800/70 transition-all duration-300 hover:scale-105 backdrop-blur-sm relative ${
              plan.popular ? 'border-emerald-500' : ''
            }`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-emerald-600 text-white">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-8">
                <div className="flex items-center space-x-2 mb-4 justify-center">
                  <div className={`w-6 h-6 rounded ${plan.popular ? 'bg-emerald-600' : index === 0 ? 'bg-blue-600' : 'bg-red-600'}`}></div>
                  <CardTitle className="text-2xl font-bold text-white">{plan.name}</CardTitle>
                </div>
                <CardDescription className="text-slate-400 mt-2">{plan.description}</CardDescription>
                <div className="mt-6">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-slate-400 ml-2">/{plan.period}</span>
                </div>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <div className="w-4 h-4 bg-emerald-500 rounded-full mt-0.5 flex-shrink-0"></div>
                      <span className="text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {plan.cta === "Contact Sales" ? (
                  <Button variant="outline" className="w-full border-slate-600 text-white hover:bg-slate-800">
                    Contact Sales
                  </Button>
                ) : (
                  <TrialSignupModal />
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                How does the free trial work?
              </h3>
              <p className="text-slate-300">
                Start with our 14-day free trial with full access to all features. 
                No credit card required. Upgrade or downgrade anytime.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Can I change plans later?
              </h3>
              <p className="text-slate-300">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately 
                and we'll prorate the billing accordingly.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                What's included in the Enterprise plan?
              </h3>
              <p className="text-slate-300">
                Enterprise plans include dedicated support, custom integrations, white-label options, 
                and SLA guarantees. Contact our sales team for a custom quote.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center bg-slate-800/50 backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-slate-700">
          <Zap className="h-16 w-16 text-blue-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Consulting Business?
          </h2>
          <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
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
