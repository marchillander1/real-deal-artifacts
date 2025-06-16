
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Star, TrendingUp } from 'lucide-react';

export default function TestimonialsSection() {
  return (
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
  );
}
