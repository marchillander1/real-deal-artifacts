
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Upload, Users, TrendingUp, Clock, Plus, Search, Filter, 
  FileText, Star, MapPin, Calendar, DollarSign, User,
  Brain, Mail, Eye, Award, Bell, Briefcase
} from "lucide-react";
import { useSupabaseConsultantsWithDemo } from "@/hooks/useSupabaseConsultantsWithDemo";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ConsultantAnalysisModal } from "@/components/ConsultantAnalysisModal";
import { Consultant } from "@/types/consultant";
import { Assignment } from "@/types/consultant";
import { useToast } from "@/hooks/use-toast";

const MatchWiseAI: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'consultants' | 'assignments'>('dashboard');
  const [consultantSubTab, setConsultantSubTab] = useState<'my-consultants' | 'network'>('my-consultants');
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('');
  const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [showCreateAssignment, setShowCreateAssignment] = useState(false);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [matchResults, setMatchResults] = useState<any[]>([]);
  const [showMatchResults, setShowMatchResults] = useState(false);

  const { consultants, isLoading } = useSupabaseConsultantsWithDemo();
  const { toast } = useToast();

  // Fetch matches data for dashboard stats
  const { data: matchesData = [] } = useQuery({
    queryKey: ['matches'],
    queryFn: async () => {
      const { data, error } = await supabase.from('matches').select('*');
      if (error) {
        console.error('Error fetching matches:', error);
        return [];
      }
      return data || [];
    },
  });

  // Separate consultants by type
  const myConsultants = consultants.filter(c => c.type === 'existing');
  const networkConsultants = consultants.filter(c => c.type === 'new');
  const totalConsultants = consultants.length;
  const successfulMatches = matchesData.filter(match => match.status === 'accepted').length;

  // Filter consultants based on search and filters
  const filterConsultants = (consultantList: Consultant[]) => {
    return consultantList.filter(consultant => {
      const matchesSearch = consultant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           consultant.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesSkill = !skillFilter || consultant.skills.some(skill => 
        skill.toLowerCase().includes(skillFilter.toLowerCase())
      );
      const matchesAvailability = !availabilityFilter || consultant.availability.includes(availabilityFilter);
      return matchesSearch && matchesSkill && matchesAvailability;
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      window.location.href = '/cv-upload?source=my-consultants';
    }
  };

  const handleViewAnalysis = (consultant: Consultant) => {
    setSelectedConsultant(consultant);
    setShowAnalysisModal(true);
  };

  const handleCreateAssignment = (assignmentData: any) => {
    const newAssignment: Assignment = {
      id: Math.random().toString(),
      ...assignmentData,
      status: 'open',
      createdAt: new Date().toISOString()
    };
    setAssignments([...assignments, newAssignment]);
    setShowCreateAssignment(false);
    
    // Trigger AI matching
    handleAIMatching(newAssignment);
    
    toast({
      title: "Assignment Created",
      description: "AI matching has been initiated for your new assignment",
    });
  };

  const handleAIMatching = (assignment: Assignment) => {
    // Mock AI matching results with realistic data
    const mockResults = consultants
      .filter(consultant => {
        // Basic matching logic
        const hasRequiredSkills = assignment.required_skills?.some(skill => 
          consultant.skills.some(consultantSkill => 
            consultantSkill.toLowerCase().includes(skill.toLowerCase())
          )
        );
        return hasRequiredSkills;
      })
      .slice(0, 3)
      .map(consultant => ({
        consultant,
        technicalFit: Math.floor(Math.random() * 30) + 70, // 70-100
        culturalFit: Math.floor(Math.random() * 30) + 70,
        overallMatch: Math.floor(Math.random() * 25) + 75,
        matchLetter: generateMatchLetter(consultant, assignment),
        estimatedSavings: Math.floor(Math.random() * 50000) + 30000,
        responseTime: Math.floor(Math.random() * 20) + 5
      }));

    setMatchResults(mockResults);
    setShowMatchResults(true);
  };

  const generateMatchLetter = (consultant: Consultant, assignment: Assignment) => {
    return `Based on your assignment "${assignment.title}", ${consultant.name} appears to be a highly relevant match.

**Technical Fit**
• Core skills: ${consultant.skills.slice(0, 3).join(', ')}
• Experience: ${consultant.experience}
• Rating: ${consultant.rating}/5.0

**Cultural Fit**
• Communication style: ${consultant.communicationStyle}
• Work style: ${consultant.workStyle}
• Team fit: ${consultant.teamFit}/5

**Match Score**
• Technical: ${Math.floor(Math.random() * 30) + 70}%
• Cultural: ${Math.floor(Math.random() * 30) + 70}%
• Availability: ${consultant.availability}

We recommend proceeding with this consultant.`;
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Consultants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalConsultants}</div>
            <p className="text-xs text-muted-foreground">
              My: {myConsultants.length}, Network: {networkConsultants.length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Successful Matches</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{successfulMatches}</div>
            <p className="text-xs text-muted-foreground">
              +{Math.max(1, Math.floor(successfulMatches * 0.1))} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Match Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12 seconds</div>
            <p className="text-xs text-muted-foreground">67% faster</p>
          </CardContent>
        </Card>
      </div>

      {/* Main CTA */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold">Ready to find the perfect consultant?</h3>
            <p className="text-gray-600">Create a new assignment and let AI match you with the best candidates</p>
            <Button 
              onClick={() => setShowCreateAssignment(true)}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Assignment
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Activity & Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {networkConsultants.length > 0 && (
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-blue-900">
                    {networkConsultants.length} new consultants available in network
                  </p>
                  <p className="text-sm text-blue-700">
                    Review their profiles to find potential matches
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setActiveTab('consultants');
                    setConsultantSubTab('network');
                  }}
                >
                  View
                </Button>
              </div>
            )}
            
            {myConsultants.length > 0 && (
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-green-900">
                    {myConsultants.length} consultants in your team
                  </p>
                  <p className="text-sm text-green-700">
                    Ready for new assignments
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setActiveTab('consultants');
                    setConsultantSubTab('my-consultants');
                  }}
                >
                  Manage
                </Button>
              </div>
            )}

            {consultants.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No activity yet. Upload some consultants to get started!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderConsultants = () => (
    <div className="space-y-6">
      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search and Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Search</Label>
              <Input
                placeholder="Name or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Label>Skill Filter</Label>
              <Input
                placeholder="Filter by skill..."
                value={skillFilter}
                onChange={(e) => setSkillFilter(e.target.value)}
              />
            </div>
            <div>
              <Label>Availability</Label>
              <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All</SelectItem>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Partially Available">Partially Available</SelectItem>
                  <SelectItem value="From">Available From Date</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" onClick={() => {
                setSearchTerm('');
                setSkillFilter('');
                setAvailabilityFilter('');
              }}>
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Consultant Subtabs */}
      <Tabs value={consultantSubTab} onValueChange={(value: any) => setConsultantSubTab(value)}>
        <div className="flex justify-between items-center">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="my-consultants">
              My Consultants ({myConsultants.length})
            </TabsTrigger>
            <TabsTrigger value="network">
              Network Consultants ({networkConsultants.length})
            </TabsTrigger>
          </TabsList>
          
          {consultantSubTab === 'my-consultants' && (
            <div className="relative">
              <Button className="bg-green-600 hover:bg-green-700 flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload CV
              </Button>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          )}
        </div>

        <TabsContent value="my-consultants" className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">My Consultants</h3>
            <p className="text-sm text-gray-600">Consultants uploaded by your company</p>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filterConsultants(myConsultants).map((consultant) => (
              <ConsultantCard 
                key={consultant.id} 
                consultant={consultant} 
                onViewAnalysis={handleViewAnalysis}
                isMyConsultant={true}
              />
            ))}
          </div>

          {myConsultants.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No consultants yet</h3>
              <p className="text-gray-600 mb-4">Upload CVs to build your consultant team</p>
              <div className="relative inline-block">
                <Button className="bg-green-600 hover:bg-green-700">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload First CV
                </Button>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="network" className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Network Consultants</h3>
            <p className="text-sm text-gray-600">
              Consultants available from the MatchWise network (includes those from /cv-upload)
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filterConsultants(networkConsultants).map((consultant) => (
              <ConsultantCard 
                key={consultant.id} 
                consultant={consultant} 
                onViewAnalysis={handleViewAnalysis}
                isMyConsultant={false}
              />
            ))}
          </div>

          {networkConsultants.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No network consultants available yet</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );

  const renderAssignments = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Assignments</h2>
          <p className="text-gray-600">Create and manage your assignment requirements</p>
        </div>
        <Button 
          onClick={() => setShowCreateAssignment(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Assignment
        </Button>
      </div>

      {/* Assignments List */}
      <div className="grid gap-4">
        {assignments.map((assignment) => (
          <Card key={assignment.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{assignment.title}</h3>
                  <p className="text-gray-600 mb-2">{assignment.company}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {assignment.required_skills?.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{assignment.description}</p>
                </div>
                <div className="text-right">
                  <Badge variant={assignment.status === 'open' ? 'default' : 'secondary'}>
                    {assignment.status}
                  </Badge>
                  <p className="text-sm text-gray-500 mt-2">
                    Created {new Date(assignment.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {assignments.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments yet</h3>
          <p className="text-gray-600 mb-4">Create your first assignment to start matching</p>
          <Button 
            onClick={() => setShowCreateAssignment(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create First Assignment
          </Button>
        </div>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">MatchWise AI Platform</h1>
          <p className="text-gray-600 mt-1">
            Match consultants with assignments using advanced AI that analyzes both technical skills and soft factors
          </p>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="consultants">Consultants</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            {renderDashboard()}
          </TabsContent>

          <TabsContent value="consultants">
            {renderConsultants()}
          </TabsContent>

          <TabsContent value="assignments">
            {renderAssignments()}
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Assignment Modal */}
      {showCreateAssignment && (
        <CreateAssignmentModal
          onClose={() => setShowCreateAssignment(false)}
          onSubmit={handleCreateAssignment}
        />
      )}

      {/* AI Match Results Modal */}
      {showMatchResults && (
        <AIMatchResultsModal
          results={matchResults}
          onClose={() => setShowMatchResults(false)}
        />
      )}

      {/* Analysis Modal */}
      {selectedConsultant && (
        <ConsultantAnalysisModal
          consultant={selectedConsultant}
          isOpen={showAnalysisModal}
          onClose={() => setShowAnalysisModal(false)}
        />
      )}
    </div>
  );
};

// Consultant Card Component
interface ConsultantCardProps {
  consultant: Consultant;
  onViewAnalysis: (consultant: Consultant) => void;
  isMyConsultant: boolean;
}

const ConsultantCard: React.FC<ConsultantCardProps> = ({ consultant, onViewAnalysis, isMyConsultant }) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getStatusColor = (availability: string) => {
    if (availability.includes('Available')) return 'bg-green-100 text-green-800';
    if (availability.includes('From')) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  const hasAnalysisData = consultant.cvAnalysis || consultant.linkedinAnalysis;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3 mb-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {getInitials(consultant.name)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate">{consultant.name}</h3>
            <p className="text-xs text-gray-600 truncate">{consultant.roles?.[0] || 'Consultant'}</p>
            <div className="flex items-center space-x-1 mt-1">
              <Badge variant="outline" className="text-xs">
                {isMyConsultant ? 'My Team' : 'Network'}
              </Badge>
              {hasAnalysisData && (
                <Badge variant="outline" className="text-xs text-purple-600">
                  <Brain className="h-3 w-3 mr-1" />
                  AI
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center">
            <Star className="h-3 w-3 text-yellow-400 fill-current" />
            <span className="text-xs ml-1">{consultant.rating}</span>
          </div>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-600">Experience:</span>
            <span>{consultant.experience.replace(' experience', '')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Rate:</span>
            <span className="text-green-600 font-medium">{consultant.rate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Location:</span>
            <span>{consultant.location}</span>
          </div>
        </div>

        <div className="mt-3">
          <Badge className={getStatusColor(consultant.availability)} variant="secondary">
            {consultant.availability}
          </Badge>
        </div>

        <div className="mt-3">
          <p className="text-xs font-medium text-gray-700 mb-1">Top Skills:</p>
          <div className="flex flex-wrap gap-1">
            {consultant.skills.slice(0, 3).map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {consultant.skills.length > 3 && (
              <Badge variant="secondary" className="text-xs text-gray-600">
                +{consultant.skills.length - 3}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center mt-4 pt-3 border-t">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onViewAnalysis(consultant)}
            className="text-xs"
          >
            <Eye className="h-3 w-3 mr-1" />
            View Analysis
          </Button>
          <Button variant="outline" size="sm" className="text-xs">
            <Mail className="h-3 w-3 mr-1" />
            Contact
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Create Assignment Modal Component
interface CreateAssignmentModalProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const CreateAssignmentModal: React.FC<CreateAssignmentModalProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    required_skills: [] as string[],
    team_culture: '',
    communication_style: '',
    required_values: [] as string[],
    start_date: '',
    duration: '',
    workload: '',
    budget_min: '',
    budget_max: '',
    industry: '',
    team_size: '',
    remote_type: '',
    urgency: 'Medium'
  });

  const [currentSkill, setCurrentSkill] = useState('');
  const [currentValue, setCurrentValue] = useState('');

  const addSkill = () => {
    if (currentSkill.trim() && !formData.required_skills.includes(currentSkill.trim())) {
      setFormData({
        ...formData,
        required_skills: [...formData.required_skills, currentSkill.trim()]
      });
      setCurrentSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({
      ...formData,
      required_skills: formData.required_skills.filter(s => s !== skill)
    });
  };

  const addValue = () => {
    if (currentValue.trim() && !formData.required_values.includes(currentValue.trim())) {
      setFormData({
        ...formData,
        required_values: [...formData.required_values, currentValue.trim()]
      });
      setCurrentValue('');
    }
  };

  const removeValue = (value: string) => {
    setFormData({
      ...formData,
      required_values: formData.required_values.filter(v => v !== value)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Create New Assignment</h2>
            <Button variant="ghost" onClick={onClose}>✕</Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Title *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g., Senior Frontend Developer"
                    required
                  />
                </div>
                <div>
                  <Label>Company *</Label>
                  <Input
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    placeholder="e.g., Spotify"
                    required
                  />
                </div>
              </div>
              <div>
                <Label>Description *</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Detailed description of the role and responsibilities..."
                  rows={4}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Technical Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>Technical Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Required Skills</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={currentSkill}
                    onChange={(e) => setCurrentSkill(e.target.value)}
                    placeholder="Add a skill..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  />
                  <Button type="button" onClick={addSkill} variant="outline">Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.required_skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeSkill(skill)}>
                      {skill} ✕
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <Label>Industry</Label>
                <Input
                  value={formData.industry}
                  onChange={(e) => setFormData({...formData, industry: e.target.value})}
                  placeholder="e.g., Fintech, E-commerce"
                />
              </div>
            </CardContent>
          </Card>

          {/* Cultural Fit */}
          <Card>
            <CardHeader>
              <CardTitle>Cultural Fit</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Team Culture</Label>
                  <Select value={formData.team_culture} onValueChange={(value) => setFormData({...formData, team_culture: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select team culture" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="collaborative">Collaborative</SelectItem>
                      <SelectItem value="autonomous">Autonomous</SelectItem>
                      <SelectItem value="fast-paced">Fast-paced</SelectItem>
                      <SelectItem value="structured">Structured</SelectItem>
                      <SelectItem value="innovative">Innovative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Communication Style</Label>
                  <Select value={formData.communication_style} onValueChange={(value) => setFormData({...formData, communication_style: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="direct">Direct</SelectItem>
                      <SelectItem value="diplomatic">Diplomatic</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="formal">Formal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Required Values</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={currentValue}
                    onChange={(e) => setCurrentValue(e.target.value)}
                    placeholder="Add a value..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addValue())}
                  />
                  <Button type="button" onClick={addValue} variant="outline">Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.required_values.map((value, index) => (
                    <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeValue(value)}>
                      {value} ✕
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project Details */}
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Duration</Label>
                  <Select value={formData.duration} onValueChange={(value) => setFormData({...formData, duration: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-3 months">1-3 months</SelectItem>
                      <SelectItem value="3-6 months">3-6 months</SelectItem>
                      <SelectItem value="6-12 months">6-12 months</SelectItem>
                      <SelectItem value="12+ months">12+ months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Workload</Label>
                  <Select value={formData.workload} onValueChange={(value) => setFormData({...formData, workload: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select workload" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="100%">100%</SelectItem>
                      <SelectItem value="75%">75%</SelectItem>
                      <SelectItem value="50%">50%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Budget Range (SEK/hour)</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={formData.budget_min}
                      onChange={(e) => setFormData({...formData, budget_min: e.target.value})}
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={formData.budget_max}
                      onChange={(e) => setFormData({...formData, budget_max: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label>Team Size</Label>
                  <Input
                    value={formData.team_size}
                    onChange={(e) => setFormData({...formData, team_size: e.target.value})}
                    placeholder="e.g., 5-10 people"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Remote Work</Label>
                  <Select value={formData.remote_type} onValueChange={(value) => setFormData({...formData, remote_type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select remote type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fully-remote">Fully Remote</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                      <SelectItem value="on-site">On-site</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Urgency</Label>
                  <Select value={formData.urgency} onValueChange={(value) => setFormData({...formData, urgency: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select urgency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Create Assignment & Start AI Matching
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// AI Match Results Modal Component
interface AIMatchResultsModalProps {
  results: any[];
  onClose: () => void;
}

const AIMatchResultsModal: React.FC<AIMatchResultsModalProps> = ({ results, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">AI Match Results</h2>
            <Button variant="ghost" onClick={onClose}>✕</Button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid gap-6">
            {results.map((result, index) => (
              <Card key={index} className="border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                          {result.consultant.name.split(' ').map((n: string) => n[0]).join('')}
                        </div>
                        <div>
                          <h3 className="font-semibold">{result.consultant.name}</h3>
                          <p className="text-sm text-gray-600">{result.consultant.roles?.[0]}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Technical Fit:</span>
                          <span className="font-semibold text-blue-600">{result.technicalFit}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Cultural Fit:</span>
                          <span className="font-semibold text-green-600">{result.culturalFit}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Overall Match:</span>
                          <span className="font-bold text-purple-600">{result.overallMatch}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Est. Savings:</span>
                          <span className="font-semibold text-green-600">{result.estimatedSavings} SEK</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Response Time:</span>
                          <span className="font-semibold">{result.responseTime} min</span>
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <h4 className="font-semibold mb-2">AI Match Letter</h4>
                      <div className="bg-gray-50 p-4 rounded-lg text-sm whitespace-pre-line">
                        {result.matchLetter}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                    <Button variant="outline">
                      <User className="h-4 w-4 mr-2" />
                      View Profile
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Mail className="h-4 w-4 mr-2" />
                      Contact Consultant
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {results.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600">No matches found for this assignment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchWiseAI;
