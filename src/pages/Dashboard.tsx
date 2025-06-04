
import React, { useState } from 'react';
import { Users, Briefcase, Target, TrendingUp, Upload, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ConsultantsTab from '../components/ConsultantsTab';
import CreateAssignmentForm from '../components/CreateAssignmentForm';
import { useConsultants } from '../hooks/useConsultants';
import { Consultant, Assignment } from '../types/consultant';
import { useToast } from "@/hooks/use-toast";

const DashboardPage = () => {
  const { consultants, isProcessing, uploadCV } = useConsultants();
  const { toast } = useToast();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: 1,
      title: 'React Developer',
      description: 'Frontend developer for e-commerce project',
      requiredSkills: ['React', 'TypeScript'],
      duration: '6 months',
      startDate: '2024-07-01',
      workload: 'Full-time',
      budget: '800-1000 SEK/hour',
      company: 'TechCorp AB',
      industry: 'E-commerce',
      teamSize: '8 people',
      remote: 'Hybrid',
      urgency: 'Medium',
      clientLogo: '🛍️',
      desiredCommunicationStyle: 'Collaborative and direct',
      teamCulture: 'Agile, innovation-focused',
      requiredValues: ['Innovation', 'Quality'],
      leadershipLevel: 3,
      teamDynamics: 'Cross-functional team'
    },
    {
      id: 2,
      title: 'UX Designer',
      description: 'Design user-friendly mobile app',
      requiredSkills: ['UX Design', 'Prototyping'],
      duration: '3 months',
      startDate: '2024-06-15',
      workload: 'Part-time',
      budget: '600-800 SEK/hour',
      company: 'DesignStudio',
      industry: 'Mobile Apps',
      teamSize: '5 people',
      remote: 'Remote',
      urgency: 'High',
      clientLogo: '🎨',
      desiredCommunicationStyle: 'Creative and collaborative',
      teamCulture: 'Design-focused, flexible',
      requiredValues: ['Creativity', 'User Focus'],
      leadershipLevel: 2,
      teamDynamics: 'Small design team'
    }
  ]);

  const handleMatch = (assignment: Assignment) => {
    console.log('Matching assignment:', assignment);
    toast({
      title: "AI Matching Started",
      description: "Finding the best consultants for this assignment...",
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await uploadCV(file);
        toast({
          title: "CV Uploaded Successfully",
          description: "The consultant has been added to the database.",
        });
      } catch (error) {
        toast({
          title: "Upload Failed",
          description: "There was an error uploading the CV.",
          variant: "destructive",
        });
      }
    }
  };

  const handleAssignmentCreated = (newAssignment: Assignment) => {
    const assignmentWithId = {
      ...newAssignment,
      id: Date.now(),
    };
    setAssignments(prev => [...prev, assignmentWithId]);
    setShowCreateForm(false);
    toast({
      title: "Assignment Created",
      description: "New assignment has been added successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI-Driven Consultant Matching Platform
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Match consultants with assignments using advanced AI that analyzes both technical skills and soft factors
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Consultants</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{consultants.length}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +2 this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Assignments</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{assignments.length}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +1 today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Successful Matches</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                95% success rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Match Time</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12s</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                67% faster
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="consultants" className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <TabsList className="grid w-full sm:w-auto grid-cols-2">
              <TabsTrigger value="consultants">Consultants</TabsTrigger>
              <TabsTrigger value="assignments">Assignments</TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2">
              <Button 
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Briefcase className="h-4 w-4 mr-2" />
                New Assignment
              </Button>
              
              <div className="relative">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isProcessing}
                />
                <Button 
                  variant="outline"
                  disabled={isProcessing}
                  className="relative"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {isProcessing ? 'Processing...' : 'Upload CV'}
                </Button>
              </div>
            </div>
          </div>

          <TabsContent value="consultants" className="space-y-6">
            <ConsultantsTab consultants={consultants} />
          </TabsContent>

          <TabsContent value="assignments" className="space-y-6">
            <div className="grid gap-6">
              {assignments.map((assignment) => (
                <Card key={assignment.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{assignment.title}</CardTitle>
                        <p className="text-gray-600 mt-2">{assignment.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl mb-2">{assignment.clientLogo}</div>
                        <p className="font-semibold text-gray-900">{assignment.company}</p>
                        <p className="text-sm text-gray-500">{assignment.industry}</p>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Required Skills</h4>
                          <div className="flex flex-wrap gap-2">
                            {assignment.requiredSkills.map((skill, index) => (
                              <Badge key={index} variant="secondary">{skill}</Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">Assignment Details</h4>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p><strong>Duration:</strong> {assignment.duration}</p>
                            <p><strong>Start Date:</strong> {assignment.startDate}</p>
                            <p><strong>Workload:</strong> {assignment.workload}</p>
                            <p><strong>Budget:</strong> {assignment.budget}</p>
                            <p><strong>Remote:</strong> {assignment.remote}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Team & Culture</h4>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p><strong>Team Size:</strong> {assignment.teamSize}</p>
                            <p><strong>Team Culture:</strong> {assignment.teamCulture}</p>
                            <p><strong>Communication Style:</strong> {assignment.desiredCommunicationStyle}</p>
                            <p><strong>Leadership Level:</strong> {assignment.leadershipLevel}/5</p>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">Required Values</h4>
                          <div className="flex flex-wrap gap-2">
                            {assignment.requiredValues.map((value, index) => (
                              <Badge key={index} variant="outline">{value}</Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex gap-2 pt-4">
                          <Button 
                            onClick={() => handleMatch(assignment)}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          >
                            <Target className="h-4 w-4 mr-2" />
                            Find AI Match
                          </Button>
                          <Badge 
                            variant={assignment.urgency === 'High' ? 'destructive' : assignment.urgency === 'Medium' ? 'default' : 'secondary'}
                          >
                            {assignment.urgency}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Create Assignment Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <CreateAssignmentForm
                onAssignmentCreated={handleAssignmentCreated}
                onCancel={() => setShowCreateForm(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
