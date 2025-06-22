
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

        // Use only the enhanced-profile-analysis function
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

        // Extract the results
        const results = {
          cvAnalysis: response.data.analysisResults,
          linkedinAnalysis: response.data.linkedinData,
          consultant: response.data.consultant
        };

        console.log('🎉 Calling onComplete with results:', results);
        onComplete(results);

      } catch (error: any) {
        console.error('❌ Background analysis failed:', error);
        toast({
          title: "Analysis failed",
          description: error.message || "Please try again with a different file or check your LinkedIn URL.",
          variant: "destructive",
        });
      }
    };

    runAnalysis();
  }, [file, linkedinUrl, onComplete, toast]);

  return null; // This component only handles background processing
};
