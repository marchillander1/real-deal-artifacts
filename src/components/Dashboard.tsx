
import React, { useState, useRef } from 'react';
import { Users, Briefcase, TrendingUp, Clock, Target, Plus, Sparkles, Star, DollarSign } from 'lucide-react';
import StatCard from './StatCard';
import CreateAssignmentForm from './CreateAssignmentForm';
import { Consultant, Assignment } from '../types/consultant';
import { useToast } from "@/hooks/use-toast";

interface DashboardProps {
  consultants: Consultant[];
  assignments: Assignment[];
  onMatch: (assignment: Assignment) => void;
  onFileUpload?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ consultants, assignments, onMatch, onFileUpload }) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const stats = {
    totalConsultants: consultants.length,
    activeAssignments: assignments.length,
    successfulMatches: 156,
    avgMatchTime: "12 seconds"
  };

  const handleCreateAssignment = (newAssignment: Assignment) => {
    // This would be handled by parent component
    setShowCreateForm(false);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onFileUpload) {
      onFileUpload(event);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Platform Overview</h1>
        <p className="text-gray-600">Real-time insights and performance metrics</p>
      </div>

      {/* Top Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Active Consultants</p>
              <p className="text-3xl font-bold text-gray-900 mb-2">{stats.totalConsultants}</p>
              <p className="text-sm text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12 this week
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Open Assignments</p>
              <p className="text-3xl font-bold text-gray-900 mb-2">{stats.activeAssignments}</p>
              <p className="text-sm text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +5 today
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Briefcase className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Successful Matches</p>
              <p className="text-3xl font-bold text-gray-900 mb-2">{stats.successfulMatches}</p>
              <p className="text-sm text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +23 this month
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Avg Match Time</p>
              <p className="text-3xl font-bold text-gray-900 mb-2">{stats.avgMatchTime}</p>
              <p className="text-sm text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                67% faster
              </p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Large Performance Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Time Saved</h3>
              <Clock className="h-8 w-8 opacity-80" />
            </div>
            <p className="text-4xl font-bold mb-2">850 hours</p>
            <p className="text-green-100">≈ 2.1M SEK in cost savings</p>
          </div>
          <div className="absolute -bottom-4 -right-4 opacity-20">
            <Clock className="h-24 w-24" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Client Satisfaction</h3>
              <Star className="h-8 w-8 opacity-80" />
            </div>
            <p className="text-4xl font-bold mb-2">96%</p>
            <p className="text-blue-100">+8% vs manual matching</p>
          </div>
          <div className="absolute -bottom-4 -right-4 opacity-20">
            <Star className="h-24 w-24" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Platform Revenue</h3>
              <DollarSign className="h-8 w-8 opacity-80" />
            </div>
            <p className="text-4xl font-bold mb-2">2.4M SEK</p>
            <p className="text-purple-100">Monthly recurring</p>
          </div>
          <div className="absolute -bottom-4 -right-4 opacity-20">
            <DollarSign className="h-24 w-24" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
            <p className="text-gray-600">Streamline your workflow</p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="bg-green-100 p-2 rounded-lg">
              <Plus className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-left">
              <h3 className="font-medium text-gray-900">Create Assignment</h3>
              <p className="text-sm text-gray-600">Add new project</p>
            </div>
          </button>
          
          <button 
            onClick={handleUploadClick}
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="bg-blue-100 p-2 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-left">
              <h3 className="font-medium text-gray-900">Upload CV</h3>
              <p className="text-sm text-gray-600">Add consultant</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent AI Matches */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Recent AI Matches</h2>
            <p className="text-gray-600">Latest successful consultant matches</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                A
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Anna Lindqvist</h3>
                <p className="text-sm text-gray-600">matched to React Developer</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <span className="text-lg font-bold text-green-600">94% match</span>
                <p className="text-xs text-gray-500">2 min ago</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                M
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Marcus Johansson</h3>
                <p className="text-sm text-gray-600">matched to UX Designer</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <span className="text-lg font-bold text-green-600">92% match</span>
                <p className="text-xs text-gray-500">5 min ago</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                S
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Sofia Andersson</h3>
                <p className="text-sm text-gray-600">matched to Product Manager</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <span className="text-lg font-bold text-green-600">89% match</span>
                <p className="text-xs text-gray-500">12 min ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Assignment Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <CreateAssignmentForm
              onAssignmentCreated={handleCreateAssignment}
              onCancel={() => setShowCreateForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
