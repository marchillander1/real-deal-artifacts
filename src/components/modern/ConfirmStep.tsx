
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Phone, MapPin, Calendar, Briefcase, X, Plus } from 'lucide-react';
import { ExtractedData } from '@/pages/CVUploadModern';
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
      console.log('✅ Profile confirmed, navigating to analysis page...');
      
      // Navigate to analysis page first
      navigate(`/analysis?id=${consultantId}`);

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

  return (
    <div className="p-8 md:p-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
          Confirm Your Information
        </h2>
        <p className="text-lg text-slate-600">
          Please review and confirm your details before viewing your analysis
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

        {/* Confirm Button */}
        <div className="pt-6">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !extractedData.name?.trim() || !extractedData.email?.trim()}
            className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 transition-all duration-200 hover:shadow-lg"
          >
            {isSubmitting ? 'Processing...' : 'View My Analysis'}
          </Button>
          
          <p className="text-sm text-slate-500 text-center mt-4">
            Review your comprehensive AI analysis before deciding to join the network
          </p>
        </div>
      </div>
    </div>
  );
};
