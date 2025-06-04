
import React from 'react';
import { Users, Briefcase, CheckCircle, Clock, TrendingUp, DollarSign, Star } from 'lucide-react';
import StatCard from './StatCard';
import { Stats } from '../types/consultant';

interface DashboardProps {
  stats: Stats;
  consultantsCount: number;
  demoMode: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ stats, consultantsCount, demoMode }) => {
  const recentMatches = [
    { consultant: 'Anna Lindqvist', assignment: 'React Developer', score: 94, time: '2 min ago' },
    { consultant: 'Erik Johansson', assignment: 'DevOps Engineer', score: 89, time: '15 min ago' },
    { consultant: 'Maria Andersson', assignment: 'Java Architect', score: 96, time: '1 hour ago' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Platform Overview</h2>
          <p className="text-gray-600">Real-time insights and performance metrics</p>
        </div>
        {demoMode && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <p className="text-orange-800 text-sm font-medium">🎬 Demo Mode Active - Data refreshes automatically</p>
          </div>
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={Users} 
          title="Active Consultants" 
          value={consultantsCount} 
          change="+12 this week"
          color="blue" 
        />
        <StatCard 
          icon={Briefcase} 
          title="Open Assignments" 
          value={stats.activeAssignments} 
          change="+5 today"
          color="green" 
        />
        <StatCard 
          icon={CheckCircle} 
          title="Successful Matches" 
          value={stats.successfulMatches} 
          change="+23 this month"
          color="purple" 
        />
        <StatCard 
          icon={Clock} 
          title="Avg Match Time" 
          value={stats.avgMatchTime} 
          change="67% faster"
          color="orange" 
        />
      </div>

      {/* ROI Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Time Saved</p>
              <p className="text-3xl font-bold">{stats.timeSaved}</p>
              <p className="text-green-200 text-sm mt-1">≈ 2.1M SEK in cost savings</p>
            </div>
            <Clock className="h-8 w-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Client Satisfaction</p>
              <p className="text-3xl font-bold">{stats.clientSatisfaction}%</p>
              <p className="text-blue-200 text-sm mt-1">+8% vs manual matching</p>
            </div>
            <Star className="h-8 w-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Platform Revenue</p>
              <p className="text-3xl font-bold">{stats.revenue}</p>
              <p className="text-purple-200 text-sm mt-1">Monthly recurring</p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent AI Matches</h3>
        <div className="space-y-3">
          {recentMatches.map((match, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">{match.consultant.split(' ')[0][0]}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{match.consultant}</p>
                  <p className="text-sm text-gray-600">matched to {match.assignment}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-sm font-medium">
                  {match.score}% match
                </span>
                <span className="text-gray-500 text-sm">{match.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
