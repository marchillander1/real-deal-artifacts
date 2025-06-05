
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Consultant } from '@/types/consultant';
import { Edit, X, Plus } from 'lucide-react';

interface ConsultantEditDialogProps {
  consultant: Consultant;
  onSave: (consultant: Consultant) => void;
  isLoading?: boolean;
}

export const ConsultantEditDialog: React.FC<ConsultantEditDialogProps> = ({
  consultant,
  onSave,
  isLoading = false,
}) => {
  const [open, setOpen] = useState(false);
  const [editedConsultant, setEditedConsultant] = useState<Consultant>(consultant);
  const [newSkill, setNewSkill] = useState('');

  const handleSave = () => {
    onSave(editedConsultant);
    setOpen(false);
  };

  const addSkill = () => {
    if (newSkill.trim() && !editedConsultant.skills.includes(newSkill.trim())) {
      setEditedConsultant(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setEditedConsultant(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4 mr-2" />
          Redigera
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Redigera {consultant.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Namn</Label>
              <Input
                id="name"
                value={editedConsultant.name}
                onChange={(e) => setEditedConsultant(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={editedConsultant.email}
                onChange={(e) => setEditedConsultant(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Telefon</Label>
              <Input
                id="phone"
                value={editedConsultant.phone}
                onChange={(e) => setEditedConsultant(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="location">Plats</Label>
              <Input
                id="location"
                value={editedConsultant.location}
                onChange={(e) => setEditedConsultant(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label>Kompetenser</Label>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Lägg till kompetens"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
              />
              <Button onClick={addSkill} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {editedConsultant.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {skill}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeSkill(skill)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rate">Timkostnad (SEK)</Label>
              <Input
                id="rate"
                value={editedConsultant.rate.replace(' SEK/h', '')}
                onChange={(e) => setEditedConsultant(prev => ({ 
                  ...prev, 
                  rate: `${e.target.value} SEK/h` 
                }))}
              />
            </div>
            <div>
              <Label htmlFor="availability">Tillgänglighet</Label>
              <Input
                id="availability"
                value={editedConsultant.availability}
                onChange={(e) => setEditedConsultant(prev => ({ ...prev, availability: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="cv">CV/Beskrivning</Label>
            <Textarea
              id="cv"
              value={editedConsultant.cv}
              onChange={(e) => setEditedConsultant(prev => ({ ...prev, cv: e.target.value }))}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="communicationStyle">Kommunikationsstil</Label>
            <Input
              id="communicationStyle"
              value={editedConsultant.communicationStyle}
              onChange={(e) => setEditedConsultant(prev => ({ ...prev, communicationStyle: e.target.value }))}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Avbryt
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? 'Sparar...' : 'Spara'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
