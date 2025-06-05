
import React, { useState, useEffect } from "react";
import { Assignment, Consultant, Match } from "../types/consultant";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, Users, Briefcase, TrendingUp, Clock, Check, FileDown, Plus, Sparkles, Star, MapPin, Mail, Phone, Award, Target, DollarSign, Timer, BarChart3, MessageSquare, User, Brain } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreateAssignmentForm from "@/components/CreateAssignmentForm";
import { useSupabaseConsultants } from "@/hooks/useSupabaseConsultants";
import { Navbar } from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";
import { usePDFExport } from "@/hooks/usePDFExport";
import { StripeCheckout } from "@/components/StripeCheckout";

// Sample data for demo purposes - samma som i Index.tsx
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
    type: 'new',
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
    type: 'new',
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

export default function DashboardPage() {
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [consultants, setConsultants] = useState<Consultant[]>(initialConsultants);
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMatching, setIsMatching] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  const { toast } = useToast();
  const { consultants: supabaseConsultants } = useSupabaseConsultants();
  const { exportMatchesToPDF, exportConsultantListToPDF } = usePDFExport();

  useEffect(() => {
    console.log("Loading consultants:", consultants.length);
    console.log("Loading assignments:", assignments.length);
    
    // Load data from localStorage if it exists, otherwise use initial data
    const storedConsultants = localStorage.getItem("consultants");
    const storedAssignments = localStorage.getItem("assignments");

    if (storedConsultants && JSON.parse(storedConsultants).length > 0) {
      setConsultants(JSON.parse(storedConsultants));
    }
    
    if (storedAssignments && JSON.parse(storedAssignments).length > 0) {
      setAssignments(JSON.parse(storedAssignments));
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
  }, [consultants, assignments]);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getStatusColor = (availability: string) => {
    if (availability.includes('Available')) return 'bg-green-100 text-green-800';
    if (availability.includes('From')) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

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
      
      toast({
        title: "Match Selected",
        description: `${match.consultant.name} has been matched to ${selectedAssignment.title}`,
      });
    }
  };

  const handleAssignmentCreated = (newAssignment: Assignment) => {
    setAssignments(prevAssignments => [...prevAssignments, newAssignment]);
    setShowCreateForm(false);
    toast({
      title: "Assignment Created",
      description: `${newAssignment.title} has been created successfully.`,
    });
  };

  const handleExportMatches = () => {
    if (matches.length > 0 && selectedAssignment) {
      exportMatchesToPDF(matches, selectedAssignment);
      toast({
        title: "PDF Exporterad",
        description: "Matchningsresultaten har exporterats till PDF",
      });
    }
  };

  const handleExportConsultants = () => {
    exportConsultantListToPDF(consultants);
    toast({
      title: "PDF Exporterad", 
      description: "Konsultdatabasen har exporterats till PDF",
    });
  };

  // Dashboard stats
  const totalConsultants = consultants.length;
  const activeAssignments = assignments.length;
  const successfulMatches = 156;
  const avgMatchTime = "12 seconds";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="consultants">
              Consultants ({consultants.length})
            </TabsTrigger>
            <TabsTrigger value="assignments">
              Assignments ({assignments.length})
            </TabsTrigger>
            <TabsTrigger value="pricing">Subscription</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <div className="space-y-6">
              {/* Header */}
              <div className="bg-white border-b border-gray-200 px-6 py-4 rounded-lg">
                <h1 className="text-2xl font-bold text-gray-900">AI-Driven Consultant Matching Platform</h1>
                <p className="text-gray-600 mt-1">Match consultants with assignments using advanced AI that analyzes both technical skills and soft factors</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-white border border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Users className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">{totalConsultants}</div>
                    <div className="text-sm font-medium text-gray-900 mb-1">Active Consultants</div>
                    <div className="text-sm text-green-600">↗ +12 this week</div>
                  </CardContent>
                </Card>

                <Card className="bg-white border border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Briefcase className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">{activeAssignments}</div>
                    <div className="text-sm font-medium text-gray-900 mb-1">Open Assignments</div>
                    <div className="text-sm text-green-600">↗ +5 today</div>
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
                    <div className="text-sm text-green-600">↗ +23 this month</div>
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
            </div>
          </TabsContent>

          <TabsContent value="consultants">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Konsulter</h2>
                  <p className="text-gray-600 mt-1">{consultants.length} konsulter tillgängliga</p>
                </div>
                <div className="flex items-center space-x-4">
                  <Button onClick={handleExportConsultants} variant="outline">
                    <FileDown className="h-4 w-4 mr-2" />
                    Exportera PDF
                  </Button>
                  <div className="relative">
                    <Button className="flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Ladda upp CV
                    </Button>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Consultants Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {consultants.map((consultant) => (
                  <Card key={consultant.id} className="p-6 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                          {getInitials(consultant.name)}
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{consultant.name}</h4>
                          <p className="text-gray-600">{consultant.roles[0]}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="font-semibold">{consultant.rating}</span>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Erfarenhet:</span>
                        <span className="font-medium">{consultant.experience.replace(' experience', '')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Projekt:</span>
                        <span className="font-medium">{consultant.projects} slutförda</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Timtaxa:</span>
                        <span className="font-medium text-green-600">{consultant.rate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Plats:</span>
                        <span className="font-medium">{consultant.location}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Status:</span>
                        <Badge className={getStatusColor(consultant.availability)}>
                          {consultant.availability}
                        </Badge>
                      </div>
                    </div>

                    {/* LinkedIn Analysis - Mjuka värden */}
                    <div className="mb-4 p-3 bg-purple-50 rounded-lg">
                      <h5 className="text-sm font-semibold text-purple-900 mb-2">LinkedIn Analys</h5>
                      <div className="space-y-2">
                        <div>
                          <span className="text-xs text-purple-700 font-medium">Kommunikationsstil:</span>
                          <p className="text-xs text-purple-800">{consultant.communicationStyle}</p>
                        </div>
                        <div>
                          <span className="text-xs text-purple-700 font-medium">Arbetsstil:</span>
                          <p className="text-xs text-purple-800">{consultant.workStyle}</p>
                        </div>
                        <div>
                          <span className="text-xs text-purple-700 font-medium">Värderingar:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {consultant.values.map((value, index) => (
                              <span key={index} className="px-2 py-1 bg-purple-200 text-purple-800 text-xs rounded">
                                {value}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          <div className="text-center">
                            <div className="text-xs text-purple-700">Kulturell fit</div>
                            <div className="font-semibold text-purple-900">{consultant.culturalFit}/5</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-purple-700">Anpassbarhet</div>
                            <div className="font-semibold text-purple-900">{consultant.adaptability}/5</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-purple-700">Ledarskap</div>
                            <div className="font-semibold text-purple-900">{consultant.leadership}/5</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Huvudkompetenser:</p>
                      <div className="flex flex-wrap gap-2">
                        {consultant.skills.slice(0, 4).map((skill, index) => (
                          <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                            {skill}
                          </Badge>
                        ))}
                        {consultant.skills.length > 4 && (
                          <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                            +{consultant.skills.length - 4} fler
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <Button variant="outline" size="sm">
                        <Mail className="h-4 w-4 mr-2" />
                        Kontakta
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="assignments">
            <div className="space-y-6">
              {/* Show enhanced matches if available */}
              {matches.length > 0 && selectedAssignment ? (
                <div className="space-y-6">
                  {/* Header with assignment info */}
                  <div className="bg-white rounded-xl shadow-sm border p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900">AI Matching Results</h1>
                        <p className="text-gray-600">Results for: {selectedAssignment.roles?.[0] || selectedAssignment.title} - {selectedAssignment.title}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Badge className="bg-green-100 text-green-800">
                            ✓ Matched {matches.length} consultants in 12 seconds
                          </Badge>
                        </div>
                        <Button onClick={handleExportMatches} variant="outline" size="sm">
                          <FileDown className="h-4 w-4 mr-2" />
                          Export PDF
                        </Button>
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

                  {/* Enhanced Match Results */}
                  <div className="space-y-6">
                    {matches.slice(0, 5).map((match, index) => (
                      <div key={match.consultant.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                        {/* Match Header */}
                        <div className="p-6 border-b border-gray-100">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-3">
                                <div className="bg-orange-100 text-orange-600 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm">
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

                        {/* Experience & Basic Info */}
                        <div className="p-6 border-b border-gray-100">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Experience:</span>
                              <div className="font-medium">{match.consultant.experience.replace(/\D/g, '')} years</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Rate:</span>
                              <div className="font-medium text-green-600">{match.consultant.rate}</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Projects:</span>
                              <div className="font-medium">{match.consultant.projects} completed</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Rating:</span>
                              <div className="flex items-center space-x-1">
                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                <span className="font-medium">{match.consultant.rating}/5.0</span>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Availability:</span>
                              <Badge className={match.consultant.availability === 'Available' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                                {match.consultant.availability}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {/* Human Factors & Cultural Fit */}
                        <div className="p-6 border-b border-gray-100">
                          <div className="flex items-center space-x-2 mb-4">
                            <Brain className="h-5 w-5 text-purple-600" />
                            <h4 className="font-semibold text-gray-900">Human Factors & Cultural Fit</h4>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm text-gray-600">Cultural Match:</span>
                                <span className="font-bold text-blue-600">{match.culturalMatch}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-600 h-2 rounded-full" style={{width: `${match.culturalMatch}%`}}></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm text-gray-600">Communication:</span>
                                <span className="font-bold text-green-600">{match.communicationMatch}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-green-600 h-2 rounded-full" style={{width: `${match.communicationMatch}%`}}></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm text-gray-600">Values Alignment:</span>
                                <span className="font-bold text-purple-600">{match.valuesAlignment}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-purple-600 h-2 rounded-full" style={{width: `${match.valuesAlignment}%`}}></div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            <div>
                              <span className="text-sm font-medium text-gray-700">Communication Style:</span>
                              <p className="text-sm text-gray-900 mt-1">{match.consultant.communicationStyle}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-700">Work Style:</span>
                              <p className="text-sm text-gray-900 mt-1">{match.consultant.workStyle}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-700">Leadership:</span>
                              <p className="text-sm text-gray-900 mt-1">{match.consultant.leadership}/5</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-700">Adaptability:</span>
                              <p className="text-sm text-gray-900 mt-1">{match.consultant.adaptability}/5</p>
                            </div>
                          </div>
                        </div>

                        {/* Estimated Impact */}
                        <div className="p-6 border-b border-gray-100">
                          <div className="flex items-center space-x-2 mb-4">
                            <BarChart3 className="h-5 w-5 text-green-600" />
                            <h4 className="font-semibold text-gray-900">Estimated Impact</h4>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center">
                              <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                              <div className="text-2xl font-bold text-green-600">{match.estimatedSavings.toLocaleString()} SEK</div>
                              <div className="text-sm text-gray-600">Cost savings/month</div>
                            </div>
                            <div className="text-center">
                              <Timer className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                              <div className="text-2xl font-bold text-blue-600">{match.responseTime}h</div>
                              <div className="text-sm text-gray-600">Expected response</div>
                            </div>
                            <div className="text-center">
                              <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                              <div className="text-2xl font-bold text-purple-600">{85 + Math.floor(Math.random() * 15)}%</div>
                              <div className="text-sm text-gray-600">Success probability</div>
                            </div>
                          </div>
                        </div>

                        {/* AI-Generated Cover Letter */}
                        <div className="p-6 border-b border-gray-100">
                          <div className="flex items-center space-x-2 mb-4">
                            <MessageSquare className="h-5 w-5 text-gray-600" />
                            <h4 className="font-semibold text-gray-900">AI-Generated Cover Letter</h4>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">{match.letter}</pre>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="p-6 bg-gray-50 flex justify-between items-center">
                          <div className="flex space-x-4">
                            <Button variant="outline" size="sm">
                              <FileDown className="h-4 w-4 mr-2" />
                              Export PDF
                            </Button>
                            <Button variant="outline" size="sm">
                              <Mail className="h-4 w-4 mr-2" />
                              Send Email
                            </Button>
                          </div>
                          <Button
                            onClick={() => handleSelectMatch(match)}
                            className="bg-green-600 hover:bg-green-700 px-6"
                          >
                            Select This Match
                          </Button>
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

          <TabsContent value="pricing">
            <div className="space-y-8">
              <div className="text-center">
                <div className="inline-flex items-center mb-4">
                  <span className="text-2xl mr-2">💰</span>
                  <h2 className="text-3xl font-bold text-gray-900">Pricing Overview</h2>
                </div>
                <p className="text-lg text-gray-600">Choose the plan that fits your company's needs</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                <StripeCheckout
                  planName="Basic Plan"
                  price={99}
                  features={[
                    'Full access to consultant search and filtering',
                    'View detailed profiles incl. soft skills and CVs',
                    'Save favorites & download CVs',
                    '1 admin + 2 standard users',
                    'Email support'
                  ]}
                />
                <StripeCheckout
                  planName="Team Plan"
                  price={199}
                  features={[
                    'Everything in Basic, plus:',
                    'Extended user access',
                    'Role-based access control',
                    'Priority email support',
                    'Early feature access',
                    'Export consultant lists'
                  ]}
                />
                <StripeCheckout
                  planName="Enterprise"
                  price={599}
                  features={[
                    'Unlimited searches in the open consultant database',
                    'Direct access to incoming freelance CVs',
                    'Premium visibility settings for your jobs',
                    'Integration possibilities (API access upon request)',
                    'Dedicated onboarding',
                    'SLA-backed support'
                  ]}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Assignment Modal */}
      {showCreateForm && (
        <CreateAssignmentForm
          onAssignmentCreated={handleAssignmentCreated}
          onCancel={() => setShowCreateForm(false)}
        />
      )}
    </div>
  );
}
