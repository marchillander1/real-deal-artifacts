
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import BookMeetingButton from '@/components/BookMeetingButton';

interface CTASectionProps {
  user: any;
}

export default function CTASection({ user }: CTASectionProps) {
  return (
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
  );
}
