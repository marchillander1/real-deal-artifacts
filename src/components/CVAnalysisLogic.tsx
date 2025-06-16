
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
    
    // Auto-fill form fields with better validation and formatting
    if (cvData?.analysis?.personalInfo) {
      const info = cvData.analysis.personalInfo;
      
      if (info.name && info.name.trim() && info.name !== 'Unknown') {
        setFullName(info.name.trim());
        console.log('📝 Auto-filled name:', info.name);
        toast.success(`✅ Found name: ${info.name}`);
      }
      
      if (info.email && info.email.includes('@') && info.email !== 'Unknown') {
        setEmail(info.email.trim());
        console.log('📝 Auto-filled email:', info.email);
        toast.success(`✅ Found email: ${info.email}`);
      }
      
      if (info.phone && info.phone.trim() && info.phone !== 'Unknown' && info.phone.length > 5) {
        // Clean up phone number format
        const cleanedPhone = info.phone.replace(/[^\d+\-\s]/g, '').trim();
        setPhoneNumber(cleanedPhone);
        console.log('📝 Auto-filled phone:', cleanedPhone);
        toast.success(`✅ Found phone: ${cleanedPhone}`);
      }
      
      if (info.linkedinProfile && info.linkedinProfile.trim() && info.linkedinProfile !== 'Unknown') {
        let linkedinProfile = info.linkedinProfile.trim();
        
        // Ensure proper LinkedIn URL format
        if (!linkedinProfile.startsWith('http')) {
          if (linkedinProfile.startsWith('linkedin.com/in/')) {
            linkedinProfile = `https://${linkedinProfile}`;
          } else if (linkedinProfile.startsWith('/in/')) {
            linkedinProfile = `https://linkedin.com${linkedinProfile}`;
          } else if (!linkedinProfile.includes('linkedin.com')) {
            linkedinProfile = `https://linkedin.com/in/${linkedinProfile}`;
          } else {
            linkedinProfile = `https://${linkedinProfile}`;
          }
        }
        
        setLinkedinUrl(linkedinProfile);
        console.log('📝 Auto-filled LinkedIn:', linkedinProfile);
        toast.success(`✅ Found LinkedIn: ${linkedinProfile}`);
      }
    }

    setAnalysisProgress(60);

    // LinkedIn Analysis if URL provided
    let linkedinAnalysis = null;
    const finalLinkedInUrl = linkedinUrl || cvData?.analysis?.personalInfo?.linkedinProfile;
    
    if (finalLinkedInUrl && finalLinkedInUrl.includes('linkedin.com')) {
      try {
        toast.info('🔗 Analyzing LinkedIn profile...');
        console.log('🔗 Starting LinkedIn analysis for:', finalLinkedInUrl);
        
        const { data: linkedinData, error: linkedinError } = await supabase.functions.invoke('analyze-linkedin', {
          body: { linkedinUrl: finalLinkedInUrl }
        });
        
        if (linkedinError) {
          console.warn('⚠️ LinkedIn analysis failed:', linkedinError);
          toast.warning('LinkedIn analysis failed, but CV analysis succeeded');
          // Create fallback LinkedIn analysis
          linkedinAnalysis = createFallbackLinkedInAnalysis();
        } else {
          linkedinAnalysis = linkedinData?.analysis || createFallbackLinkedInAnalysis();
          console.log('✅ LinkedIn analysis completed:', linkedinAnalysis);
          toast.success('🎉 LinkedIn analysis complete!');
        }
      } catch (linkedinErr) {
        console.warn('⚠️ LinkedIn analysis error:', linkedinErr);
        toast.warning('LinkedIn analysis encountered an issue, using fallback analysis');
        linkedinAnalysis = createFallbackLinkedInAnalysis();
      }
    } else {
      // If no LinkedIn URL, create basic fallback
      linkedinAnalysis = createFallbackLinkedInAnalysis();
      toast.info('ℹ️ No LinkedIn profile found, using basic analysis');
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
    
    toast.success('🎉 Complete CV analysis ready!');

  } catch (error) {
    console.error('❌ Analysis failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Analysis failed';
    toast.error(`Analysis failed: ${errorMessage}`);
    
    // Provide a basic fallback result so the form can still be submitted
    const fallbackResults = {
      cvAnalysis: {
        personalInfo: {
          name: 'Analysis failed',
          email: 'Analysis failed',
          phone: 'Analysis failed'
        },
        professionalSummary: {
          yearsOfExperience: 'Unknown',
          seniorityLevel: 'Mid-level',
          currentRole: 'Consultant'
        },
        marketPositioning: {
          hourlyRateEstimate: {
            min: 800,
            max: 1200,
            recommended: 1000,
            currency: 'SEK'
          }
        }
      },
      linkedinAnalysis: createFallbackLinkedInAnalysis(),
      improvementTips: {
        cvTips: [],
        linkedinTips: [],
        overallStrategy: []
      },
      timestamp: new Date().toISOString()
    };
    
    setAnalysisResults(fallbackResults);
  } finally {
    setIsAnalyzing(false);
    setTimeout(() => setAnalysisProgress(0), 2000);
  }
};

