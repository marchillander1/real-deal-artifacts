
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Phone, MapPin, Briefcase, X, Plus, Edit2, Save, CheckCircle } from 'lucide-react';
import { ExtractedData } from '@/types/extractedData';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface ConfirmStepProps {
  extractedData: ExtractedData;
  onUpdateData: (field: keyof ExtractedData, value: any) => void;
  onConfirm: () => void;
  consultantId: string;
}

export const ConfirmStep: React.FC<ConfirmStepProps> = ({
  extractedData,
  onUpdateData,
  onConfirm,
  consultantId
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState({
    personal: false,
    skills: false,
    experience: false
  });
  const [newSkill, setNewSkill] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    console.log('🚀 Starting confirmation process...');
    console.log('📋 Final extracted data:', extractedData);
    
    // Validation
    if (!extractedData.name?.trim()) {
      toast({
        title: "Namn krävs",
        description: "Vänligen ange ditt fullständiga namn",
        variant: "destructive",
      });
      return;
    }

    if (!extractedData.email?.trim() || !extractedData.email.includes('@')) {
      toast({
        title: "Giltig e-post krävs",
        description: "Vänligen ange en giltig e-postadress",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('✅ Data bekräftad, navigerar till analyssida...');
      
      // Show success message
      toast({
        title: "Information bekräftad!",
        description: "Dina uppgifter har sparats. Du kommer nu till din analys.",
      });

      // Navigate to analysis page
      navigate(`/analysis?id=${consultantId}`);

    } catch (error: any) {
      console.error('❌ Bekräftelsefel:', error);
      toast({
        title: "Bekräftelse misslyckades",
        description: error.message || "Det uppstod ett fel. Försök igen.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !extractedData.skills.includes(newSkill.trim())) {
      const updatedSkills = [...extractedData.skills, newSkill.trim()];
      onUpdateData('skills', updatedSkills);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const updatedSkills = extractedData.skills.filter(skill => skill !== skillToRemove);
    onUpdateData('skills', updatedSkills);
  };

  const toggleEdit = (section: keyof typeof isEditing) => {
    setIsEditing(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="p-8 md:p-12">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <CheckCircle className="h-12 w-12 text-green-600 mr-3" />
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
            Bekräfta din information
          </h2>
        </div>
        <p className="text-lg text-slate-600">
          Granska och redigera informationen som AI:n extraherat från ditt CV
        </p>
      </div>

      <div className="space-y-6 max-w-4xl mx-auto">
        
        {/* Personal Information */}
        <Card className="border-slate-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <User className="h-5 w-5" />
                Personlig information
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleEdit('personal')}
                className="flex items-center gap-2"
              >
                {isEditing.personal ? (
                  <>
                    <Save className="h-4 w-4" />
                    Spara
                  </>
                ) : (
                  <>
                    <Edit2 className="h-4 w-4" />
                    Redigera
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Fullständigt namn *
                </label>
                {isEditing.personal ? (
                  <Input
                    value={extractedData.name}
                    onChange={(e) => onUpdateData('name', e.target.value)}
                    placeholder="Ange ditt fullständiga namn"
                    className="w-full"
                  />
                ) : (
                  <div className="p-3 bg-slate-50 rounded-lg border">
                    {extractedData.name || 'Ej angivet'}
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  E-postadress *
                </label>
                {isEditing.personal ? (
                  <Input
                    type="email"
                    value={extractedData.email}
                    onChange={(e) => onUpdateData('email', e.target.value)}
                    placeholder="Ange din e-post"
                    className="w-full"
                  />
                ) : (
                  <div className="p-3 bg-slate-50 rounded-lg border">
                    {extractedData.email || 'Ej angivet'}
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Telefonnummer
                </label>
                {isEditing.personal ? (
                  <Input
                    type="tel"
                    value={extractedData.phone}
                    onChange={(e) => onUpdateData('phone', e.target.value)}
                    placeholder="Ange ditt telefonnummer"
                    className="w-full"
                  />
                ) : (
                  <div className="p-3 bg-slate-50 rounded-lg border">
                    {extractedData.phone || 'Ej angivet'}
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Plats
                </label>
                {isEditing.personal ? (
                  <Input
                    value={extractedData.location}
                    onChange={(e) => onUpdateData('location', e.target.value)}
                    placeholder="Ange din plats"
                    className="w-full"
                  />
                ) : (
                  <div className="p-3 bg-slate-50 rounded-lg border">
                    {extractedData.location || 'Ej angivet'}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card className="border-slate-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <Briefcase className="h-5 w-5" />
                Tekniska färdigheter ({extractedData.skills.length})
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleEdit('skills')}
                className="flex items-center gap-2"
              >
                {isEditing.skills ? (
                  <>
                    <Save className="h-4 w-4" />
                    Spara
                  </>
                ) : (
                  <>
                    <Edit2 className="h-4 w-4" />
                    Redigera
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {extractedData.skills.map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className={`px-3 py-2 text-sm ${
                    isEditing.skills 
                      ? 'cursor-pointer hover:bg-red-100 hover:text-red-700 transition-colors' 
                      : ''
                  }`}
                  onClick={isEditing.skills ? () => removeSkill(skill) : undefined}
                >
                  {skill}
                  {isEditing.skills && <X className="ml-2 h-3 w-3" />}
                </Badge>
              ))}
            </div>

            {isEditing.skills && (
              <div className="flex items-center space-x-2 pt-2 border-t">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Lägg till ny färdighet..."
                  className="flex-1"
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
            )}

            <p className="text-sm text-slate-500">
              {isEditing.skills 
                ? 'Klicka på en färdighet för att ta bort den, eller lägg till nya nedan.'
                : 'Dessa färdigheter identifierades från ditt CV. Klicka på "Redigera" för att ändra.'
              }
            </p>
          </CardContent>
        </Card>

        {/* Experience Summary */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <Briefcase className="h-5 w-5" />
              Erfarenhetssammanfattning
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {extractedData.experience || 'N/A'}
                </div>
                <div className="text-sm text-slate-600">År av erfarenhet</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {extractedData.skills.length}
                </div>
                <div className="text-sm text-slate-600">Tekniska färdigheter</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {extractedData.education.length}
                </div>
                <div className="text-sm text-slate-600">Utbildningar</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="pt-6 space-y-4">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !extractedData.name?.trim() || !extractedData.email?.trim()}
            className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02]"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Bearbetar...
              </div>
            ) : (
              'Bekräfta och visa min analys'
            )}
          </Button>
          
          <div className="text-center">
            <p className="text-sm text-slate-500">
              💡 Du kan alltid ändra denna information senare i din profil
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
