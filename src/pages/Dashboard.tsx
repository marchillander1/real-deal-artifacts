

import React, { useState } from "react";
import { Assignment } from "../types/consultant";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Users, Briefcase, TrendingUp, Clock, Check, FileDown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreateAssignmentForm from "@/components/CreateAssignmentForm";
import { useSupabaseConsultants } from "@/hooks/useSupabaseConsultants";
import { Navbar } from "@/components/Navbar";
import { EnhancedConsultantsTab } from "@/components/EnhancedConsultantsTab";
import Dashboard from "@/components/Dashboard";
import { useToast } from "@/hooks/use-toast";
import { usePDFExport } from "@/hooks/usePDFExport";
import { StripeCheckout } from "@/components/StripeCheckout";

const initialAssignments: Assignment[] = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "Acme Corp",
    description: "We need a skilled frontend developer to join our team.",
    requiredSkills: ["React", "TypeScript", "JavaScript", "HTML", "CSS"],
    startDate: "2024-01-15",
    duration: "6 months",
    workload: "Full-time",
    budget: "50000-70000 SEK",
    industry: "Tech",
    teamSize: "5-10",
    remote: "Hybrid",
    urgency: "High",
    clientLogo: "🏢"
  },
  {
    id: 2,
    title: "Backend Engineer",
    company: "Beta Co",
    description: "Looking for a backend engineer with experience in Node.js.",
    requiredSkills: ["Node.js", "Express", "PostgreSQL", "JavaScript"],
    startDate: "2024-02-01",
    duration: "3 months",
    workload: "Full-time",
    budget: "40000-60000 SEK",
    industry: "Finance",
    teamSize: "3-5",
    remote: "Remote",
    urgency: "Medium",
    clientLogo: "🏦"
  },
];

export default function DashboardPage() {
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [matches, setMatches] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [activeTab, setActiveTab] = React.useState("dashboard");
  const { toast } = useToast();
  const { consultants } = useSupabaseConsultants();

  const { exportMatchesToPDF, exportConsultantListToPDF } = usePDFExport();

  const handleMatch = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setMatches([
      {
        consultant: {
          id: "1",
          name: "John Doe",
          email: "john.doe@example.com",
          skills: ["React", "TypeScript", "JavaScript", "HTML", "CSS"],
          hourly_rate: 750,
          location: "Stockholm",
          experience_years: 5,
        },
        score: 95,
        matchedSkills: ["React", "TypeScript", "JavaScript"],
        estimatedSavings: 10000,
        responseTime: 5,
        humanFactorsScore: 80,
        culturalMatch: 90,
        communicationMatch: 85,
        valuesAlignment: 92,
      },
    ]);
    setActiveTab("consultants");
  };

  const handleAssignmentCreated = (assignment: Assignment) => {
    setAssignments([...assignments, assignment]);
    toast({
      title: "Uppdrag skapat!",
      description: "Ett nytt uppdrag har skapats.",
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        toast({
          title: "Filuppladdning startad",
          description: "Din CV laddas upp och analyseras.",
        });
      } catch (error) {
        toast({
          title: "Fel vid filuppladdning",
          description: "Kunde inte ladda upp filen. Försök igen.",
          variant: "destructive",
        });
      }
    }
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

  const handleFindMatches = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setMatches([
      {
        consultant: {
          id: "1",
          name: "John Doe",
          email: "john.doe@example.com",
          skills: ["React", "TypeScript", "JavaScript", "HTML", "CSS"],
          hourly_rate: 750,
          location: "Stockholm",
          experience_years: 5,
        },
        score: 95,
        matchedSkills: ["React", "TypeScript", "JavaScript"],
        estimatedSavings: 10000,
        responseTime: 5,
        humanFactorsScore: 80,
        culturalMatch: 90,
        communicationMatch: 85,
        valuesAlignment: 92,
      },
    ]);
    setActiveTab("consultants");
  };

  const handleSelectMatch = (match: any) => {
    console.log("Selected match:", match);
  };

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
            <TabsTrigger value="pricing">Prenumeration</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard
              assignments={assignments}
              onMatch={handleMatch}
              onAssignmentCreated={handleAssignmentCreated}
              onFileUpload={handleFileUpload}
            />
          </TabsContent>

          <TabsContent value="consultants">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Konsulter</h2>
                <Button onClick={handleExportConsultants} variant="outline">
                  <FileDown className="h-4 w-4 mr-2" />
                  Exportera PDF
                </Button>
              </div>
              <EnhancedConsultantsTab />
            </div>
          </TabsContent>

          <TabsContent value="assignments">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Uppdrag</h2>
                <Button onClick={() => setActiveTab("dashboard")} variant="outline">
                  <Briefcase className="h-4 w-4 mr-2" />
                  Nytt Uppdrag
                </Button>
              </div>
              <ul className="space-y-2">
                {assignments.map((assignment) => (
                  <li key={assignment.id} className="border rounded-md p-4">
                    <h3 className="text-lg font-semibold">{assignment.title}</h3>
                    <p className="text-gray-600">{assignment.company}</p>
                    <p className="text-sm mt-2">{assignment.description}</p>
                    <div className="flex items-center space-x-2 mt-4">
                      {assignment.requiredSkills?.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    <Button
                      onClick={() => handleFindMatches(assignment)}
                      className="mt-4 bg-blue-600 hover:bg-blue-700"
                    >
                      Hitta Matchningar
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="pricing">
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Välj din plan</h2>
                <p className="text-lg text-gray-600">Uppgradera för att få tillgång till avancerade funktioner</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                <StripeCheckout
                  planName="Basic"
                  price={499}
                  features={[
                    'Upp till 10 konsulter',
                    'Grundläggande AI-matchning',
                    'Export till PDF',
                    'Email support'
                  ]}
                />
                <StripeCheckout
                  planName="Premium"
                  price={999}
                  features={[
                    'Upp till 50 konsulter',
                    'Avancerad AI-matchning',
                    'Kalenderintegration',
                    'Prioriterat support',
                    'Analytics dashboard'
                  ]}
                />
                <StripeCheckout
                  planName="Enterprise"
                  price={1999}
                  features={[
                    'Obegränsat antal konsulter',
                    'Anpassad AI-matchning',
                    'API-åtkomst',
                    'Dedikerat support',
                    'Custom integrations'
                  ]}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
