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

  // CV Improvement Tips - More specific and actionable
  if (cvAnalysis) {
    // Technical Skills Section
    if (!cvAnalysis.technicalExpertise?.programmingLanguages?.expert?.length) {
      tips.cvTips.push({
        category: 'Technical Skills Section',
        tip: 'Add a dedicated "Technical Skills" section at the top of your CV with clear skill levels (Expert, Proficient, Familiar). List programming languages, frameworks, and tools you use daily.',
        priority: 'High',
        action: 'Create sections: "Expert: [languages]", "Proficient: [frameworks]", "Tools: [software/platforms]"'
      });
    }

    // Professional Summary
    if (!cvAnalysis.professionalSummary?.yearsOfExperience || cvAnalysis.professionalSummary.yearsOfExperience === 'Unknown') {
      tips.cvTips.push({
        category: 'Professional Summary',
        tip: 'Add a 3-4 line professional summary at the top stating your years of experience, core expertise, and what type of consultant you are.',
        priority: 'High',
        action: 'Write: "Experienced [X-year] [role] specializing in [technologies]. Proven track record in [key achievements]. Available for consulting assignments in [focus areas]."'
      });
    }

    // Work Experience
    if (!cvAnalysis.workExperience?.length || cvAnalysis.workExperience.length < 3) {
      tips.cvTips.push({
        category: 'Work Experience',
        tip: 'Expand your work experience section with specific achievements, technologies used, and quantifiable results for each role.',
        priority: 'High',
        action: 'For each role, add: Technologies used, Key achievements with numbers (improved performance by X%, delivered Y projects), Team size if you led people'
      });
    }

    // Missing certifications
    if (!cvAnalysis.certifications?.length) {
      tips.cvTips.push({
        category: 'Certifications & Education',
        tip: 'Add a "Certifications" section to showcase your continuous learning and expertise validation.',
        priority: 'Medium',
        action: 'Include: Professional certifications (AWS, Azure, GCP), Framework certifications (React, Angular), Industry certifications (Scrum, PMP)'
      });
    }

    // Projects section
    if (!cvAnalysis.projects?.length) {
      tips.cvTips.push({
        category: 'Key Projects',
        tip: 'Add a "Key Projects" section highlighting 3-4 significant projects with technologies used and business impact.',
        priority: 'High',
        action: 'For each project: Project name, Technologies used, Your role, Duration, Key achievements/impact'
      });
    }

    // Contact information
    if (!cvAnalysis.personalInfo?.email || !cvAnalysis.personalInfo?.phone) {
      tips.cvTips.push({
        category: 'Contact Information',
        tip: 'Ensure your contact information is complete and prominently displayed at the top of your CV.',
        priority: 'High',
        action: 'Include: Full name, Professional email, Phone number, LinkedIn profile, Location (city, country)'
      });
    }

    // Language skills
    if (!cvAnalysis.personalInfo?.languages?.length) {
      tips.cvTips.push({
        category: 'Language Skills',
        tip: 'Add a "Languages" section showing your proficiency levels, especially important for international consulting.',
        priority: 'Medium',
        action: 'List languages with levels: "Swedish (Native), English (Fluent), [Other] (Conversational)"'
      });
    }
  }

  // LinkedIn Improvement Tips
  if (linkedinAnalysis) {
    if (linkedinAnalysis.culturalFit < 4) {
      tips.linkedinTips.push({
        category: 'Professional Presence',
        tip: 'Share more content about your work philosophy, team collaboration experiences, and professional values.',
        priority: 'Medium',
        action: 'Post weekly about: Successful projects, Team collaboration stories, Professional insights, Industry trends you\'re following'
      });
    }

    if (linkedinAnalysis.leadership < 4) {
      tips.linkedinTips.push({
        category: 'Leadership Content',
        tip: 'Showcase leadership experiences through posts about mentoring, technical decision-making, and project management.',
        priority: 'High',
        action: 'Share stories about: Leading technical projects, Mentoring team members, Making architectural decisions, Solving complex problems'
      });
    }

    if (!linkedinAnalysis.communicationStyle || linkedinAnalysis.communicationStyle.includes('unknown')) {
      tips.linkedinTips.push({
        category: 'Active Communication',
        tip: 'Increase your LinkedIn activity by posting technical insights and engaging meaningfully with others\' content.',
        priority: 'Medium',
        action: 'Weekly: Share 1 technical insight, Comment thoughtfully on 5-10 posts, Engage with your network\'s content'
      });
    }
  } else {
    tips.linkedinTips.push({
      category: 'LinkedIn Profile Setup',
      tip: 'Ensure your LinkedIn profile is public and complete with a professional headline and detailed experience section.',
      priority: 'High',
      action: 'Update: Professional headline with your expertise, Detailed work experience, Skills section, Public profile settings'
    });

    tips.linkedinTips.push({
      category: 'Professional Network',
      tip: 'Start building your professional network and sharing relevant content to establish your expertise.',
      priority: 'High',
      action: 'Connect with colleagues, Share industry insights, Join relevant professional groups, Post about your work'
    });
  }

  // Overall Strategy Tips
  tips.overallStrategy.push({
    category: 'Consistent Branding',
    tip: 'Ensure your CV and LinkedIn profile tell the same professional story with consistent information and messaging.',
    priority: 'High',
    action: 'Align: Job titles and dates, Skills and technologies, Professional summary/headline, Key achievements'
  });

  tips.overallStrategy.push({
    category: 'Consultant Positioning',
    tip: 'Position yourself clearly as a consultant by emphasizing project-based work, client impact, and specialized expertise.',
    priority: 'High',
    action: 'Highlight: Consulting experience, Client outcomes, Specialized skills, Availability for assignments'
  });

  tips.overallStrategy.push({
    category: 'Market Readiness',
    tip: 'Ensure both your CV and LinkedIn clearly communicate your current availability and areas of interest for consulting work.',
    priority: 'Medium',
    action: 'Add: "Available for consulting assignments", Preferred project types, Remote/on-site preferences, Expected start date'
  });

  console.log('📋 Generated detailed improvement tips:', tips);
  return tips;
};
