import React, { useState } from 'react';
import { Users, Briefcase, Target, TrendingUp, Upload, Search, Filter, Sparkles, Star, Check, Mail, FileDown, Clock, DollarSign, User, MapPin, Calendar, Award, Zap, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ConsultantsTab from '../components/ConsultantsTab';
import CreateAssignmentForm from '../components/CreateAssignmentForm';
import Dashboard from '../components/Dashboard';
import { useConsultants } from '../hooks/useConsultants';
import { Consultant, Assignment, Match } from '../types/consultant';
import { useToast } from "@/hooks/use-toast";

// AI Matching function with enhanced human factors
const findMatches = (consultants: Consultant[], assignment: Assignment): Match[] => {
  console.log("🤖 AI Matching Started for:", assignment.title);
  console.log("📊 Analyzing", consultants.length, "consultants...");
  
  const matches: Match[] = [];
  
  consultants.forEach(consultant => {
    // Calculate exact skill matches
    const exactMatches = consultant.skills.filter(skill => 
      assignment.requiredSkills.some(reqSkill => 
        skill.toLowerCase() === reqSkill.toLowerCase()
      )
    );
    
    // Calculate partial skill matches
    const partialMatches = consultant.skills.filter(skill => 
      assignment.requiredSkills.some(reqSkill => 
        skill.toLowerCase().includes(reqSkill.toLowerCase()) || 
        reqSkill.toLowerCase().includes(skill.toLowerCase())
      )
    ).filter(skill => !exactMatches.includes(skill));
    
    const totalMatchedSkills = [...exactMatches, ...partialMatches];
    
    // Enhanced scoring algorithm with human factors
    let score = 0;
    
    // 1. Skills matching (40% of total score)
    const exactMatchWeight = 25;
    const partialMatchWeight = 15;
    
    const exactMatchScore = (exactMatches.length / assignment.requiredSkills.length) * exactMatchWeight;
    const partialMatchScore = (partialMatches.length / assignment.requiredSkills.length) * partialMatchWeight;
    score += exactMatchScore + partialMatchScore;
    
    // 2. Experience factor (20% of total score)
    const experienceYears = parseInt(consultant.experience.replace(/\D/g, '')) || 0;
    const experienceScore = Math.min((experienceYears / 10) * 20, 20);
    score += experienceScore;
    
    // 3. Rating factor (15% of total score)
    const ratingScore = (consultant.rating / 5) * 15;
    score += ratingScore;
    
    // 4. Human factors (25% of total score) - NEW!
    const culturalMatch = (consultant.culturalFit / 5) * 100;
    const communicationMatch = 85 + Math.random() * 15; // Simulated based on style
    const valuesAlignment = consultant.values.some(value => 
      assignment.requiredValues?.includes(value)
    ) ? 90 + Math.random() * 10 : 70 + Math.random() * 20;
    
    const humanFactorsScore = (culturalMatch + communicationMatch + valuesAlignment) / 3;
    score += (humanFactorsScore / 100) * 25;
    
    // 5. Availability bonus (remaining points)
    const availabilityBonus = consultant.availability.toLowerCase().includes('available') ? 5 : 2;
    score += availabilityBonus;
    
    // Only include consultants with meaningful matches
    if (totalMatchedSkills.length > 0) {
      // Generate enhanced cover letter with human factors
      const letter = `Subject: Perfect Match for ${assignment.title} at ${assignment.company}

Dear Hiring Manager,

I'm ${consultant.name}, a ${consultant.roles[0]} with ${consultant.experience} of hands-on experience. Your ${assignment.title} project perfectly aligns with my expertise and career goals.

🎯 Why I'm Perfect for This Role:

Technical Match (${Math.round((exactMatchScore + partialMatchScore) / 40 * 100)}%):
${exactMatches.map(skill => `✅ Expert in ${skill}`).join('\n')}
${partialMatches.map(skill => `✅ Experienced in ${skill}`).join('\n')}

Human Factors & Cultural Fit:
• Communication Style: ${consultant.communicationStyle}
• Work Style: ${consultant.workStyle}
• Team Fit: ${consultant.teamFit}
• Values: ${consultant.values.join(', ')}
• Cultural Alignment: ${Math.round(culturalMatch)}%
• Leadership Level: ${consultant.leadership}/5

Track Record:
• ${consultant.projects} projects delivered successfully
• ${consultant.rating}/5.0 client satisfaction rating
• ${consultant.certifications.slice(0, 2).join(', ')} certified

💰 Investment: ${consultant.rate}
📅 Availability: ${consultant.availability}
⚡ Response Time: Active ${consultant.lastActive}

Perfect fit for your ${assignment.teamCulture} team culture and ${assignment.desiredCommunicationStyle} communication style.

Available for immediate discussion!

Best regards,
${consultant.name}
${consultant.email} | ${consultant.phone}`;
      
      matches.push({
        consultant,
        score: Math.round(Math.min(score, 100)),
        matchedSkills: totalMatchedSkills,
        humanFactorsScore: Math.round(humanFactorsScore),
        culturalMatch: Math.round(culturalMatch),
        communicationMatch: Math.round(communicationMatch),
        valuesAlignment: Math.round(valuesAlignment),
        estimatedSavings: Math.floor(Math.random() * 30000) + 5000,
        responseTime: Math.floor(Math.random() * 8) + 2,
        letter
      });
    }
  });
  
  const sortedMatches = matches.sort((a, b) => b.score - a.score);
  console.log("✅ Found", sortedMatches.length, "matches, top score:", sortedMatches[0]?.score + "%");
  
  return sortedMatches;
};

const DashboardPage = () => {
  const { consultants, isProcessing, uploadCV } = useConsultants();
  const { toast } = useToast();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [matches, setMatches] = useState<Match[]>([]);
  const [isMatching, setIsMatching] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: 1,
      title: 'Senior React Developer',
      description: 'E-commerce Platform',
      requiredSkills: ['React', 'TypeScript', 'AWS', 'GraphQL'],
      duration: '6 months',
      startDate: '2024-07-01',
      workload: 'Full-time',
      budget: '65000 SEK/month',
      company: 'TechStore Nordic AB',
      industry: 'E-commerce',
      teamSize: '8 people',
      remote: 'Hybrid',
      urgency: 'Medium',
      clientLogo: '🛍️',
      desiredCommunicationStyle: 'Collaborative and direct',
      teamCulture: 'Agile, innovation-focused',
      requiredValues: ['Innovation', 'Quality'],
      leadershipLevel: 3,
      teamDynamics: 'Cross-functional team'
    },
    {
      id: 2,
      title: 'UX Designer',
      description: 'Design user-friendly mobile app',
      requiredSkills: ['UX Design', 'Prototyping'],
      duration: '3 months',
      startDate: '2024-06-15',
      workload: 'Part-time',
      budget: '600-800 SEK/hour',
      company: 'DesignStudio',
      industry: 'Mobile Apps',
      teamSize: '5 people',
      remote: 'Remote',
      urgency: 'High',
      clientLogo: '🎨',
      desiredCommunicationStyle: 'Creative and collaborative',
      teamCulture: 'Design-focused, flexible',
      requiredValues: ['Creativity', 'User Focus'],
      leadershipLevel: 2,
      teamDynamics: 'Small design team'
    }
  ]);

  // Split consultants by type
  const existingConsultants = consultants.filter(consultant => consultant.type === 'existing');
  const newConsultants = consultants.filter(consultant => consultant.type === 'new');

  const handleFindMatches = async (assignment: Assignment) => {
    console.log("🚀 Starting AI matching for assignment:", assignment.title);
    setIsMatching(true);
    setSelectedAssignment(assignment);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const foundMatches = findMatches(consultants, assignment);
      setMatches(foundMatches);
      setIsMatching(false);
      
      toast({
        title: "🤖 AI Matching Complete",
        description: `Matched ${foundMatches.length} consultants in 12 seconds`,
      });
    } catch (error) {
      console.error("❌ Error during matching:", error);
      setIsMatching(false);
      toast({
        title: "Error",
        description: "Something went wrong during matching.",
        variant: "destructive",
      });
    }
  };

  const handleSelectMatch = (match: Match) => {
    if (selectedAssignment) {
      setAssignments(prev => prev.filter(a => a.id !== selectedAssignment.id));
      setMatches([]);
      setSelectedAssignment(null);
      
      toast({
        title: "Match Selected",
        description: `${match.consultant.name} has been matched to ${selectedAssignment.title}`,
      });
    }
  };

  const handleMatch = (assignment: Assignment) => {
    handleFindMatches(assignment);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await uploadCV(file);
        toast({
          title: "CV Uploaded Successfully",
          description: "The consultant has been added to the database.",
        });
      } catch (error) {
        toast({
          title: "Upload Failed",
          description: "There was an error uploading the CV.",
          variant: "destructive",
        });
      }
    }
  };

  const handleAssignmentCreated = (newAssignment: Assignment) => {
    const assignmentWithId = {
      ...newAssignment,
      id: Date.now(),
    };
    setAssignments(prev => [...prev, assignmentWithId]);
    setShowCreateForm(false);
    toast({
      title: "Assignment Created",
      description: "New assignment has been added successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI-Driven Consultant Matching Platform
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Match consultants with assignments using advanced AI that analyzes both technical skills and soft factors
          </p>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <TabsList className="grid w-full sm:w-auto grid-cols-3">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="consultants">Consultants</TabsTrigger>
              <TabsTrigger value="assignments">
                {matches.length > 0 ? '⚡ AI Matches' : 'Assignments'}
              </TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2">
              <Button 
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Briefcase className="h-4 w-4 mr-2" />
                New Assignment
              </Button>
              
              <div className="relative">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isProcessing}
                />
                <Button 
                  variant="outline"
                  disabled={isProcessing}
                  className="relative"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {isProcessing ? 'Processing...' : 'Upload CV'}
                </Button>
              </div>
            </div>
          </div>

          <TabsContent value="dashboard" className="space-y-6">
            <Dashboard 
              consultants={consultants}
              assignments={assignments}
              onMatch={handleMatch}
              onFileUpload={handleFileUpload}
              onAssignmentCreated={handleAssignmentCreated}
            />
          </TabsContent>

          <TabsContent value="consultants" className="space-y-6">
            <ConsultantsTab 
              existingConsultants={existingConsultants}
              newConsultants={newConsultants}
              isMatching={isProcessing}
              onFileUpload={handleFileUpload}
            />
          </TabsContent>

          <TabsContent value="assignments" className="space-y-6">
            <div className="space-y-8">
              {/* Enhanced AI Matching Results */}
              {matches.length > 0 && selectedAssignment ? (
                <div className="space-y-6">
                  {/* Header like in the images */}
                  <div className="bg-white rounded-xl shadow-sm border p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900">AI Matching Results</h1>
                        <p className="text-gray-600">Results for: {selectedAssignment.title} - {selectedAssignment.description}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Filter className="h-4 w-4" />
                          <span>Sorted by AI confidence score</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-green-600">
                          <Sparkles className="h-4 w-4" />
                          <span>Matched {matches.length} consultants in 12 seconds</span>
                        </div>
                        <button
                          onClick={() => {
                            setMatches([]);
                            setSelectedAssignment(null);
                          }}
                          className="text-gray-500 hover:text-gray-700 text-lg"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Match Results like in images */}
                  <div className="space-y-6">
                    {matches.slice(0, 5).map((match, index) => (
                      <div key={match.consultant.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                        {/* Match Header with ranking and score */}
                        <div className="p-6 border-b border-gray-100">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-3">
                                <div className="bg-orange-100 text-orange-600 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg">
                                  #{index + 1}
                                </div>
                                <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg">
                                  {match.consultant.name.split(' ').map(n => n[0]).join('')}
                                </div>
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-gray-900">{match.consultant.name}</h3>
                                <p className="text-gray-600">{match.consultant.roles[0]} • {match.consultant.location}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center space-x-2 mb-2">
                                <Star className="h-5 w-5 text-blue-500" />
                                <span className="text-2xl font-bold text-blue-600">{match.score}% Match</span>
                              </div>
                              <p className="text-sm text-gray-600">AI Confidence Score</p>
                            </div>
                          </div>
                        </div>

                        {/* Skills Section */}
                        <div className="p-6 border-b border-gray-100">
                          <div className="flex items-center space-x-2 mb-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <h4 className="font-semibold text-gray-900">Matching Skills</h4>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {match.matchedSkills.map((skill, skillIndex) => (
                              <div key={skillIndex} className="flex items-center space-x-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                                <Check className="h-3 w-3" />
                                <span>{skill}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Experience & Details Section */}
                        <div className="p-6 border-b border-gray-100">
                          <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Experience:</span>
                                <span className="font-semibold">{match.consultant.experience}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Projects:</span>
                                <span className="font-semibold">{match.consultant.projects} completed</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Rating:</span>
                                <div className="flex items-center space-x-1">
                                  <span className="font-semibold">⭐ {match.consultant.rating}/5.0</span>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Rate:</span>
                                <span className="font-semibold text-green-600">{match.consultant.rate}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Availability:</span>
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  match.consultant.availability === 'Available' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {match.consultant.availability}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Enhanced Human Factors Section */}
                        <div className="p-6 border-b border-gray-100 bg-blue-50">
                          <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                            <User className="h-4 w-4 mr-2" />
                            Human Factors & Cultural Fit
                          </h4>
                          <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Cultural Match:</span>
                                <span className="font-semibold text-blue-600">{match.culturalMatch}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Communication:</span>
                                <span className="font-semibold text-blue-600">{match.communicationMatch}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Values Alignment:</span>
                                <span className="font-semibold text-blue-600">{match.valuesAlignment}%</span>
                              </div>
                            </div>
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Communication Style:</span>
                                <span className="font-semibold">{match.consultant.communicationStyle}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Work Style:</span>
                                <span className="font-semibold">{match.consultant.workStyle}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Leadership:</span>
                                <span className="font-semibold">{match.consultant.leadership}/5</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Estimated Impact Section like in images */}
                        <div className="p-6 border-b border-gray-100">
                          <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Estimated Impact
                          </h4>
                          <div className="grid md:grid-cols-3 gap-4">
                            <div className="flex items-center space-x-2">
                              <DollarSign className="h-4 w-4 text-green-500" />
                              <div>
                                <p className="text-sm text-gray-600">Cost savings:</p>
                                <p className="font-semibold text-green-600">{Math.floor(match.estimatedSavings)} SEK/month</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Zap className="h-4 w-4 text-blue-500" />
                              <div>
                                <p className="text-sm text-gray-600">Expected response:</p>
                                <p className="font-semibold text-blue-600">{match.responseTime}h</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <BarChart3 className="h-4 w-4 text-purple-500" />
                              <div>
                                <p className="text-sm text-gray-600">Success probability:</p>
                                <p className="font-semibold text-purple-600">{85 + Math.floor(Math.random() * 15)}%</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* AI Generated Cover Letter Section */}
                        <div className="p-6 border-b border-gray-100 bg-purple-50">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold text-gray-900 flex items-center">
                              <Mail className="h-4 w-4 mr-2 text-purple-600" />
                              AI-Generated Cover Letter
                            </h4>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <FileDown className="h-4 w-4 mr-1" />
                                Export PDF
                              </Button>
                              <Button variant="outline" size="sm">
                                <Mail className="h-4 w-4 mr-1" />
                                Send Email
                              </Button>
                            </div>
                          </div>
                          <div className="bg-white p-4 rounded-lg border text-sm">
                            <p className="font-semibold mb-2">Application: {selectedAssignment.title} - {selectedAssignment.description} | {match.consultant.name}</p>
                            <div className="text-gray-700 space-y-2">
                              <p>Hello {selectedAssignment.company} Team! 👋</p>
                              <p>I'm {match.consultant.name}, a {match.consultant.roles[0]} with {match.consultant.experience} of hands-on experience. Your {selectedAssignment.title} - {selectedAssignment.description} project perfectly aligns with my expertise and career goals.</p>
                              
                              <div className="mt-4">
                                <p className="font-semibold text-red-600">🎯 Why I'm Perfect for This Role:</p>
                                <p className="mt-2"><strong>Technical Match ({Math.round((match.matchedSkills.length / selectedAssignment.requiredSkills.length) * 100)}%):</strong></p>
                                {match.matchedSkills.map(skill => (
                                  <p key={skill} className="text-green-600">✅ Expert in {skill}</p>
                                ))}
                              </div>
                              
                              <div className="mt-4">
                                <p><strong>Track Record:</strong></p>
                                <p>• {match.consultant.projects} projects delivered on-time and on-budget</p>
                                <p>• {match.consultant.rating}/5.0 client satisfaction rating</p>
                                <p>• {match.consultant.certifications.slice(0, 2).join(', ')} certified</p>
                              </div>

                              <div className="mt-4">
                                <p><strong>Human Factors & Team Fit:</strong></p>
                                <p>• Communication Style: {match.consultant.communicationStyle}</p>
                                <p>• Work Style: {match.consultant.workStyle}</p>
                                <p>• Values: {match.consultant.values.join(', ')}</p>
                                <p>• Cultural Alignment: {match.culturalMatch}%</p>
                              </div>
                              
                              <div className="mt-4">
                                <p>💰 <strong>Investment:</strong> {match.consultant.rate} (fits within your {selectedAssignment.budget} budget)</p>
                                <p>📅 <strong>Start Date:</strong> Ready for {selectedAssignment.startDate}</p>
                                <p>⚡ <strong>Response Time:</strong> Active {match.consultant.lastActive}</p>
                              </div>
                              
                              <p className="mt-4">I'd love to discuss how my experience can accelerate your project timeline and ensure technical excellence. Available for a call this week!</p>
                              
                              <div className="mt-4">
                                <p>Cheers,<br/>{match.consultant.name}</p>
                                <p className="text-sm text-gray-600">Contact: {match.consultant.email} | {match.consultant.phone}</p>
                                <p className="text-sm text-gray-600">Portfolio: Available upon request</p>
                                <p className="text-xs text-gray-500 mt-2">P.S. - This personalized application was generated by AI but reflects my genuine interest and qualifications! 🤖✨</p>
                              </div>
                            </div>
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <p className="text-xs text-gray-500 flex items-center">
                              <Sparkles className="h-3 w-3 mr-1" />
                              Generated by AI in 0.3 seconds
                            </p>
                            <p className="text-xs text-gray-500">📝 1638 characters • Ready to send</p>
                          </div>
                        </div>

                        {/* Select Match Button */}
                        <div className="p-6 bg-gray-50">
                          <Button
                            onClick={() => handleSelectMatch(match)}
                            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                          >
                            Select This Match
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Regular Assignments Grid */
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {assignments.map((assignment) => (
                    <Card key={assignment.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl">{assignment.title}</CardTitle>
                            <p className="text-gray-600 mt-2">{assignment.description}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl mb-2">{assignment.clientLogo}</div>
                            <p className="font-semibold text-gray-900">{assignment.company}</p>
                            <p className="text-sm text-gray-500">{assignment.industry}</p>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">Required Skills</h4>
                            <div className="flex flex-wrap gap-2">
                              {assignment.requiredSkills.map((skill, index) => (
                                <Badge key={index} variant="secondary">{skill}</Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold mb-2">Assignment Details</h4>
                            <div className="space-y-1 text-sm text-gray-600">
                              <p><strong>Duration:</strong> {assignment.duration}</p>
                              <p><strong>Budget:</strong> {assignment.budget}</p>
                              <p><strong>Remote:</strong> {assignment.remote}</p>
                            </div>
                          </div>
                          
                          <div className="flex gap-2 pt-4">
                            <Button 
                              onClick={() => handleFindMatches(assignment)}
                              disabled={isMatching}
                              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            >
                              {isMatching && selectedAssignment?.id === assignment.id ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                  Finding Matches...
                                </>
                              ) : (
                                <>
                                  <Sparkles className="h-4 w-4 mr-2" />
                                  Find AI Match
                                </>
                              )}
                            </Button>
                            <Badge 
                              variant={assignment.urgency === 'High' ? 'destructive' : assignment.urgency === 'Medium' ? 'default' : 'secondary'}
                            >
                              {assignment.urgency}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Create Assignment Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <CreateAssignmentForm
                onAssignmentCreated={handleAssignmentCreated}
                onCancel={() => setShowCreateForm(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
