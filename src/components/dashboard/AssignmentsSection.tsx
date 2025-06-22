
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Briefcase, Clock, DollarSign, Users, MapPin, Zap, Search } from 'lucide-react';
import { Assignment } from '@/types/consultant';
import { CreateAssignmentForm } from '../CreateAssignmentForm';
import { AIMatchResults } from '../AIMatchResults';
import { useSupabaseConsultantsWithDemo } from '@/hooks/useSupabaseConsultantsWithDemo';
import { generateAIMatches } from '@/utils/aiMatchingEngine';
import { useToast } from '@/components/ui/use-toast';

const demoAssignments: Assignment[] = [
  {
    id: 'assignment-1',
    title: 'Senior React Developer',
    description: 'Vi söker en erfaren React-utvecklare för att bygga vår nya e-handelsplattform.',
    company: 'TechCorp AB',
    clientLogo: '🏢',
    requiredSkills: ['React', 'TypeScript', 'Node.js', 'GraphQL'],
    workload: '100%',
    duration: '6 månader',
    budget: '800-1200 SEK/h',
    remote: 'Hybrid',
    urgency: 'High' as const,
    teamSize: '5-8 personer',
    teamCulture: 'Agil och innovativ',
    industry: 'E-commerce',
    status: 'open' as const,
    createdAt: '2024-01-15',
    startDate: '2024-02-01',
    desiredCommunicationStyle: 'Direkt och strukturerad',
    requiredValues: ['Innovation', 'Kvalitet', 'Teamwork'],
    leadershipLevel: 4,
    teamDynamics: 'Kollaborativ och målinriktad'
  },
  {
    id: 'assignment-2',
    title: 'DevOps Engineer',
    description: 'Behöver hjälp med att automatisera våra deployment-processer och förbättra infrastruktur.',
    company: 'StartupCo',
    clientLogo: '🚀',
    requiredSkills: ['AWS', 'Docker', 'Kubernetes', 'Terraform'],
    workload: '75%',
    duration: '3 månader',
    budget: '900-1300 SEK/h',
    remote: 'Remote',
    urgency: 'Medium' as const,
    teamSize: '3-5 personer',
    teamCulture: 'Snabb och flexibel',
    industry: 'SaaS',
    status: 'open' as const,
    createdAt: '2024-01-10',
    startDate: '2024-01-25',
    desiredCommunicationStyle: 'Informell och snabb',
    requiredValues: ['Flexibilitet', 'Innovation'],
    leadershipLevel: 3,
    teamDynamics: 'Självorganiserande'
  }
];

export const AssignmentsSection: React.FC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showMatchResults, setShowMatchResults] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [matchResults, setMatchResults] = useState<any[]>([]);
  const [isMatching, setIsMatching] = useState(false);
  
  const { consultants } = useSupabaseConsultantsWithDemo();
  const { toast } = useToast();

  const handleStartMatching = async (assignment: Assignment) => {
    console.log('🎯 Starting AI matching for:', assignment.title);
    setSelectedAssignment(assignment);
    setIsMatching(true);
    
    try {
      toast({
        title: "Startar AI-matchning...",
        description: "Analyserar konsulter för det här uppdraget",
      });

      const matches = await generateAIMatches(assignment, consultants);
      
      console.log('✅ AI matching completed:', matches.length, 'matches found');
      
      setMatchResults(matches);
      setShowMatchResults(true);
      
      toast({
        title: "AI-matchning klar!",
        description: `Hittade ${matches.length} matchande konsulter`,
      });
      
    } catch (error) {
      console.error('❌ AI matching error:', error);
      toast({
        title: "Matchning misslyckades",
        description: "Kunde inte genomföra AI-matchning just nu",
        variant: "destructive",
      });
    } finally {
      setIsMatching(false);
    }
  };

  const handleContactConsultant = (consultant: any) => {
    toast({
      title: "Kontaktar konsult",
      description: `Förbereder kontakt med ${consultant.name}`,
    });
    // Implementera kontaktlogik här
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Assignments</h2>
          <p className="text-gray-600">Hantera och matcha uppdrag med konsulter</p>
        </div>
        <Button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Skapa Uppdrag
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Briefcase className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Aktiva Uppdrag</p>
                <p className="text-2xl font-bold">{demoAssignments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Väntande</p>
                <p className="text-2xl font-bold">1</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Matchade</p>
                <p className="text-2xl font-bold">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Avg. Budget</p>
                <p className="text-2xl font-bold">1,000</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Aktuella Uppdrag</h3>
        
        <div className="grid gap-4">
          {demoAssignments.map((assignment) => (
            <Card key={assignment.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{assignment.clientLogo}</div>
                    <div>
                      <h4 className="text-xl font-semibold">{assignment.title}</h4>
                      <p className="text-gray-600">{assignment.company}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{assignment.industry}</Badge>
                        <Badge className={getUrgencyColor(assignment.urgency)}>
                          {assignment.urgency} prioritet
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-green-600">{assignment.budget}</p>
                    <p className="text-sm text-gray-500">{assignment.duration}</p>
                  </div>
                </div>

                <p className="text-gray-700 mb-4 line-clamp-2">{assignment.description}</p>

                {/* Assignment Details */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{assignment.workload}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{assignment.remote}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{assignment.teamSize}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Startar {assignment.startDate}</span>
                  </div>
                </div>

                {/* Required Skills */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Krävda färdigheter:</p>
                  <div className="flex flex-wrap gap-1">
                    {assignment.requiredSkills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Cultural Requirements */}
                {assignment.requiredValues && assignment.requiredValues.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Önskade värderingar:</p>
                    <div className="flex flex-wrap gap-1">
                      {assignment.requiredValues.map((value, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {value}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    onClick={() => handleStartMatching(assignment)}
                    disabled={isMatching}
                    className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
                  >
                    <Zap className="h-4 w-4" />
                    {isMatching ? 'Matchar...' : 'AI Matchning'}
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    Visa Detaljer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Create Assignment Dialog */}
      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Skapa Nytt Uppdrag</DialogTitle>
          </DialogHeader>
          <CreateAssignmentForm onClose={() => setShowCreateForm(false)} />
        </DialogContent>
      </Dialog>

      {/* AI Match Results */}
      {showMatchResults && selectedAssignment && (
        <AIMatchResults
          assignment={selectedAssignment}
          matches={matchResults}
          onClose={() => setShowMatchResults(false)}
          onContactConsultant={handleContactConsultant}
        />
      )}
    </div>
  );
};
