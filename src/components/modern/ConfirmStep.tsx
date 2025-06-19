import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Phone, MapPin, Calendar, Briefcase, X, Plus } from 'lucide-react';
import { ExtractedData } from '@/pages/CVUploadModern';
import { useToast } from '@/hooks/use-toast';
import { EmailNotificationHandler } from '@/components/EmailNotificationHandler';
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
  const [newSkill, setNewSkill] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    console.log('🚀 Starting form submission process...');
    console.log('📋 Current extracted data:', extractedData);
    
    // Validation
    if (!extractedData.name?.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name",
        variant: "destructive",
      });
      return;
    }

    if (!extractedData.email?.trim() || !extractedData.email.includes('@')) {
      toast({
        title: "Valid email required",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('📧 About to send welcome emails...');
      console.log('🆔 Consultant ID:', consultantId);
      console.log('📧 Email address:', extractedData.email);
      console.log('👤 Name:', extractedData.name);

      // Send welcome emails using the EmailNotificationHandler
      const emailResult = await EmailNotificationHandler.sendWelcomeEmails({
        consultantId: consultantId,
        finalEmail: extractedData.email,
        finalName: extractedData.name,
        isMyConsultant: false,
        toast: toast
      });

      console.log('📧 Email sending result:', emailResult);

      if (emailResult.success) {
        console.log('✅ Emails sent successfully, navigating to network-success page...');
        
        // Navigate to network-success page
        navigate(`/network-success?consultant=${consultantId}`);
      } else {
        console.error('❌ Email sending failed:', emailResult.error);
        
        // Still navigate to network-success page even if email fails
        toast({
          title: "Profile created!",
          description: "Your profile was created successfully, but there was an issue sending the welcome email.",
          variant: "default",
        });
        navigate(`/network-success?consultant=${consultantId}`);
      }

    } catch (error: any) {
      console.error('❌ Form submission error:', error);
      toast({
        title: "Submission failed",
        description: error.message || "There was an error submitting your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkillAdd = () => {
    if (newSkill.trim() && !extractedData.skills.includes(newSkill.trim())) {
      onUpdateData('skills', [...extractedData.skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleSkillRemove = (skillToRemove: string) => {
    onUpdateData('skills', extractedData.skills.filter(skill => skill !== skillToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSkillAdd();
    }
  };

  return (
    <div className="p-8 md:p-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
          Confirm Your Information
        </h2>
        <p className="text-lg text-slate-600">
          Please review and confirm your details before joining the network
        </p>
      </div>

      <div className="space-y-6 max-w-2xl mx-auto">
        
        {/* Personal Information */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name *
                </label>
                <Input
                  value={extractedData.name}
                  onChange={(e) => onUpdateData('name', e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address *
                </label>
                <Input
                  type="email"
                  value={extractedData.email}
                  onChange={(e) => onUpdateData('email', e.target.value)}
                  placeholder="Enter your email"
                  className="w-full"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  value={extractedData.phone}
                  onChange={(e) => onUpdateData('phone', e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Location
                </label>
                <Input
                  value={extractedData.location}
                  onChange={(e) => onUpdateData('location', e.target.value)}
                  placeholder="Enter your location"
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professional Information */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <Briefcase className="h-5 w-5" />
              Professional Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Years of Experience
              </label>
              <Input
                type="number"
                min="0"
                max="50"
                value={extractedData.experience_years}
                onChange={(e) => onUpdateData('experience_years', parseInt(e.target.value) || 0)}
                placeholder="Enter years of experience"
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Skills & Technologies
              </label>
              <div className="flex gap-2 mb-3">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add a skill..."
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={handleSkillAdd}
                  variant="outline"
                  size="sm"
                  className="px-3"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {extractedData.skills.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-1 px-3 py-1"
                  >
                    {skill}
                    <button
                      onClick={() => handleSkillRemove(skill)}
                      className="ml-1 hover:text-red-600"
                      type="button"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              
              {extractedData.skills.length === 0 && (
                <p className="text-sm text-slate-500 mt-2">
                  No skills added yet. Add your technical skills and technologies.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Confirm Button */}
        <div className="pt-6">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !extractedData.name?.trim() || !extractedData.email?.trim()}
            className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 transition-all duration-200 hover:shadow-lg"
          >
            {isSubmitting ? 'Joining Network...' : 'Join Network & Get Analysis'}
          </Button>
          
          <p className="text-sm text-slate-500 text-center mt-4">
            By joining, you agree to be contacted about relevant consulting opportunities
          </p>
        </div>
      </div>
    </div>
  );
};
