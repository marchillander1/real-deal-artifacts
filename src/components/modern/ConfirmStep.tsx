
import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Edit2, CheckCircle, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { ExtractedData } from '@/pages/CVUploadModern';

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
  const [isEditing, setIsEditing] = useState({
    name: false,
    email: false,
    phone: false,
    location: false
  });
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Update consultant with final data
      const { error } = await supabase
        .from('consultants')
        .update({
          name: extractedData.name,
          email: extractedData.email,
          phone: extractedData.phone,
          location: extractedData.location,
          skills: extractedData.skills,
          experience_years: extractedData.experience_years,
          updated_at: new Date().toISOString()
        })
        .eq('id', consultantId);

      if (error) throw error;

      toast({
        title: "Information saved!",
        description: "Your profile has been updated successfully.",
      });
      
      onConfirm();
    } catch (error: any) {
      console.error('Error saving consultant data:', error);
      toast({
        title: "Failed to save",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const toggleEdit = (field: keyof typeof isEditing) => {
    setIsEditing(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className="p-8 md:p-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
          Confirm Your Information
        </h2>
        <p className="text-lg text-slate-600">
          Please review and edit your extracted information before proceeding.
        </p>
      </div>

      <div className="space-y-6 max-w-2xl mx-auto">
        {/* Name */}
        <div className="bg-slate-50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-slate-600" />
              <label className="font-semibold text-slate-700">Full Name</label>
            </div>
            <button
              onClick={() => toggleEdit('name')}
              className="text-blue-600 hover:text-blue-700 p-1"
            >
              <Edit2 className="h-4 w-4" />
            </button>
          </div>
          
          {isEditing.name ? (
            <input
              type="text"
              value={extractedData.name}
              onChange={(e) => onUpdateData('name', e.target.value)}
              onBlur={() => toggleEdit('name')}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
          ) : (
            <p className="text-slate-900 font-medium">{extractedData.name || 'Not specified'}</p>
          )}
        </div>

        {/* Email */}
        <div className="bg-slate-50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-slate-600" />
              <label className="font-semibold text-slate-700">Email</label>
            </div>
            <button
              onClick={() => toggleEdit('email')}
              className="text-blue-600 hover:text-blue-700 p-1"
            >
              <Edit2 className="h-4 w-4" />
            </button>
          </div>
          
          {isEditing.email ? (
            <input
              type="email"
              value={extractedData.email}
              onChange={(e) => onUpdateData('email', e.target.value)}
              onBlur={() => toggleEdit('email')}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
          ) : (
            <p className="text-slate-900 font-medium">{extractedData.email || 'Not specified'}</p>
          )}
        </div>

        {/* Phone */}
        <div className="bg-slate-50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-slate-600" />
              <label className="font-semibold text-slate-700">Phone</label>
            </div>
            <button
              onClick={() => toggleEdit('phone')}
              className="text-blue-600 hover:text-blue-700 p-1"
            >
              <Edit2 className="h-4 w-4" />
            </button>
          </div>
          
          {isEditing.phone ? (
            <input
              type="tel"
              value={extractedData.phone}
              onChange={(e) => onUpdateData('phone', e.target.value)}
              onBlur={() => toggleEdit('phone')}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
          ) : (
            <p className="text-slate-900 font-medium">{extractedData.phone || 'Not specified'}</p>
          )}
        </div>

        {/* Location */}
        <div className="bg-slate-50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-slate-600" />
              <label className="font-semibold text-slate-700">Location</label>
            </div>
            <button
              onClick={() => toggleEdit('location')}
              className="text-blue-600 hover:text-blue-700 p-1"
            >
              <Edit2 className="h-4 w-4" />
            </button>
          </div>
          
          {isEditing.location ? (
            <input
              type="text"
              value={extractedData.location}
              onChange={(e) => onUpdateData('location', e.target.value)}
              onBlur={() => toggleEdit('location')}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
          ) : (
            <p className="text-slate-900 font-medium">{extractedData.location || 'Not specified'}</p>
          )}
        </div>

        {/* Skills Preview */}
        {extractedData.skills.length > 0 && (
          <div className="bg-slate-50 rounded-xl p-6">
            <h4 className="font-semibold text-slate-700 mb-3">Detected Skills</h4>
            <div className="flex flex-wrap gap-2">
              {extractedData.skills.slice(0, 10).map((skill, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {skill}
                </span>
              ))}
              {extractedData.skills.length > 10 && (
                <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm">
                  +{extractedData.skills.length - 10} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Experience */}
        {extractedData.experience_years > 0 && (
          <div className="bg-slate-50 rounded-xl p-6">
            <h4 className="font-semibold text-slate-700 mb-3">Experience</h4>
            <p className="text-slate-900">{extractedData.experience_years} years of experience</p>
          </div>
        )}

        {/* Save and Continue Button */}
        <div className="pt-6">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full py-4 px-8 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            {isSaving ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>Save & View Analysis</span>
                <ArrowRight className="h-5 w-5" />
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
