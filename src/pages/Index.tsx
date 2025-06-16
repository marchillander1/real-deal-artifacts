import React, { useState } from "react";
import { Assignment } from "../types/consultant";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Users, Briefcase, TrendingUp, Clock, Star, Check, Plus, Brain } from "lucide-react";
import CreateAssignmentForm from "../components/CreateAssignmentForm";
import { ConsultantsTab } from "../components/ConsultantsTab";
import { AIMatchingResults } from "../components/AIMatchingResults";
import { useSupabaseConsultants } from "@/hooks/useSupabaseConsultants";
import { useDemoAssignments } from "@/hooks/useDemoAssignments";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Index: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'consultants' | 'assignments'>('dashboard');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedAssignmentForMatching, setSelectedAssignmentForMatching] = useState<Assignment | null>(null);
  const { consultants } = useSupabaseConsultants();
  const { assignments, addAssignment } = useDemoAssignments();

  // Fetch matches data for stats
  const { data: matchesData = [] } = useQuery({
    queryKey: ['matches'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('matches')
        .select('*');

      if (error) {
        console.error('Error fetching matches:', error);
        return [];
      }
      return data || [];
    },
  });

  // Real dashboard stats using actual limited data (1 network + 5 my consultants = 6 total)
  const networkConsultants = consultants.filter(consultant => consultant.type === 'new'); // Should be 1
  const myConsultants = consultants.filter(consultant => consultant.type === 'existing'); // Should be 5
  const totalConsultants = consultants.length; // Should be 6 total
  const successfulMatches = matchesData.filter(match => match.status === 'accepted').length;
  const avgMatchTime = "12 seconds";

  const handleAssignmentCreated = (assignment: Assignment) => {
    addAssignment(assignment);
    console.log('Assignment created:', assignment);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Handle file upload - this will add consultants to "My Consultants"
    console.log('File uploaded:', event.target.files);
    // TODO: Process CV and add to "My Consultants"
  };

  const renderAssignmentsContent = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Assignments</h2>
          <p className="text-gray-600">Manage assignments and find the perfect consultant matches</p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Assignment
        </Button>
      </div>

      <div className="grid gap-6">
        {assignments.map((assignment) => (
          <Card key={assignment.id} className="border hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{assignment.title}</h3>
                  <p className="text-gray-600 mb-3">{assignment.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span>📍 {assignment.company}</span>
                    <span>💼 {assignment.workload}</span>
                    <span>⏱️ {assignment.duration}</span>
                    <span>💰 {assignment.budget}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="text-4xl">{assignment.clientLogo}</div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    assignment.urgency === 'High' ? 'bg-red-100 text-red-800' :
                    assignment.urgency === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {assignment.urgency} Priority
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-sm font-medium text-gray-700">Required Skills:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {assignment.requiredSkills.map((skill, idx) => (
                      <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Team Culture:</span>
                  <p className="text-sm text-gray-600 mt-1">{assignment.teamCulture}</p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <div className="text-sm text-gray-500">
                  {assignment.remote} • {assignment.teamSize} • {assignment.industry}
                </div>
                <Button 
                  onClick={() => setSelectedAssignmentForMatching(assignment)}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Brain className="h-4 w-4 mr-2" />
                  AI Match Consultants
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {assignments.length === 0 && (
          <div className="text-center py-12">
            <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments yet</h3>
            <p className="text-gray-600 mb-4">Create your first assignment to start finding consultant matches</p>
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Create New Assignment
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  const renderDashboardContent = () => (
    <div>
      {/* Platform Overview Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Platform Overview</h2>
        <p className="text-gray-600 mb-6">Real-time insights and performance metrics</p>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{totalConsultants}</div>
              <div className="text-sm font-medium text-gray-900 mb-1">Total Consultants</div>
              <div className="text-sm text-green-600">↗ {networkConsultants.length} network + {myConsultants.length} my consultants</div>
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
              <div className="text-sm text-green-600">↗ +{Math.max(1, Math.floor(successfulMatches * 0.1))} this month</div>
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
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">MatchWise AI Platform</h1>
          <p className="text-gray-600 mt-1">Match consultants with assignments using advanced AI that analyzes both technical skills and soft factors</p>
          
          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex space-x-8">
              <button 
                className={`font-medium pb-2 ${activeTab === 'dashboard' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('dashboard')}
              >
                Dashboard
              </button>
              <button 
                className={`font-medium pb-2 ${activeTab === 'consultants' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('consultants')}
              >
                Consultants
              </button>
              <button 
                className={`font-medium pb-2 ${activeTab === 'assignments' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('assignments')}
              >
                Assignments
              </button>
            </div>
            <div className="flex space-x-3">
              <div className="relative">
                <Button variant="outline" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload CV
                </Button>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
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
        {activeTab === 'dashboard' && renderDashboardContent()}
        {activeTab === 'consultants' && (
          <ConsultantsTab 
            showEditForNetwork={false}
            showDeleteForMyConsultants={true}
            showRemoveDuplicates={false}
          />
        )}
        {activeTab === 'assignments' && renderAssignmentsContent()}
      </div>

      {/* Create Assignment Modal */}
      {showCreateForm && (
        <CreateAssignmentForm
          onAssignmentCreated={(assignment) => {
            handleAssignmentCreated(assignment);
            setShowCreateForm(false);
          }}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {/* AI Matching Results Modal */}
      {selectedAssignmentForMatching && (
        <AIMatchingResults
          assignment={selectedAssignmentForMatching}
          onClose={() => setSelectedAssignmentForMatching(null)}
        />
      )}
    </div>
  );
};

export default Index;
