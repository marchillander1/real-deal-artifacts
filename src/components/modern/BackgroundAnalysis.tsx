
import React, { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BackgroundAnalysisProps {
  file: File;
  linkedinUrl: string;
  onComplete: (results: any) => void;
}

export const BackgroundAnalysis: React.FC<BackgroundAnalysisProps> = ({
  file,
  linkedinUrl,
  onComplete
}) => {
  const { toast } = useToast();

  useEffect(() => {
    const runAnalysis = async () => {
      try {
        console.log('🚀 Starting enhanced profile analysis');
        console.log('📄 File:', file.name, 'Size:', file.size);
        console.log('🔗 LinkedIn URL:', linkedinUrl);

        // Generate unique session token
        const sessionToken = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Use the enhanced-profile-analysis function
        const formData = new FormData();
        formData.append('file', file);
        formData.append('linkedinUrl', linkedinUrl || '');
        formData.append('sessionToken', sessionToken);

        console.log('📤 Calling enhanced-profile-analysis function...');

        const response = await supabase.functions.invoke('enhanced-profile-analysis', {
          body: formData
        });

        console.log('📊 Function response:', response);

        if (response.error) {
          console.error('❌ Function error:', response.error);
          throw new Error(`Analysis failed: ${response.error.message}`);
        }

        if (!response.data || !response.data.success) {
          console.error('❌ Analysis was not successful:', response.data);
          throw new Error('Analysis was not successful');
        }

        console.log('✅ Analysis completed successfully:', response.data);

        // Extract enhanced personal information with better fallbacks
        const consultant = response.data.consultant;
        const analysisResults = response.data.analysisResults;
        
        console.log('🔍 Raw consultant data:', consultant);
        console.log('🔍 Raw analysis results:', analysisResults);

        // Enhanced extraction with multiple fallback sources
        const extractedPersonalInfo = {
          name: consultant?.name || 
                analysisResults?.full_name || 
                analysisResults?.personalInfo?.name || 
                '',
          email: consultant?.email || 
                 analysisResults?.email || 
                 analysisResults?.personalInfo?.email || 
                 '',
          phone: consultant?.phone || 
                 analysisResults?.phone_number || 
                 analysisResults?.personalInfo?.phone || 
                 '',
          location: consultant?.location || 
                    analysisResults?.location || 
                    analysisResults?.personalInfo?.location || 
                    'Sweden'
        };

        console.log('✅ Enhanced extracted personal info:', extractedPersonalInfo);

        // Build complete results object
        const results = {
          cvAnalysis: analysisResults,
          linkedinAnalysis: response.data.linkedinData,
          consultant: consultant,
          extractedPersonalInfo: extractedPersonalInfo
        };

        console.log('🎉 Calling onComplete with enhanced results:', results);
        onComplete(results);

        // Show success message with extracted name
        toast({
          title: "Analys slutförd! 🎉",
          description: `CV och LinkedIn-profil analyserad${extractedPersonalInfo.name ? ` för ${extractedPersonalInfo.name}` : ''}`,
        });

      } catch (error: any) {
        console.error('❌ Background analysis failed:', error);
        toast({
          title: "Analys misslyckades",
          description: error.message || "Försök igen med en annan fil eller kontrollera din LinkedIn URL.",
          variant: "destructive",
        });
      }
    };

    runAnalysis();
  }, [file, linkedinUrl, onComplete, toast]);

  return null; // This component only handles background processing
};
