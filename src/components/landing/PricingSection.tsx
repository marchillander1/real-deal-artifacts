
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">💰 Simple, Transparent Pricing</h2>
          <p className="text-xl text-slate-300">Choose the plan that fits your company's needs</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Basic Plan */}
          <Card className="bg-slate-800/50 border-slate-600 hover:bg-slate-800/70 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-blue-600 rounded"></div>
                <h3 className="text-xl font-bold text-white">Basic Plan</h3>
              </div>
              <p className="text-slate-400 mb-6">For 1-3 users</p>
              <div className="text-3xl font-bold text-white mb-6">€99<span className="text-lg text-slate-400">/month</span></div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-slate-300">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3"></div>
                  Full access to consultant search and filtering
                </li>
                <li className="flex items-center text-slate-300">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3"></div>
                  View detailed profiles incl. soft skills and CVs
                </li>
                <li className="flex items-center text-slate-300">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3"></div>
                  Save favorites & download CVs
                </li>
                <li className="flex items-center text-slate-300">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3"></div>
                  1 admin + 2 standard users
                </li>
                <li className="flex items-center text-slate-300">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3"></div>
                  Email support
                </li>
              </ul>

              <Button variant="outline" className="w-full border-slate-600 text-white hover:bg-slate-800">
                Start Free Trial
              </Button>
            </CardContent>
          </Card>

          {/* Team Plan */}
          <Card className="bg-slate-800/50 border-emerald-500 relative hover:bg-slate-800/70 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-emerald-600 text-white">Most Popular</Badge>
            </div>
            <CardContent className="p-8">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-emerald-600 rounded"></div>
                <h3 className="text-xl font-bold text-white">Team Plan</h3>
              </div>
              <p className="text-slate-400 mb-6">For 3-10 users</p>
              <div className="text-3xl font-bold text-white mb-6">€199<span className="text-lg text-slate-400">/month</span></div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-slate-300">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3"></div>
                  Everything in Basic, plus:
                </li>
                <li className="flex items-center text-slate-300">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3"></div>
                  Extended user access
                </li>
                <li className="flex items-center text-slate-300">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3"></div>
                  Role-based access control
                </li>
                <li className="flex items-center text-slate-300">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3"></div>
                  Priority email support
                </li>
                <li className="flex items-center text-slate-300">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3"></div>
                  Early feature access
                </li>
                <li className="flex items-center text-slate-300">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3"></div>
                  Export consultant lists
                </li>
              </ul>

              <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                Start Free Trial
              </Button>
            </CardContent>
          </Card>

          {/* Enterprise Plan */}
          <Card className="bg-slate-800/50 border-red-600 hover:bg-slate-800/70 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-red-600 rounded"></div>
                <h3 className="text-xl font-bold text-white">Enterprise</h3>
              </div>
              <p className="text-slate-400 mb-6">For organizations using Free Talent Pool</p>
              <div className="text-3xl font-bold text-white mb-6">€599<span className="text-lg text-slate-400">/month</span></div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-slate-300">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3"></div>
                  Unlimited searches in the open consultant database
                </li>
                <li className="flex items-center text-slate-300">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3"></div>
                  Direct access to incoming freelance CVs
                </li>
                <li className="flex items-center text-slate-300">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3"></div>
                  Premium visibility settings for your jobs
                </li>
                <li className="flex items-center text-slate-300">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3"></div>
                  Integration possibilities (API access upon request)
                </li>
                <li className="flex items-center text-slate-300">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3"></div>
                  Dedicated onboarding
                </li>
                <li className="flex items-center text-slate-300">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3"></div>
                  SLA-backed support
                </li>
              </ul>

              <Button variant="outline" className="w-full border-slate-600 text-white hover:bg-slate-800">
                Contact Sales
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
