
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Calendar, Building, Users, Clock, DollarSign } from 'lucide-react';
import { Assignment } from '@/types/consultant';

interface CreateAssignmentFormProps {
  onAssignmentCreated: (assignment: Assignment) => void;
  onCancel: () => void;
}

const CreateAssignmentForm: React.FC<CreateAssignmentFormProps> = ({ onAssignmentCreated, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    requiredSkills: [] as string[],
    teamCulture: '',
    desiredCommunicationStyle: '',
    requiredValues: [] as string[],
    startDate: '',
    duration: '',
    workload: '',
    budget: '',
    industry: '',
    teamSize: '',
    remote: '',
    urgency: 'Medium' as 'Low' | 'Medium' | 'High'
  });

  const [newSkill, setNewSkill] = useState('');
  const [newValue, setNewValue] = useState('');
  const [matchPotential, setMatchPotential] = useState('');

  // Predefined options
  const teamCultureOptions = [
    'Collaborative and supportive',
    'Fast-paced and competitive', 
    'Innovation-focused and experimental',
    'Structured and process-oriented',
    'Flexible and autonomous'
  ];

  const communicationStyleOptions = [
    'Direct and straightforward',
    'Diplomatic and considerate',
    'Casual and informal',
    'Formal and structured'
  ];

  const workloadOptions = ['100%', '75%', '50%', '25%'];
  const remoteOptions = ['Fully Remote', 'Hybrid', 'On-site'];
  const urgencyOptions = ['Low', 'Medium', 'High'];

  const skillSuggestions = [
    'React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker', 'Kubernetes',
    'JavaScript', 'Vue.js', 'Angular', 'Java', 'C#', 'PHP', 'Ruby',
    'DevOps', 'CI/CD', 'Microservices', 'API Design', 'Database Design'
  ];

  const valueSuggestions = [
    'Innovation', 'Quality', 'Team collaboration', 'Continuous learning',
    'Customer focus', 'Ownership', 'Transparency', 'Agility', 'Impact',
    'Work-life balance', 'Diversity', 'Sustainability'
  ];

  const addSkill = () => {
    if (newSkill && !formData.requiredSkills.includes(newSkill)) {
      setFormData(prev => ({
        ...prev,
        requiredSkills: [...prev.requiredSkills, newSkill]
      }));
      setNewSkill('');
      updateMatchPotential();
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter(s => s !== skill)
    }));
    updateMatchPotential();
  };

  const addValue = () => {
    if (newValue && !formData.requiredValues.includes(newValue)) {
      setFormData(prev => ({
        ...prev,
        requiredValues: [...prev.requiredValues, newValue]
      }));
      setNewValue('');
    }
  };

  const removeValue = (value: string) => {
    setFormData(prev => ({
      ...prev,
      requiredValues: prev.requiredValues.filter(v => v !== value)
    }));
  };

  const updateMatchPotential = () => {
    const skillCount = formData.requiredSkills.length;
    if (skillCount >= 5) {
      setMatchPotential('High match potential');
    } else if (skillCount >= 3) {
      setMatchPotential('Medium match potential');
    } else if (skillCount >= 1) {
      setMatchPotential('Low match potential');
    } else {
      setMatchPotential('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const assignment: Assignment = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      company: formData.company,
      clientLogo: '🏢',
      requiredSkills: formData.requiredSkills,
      workload: formData.workload,
      duration: formData.duration,
      budget: formData.budget,
      remote: formData.remote,
      urgency: formData.urgency,
      teamSize: formData.teamSize,
      teamCulture: formData.teamCulture,
      industry: formData.industry,
      status: 'open',
      createdAt: new Date().toISOString(),
      startDate: formData.startDate,
      desiredCommunicationStyle: formData.desiredCommunicationStyle,
      requiredValues: formData.requiredValues
    };

    onAssignmentCreated(assignment);
  };

  const isFormValid = formData.title && formData.company && formData.description && 
                     formData.requiredSkills.length > 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">Create New Assignment</h2>
              <p className="text-gray-600">Fill out the details to find the perfect consultant match</p>
            </div>
            <Button variant="ghost" onClick={onCancel}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Assignment Title *</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g. Senior React Developer"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Company *</label>
                    <Input
                      value={formData.company}
                      onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                      placeholder="Company name"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description *</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the role, responsibilities, and what you're looking for..."
                    rows={4}
                    required
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Industry</label>
                    <Input
                      value={formData.industry}
                      onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                      placeholder="e.g. Fintech, Healthcare, E-commerce"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Team Size</label>
                    <Input
                      value={formData.teamSize}
                      onChange={(e) => setFormData(prev => ({ ...prev, teamSize: e.target.value }))}
                      placeholder="e.g. 5-10 people"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Required Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Required Skills *</CardTitle>
                <p className="text-sm text-gray-600">Add the technical skills needed for this role</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  />
                  <Button type="button" onClick={addSkill} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {skillSuggestions.slice(0, 8).map(skill => (
                    <Button
                      key={skill}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setNewSkill(skill);
                        if (!formData.requiredSkills.includes(skill)) {
                          setFormData(prev => ({
                            ...prev,
                            requiredSkills: [...prev.requiredSkills, skill]
                          }));
                          updateMatchPotential();
                        }
                      }}
                    >
                      + {skill}
                    </Button>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.requiredSkills.map(skill => (
                    <Badge key={skill} variant="default" className="flex items-center gap-1">
                      {skill}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeSkill(skill)}
                      />
                    </Badge>
                  ))}
                </div>

                {matchPotential && (
                  <div className={`text-sm font-medium ${
                    matchPotential.includes('High') ? 'text-green-600' :
                    matchPotential.includes('Medium') ? 'text-yellow-600' : 'text-gray-600'
                  }`}>
                    {matchPotential}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Team Culture & Communication */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Team Culture & Communication
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Team Culture</label>
                    <Select value={formData.teamCulture} onValueChange={(value) => 
                      setFormData(prev => ({ ...prev, teamCulture: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Select team culture" />
                      </SelectTrigger>
                      <SelectContent>
                        {teamCultureOptions.map(option => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Communication Style</label>
                    <Select value={formData.desiredCommunicationStyle} onValueChange={(value) => 
                      setFormData(prev => ({ ...prev, desiredCommunicationStyle: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Select communication style" />
                      </SelectTrigger>
                      <SelectContent>
                        {communicationStyleOptions.map(option => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Required Values */}
                <div>
                  <label className="block text-sm font-medium mb-1">Required Values</label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                      placeholder="Add a value..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addValue())}
                    />
                    <Button type="button" onClick={addValue} variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-2">
                    {valueSuggestions.slice(0, 6).map(value => (
                      <Button
                        key={value}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setNewValue(value);
                          if (!formData.requiredValues.includes(value)) {
                            setFormData(prev => ({
                              ...prev,
                              requiredValues: [...prev.requiredValues, value]
                            }));
                          }
                        }}
                      >
                        + {value}
                      </Button>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {formData.requiredValues.map(value => (
                      <Badge key={value} variant="secondary" className="flex items-center gap-1">
                        {value}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeValue(value)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Project Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Project Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Start Date</label>
                    <Input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Duration</label>
                    <Input
                      value={formData.duration}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                      placeholder="e.g. 6 months, 1 year"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Workload</label>
                    <Select value={formData.workload} onValueChange={(value) => 
                      setFormData(prev => ({ ...prev, workload: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Select workload" />
                      </SelectTrigger>
                      <SelectContent>
                        {workloadOptions.map(option => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Budget</label>
                    <Input
                      value={formData.budget}
                      onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                      placeholder="e.g. 50,000 - 70,000 SEK/month"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Remote Work</label>
                    <Select value={formData.remote} onValueChange={(value) => 
                      setFormData(prev => ({ ...prev, remote: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Select remote option" />
                      </SelectTrigger>
                      <SelectContent>
                        {remoteOptions.map(option => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Urgency</label>
                    <Select value={formData.urgency} onValueChange={(value: 'Low' | 'Medium' | 'High') => 
                      setFormData(prev => ({ ...prev, urgency: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {urgencyOptions.map(option => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={!isFormValid}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Create Assignment & Find Matches
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAssignmentForm;
