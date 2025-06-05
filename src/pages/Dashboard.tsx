
import React, { useState, useEffect } from "react";
import { Assignment, Consultant } from "../types/consultant";
import DashboardComponent from "@/components/Dashboard";
import { Navbar } from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConsultantsTab } from "@/components/ConsultantsTab";
import { EnhancedConsultantsTab } from "@/components/EnhancedConsultantsTab";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Star, Check, Mail, FileDown, Clock, DollarSign, TrendingUp, User } from 'lucide-react';
import { useSupabaseConsultants } from "@/hooks/useSupabaseConsultants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Sample assignments data for demo
const initialAssignments: Assignment[] = [
  {
    id: 1,
    title: "E-commerce Platform Redesign",
    description: "Lead the redesign of our customer-facing e-commerce platform with focus on mobile experience and conversion optimization.",
    requiredSkills: ["React", "UX Design", "E-commerce", "Mobile-first"],
    startDate: "2024-02-01",
    duration: "6 months",
    workload: "Full-time",
    budget: "800-1000 SEK/h",
    company: "Nordic Retail AB",
    industry: "E-commerce",
    teamSize: "8 people",
    remote: "Hybrid (2 days on-site)",
    urgency: "Medium",
    clientLogo: "🛍️",
    desiredCommunicationStyle: "Collaborative and user-focused",
    teamCulture: "Agile, innovation-focused, flat hierarchy",
    requiredValues: ["Customer focus", "Innovation", "Quality"],
    leadershipLevel: 4,
    teamDynamics: "Cross-functional team with designers and developers"
  },
  {
    id: 2,
    title: "AI-Powered Analytics Platform",
    description: "Build machine learning models for predictive analytics in our SaaS platform. Focus on customer behavior prediction and churn analysis.",
    requiredSkills: ["Machine Learning", "Python", "TensorFlow", "Data Analysis"],
    startDate: "2024-01-15",
    duration: "4 months",
    workload: "Full-time",
    budget: "750-900 SEK/h",
    company: "DataTech Solutions",
    industry: "SaaS/Analytics",
    teamSize: "5 people",
    remote: "Fully remote",
    urgency: "High",
    clientLogo: "🤖",
    desiredCommunicationStyle: "Technical and data-driven",
    teamCulture: "Research-oriented, autonomous teams",
    requiredValues: ["Innovation", "Scientific rigor", "Continuous learning"],
    leadershipLevel: 3,
    teamDynamics: "Small, highly technical team of data scientists"
  }
];

interface Match {
  consultant: Consultant;
  score: number;
  letter: string;
  matchedSkills: string[];
  estimatedSavings: number;
  responseTime: number;
  humanFactorsScore: number;
  culturalMatch: number;
  communicationMatch: number;
  valuesAlignment: number;
}

// AI Matching function
const findMatches = (consultants: Consultant[], assignment: Assignment): Match[] => {
  console.log("🤖 AI Matching Started for:", assignment.title);
  
  const matches: Match[] = [];
  
  consultants.forEach(consultant => {
    const exactMatches = consultant.skills.filter(skill => 
      assignment.requiredSkills.some(reqSkill => 
        skill.toLowerCase() === reqSkill.toLowerCase()
      )
    );
    
    const partialMatches = consultant.skills.filter(skill => 
      assignment.requiredSkills.some(reqSkill => 
        skill.toLowerCase().includes(reqSkill.toLowerCase()) || 
        reqSkill.toLowerCase().includes(skill.toLowerCase())
      )
    ).filter(skill => !exactMatches.includes(skill));
    
    const totalMatchedSkills = [...exactMatches, ...partialMatches];
    
    if (totalMatchedSkills.length > 0) {
      let score = 0;
      const exactMatchScore = (exactMatches.length / assignment.requiredSkills.length) * 30;
      const partialMatchScore = (partialMatches.length / assignment.requiredSkills.length) * 20;
      score += exactMatchScore + partialMatchScore;
      
      const experienceYears = parseInt(consultant.experience.replace(/\D/g, '')) || 0;
      const experienceScore = Math.min((experienceYears / 10) * 20, 20);
      score += experienceScore;
      
      const ratingScore = (consultant.rating / 5) * 15;
      score += ratingScore;
      
      const culturalScore = (consultant.culturalFit / 5) * 10;
      const availabilityScore = consultant.availability.toLowerCase().includes('available') ? 5 : 2;
      score += culturalScore + availabilityScore;

      const letter = `Application: ${assignment.title} | ${consultant.name}

Hello TechStore Nordic AB Team! 🖐

I'm ${consultant.name}, a ${consultant.roles[0]} with ${consultant.experience} of hands-on experience. Your ${assignment.title} project perfectly aligns with my expertise and career goals.

🎯 Why I'm Perfect for This Role:

Technical Match (100%):
✅ Expert in ${exactMatches.join(', ')}
${partialMatches.length > 0 ? `✅ Experienced in ${partialMatches.join(', ')}` : ''}

Track Record:
• ${consultant.projects} projects delivered on-time and on-budget
• ${consultant.rating}/5.0 client satisfaction rating
• ${consultant.certifications.slice(0, 2).join(', ')} certified

Human Factors & Team Fit:
• Communication Style: ${consultant.communicationStyle || 'Direct and collaborative'}
• Work Style: ${consultant.workStyle || 'Agile and iterative'}
• Values Alignment: ${consultant.values.join(', ')} - Cultural Alignment: 96%

💰 Investment: ${consultant.rate} (fits within your ${assignment.budget} budget)
🏢 Start Date: Ready for ${assignment.startDate}
🕐 Response Time: Active ${consultant.lastActive}

I'd love to discuss how my experience can accelerate your project timeline and ensure technical excellence. Available for a call this week!

Cheers,
${consultant.name}
Contact: ${consultant.email} | ${consultant.phone || '+46 70 123 4567'}
Portfolio: Available upon request`;

      const humanFactorsScore = Math.round((consultant.culturalFit + consultant.adaptability + consultant.leadership) / 3 * 20);
      
      matches.push({
        consultant,
        score: Math.round(Math.min(score, 100)),
        matchedSkills: totalMatchedSkills,
        humanFactorsScore,
        culturalMatch: Math.round((consultant.culturalFit / 5) * 100),
        communicationMatch: Math.round(85 + Math.random() * 15),
        valuesAlignment: Math.round(80 + Math.random() * 20),
        estimatedSavings: Math.floor(Math.random() * 30000) + 5000,
        responseTime: Math.floor(Math.random() * 8) + 2,
        letter
      });
    }
  });
  
  return matches.sort((a, b) => b.score - a.score);
};

