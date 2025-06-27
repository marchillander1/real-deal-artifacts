
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Building2, Users, DollarSign, MapPin, Clock, Zap, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CreateAssignmentFormProps {
  onClose: () => void;
  onSubmit: (assignment: any) => void;
}

export const CreateAssignmentForm: React.FC<CreateAssignmentFormProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    requiredSkills: [] as string[],
    teamCulture: '',
    communicationStyle: '',
    requiredValues: [] as string[],
    startDate: '',
    duration: '',
    workload: '',
    budgetMin: '',
    budgetMax: '',
    industry: '',
    teamSize: '',
    remoteType: '',
    urgency: 'Medium'
  });

  const [newSkill, setNewSkill] = useState('');
  const [newValue, setNewValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const teamCultureOptions = [
    'Collaborative & Supportive',
    'Fast-paced & Results-driven',
    'Innovation & Creativity focused',
    'Traditional & Structured',
    'Flexible & Autonomous'
  ];

  const communicationStyleOptions = [
    'Direct & Open',
    'Formal & Structured', 
    'Casual & Friendly',
    'Data-driven & Analytical'
  ];

  const commonSkills = [
    'React', 'TypeScript', 'Node.js', 'Python', 'Java', 'AWS', 'Docker', 'Kubernetes',
    'PostgreSQL', 'MongoDB', 'GraphQL', 'REST API', 'Microservices', 'DevOps',
    'Machine Learning', 'Data Science', 'Product Management', 'UX Design'
  ];

  const commonValues = [
    'Innovation', 'Quality', 'Collaboration', 'Impact', 'Ownership', 'Growth',
    'Transparency', 'Excellence', 'Sustainability', 'Customer Focus'
  ];

  const addSkill = (skill: string) => {
    if (skill && !formData.requiredSkills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        requiredSkills: [...prev.requiredSkills, skill]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter(s => s !== skill)
    }));
  };

  const addValue = (value: string) => {
    if (value && !formData.requiredValues.includes(value)) {
      setFormData(prev => ({
        ...prev,
        requiredValues: [...prev.requiredValues, value]
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const assignmentData = {
        title: formData.title,
        description: formData.description,
        company: formData.company,
        required_skills: formData.requiredSkills,
        team_culture: formData.teamCulture,
        desired_communication_style: formData.communicationStyle,
        required_values: formData.requiredValues,
        start_date: formData.startDate || null,
        duration: formData.duration,
        workload: formData.workload,
        budget_min: parseInt(formData.budgetMin) || null,
        budget_max: parseInt(formData.budgetMax) || null,
        industry: formData.industry,
        team_size: formData.teamSize,
        remote_type: formData.remoteType,
        urgency: formData.urgency,
        status: 'open'
      };

      const { data, error } = await supabase
        .from('assignments')
        .insert(assignmentData)
        .select()
        .single();

      if (error) throw error;

      toast.success('Assignment created successfully!');
      onSubmit(data);
      onClose();
    } catch (error: any) {
      console.error('Error creating assignment:', error);
      toast.error('Failed to create assignment: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <Card className="border-0 shadow-none">
          <CardHeader className="border-b">
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl">Create New Assignment</CardTitle>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Assignment Title *</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g. Senior React Developer"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Company *</label>
                    <Input
                      value={formData.company}
                      onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                      placeholder="Company name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Industry</label>
                    <Input
                      value={formData.industry}
                      onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                      placeholder="e.g. Fintech, E-commerce"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Start Date</label>
                    <Input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Duration</label>
                    <Input
                      value={formData.duration}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                      placeholder="e.g. 6 months, 1 year"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Workload</label>
                    <Select value={formData.workload} onValueChange={(value) => setFormData(prev => ({ ...prev, workload: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select workload" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="100%">Full-time (100%)</SelectItem>
                        <SelectItem value="75%">Part-time (75%)</SelectItem>
                        <SelectItem value="50%">Part-time (50%)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2">Description *</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the role, responsibilities, and requirements..."
                  rows={4}
                  required
                />
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-medium mb-2">Required Skills *</label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill(newSkill))}
                    />
                    <Button type="button" onClick={() => addSkill(newSkill)}>Add</Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {commonSkills.slice(0, 8).map(skill => (
                      <Button
                        key={skill}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addSkill(skill)}
                        disabled={formData.requiredSkills.includes(skill)}
                      >
                        {skill}
                      </Button>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {formData.requiredSkills.map(skill => (
                      <Badge key={skill} variant="default" className="flex items-center gap-1">
                        {skill}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeSkill(skill)} />
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Team Culture & Communication */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Team Culture</label>
                  <Select value={formData.teamCulture} onValueChange={(value) => setFormData(prev => ({ ...prev, teamCulture: value }))}>
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
                  <label className="block text-sm font-medium mb-2">Communication Style</label>
                  <Select value={formData.communicationStyle} onValueChange={(value) => setFormData(prev => ({ ...prev, communicationStyle: value }))}>
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

              {/* Values */}
              <div>
                <label className="block text-sm font-medium mb-2">Required Values</label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                      placeholder="Add a value..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addValue(newValue))}
                    />
                    <Button type="button" onClick={() => addValue(newValue)}>Add</Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {commonValues.map(value => (
                      <Button
                        key={value}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addValue(value)}
                        disabled={formData.requiredValues.includes(value)}
                      >
                        {value}
                      </Button>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {formData.requiredValues.map(value => (
                      <Badge key={value} variant="secondary" className="flex items-center gap-1">
                        {value}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeValue(value)} />
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Budget & Location */}
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Budget Range (SEK/hour)</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={formData.budgetMin}
                      onChange={(e) => setFormData(prev => ({ ...prev, budgetMin: e.target.value }))}
                      placeholder="Min"
                    />
                    <Input
                      type="number"
                      value={formData.budgetMax}
                      onChange={(e) => setFormData(prev => ({ ...prev, budgetMax: e.target.value }))}
                      placeholder="Max"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Remote Work</label>
                  <Select value={formData.remoteType} onValueChange={(value) => setFormData(prev => ({ ...prev, remoteType: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select work type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fully Remote">Fully Remote</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                      <SelectItem value="On-site">On-site</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Urgency</label>
                  <Select value={formData.urgency} onValueChange={(value) => setFormData(prev => ({ ...prev, urgency: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Team Size</label>
                <Input
                  value={formData.teamSize}
                  onChange={(e) => setFormData(prev => ({ ...prev, teamSize: e.target.value }))}
                  placeholder="e.g. 5-10 people, Small team"
                />
              </div>

              {/* Submit */}
              <div className="flex justify-end gap-4 pt-6 border-t">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create Assignment'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
