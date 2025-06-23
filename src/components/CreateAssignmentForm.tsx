import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
    duration: '',
    workload: '',
    location: '',
    urgency: 'Medium' as const,
    budget: '',
    hourlyRate: '',
    remote: 'Yes',
    teamSize: '',
    teamCulture: '',
    industry: ''
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
      location: formData.location,
      urgency: formData.urgency,
      budget: formData.budget,
      hourlyRate: parseInt(formData.hourlyRate) || 800,
      status: 'open' as const,
      matchedConsultants: 0,
      createdAt: new Date().toISOString(),
      remote: formData.remote,
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
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Create New Assignment</CardTitle>
          <Button variant="ghost" size="sm" onClick={handleCloseClick}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="requiredSkills">Required Skills (comma separated)</Label>
                <Input
                  id="requiredSkills"
                  value={formData.requiredSkills}
                  onChange={(e) => setFormData({...formData, requiredSkills: e.target.value})}
                  placeholder="React, TypeScript, Node.js"
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  placeholder="6 months"
                />
              </div>
              <div>
                <Label htmlFor="workload">Workload</Label>
                <Input
                  id="workload"
                  value={formData.workload}
                  onChange={(e) => setFormData({...formData, workload: e.target.value})}
                  placeholder="Full-time"
                />
              </div>
              <div>
                <Label htmlFor="hourlyRate">Hourly Rate</Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  value={formData.hourlyRate}
                  onChange={(e) => setFormData({...formData, hourlyRate: e.target.value})}
                  placeholder="800"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={handleCloseClick}>
                Cancel
              </Button>
              <Button type="submit">
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
