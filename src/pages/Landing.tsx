
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Heart, Clock, Shield, Star, TrendingUp, Zap, Target, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';
import { useAuth } from '@/hooks/useAuth';
import { useSupabaseConsultantsDedup } from '@/hooks/useSupabaseConsultantsDedup';
import AIMatchingPreview from '@/components/AIMatchingPreview';
import ROICalculator from '@/components/ROICalculator';
import BookMeetingButton from '@/components/BookMeetingButton';

export default function Landing() {
  const { user } = useAuth();
  const { consultants } = useSupabaseConsultantsDedup();

  // Count only network consultants
  const networkConsultants = consultants.filter(consultant => consultant.type === 'existing');
  const totalNetworkConsultants = networkConsultants.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 -left-40 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 right-40 w-60 h-60 bg-pink-600/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Navbar */}
      <nav className="bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Logo size="md" variant="full" />
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => window.open('/cv-upload', '_blank')} className="text-slate-300 hover:text-white hover:bg-slate-800">
                Upload CV
              </Button>
              <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
                <Link to="/pricing-auth">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Content */}
            <div className="relative z-10">
              <Badge className="mb-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border-blue-400/50 hover:bg-blue-500/30 backdrop-blur-sm">
                <Heart className="w-3 h-3 mr-1" />
                Human-First AI Matching
              </Badge>
              
              <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Match the
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-500 block animate-pulse">
                  Whole Person
                </span>
                <span className="text-white">not just the CV</span>
              </h1>
              
              <p className="text-xl text-slate-300 mb-8 max-w-2xl leading-relaxed">
                MatchWise AI revolutionizes consultant matching by analyzing both technical skills AND soft factors 
                like values, communication style, and personal fit - delivering perfect matches in just 12 seconds.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                {user ? (
                  <Link to="/matchwiseai">
                    <Button size="lg" className="px-8 py-4 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-600/25 group">
                      <Zap className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                ) : (
                  <Link to="/auth">
                    <Button size="lg" className="px-8 py-4 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-600/25 group">
                      <Zap className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                      Start Free Trial
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                )}
                
                <Button variant="outline" size="lg" className="px-8 py-4 text-lg border-slate-600 text-white hover:bg-slate-800 bg-slate-900/50 backdrop-blur-sm">
                  <Target className="mr-2 h-5 w-5" />
                  Calculate ROI
                </Button>
              </div>

              {/* Enhanced Features Grid */}
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center group hover:scale-105 transition-transform">
                  <div className="flex items-center justify-center mb-3">
                    <div className="p-3 bg-gradient-to-br from-pink-500/20 to-pink-600/20 rounded-xl backdrop-blur-sm border border-pink-400/30">
                      <Heart className="h-6 w-6 text-pink-400" />
                    </div>
                  </div>
                  <span className="text-white font-medium block">Human-First</span>
                  <span className="text-slate-400 text-sm">AI Matching</span>
                </div>
                <div className="text-center group hover:scale-105 transition-transform">
                  <div className="flex items-center justify-center mb-3">
                    <div className="p-3 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl backdrop-blur-sm border border-blue-400/30">
                      <Clock className="h-6 w-6 text-blue-400" />
                    </div>
                  </div>
                  <span className="text-white font-medium block">12-Second</span>
                  <span className="text-slate-400 text-sm">Analysis</span>
                </div>
                <div className="text-center group hover:scale-105 transition-transform">
                  <div className="flex items-center justify-center mb-3">
                    <div className="p-3 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl backdrop-blur-sm border border-purple-400/30">
                      <Shield className="h-6 w-6 text-purple-400" />
                    </div>
                  </div>
                  <span className="text-white font-medium block">GDPR</span>
                  <span className="text-slate-400 text-sm">Secure</span>
                </div>
              </div>
            </div>

            {/* Right side - Enhanced Dashboard Preview */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-xl"></div>
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
                      <Card className="bg-gradient-to-br from-blue-600/20 to-blue-700/20 border-blue-500/30">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <Users className="h-5 w-5 text-blue-400" />
                            <span className="text-xs text-blue-300">+15%</span>
                          </div>
                          <div className="text-xl font-bold text-white">{totalNetworkConsultants}</div>
                          <div className="text-xs text-blue-300">Network Consultants</div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-emerald-600/20 to-emerald-700/20 border-emerald-500/30">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <TrendingUp className="h-5 w-5 text-emerald-400" />
                            <span className="text-xs text-emerald-300">96%</span>
                          </div>
                          <div className="text-xl font-bold text-white">12s</div>
                          <div className="text-xs text-emerald-300">Match Time</div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* AI Engine Status */}
                    <Card className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-500/30">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                              <span className="text-white text-lg">🧠</span>
                            </div>
                            <div>
                              <div className="text-white font-medium">AI Matching Engine</div>
                              <div className="text-purple-300 text-sm">95% accuracy • Real-time analysis</div>
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

      {/* Problem Section */}
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

      {/* Live AI Matching Demo */}
      <section className="py-20 bg-slate-900/50 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">See Our AI in Action</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Experience real-time human-first matching that analyzes the whole person in seconds
            </p>
          </div>

          <AIMatchingPreview />
        </div>
      </section>

      {/* Solution Section */}
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

      {/* Enhanced Match Explanation Section */}
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

      {/* ROI Calculator Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Calculate Your ROI</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              See exactly how much MatchWise AI can save your company
            </p>
          </div>

          <ROICalculator />
        </div>
      </section>

      {/* ROI Section */}
      <section id="benefits" className="py-20 bg-slate-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Proven ROI That Speaks for Itself</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25 hover:scale-105 transition-transform">
              <CardContent className="p-8 text-center">
                <Heart className="h-12 w-12 mx-auto mb-4 text-emerald-100" />
                <div className="text-4xl font-bold mb-2">850+</div>
                <div className="text-xl font-semibold mb-2">Hours Saved Annually</div>
                <div className="text-emerald-100">≈ €210K in cost savings</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25 hover:scale-105 transition-transform">
              <CardContent className="p-8 text-center">
                <Star className="h-12 w-12 mx-auto mb-4 text-blue-100" />
                <div className="text-4xl font-bold mb-2">96%</div>
                <div className="text-xl font-semibold mb-2">Customer Satisfaction</div>
                <div className="text-blue-100">+36% vs manual matching</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/25 hover:scale-105 transition-transform">
              <CardContent className="p-8 text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-purple-100" />
                <div className="text-4xl font-bold mb-2">75x</div>
                <div className="text-xl font-semibold mb-2">Faster Matching</div>
                <div className="text-purple-100">12 seconds vs 15 hours</div>
              </CardContent>
            </Card>
          </div>

          {/* Testimonials */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-8 text-center">What Our Customers Say</h3>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="border-l-4 border-blue-500 pl-6 hover:scale-105 transition-transform">
                  <p className="text-slate-300 text-lg italic mb-4">
                    "MatchWise AI understands not just technical skills but also if the person fits our team. Team chemistry improved to 95% compared to previous 60%."
                  </p>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">E</div>
                    <div>
                      <div className="font-semibold text-white">Erik Svensson</div>
                      <div className="text-slate-400 text-sm">CTO, TechCorp AB</div>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-purple-500 pl-6 hover:scale-105 transition-transform">
                  <p className="text-slate-300 text-lg italic mb-4">
                    "The ROI is incredible. We saved €210K the first year through better human fit and reduced project delays."
                  </p>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">M</div>
                    <div>
                      <div className="font-semibold text-white">Maria Lundberg</div>
                      <div className="text-slate-400 text-sm">HR Manager, Innovation Labs</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">💰 Simple, Transparent Pricing</h2>
            <p className="text-xl text-slate-300">Choose the plan that fits your company's needs</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Basic Plan */}
            <Card className="bg-slate-800/50 border-slate-600 hover:bg-slate-800/70 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-6 h-6 bg-blue-600 rounded"></div>
                  <h3 className="text-xl font-bold text-white">Basic Plan</h3>
                </div>
                <p className="text-slate-400 mb-6">For 1-3 users</p>
                <div className="text-3xl font-bold text-white mb-6">€99<span className="text-lg text-slate-400">/month</span></div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-slate-300">
                    <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3"></div>
                    Full access to consultant search and filtering
                  </li>
                  <li className="flex items-center text-slate-300">
                    <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3"></div>
                    View detailed profiles incl. soft skills and CVs
                  </li>
                  <li className="flex items-center text-slate-300">
                    <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3"></div>
                    Save favorites & download CVs
                  </li>
                  <li className="flex items-center text-slate-300">
                    <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3"></div>
                    1 admin + 2 standard users
                  </li>
                  <li className="flex items-center text-slate-300">
                    <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3"></div>
                    Email support
                  </li>
                </ul>

                <Button variant="outline" className="w-full border-slate-600 text-white hover:bg-slate-800">
                  Start Free Trial
                </Button>
              </CardContent>
            </Card>

            {/* Team Plan */}
            <Card className="bg-slate-800/50 border-emerald-500 relative hover:bg-slate-800/70 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-emerald-600 text-white">Most Popular</Badge>
              </div>
              <CardContent className="p-8">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-6 h-6 bg-emerald-600 rounded"></div>
                  <h3 className="text-xl font-bold text-white">Team Plan</h3>
                </div>
                <p className="text-slate-400 mb-6">For 3-10 users</p>
                <div className="text-3xl font-bold text-white mb-6">€199<span className="text-lg text-slate-400">/month</span></div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-slate-300">
                    <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3"></div>
                    Everything in Basic, plus:
                  </li>
                  <li className="flex items-center text-slate-300">
                    <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3"></div>
                    Extended user access
                  </li>
                  <li className="flex items-center text-slate-300">
                    <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3"></div>
                    Role-based access control
                  </li>
                  <li className="flex items-center text-slate-300">
                    <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3"></div>
                    Priority email support
                  </li>
                  <li className="flex items-center text-slate-300">
                    <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3"></div>
                    Early feature access
                  </li>
                  <li className="flex items-center text-slate-300">
                    <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3"></div>
                    Export consultant lists
                  </li>
                </ul>

                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                  Start Free Trial
                </Button>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="bg-slate-800/50 border-red-600 hover:bg-slate-800/70 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-6 h-6 bg-red-600 rounded"></div>
                  <h3 className="text-xl font-bold text-white">Enterprise</h3>
                </div>
                <p className="text-slate-400 mb-6">For organizations using Free Talent Pool</p>
                <div className="text-3xl font-bold text-white mb-6">€599<span className="text-lg text-slate-400">/month</span></div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-slate-300">
                    <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3"></div>
                    Unlimited searches in the open consultant database
                  </li>
                  <li className="flex items-center text-slate-300">
                    <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3"></div>
                    Direct access to incoming freelance CVs
                  </li>
                  <li className="flex items-center text-slate-300">
                    <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3"></div>
                    Premium visibility settings for your jobs
                  </li>
                  <li className="flex items-center text-slate-300">
                    <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3"></div>
                    Integration possibilities (API access upon request)
                  </li>
                  <li className="flex items-center text-slate-300">
                    <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3"></div>
                    Dedicated onboarding
                  </li>
                  <li className="flex items-center text-slate-300">
                    <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3"></div>
                    SLA-backed support
                  </li>
                </ul>

                <Button variant="outline" className="w-full border-slate-600 text-white hover:bg-slate-800">
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.1\"%3E%3Ccircle cx=\"7\" cy=\"7\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">Ready to Transform Your Consultant Matching?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join leading companies saving €210K annually with 96% human fit success rate
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <BookMeetingButton />
            
            {!user && (
              <Link to="/auth">
                <Button size="lg" className="px-8 py-4 text-lg bg-white text-blue-600 hover:bg-gray-100 shadow-lg group">
                  <Zap className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            )}
          </div>
          
          <div className="flex items-center justify-center space-x-8 text-blue-100 text-sm">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></div>
              No credit card required
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></div>
              14-day free trial
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></div>
              Cancel anytime
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/80 py-12 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Logo />
              <p className="text-slate-400 mt-4">
                Human-first AI matching that delivers 96% fit in 12 seconds.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">GDPR</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-8 pt-8 text-center">
            <p className="text-slate-400">© 2024 MatchWise AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
