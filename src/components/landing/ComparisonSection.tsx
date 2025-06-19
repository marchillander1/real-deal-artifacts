
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { X, Check } from 'lucide-react';

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

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Traditional Matching */}
          <Card className="bg-slate-900/80 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Traditional CV Matching</h3>
                <p className="text-slate-300 text-base">Skills-only approach with high failure rates</p>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <X className="w-4 h-4 text-red-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1 text-base">Skills-Only Focus</h4>
                    <p className="text-slate-200 text-sm leading-relaxed">Matches based purely on technical competencies, ignoring personality and cultural fit</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <X className="w-4 h-4 text-red-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1 text-base">40% Failure Rate</h4>
                    <p className="text-slate-200 text-sm leading-relaxed">High project failure due to poor team chemistry and communication issues</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <X className="w-4 h-4 text-red-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1 text-base">15+ Hours Per Hire</h4>
                    <p className="text-slate-200 text-sm leading-relaxed">Time-consuming process with multiple interview rounds and assessments</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <X className="w-4 h-4 text-red-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1 text-base">€250K Annual Cost</h4>
                    <p className="text-slate-200 text-sm leading-relaxed">Expensive mistakes from poor fits leading to project restarts and delays</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* MatchWise AI */}
          <Card className="bg-slate-800/80 border-emerald-500/30 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">MatchWise AI Human-First</h3>
                <p className="text-slate-300 text-base">Complete person analysis with superior results</p>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1 text-base">Holistic Analysis</h4>
                    <p className="text-slate-200 text-sm leading-relaxed">Analyzes technical skills + personality + values + communication style for perfect fit</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1 text-base">96% Success Rate</h4>
                    <p className="text-slate-200 text-sm leading-relaxed">Superior human fit leads to better team chemistry and project outcomes</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1 text-base">12-Second Analysis</h4>
                    <p className="text-slate-200 text-sm leading-relaxed">AI processes years of experience and personality data instantly</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1 text-base">€210K Annual Savings</h4>
                    <p className="text-slate-200 text-sm leading-relaxed">Massive cost reduction through better human fit and reduced failures</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-16">
          <Card className="bg-slate-800/80 border-blue-500/30 inline-block backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="text-6xl font-bold text-white mb-4">75x Faster</div>
              <div className="text-blue-300 text-xl font-medium">with 36% higher satisfaction</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
