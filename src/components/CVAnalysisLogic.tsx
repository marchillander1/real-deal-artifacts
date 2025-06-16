
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
  setLinkedinUrl: (value: string) => void,
  fullName: string,
  email: string,
  phoneNumber: string,
  linkedinUrl: string
) => {
  console.log('Starting comprehensive analysis for file:', file.name);
  
  setIsAnalyzing(true);
  setAnalysisProgress(10);
  toast.info('🧠 AI analyzing your CV and extracting comprehensive professional information...');

  try {
    // Convert file to base64
    const fileBuffer = await file.arrayBuffer();
    const fileBase64 = btoa(String.fromCharCode(...new Uint8Array(fileBuffer)));

    console.log('Sending CV for comprehensive parsing...');
    setAnalysisProgress(30);
    
    // Call the parse-cv edge function
    const { data: parseData, error: parseError } = await supabase.functions.invoke('parse-cv', {
      body: {
        file: fileBase64,
        fileName: file.name,
        fileType: file.type
      }
    });

    if (parseError) {
      console.error('Parse error:', parseError);
      throw new Error(`CV parsing failed: ${parseError.message}`);
    }

    if (!parseData || !parseData.analysis) {
      throw new Error('No analysis data returned from CV parsing');
    }

    console.log('CV analyzed successfully with comprehensive data:', parseData);
    setAnalysisProgress(60);
    
    // Auto-populate form fields from CV analysis
    if (parseData.analysis?.personalInfo) {
      const personalInfo = parseData.analysis.personalInfo;
      
      if (personalInfo.name && !fullName) {
        setFullName(personalInfo.name);
        console.log('Auto-filled name:', personalInfo.name);
      }
      if (personalInfo.email && !email) {
        setEmail(personalInfo.email);
        console.log('Auto-filled email:', personalInfo.email);
      }
      if (personalInfo.phone && !phoneNumber) {
        setPhoneNumber(personalInfo.phone);
        console.log('Auto-filled phone:', personalInfo.phone);
      }
      if (personalInfo.linkedinProfile && !linkedinUrl) {
        const linkedinProfile = personalInfo.linkedinProfile.startsWith('http') 
          ? personalInfo.linkedinProfile 
          : `https://linkedin.com/in/${personalInfo.linkedinProfile}`;
        setLinkedinUrl(linkedinProfile);
        console.log('Auto-filled LinkedIn:', linkedinProfile);
      }
    }

    setAnalysisProgress(80);

    // Call LinkedIn analysis
    let linkedinAnalysis = null;
    const linkedinToAnalyze = linkedinUrl || parseData.analysis?.personalInfo?.linkedinProfile;
    
    if (linkedinToAnalyze) {
      try {
        console.log('Analyzing LinkedIn profile for comprehensive soft skills analysis...', linkedinToAnalyze);
        const { data: linkedinData, error: linkedinError } = await supabase.functions.invoke('analyze-linkedin', {
          body: {
            linkedinUrl: linkedinToAnalyze,
            fullName: fullName || parseData.analysis?.personalInfo?.name || 'Unknown',
            email: email || parseData.analysis?.personalInfo?.email || 'unknown@email.com'
          }
        });

        if (linkedinError) {
          console.error('LinkedIn analysis error:', linkedinError);
          console.warn('Continuing with CV analysis only - LinkedIn analysis failed');
        } else if (linkedinData?.analysis) {
          linkedinAnalysis = linkedinData.analysis;
          console.log('LinkedIn analysis completed with comprehensive soft skills:', linkedinAnalysis);
        }
      } catch (linkedinErr) {
        console.error('LinkedIn analysis failed:', linkedinErr);
        console.warn('Continuing with CV analysis only');
      }
    }

    setAnalysisProgress(100);

    // Set comprehensive analysis results
    const completeAnalysis = {
      cvAnalysis: parseData.analysis,
      linkedinAnalysis: linkedinAnalysis
    };
    
    setAnalysisResults(completeAnalysis);
    
    toast.success('🎉 Comprehensive analysis completed! Review your complete professional profile and join our network.');

  } catch (error) {
    console.error('Analysis error:', error);
    toast.error(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`);
  } finally {
    setIsAnalyzing(false);
    setAnalysisProgress(0);
  }
};
