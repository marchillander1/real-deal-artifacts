
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export default function ComparisonSection() {
  return (
    <section className="py-20 bg-slate-800/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Why Our Matches Are Superior</h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Traditional CV-based matching vs. MatchWise AI's human-first approach
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Traditional Matching */}
          <Card className="bg-gradient-to-br from-red-500/10 to-red-600/10 border-red-500/30">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-sm">✗</span>
                </span>
                Traditional CV Matching
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✗</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">Skills-Only Focus</h4>
                    <p className="text-slate-300 text-sm">Matches based purely on technical competencies, ignoring personality and cultural fit</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✗</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">High Failure Rate</h4>
                    <p className="text-slate-300 text-sm">40% of projects fail due to poor team chemistry and communication issues</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✗</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">Time Consuming</h4>
                    <p className="text-slate-300 text-sm">15+ hours per hire with multiple interview rounds and assessments</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✗</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">Expensive Mistakes</h4>
                    <p className="text-slate-300 text-sm">Poor fits cost €250K annually in project restarts and delays</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* MatchWise AI */}
          <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border-emerald-500/30">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-sm">✓</span>
                </span>
                MatchWise AI Human-First
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">Holistic Analysis</h4>
                    <p className="text-slate-300 text-sm">Analyzes technical skills + personality + values + communication style for perfect fit</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">96% Success Rate</h4>
                    <p className="text-slate-300 text-sm">Superior human fit leads to better team chemistry and project outcomes</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">12-Second Analysis</h4>
                    <p className="text-slate-300 text-sm">AI processes years of experience and personality data instantly</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">Massive Savings</h4>
                    <p className="text-slate-300 text-sm">Save €210K annually through better human fit and reduced failures</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/50 inline-block backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="text-5xl font-bold text-white mb-2">75x Faster</div>
              <div className="text-blue-300 text-lg">with 36% higher satisfaction</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
