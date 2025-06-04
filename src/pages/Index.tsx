
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Dashboard from "@/components/Dashboard";
import ConsultantsTab from "@/components/ConsultantsTab";
import { Assignment, Consultant, Match } from "../types/consultant";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";
import Logo from '../components/Logo';

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    // Load data from localStorage on component mount
    const storedConsultants = localStorage.getItem("consultants");
    const storedAssignments = localStorage.getItem("assignments");
    const storedMatches = localStorage.getItem("matches");

    if (storedConsultants) {
      setConsultants(JSON.parse(storedConsultants));
    }
    if (storedAssignments) {
      setAssignments(JSON.parse(storedAssignments));
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
