import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

export default function AIPowerBriefing() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Simple Header */}
      <section className="pt-20 pb-16 bg-slate-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              AI Power Briefing
            </h1>
            <p className="text-xl text-slate-600 mb-8">
              Get a tailored briefing for your next meeting
            </p>
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <p className="text-lg text-slate-700 leading-relaxed">
                Our AI analyzes companies and participants to give you strategic insights before any sales call, pitch, or partnership meeting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Instructions */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">How to get started</h2>
            <p className="text-lg text-slate-600">Provide these details in the chat below:</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card className="border border-slate-200">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">1</div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Your services</h4>
                      <p className="text-slate-600">What do you offer?</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">2</div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Your profile</h4>
                      <p className="text-slate-600">LinkedIn or company description</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">3</div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Target company</h4>
                      <p className="text-slate-600">Company website</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border border-slate-200">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">4</div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Participants</h4>
                      <p className="text-slate-600">Names and roles</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">5</div>
                    <div>
                      <h4 className="font-semibold text-slate-900">LinkedIn profiles</h4>
                      <p className="text-slate-600">Of meeting participants</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">6</div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Meeting context</h4>
                      <p className="text-slate-600">Purpose and agenda</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center bg-blue-50 rounded-lg p-6">
            <p className="text-blue-700 font-medium mb-2">💡 Pro tip</p>
            <p className="text-blue-600">The more details you provide, the better your briefing will be. You can write in any language.</p>
          </div>
        </div>
      </section>

      {/* Chat Widget */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Start your briefing</h3>
            <p className="text-slate-600">Enter your meeting details below</p>
          </div>
          
          <Card className="border border-slate-200 shadow-sm">
            <CardContent className="p-0">
              <iframe
                src="https://udify.app/chatbot/KyYgQkhLyu9gOhkA"
                style={{ width: '100%', height: '600px' }}
                frameBorder="0"
                allow="microphone"
                className="rounded-lg"
              />
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}