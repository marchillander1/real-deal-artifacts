
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export default function ProblemSection() {
  return (
    <section id="solution" className="py-20 bg-slate-800/50 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Traditionell matchning missar det som spelar roll</h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            60% av projektmisslyckanden beror på dålig mänsklig passform, inte tekniska brister
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-red-600/10 border-red-500/30 hover:bg-red-600/20 transition-all duration-300 group">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-red-600/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">🧠</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Endast färdighetsfokus</h3>
              <p className="text-slate-300 leading-relaxed">
                Traditionella metoder ignorerar personlighet, värderingar och kommunikationsstil som avgör verklig framgång
              </p>
            </CardContent>
          </Card>

          <Card className="bg-orange-600/10 border-orange-500/30 hover:bg-orange-600/20 transition-all duration-300 group">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-orange-600/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">💬</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Dålig teamkemi</h3>
              <p className="text-slate-300 leading-relaxed">
                60% av projektproblem härrör från dålig personlig passform, vilket leder till kommunikationsbrott
              </p>
            </CardContent>
          </Card>

          <Card className="bg-yellow-600/10 border-yellow-500/30 hover:bg-yellow-600/20 transition-all duration-300 group">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-yellow-600/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Massiva dolda kostnader</h3>
              <p className="text-slate-300 leading-relaxed">
                Dålig mänsklig passform kostar 250K € årligen i projektstarter, förseningar och teamkonflikter
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
