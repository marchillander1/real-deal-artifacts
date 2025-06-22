import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, Users } from 'lucide-react';

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-20 sm:py-24">
      <div className="absolute inset-0 pointer-events-none [mask-image:radial-gradient(50%_50%_at_50%_50%,white,transparent)]"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-3xl opacity-30 sm:opacity-50 w-[600px] h-[400px] bg-gradient-to-br from-blue-700 via-blue-500 to-purple-700 rounded-full"></div>
      
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            AI-Powered Consultant Matching
          </h1>
          <p className="mt-6 text-lg text-slate-600">
            Find the perfect IT consultants for your projects with our AI-driven platform. 
            Join our network and unlock your career potential.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
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
          
          <p className="mt-8 text-sm text-slate-500">
            Trusted by leading companies and top-tier consultants in Sweden
          </p>
        </div>
      </div>
    </section>
  );
};
