import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { MessageSquare, Brain, Target, Users, TrendingUp, Zap, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';

export default function AIPowerBriefing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full px-6 py-2 mb-8">
                <Sparkles className="w-5 h-5 text-blue-400" />
                <span className="text-blue-300 font-medium">AI-Powered Intelligence</span>
              </div>
              
              <h1 className="text-6xl md:text-7xl font-bold mb-8">
                <span className="bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                  AI Power Briefing
                </span>
              </h1>
              
              <p className="text-3xl md:text-4xl text-blue-200 mb-8 font-light leading-tight">
                Walk into every meeting with 
                <span className="text-transparent bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text font-semibold"> insider-level intelligence</span>
              </p>
              
              <div className="max-w-4xl mx-auto bg-slate-900/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 mb-12">
                <p className="text-xl text-white/90 leading-relaxed mb-6">
                  <strong className="text-emerald-400">Forget generic prep.</strong> AI Power Briefing isn't just a summary – it's your <em>strategic playbook</em>.
                </p>
                <p className="text-xl text-white/80 leading-relaxed">
                  Before any sales call, pitch, or partnership meeting, our AI analyzes the company, maps the participants, and connects their needs to your services. The result: a tailored Power Briefing that gives you an <strong className="text-purple-400">unfair advantage</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-white mb-16">
              How It Works
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 mb-20">
              <Card className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-600/50 backdrop-blur-sm hover:border-blue-500/50 transition-all duration-300 hover-scale">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Brain className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Company Intelligence</h3>
                  <p className="text-white/70 text-lg leading-relaxed">Deep analysis of the target company's needs, challenges, and strategic direction with real-time market insights.</p>
                </CardContent>
              </Card>
              
              <Card className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-600/50 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300 hover-scale">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Participant Mapping</h3>
                  <p className="text-white/70 text-lg leading-relaxed">LinkedIn insights and decision-maker profiles to personalize your approach and identify key influencers.</p>
                </CardContent>
              </Card>
              
              <Card className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-600/50 backdrop-blur-sm hover:border-emerald-500/50 transition-all duration-300 hover-scale">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Target className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Strategic Playbook</h3>
                  <p className="text-white/70 text-lg leading-relaxed">Actionable recommendations tailored to your services and their specific needs with talking points.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Instructions Section */}
      <section className="pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Get Your Power Briefing</h2>
              <p className="text-xl text-white/70">Simply provide these details in the chat below to generate your personalized briefing</p>
            </div>
            
            <Card className="bg-gradient-to-br from-emerald-900/30 via-blue-900/30 to-purple-900/30 border-emerald-400/30 backdrop-blur-sm overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-emerald-500/20 to-blue-500/20 p-6 border-b border-emerald-400/20">
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                    <h3 className="text-2xl font-bold text-white">Required Information</h3>
                    <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
                
                <div className="p-10">
                  <div className="grid md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <div className="flex items-start group">
                        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl mr-6 flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                          <span className="text-white font-bold text-lg">1</span>
                        </div>
                        <div>
                          <h4 className="text-xl font-semibold text-white mb-2">Your Services</h4>
                          <p className="text-white/80">What services do you offer?</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start group">
                        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mr-6 flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                          <span className="text-white font-bold text-lg">2</span>
                        </div>
                        <div>
                          <h4 className="text-xl font-semibold text-white mb-2">Your Profile</h4>
                          <p className="text-white/80">Your profile or company info (LinkedIn or short description)</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start group">
                        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-xl mr-6 flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                          <span className="text-white font-bold text-lg">3</span>
                        </div>
                        <div>
                          <h4 className="text-xl font-semibold text-white mb-2">Target Company</h4>
                          <p className="text-white/80">The company website you're meeting with</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="flex items-start group">
                        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl mr-6 flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                          <span className="text-white font-bold text-lg">4</span>
                        </div>
                        <div>
                          <h4 className="text-xl font-semibold text-white mb-2">Participants</h4>
                          <p className="text-white/80">Names and roles of the meeting participants</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start group">
                        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl mr-6 flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                          <span className="text-white font-bold text-lg">5</span>
                        </div>
                        <div>
                          <h4 className="text-xl font-semibold text-white mb-2">LinkedIn Profiles</h4>
                          <p className="text-white/80">LinkedIn profiles of the participants</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start group">
                        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-yellow-500 to-emerald-500 rounded-xl mr-6 flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                          <span className="text-white font-bold text-lg">6</span>
                        </div>
                        <div>
                          <h4 className="text-xl font-semibold text-white mb-2">Meeting Context</h4>
                          <p className="text-white/80">Meeting purpose, agenda, or background if known</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-12 pt-8 border-t border-white/10">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-center">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-2xl">🌐</span>
                        </div>
                        <p className="text-white/90 font-medium">Write in your native language</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <span className="text-2xl">💡</span>
                        </div>
                        <p className="text-white/90 font-medium">More context = more powerful briefing</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Chat Widget */}
      <section className="pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-white mb-2">AI Chat Interface</h3>
              <p className="text-white/70">Provide your meeting details below and get your personalized Power Briefing</p>
            </div>
            
            <Card className="bg-slate-900/40 border-slate-600/50 backdrop-blur-sm overflow-hidden shadow-2xl">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 p-4 border-b border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <span className="text-white/70 font-mono text-sm">AI Power Briefing Chat</span>
                  </div>
                </div>
                <iframe
                  src="https://udify.app/chatbot/KyYgQkhLyu9gOhkA"
                  style={{ width: '100%', height: '100%', minHeight: '700px' }}
                  frameBorder="0"
                  allow="microphone"
                  className="bg-white"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}