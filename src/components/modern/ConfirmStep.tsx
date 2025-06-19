
import React, { useState } from 'react';
import { Check, Edit2, Plus, X } from 'lucide-react';
import { ExtractedData } from '@/pages/CVUploadModern';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  const [isUpdating, setIsUpdating] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const { toast } = useToast();

  const addSkill = () => {
    if (newSkill.trim() && !extractedData.skills.includes(newSkill.trim())) {
      onUpdateData('skills', [...extractedData.skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    onUpdateData('skills', extractedData.skills.filter(skill => skill !== skillToRemove));
  };

  const handleConfirm = async () => {
    setIsUpdating(true);
    
    try {
      // Update consultant with confirmed data
      const { error } = await supabase
        .from('consultants')
        .update({
          name: extractedData.name,
          email: extractedData.email,
          phone: extractedData.phone,
          skills: extractedData.skills,
          experience_years: extractedData.experience_years,
          location: extractedData.location
        })
        .eq('id', consultantId);

      if (error) {
        throw error;
      }

      toast({
        title: "Information updated successfully!",
        description: "Redirecting to your personalized analysis...",
      });

      setTimeout(() => {
        onConfirm();
      }, 1000);

    } catch (error: any) {
      console.error('Error updating consultant:', error);
      toast({
        title: "Update failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
      setIsUpdating(false);
    }
  };

  return (
    <div className="p-8 md:p-12">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 p-3 rounded-full">
            <Check className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-slate-900 mb-4">
          Confirm your information
        </h2>
        
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          We've extracted the following data from your CV and LinkedIn. Please review and update if needed before we finalize your AI report.
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Name */}
        <div className="bg-slate-50 rounded-xl p-6">
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Full Name
          </label>
          <input
            type="text"
            value={extractedData.name}
            onChange={(e) => onUpdateData('name', e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Your full name"
          />
        </div>

        {/* Email */}
        <div className="bg-slate-50 rounded-xl p-6">
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Email
          </label>
          <input
            type="email"
            value={extractedData.email}
            onChange={(e) => onUpdateData('email', e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="your.email@example.com"
          />
        </div>

        {/* Phone */}
        <div className="bg-slate-50 rounded-xl p-6">
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Phone (optional)
          </label>
          <input
            type="tel"
            value={extractedData.phone}
            onChange={(e) => onUpdateData('phone', e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="+1 (555) 123-4567"
          />
        </div>

        {/* Skills */}
        <div className="bg-slate-50 rounded-xl p-6">
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Technical Skills
          </label>
          <p className="text-sm text-slate-600 mb-4">
            Add or remove skills to make your profile more accurate
          </p>
          
          {/* Skills Display */}
          <div className="flex flex-wrap gap-2 mb-4">
            {extractedData.skills.map((skill, index) => (
              <div
                key={index}
                className="bg-blue-100 text-blue-800 px-3 py-2 rounded-full text-sm font-medium flex items-center space-x-2"
              >
                <span>{skill}</span>
                <button
                  onClick={() => removeSkill(skill)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Add New Skill */}
          <div className="flex space-x-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addSkill()}
              placeholder="Add a skill..."
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={addSkill}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Confirm Button */}
        <div className="pt-6">
          <button
            onClick={handleConfirm}
            disabled={isUpdating || !extractedData.name || !extractedData.email}
            className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Updating...</span>
              </div>
            ) : (
              'Confirm & Continue to Analysis'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
