
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import { Assignment } from '@/types/assignment';

interface CreateAssignmentFormProps {
  onClose: () => void;
  onCancel?: () => void;
  onAssignmentCreated: (assignment: Assignment) => void;
}

const CreateAssignmentForm: React.FC<CreateAssignmentFormProps> = ({ onClose, onCancel, onAssignmentCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    company: '',
    requiredSkills: '',
    requiredValues: '',
    teamCulture: '',
    communicationStyle: '',
    startDate: '',
    duration: '',
    workload: '',
    budget: '',
    industry: '',
    teamSize: '',
    remoteWork: '',
    urgency: 'Medium' as const
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newAssignment: Assignment = {
      id: Date.now(),
      title: formData.title,
      description: formData.description,
      company: formData.company,
      clientLogo: '',
      requiredSkills: formData.requiredSkills.split(',').map(skill => skill.trim()),
      workload: formData.workload,
      duration: formData.duration,
      location: formData.remoteWork === 'Remote' ? 'Remote' : 'Office',
      urgency: formData.urgency,
      budget: formData.budget,
      hourlyRate: 800,
      status: 'open' as const,
      matchedConsultants: 0,
      createdAt: new Date().toISOString(),
      remote: formData.remoteWork,
      teamSize: formData.teamSize,
      teamCulture: formData.teamCulture,
      industry: formData.industry
    };

    onAssignmentCreated(newAssignment);
    if (onCancel) onCancel();
    onClose();
  };

  const handleCloseClick = () => {
    if (onCancel) onCancel();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Create New Assignment</CardTitle>
          <Button variant="ghost" size="sm" onClick={handleCloseClick}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g. Senior React Developer"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  placeholder="Company name"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Detailed description of the assignment..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={4}
                required
              />
            </div>

            <div>
              <Label htmlFor="requiredSkills">Required Skills *</Label>
              <Input
                id="requiredSkills"
                placeholder="React, Node.js, TypeScript (comma separated)"
                value={formData.requiredSkills}
                onChange={(e) => setFormData({...formData, requiredSkills: e.target.value})}
              />
            </div>

            {/* Team Culture and Communication */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="teamCulture">Team Culture</Label>
                <Select value={formData.teamCulture} onValueChange={(value) => setFormData({...formData, teamCulture: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select team culture" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="collaborative">Collaborative</SelectItem>
                    <SelectItem value="fast-paced">Fast-paced</SelectItem>
                    <SelectItem value="structured">Structured</SelectItem>
                    <SelectItem value="innovative">Innovative</SelectItem>
                    <SelectItem value="quality-focused">Quality-focused</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="communicationStyle">Communication Style</Label>
                <Select value={formData.communicationStyle} onValueChange={(value) => setFormData({...formData, communicationStyle: value})}>
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
              <Label htmlFor="requiredValues">Required Values</Label>
              <Input
                id="requiredValues"
                placeholder="Innovation, Quality, Teamwork (comma separated)"
                value={formData.requiredValues}
                onChange={(e) => setFormData({...formData, requiredValues: e.target.value})}
              />
            </div>

            {/* Project Details */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  placeholder="e.g., 6 months"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="workload">Workload</Label>
                <Select value={formData.workload} onValueChange={(value) => setFormData({...formData, workload: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select workload" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Project-based">Project-based</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="budget">Budget</Label>
                <Input
                  id="budget"
                  placeholder="e.g., 800-1200 SEK/hour"
                  value={formData.budget}
                  onChange={(e) => setFormData({...formData, budget: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  placeholder="e.g., FinTech, HealthTech"
                  value={formData.industry}
                  onChange={(e) => setFormData({...formData, industry: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="teamSize">Team Size</Label>
                <Input
                  id="teamSize"
                  placeholder="e.g., 5-10 people"
                  value={formData.teamSize}
                  onChange={(e) => setFormData({...formData, teamSize: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="remoteWork">Remote Work</Label>
                <Select value={formData.remoteWork} onValueChange={(value) => setFormData({...formData, remoteWork: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Remote">Remote</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                    <SelectItem value="On-site">On-site</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="urgency">Urgency</Label>
                <Select value={formData.urgency} onValueChange={(value) => setFormData({...formData, urgency: value as 'Low' | 'Medium' | 'High'})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select urgency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={handleCloseClick}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Create Assignment
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateAssignmentForm;
