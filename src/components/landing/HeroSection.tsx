
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Heart, Clock, Shield, Zap, Target, Users, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';

interface HeroSectionProps {
  user: any;
  totalNetworkConsultants: number;
}

export default function HeroSection({ user, totalNetworkConsultants }: HeroSectionProps) {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="relative z-10">
            <Badge className="mb-6 bg-blue-600/20 text-blue-300 border-blue-500/30 hover:bg-blue-600/30 backdrop-blur-sm">
              <Heart className="w-3 h-3 mr-1" />
              Human-First AI Matching
            </Badge>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Matcha hela
              <span className="text-blue-400 block">
                personen
              </span>
              <span className="text-white">inte bara CV:t</span>
            </h1>
            
            <p className="text-xl text-slate-300 mb-8 max-w-2xl leading-relaxed">
              MatchWise AI revolutionerar konsultmatchning genom att analysera både tekniska färdigheter 
              OCH mjuka faktorer som värderingar, kommunikationsstil och personlig passform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              {user ? (
                <Link to="/matchwiseai">
                  <Button size="lg" className="px-8 py-4 text-lg bg-blue-600 hover:bg-blue-700 text-white shadow-lg group">
                    <Zap className="mr-2 h-5 w-5" />
                    Gå till Dashboard
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              ) : (
                <Link to="/auth">
                  <Button size="lg" className="px-8 py-4 text-lg bg-blue-600 hover:bg-blue-700 text-white shadow-lg group">
                    <Zap className="mr-2 h-5 w-5" />
                    Starta gratis test
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              )}
              
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg border-slate-600 text-white hover:bg-slate-800 bg-slate-900/50 backdrop-blur-sm">
                <Target className="mr-2 h-5 w-5" />
                Beräkna ROI
              </Button>
            </div>

            {/* Enhanced Features Grid */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center group hover:scale-105 transition-transform">
                <div className="flex items-center justify-center mb-3">
                  <div className="p-3 bg-blue-600/20 rounded-xl backdrop-blur-sm border border-blue-500/30">
                    <Heart className="h-6 w-6 text-blue-400" />
                  </div>
                </div>
                <span className="text-white font-medium block">Human-First</span>
                <span className="text-slate-400 text-sm">AI Matching</span>
              </div>
              <div className="text-center group hover:scale-105 transition-transform">
                <div className="flex items-center justify-center mb-3">
                  <div className="p-3 bg-blue-600/20 rounded-xl backdrop-blur-sm border border-blue-500/30">
                    <Clock className="h-6 w-6 text-blue-400" />
                  </div>
                </div>
                <span className="text-white font-medium block">12 sekunder</span>
                <span className="text-slate-400 text-sm">Analys</span>
              </div>
              <div className="text-center group hover:scale-105 transition-transform">
                <div className="flex items-center justify-center mb-3">
                  <div className="p-3 bg-blue-600/20 rounded-xl backdrop-blur-sm border border-blue-500/30">
                    <Shield className="h-6 w-6 text-blue-400" />
                  </div>
                </div>
                <span className="text-white font-medium block">GDPR</span>
                <span className="text-slate-400 text-sm">Säker</span>
              </div>
            </div>
          </div>

          {/* Right side - Enhanced Dashboard Preview */}
          <div className="relative">
            <div className="absolute inset-0 bg-blue-600/20 rounded-3xl blur-xl"></div>
            <Card className="bg-slate-800/80 border-slate-700 backdrop-blur-sm shadow-2xl relative z-10 hover:scale-105 transition-transform duration-500">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <Logo />
                    <div>
                      <span className="text-white font-semibold block">MatchWise AI</span>
                      <span className="text-slate-400 text-sm">Platform v2.0</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-emerald-400 text-sm font-medium">Live</span>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Stats Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-blue-600/20 border-blue-500/30">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Users className="h-5 w-5 text-blue-400" />
                          <span className="text-xs text-blue-300">+15%</span>
                        </div>
                        <div className="text-xl font-bold text-white">{totalNetworkConsultants}</div>
                        <div className="text-xs text-blue-300">Nätverkskonsulter</div>
                      </CardContent>
                    </Card>

                    <Card className="bg-emerald-600/20 border-emerald-500/30">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <TrendingUp className="h-5 w-5 text-emerald-400" />
                          <span className="text-xs text-emerald-300">96%</span>
                        </div>
                        <div className="text-xl font-bold text-white">12s</div>
                        <div className="text-xs text-emerald-300">Matchtid</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* AI Engine Status */}
                  <Card className="bg-blue-600/20 border-blue-500/30">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white text-lg">🧠</span>
                          </div>
                          <div>
                            <div className="text-white font-medium">AI Matching Engine</div>
                            <div className="text-blue-300 text-sm">95% precision • Realtidsanalys</div>
                          </div>
                        </div>
                        <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
