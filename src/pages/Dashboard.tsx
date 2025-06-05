
import React, { useState, useEffect } from "react";
import { Assignment, Consultant } from "../types/consultant";
import DashboardComponent from "@/components/Dashboard";
import { Navbar } from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConsultantsTab } from "@/components/ConsultantsTab";
import { EnhancedConsultantsTab } from "@/components/EnhancedConsultantsTab";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Star, Check, Mail, FileDown, Clock, DollarSign, TrendingUp } from 'lucide-react';
import { useSupabaseConsultants } from "@/hooks/useSupabaseConsultants";

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

      const letter = `Subject: Perfect Match for ${assignment.title} at ${assignment.company}

Dear Hiring Manager,

I'm ${consultant.name}, a ${consultant.roles[0]} with ${consultant.experience} of hands-on experience. Your ${assignment.title} project perfectly aligns with my expertise and career goals.

🎯 Why I'm Perfect for This Role:

Technical Match (${Math.round(score)}%):
${exactMatches.map(skill => `✅ Expert in ${skill}`).join('\n')}
${partialMatches.map(skill => `✅ Expert in ${skill}`).join('\n')}

Track Record:
• ${consultant.projects} projects delivered on-time and on-budget
• ${consultant.rating}/5.0 client satisfaction rating
• ${consultant.certifications.slice(0, 2).join(', ')} certified

Leadership & Team Dynamics:
• ${consultant.communicationStyle}
• ${consultant.teamFit}
• ${consultant.values.join(', ')} values align with your team culture

💰 Investment: ${consultant.rate} (fits within your ${assignment.budget} budget)
📅 Start Date: Ready for ${assignment.startDate}
⚡ Response Time: Active ${consultant.lastActive}

Best regards,
${consultant.name}`;

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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("File upload:", event.target.files);
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
              onFileUpload={handleFileUpload}
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
                  {/* Header with assignment info */}
                  <div className="bg-white rounded-xl shadow-sm border p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900">AI Matching Results</h1>
                        <p className="text-gray-600">Results for: {selectedAssignment.title}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <div className="w-3 h-3 bg-blue-100 rounded-full flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                          </div>
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

                  {/* Match Results */}
                  <div className="space-y-6">
                    {matches.slice(0, 5).map((match, index) => (
                      <div key={match.consultant.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                        {/* Match Header */}
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

                        {/* AI-Generated Cover Letter */}
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-purple-100 rounded flex items-center justify-center">
                                <div className="w-3 h-3 bg-purple-600 rounded"></div>
                              </div>
                              <h4 className="font-semibold text-gray-900">AI-Generated Cover Letter</h4>
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">{match.letter}</pre>
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="p-6 bg-gray-50 border-t">
                          <button
                            onClick={() => handleSelectMatch(match)}
                            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                          >
                            Select This Match
                          </button>
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
