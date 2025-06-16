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

// Enhanced demo consultants with LinkedIn and CV analysis data
const initialConsultants: Consultant[] = [
  {
    id: 1,
    name: "Anna Lindqvist",
    skills: ["React", "TypeScript", "UX Design", "Team Leadership", "Agile", "Figma", "Node.js", "GraphQL"],
    experience: "8 years",
    roles: ["Senior Frontend Developer", "UX Lead", "Tech Lead"],
    location: "Stockholm",
    rate: "950 SEK/h",
    availability: "Available",
    phone: "+46 70 123 4567",
    email: "anna.lindqvist@email.com",
    projects: 23,
    rating: 4.8,
    lastActive: "2 min ago",
    cv: "Experienced frontend developer with strong UX background. Led teams of 5-8 developers. Specialized in React ecosystem and modern web technologies. Master's in Computer Science from KTH. Previously worked at Spotify, Klarna, and H&M Digital.",
    certifications: ["AWS Certified Solutions Architect", "Scrum Master PSM I", "Google UX Design Certificate", "React Advanced Patterns"],
    languages: ["Swedish (Native)", "English (Fluent)", "German (Conversational)", "Spanish (Basic)"],
    type: 'existing',
    communicationStyle: "Collaborative and direct, excels at explaining complex technical concepts to non-technical stakeholders",
    workStyle: "Detail-oriented, prefers structured environments with clear goals. Thrives in cross-functional teams.",
    values: ["Innovation", "Work-life balance", "Transparency", "Continuous learning", "User-centric design"],
    personalityTraits: ["Empathetic", "Analytical", "Creative", "Decisive", "Mentoring-focused"],
    teamFit: "Excellent mentor, works well in cross-functional teams. Natural bridge between design and development.",
    culturalFit: 5,
    adaptability: 4,
    leadership: 5,
    linkedinUrl: "https://linkedin.com/in/anna-lindqvist",
    cvAnalysis: {
      experience: "8+ years in frontend development",
      seniorityLevel: "Senior",
      strengths: ["React expertise", "UX leadership", "Team management"],
      marketPosition: "Top-tier frontend developer with strong UX background",
      technicalDepth: "Deep expertise in modern frontend technologies",
      improvementAreas: ["Backend development", "Cloud architecture"]
    },
    linkedinAnalysis: {
      communicationStyle: "Collaborative and mentoring-focused",
      leadershipStyle: "Servant leadership with strong technical guidance",
      culturalFit: 5,
      leadership: 5,
      innovation: 4,
      problemSolving: "Analytical and user-centered approach",
      businessAcumen: "Strong understanding of product development",
      teamCollaboration: "Excellent cross-functional collaboration"
    }
  },
  {
    id: 2,
    name: "Marcus Johansson",
    skills: ["Node.js", "Python", "AWS", "DevOps", "Kubernetes", "Docker", "Microservices", "PostgreSQL", "Redis"],
    experience: "6 years",
    roles: ["Backend Developer", "DevOps Engineer", "Platform Engineer"],
    location: "Göteborg",
    rate: "850 SEK/h",
    availability: "Available from Feb 1",
    phone: "+46 70 234 5678",
    email: "marcus.johansson@email.com",
    projects: 18,
    rating: 4.6,
    lastActive: "5 min ago",
    cv: "Full-stack developer specializing in backend architecture and cloud infrastructure. Expert in microservices and containerization. Built and maintained systems serving 10M+ users. Bachelor's in Software Engineering from Chalmers.",
    certifications: ["AWS Certified DevOps Engineer", "Certified Kubernetes Administrator", "Docker Certified Associate", "MongoDB Professional"],
    languages: ["Swedish (Native)", "English (Fluent)", "Norwegian (Conversational)"],
    type: 'existing',
    communicationStyle: "Methodical and thorough, prefers written documentation and clear specifications",
    workStyle: "Independent, enjoys solving complex problems. Works best with minimal interruptions and clear requirements.",
    values: ["Technical excellence", "Continuous learning", "Reliability", "Performance optimization", "Security"],
    personalityTraits: ["Logical", "Patient", "Detail-focused", "Problem-solver", "Systematic"],
    teamFit: "Strong technical contributor, prefers smaller teams. Excellent for complex backend challenges.",
    culturalFit: 4,
    adaptability: 5,
    leadership: 3,
    linkedinUrl: "https://linkedin.com/in/marcus-johansson",
    cvAnalysis: {
      experience: "6 years in backend and DevOps",
      seniorityLevel: "Mid-Senior",
      strengths: ["Cloud architecture", "Microservices", "DevOps practices"],
      marketPosition: "Strong backend engineer with DevOps expertise",
      technicalDepth: "Deep knowledge of scalable systems",
      improvementAreas: ["Frontend development", "Management skills"]
    }
  },
  {
    id: 3,
    name: "Sofia Andersson",
    skills: ["Product Management", "Agile", "Data Analysis", "Stakeholder Management", "OKRs", "User Research", "A/B Testing", "SQL"],
    experience: "10 years",
    roles: ["Senior Product Manager", "Product Owner", "Strategy Lead"],
    location: "Malmö",
    rate: "1100 SEK/h",
    availability: "Available",
    phone: "+46 70 345 6789",
    email: "sofia.andersson@email.com",
    projects: 31,
    rating: 4.9,
    lastActive: "1 min ago",
    cv: "Strategic product leader with proven track record of launching successful digital products. Led product teams for companies like King, Mojang, and Ericsson. MBA from Stockholm School of Economics. Expert in data-driven product decisions.",
    certifications: ["Certified Product Manager (CPM)", "Certified Scrum Product Owner", "Google Analytics Certified", "Lean Six Sigma Green Belt"],
    languages: ["Swedish (Native)", "English (Fluent)", "Danish (Fluent)", "French (Intermediate)"],
    type: 'existing',
    communicationStyle: "Inspiring and strategic, excellent at aligning diverse stakeholders around common vision",
    workStyle: "Visionary, thrives in dynamic environments. Balances strategic thinking with hands-on execution.",
    values: ["Customer focus", "Data-driven decisions", "Team empowerment", "Innovation", "Sustainable growth"],
    personalityTraits: ["Charismatic", "Strategic", "Results-oriented", "Collaborative", "Influential"],
    teamFit: "Natural leader, excellent at aligning teams around vision. Bridges business and technical teams effectively.",
    culturalFit: 5,
    adaptability: 5,
    leadership: 5,
    linkedinUrl: "https://linkedin.com/in/sofia-andersson",
    linkedinAnalysis: {
      communicationStyle: "Strategic and inspirational leadership",
      leadershipStyle: "Transformational leadership with focus on empowerment",
      culturalFit: 5,
      leadership: 5,
      innovation: 5,
      problemSolving: "Data-driven and strategic approach",
      businessAcumen: "Exceptional business and market understanding",
      teamCollaboration: "Outstanding stakeholder management"
    }
  },
  {
    id: 4,
    name: "Erik Nilsson",
    skills: ["Machine Learning", "Python", "TensorFlow", "Data Science", "PyTorch", "Pandas", "Scikit-learn", "Azure ML", "Deep Learning"],
    experience: "4 years",
    roles: ["ML Engineer", "Data Scientist", "AI Researcher"],
    location: "Stockholm",
    rate: "800 SEK/h",
    availability: "Available",
    phone: "+46 70 456 7890",
    email: "erik.nilsson@email.com",
    projects: 12,
    rating: 4.7,
    lastActive: "Today",
    cv: "AI specialist with focus on practical ML implementations. PhD in Machine Learning from KTH. Published 8 research papers in top-tier conferences. Previously worked at Ericsson Research and Peltarion. Expert in computer vision and NLP.",
    certifications: ["Google Cloud Professional ML Engineer", "TensorFlow Developer Certificate", "Microsoft Azure AI Engineer", "Coursera Deep Learning Specialization"],
    languages: ["Swedish (Native)", "English (Fluent)", "German (Intermediate)"],
    type: 'existing',
    communicationStyle: "Technical and precise, excellent at translating complex AI concepts for business stakeholders",
    workStyle: "Research-oriented, enjoys experimenting with cutting-edge technologies. Prefers iterative development.",
    values: ["Innovation", "Scientific rigor", "Open source", "Ethical AI", "Knowledge sharing"],
    personalityTraits: ["Curious", "Methodical", "Creative", "Analytical", "Research-minded"],
    teamFit: "Great collaborator on technical challenges. Mentors junior developers in ML concepts.",
    culturalFit: 4,
    adaptability: 4,
    leadership: 3,
    linkedinUrl: "https://linkedin.com/in/erik-nilsson",
    cvAnalysis: {
      experience: "4 years + PhD in Machine Learning",
      seniorityLevel: "Mid-level with advanced expertise",
      strengths: ["Deep Learning", "Research background", "AI implementation"],
      marketPosition: "Specialized AI expert with academic credentials",
      technicalDepth: "Exceptional theoretical and practical ML knowledge",
      improvementAreas: ["Business development", "Team leadership"]
    }
  },
  {
    id: 5,
    name: "Lisa Bergström",
    skills: ["UI/UX Design", "Figma", "User Research", "Design Systems", "Prototyping", "Adobe Creative Suite", "Sketch", "InVision"],
    experience: "7 years",
    roles: ["Senior UX Designer", "Design Lead", "User Researcher"],
    location: "Stockholm",
    rate: "900 SEK/h",
    availability: "Available from Jan 15",
    phone: "+46 70 567 8901",
    email: "lisa.bergstrom@email.com",
    projects: 26,
    rating: 4.8,
    lastActive: "Yesterday",
    cv: "User-centered designer with strong research background. Master's in Interaction Design from Umeå Institute of Design. Led design for award-winning apps with 1M+ downloads. Previously at Truecaller, SEB, and Tink.",
    certifications: ["Google UX Design Certificate", "Design Thinking Certification (IDEO)", "Adobe Certified Expert", "Nielsen Norman Group UX Certification"],
    languages: ["Swedish (Native)", "English (Fluent)", "French (Intermediate)", "Italian (Basic)"],
    type: 'existing',
    communicationStyle: "Empathetic and user-focused, skilled at facilitating workshops and design sessions",
    workStyle: "Collaborative, user research driven. Iterative approach with strong attention to accessibility.",
    values: ["User empathy", "Accessibility", "Inclusive design", "Sustainability", "Human-centered design"],
    personalityTraits: ["Empathetic", "Creative", "Detail-oriented", "Collaborative", "User-advocate"],
    teamFit: "Bridges gap between design and development teams. Champions user needs throughout organization.",
    culturalFit: 5,
    adaptability: 4,
    leadership: 4,
    linkedinUrl: "https://linkedin.com/in/lisa-bergstrom"
  },
  {
    id: 6,
    name: "David Chen",
    skills: ["Full Stack Development", "React", "Spring Boot", "Java", "PostgreSQL", "REST APIs", "Git", "Jenkins"],
    experience: "5 years",
    roles: ["Full Stack Developer", "Software Engineer"],
    location: "Stockholm",
    rate: "750 SEK/h",
    availability: "Available",
    phone: "+46 70 678 9012",
    email: "david.chen@email.com",
    projects: 15,
    rating: 4.5,
    lastActive: "CV uploaded 2 days ago",
    cv: "Versatile full-stack developer with experience in both frontend and backend technologies. Bachelor's in Computer Science from Uppsala University. Worked on e-commerce platforms and fintech applications. Strong problem-solving skills and passion for clean code.",
    certifications: ["Oracle Certified Java Programmer", "React Developer Certification", "AWS Cloud Practitioner"],
    languages: ["Swedish (Fluent)", "English (Fluent)", "Mandarin (Native)", "Japanese (Basic)"],
    type: 'new',
    communicationStyle: "Clear and concise, good at asking clarifying questions",
    workStyle: "Balanced approach between independence and collaboration. Values code quality and documentation.",
    values: ["Code quality", "Team collaboration", "Continuous improvement", "Learning", "Work-life balance"],
    personalityTraits: ["Curious", "Reliable", "Adaptable", "Team-oriented", "Quality-focused"],
    teamFit: "Solid team player, adapts well to different team dynamics and project requirements.",
    culturalFit: 4,
    adaptability: 5,
    leadership: 3,
    linkedinUrl: "https://linkedin.com/in/david-chen-dev",
    cvAnalysis: {
      experience: "5 years full-stack development",
      seniorityLevel: "Mid-level",
      strengths: ["Full-stack capabilities", "Clean code", "Problem solving"],
      marketPosition: "Versatile developer with broad skill set",
      technicalDepth: "Good balance of frontend and backend skills",
      improvementAreas: ["Leadership experience", "Specialized expertise"]
    }
  },
  {
    id: 7,
    name: "Maria Rodriguez",
    skills: ["Digital Marketing", "SEO", "Google Analytics", "Social Media", "Content Strategy", "PPC", "Email Marketing", "Conversion Optimization"],
    experience: "6 years",
    roles: ["Digital Marketing Specialist", "Growth Marketer", "Marketing Analyst"],
    location: "Göteborg",
    rate: "650 SEK/h",
    availability: "Available",
    phone: "+46 70 789 0123",
    email: "maria.rodriguez@email.com",
    projects: 20,
    rating: 4.6,
    lastActive: "LinkedIn analyzed 1 day ago",
    cv: "Results-driven digital marketer with proven track record of increasing online visibility and conversion rates. Bachelor's in Marketing from Gothenburg University. Led successful campaigns for both B2B and B2C companies, increasing ROI by 200%+ on average.",
    certifications: ["Google Ads Certified", "Google Analytics Individual Qualification", "HubSpot Content Marketing", "Facebook Blueprint Certified"],
    languages: ["Swedish (Fluent)", "English (Fluent)", "Spanish (Native)", "Portuguese (Conversational)"],
    type: 'new',
    communicationStyle: "Results-oriented and data-driven, excellent at presenting campaign performance and insights",
    workStyle: "Creative and analytical, enjoys experimenting with new marketing channels and strategies.",
    values: ["Data-driven decisions", "Creative excellence", "ROI focus", "Brand integrity", "Customer experience"],
    personalityTraits: ["Creative", "Analytical", "Results-driven", "Energetic", "Strategic"],
    teamFit: "Brings energy and fresh perspectives to marketing teams. Great at cross-functional collaboration.",
    culturalFit: 4,
    adaptability: 5,
    leadership: 4,
    linkedinUrl: "https://linkedin.com/in/maria-rodriguez-marketing",
    linkedinAnalysis: {
      communicationStyle: "Energetic and results-focused communication",
      leadershipStyle: "Collaborative leadership with focus on growth",
      culturalFit: 4,
      leadership: 4,
      innovation: 4,
      problemSolving: "Creative and data-driven approach",
      businessAcumen: "Strong understanding of digital marketing ROI",
      teamCollaboration: "Excellent cross-functional marketing collaboration"
    }
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
