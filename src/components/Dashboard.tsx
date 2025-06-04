
import React, { useState } from 'react';
import { Users, Briefcase, TrendingUp, Clock, Target, Plus, Sparkles } from 'lucide-react';
import StatCard from './StatCard';
import CreateAssignmentForm from './CreateAssignmentForm';
import { findMatches } from '../utils/matching';
import { Consultant, Assignment, Match } from '../types/consultant';
import { useToast } from "@/hooks/use-toast";

interface DashboardProps {
  consultants: Consultant[];
  onMatch: (matches: Match[], assignment: Assignment) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ consultants, onMatch }) => {
  const { toast } = useToast();
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: 1,
      title: "Senior React Developer",
      description: "We're looking for an experienced React developer to lead our frontend team and deliver high-quality web applications.",
      requiredSkills: ["React", "TypeScript", "Node.js", "GraphQL"],
      startDate: "2024-07-01",
      duration: "6 months",
      workload: "100%",
      budget: "800-1200 SEK/hour",
      company: "TechCorp AB",
      industry: "FinTech",
      teamSize: "8-12 developers",
      remote: "Hybrid",
      urgency: "High",
      clientLogo: "/placeholder.svg"
    }
  ]);
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isMatching, setIsMatching] = useState(false);

  const handleCreateAssignment = (newAssignment: Assignment) => {
    setAssignments(prev => [...prev, newAssignment]);
    setShowCreateForm(false);
  };

  const handleMatch = async (assignment: Assignment) => {
    setIsMatching(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const matches = findMatches(consultants, assignment);
      onMatch(matches, assignment);
      
      toast({
        title: "Matching Complete!",
        description: `Found ${matches.length} potential matches for ${assignment.title}`,
      });
    } catch (error) {
      toast({
        title: "Matching Failed",
        description: "Something went wrong during matching. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsMatching(false);
    }
  };

  const stats = {
    totalConsultants: consultants.length,
    activeAssignments: assignments.length,
    successfulMatches: 156,
    avgMatchTime: "2.3 min",
    clientSatisfaction: 4.8,
    timeSaved: "85%",
    revenue: "2.4M SEK"
  };

  return (
    <div className="space-y-6">
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

      {/* Assignment Management */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Assignments</h2>
            <p className="text-gray-600">Manage and match assignments with consultants</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-teal-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-teal-700 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Create Assignment</span>
          </button>
        </div>

        {showCreateForm && (
          <CreateAssignmentForm
            onAssignmentCreated={handleCreateAssignment}
            onCancel={() => setShowCreateForm(false)}
          />
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {assignments.map((assignment) => (
            <div key={assignment.id} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{assignment.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{assignment.company}</p>
                  <p className="text-sm text-gray-700">{assignment.description}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{assignment.duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Budget:</span>
                  <span className="font-medium text-green-600">{assignment.budget}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Remote:</span>
                  <span className="font-medium">{assignment.remote}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Urgency:</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    assignment.urgency === 'High' 
                      ? 'bg-red-100 text-red-800' 
                      : assignment.urgency === 'Medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {assignment.urgency}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Required Skills:</p>
                <div className="flex flex-wrap gap-1">
                  {assignment.requiredSkills.slice(0, 4).map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md">
                      {skill}
                    </span>
                  ))}
                  {assignment.requiredSkills.length > 4 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                      +{assignment.requiredSkills.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleMatch(assignment)}
                disabled={isMatching}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4" />
                <span>{isMatching ? 'Matching...' : 'AI Match'}</span>
              </button>
            </div>
          ))}
        </div>

        {assignments.length === 0 && !showCreateForm && (
          <div className="text-center py-12">
            <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Assignments Yet</h3>
            <p className="text-gray-600">Create your first assignment to start matching with consultants.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
