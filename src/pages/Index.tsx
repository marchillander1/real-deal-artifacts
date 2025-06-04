import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Dashboard from "@/components/Dashboard";
import ConsultantsTab from "@/components/ConsultantsTab";
import { Assignment, Consultant, Match } from "../types/consultant";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";
import Logo from '../components/Logo';

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
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    // Load data from localStorage on component mount, or use initial data
    const storedConsultants = localStorage.getItem("consultants");
    const storedAssignments = localStorage.getItem("assignments");
    const storedMatches = localStorage.getItem("matches");

    if (storedConsultants) {
      setConsultants(JSON.parse(storedConsultants));
    } else {
      setConsultants(initialConsultants);
    }
    
    if (storedAssignments) {
      setAssignments(JSON.parse(storedAssignments));
    } else {
      setAssignments(initialAssignments);
    }
    
    if (storedMatches) {
      setMatches(JSON.parse(storedMatches));
    }
  }, []);

  useEffect(() => {
    // Update localStorage whenever consultants or assignments change
    localStorage.setItem("consultants", JSON.stringify(consultants));
    localStorage.setItem("assignments", JSON.stringify(assignments));
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
          // Basic parsing logic - improve this based on your CV format
          const newConsultant: Consultant = {
            id: Date.now(), // Changed to number
            name: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
            skills: [text.substring(0, 200)], // Changed to array
            experience: Math.floor(Math.random() * 10).toString(), // Changed to string
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

  // Split consultants by type
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
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {assignments.map((assignment) => (
                <div key={assignment.id} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-all">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{assignment.title}</h3>
                  <p className="text-gray-600 mb-4">{assignment.description}</p>
                  <div className="flex items-center space-x-2 text-gray-500">
                    <span>Skills:</span>
                    <span>{assignment.requiredSkills.join(', ')}</span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Toaster />
    </div>
  );
};

export default Index;
