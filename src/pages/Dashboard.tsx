
import React from 'react';
import Navbar from '@/components/Navbar';
import { DashboardTabs } from '@/components/DashboardTabs';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome to your MatchWise dashboard. Manage consultants, assignments, and view analytics.
          </p>
        </div>
        <DashboardTabs />
      </div>
    </div>
  );
};

export default Dashboard;
