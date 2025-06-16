
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
  console.log('🚀 Starting comprehensive CV and LinkedIn analysis for:', file.name);
  
  setIsAnalyzing(true);
  setAnalysisProgress(5);
  
  try {
    // Convert file to base64
    setAnalysisProgress(10);
    toast.info('📄 Processing CV file...');
    
    const fileBuffer = await file.arrayBuffer();
    const fileBase64 = btoa(String.fromCharCode(...new Uint8Array(fileBuffer)));
    
    setAnalysisProgress(25);
    console.log('✅ File converted to base64, starting CV parsing...');
    
    // Step 1: Parse CV
    toast.info('🧠 AI analyzing CV content...');
    const { data: cvData, error: cvError } = await supabase.functions.invoke('parse-cv', {
      body: {
        file: fileBase64,
        fileName: file.name,
        fileType: file.type
      }
    });

    if (cvError) {
      console.error('❌ CV parsing failed:', cvError);
      throw new Error(`CV analysis failed: ${cvError.message}`);
    }

    if (!cvData?.analysis) {
      throw new Error('No CV analysis data received');
    }

    console.log('✅ CV analysis completed:', cvData.analysis);
    setAnalysisProgress(50);
    
    // Auto-populate form fields from CV
    const personalInfo = cvData.analysis.personalInfo;
    if (personalInfo) {
      if (personalInfo.name && !fullName) {
        setFullName(personalInfo.name);
        console.log('📝 Auto-filled name:', personalInfo.name);
      }
      if (personalInfo.email && !email) {
        setEmail(personalInfo.email);
        console.log('📝 Auto-filled email:', personalInfo.email);
      }
      if (personalInfo.phone && !phoneNumber) {
        setPhoneNumber(personalInfo.phone);
        console.log('📝 Auto-filled phone:', personalInfo.phone);
      }
      if (personalInfo.linkedinProfile && !linkedinUrl) {
        const linkedinProfile = personalInfo.linkedinProfile.startsWith('http') 
          ? personalInfo.linkedinProfile 
          : `https://linkedin.com/in/${personalInfo.linkedinProfile}`;
        setLinkedinUrl(linkedinProfile);
        console.log('📝 Auto-filled LinkedIn:', linkedinProfile);
      }
    }

    setAnalysisProgress(60);
    
    // Step 2: LinkedIn Analysis
    let linkedinAnalysis = null;
    const linkedinToAnalyze = linkedinUrl || personalInfo?.linkedinProfile;
    
    if (linkedinToAnalyze) {
      try {
        toast.info('🔗 Analyzing LinkedIn profile and recent posts...');
        console.log('🔗 Starting LinkedIn analysis for:', linkedinToAnalyze);
        
        const { data: linkedinData, error: linkedinError } = await supabase.functions.invoke('analyze-linkedin', {
          body: {
            linkedinUrl: linkedinToAnalyze,
            fullName: fullName || personalInfo?.name || 'Unknown',
            email: email || personalInfo?.email || 'unknown@email.com'
          }
        });

        if (linkedinError) {
          console.error('⚠️ LinkedIn analysis error:', linkedinError);
          toast.warning('LinkedIn analysis failed, continuing with CV only');
        } else if (linkedinData?.analysis) {
          linkedinAnalysis = linkedinData.analysis;
          console.log('✅ LinkedIn analysis completed:', linkedinAnalysis);
          toast.success('LinkedIn analysis completed successfully!');
        }
      } catch (linkedinErr) {
        console.error('⚠️ LinkedIn analysis exception:', linkedinErr);
        toast.warning('LinkedIn analysis failed, continuing with CV only');
      }
    } else {
      console.log('ℹ️ No LinkedIn URL provided, skipping LinkedIn analysis');
      toast.info('No LinkedIn URL provided - add LinkedIn for complete analysis');
    }

    setAnalysisProgress(90);
    
    // Combine results
    const completeAnalysis = {
      cvAnalysis: cvData.analysis,
      linkedinAnalysis: linkedinAnalysis,
      timestamp: new Date().toISOString()
    };
    
    console.log('✅ Complete analysis ready:', completeAnalysis);
    setAnalysisResults(completeAnalysis);
    setAnalysisProgress(100);
    
    toast.success('🎉 Complete professional analysis finished! Ready to submit.');

  } catch (error) {
    console.error('❌ Analysis failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    toast.error(`Analysis failed: ${errorMessage}`);
    setAnalysisResults(null);
  } finally {
    setIsAnalyzing(false);
    setTimeout(() => setAnalysisProgress(0), 2000);
  }
};
