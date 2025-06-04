
import React, { useState } from 'react';
import { Users, Briefcase, TrendingUp, Clock, Target, Plus, Sparkles } from 'lucide-react';
import StatCard from './StatCard';
import CreateAssignmentForm from './CreateAssignmentForm';
import { findMatches } from '../utils/matching';
import { Consultant, Assignment, Match } from '../types/consultant';
import { useToast } from "@/hooks/use-toast";

interface DashboardProps {
  consultants: Consultant[];
  assignments: Assignment[];
  onMatch: (assignment: Assignment) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ consultants, assignments, onMatch }) => {
  const { toast } = useToast();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isMatching, setIsMatching] = useState(false);

  const stats = {
    totalConsultants: consultants.length,
    activeAssignments: assignments.length,
    successfulMatches: 156,
    avgMatchTime: "2.3 min"
  };

  const handleCreateAssignment = (newAssignment: Assignment) => {
    // This would be handled by parent component
    setShowCreateForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Users}
          title="Total Consultants"
          value={stats.totalConsultants}
          change="+12% from last month"
          color="blue"
        />
        <StatCard
          icon={Briefcase}
          title="Active Assignments"
          value={stats.activeAssignments}
          change="+8% from last week"
          color="green"
        />
        <StatCard
          icon={Target}
          title="Successful Matches"
          value={stats.successfulMatches}
          change="+23% this quarter"
          color="purple"
        />
        <StatCard
          icon={Clock}
          title="Avg. Match Time"
          value={stats.avgMatchTime}
          change="-40% faster"
          color="orange"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
            <p className="text-gray-600">Streamline your workflow</p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
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
          
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-left">
              <h3 className="font-medium text-gray-900">Upload CV</h3>
              <p className="text-sm text-gray-600">Add consultant</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Sparkles className="h-5 w-5 text-purple-600" />
            </div>
            <div className="text-left">
              <h3 className="font-medium text-gray-900">AI Match</h3>
              <p className="text-sm text-gray-600">Find perfect fits</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Assignments */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Recent Assignments</h2>
            <p className="text-gray-600">Latest project opportunities</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>New Assignment</span>
          </button>
        </div>

        {assignments.length > 0 ? (
          <div className="space-y-4">
            {assignments.slice(0, 3).map((assignment) => (
              <div key={assignment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{assignment.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">{assignment.company}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {assignment.requiredSkills.slice(0, 3).map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {skill}
                        </span>
                      ))}
                      {assignment.requiredSkills.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          +{assignment.requiredSkills.length - 3} more
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{assignment.duration}</span>
                      <span>•</span>
                      <span>{assignment.budget}</span>
                      <span>•</span>
                      <span>{assignment.remote}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onMatch(assignment)}
                    disabled={isMatching}
                    className="ml-4 flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>{isMatching ? 'Matching...' : 'AI Match'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments yet</h3>
            <p className="text-gray-600 mb-4">Create your first assignment to start matching.</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              Create Assignment
            </button>
          </div>
        )}
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