export default function Dashboard() {
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [matches, setMatches] = useState<Match[]>([]);
  const [isMatching, setIsMatching] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const { toast } = useToast();
  const { consultants } = useSupabaseConsultants();

  const handleMatch = (assignment: Assignment) => {
    setAssignments((prevAssignments) =>
      prevAssignments.filter((a) => a.id !== assignment.id)
    );
  };

  const handleAssignmentCreated = (assignment: Assignment) => {
    setAssignments(prev => [...prev, assignment]);
  };

  const handleFindMatches = async (assignment: Assignment) => {
    console.log("🚀 Starting AI matching for assignment:", assignment.title);
    
    setIsMatching(true);
    setSelectedAssignment(assignment);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const foundMatches = findMatches(consultants, assignment);
      console.log("🎯 Matches found:", foundMatches.length);
      
      setMatches(foundMatches);
      setIsMatching(false);
      
      toast({
        title: "🤖 AI Matching Complete",
        description: `Found ${foundMatches.length} potential matches for ${assignment.title}`,
      });
    } catch (error) {
      console.error("❌ Error during matching:", error);
      setIsMatching(false);
      toast({
        title: "Error",
        description: "Something went wrong during matching. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSelectMatch = (match: Match) => {
    console.log("Selecting match:", match);
    if (selectedAssignment) {
      handleMatch(selectedAssignment);
      setMatches([]);
      setSelectedAssignment(null);
      
      toast({
        title: "Match Selected",
        description: `${match.consultant.name} has been matched to ${selectedAssignment.title}`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="consultants">
              Consultants ({consultants.length})
            </TabsTrigger>
            <TabsTrigger value="assignments">
              Assignments ({assignments.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <DashboardComponent
              assignments={assignments}
              onMatch={handleMatch}
              onAssignmentCreated={handleAssignmentCreated}
            />
          </TabsContent>

          <TabsContent value="consultants">
            <EnhancedConsultantsTab />
          </TabsContent>

          <TabsContent value="assignments">
            <div className="space-y-8">
              {/* Show matches if available */}
              {matches.length > 0 && selectedAssignment ? (
                <div className="space-y-6">
                  {/* Header with assignment info - Similar to your image */}
                  <div className="bg-white rounded-xl shadow-sm border p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900">AI Matching Results</h1>
                        <p className="text-gray-600">Results for: {selectedAssignment.title} - E-commerce Platform</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <div className="w-3 h-3 bg-blue-100 rounded-full flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                          </div>
                          <span>Sorted by AI confidence score</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-green-600">
                          <Check className="h-4 w-4" />
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

                  {/* Match Results - styled like your image */}
                  <div className="space-y-4">
                    {matches.slice(0, 5).map((match, index) => (
                      <div key={match.consultant.id} className="bg-white rounded-xl border border-gray-200 p-6">
                        {/* Top section with consultant info and match score */}
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex items-center space-x-4">
                            <div className="bg-orange-100 text-orange-600 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm">
                              #{index + 1}
                            </div>
                            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                              {match.consultant.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-gray-900">{match.consultant.name}</h3>
                              <p className="text-gray-600">{match.consultant.roles[0]} • {match.consultant.location}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-2 mb-1">
                              <Star className="h-5 w-5 text-blue-500" />
                              <span className="text-2xl font-bold text-blue-600">{match.score}% Match</span>
                            </div>
                            <p className="text-sm text-gray-600">AI Confidence Score</p>
                          </div>
                        </div>

                        {/* Matching Skills */}
                        <div className="mb-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm font-medium text-gray-900">Matching Skills</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {match.matchedSkills.map((skill, idx) => (
                              <Badge key={idx} className="bg-green-100 text-green-800 border-green-200">
                                <Check className="h-3 w-3 mr-1" />
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Stats Grid - like in your image */}
                        <div className="grid grid-cols-3 gap-6 mb-4 text-sm">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Experience:</span>
                              <span className="font-medium">{match.consultant.experience.replace(' experience', '')}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Projects:</span>
                              <span className="font-medium">{match.consultant.projects} completed</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Rating:</span>
                              <div className="flex items-center space-x-1">
                                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                <span className="font-medium">{match.consultant.rating}/5.0</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Rate:</span>
                              <span className="font-medium text-green-600">{match.consultant.rate.replace('SEK/h', 'SEK/hour')}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Availability:</span>
                              <Badge className="bg-green-100 text-green-800 text-xs">Available now</Badge>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Cultural Match:</span>
                              <span className="font-medium">{match.culturalMatch}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Communication:</span>
                              <span className="font-medium">{match.communicationMatch}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Values Alignment:</span>
                              <span className="font-medium">{match.valuesAlignment}%</span>
                            </div>
                          </div>
                        </div>

                        {/* Human Factors & Cultural Fit section */}
                        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-2 mb-3">
                            <User className="h-4 w-4 text-gray-600" />
                            <span className="font-medium text-gray-900">Human Factors & Cultural Fit</span>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Cultural Match:</span>
                              <div className="font-medium">{match.culturalMatch}%</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Communication Style:</span>
                              <div className="font-medium">Direct and collaborative</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Work Style:</span>
                              <div className="font-medium">Agile and iterative</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Leadership:</span>
                              <div className="font-medium">{match.consultant.leadership || 4.9}/5</div>
                            </div>
                          </div>
                        </div>

                        {/* Estimated Impact section */}
                        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                          <div className="flex items-center space-x-2 mb-3">
                            <TrendingUp className="h-4 w-4 text-blue-600" />
                            <span className="font-medium text-gray-900">Estimated Impact</span>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center space-x-2">
                              <DollarSign className="h-4 w-4 text-green-600" />
                              <div>
                                <div className="text-gray-600">Cost savings:</div>
                                <div className="font-bold text-green-600">{match.estimatedSavings} SEK/month</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-blue-600" />
                              <div>
                                <div className="text-gray-600">Expected response:</div>
                                <div className="font-bold text-blue-600">{match.responseTime}h</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <TrendingUp className="h-4 w-4 text-purple-600" />
                              <div>
                                <div className="text-gray-600">Success probability:</div>
                                <div className="font-bold text-purple-600">85%</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* AI-Generated Cover Letter */}
                        <div className="mb-6">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <Mail className="h-4 w-4 text-purple-600" />
                              <span className="font-medium text-gray-900">AI-Generated Cover Letter</span>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <FileDown className="h-4 w-4 mr-2" />
                                Export PDF
                              </Button>
                              <Button variant="outline" size="sm">
                                <Mail className="h-4 w-4 mr-2" />
                                Send Email
                              </Button>
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 rounded-lg p-4 max-h-40 overflow-y-auto">
                            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">{match.letter}</pre>
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="flex justify-end">
                          <Button
                            onClick={() => handleSelectMatch(match)}
                            className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                          >
                            Select This Match
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Assignments Grid */
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {assignments.map((assignment) => (
                    <div key={assignment.id} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div className="text-2xl">{assignment.clientLogo}</div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          assignment.urgency === 'High' 
                            ? 'bg-red-100 text-red-800' 
                            : assignment.urgency === 'Medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {assignment.urgency} Priority
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{assignment.title}</h3>
                      <p className="text-gray-600 mb-4 text-sm line-clamp-2">{assignment.description}</p>
                      <div className="space-y-2 text-sm mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Company:</span>
                          <span className="font-medium">{assignment.company}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Duration:</span>
                          <span className="font-medium">{assignment.duration}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Budget:</span>
                          <span className="font-medium text-green-600">{assignment.budget}</span>
                        </div>
                      </div>
                      <div className="mb-4 pt-4 border-t">
                        <p className="text-sm font-medium text-gray-700 mb-2">Required Skills:</p>
                        <div className="flex flex-wrap gap-1">
                          {assignment.requiredSkills.map((skill, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          console.log("🔍 Find Matches button clicked for:", assignment.title);
                          handleFindMatches(assignment);
                        }}
                        disabled={isMatching}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        {isMatching && selectedAssignment?.id === assignment.id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Finding Matches...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 mr-2" />
                            Find AI Matches
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
