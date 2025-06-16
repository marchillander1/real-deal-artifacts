
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
  console.log('🚀 Starting CV analysis for file:', file.name);
  
  setIsAnalyzing(true);
  setAnalysisProgress(10);
  
  try {
    toast.info('📄 Processing CV file...');
    
    // Convert file to base64
    const fileBuffer = await file.arrayBuffer();
    const fileBase64 = btoa(String.fromCharCode(...new Uint8Array(fileBuffer)));
    
    setAnalysisProgress(30);
    console.log('✅ File converted to base64, starting analysis...');
    
    // Call CV analysis function
    toast.info('🧠 AI analyzing CV...');
    const { data: cvData, error: cvError } = await supabase.functions.invoke('parse-cv', {
      body: {
        file: fileBase64,
        fileName: file.name,
        fileType: file.type
      }
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
      if (info.name && !fullName) {
        setFullName(info.name);
        console.log('📝 Auto-filled name:', info.name);
      }
      if (info.email && !email) {
        setEmail(info.email);
        console.log('📝 Auto-filled email:', info.email);
      }
      if (info.phone && !phoneNumber) {
        setPhoneNumber(info.phone);
        console.log('📝 Auto-filled phone:', info.phone);
      }
      if (info.linkedinProfile && !linkedinUrl) {
        const linkedinProfile = info.linkedinProfile.startsWith('http') 
          ? info.linkedinProfile 
          : `https://linkedin.com/in/${info.linkedinProfile}`;
        setLinkedinUrl(linkedinProfile);
        console.log('📝 Auto-filled LinkedIn:', linkedinProfile);
      }
    }

    // LinkedIn analysis if URL is available
    let linkedinAnalysis = null;
    const linkedinToAnalyze = linkedinUrl || cvData?.analysis?.personalInfo?.linkedinProfile;
    
    if (linkedinToAnalyze) {
      try {
        setAnalysisProgress(70);
        toast.info('🔗 Analyzing LinkedIn profile...');
        console.log('🔗 Starting LinkedIn analysis for:', linkedinToAnalyze);
        
        const { data: linkedinData, error: linkedinError } = await supabase.functions.invoke('analyze-linkedin', {
          body: {
            linkedinUrl: linkedinToAnalyze,
            fullName: fullName || cvData?.analysis?.personalInfo?.name || 'Unknown',
            email: email || cvData?.analysis?.personalInfo?.email || 'unknown@email.com'
          }
        });

        if (linkedinError) {
          console.error('⚠️ LinkedIn analysis error:', linkedinError);
          toast.warning('LinkedIn analysis failed, continuing with CV only');
        } else if (linkedinData?.analysis) {
          linkedinAnalysis = linkedinData.analysis;
          console.log('✅ LinkedIn analysis completed:', linkedinAnalysis);
          toast.success('LinkedIn analysis completed!');
        }
      } catch (error) {
        console.error('⚠️ LinkedIn analysis exception:', error);
        toast.warning('LinkedIn analysis failed, continuing with CV only');
      }
    }

    setAnalysisProgress(90);
    
    // Combine results
    const finalResults = {
      cvAnalysis: cvData?.analysis || null,
      linkedinAnalysis: linkedinAnalysis,
      timestamp: new Date().toISOString()
    };
    
    console.log('✅ Analysis complete:', finalResults);
    setAnalysisResults(finalResults);
    setAnalysisProgress(100);
    
    toast.success('🎉 Analysis completed successfully!');

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
