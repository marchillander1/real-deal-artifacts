import React, { useState } from 'react';
import { CheckCircle, User, Star, TrendingUp, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SummaryConfirmationProps {
  analysisData: any;
  onFinalConfirm: (finalData: any) => Promise<void>;
}

export const SummaryConfirmation: React.FC<SummaryConfirmationProps> = ({
  analysisData,
  onFinalConfirm
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [makeProfilePublic, setMakeProfilePublic] = useState(true);
  const { toast } = useToast();

  const handleFinalSubmit = async () => {
    if (!agreedToTerms) {
      toast({
        title: "Terms agreement required",
        description: "Please agree to the terms and conditions",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create consultant profile in database
      const consultantData = {
        name: analysisData?.personalInfo?.name || 'Consultant',
        email: analysisData?.personalInfo?.email || '',
        phone: analysisData?.personalInfo?.phone || null,
        location: analysisData?.personalInfo?.location || null,
        title: analysisData?.experience?.currentRole || null,
        skills: analysisData?.skills?.technical || [],
        experience_years: analysisData?.experience?.years || null,
        hourly_rate: analysisData?.marketAnalysis?.hourlyRate?.optimized || null,
        market_rate_current: analysisData?.marketAnalysis?.hourlyRate?.current || null,
        market_rate_optimized: analysisData?.marketAnalysis?.hourlyRate?.optimized || null,
        analysis_results: analysisData,
        is_published: makeProfilePublic,
        visibility_status: makeProfilePublic ? 'public' : 'private',
        communication_style: analysisData?.softSkills?.communicationStyle || null,
        personality_traits: analysisData?.softSkills?.personalityTraits || [],
        values: analysisData?.analysisInsights?.values || [],
        certifications: analysisData?.education?.certifications || [],
        languages: analysisData?.personalInfo?.languages || ['English'],
        availability: 'Available',
        type: 'consultant'
      };

      const { data: consultant, error: consultantError } = await supabase
        .from('consultants')
        .insert(consultantData)
        .select()
        .single();

      if (consultantError) {
        throw new Error(`Failed to create consultant profile: ${consultantError.message}`);
      }

      console.log('✅ Consultant profile created:', consultant);

      toast({
        title: "Profile created successfully! 🎉",
        description: "Welcome to the MatchWise consultant network",
      });

      await onFinalConfirm({
        consultantId: consultant.id,
        consultant: consultant
      });

    } catch (error: any) {
      console.error('❌ Final confirmation failed:', error);
      toast({
        title: "Profile creation failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const personalInfo = analysisData?.personalInfo || {};
  const skills = analysisData?.skills || {};
  const marketAnalysis = analysisData?.marketAnalysis || {};

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-xl">
        <CardHeader className="text-center bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="h-16 w-16" />
          </div>
          <CardTitle className="text-3xl font-bold mb-4">
            Final Confirmation
          </CardTitle>
          <p className="text-lg opacity-90">
            Review your profile one last time before joining our consultant network
          </p>
        </CardHeader>

        <CardContent className="p-8">
          {/* Profile Summary */}
          <div className="space-y-6 mb-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {personalInfo.name || 'Professional Consultant'}
              </h2>
              <p className="text-lg text-gray-600 mb-4">
                {analysisData?.experience?.currentRole || 'Consultant'}
              </p>
              <div className="flex justify-center space-x-4 text-sm text-gray-500">
                <span>{personalInfo.location || 'Location not specified'}</span>
                <span>•</span>
                <span>{analysisData?.experience?.years || 0}+ years experience</span>
                <span>•</span>
                <span>{marketAnalysis?.hourlyRate?.optimized || 800} SEK/h</span>
              </div>
            </div>

            {/* Key Skills */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Key Skills</h3>
              <div className="flex flex-wrap gap-2">
                {(skills.technical || []).slice(0, 8).map((skill: string, index: number) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Confirmation Options */}
          <div className="space-y-4 mb-8 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="public-profile"
                checked={makeProfilePublic}
                onCheckedChange={setMakeProfilePublic}
              />
              <div>
                <Label htmlFor="public-profile" className="font-medium cursor-pointer">
                  Make my profile visible to companies
                </Label>
                <p className="text-sm text-gray-600 mt-1">
                  Your profile will be visible to verified companies looking for consultants with your skills
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={setAgreedToTerms}
              />
              <div>
                <Label htmlFor="terms" className="font-medium cursor-pointer">
                  I agree to the Terms of Service and Privacy Policy
                </Label>
                <p className="text-sm text-gray-600 mt-1">
                  By creating a profile, you agree to our terms and privacy policy
                </p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="text-center">
            <Button
              onClick={handleFinalSubmit}
              disabled={!agreedToTerms || isSubmitting}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-12 py-4 text-lg font-semibold rounded-xl disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Creating Profile...
                </>
              ) : (
                <>
                  <Star className="h-5 w-5 mr-2" />
                  Join Consultant Network
                </>
              )}
            </Button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-sm text-blue-700 text-center">
              🎉 You're almost done! Your consultant profile will be created and you'll get access to exclusive assignments.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
