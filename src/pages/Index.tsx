import React, { useState, useRef, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import Dashboard from '../components/Dashboard';
import ConsultantsTab from '../components/ConsultantsTab';
import CreateAssignmentForm from '../components/CreateAssignmentForm';
import { useConsultants } from '../hooks/useConsultants';
import { Assignment, Match, Stats } from '../types/consultant';
import { findMatches, generateMotivationLetter } from '../utils/matching';
import { Users, Target, Sparkles, Brain, Heart, Zap, Plus, TrendingUp, Clock, Award } from 'lucide-react';

const Index = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { consultants, isProcessing, uploadCV } = useConsultants();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: 1,
      title: "Senior React Developer",
      description: "We're looking for an experienced React developer who thrives in collaborative environments and values innovation.",
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
      clientLogo: "/placeholder.svg",
      desiredCommunicationStyle: "Direct and collaborative",
      teamCulture: "Innovative and fast-paced",
      requiredValues: ["Innovation", "Quality", "Teamwork"],
      leadershipLevel: 3,
      teamDynamics: "Cross-functional agile teams"
    }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        totalConsultants: prev.totalConsultants + Math.floor(Math.random() * 3),
        timeSaved: `${(parseInt(prev.timeSaved.split(' ')[0]) + Math.floor(Math.random() * 5))} hours`
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const existingConsultants = consultants.filter(c => c.type === 'existing');
  const newConsultants = consultants.filter(c => c.type === 'new');

  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [isMatching, setIsMatching] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [stats, setStats] = useState<Stats>({
    totalConsultants: 247,
    activeAssignments: 23,
    successfulMatches: 156,
    avgMatchTime: "2.3 min",
    clientSatisfaction: 4.8,
    timeSaved: "85%",
    revenue: "2.4M SEK"
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await uploadCV(file);
      toast({
        title: "CV Uploaded Successfully!",
        description: `${file.name} has been processed and added to the consultant network.`,
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "There was an error processing the CV. Please try again.",
        variant: "destructive"
      });
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleMatch = async (assignment: Assignment) => {
    setIsMatching(true);
    setSelectedAssignment(assignment);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const generatedMatches = findMatches(consultants.slice(0, 5), assignment);
      
      setMatches(generatedMatches);
      setActiveTab('matches');
      
      toast({
        title: "AI Matching Complete!",
        description: `Found ${generatedMatches.length} perfect human-fit matches using our advanced AI analysis.`,
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

  const handleCreateAssignment = (newAssignment: Assignment) => {
    setAssignments(prev => [...prev, newAssignment]);
    setShowCreateForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  MatchWise AI
                </h1>
                <p className="text-xs text-gray-600">Human-first consultant matching</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span className="text-gray-600">Human-First AI</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span className="text-gray-600">Instant Match</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">MatchWise AI</h2>
            <p className="text-xl text-blue-100 mb-4">
              AI-powered consultant matching with focus on human factors
            </p>
            <div className="flex justify-center space-x-8 text-sm">
              <div className="flex items-center space-x-2">
                <Brain className="h-5 w-5" />
                <span>AI analysis of skills & soft factors</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5" />
                <span>Values & communication style</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/50 backdrop-blur-sm">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="consultants" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Consultants</span>
            </TabsTrigger>
            <TabsTrigger value="assignments" className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>Assignments</span>
            </TabsTrigger>
            <TabsTrigger value="matches" className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4" />
              <span>Matches</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard consultants={consultants} assignments={assignments} onMatch={handleMatch} />
          </TabsContent>

          <TabsContent value="consultants">
            <ConsultantsTab
              existingConsultants={existingConsultants}
              newConsultants={newConsultants}
              isMatching={isProcessing}
              onFileUpload={handleFileUpload}
            />
          </TabsContent>

          <TabsContent value="assignments">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Assignments</h2>
                  <p className="text-gray-600">AI-enhanced projects</p>
                </div>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-teal-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-teal-700 transition-all"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Assignment</span>
                </button>
              </div>

              {showCreateForm && (
                <CreateAssignmentForm
                  onAssignmentCreated={handleCreateAssignment}
                  onCancel={() => setShowCreateForm(false)}
                />
              )}

              <div className="grid gap-6 lg:grid-cols-2">
                {assignments.map((assignment) => (
                  <div key={assignment.id} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{assignment.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">{assignment.company}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm mb-4">
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
                      {assignment.teamCulture && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Culture:</span>
                          <span className="font-medium text-purple-600">{assignment.teamCulture}</span>
                        </div>
                      )}
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Skills:</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {assignment.requiredSkills.slice(0, 4).map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md">
                            {skill}
                          </span>
                        ))}
                      </div>
                      
                      {assignment.requiredValues && assignment.requiredValues.length > 0 && (
                        <>
                          <p className="text-sm font-medium text-gray-700 mb-2">Values:</p>
                          <div className="flex flex-wrap gap-1">
                            {assignment.requiredValues.map((value, index) => (
                              <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-md">
                                {value}
                              </span>
                            ))}
                          </div>
                        </>
                      )}
                    </div>

                    <button
                      onClick={() => handleMatch(assignment)}
                      disabled={isMatching}
                      className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50"
                    >
                      <Brain className="h-4 w-4" />
                      <span>{isMatching ? 'AI Analyzing...' : 'AI Human-Match'}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="matches">
            {matches.length > 0 ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">AI Human-Fit Matches</h2>
                    <p className="text-gray-600">
                      Matches for "{selectedAssignment?.title}"
                    </p>
                  </div>
                </div>

                <div className="grid gap-6">
                  {matches.map((match, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-lg transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4">
                          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg">
                            {match.consultant.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{match.consultant.name}</h3>
                            <p className="text-gray-600">{match.consultant.roles.join(' • ')}</p>
                            <p className="text-sm text-gray-500">{match.consultant.location}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-2 mb-2">
                            <Award className="h-4 w-4 text-yellow-500" />
                            <span className="text-2xl font-bold text-green-600">{match.score}%</span>
                          </div>
                          <p className="text-sm text-gray-500">Total Match</p>
                        </div>
                      </div>

                      {/* Human Factors */}
                      <div className="grid grid-cols-4 gap-4 mb-4 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                        <div className="text-center">
                          <div className="text-lg font-bold text-purple-600">{match.humanFactorsScore}%</div>
                          <div className="text-xs text-gray-600">Human Fit</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600">{match.culturalMatch}%</div>
                          <div className="text-xs text-gray-600">Culture</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">{match.communicationMatch}%</div>
                          <div className="text-xs text-gray-600">Communication</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-orange-600">{match.valuesAlignment}%</div>
                          <div className="text-xs text-gray-600">Values</div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Skills Match</h4>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {match.matchedSkills.map((skill, skillIndex) => (
                              <span key={skillIndex} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-md">
                                {skill}
                              </span>
                            ))}
                          </div>

                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Experience:</span>
                              <span className="font-medium">{match.consultant.experience}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Rate:</span>
                              <span className="font-medium text-green-600">{match.consultant.rate}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Availability:</span>
                              <span className="font-medium">{match.consultant.availability}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Human Factors</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Communication:</span>
                              <span className="font-medium">{match.consultant.communicationStyle}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Work Style:</span>
                              <span className="font-medium">{match.consultant.workStyle}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Team Fit:</span>
                              <span className="font-medium">{match.consultant.teamFit}</span>
                            </div>
                          </div>

                          <div className="mt-3">
                            <p className="text-sm font-medium text-gray-700 mb-1">Values:</p>
                            <div className="flex flex-wrap gap-1">
                              {match.consultant.values.map((value, valueIndex) => (
                                <span key={valueIndex} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-md">
                                  {value}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">AI-Generated Motivation Letter</h4>
                        <p className="text-sm text-gray-700 leading-relaxed">{match.letter}</p>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-4 border-t">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>Response time: {match.responseTime}h</span>
                          <span>•</span>
                          <span>Est. savings: {match.estimatedSavings.toLocaleString()} SEK</span>
                        </div>
                        <button className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-teal-700 transition-all">
                          Contact Consultant
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No matches yet</h3>
                <p className="text-gray-600">Run AI matching on an assignment to see results.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
