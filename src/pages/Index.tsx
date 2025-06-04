
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Dashboard from "@/components/Dashboard";
import ConsultantsTab from "@/components/ConsultantsTab";
import { Assignment, Consultant, Match } from "../types/consultant";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";
import Logo from '../components/Logo';
import { findMatches } from "../utils/matching";
import { Sparkles } from 'lucide-react';

// Sample data for demo purposes
const initialConsultants: Consultant[] = [
  {
    id: 1,
    name: "Anna Lindqvist",
    skills: ["React", "TypeScript", "UX Design", "Team Leadership"],
    experience: "8 years",
    roles: ["Senior Frontend Developer", "UX Lead"],
    location: "Stockholm",
    rate: "950 SEK/h",
    availability: "Available",
    phone: "+46 70 123 4567",
    email: "anna.lindqvist@email.com",
    projects: 23,
    rating: 4.8,
    lastActive: "2 min ago",
    cv: "Experienced frontend developer with strong UX background...",
    certifications: ["AWS Certified", "Scrum Master"],
    languages: ["Swedish", "English", "German"],
    type: 'existing',
    communicationStyle: "Collaborative and direct",
    workStyle: "Detail-oriented, prefers structured environments",
    values: ["Innovation", "Work-life balance", "Transparency"],
    personalityTraits: ["Empathetic", "Analytical", "Creative"],
    teamFit: "Excellent mentor, works well in cross-functional teams",
    culturalFit: 5,
    adaptability: 4,
    leadership: 5
  },
  {
    id: 2,
    name: "Marcus Johansson",
    skills: ["Node.js", "Python", "AWS", "DevOps"],
    experience: "6 years",
    roles: ["Backend Developer", "DevOps Engineer"],
    location: "Göteborg",
    rate: "850 SEK/h",
    availability: "Available from Feb 1",
    phone: "+46 70 234 5678",
    email: "marcus.johansson@email.com",
    projects: 18,
    rating: 4.6,
    lastActive: "5 min ago",
    cv: "Full-stack developer specializing in backend architecture...",
    certifications: ["Docker Certified", "Kubernetes"],
    languages: ["Swedish", "English"],
    type: 'existing',
    communicationStyle: "Methodical and thorough",
    workStyle: "Independent, enjoys solving complex problems",
    values: ["Technical excellence", "Continuous learning", "Reliability"],
    personalityTraits: ["Logical", "Patient", "Detail-focused"],
    teamFit: "Strong technical contributor, prefers smaller teams",
    culturalFit: 4,
    adaptability: 5,
    leadership: 3
  },
  {
    id: 3,
    name: "Sofia Andersson",
    skills: ["Product Management", "Agile", "Data Analysis", "Stakeholder Management"],
    experience: "10 years",
    roles: ["Senior Product Manager"],
    location: "Malmö",
    rate: "1100 SEK/h",
    availability: "Available",
    phone: "+46 70 345 6789",
    email: "sofia.andersson@email.com",
    projects: 31,
    rating: 4.9,
    lastActive: "1 min ago",
    cv: "Strategic product leader with proven track record...",
    certifications: ["PMP", "Certified Product Owner"],
    languages: ["Swedish", "English", "Danish"],
    type: 'existing',
    communicationStyle: "Inspiring and strategic",
    workStyle: "Visionary, thrives in dynamic environments",
    values: ["Customer focus", "Data-driven decisions", "Team empowerment"],
    personalityTraits: ["Charismatic", "Strategic", "Results-oriented"],
    teamFit: "Natural leader, excellent at aligning teams around vision",
    culturalFit: 5,
    adaptability: 5,
    leadership: 5
  },
  {
    id: 4,
    name: "Erik Nilsson",
    skills: ["Machine Learning", "Python", "TensorFlow", "Data Science"],
    experience: "4 years",
    roles: ["ML Engineer", "Data Scientist"],
    location: "Stockholm",
    rate: "800 SEK/h",
    availability: "Available",
    phone: "+46 70 456 7890",
    email: "erik.nilsson@email.com",
    projects: 12,
    rating: 4.7,
    lastActive: "Today",
    cv: "AI specialist with focus on practical ML implementations...",
    certifications: ["Google Cloud ML", "TensorFlow Developer"],
    languages: ["Swedish", "English"],
    type: 'new',
    communicationStyle: "Technical and precise",
    workStyle: "Research-oriented, enjoys experimenting",
    values: ["Innovation", "Scientific rigor", "Open source"],
    personalityTraits: ["Curious", "Methodical", "Creative"],
    teamFit: "Great collaborator on technical challenges",
    culturalFit: 4,
    adaptability: 4,
    leadership: 3
  },
  {
    id: 5,
    name: "Lisa Bergström",
    skills: ["UI/UX Design", "Figma", "User Research", "Design Systems"],
    experience: "7 years",
    roles: ["Senior UX Designer"],
    location: "Stockholm",
    rate: "900 SEK/h",
    availability: "Available from Jan 15",
    phone: "+46 70 567 8901",
    email: "lisa.bergstrom@email.com",
    projects: 26,
    rating: 4.8,
    lastActive: "Yesterday",
    cv: "User-centered designer with strong research background...",
    certifications: ["Google UX Certificate", "Design Thinking"],
    languages: ["Swedish", "English", "French"],
    type: 'new',
    communicationStyle: "Empathetic and user-focused",
    workStyle: "Collaborative, user research driven",
    values: ["User empathy", "Accessibility", "Inclusive design"],
    personalityTraits: ["Empathetic", "Creative", "Detail-oriented"],
    teamFit: "Bridges gap between design and development teams",
    culturalFit: 5,
    adaptability: 4,
    leadership: 4
  }
];

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
  },
  {
    id: 3,
    title: "Financial Services Mobile App",
    description: "Develop a secure mobile banking application with biometric authentication and real-time transaction monitoring.",
    requiredSkills: ["React Native", "Security", "Financial Services", "Mobile Development"],
    startDate: "2024-03-01",
    duration: "8 months",
    workload: "Full-time",
    budget: "900-1100 SEK/h",
    company: "Swedish FinTech Bank",
    industry: "Financial Services",
    teamSize: "12 people",
    remote: "On-site (Stockholm)",
    urgency: "High",
    clientLogo: "🏦",
    desiredCommunicationStyle: "Security-conscious and detail-oriented",
    teamCulture: "Highly regulated, quality-focused, collaborative",
    requiredValues: ["Security", "Reliability", "Customer trust"],
    leadershipLevel: 4,
    teamDynamics: "Large, multi-disciplinary team with strict compliance requirements"
  }
];

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [consultants, setConsultants] = useState<Consultant[]>(initialConsultants);
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [matches, setMatches] = useState<Match[]>([]);
  const [isMatching, setIsMatching] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  useEffect(() => {
    console.log("Loading consultants:", consultants.length);
    console.log("Loading assignments:", assignments.length);
    
    // Load data from localStorage if it exists, otherwise use initial data
    const storedConsultants = localStorage.getItem("consultants");
    const storedAssignments = localStorage.getItem("assignments");
    const storedMatches = localStorage.getItem("matches");

    if (storedConsultants && JSON.parse(storedConsultants).length > 0) {
      setConsultants(JSON.parse(storedConsultants));
    }
    
    if (storedAssignments && JSON.parse(storedAssignments).length > 0) {
      setAssignments(JSON.parse(storedAssignments));
    }
    
    if (storedMatches) {
      setMatches(JSON.parse(storedMatches));
    }
  }, []);

  useEffect(() => {
    // Update localStorage whenever consultants or assignments change
    if (consultants.length > 0) {
      localStorage.setItem("consultants", JSON.stringify(consultants));
    }
    if (assignments.length > 0) {
      localStorage.setItem("assignments", JSON.stringify(assignments));
    }
    localStorage.setItem("matches", JSON.stringify(matches));
  }, [consultants, assignments, matches]);

  const handleMatch = (assignment: Assignment) => {
    setAssignments((prevAssignments) =>
      prevAssignments.filter((a) => a.id !== assignment.id)
    );
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        try {
          const text = e.target.result;
          const newConsultant: Consultant = {
            id: Date.now(),
            name: file.name.replace(/\.[^/.]+$/, ""),
            skills: [text.substring(0, 200)],
            experience: Math.floor(Math.random() * 10).toString(),
            roles: [],
            location: "Unknown",
            rate: "TBD",
            availability: "Full-time",
            phone: "",
            email: "",
            projects: 0,
            rating: 0,
            lastActive: new Date().toISOString(),
            cv: text,
            certifications: [],
            languages: [],
            type: 'new',
            communicationStyle: "",
            workStyle: "",
            values: [],
            personalityTraits: [],
            teamFit: "",
            culturalFit: 0,
            adaptability: 0,
            leadership: 0
          };

          setConsultants((prevConsultants) => [...prevConsultants, newConsultant]);
          toast({
            title: "CV Uploaded",
            description: `${file.name} uploaded successfully.`,
          });
        } catch (error) {
          console.error("Error parsing CV content:", error);
          toast({
            title: "Upload Failed",
            description: `Could not parse CV content from ${file.name}.`,
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    }
  };

  const handleFindMatches = async (assignment: Assignment) => {
    // Prevent starting new matches if already matching or if this assignment is already being matched
    if (isMatching || selectedAssignment) {
      toast({
        title: "Matching in Progress",
        description: "Please wait for the current matching to complete before starting a new one.",
        variant: "destructive",
      });
      return;
    }

    setIsMatching(true);
    setSelectedAssignment(assignment);
    
    console.log("Finding matches for assignment:", assignment.title);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const foundMatches = findMatches(consultants, assignment);
    setMatches(foundMatches);
    setIsMatching(false);
    
    toast({
      title: "AI Matching Complete",
      description: `Found ${foundMatches.length} potential matches for ${assignment.title}`,
    });
  };

  const handleSelectMatch = (match: Match) => {
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

  const existingConsultants = consultants.filter(c => c.type === 'existing');
  const newConsultants = consultants.filter(c => c.type === 'new');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <Logo size="lg" />
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Platform v2.0</span>
            <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">U</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
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
            <Dashboard 
              consultants={consultants} 
              assignments={assignments} 
              onMatch={handleMatch}
              onFileUpload={handleFileUpload}
            />
          </TabsContent>

          <TabsContent value="consultants">
            <ConsultantsTab 
              existingConsultants={existingConsultants}
              newConsultants={newConsultants}
              isMatching={false}
              onFileUpload={handleFileUpload}
            />
          </TabsContent>

          <TabsContent value="assignments">
            <div className="space-y-8">
              {/* Assignments Grid */}
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
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Remote:</span>
                        <span className="font-medium">{assignment.remote}</span>
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
                      onClick={() => handleFindMatches(assignment)}
                      disabled={isMatching || selectedAssignment !== null}
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

              {/* AI Matches Results */}
              {matches.length > 0 && selectedAssignment && (
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        AI Matches for "{selectedAssignment.title}"
                      </h2>
                      <p className="text-gray-600">Ranked by compatibility and human factors</p>
                    </div>
                    <button
                      onClick={() => {
                        setMatches([]);
                        setSelectedAssignment(null);
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-4">
                    {matches.slice(0, 5).map((match, index) => (
                      <div key={match.consultant.id} className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4 flex-1">
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg">
                              #{index + 1}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="text-lg font-semibold text-gray-900">{match.consultant.name}</h3>
                                <div className="text-right">
                                  <div className="text-2xl font-bold text-green-600">{match.score}%</div>
                                  <div className="text-xs text-gray-500">Match Score</div>
                                </div>
                              </div>
                              
                              <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div>
                                  <p className="text-sm text-gray-600 mb-1"><span className="font-medium">Skills:</span> {match.consultant.skills.slice(0, 3).join(', ')}</p>
                                  <p className="text-sm text-gray-600 mb-1"><span className="font-medium">Experience:</span> {match.consultant.experience}</p>
                                  <p className="text-sm text-gray-600 mb-1"><span className="font-medium">Rate:</span> {match.consultant.rate}</p>
                                  <p className="text-sm text-gray-600"><span className="font-medium">Location:</span> {match.consultant.location}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-600 mb-1"><span className="font-medium">Cultural Match:</span> {match.culturalMatch}%</p>
                                  <p className="text-sm text-gray-600 mb-1"><span className="font-medium">Communication:</span> {match.communicationMatch}%</p>
                                  <p className="text-sm text-gray-600 mb-1"><span className="font-medium">Values Alignment:</span> {match.valuesAlignment}%</p>
                                  <p className="text-sm text-gray-600"><span className="font-medium">Response Time:</span> {match.responseTime}h</p>
                                </div>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex flex-wrap gap-2">
                                  {match.matchedSkills.slice(0, 3).map((skill, skillIndex) => (
                                    <span key={skillIndex} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-md">
                                      ✓ {skill}
                                    </span>
                                  ))}
                                </div>
                                <button
                                  onClick={() => handleSelectMatch(match)}
                                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                                >
                                  Select Match
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Toaster />
    </div>
  );
};

export default Index;
