
import React, { useState } from "react";
import { Assignment } from "../types/consultant";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Users, Briefcase, TrendingUp, Clock } from "lucide-react";
import CreateAssignmentForm from "./CreateAssignmentForm";
import { useSupabaseConsultantsDedup } from "@/hooks/useSupabaseConsultantsDedup";

interface DashboardProps {
  assignments: Assignment[];
  onMatch: (assignment: Assignment) => void;
  onAssignmentCreated: (assignment: Assignment) => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  assignments,
  onMatch,
  onAssignmentCreated,
  onFileUpload,
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { consultants } = useSupabaseConsultantsDedup();

  // Dashboard stats - using real consultant count from Supabase
  const totalConsultants = consultants.length;
  const activeAssignments = assignments.length || 2;
  const successfulMatches = 156;
  const avgMatchTime = "12 seconds";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">AI-Driven Consultant Matching Platform</h1>
          <p className="text-gray-600 mt-1">Match consultants with assignments using advanced AI that analyzes both technical skills and soft factors</p>
          
          {/* Action Buttons */}
          <div className="flex items-center justify-end mt-6">
            <div className="flex space-x-3">
              <div className="relative">
                <Button variant="outline" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload CV
                </Button>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={onFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                onClick={() => setShowCreateForm(true)}
              >
                <Briefcase className="h-4 w-4" />
                New Assignment
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Platform Overview Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Platform Overview</h2>
          <p className="text-gray-600 mb-6">Real-time insights and performance metrics</p>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{totalConsultants}</div>
                <div className="text-sm font-medium text-gray-900 mb-1">Active Consultants</div>
                <div className="text-sm text-green-600">↗ +{Math.max(1, Math.floor(totalConsultants * 0.15))} this week</div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Briefcase className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{activeAssignments}</div>
                <div className="text-sm font-medium text-gray-900 mb-1">Open Assignments</div>
                <div className="text-sm text-green-600">↗ +5 today</div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{successfulMatches}</div>
                <div className="text-sm font-medium text-gray-900 mb-1">Successful Matches</div>
                <div className="text-sm text-green-600">↗ +23 this month</div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{avgMatchTime}</div>
                <div className="text-sm font-medium text-gray-900 mb-1">Avg Match Time</div>
                <div className="text-sm text-green-600">↗ 67% faster</div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Clock className="h-8 w-8 text-green-100" />
                </div>
                <div className="text-3xl font-bold mb-2">850 hours</div>
                <div className="text-lg font-medium mb-1">Time Saved</div>
                <div className="text-green-100">≈ 2.1M SEK in cost savings</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <TrendingUp className="h-8 w-8 text-blue-100" />
                </div>
                <div className="text-3xl font-bold mb-2">96%</div>
                <div className="text-lg font-medium mb-1">Client Satisfaction</div>
                <div className="text-blue-100">+8% vs manual matching</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Briefcase className="h-8 w-8 text-purple-100" />
                </div>
                <div className="text-3xl font-bold mb-2">2.4M SEK</div>
                <div className="text-lg font-medium mb-1">Platform Revenue</div>
                <div className="text-purple-100">Monthly recurring</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Create Assignment Modal */}
      {showCreateForm && (
        <CreateAssignmentForm
          onAssignmentCreated={(assignment) => {
            onAssignmentCreated(assignment);
            setShowCreateForm(false);
          }}
          onCancel={() => setShowCreateForm(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
