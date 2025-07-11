import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { X, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ConsultantEditDialogProps {
  consultant: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConsultantUpdated: () => void;
}

export const ConsultantEditDialog: React.FC<ConsultantEditDialogProps> = ({
  consultant,
  open,
  onOpenChange,
  onConsultantUpdated
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    availability: 'Available',
    hourly_rate: '',
    experience_years: '',
    skills: [] as string[],
    certifications: [] as string[],
    languages: [] as string[],
    tagline: '',
    visibility_status: 'private'
  });
  
  const [newSkill, setNewSkill] = useState('');
  const [newCertification, setNewCertification] = useState('');
  const [newLanguage, setNewLanguage] = useState('');

  useEffect(() => {
    if (consultant && open) {
      setFormData({
        name: consultant.name || '',
        title: consultant.title || '',
        email: consultant.email || '',
        phone: consultant.phone || '',
        location: consultant.location || '',
        availability: consultant.availability || 'Available',
        hourly_rate: consultant.hourly_rate?.toString() || '',
        experience_years: consultant.experience_years?.toString() || '',
        skills: consultant.skills || [],
        certifications: consultant.certifications || [],
        languages: consultant.languages || [],
        tagline: consultant.tagline || '',
        visibility_status: consultant.visibility_status || 'private'
      });
    }
  }, [consultant, open]);

  const addItem = (type: 'skills' | 'certifications' | 'languages', value: string) => {
    if (!value.trim()) return;
    
    setFormData(prev => ({
      ...prev,
      [type]: [...prev[type], value.trim()]
    }));
    
    if (type === 'skills') setNewSkill('');
    if (type === 'certifications') setNewCertification('');
    if (type === 'languages') setNewLanguage('');
  };

  const removeItem = (type: 'skills' | 'certifications' | 'languages', index: number) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    
    try {
      const updateData = {
        ...formData,
        hourly_rate: formData.hourly_rate ? parseInt(formData.hourly_rate) : null,
        experience_years: formData.experience_years ? parseInt(formData.experience_years) : null,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('consultants')
        .update(updateData)
        .eq('id', consultant.id);

      if (error) throw error;

      toast({
        title: "Consultant Updated",
        description: "Profile has been successfully updated",
      });

      onConsultantUpdated();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Edit Consultant Profile</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg">
            <div className="p-4 space-y-4">
              <h3 className="font-semibold text-gray-900">Basic Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="bg-white border-gray-300"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="title" className="text-gray-700">Job Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="bg-white border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="bg-white border-gray-300"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="bg-white border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-gray-700">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="bg-white border-gray-300"
                />
              </div>
            </div>
          </div>

          {/* Professional Details */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg">
            <div className="p-4 space-y-4">
              <h3 className="font-semibold text-gray-900">Professional Details</h3>
              
              <div className="space-y-2">
                <Label htmlFor="availability" className="text-gray-700">Availability</Label>
                <Select value={formData.availability} onValueChange={(value) => setFormData({...formData, availability: value})}>
                  <SelectTrigger className="bg-white border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Partially Available">Partially Available</SelectItem>
                    <SelectItem value="Not Available">Not Available</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hourly_rate" className="text-gray-700">Hourly Rate (SEK)</Label>
                <Input
                  id="hourly_rate"
                  type="number"
                  value={formData.hourly_rate}
                  onChange={(e) => setFormData({...formData, hourly_rate: e.target.value})}
                  className="bg-white border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience_years" className="text-gray-700">Years of Experience</Label>
                <Input
                  id="experience_years"
                  type="number"
                  value={formData.experience_years}
                  onChange={(e) => setFormData({...formData, experience_years: e.target.value})}
                  className="bg-white border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tagline" className="text-gray-700">Professional Tagline</Label>
                <Textarea
                  id="tagline"
                  value={formData.tagline}
                  onChange={(e) => setFormData({...formData, tagline: e.target.value})}
                  className="bg-white border-gray-300"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="visibility" className="text-gray-700">Visibility</Label>
                <Select value={formData.visibility_status} onValueChange={(value) => setFormData({...formData, visibility_status: value})}>
                  <SelectTrigger className="bg-white border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="private">Private (Internal Only)</SelectItem>
                    <SelectItem value="public">Public (Network Visible)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg">
            <div className="p-4 space-y-4">
              <h3 className="font-semibold text-gray-900">Skills</h3>
              
              <div className="flex gap-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add skill"
                  className="bg-white border-gray-300"
                  onKeyPress={(e) => e.key === 'Enter' && addItem('skills', newSkill)}
                />
                <Button
                  onClick={() => addItem('skills', newSkill)}
                  size="sm"
                  type="button"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1 bg-blue-50 text-blue-700 border-blue-200">
                    {skill}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeItem('skills', index)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Certifications & Languages */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg">
            <div className="p-4 space-y-4">
              <h3 className="font-semibold text-gray-900">Certifications & Languages</h3>
              
              <div>
                <Label className="text-gray-700">Certifications</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={newCertification}
                    onChange={(e) => setNewCertification(e.target.value)}
                    placeholder="Add certification"
                    className="bg-white border-gray-300"
                    onKeyPress={(e) => e.key === 'Enter' && addItem('certifications', newCertification)}
                  />
                  <Button
                    onClick={() => addItem('certifications', newCertification)}
                    size="sm"
                    type="button"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.certifications.map((cert, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1 bg-emerald-50 text-emerald-700 border-emerald-200">
                      {cert}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeItem('certifications', index)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-gray-700">Languages</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    placeholder="Add language"
                    className="bg-white border-gray-300"
                    onKeyPress={(e) => e.key === 'Enter' && addItem('languages', newLanguage)}
                  />
                  <Button
                    onClick={() => addItem('languages', newLanguage)}
                    size="sm"
                    type="button"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.languages.map((lang, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1 bg-purple-50 text-purple-700 border-purple-200">
                      {lang}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeItem('languages', index)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};