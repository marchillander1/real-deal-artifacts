
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';

interface ProfileEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  consultant: any;
  onUpdate: (updatedData: any) => void;
}

export const ProfileEditDialog: React.FC<ProfileEditDialogProps> = ({
  isOpen,
  onClose,
  consultant,
  onUpdate
}) => {
  const [formData, setFormData] = useState({
    name: consultant?.name || '',
    email: consultant?.email || '',
    phone: consultant?.phone || '',
    location: consultant?.location || '',
    title: consultant?.title || '',
    tagline: consultant?.tagline || '',
    hourly_rate: consultant?.hourly_rate || 0,
    availability: consultant?.availability || 'Tillgänglig'
  });

  const [skills, setSkills] = useState(consultant?.skills || []);
  const [newSkill, setNewSkill] = useState('');

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleSave = () => {
    const updatedData = {
      ...formData,
      skills: skills
    };
    onUpdate(updatedData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Redigera profil</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Grundläggande information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Fullständigt namn</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="email">E-postadress</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Telefonnummer</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="location">Plats</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Professionell information</h3>
            
            <div>
              <Label htmlFor="title">Titel/Roll</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="tagline">Personlig tagline</Label>
              <Textarea
                id="tagline"
                value={formData.tagline}
                onChange={(e) => handleInputChange('tagline', e.target.value)}
                rows={2}
                maxLength={200}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hourly_rate">Timtaxa (SEK)</Label>
                <Input
                  id="hourly_rate"
                  type="number"
                  value={formData.hourly_rate}
                  onChange={(e) => handleInputChange('hourly_rate', parseInt(e.target.value) || 0)}
                />
              </div>
              
              <div>
                <Label htmlFor="availability">Tillgänglighet</Label>
                <select
                  id="availability"
                  value={formData.availability}
                  onChange={(e) => handleInputChange('availability', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="Tillgänglig">Tillgänglig</option>
                  <option value="Delvis tillgänglig">Delvis tillgänglig</option>
                  <option value="Upptagen">Upptagen</option>
                  <option value="Längre uppdrag">Längre uppdrag</option>
                </select>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Tekniska färdigheter</h3>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {skills.map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-pointer hover:bg-red-100 hover:text-red-700 transition-colors"
                  onClick={() => removeSkill(skill)}
                >
                  {skill}
                  <X className="ml-2 h-3 w-3" />
                </Badge>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Lägg till ny färdighet..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addSkill();
                  }
                }}
              />
              <Button
                onClick={addSkill}
                disabled={!newSkill.trim()}
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Lägg till
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Avbryt
          </Button>
          <Button onClick={handleSave}>
            Spara ändringar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
