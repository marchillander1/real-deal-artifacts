
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';
import TrialSignupModal from '@/components/landing/TrialSignupModal';

export default function Pricing() {
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
            Stop paying for "maybe". Only pay when you win.
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            💎 No risk. No lock-ins. Just 2 % when you land the right consultant.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
            <Shield className="h-4 w-4" />
            <span>No setup fees • No subscription • No hidden catches</span>
          </div>
        </div>

        {/* Pricing Card */}
        <div className="flex justify-center mb-16">
          <Card className="bg-slate-800/50 border-emerald-500 relative hover:bg-slate-800/70 transition-all duration-300 hover:scale-105 backdrop-blur-sm max-w-lg">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-emerald-600 text-white">🚀 Performance Plan</Badge>
            </div>
            
            <CardHeader className="text-center pb-8">
              <div className="flex items-center space-x-2 mb-4 justify-center">
                <div className="w-6 h-6 bg-emerald-600 rounded"></div>
                <CardTitle className="text-2xl font-bold text-white">Performance Plan</CardTitle>
              </div>
              <CardDescription className="text-slate-400 mt-2">For teams who only want to pay when they win</CardDescription>
              <div className="mt-6">
                <span className="text-4xl font-bold text-white">💰 2 % success fee</span>
                <span className="text-slate-400 block mt-2">Only pay when you find the one.</span>
              </div>
            </CardHeader>
            
            <CardContent>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full mt-0.5 flex-shrink-0"></div>
                  <span className="text-slate-300">Analyze your own or external consultants — no limits</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full mt-0.5 flex-shrink-0"></div>
                  <span className="text-slate-300">AI-powered CV & profile deep dive (way beyond keywords)</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full mt-0.5 flex-shrink-0"></div>
                  <span className="text-slate-300">True value & personality insights (because skills alone aren't enough)</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full mt-0.5 flex-shrink-0"></div>
                  <span className="text-slate-300">Save favorites, download CVs, and wow your clients</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full mt-0.5 flex-shrink-0"></div>
                  <span className="text-slate-300">Unlimited users, unlimited admins — bring the whole crew</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full mt-0.5 flex-shrink-0"></div>
                  <span className="text-slate-300">Next-level AI matching algorithms (actually smart, not "AI-washed")</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full mt-0.5 flex-shrink-0"></div>
                  <span className="text-slate-300">Auto-generated personalized reports & cover letters (hello, time saver)</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full mt-0.5 flex-shrink-0"></div>
                  <span className="text-slate-300">Priority support (because we move fast, just like you)</span>
                </li>
              </ul>
              
              <TrialSignupModal />
            </CardContent>
          </Card>
        </div>

        {/* Why Section */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">💬 Why?</h2>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
            <p className="text-lg text-slate-300 leading-relaxed">
              Because paying upfront for "maybe" matches is so 2020.<br/>
              With MatchWise, you only pay 2 % when you actually place a consultant.<br/>
              No strings. No fixed fees. No hidden catches. Just real, measurable value, exactly when you need it.
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                How does the 2% success fee work?
              </h3>
              <p className="text-slate-300">
                You only pay when you successfully place a consultant with a client. 
                No upfront costs, no monthly subscriptions. Just 2% of the consultant's first project value.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                What counts as a successful placement?
              </h3>
              <p className="text-slate-300">
                A successful placement is when a consultant you found through MatchWise starts working 
                with your client. The fee is calculated on the total project value or first 6 months for long-term placements.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Is there really no monthly fee?
              </h3>
              <p className="text-slate-300">
                Absolutely none. No setup fees, no monthly subscriptions, no hidden costs. 
                You get full access to all features and only pay the 2% when you win.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Can I use MatchWise for my own consultants?
              </h3>
              <p className="text-slate-300">
                Yes! You can analyze and manage your own consultant network without any fees. 
                The 2% only applies when you place external consultants found through our platform.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center bg-slate-800/50 backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-slate-700">
          <Zap className="h-16 w-16 text-blue-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Only Pay When You Win?
          </h2>
          <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
            Join hundreds of consulting firms who've ditched fixed costs and only pay for real results.
          </p>
          <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 text-lg">
            Start Using MatchWise Today
          </Button>
        </div>
      </div>
    </div>
  );
}
