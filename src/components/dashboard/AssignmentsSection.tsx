import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Briefcase, Brain, Calendar, MapPin, Users, DollarSign, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useDemoAssignments } from '@/hooks/useDemoAssignments';
import { useAiMatching } from '@/hooks/useAiMatching';
import { Assignment } from '@/types/consultant';

export const AssignmentsSection: React.FC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [matchingResults, setMatchingResults] = useState<any>(null);
  const { assignments, addAssignment } = useDemoAssignments();
  const { performAiMatching, isMatching } = useAiMatching();
  const { toast } = useToast();

  const handleAIMatch = async (assignment: any) => {
    try {
      const results = await performAiMatching(assignment);
      setMatchingResults(results);
    } catch (error) {
      toast({
        title: "Matching failed",
        description: "Unable to find matches at the moment",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Assignments</h2>
          <p className="text-gray-600">Create and manage consultant assignments</p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Assignment
        </Button>
      </div>

      {/* Assignments List */}
      <div className="grid gap-6">
        {assignments.map((assignment) => (
          <AssignmentCard 
            key={assignment.id} 
            assignment={assignment} 
            onMatch={handleAIMatch}
            isMatching={isMatching}
          />
        ))}
        
        {assignments.length === 0 && (
          <div className="text-center py-12">
            <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments yet</h3>
            <p className="text-gray-600 mb-4">Create your first assignment to start finding matches</p>
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Create First Assignment
            </Button>
          </div>
        )}
      </div>

      {/* Create Assignment Form */}
      {showCreateForm && (
        <CreateAssignmentForm
          onSubmit={(assignment) => {
            addAssignment(assignment);
            setShowCreateForm(false);
            toast({
              title: "Assignment created",
              description: "Your new assignment is ready for matching",
            });
          }}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {/* Matching Results Modal */}
      {matchingResults && (
        <MatchingResultsModal
          results={matchingResults}
          onClose={() => setMatchingResults(null)}
        />
      )}
    </div>
  );
};

interface AssignmentCardProps {
  assignment: any;
  onMatch: (assignment: any) => void;
  isMatching: boolean;
}

const AssignmentCard: React.FC<AssignmentCardProps> = ({ assignment, onMatch, isMatching }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{assignment.title}</CardTitle>
            <p className="text-gray-600 mt-1">{assignment.company}</p>
          </div>
          <Badge 
            className={
              assignment.urgency === 'High' ? 'bg-red-100 text-red-800' :
              assignment.urgency === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }
          >
            {assignment.urgency} Priority
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-gray-700">{assignment.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span>{assignment.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-gray-500" />
              <span>{assignment.budget}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span>{assignment.remote}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-500" />
              <span>{assignment.teamSize}</span>
            </div>
          </div>

          <div>
            <p className="font-medium text-gray-700 mb-2">Required Skills</p>
            <div className="flex flex-wrap gap-1">
              {assignment.requiredSkills?.map((skill: string, idx: number) => (
                <Badge key={idx} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-gray-500">
              Created {assignment.createdAt}
            </div>
            <Button 
              onClick={() => onMatch(assignment)}
              disabled={isMatching}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Brain className="h-4 w-4 mr-2" />
              {isMatching ? 'Matching...' : 'AI Match'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const CreateAssignmentForm: React.FC<{onSubmit: (assignment: any) => void; onCancel: () => void}> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requiredSkills: '',
    startDate: '',
    duration: '',
    workload: '',
    budget: '',
    company: '',
    industry: '',
    teamSize: '',
    remote: '',
    urgency: '' as 'Low' | 'Medium' | 'High' | '',
    teamCulture: '',
    desiredCommunicationStyle: '',
    requiredValues: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.requiredSkills) {
      return;
    }

    const newAssignment: Assignment = {
      id: Date.now(),
      title: formData.title,
      description: formData.description,
      requiredSkills: formData.requiredSkills.split(',').map(skill => skill.trim()).filter(skill => skill),
      startDate: formData.startDate,
      duration: formData.duration,
      workload: formData.workload,
      budget: formData.budget,
      company: formData.company,
      industry: formData.industry,
      teamSize: formData.teamSize,
      remote: formData.remote,
      urgency: (formData.urgency as 'Low' | 'Medium' | 'High') || 'Medium',
      clientLogo: '/placeholder.svg',
      teamCulture: formData.teamCulture,
      desiredCommunicationStyle: formData.desiredCommunicationStyle,
      requiredValues: formData.requiredValues.split(',').map(value => value.trim()).filter(value => value),
      leadershipLevel: 3,
      teamDynamics: formData.teamCulture,
      status: 'open' as const,
      createdAt: new Date().toISOString().split('T')[0]
    };

    onSubmit(newAssignment);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg border p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Create New Assignment</h3>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="e.g. Senior React Developer"
              />
            </div>
            <div>
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="Company name"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={3}
              placeholder="Detailed description of the assignment..."
            />
          </div>

          <div>
            <Label htmlFor="requiredSkills">Required Skills *</Label>
            <Input
              id="requiredSkills"
              name="requiredSkills"
              value={formData.requiredSkills}
              onChange={handleInputChange}
              required
              placeholder="React, Node.js, TypeScript (comma separated)"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="teamCulture">Team Culture</Label>
              <Select name="teamCulture" value={formData.teamCulture} onValueChange={(value) => setFormData(prev => ({...prev, teamCulture: value}))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select team culture" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Innovative and fast-paced">Innovative and fast-paced</SelectItem>
                  <SelectItem value="Structured and methodical">Structured and methodical</SelectItem>
                  <SelectItem value="Creative and flexible">Creative and flexible</SelectItem>
                  <SelectItem value="Results-focused">Results-focused</SelectItem>
                  <SelectItem value="Collaborative">Collaborative</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="desiredCommunicationStyle">Communication Style</Label>
              <Select name="desiredCommunicationStyle" value={formData.desiredCommunicationStyle} onValueChange={(value) => setFormData(prev => ({...prev, desiredCommunicationStyle: value}))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Direct and clear">Direct and clear</SelectItem>
                  <SelectItem value="Diplomatic">Diplomatic</SelectItem>
                  <SelectItem value="Informal and open">Informal and open</SelectItem>
                  <SelectItem value="Formal">Formal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="requiredValues">Required Values</Label>
            <Input
              id="requiredValues"
              name="requiredValues"
              value={formData.requiredValues}
              onChange={handleInputChange}
              placeholder="Innovation, Quality, Teamwork (comma separated)"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                placeholder="e.g., 6 months"
              />
            </div>
            <div>
              <Label htmlFor="workload">Workload</Label>
              <Select name="workload" value={formData.workload} onValueChange={(value) => setFormData(prev => ({...prev, workload: value}))}>
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

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="budget">Budget</Label>
              <Input
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                placeholder="e.g., 800-1200 SEK/hour"
              />
            </div>
            <div>
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                placeholder="e.g., FinTech, HealthTech"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="teamSize">Team Size</Label>
              <Input
                id="teamSize"
                name="teamSize"
                value={formData.teamSize}
                onChange={handleInputChange}
                placeholder="e.g., 5-10 people"
              />
            </div>
            <div>
              <Label htmlFor="remote">Remote Work</Label>
              <Select name="remote" value={formData.remote} onValueChange={(value) => setFormData(prev => ({...prev, remote: value}))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fully Remote">Fully Remote</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                  <SelectItem value="On-site">On-site</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="urgency">Urgency</Label>
              <Select name="urgency" value={formData.urgency} onValueChange={(value) => setFormData(prev => ({...prev, urgency: value as 'Low' | 'Medium' | 'High'}))}>
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

          <div className="flex space-x-3 pt-4">
            <Button
              type="submit"
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Create Assignment</span>
            </Button>
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const MatchingResultsModal: React.FC<{results: any; onClose: () => void}> = ({ results, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>AI Matching Results</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results?.matches?.map((match: any, index: number) => (
              <Card key={index} className="border">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold">{match.consultant?.name}</h4>
                      <p className="text-sm text-gray-600">{match.consultant?.roles?.[0]}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      {match.match_score}% Match
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">
                    Skills: {match.matched_skills?.join(', ')}
                  </p>
                  <p className="text-xs text-gray-500">
                    Cultural fit: {match.cultural_match}% | Communication: {match.communication_match}%
                  </p>
                </CardContent>
              </Card>
            ))}
            {(!results?.matches || results.matches.length === 0) && (
              <p className="text-center text-gray-500 py-8">No matches found</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
