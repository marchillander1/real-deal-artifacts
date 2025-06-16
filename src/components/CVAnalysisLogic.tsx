
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const performCVAnalysis = async (
  file: File,
  setIsAnalyzing: (value: boolean) => void,
  setAnalysisProgress: (value: number) => void,
  setAnalysisResults: (value: any) => void,
  setFullName: (value: string) => void,
  setEmail: (value: string) => void,
  setPhoneNumber: (value: string) => void,
  setLinkedinUrl: (value: string) => void
) => {
  console.log('🚀 Starting CV analysis for file:', file.name);
  
  setIsAnalyzing(true);
  setAnalysisProgress(10);
  
  try {
    toast.info('📄 Processing CV file...');
    
    // Create FormData to send file properly
    const formData = new FormData();
    formData.append('file', file);
    
    setAnalysisProgress(30);
    console.log('✅ File prepared for analysis, calling parse-cv function...');
    
    // Call CV analysis function with FormData
    toast.info('🧠 AI analyzing CV...');
    const { data: cvData, error: cvError } = await supabase.functions.invoke('parse-cv', {
      body: formData
    });

    if (cvError) {
      console.error('❌ CV analysis failed:', cvError);
      throw new Error(`CV analysis failed: ${cvError.message}`);
    }

    console.log('✅ CV analysis completed:', cvData);
    setAnalysisProgress(60);
    
    // Auto-fill form fields if available
    if (cvData?.analysis?.personalInfo) {
      const info = cvData.analysis.personalInfo;
      if (info.name) {
        setFullName(info.name);
        console.log('📝 Auto-filled name:', info.name);
      }
      if (info.email) {
        setEmail(info.email);
        console.log('📝 Auto-filled email:', info.email);
      }
      if (info.phone) {
        setPhoneNumber(info.phone);
        console.log('📝 Auto-filled phone:', info.phone);
      }
      if (info.linkedinProfile) {
        const linkedinProfile = info.linkedinProfile.startsWith('http') 
          ? info.linkedinProfile 
          : `https://linkedin.com/in/${info.linkedinProfile}`;
        setLinkedinUrl(linkedinProfile);
        console.log('📝 Auto-filled LinkedIn:', linkedinProfile);
      }
    }

    setAnalysisProgress(90);
    
    // Set final results
    const finalResults = {
      cvAnalysis: cvData?.analysis || null,
      linkedinAnalysis: null, // Will be added later if LinkedIn URL provided
      timestamp: new Date().toISOString()
    };
    
    console.log('✅ Analysis complete:', finalResults);
    setAnalysisResults(finalResults);
    setAnalysisProgress(100);
    
    toast.success('🎉 CV analysis completed successfully!');

  } catch (error) {
    console.error('❌ Analysis failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Analysis failed';
    toast.error(`Analysis failed: ${errorMessage}`);
    setAnalysisResults(null);
  } finally {
    setIsAnalyzing(false);
    setTimeout(() => setAnalysisProgress(0), 2000);
  }
};
