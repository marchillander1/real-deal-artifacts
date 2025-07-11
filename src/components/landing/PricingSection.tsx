import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import TrialSignupModal from './TrialSignupModal';

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Stop paying for "maybe". Only pay when you win.</h2>
          <p className="text-xl text-slate-300">💎 No risk. No lock-ins. Just 2 % when you land the right consultant.</p>
        </div>

        <div className="flex justify-center">
          {/* Performance Plan */}
          <Card className="bg-slate-800/50 border-emerald-500 relative hover:bg-slate-800/70 transition-all duration-300 hover:scale-105 backdrop-blur-sm max-w-lg">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-emerald-600 text-white">🚀 Performance Plan</Badge>
            </div>
            <CardContent className="p-8">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-emerald-600 rounded"></div>
                <h3 className="text-xl font-bold text-white">Performance Plan</h3>
              </div>
              <p className="text-slate-400 mb-6">For teams who only want to pay when they win</p>
              <div className="text-3xl font-bold text-white mb-6">💰 2 % success fee<span className="text-lg text-slate-400 block">Only pay when you find the one.</span></div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-slate-300">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3"></div>
                  Analyze your own or external consultants — no limits
                </li>
                <li className="flex items-center text-slate-300">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3"></div>
                  AI-powered CV & profile deep dive (way beyond keywords)
                </li>
                <li className="flex items-center text-slate-300">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3"></div>
                  True value & personality insights (because skills alone aren't enough)
                </li>
                <li className="flex items-center text-slate-300">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3"></div>
                  Save favorites, download CVs, and wow your clients
                </li>
                <li className="flex items-center text-slate-300">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3"></div>
                  Unlimited users, unlimited admins — bring the whole crew
                </li>
                <li className="flex items-center text-slate-300">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3"></div>
                  Next-level AI matching algorithms (actually smart, not "AI-washed")
                </li>
                <li className="flex items-center text-slate-300">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3"></div>
                  Auto-generated personalized reports & cover letters (hello, time saver)
                </li>
                <li className="flex items-center text-slate-300">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3"></div>
                  Priority support (because we move fast, just like you)
                </li>
              </ul>

              <TrialSignupModal />
            </CardContent>
          </Card>
        </div>

        {/* Why Section */}
        <div className="mt-16 max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-white mb-6">💬 Why?</h3>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
            <p className="text-lg text-slate-300 leading-relaxed">
              Because paying upfront for "maybe" matches is so 2020.<br/>
              With MatchWise, you only pay 2 % when you actually place a consultant.<br/>
              No strings. No fixed fees. No hidden catches. Just real, measurable value, exactly when you need it.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
