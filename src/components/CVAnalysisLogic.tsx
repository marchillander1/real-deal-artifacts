
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
  linkedinUrl?: string
) => {
  console.log('🚀 Starting comprehensive CV and LinkedIn analysis for file:', file.name);
  
  setIsAnalyzing(true);
  setAnalysisProgress(10);
  
  try {
    toast.info('📄 Processing CV file...');
    
    // Create FormData to send file properly
    const formData = new FormData();
    formData.append('file', file);
    
    setAnalysisProgress(30);
    console.log('✅ File prepared for analysis, calling parse-cv function...');
    
    // Call CV analysis function
    toast.info('🧠 AI analyzing CV...');
    const { data: cvData, error: cvError } = await supabase.functions.invoke('parse-cv', {
      body: formData
    });

    if (cvError) {
      console.error('❌ CV analysis failed:', cvError);
      throw new Error(`CV analysis failed: ${cvError.message}`);
    }

    console.log('✅ CV analysis completed:', cvData);
    setAnalysisProgress(50);
    
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

    setAnalysisProgress(60);

    // LinkedIn Analysis if URL provided
    let linkedinAnalysis = null;
    const finalLinkedInUrl = linkedinUrl || cvData?.analysis?.personalInfo?.linkedinProfile;
    
    if (finalLinkedInUrl) {
      try {
        toast.info('🔗 Analyzing LinkedIn profile...');
        console.log('🔗 Starting LinkedIn analysis for:', finalLinkedInUrl);
        
        const { data: linkedinData, error: linkedinError } = await supabase.functions.invoke('analyze-linkedin', {
          body: { linkedinUrl: finalLinkedInUrl }
        });
        
        if (linkedinError) {
          console.warn('⚠️ LinkedIn analysis failed:', linkedinError);
          toast.warning('LinkedIn analysis failed, but CV analysis succeeded');
        } else {
          linkedinAnalysis = linkedinData?.analysis;
          console.log('✅ LinkedIn analysis completed:', linkedinAnalysis);
          toast.success('🎉 LinkedIn analysis completed!');
        }
      } catch (linkedinErr) {
        console.warn('⚠️ LinkedIn analysis error:', linkedinErr);
        toast.warning('LinkedIn analysis encountered an error');
      }
    }

    setAnalysisProgress(80);
    
    // Generate improvement tips
    const improvementTips = generateImprovementTips(cvData?.analysis, linkedinAnalysis);
    
    // Set final results with improvement tips
    const finalResults = {
      cvAnalysis: cvData?.analysis || null,
      linkedinAnalysis: linkedinAnalysis,
      improvementTips: improvementTips,
      timestamp: new Date().toISOString()
    };
    
    console.log('✅ Complete analysis finished:', finalResults);
    setAnalysisResults(finalResults);
    setAnalysisProgress(100);
    
    toast.success('🎉 Complete CV and LinkedIn analysis completed successfully!');

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

const generateImprovementTips = (cvAnalysis: any, linkedinAnalysis: any) => {
  const tips = {
    cvTips: [],
    linkedinTips: [],
    overallStrategy: []
  };

  // CV Improvement Tips (in English)
  if (cvAnalysis) {
    if (!cvAnalysis.technicalExpertise?.programmingLanguages?.expert?.length) {
      tips.cvTips.push({
        category: 'Technical Skills',
        tip: 'Clearly highlight your expert-level programming languages and frameworks at the top of your CV to immediately catch recruiters\' attention',
        priority: 'High',
        action: 'Create a "Technical Expertise" section with tiered skill levels (Expert, Proficient, Familiar)'
      });
    }

    if (!cvAnalysis.professionalSummary?.yearsOfExperience || cvAnalysis.professionalSummary.yearsOfExperience === 'Unknown') {
      tips.cvTips.push({
        category: 'Professional Summary',
        tip: 'Add a clear statement of your years of experience and seniority level in the first few lines',
        priority: 'High',
        action: 'Include "X+ years of experience as a [Role]" in your professional summary'
      });
    }

    if (!cvAnalysis.certifications?.length && !cvAnalysis.certifications?.development?.length) {
      tips.cvTips.push({
        category: 'Certifications',
        tip: 'Consider adding relevant technical certifications to boost your credibility and market value',
        priority: 'Medium',
        action: 'Pursue cloud certifications (AWS, Azure, GCP) or framework-specific certifications'
      });
    }

    if (!cvAnalysis.marketPositioning?.uniqueValueProposition) {
      tips.cvTips.push({
        category: 'Value Proposition',
        tip: 'Create a compelling unique value proposition that sets you apart from other consultants',
        priority: 'High',
        action: 'Write 2-3 sentences highlighting what makes you uniquely valuable to clients'
      });
    }

    if (!cvAnalysis.professionalSummary?.specializations?.length) {
      tips.cvTips.push({
        category: 'Specialization',
        tip: 'Clearly define your technical specializations and niche areas of expertise',
        priority: 'Medium',
        action: 'Add a "Specializations" section highlighting your key focus areas'
      });
    }
  }

  // LinkedIn Improvement Tips (in English)
  if (linkedinAnalysis) {
    if (linkedinAnalysis.culturalFit < 4) {
      tips.linkedinTips.push({
        category: 'Cultural Fit',
        tip: 'Share more content about team collaboration, company culture, and your values alignment',
        priority: 'Medium',
        action: 'Post about successful team projects and what you value in workplace culture'
      });
    }

    if (linkedinAnalysis.leadership < 4) {
      tips.linkedinTips.push({
        category: 'Leadership',
        tip: 'Showcase your leadership experiences, mentoring activities, and team management skills',
        priority: 'High',
        action: 'Write posts about leading projects, mentoring junior developers, or driving technical decisions'
      });
    }

    if (!linkedinAnalysis.communicationStyle || linkedinAnalysis.communicationStyle.includes('unknown') || linkedinAnalysis.communicationStyle.includes('Unable')) {
      tips.linkedinTips.push({
        category: 'Communication',
        tip: 'Be more active in posting and commenting to showcase your professional communication style',
        priority: 'Medium',
        action: 'Share technical insights, comment thoughtfully on industry posts, and engage with your network'
      });
    }

    if (linkedinAnalysis.innovation < 4) {
      tips.linkedinTips.push({
        category: 'Innovation',
        tip: 'Share content about innovative solutions, new technologies you\'re exploring, or creative problem-solving',
        priority: 'Medium',
        action: 'Post about new tools/technologies you\'re learning or innovative approaches you\'ve used'
      });
    }
  } else {
    tips.linkedinTips.push({
      category: 'LinkedIn Presence',
      tip: 'Ensure your LinkedIn profile is public and accessible for proper analysis and visibility',
      priority: 'High',
      action: 'Update your LinkedIn privacy settings to allow public visibility of your profile'
    });

    tips.linkedinTips.push({
      category: 'Professional Activity',
      tip: 'Start building your professional presence on LinkedIn with regular posts and engagement',
      priority: 'High',
      action: 'Share weekly insights about your work, industry trends, or technical learnings'
    });
  }

  // Overall Strategy Tips (in English)
  tips.overallStrategy.push({
    category: 'Cohesive Branding',
    tip: 'Ensure your CV technical skills align perfectly with your LinkedIn professional narrative and posts',
    priority: 'High',
    action: 'Review both profiles to ensure consistent messaging about your expertise and career focus'
  });

  tips.overallStrategy.push({
    category: 'Network Building',
    tip: 'Regularly engage with industry content and share insights to build your professional brand and visibility',
    priority: 'Medium',
    action: 'Set aside 15 minutes daily for LinkedIn engagement and monthly CV updates'
  });

  tips.overallStrategy.push({
    category: 'Market Positioning',
    tip: 'Position yourself as a specialist in your strongest technical areas while showing adaptability',
    priority: 'High',
    action: 'Focus your content and CV on 2-3 core technical strengths while mentioning related skills'
  });

  console.log('📋 Generated improvement tips:', tips);
  return tips;
};
