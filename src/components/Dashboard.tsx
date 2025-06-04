
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

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Users}
          title="Total Consultants"
          value={stats.totalConsultants}
          change="+12% från förra månaden"
          color="blue"
        />
        <StatCard
          icon={Briefcase}
          title="Active Assignments"
          value={stats.activeAssignments}
          change="+8% från förra veckan"
          color="green"
        />
        <StatCard
          icon={Target}
          title="Successful Matches"
          value={stats.successfulMatches}
          change="+23% detta kvartal"
          color="purple"
        />
        <StatCard
          icon={Clock}
          title="Avg. Match Time"
          value={stats.avgMatchTime}
          change="-40% snabbare"
          color="orange"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Assignments</h2>
            <p className="text-gray-600">AI-matchning av konsulter med uppdrag</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {assignments.map((assignment) => (
            <div key={assignment.id} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{assignment.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{assignment.company}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Längd:</span>
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
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Skills:</p>
                <div className="flex flex-wrap gap-1">
                  {assignment.requiredSkills.slice(0, 3).map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md">
                      {skill}
                    </span>
                  ))}
                  {assignment.requiredSkills.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                      +{assignment.requiredSkills.length - 3}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => onMatch(assignment)}
                disabled={isMatching}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4" />
                <span>{isMatching ? 'Matchar...' : 'AI Match'}</span>
              </button>
            </div>
          ))}
        </div>

        {assignments.length === 0 && (
          <div className="text-center py-12">
            <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Inga uppdrag än</h3>
            <p className="text-gray-600">Skapa ditt första uppdrag för att börja matcha.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
