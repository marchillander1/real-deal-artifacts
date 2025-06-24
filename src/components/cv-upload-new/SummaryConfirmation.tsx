
import React, { useState } from 'react';
import { User, Mail, Phone, Briefcase, Edit2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SummaryConfirmationProps {
  analysisResult: any;
  onConfirm: () => void;
  onRestart: () => void;
}

export const SummaryConfirmation: React.FC<SummaryConfirmationProps> = ({
  analysisResult,
  onConfirm,
  onRestart
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    full_name: analysisResult.analysisData?.full_name || '',
    email: analysisResult.analysisData?.email || '',
    phone: analysisResult.analysisData?.phone || '',
    title: analysisResult.analysisData?.title || '',
    personal_tagline: analysisResult.analysisData?.personal_tagline || ''
  });
  const [techSkills, setTechSkills] = useState([
    ...(analysisResult.analysisData?.tech_stack_primary || []),
    ...(analysisResult.analysisData?.tech_stack_secondary || [])
  ]);

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically update the analysis result
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData({
      full_name: analysisResult.analysisData?.full_name || '',
      email: analysisResult.analysisData?.email || '',
      phone: analysisResult.analysisData?.phone || '',
      title: analysisResult.analysisData?.title || '',
      personal_tagline: analysisResult.analysisData?.personal_tagline || ''
    });
  };

  const addTechSkill = (skill: string) => {
    if (skill.trim() && !techSkills.includes(skill.trim())) {
      setTechSkills([...techSkills, skill.trim()]);
    }
  };

  const removeTechSkill = (skillToRemove: string) => {
    setTechSkills(techSkills.filter(skill => skill !== skillToRemove));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-xl">
        <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="text-3xl font-bold">
            Bekräfta din profilinformation
          </CardTitle>
          <p className="text-lg opacity-90">
            Granska och redigera informationen som AI:n extraherat från ditt CV
          </p>
        </CardHeader>

        <CardContent className="p-8">
          <div className="space-y-6">
            {/* Personal Information */}
            <div className="bg-slate-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-slate-900 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Personlig information
                </h3>
                {!isEditing ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="flex items-center"
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Redigera
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSave}
                      className="flex items-center"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Spara
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancel}
                      className="flex items-center"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Avbryt
                    </Button>
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Fullständigt namn
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData.full_name}
                      onChange={(e) => setEditedData({...editedData, full_name: e.target.value})}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="p-3 bg-white rounded-lg border">{editedData.full_name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Titel/Roll
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData.title}
                      onChange={(e) => setEditedData({...editedData, title: e.target.value})}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="p-3 bg-white rounded-lg border">{editedData.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    E-post
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedData.email}
                      onChange={(e) => setEditedData({...editedData, email: e.target.value})}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="p-3 bg-white rounded-lg border">{editedData.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Telefon
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedData.phone}
                      onChange={(e) => setEditedData({...editedData, phone: e.target.value})}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="p-3 bg-white rounded-lg border">{editedData.phone || 'Ej angivet'}</p>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Personlig tagline
                </label>
                {isEditing ? (
                  <textarea
                    value={editedData.personal_tagline}
                    onChange={(e) => setEditedData({...editedData, personal_tagline: e.target.value})}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={2}
                    maxLength={150}
                  />
                ) : (
                  <p className="p-3 bg-white rounded-lg border">{editedData.personal_tagline || 'Ingen tagline angiven'}</p>
                )}
              </div>
            </div>

            {/* Technical Skills */}
            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center">
                <Briefcase className="h-5 w-5 mr-2" />
                Tekniska färdigheter
              </h3>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {techSkills.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="px-3 py-2 text-sm cursor-pointer hover:bg-red-100 hover:text-red-700 transition-colors"
                    onClick={() => removeTechSkill(skill)}
                  >
                    {skill} ×
                  </Badge>
                ))}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Lägg till ny teknisk färdighet..."
                  className="flex-1 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addTechSkill((e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                />
                <Button
                  variant="outline"
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                    addTechSkill(input.value);
                    input.value = '';
                  }}
                >
                  Lägg till
                </Button>
              </div>
            </div>

            {/* Experience Summary */}
            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">
                Erfarenhetssammanfattning
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {analysisResult.analysisData?.years_of_experience || 0}
                  </div>
                  <div className="text-sm text-slate-600">År av erfarenhet</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {techSkills.length}
                  </div>
                  <div className="text-sm text-slate-600">Tekniska färdigheter</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {analysisResult.analysisData?.industries?.length || 0}
                  </div>
                  <div className="text-sm text-slate-600">Branschområden</div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-between items-center">
            <Button
              onClick={onRestart}
              variant="outline"
              size="lg"
              className="px-6 py-3"
            >
              Börja om
            </Button>
            
            <Button
              onClick={onConfirm}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl"
            >
              Bekräfta och fortsätt till analys
            </Button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-sm text-blue-700 text-center">
              💡 Du kan alltid ändra denna information senare i din profil
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
