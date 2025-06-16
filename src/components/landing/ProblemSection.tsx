
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export default function ProblemSection() {
  return (
    <section id="solution" className="py-20 bg-slate-800/50 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Traditional Matching Misses What Matters Most</h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            60% of project failures come from poor human fit, not technical gaps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-gradient-to-br from-red-500/10 to-red-600/10 border-red-500/30 hover:from-red-500/20 hover:to-red-600/20 transition-all duration-300 group">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">🧠</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Skills-Only Focus</h3>
              <p className="text-slate-300">
                Traditional methods ignore personality, values, and communication style that determine real success
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-500/30 hover:from-orange-500/20 hover:to-orange-600/20 transition-all duration-300 group">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">💬</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Poor Team Chemistry</h3>
              <p className="text-slate-300">
                60% of project issues stem from poor personal fit, leading to communication breakdowns
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border-yellow-500/30 hover:from-yellow-500/20 hover:to-yellow-600/20 transition-all duration-300 group">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Massive Hidden Costs</h3>
              <p className="text-slate-300">
                Poor human fit costs €250K annually in project restarts, delays, and team conflicts
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
