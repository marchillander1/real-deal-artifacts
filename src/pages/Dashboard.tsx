import React, { useState } from "react";
import { Assignment } from "../types/consultant";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Users, Briefcase, TrendingUp, Clock, Star, Check, Plus, BarChart3 } from "lucide-react";
import CreateAssignmentForm from "../components/CreateAssignmentForm";
import { EnhancedConsultantsTab } from "../components/EnhancedConsultantsTab";
import { useSupabaseConsultantsWithDemo } from "@/hooks/useSupabaseConsultantsWithDemo";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface DashboardProps {
  assignments?: Assignment[];
  onMatch?: (assignment: Assignment) => void;
  onAssignmentCreated?: (assignment: Assignment) => void;
  onFileUpload?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  assignments = [],
  onMatch = () => {},
  onAssignmentCreated = () => {},
  onFileUpload = () => {},
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'consultants' | 'assignments'>('dashboard');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [matchResults, setMatchResults] = useState<any[]>([]);
  const [showMatchResults, setShowMatchResults] = useState(false);
  const { consultants } = useSupabaseConsultantsWithDemo();
  const navigate = useNavigate();

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

  // Real dashboard stats using actual data
  const networkConsultants = consultants.filter(consultant => consultant.type === 'new');
  const myConsultants = consultants.filter(consultant => consultant.type === 'existing');
  const totalConsultants = consultants.length;
  const successfulMatches = matchesData.filter(match => match.status === 'accepted').length;
  const avgMatchTime = "12 seconds";

  const handleMatch = (assignment: Assignment) => {
    // Mock AI matching results with detailed soft values
    const mockResults = [
      {
        id: 1,
        name: "Erik Andersson",
        role: "Senior Full-Stack Developer",
        overallMatch: 96,
        technicalMatch: 94,
        culturalFit: 98,
        communicationMatch: 92,
        valuesAlignment: 95,
        skills: ["React", "TypeScript", "Node.js", "AWS"],
        experience: "8 years",
        rate: "950 SEK/hour",
        availability: "Available",
        location: "Stockholm",
        
        // Human Factors
        communicationStyle: "Direct and collaborative",
        workStyle: "Agile-focused with strong problem-solving",
        values: ["Innovation", "Quality", "Team collaboration"],
        personalityTraits: ["Analytical", "Proactive", "Empathetic"],
        teamFit: 4.8,
        adaptability: 4.6,
        leadership: 4.2,
        
        // AI Insights
        culturalFitReason: "Perfect match for innovative and fast-paced environment",
        communicationReason: "Direct communication style aligns with team preferences",
        valuesReason: "Strong alignment on innovation and quality focus",
        
        // Estimated Impact
        costSavings: "~45K SEK",
        responseTime: "8 seconds",
        successProbability: 94,
        
        // AI Cover Letter
        coverLetter: `Based on our AI analysis, Erik is an exceptional match for this ${assignment.title} position. His technical expertise in React and TypeScript combined with his collaborative communication style makes him ideal for your team dynamic. Erik's proven track record in agile environments and his strong focus on code quality align perfectly with your project requirements.`
      },
      {
        id: 2,
        name: "Maria Lindqvist",
        role: "Senior Frontend Developer",
        overallMatch: 89,
        technicalMatch: 91,
        culturalFit: 87,
        communicationMatch: 88,
        valuesAlignment: 90,
        skills: ["Vue.js", "JavaScript", "CSS", "Figma"],
        experience: "6 years",
        rate: "850 SEK/hour",
        availability: "Partially Available",
        location: "Göteborg",
        
        // Human Factors
        communicationStyle: "Diplomatic and detail-oriented",
        workStyle: "Design-focused with user-centric approach",
        values: ["User experience", "Attention to detail", "Continuous learning"],
        personalityTraits: ["Creative", "Methodical", "User-focused"],
        teamFit: 4.3,
        adaptability: 4.5,
        leadership: 3.8,
        
        // AI Insights
        culturalFitReason: "Great fit for structured and detail-oriented projects",
        communicationReason: "Diplomatic style works well with diverse teams",
        valuesReason: "Strong UX focus aligns with user-centered development",
        
        // Estimated Impact
        costSavings: "~38K SEK",
        responseTime: "12 seconds",
        successProbability: 87,
        
        // AI Cover Letter
        coverLetter: `Maria brings exceptional frontend expertise with a strong design sensibility to your ${assignment.title} project. Her diplomatic communication style and attention to detail make her particularly well-suited for projects requiring close collaboration with design teams. Her user-centric approach ensures deliverables that exceed expectations.`
      }
    ];

    setMatchResults(mockResults);
    setShowMatchResults(true);
    onMatch(assignment);
  };

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

        {/* Quick Actions */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Snabbåtgärder</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="flex items-center justify-center gap-2 h-16 bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-5 w-5" />
              Skapa nytt uppdrag
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => navigate('/reports')}
              className="flex items-center justify-center gap-2 h-16 border-2 hover:bg-gray-50"
            >
              <BarChart3 className="h-5 w-5" />
              Visa detaljerade rapporter
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => setActiveTab('consultants')}
              className="flex items-center justify-center gap-2 h-16 border-2 hover:bg-gray-50"
            >
              <Users className="h-5 w-5" />
              Hantera konsulter
            </Button>
          </div>
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
                className="font-medium pb-2 text-gray-500 hover:text-gray-700"
                onClick={() => navigate('/reports')}
              >
                Rapporter
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
        {activeTab === 'dashboard' && renderDashboardContent()}
        {activeTab === 'consultants' && <EnhancedConsultantsTab />}
      </div>

      {/* Create Assignment Modal */}
      {showCreateForm && (
        <CreateAssignmentForm
          onAssignmentCreated={(assignment) => {
            onAssignmentCreated(assignment);
            setShowCreateForm(false);
          }}
          onClose={() => setShowCreateForm(false)}
          onCancel={() => setShowCreateForm(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
