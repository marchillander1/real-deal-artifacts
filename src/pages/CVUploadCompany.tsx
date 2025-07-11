import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { CompanyAuth } from '@/components/company/CompanyAuth';
import { CompanyDashboard } from '@/components/company/CompanyDashboard';
import { Card } from '@/components/ui/card';
import { Building2, Users, Zap, Shield } from 'lucide-react';

export default function CVUploadCompany() {
  const { user, session } = useAuth();

  if (session && user) {
    return <CompanyDashboard />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Building2 className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold text-white">MatchWise for Companies</h1>
          </div>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Upload your consultants in bulk, let our AI analyze and package them, and get them market-ready in minutes
          </p>
        </div>

        {/* Key Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-slate-800/50 border-slate-700 p-6 text-center">
            <Users className="h-8 w-8 text-blue-400 mx-auto mb-3" />
            <h3 className="font-semibold text-white mb-2">Bulk Upload</h3>
            <p className="text-sm text-slate-300">Upload multiple consultants in minutes</p>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700 p-6 text-center">
            <Zap className="h-8 w-8 text-emerald-400 mx-auto mb-3" />
            <h3 className="font-semibold text-white mb-2">AI-Powered</h3>
            <p className="text-sm text-slate-300">Smart matching and consultant packaging</p>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700 p-6 text-center">
            <Shield className="h-8 w-8 text-purple-400 mx-auto mb-3" />
            <h3 className="font-semibold text-white mb-2">Total Control</h3>
            <p className="text-sm text-slate-300">Edit, deactivate, update anytime</p>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700 p-6 text-center">
            <div className="text-2xl mb-3">💰</div>
            <h3 className="font-semibold text-white mb-2">Free Until You Win</h3>
            <p className="text-sm text-slate-300">Only 2% success fee when hired</p>
          </Card>
        </div>

        {/* Auth Component */}
        <CompanyAuth />

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <div className="bg-slate-800/30 rounded-lg p-6 border border-slate-700">
            <h3 className="text-xl font-semibold text-white mb-4">How it works</h3>
            <div className="grid md:grid-cols-3 gap-6 text-sm text-slate-300">
              <div>
                <div className="text-2xl mb-2">1️⃣</div>
                <h4 className="font-medium text-white mb-1">Sign Up & Upload</h4>
                <p>Create your company account and bulk upload consultant CVs</p>
              </div>
              <div>
                <div className="text-2xl mb-2">2️⃣</div>
                <h4 className="font-medium text-white mb-1">AI Analysis</h4>
                <p>Our AI analyzes skills, values, and personality traits automatically</p>
              </div>
              <div>
                <div className="text-2xl mb-2">3️⃣</div>
                <h4 className="font-medium text-white mb-1">Go to Market</h4>
                <p>Publish consultants and start matching with clients instantly</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}