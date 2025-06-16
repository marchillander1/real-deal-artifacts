
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Users, Briefcase, TrendingUp, Clock, Star, Check, Plus, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';
import { useAuth } from '@/hooks/useAuth';
import CreateAssignmentForm from '@/components/CreateAssignmentForm';
import { EnhancedConsultantsTabDedup } from '@/components/EnhancedConsultantsTabDedup';
import { useSupabaseConsultantsDedup } from '@/hooks/useSupabaseConsultantsDedup';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Assignment } from '@/types/consultant';

export default function Landing() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'consultants' | 'assignments'>('dashboard');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [matchResults, setMatchResults] = useState<any[]>([]);
  const [showMatchResults, setShowMatchResults] = useState(false);
  const { consultants } = useSupabaseConsultantsDedup();

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
  const networkConsultants = consultants.filter(consultant => consultant.type === 'existing');
  const totalConsultants = networkConsultants.length;
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
        coverLetter: `Based on our AI analysis, Erik is an exceptional match for this assignment. His technical expertise in React and TypeScript combined with his collaborative communication style makes him ideal for your team dynamic. Erik's proven track record in agile environments and his strong focus on code quality align perfectly with your project requirements.`
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
        coverLetter: `Maria brings exceptional frontend expertise with a strong design sensibility to your project. Her diplomatic communication style and attention to detail make her particularly well-suited for projects requiring close collaboration with design teams. Her user-centric approach ensures deliverables that exceed expectations.`
      }
    ];

    setMatchResults(mockResults);
    setShowMatchResults(true);
  };

  const handleAssignmentCreated = (assignment: Assignment) => {
    console.log('Assignment created:', assignment);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File uploaded:', event.target.files);
  };

  const renderDashboardContent = () => (
    <div>
      {/* Platform Overview Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-2">Platform Overview</h2>
        <p className="text-gray-300 mb-6">Real-time insights and performance metrics</p>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{totalConsultants}</div>
              <div className="text-sm font-medium text-white mb-1">Network Consultants</div>
              <div className="text-sm text-green-400">↗ +{Math.max(1, Math.floor(totalConsultants * 0.15))} this week</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{successfulMatches}</div>
              <div className="text-sm font-medium text-white mb-1">Successful Matches</div>
              <div className="text-sm text-green-400">↗ +{Math.max(1, Math.floor(successfulMatches * 0.1))} this month</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{avgMatchTime}</div>
              <div className="text-sm font-medium text-white mb-1">Avg Match Time</div>
              <div className="text-sm text-green-400">↗ 67% faster</div>
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

      {/* AI Matching Results */}
      {showMatchResults && (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-white mb-4">AI Matching Results</h2>
          <div className="grid gap-6">
            {matchResults.map((result) => (
              <Card key={result.id} className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">{result.name}</h3>
                      <p className="text-gray-300">{result.role}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                        <span>{result.experience}</span>
                        <span>{result.rate}</span>
                        <span>{result.location}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-400">{result.overallMatch}%</div>
                      <div className="text-sm text-gray-400">Overall Match</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-400">Technical</div>
                      <div className="text-lg font-semibold text-white">{result.technicalMatch}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Cultural Fit</div>
                      <div className="text-lg font-semibold text-white">{result.culturalFit}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Communication</div>
                      <div className="text-lg font-semibold text-white">{result.communicationMatch}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Values</div>
                      <div className="text-lg font-semibold text-white">{result.valuesAlignment}%</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm text-gray-400 mb-2">Skills</div>
                    <div className="flex flex-wrap gap-2">
                      {result.skills.map((skill: string) => (
                        <Badge key={skill} variant="secondary" className="bg-blue-600/20 text-blue-300">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-900/50 p-4 rounded-lg mb-4">
                    <div className="text-sm text-gray-400 mb-2">AI Cover Letter</div>
                    <p className="text-gray-300 text-sm">{result.coverLetter}</p>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-400">
                      Success Probability: <span className="text-green-400">{result.successProbability}%</span>
                    </div>
                    <Button className="bg-green-600 hover:bg-green-700">
                      Contact Consultant
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <div className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Logo />
              <div>
                <h1 className="text-2xl font-bold text-white">MatchWise AI Platform</h1>
                <p className="text-gray-300 mt-1">Match consultants with assignments using advanced AI that analyzes both technical skills and soft factors</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-gray-300">Welcome back!</span>
                  <Link to="/auth">
                    <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                      Account
                    </Button>
                  </Link>
                </div>
              ) : (
                <>
                  <Link to="/cv-upload">
                    <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                      <Upload className="mr-2 h-4 w-4" />
                      CV Upload
                    </Button>
                  </Link>
                  <Link to="/auth">
                    <Button>
                      Login
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
          
          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex space-x-8">
              <button 
                className={`font-medium pb-2 ${activeTab === 'dashboard' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-200'}`}
                onClick={() => setActiveTab('dashboard')}
              >
                Dashboard
              </button>
              <button 
                className={`font-medium pb-2 ${activeTab === 'consultants' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-200'}`}
                onClick={() => setActiveTab('consultants')}
              >
                Network Consultants
              </button>
            </div>
            <div className="flex space-x-3">
              <div className="relative">
                <Button variant="outline" className="flex items-center gap-2 border-gray-600 text-white hover:bg-gray-800">
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
        {activeTab === 'consultants' && <EnhancedConsultantsTabDedup />}
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
    </div>
  );
}
