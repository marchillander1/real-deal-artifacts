import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { CompanyAuth } from '@/components/company/CompanyAuth';
import { CompanyDashboard } from '@/components/company/CompanyDashboard';
import { Card } from '@/components/ui/card';
import { Building2, Users, Zap, Shield } from 'lucide-react';

export default function TalentActivation() {
  const { user, session } = useAuth();

  if (session && user) {
    return <CompanyDashboard />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Building2 className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">MatchWise for Companies</h1>
              <p className="text-sm text-gray-600">Upload and manage your consultants</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Upload your consultants in bulk, let our AI analyze and package them
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get them market-ready in minutes with AI-powered profiling and smart matching
          </p>
        </div>

        {/* Key Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Bulk Upload</h3>
            <p className="text-sm text-gray-600">Upload multiple consultants in minutes</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <Zap className="h-8 w-8 text-emerald-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">AI-Powered</h3>
            <p className="text-sm text-gray-600">Smart matching and consultant packaging</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <Shield className="h-8 w-8 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Total Control</h3>
            <p className="text-sm text-gray-600">Edit, deactivate, update anytime</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-2xl mb-3">💰</div>
            <h3 className="font-semibold text-gray-900 mb-2">Free Until You Win</h3>
            <p className="text-sm text-gray-600">Only 2% success fee when hired</p>
          </div>
        </div>

        {/* Auth Component */}
        <CompanyAuth />

        {/* Additional Info */}
        <div className="mt-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">How it works</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl mb-2">1️⃣</div>
                <h4 className="font-medium text-gray-900 mb-1">Sign Up & Upload</h4>
                <p className="text-gray-600 text-sm">Create your company account and bulk upload consultant CVs</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">2️⃣</div>
                <h4 className="font-medium text-gray-900 mb-1">AI Analysis</h4>
                <p className="text-gray-600 text-sm">Our AI analyzes skills, values, and personality traits automatically</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">3️⃣</div>
                <h4 className="font-medium text-gray-900 mb-1">Go to Market</h4>
                <p className="text-gray-600 text-sm">Publish consultants and start matching with clients instantly</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}