import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Dashboard from "@/components/Dashboard";
import { ConsultantsTab } from "@/components/ConsultantsTab";
import { Assignment, Consultant, Match } from "../types/consultant";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";
import Logo from '../components/Logo';
import { Sparkles, Star, Check, Mail, FileDown, Clock, DollarSign, TrendingUp, User, MapPin, Calendar, Briefcase, Plus, Phone, Award, Languages, Heart, Brain, Target, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import CreateAssignmentForm from "../components/CreateAssignmentForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Sample data for demo purposes - these are our "existing consultants"
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
    leadership: 5,
    linkedinUrl: "https://linkedin.com/in/anna-lindqvist"
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
    leadership: 3,
    linkedinUrl: "https://linkedin.com/in/marcus-johansson"
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
    leadership: 5,
    linkedinUrl: "https://linkedin.com/in/sofia-andersson"
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
    type: 'existing',
    communicationStyle: "Technical and precise",
    workStyle: "Research-oriented, enjoys experimenting",
    values: ["Innovation", "Scientific rigor", "Open source"],
    personalityTraits: ["Curious", "Methodical", "Creative"],
    teamFit: "Great collaborator on technical challenges",
    culturalFit: 4,
    adaptability: 4,
    leadership: 3,
    linkedinUrl: "https://linkedin.com/in/erik-nilsson"
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
    type: 'existing',
    communicationStyle: "Empathetic and user-focused",
    workStyle: "Collaborative, user research driven",
    values: ["User empathy", "Accessibility", "Inclusive design"],
    personalityTraits: ["Empathetic", "Creative", "Detail-oriented"],
    teamFit: "Bridges gap between design and development teams",
    culturalFit: 5,
    adaptability: 4,
    leadership: 4,
    linkedinUrl: "https://linkedin.com/in/lisa-bergstrom"
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

// AI Matching function with improved scoring
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
    
    // Enhanced scoring algorithm
    let score = 0;
    
    // 1. Skills matching (50% of total score)
    const exactMatchWeight = 30; // 30% for exact matches
    const partialMatchWeight = 20; // 20% for partial matches
    
    const exactMatchScore = (exactMatches.length / assignment.requiredSkills.length) * exactMatchWeight;
    const partialMatchScore = (partialMatches.length / assignment.requiredSkills.length) * partialMatchWeight;
    score += exactMatchScore + partialMatchScore;
    
    // 2. Experience factor (20% of total score)
    const experienceYears = parseInt(consultant.experience.replace(/\D/g, '')) || 0;
    const experienceScore = Math.min((experienceYears / 10) * 20, 20); // Max 20 points
    score += experienceScore;
    
    // 3. Rating factor (15% of total score)
    const ratingScore = (consultant.rating / 5) * 15;
    score += ratingScore;
    
    // 4. Cultural fit and availability (15% of total score)
    const culturalScore = (consultant.culturalFit / 5) * 10;
    const availabilityScore = consultant.availability.toLowerCase().includes('available') ? 5 : 2;
    score += culturalScore + availabilityScore;
    
    // Only include consultants with meaningful matches
    if (totalMatchedSkills.length > 0) {
      // Generate personalized cover letter
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

I'd love to discuss how my experience can accelerate your project timeline and ensure technical excellence. Available for a call this week!

Cheers,
${consultant.name}

Contact: ${consultant.email} | ${consultant.phone}
Portfolio: Available upon request

P.S. - This personalized application was generated by AI but reflects my genuine interest and qualifications! 🤖✨`;

      const humanFactorsScore = Math.round((consultant.culturalFit + consultant.adaptability + consultant.leadership) / 3 * 20);
      
      matches.push({
        consultant,
        score: Math.round(Math.min(score, 100)), // Cap at 100%
        matchedSkills: totalMatchedSkills,
        humanFactorsScore,
        culturalMatch: Math.round((consultant.culturalFit / 5) * 100),
        communicationMatch: Math.round(85 + Math.random() * 15), // Simulated
        valuesAlignment: Math.round(80 + Math.random() * 20), // Simulated  
        estimatedSavings: Math.floor(Math.random() * 30000) + 5000,
        responseTime: Math.floor(Math.random() * 8) + 2,
        letter
      });
    }
  });
  
  // Sort by score (highest first) and return top matches
  const sortedMatches = matches.sort((a, b) => b.score - a.score);
  console.log("✅ Found", sortedMatches.length, "matches, top score:", sortedMatches[0]?.score + "%");
  
  return sortedMatches;
};

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [consultants, setConsultants] = useState<Consultant[]>(initialConsultants);
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [matches, setMatches] = useState<Match[]>([]);
  const [isMatching, setIsMatching] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [expandedMatch, setExpandedMatch] = useState<number | null>(null);

  useEffect(() => {
    console.log("Loading consultants:", consultants.length);
    console.log("Loading assignments:", assignments.length);
    
    // Load data from localStorage if it exists, otherwise use initial data
    const storedAssignments = localStorage.getItem("assignments");

    if (storedAssignments && JSON.parse(storedAssignments).length > 0) {
      setAssignments(JSON.parse(storedAssignments));
    }
  }, []);

  useEffect(() => {
    // Update localStorage whenever assignments change
    if (assignments.length > 0) {
      localStorage.setItem("assignments", JSON.stringify(assignments));
    }
  }, [assignments]);

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
            skills: ["JavaScript", "React", "Problem Solving"],
            experience: "3 years",
            roles: ["Frontend Developer"],
            location: "Stockholm",
            rate: "700 SEK/h",
            availability: "Available",
            phone: "+46 70 XXX XXXX",
            email: "consultant@email.com",
            projects: Math.floor(Math.random() * 10) + 5,
            rating: 4.0 + Math.random() * 0.9,
            lastActive: "CV uploaded",
            cv: text,
            certifications: ["React Certification"],
            languages: ["Swedish", "English"],
            type: 'new',
            communicationStyle: "Collaborative and learning-focused",
            workStyle: "Adaptive and detail-oriented",
            values: ["Quality", "Learning", "Innovation"],
            personalityTraits: ["Eager", "Collaborative", "Growth-minded"],
            teamFit: "Adaptable team member with growth potential",
            culturalFit: 4,
            adaptability: 4,
            leadership: 3,
            linkedinUrl: `https://linkedin.com/in/${file.name.toLowerCase().replace(' ', '-')}`
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
    console.log("🚀 Starting AI matching for assignment:", assignment.title);
    
    setIsMatching(true);
    setSelectedAssignment(assignment);
    
    try {
      // Simulate AI processing time
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
      setExpandedMatch(null);
      
      toast({
        title: "Match Selected",
        description: `${match.consultant.name} has been matched to ${selectedAssignment.title}`,
      });
    }
  };

  const toggleMatchExpansion = (index: number) => {
    setExpandedMatch(expandedMatch === index ? null : index);
  };

  const handleAssignmentCreated = (newAssignment: Assignment) => {
    setAssignments(prevAssignments => [...prevAssignments, newAssignment]);
    setShowCreateForm(false);
    toast({
      title: "Assignment Created",
      description: `${newAssignment.title} has been created successfully.`,
    });
  };

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
              Consultants
            </TabsTrigger>
            <TabsTrigger value="assignments">
              Assignments ({assignments.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard 
              assignments={assignments} 
              onMatch={handleMatch}
              onFileUpload={handleFileUpload}
              onAssignmentCreated={handleAssignmentCreated}
            />
          </TabsContent>

          <TabsContent value="consultants">
            <ConsultantsTab />
          </TabsContent>

          <TabsContent value="assignments">
            <div className="space-y-6">
              {/* Show matches if available */}
              {matches.length > 0 && selectedAssignment ? (
                <div className="space-y-6">
                  {/* Header with assignment info */}
                  <div className="bg-white rounded-xl shadow-sm border p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900">🤖 AI Matching Results</h1>
                        <p className="text-gray-600">Results for: <span className="font-semibold">{selectedAssignment.title}</span></p>
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
                          <span>Matched {matches.length} consultants in 2.8 seconds</span>
                        </div>
                        <button
                          onClick={() => {
                            setMatches([]);
                            setSelectedAssignment(null);
                            setExpandedMatch(null);
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
                    {matches.slice(0, 8).map((match, index) => (
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
                                <div className="flex items-center space-x-4 mt-2">
                                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                                    <Star className="h-4 w-4 text-yellow-500" />
                                    <span>{match.consultant.rating}/5.0</span>
                                  </div>
                                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                                    <Briefcase className="h-4 w-4" />
                                    <span>{match.consultant.projects} projects</span>
                                  </div>
                                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                                    <Clock className="h-4 w-4" />
                                    <span>{match.consultant.lastActive}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center space-x-2 mb-2">
                                <Star className="h-5 w-5 text-blue-500" />
                                <span className="text-2xl font-bold text-blue-600">{match.score}% Match</span>
                              </div>
                              <p className="text-sm text-gray-600">AI Confidence Score</p>
                              <div className="flex items-center space-x-2 mt-2">
                                <div className="flex items-center space-x-1 text-sm text-green-600">
                                  <DollarSign className="h-4 w-4" />
                                  <span>€{match.estimatedSavings.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center space-x-1 text-sm text-blue-600">
                                  <Clock className="h-4 w-4" />
                                  <span>{match.responseTime}h</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Matching Skills */}
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

                        {/* Human Factors Quick Overview */}
                        <div className="p-6 border-b border-gray-100">
                          <div className="grid grid-cols-4 gap-4">
                            <div className="text-center">
                              <div className="flex items-center justify-center space-x-1 mb-1">
                                <Heart className="h-4 w-4 text-red-500" />
                                <span className="text-sm font-medium text-gray-700">Cultural</span>
                              </div>
                              <div className="text-xl font-bold text-red-600">{match.culturalMatch}%</div>
                            </div>
                            <div className="text-center">
                              <div className="flex items-center justify-center space-x-1 mb-1">
                                <Brain className="h-4 w-4 text-blue-500" />
                                <span className="text-sm font-medium text-gray-700">Comm.</span>
                              </div>
                              <div className="text-xl font-bold text-blue-600">{match.communicationMatch}%</div>
                            </div>
                            <div className="text-center">
                              <div className="flex items-center justify-center space-x-1 mb-1">
                                <Target className="h-4 w-4 text-purple-500" />
                                <span className="text-sm font-medium text-gray-700">Values</span>
                              </div>
                              <div className="text-xl font-bold text-purple-600">{match.valuesAlignment}%</div>
                            </div>
                            <div className="text-center">
                              <div className="flex items-center justify-center space-x-1 mb-1">
                                <Zap className="h-4 w-4 text-yellow-500" />
                                <span className="text-sm font-medium text-gray-700">Human</span>
                              </div>
                              <div className="text-xl font-bold text-yellow-600">{match.humanFactorsScore}%</div>
                            </div>
                          </div>
                        </div>

                        {/* Expand/Collapse Button */}
                        <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
                          <button
                            onClick={() => toggleMatchExpansion(index)}
                            className="w-full flex items-center justify-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
                          >
                            <span className="text-sm font-medium">
                              {expandedMatch === index ? 'Hide Details' : 'Show Full Analysis'}
                            </span>
                            {expandedMatch === index ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </button>
                        </div>

                        {/* Expanded Details */}
                        {expandedMatch === index && (
                          <div className="space-y-6 p-6 bg-gray-50">
                            {/* Detailed Profile */}
                            <div className="grid md:grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <h5 className="font-semibold text-gray-900 flex items-center space-x-2">
                                  <User className="h-4 w-4" />
                                  <span>Profile Details</span>
                                </h5>
                                <div className="space-y-3 text-sm">
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
                                  <div className="flex items-start justify-between">
                                    <span className="text-gray-600">Contact:</span>
                                    <div className="text-right">
                                      <div className="font-medium">{match.consultant.email}</div>
                                      <div className="text-gray-500">{match.consultant.phone}</div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <h5 className="font-semibold text-gray-900 flex items-center space-x-2">
                                  <Brain className="h-4 w-4" />
                                  <span>Human Factors</span>
                                </h5>
                                <div className="space-y-3 text-sm">
                                  <div>
                                    <span className="text-gray-600">Communication Style:</span>
                                    <p className="font-medium mt-1">{match.consultant.communicationStyle}</p>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Work Style:</span>
                                    <p className="font-medium mt-1">{match.consultant.workStyle}</p>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Team Fit:</span>
                                    <p className="font-medium mt-1">{match.consultant.teamFit}</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Values & Traits */}
                            <div className="grid md:grid-cols-2 gap-6">
                              <div>
                                <h5 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                                  <Heart className="h-4 w-4" />
                                  <span>Core Values</span>
                                </h5>
                                <div className="flex flex-wrap gap-2">
                                  {match.consultant.values.map((value, idx) => (
                                    <Badge key={idx} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                      {value}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <h5 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                                  <Zap className="h-4 w-4" />
                                  <span>Personality Traits</span>
                                </h5>
                                <div className="flex flex-wrap gap-2">
                                  {match.consultant.personalityTraits.map((trait, idx) => (
                                    <Badge key={idx} variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                      {trait}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Certifications & Languages */}
                            <div className="grid md:grid-cols-2 gap-6">
                              <div>
                                <h5 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                                  <Award className="h-4 w-4" />
                                  <span>Certifications</span>
                                </h5>
                                <div className="space-y-2">
                                  {match.consultant.certifications.map((cert, idx) => (
                                    <div key={idx} className="flex items-center space-x-2 text-sm">
                                      <Check className="h-3 w-3 text-green-500" />
                                      <span>{cert}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <h5 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                                  <Languages className="h-4 w-4" />
                                  <span>Languages</span>
                                </h5>
                                <div className="flex flex-wrap gap-2">
                                  {match.consultant.languages.map((lang, idx) => (
                                    <Badge key={idx} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                      {lang}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* AI Generated Cover Letter Preview */}
                            <div>
                              <h5 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                                <Mail className="h-4 w-4" />
                                <span>AI-Generated Cover Letter Preview</span>
                              </h5>
                              <div className="bg-white rounded-lg border p-4 max-h-40 overflow-y-auto">
                                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                                  {match.letter.substring(0, 500)}...
                                </pre>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="p-6 bg-gray-50 border-t flex space-x-4">
                          <button
                            onClick={() => handleSelectMatch(match)}
                            className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center space-x-2"
                          >
                            <Check className="h-4 w-4" />
                            <span>Select This Match</span>
                          </button>
                          <button className="bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-semibold flex items-center justify-center space-x-2">
                            <Mail className="h-4 w-4" />
                            <span>Send Message</span>
                          </button>
                          <button className="bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-semibold flex items-center justify-center space-x-2">
                            <FileDown className="h-4 w-4" />
                            <span>Download CV</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Assignments Grid with Create Button */
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Assignments</h2>
                      <p className="text-gray-600 mt-1">Manage and match assignments with consultants</p>
                    </div>
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                      onClick={() => setShowCreateForm(true)}
                    >
                      <Plus className="h-4 w-4" />
                      Create Assignment
                    </Button>
                  </div>

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
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Create Assignment Modal */}
      {showCreateForm && (
        <CreateAssignmentForm
          onAssignmentCreated={handleAssignmentCreated}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      <Toaster />
    </div>
  );
};

export default Index;
