
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Heart } from 'lucide-react';

export default function SolutionSection() {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Human-First AI That Truly Understands</h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            MatchWise AI analyzes the whole person - both technical skills and soft factors for perfect fit
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="flex items-start space-x-4 group hover:scale-105 transition-transform">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500/20 to-pink-600/20 rounded-2xl flex items-center justify-center flex-shrink-0 border border-pink-400/30">
                <Heart className="h-8 w-8 text-pink-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Values & Personality</h3>
                <p className="text-slate-300">
                  AI analyzes communication style, work approach, and personal values for deep compatibility
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 group hover:scale-105 transition-transform">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl flex items-center justify-center flex-shrink-0 border border-blue-400/30">
                <span className="text-3xl">🧠</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Cultural Fit</h3>
                <p className="text-slate-300">
                  Advanced algorithms match team dynamics, leadership style, and adaptability
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 group hover:scale-105 transition-transform">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center flex-shrink-0 border border-purple-400/30">
                <span className="text-3xl">💬</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Communication Style</h3>
                <p className="text-slate-300">
                  Identifies and matches communication types for optimal team harmony and productivity
                </p>
              </div>
            </div>
          </div>

          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-6">How It Works</h3>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4 group hover:scale-105 transition-transform">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold shadow-lg">1</div>
                  <div>
                    <h4 className="font-semibold text-white">Upload CV & Requirements</h4>
                    <p className="text-slate-400 text-sm">Define both technical and soft requirements for the project</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 group hover:scale-105 transition-transform">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center text-white font-bold shadow-lg">2</div>
                  <div>
                    <h4 className="font-semibold text-white">Human-First AI Analysis</h4>
                    <p className="text-slate-400 text-sm">AI analyzes values, communication, and personality</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 group hover:scale-105 transition-transform">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-full flex items-center justify-center text-white font-bold shadow-lg">3</div>
                  <div>
                    <h4 className="font-semibold text-white">Perfect Human Match</h4>
                    <p className="text-slate-400 text-sm">Get ranked candidates based on holistic fit</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
