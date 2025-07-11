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

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Performance Plan */}
          <Card className="bg-slate-800/50 border-emerald-500 relative hover:bg-slate-800/70 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-emerald-600 text-white">🎯 Performance Plan</Badge>
            </div>
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-white mb-2">Performance Plan</h3>
              <p className="text-slate-400 mb-6">For companies that want to win in the open market</p>
              <div className="text-3xl font-bold text-white mb-6">💰 2 % success fee<span className="text-lg text-slate-400 block">Only pay when you actually place a consultant.</span></div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start text-slate-300">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3 mt-1 flex-shrink-0"></div>
                  Access to MatchWise external network & market consultants
                </li>
                <li className="flex items-start text-slate-300">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3 mt-1 flex-shrink-0"></div>
                  AI-powered CV and deep profile analysis (way beyond keywords)
                </li>
                <li className="flex items-start text-slate-300">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3 mt-1 flex-shrink-0"></div>
                  Personality & value insights for true cultural fit
                </li>
                <li className="flex items-start text-slate-300">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3 mt-1 flex-shrink-0"></div>
                  Save favorites & download CVs to wow your clients
                </li>
                <li className="flex items-start text-slate-300">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3 mt-1 flex-shrink-0"></div>
                  Unlimited admins & users — scale without limits
                </li>
                <li className="flex items-start text-slate-300">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3 mt-1 flex-shrink-0"></div>
                  Advanced AI matching algorithms (actually smart, not "AI-washed")
                </li>
                <li className="flex items-start text-slate-300">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3 mt-1 flex-shrink-0"></div>
                  Auto-generated personal reports & cover letters (bye manual work)
                </li>
                <li className="flex items-start text-slate-300">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3 mt-1 flex-shrink-0"></div>
                  Priority email support, because you move fast
                </li>
              </ul>

              <div className="space-y-3 mb-6">
                <h4 className="text-lg font-semibold text-white">🏆 Badges</h4>
                <div className="grid grid-cols-2 gap-2 text-sm text-slate-300">
                  <div>• Only pay when you win</div>
                  <div>• Access to top external talent</div>
                  <div>• AI-powered true fit matching</div>
                  <div>• No upfront fees</div>
                  <div>• Scalable & risk-free</div>
                </div>
              </div>

              <TrialSignupModal />
            </CardContent>
          </Card>

          {/* Internal Pro Plan */}
          <Card className="bg-slate-800/50 border-blue-500 relative hover:bg-slate-800/70 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-blue-600 text-white">💡 Internal Pro Plan</Badge>
            </div>
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-white mb-2">Internal Pro Plan</h3>
              <p className="text-slate-400 mb-6">For teams that want to supercharge their own consultants</p>
              <div className="text-2xl font-bold text-white mb-6">💬 Start Free Trial</div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start text-slate-300">
                  <div className="w-4 h-4 bg-blue-500 rounded-full mr-3 mt-1 flex-shrink-0"></div>
                  Analyze and optimize your own consultants — no limits
                </li>
                <li className="flex items-start text-slate-300">
                  <div className="w-4 h-4 bg-blue-500 rounded-full mr-3 mt-1 flex-shrink-0"></div>
                  Deep AI-driven profiling: strengths, values, and hidden traits
                </li>
                <li className="flex items-start text-slate-300">
                  <div className="w-4 h-4 bg-blue-500 rounded-full mr-3 mt-1 flex-shrink-0"></div>
                  Boost your internal matchmaking and sales presentations
                </li>
                <li className="flex items-start text-slate-300">
                  <div className="w-4 h-4 bg-blue-500 rounded-full mr-3 mt-1 flex-shrink-0"></div>
                  Auto-generate personal reports & customized presentations (hello, time saver)
                </li>
                <li className="flex items-start text-slate-300">
                  <div className="w-4 h-4 bg-blue-500 rounded-full mr-3 mt-1 flex-shrink-0"></div>
                  Build internal "dream teams" and highlight your best people
                </li>
                <li className="flex items-start text-slate-300">
                  <div className="w-4 h-4 bg-blue-500 rounded-full mr-3 mt-1 flex-shrink-0"></div>
                  Unlimited admins & users — involve the whole team
                </li>
                <li className="flex items-start text-slate-300">
                  <div className="w-4 h-4 bg-blue-500 rounded-full mr-3 mt-1 flex-shrink-0"></div>
                  No tech build-out needed, no hidden costs, zero headaches
                </li>
                <li className="flex items-start text-slate-300">
                  <div className="w-4 h-4 bg-blue-500 rounded-full mr-3 mt-1 flex-shrink-0"></div>
                  Priority email support to keep you moving
                </li>
              </ul>

              <div className="space-y-3 mb-6">
                <h4 className="text-lg font-semibold text-white">💡 Badges</h4>
                <div className="grid grid-cols-2 gap-2 text-sm text-slate-300">
                  <div>• Supercharge your own consultants</div>
                  <div>• Sell smarter, not harder</div>
                  <div>• AI profiling beyond CVs</div>
                  <div>• Instant presentation-ready profiles</div>
                  <div>• Zero tech investment</div>
                </div>
              </div>

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
