import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { MessageSquare, Brain, Target, Users, TrendingUp, Zap } from 'lucide-react';

export default function AIPowerBriefing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent mb-6">
              AI Power Briefing
            </h1>
            <p className="text-2xl md:text-3xl text-blue-200 mb-8 font-medium">
              Walk into every meeting with insider-level intelligence.
            </p>
            <div className="max-w-3xl mx-auto">
              <p className="text-lg text-slate-300 leading-relaxed">
                Forget generic prep. AI Power Briefing isn't just a summary – it's your strategic playbook.
              </p>
              <p className="text-lg text-slate-300 leading-relaxed mt-4">
                Before any sales call, pitch, or partnership meeting, our AI analyzes the company, maps the participants, and connects their needs to your services. The result: a tailored Power Briefing that gives you an unfair advantage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <Brain className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Company Intelligence</h3>
                  <p className="text-slate-300">Deep analysis of the target company's needs, challenges, and strategic direction.</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <Users className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Participant Mapping</h3>
                  <p className="text-slate-300">LinkedIn insights and decision-maker profiles to personalize your approach.</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <Target className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Strategic Playbook</h3>
                  <p className="text-slate-300">Actionable recommendations tailored to your services and their specific needs.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Instructions Block */}
      <section className="pb-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-r from-emerald-900/30 to-blue-900/30 border-emerald-500/30 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3"></div>
                  <h2 className="text-2xl font-bold text-white">Fill in these details in the chat to get started:</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 text-slate-200">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <span className="text-2xl mr-3">1️⃣</span>
                      <p>What services do you offer?</p>
                    </div>
                    <div className="flex items-start">
                      <span className="text-2xl mr-3">2️⃣</span>
                      <p>Your profile or company info (LinkedIn or short description)</p>
                    </div>
                    <div className="flex items-start">
                      <span className="text-2xl mr-3">3️⃣</span>
                      <p>The company website you're meeting with</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <span className="text-2xl mr-3">4️⃣</span>
                      <p>Names and roles of the participants</p>
                    </div>
                    <div className="flex items-start">
                      <span className="text-2xl mr-3">5️⃣</span>
                      <p>LinkedIn profiles of the participants</p>
                    </div>
                    <div className="flex items-start">
                      <span className="text-2xl mr-3">6️⃣</span>
                      <p>Meeting context (purpose, agenda, or background if known)</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-700">
                  <div className="flex flex-col md:flex-row gap-4 text-center">
                    <div className="flex items-center justify-center">
                      <span className="text-2xl mr-2">🌐</span>
                      <p className="text-blue-200 italic">You can write in your native language.</p>
                    </div>
                    <div className="flex items-center justify-center">
                      <span className="text-2xl mr-2">💡</span>
                      <p className="text-blue-200 italic">The more context you provide, the more powerful and personal your briefing becomes.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Chat Widget */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <Card className="bg-slate-800/30 border-slate-700 backdrop-blur-sm overflow-hidden">
              <CardContent className="p-0">
                <iframe
                  src="https://udify.app/chatbot/KyYgQkhLyu9gOhkA"
                  style={{ width: '100%', height: '100%', minHeight: '700px' }}
                  frameBorder="0"
                  allow="microphone"
                  className="rounded-lg"
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