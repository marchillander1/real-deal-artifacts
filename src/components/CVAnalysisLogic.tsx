
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
  
  // Validate that both CV and LinkedIn URL are provided
  if (!linkedinUrl || !linkedinUrl.includes('linkedin.com')) {
    toast.error('Both CV file and valid LinkedIn URL are required for comprehensive analysis');
    return;
  }
  
  setIsAnalyzing(true);
  setAnalysisProgress(10);
  
  try {
    toast.info('📄 Processing CV file...');
    
    // Create FormData to send file properly
    const formData = new FormData();
    formData.append('file', file);
    
    setAnalysisProgress(20);
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
    setAnalysisProgress(40);
    
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
    }

    setAnalysisProgress(50);

    // Enhanced LinkedIn Analysis - Now required and comprehensive
    let linkedinAnalysis = null;
    
    try {
      toast.info('🔗 Analyzing LinkedIn profile, posts, and bio...');
      console.log('🔗 Starting comprehensive LinkedIn analysis for:', linkedinUrl);
      
      const { data: linkedinData, error: linkedinError } = await supabase.functions.invoke('analyze-linkedin', {
        body: { 
          linkedinUrl: linkedinUrl,
          includeRecentPosts: true,
          includeBioSummary: true,
          postLimit: 30
        }
      });
      
      if (linkedinError) {
        console.error('❌ LinkedIn analysis failed:', linkedinError);
        throw new Error(`LinkedIn analysis failed: ${linkedinError.message}`);
      }
      
      linkedinAnalysis = linkedinData?.analysis;
      console.log('✅ LinkedIn analysis completed:', linkedinAnalysis);
      toast.success('🎉 LinkedIn analysis complete - including recent posts and bio!');
      
    } catch (linkedinErr) {
      console.error('❌ LinkedIn analysis error:', linkedinErr);
      toast.error('LinkedIn analysis failed. Both CV and LinkedIn are required for comprehensive analysis.');
      throw new Error(`LinkedIn analysis is required: ${linkedinErr instanceof Error ? linkedinErr.message : 'Unknown error'}`);
    }

    setAnalysisProgress(80);
    
    // Generate comprehensive improvement tips
    const improvementTips = generateImprovementTips(cvData?.analysis, linkedinAnalysis);
    
    // Set final results with improvement tips
    const finalResults = {
      cvAnalysis: cvData?.analysis || null,
      linkedinAnalysis: linkedinAnalysis,
      improvementTips: improvementTips,
      timestamp: new Date().toISOString()
    };
    
    console.log('✅ Complete comprehensive analysis finished:', finalResults);
    setAnalysisResults(finalResults);
    setAnalysisProgress(100);
    
    toast.success('🎉 Complete comprehensive CV and LinkedIn analysis ready!');

  } catch (error) {
    console.error('❌ Analysis failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Analysis failed';
    toast.error(`Comprehensive analysis failed: ${errorMessage}`);
    
    // Reset analysis state on failure
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

  // Enhanced LinkedIn Improvement Tips based on posts and bio analysis
  if (linkedinAnalysis) {
    // Content engagement tips based on recent posts
    if (linkedinAnalysis.recentPostsAnalysis) {
      if (linkedinAnalysis.recentPostsAnalysis.postFrequency === 'Low') {
        tips.linkedinTips.push({
          category: 'Content Strategy',
          tip: 'Increase posting frequency to build professional visibility and thought leadership.',
          priority: 'High',
          action: 'Aim for 2-3 posts per week about: Technical insights, Project learnings, Industry trends, Professional development'
        });
      }
      
      if (linkedinAnalysis.recentPostsAnalysis.engagementLevel === 'Low') {
        tips.linkedinTips.push({
          category: 'Engagement',
          tip: 'Improve post engagement by adding questions and calls-to-action.',
          priority: 'Medium',
          action: 'End posts with: "What\'s your experience with [topic]?", "How do you handle [situation]?", or "Share your thoughts below"'
        });
      }
    }

    // Bio/Summary optimization
    if (linkedinAnalysis.bioAnalysis?.needsImprovement) {
      tips.linkedinTips.push({
        category: 'Profile Summary',
        tip: 'Optimize your LinkedIn summary to better highlight your consulting expertise.',
        priority: 'High',
        action: 'Include: Years of experience, Key specializations, Notable achievements, Available for consulting'
      });
    }

    // Professional networking
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

  tips.overallStrategy.push({
    category: 'Thought Leadership',
    tip: 'Build thought leadership through consistent content sharing on LinkedIn.',
    priority: 'Medium',
    action: 'Share: Technical insights, Industry analysis, Project case studies, Professional development tips'
  });

  console.log('📋 Generated comprehensive improvement tips:', tips);
  return tips;
};
