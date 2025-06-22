
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, TrendingUp } from 'lucide-react';
import { useSupabaseConsultantsWithDemo } from "@/hooks/useSupabaseConsultantsWithDemo";

export const HeroSection = () => {
  const { consultants } = useSupabaseConsultantsWithDemo();
  const networkConsultants = consultants.filter(consultant => consultant.type === 'new');
  
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-20 sm:py-24">
      <div className="absolute inset-0 pointer-events-none [mask-image:radial-gradient(50%_50%_at_50%_50%,white,transparent)]"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-3xl opacity-30 sm:opacity-50 w-[600px] h-[400px] bg-gradient-to-br from-blue-700 via-blue-500 to-purple-700 rounded-full"></div>
      
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-12">
            <h2 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Match the whole person<br />
              not just the CV
            </h2>
            <p className="text-xl sm:text-2xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
              MatchWise AI revolutionizes consultant matching by analyzing both technical skills AND soft factors like values, communication style, and personal fit.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all">
              <Link to="/matchwiseai" className="flex items-center">
                Find Perfect Consultants
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white px-8 py-3 rounded-lg font-semibold transition-all">
              <Link to="/cv-upload" className="flex items-center">
                Join as Consultant
                <Users className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          {/* Live Stats Section - Smaller */}
          <div className="mb-8 flex justify-center">
            <div className="bg-slate-800/90 backdrop-blur-sm rounded-xl p-4 text-white max-w-lg w-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-bold">✨</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">MatchWise AI</h3>
                    <p className="text-slate-300 text-xs">Platform v2.0</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-xs font-medium">Live</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-blue-600/30 rounded-lg p-3 border border-blue-500/20">
                  <div className="flex items-center justify-between mb-1">
                    <Users className="h-4 w-4 text-blue-300" />
                    <span className="text-green-400 text-xs font-medium">+15%</span>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{networkConsultants.length}</div>
                  <div className="text-blue-200 text-xs">Network Consultants</div>
                </div>

                <div className="bg-teal-600/30 rounded-lg p-3 border border-teal-500/20">
                  <div className="flex items-center justify-between mb-1">
                    <TrendingUp className="h-4 w-4 text-teal-300" />
                    <span className="text-green-400 text-xs font-medium">96%</span>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">12s</div>
                  <div className="text-teal-200 text-xs">Match Time</div>
                </div>
              </div>

              <div className="bg-blue-600/20 rounded-lg p-3 border border-blue-500/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-red-400 to-pink-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs">🧠</span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-sm">AI Matching Engine</h4>
                      <p className="text-slate-300 text-xs">95% precision • Real-time analysis</p>
                    </div>
                  </div>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-slate-500">
            Trusted by leading companies and top-tier consultants in Sweden
          </p>
        </div>
      </div>
    </section>
  );
};