const createFallbackLinkedInAnalysis = () => {
  return {
    communicationStyle: 'Professional and clear communication',
    leadershipStyle: 'Collaborative leadership approach',
    problemSolving: 'Analytical problem-solving skills',
    teamCollaboration: 'Strong team collaboration abilities',
    innovation: 4,
    businessAcumen: 'Good business understanding',
    culturalFit: 4,
    leadership: 3,
    adaptability: 4
  };
};

const generateImprovementTips = (cvAnalysis: any, linkedinAnalysis: any) => {
  const tips = {
    cvTips: [],
    linkedinTips: [],
    overallStrategy: []
  };

  // CV Improvement Tips - More specific and actionable
  if (cvAnalysis) {
    // Technical Skills Section
    if (!cvAnalysis.technicalSkillsAnalysis?.programmingLanguages?.expert?.length) {
      tips.cvTips.push({
        category: 'Technical Skills',
        tip: 'Add a dedicated "Technical Skills" section with clear proficiency levels (Expert, Proficient, Familiar).',
        priority: 'High',
        action: 'Create sections: "Expert: [languages]", "Proficient: [frameworks]", "Tools: [software/platforms]"'
      });
    }

    // Professional Summary
    if (!cvAnalysis.professionalSummary?.yearsOfExperience || cvAnalysis.professionalSummary.yearsOfExperience === 'Unknown') {
      tips.cvTips.push({
        category: 'Professional Summary',
        tip: 'Add a 3-4 line professional summary that describes your experience and expertise.',
        priority: 'High',
        action: 'Write: "Experienced [X-year] [role] specialized in [technologies]. Proven track record in [key achievements]. Available for consulting assignments in [focus areas]."'
      });
    }

    // Work Experience
    if (!cvAnalysis.workExperience?.length || cvAnalysis.workExperience.length < 3) {
      tips.cvTips.push({
        category: 'Work Experience',
        tip: 'Expand your work experience with specific achievements, technologies used, and measurable results.',
        priority: 'High',
        action: 'For each role, add: Technologies used, Key achievements with numbers, Team size if you led people'
      });
    }

    // Missing certifications
    if (!cvAnalysis.education?.certifications?.length) {
      tips.cvTips.push({
        category: 'Certifications',
        tip: 'Add a "Certifications" section to show continuous professional development.',
        priority: 'Medium',
        action: 'Include: Professional certifications (AWS, Azure, GCP), Framework certifications, Industry certifications'
      });
    }
  }

  // LinkedIn Improvement Tips
  if (linkedinAnalysis) {
    if (linkedinAnalysis.culturalFit < 4) {
      tips.linkedinTips.push({
        category: 'Professional Presence',
        tip: 'Share more content about your work philosophy and professional values.',
        priority: 'Medium',
        action: 'Post weekly about: Successful projects, Team collaboration, Professional insights, Industry trends'
      });
    }

    if (linkedinAnalysis.leadership < 4) {
      tips.linkedinTips.push({
        category: 'Leadership Content',
        tip: 'Show leadership examples through posts about mentorship and technical decision-making.',
        priority: 'High',
        action: 'Share stories about: Leading technical projects, Mentorship, Architecture decisions, Problem-solving'
      });
    }
  } else {
    tips.linkedinTips.push({
      category: 'LinkedIn Profile',
      tip: 'Ensure your LinkedIn profile is public and complete.',
      priority: 'High',
      action: 'Update: Professional headline, Detailed work experience, Skills section, Public profile settings'
    });
  }

  // Overall Strategy Tips
  tips.overallStrategy.push({
    category: 'Consistent Branding',
    tip: 'Ensure your CV and LinkedIn tell the same professional story.',
    priority: 'High',
    action: 'Align: Job titles and dates, Skills and technologies, Professional summary, Key achievements'
  });

  tips.overallStrategy.push({
    category: 'Consultant Positioning',
    tip: 'Position yourself clearly as a consultant by emphasizing project-based work.',
    priority: 'High',
    action: 'Highlight: Consulting experience, Client results, Specialized skills, Availability for assignments'
  });

  console.log('📋 Generated detailed improvement tips:', tips);
  return tips;
};
