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

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Performance Plan */}
          <Card className="bg-slate-800/50 border-emerald-500 relative hover:bg-slate-800/70 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-emerald-600 text-white">🎯 Performance Plan</Badge>
            </div>
            <CardContent className="p-8">
              <h3 className="text-3xl font-bold text-white mb-2">Win in the open market</h3>
              <p className="text-slate-400 mb-6">Tap into our external network and only pay when you succeed.</p>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start text-slate-300">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3 mt-1 flex-shrink-0"></div>
                  Access to the MatchWise external network & market consultants
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

              <div className="grid grid-cols-1 gap-3 mb-6">
                <div className="bg-emerald-600/20 border border-emerald-500/30 rounded-lg p-3 text-center">
                  <span className="text-emerald-300 font-medium">Only pay when you win</span>
                </div>
                <div className="bg-emerald-600/20 border border-emerald-500/30 rounded-lg p-3 text-center">
                  <span className="text-emerald-300 font-medium">Access to top external talent</span>
                </div>
                <div className="bg-emerald-600/20 border border-emerald-500/30 rounded-lg p-3 text-center">
                  <span className="text-emerald-300 font-medium">AI-powered true fit matching</span>
                </div>
                <div className="bg-emerald-600/20 border border-emerald-500/30 rounded-lg p-3 text-center">
                  <span className="text-emerald-300 font-medium">No upfront fees • Scalable & risk-free</span>
                </div>
              </div>

              <TrialSignupModal />
            </CardContent>
          </Card>

          {/* Talent Activation Plan */}
          <Card className="bg-slate-800/50 border-purple-500 relative hover:bg-slate-800/70 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-purple-600 text-white">🧩 Talent Activation Plan</Badge>
            </div>
            <CardContent className="p-8">
              <h3 className="text-3xl font-bold text-white mb-2">Activate your talent</h3>
              <p className="text-slate-400 mb-6">Get your consultants market-ready and visible, instantly.</p>
              
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start text-slate-300">
                  <div className="w-4 h-4 bg-purple-500 rounded-full mr-3 mt-1 flex-shrink-0"></div>
                  Log in at /talent-activation to get started
                </li>
                <li className="flex items-start text-slate-300">
                  <div className="w-4 h-4 bg-purple-500 rounded-full mr-3 mt-1 flex-shrink-0"></div>
                  Access your private company dashboard to manage all consultants
                </li>
                <li className="flex items-start text-slate-300">
                  <div className="w-4 h-4 bg-purple-500 rounded-full mr-3 mt-1 flex-shrink-0"></div>
                  Bulk upload CVs (PDF/Word) — upload your entire bench in minutes
                </li>
                <li className="flex items-start text-slate-300">
                  <div className="w-4 h-4 bg-purple-500 rounded-full mr-3 mt-1 flex-shrink-0"></div>
                  Deep AI-driven profiling: technical skills, values, and personality traits
                </li>
                <li className="flex items-start text-slate-300">
                  <div className="w-4 h-4 bg-purple-500 rounded-full mr-3 mt-1 flex-shrink-0"></div>
                  Build market-ready, high-converting consultant profiles instantly
                </li>
                <li className="flex items-start text-slate-300">
                  <div className="w-4 h-4 bg-purple-500 rounded-full mr-3 mt-1 flex-shrink-0"></div>
                  Set availability, pricing & choose visibility (public or private)
                </li>
                <li className="flex items-start text-slate-300">
                  <div className="w-4 h-4 bg-purple-500 rounded-full mr-3 mt-1 flex-shrink-0"></div>
                  Edit, deactivate or update profiles anytime — total control
                </li>
                <li className="flex items-start text-slate-300">
                  <div className="w-4 h-4 bg-purple-500 rounded-full mr-3 mt-1 flex-shrink-0"></div>
                  Auto-generate personal one-pagers & sales decks for each consultant
                </li>
                <li className="flex items-start text-slate-300">
                  <div className="w-4 h-4 bg-purple-500 rounded-full mr-3 mt-1 flex-shrink-0"></div>
                  Unlimited admins & users — empower your entire sales team
                </li>
                <li className="flex items-start text-slate-300">
                  <div className="w-4 h-4 bg-purple-500 rounded-full mr-3 mt-1 flex-shrink-0"></div>
                  Priority email support so you never get stuck
                </li>
              </ul>

              <div className="grid grid-cols-1 gap-3 mb-6">
                <div className="bg-purple-600/20 border border-purple-500/30 rounded-lg p-3 text-center">
                  <span className="text-purple-300 font-medium">Activate your bench</span>
                </div>
                <div className="bg-purple-600/20 border border-purple-500/30 rounded-lg p-3 text-center">
                  <span className="text-purple-300 font-medium">AI-powered consultant packaging</span>
                </div>
                <div className="bg-purple-600/20 border border-purple-500/30 rounded-lg p-3 text-center">
                  <span className="text-purple-300 font-medium">Sell faster & smarter</span>
                </div>
                <div className="bg-purple-600/20 border border-purple-500/30 rounded-lg p-3 text-center">
                  <span className="text-purple-300 font-medium">Total admin control • Zero tech hassle</span>
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
              <h3 className="text-3xl font-bold text-white mb-2">Supercharge your internal team</h3>
              <p className="text-slate-400 mb-6">Upgrade your own consultants and deliver a branded client experience.</p>
              
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
                  Auto-generate personal reports & customized presentations
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
                <li className="flex items-start text-slate-300">
                  <div className="w-4 h-4 bg-blue-500 rounded-full mr-3 mt-1 flex-shrink-0"></div>
                  Add-on: Whitelabel portal (offer your own branded experience)
                </li>
              </ul>

              <div className="grid grid-cols-1 gap-3 mb-6">
                <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-3 text-center">
                  <span className="text-blue-300 font-medium">Supercharge your own consultants</span>
                </div>
                <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-3 text-center">
                  <span className="text-blue-300 font-medium">Sell smarter, not harder</span>
                </div>
                <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-3 text-center">
                  <span className="text-blue-300 font-medium">AI profiling beyond CVs</span>
                </div>
                <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-3 text-center">
                  <span className="text-blue-300 font-medium">Instant presentation-ready profiles • Zero tech investment</span>
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
