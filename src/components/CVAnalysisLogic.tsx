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
  console.log('🚀 Starting enhanced comprehensive CV and LinkedIn analysis for file:', file.name);
  
  if (!linkedinUrl || !linkedinUrl.includes('linkedin.com')) {
    toast.error('Both CV file and valid LinkedIn URL are required for comprehensive analysis');
    return;
  }
  
  setIsAnalyzing(true);
  setAnalysisProgress(10);
  
  try {
    toast.info('📄 Processing CV file...');
    
    const formData = new FormData();
    formData.append('file', file);
    
    setAnalysisProgress(20);
    console.log('✅ File prepared for analysis, calling parse-cv function...');
    
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
        const cleanedPhone = info.phone.replace(/[^\d+\-\s]/g, '').trim();
        setPhoneNumber(cleanedPhone);
        console.log('📝 Auto-filled phone:', cleanedPhone);
        toast.success(`✅ Found phone: ${cleanedPhone}`);
      }
    }

    setAnalysisProgress(50);

    let linkedinAnalysis = null;
    
    try {
      toast.info('🔗 Analyzing LinkedIn profile, posts, and bio comprehensively...');
      console.log('🔗 Starting enhanced LinkedIn analysis for:', linkedinUrl);
      
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
      console.log('✅ Enhanced LinkedIn analysis completed:', linkedinAnalysis);
      toast.success('🎉 Enhanced LinkedIn analysis complete - including market positioning and team fit!');
      
    } catch (linkedinErr) {
      console.error('❌ LinkedIn analysis error:', linkedinErr);
      toast.error('LinkedIn analysis failed. Both CV and LinkedIn are required for comprehensive analysis.');
      throw new Error(`LinkedIn analysis is required: ${linkedinErr instanceof Error ? linkedinErr.message : 'Unknown error'}`);
    }

    setAnalysisProgress(80);
    
    const enhancedImprovementTips = generateEnhancedImprovementTips(cvData?.analysis, linkedinAnalysis);
    const certificationRecommendations = generateCertificationRecommendations(cvData?.analysis, linkedinAnalysis);
    const roiPredictions = generateROIPredictions(cvData?.analysis, linkedinAnalysis);
    const technicalAssessment = generateTechnicalAssessment(cvData?.analysis, linkedinAnalysis);
    const preUploadGuidance = generatePreUploadGuidance(cvData?.analysis, linkedinAnalysis);
    
    const finalResults = {
      cvAnalysis: cvData?.analysis || null,
      linkedinAnalysis: linkedinAnalysis,
      improvementTips: enhancedImprovementTips,
      certificationRecommendations: certificationRecommendations,
      roiPredictions: roiPredictions,
      technicalAssessment: technicalAssessment,
      preUploadGuidance: preUploadGuidance,
      timestamp: new Date().toISOString()
    };
    
    console.log('✅ Enhanced comprehensive analysis finished:', finalResults);
    setAnalysisResults(finalResults);
    setAnalysisProgress(100);
    
    toast.success('🎉 Enhanced comprehensive CV and LinkedIn analysis ready!');

  } catch (error) {
    console.error('❌ Analysis failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Analysis failed';
    toast.error(`Comprehensive analysis failed: ${errorMessage}`);
    
    setAnalysisResults(null);
  } finally {
    setIsAnalyzing(false);
    setTimeout(() => setAnalysisProgress(0), 2000);
  }
};

const generateTechnicalAssessment = (cvAnalysis: any, linkedinAnalysis: any) => {
  const assessment = {
    skillsGapAnalysis: {
      missing: [],
      outdated: [],
      emerging: [],
      strengths: []
    },
    technicalMaturity: {
      frontendScore: 0,
      backendScore: 0,
      devopsScore: 0,
      dataScore: 0,
      overallLevel: 'Junior'
    },
    marketDemandAnalysis: {
      highDemandSkills: [],
      growingSkills: [],
      decliningSkills: [],
      futureSkills: []
    },
    improvementPriority: []
  };

  // Analyze current skills
  const allSkills = [];
  if (cvAnalysis?.technicalExpertise?.programmingLanguages?.expert) {
    allSkills.push(...cvAnalysis.technicalExpertise.programmingLanguages.expert);
  }
  if (cvAnalysis?.technicalExpertise?.frameworks) {
    allSkills.push(...cvAnalysis.technicalExpertise.frameworks);
  }
  if (cvAnalysis?.technicalExpertise?.tools) {
    allSkills.push(...cvAnalysis.technicalExpertise.tools);
  }

  // High demand skills in Swedish market 2024
  const highDemandSkills = ['React', 'Node.js', 'Python', 'AWS', 'Docker', 'Kubernetes', 'TypeScript', 'Azure', 'PostgreSQL', 'Git'];
  const emergingSkills = ['Next.js', 'GraphQL', 'Terraform', 'Golang', 'Rust', 'Machine Learning', 'AI/ML', 'Microservices'];
  const decliningSkills = ['jQuery', 'AngularJS', 'Flash', 'PHP 5', 'Internet Explorer'];

  // Identify gaps
  assessment.skillsGapAnalysis.missing = highDemandSkills.filter(skill => 
    !allSkills.some(userSkill => userSkill.toLowerCase().includes(skill.toLowerCase()))
  );

  assessment.skillsGapAnalysis.strengths = allSkills.filter(skill => 
    highDemandSkills.some(demandSkill => skill.toLowerCase().includes(demandSkill.toLowerCase()))
  );

  assessment.skillsGapAnalysis.emerging = emergingSkills.filter(skill => 
    allSkills.some(userSkill => userSkill.toLowerCase().includes(skill.toLowerCase()))
  );

  // Calculate technical maturity scores
  const frontendSkills = ['React', 'Vue', 'Angular', 'JavaScript', 'TypeScript', 'CSS', 'HTML'];
  const backendSkills = ['Node.js', 'Python', 'Java', 'C#', 'Go', 'Rust'];
  const devopsSkills = ['Docker', 'Kubernetes', 'AWS', 'Azure', 'Terraform', 'Jenkins'];
  const dataSkills = ['SQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch'];

  assessment.technicalMaturity.frontendScore = calculateSkillScore(allSkills, frontendSkills);
  assessment.technicalMaturity.backendScore = calculateSkillScore(allSkills, backendSkills);
  assessment.technicalMaturity.devopsScore = calculateSkillScore(allSkills, devopsSkills);
  assessment.technicalMaturity.dataScore = calculateSkillScore(allSkills, dataSkills);

  const averageScore = (assessment.technicalMaturity.frontendScore + 
                       assessment.technicalMaturity.backendScore + 
                       assessment.technicalMaturity.devopsScore + 
                       assessment.technicalMaturity.dataScore) / 4;

  if (averageScore >= 8) assessment.technicalMaturity.overallLevel = 'Expert';
  else if (averageScore >= 6) assessment.technicalMaturity.overallLevel = 'Senior';
  else if (averageScore >= 4) assessment.technicalMaturity.overallLevel = 'Mid-level';
  else assessment.technicalMaturity.overallLevel = 'Junior';

  // Generate improvement priorities
  if (assessment.skillsGapAnalysis.missing.length > 0) {
    assessment.improvementPriority.push({
      category: 'Critical Skills Gap',
      priority: 'High',
      skills: assessment.skillsGapAnalysis.missing.slice(0, 3),
      reason: 'These skills are in high demand but missing from your profile',
      timeline: '3-6 months'
    });
  }

  if (assessment.technicalMaturity.devopsScore < 5) {
    assessment.improvementPriority.push({
      category: 'DevOps & Cloud',
      priority: 'High',
      skills: ['Docker', 'AWS', 'Kubernetes'],
      reason: 'DevOps skills are essential for modern development',
      timeline: '2-4 months'
    });
  }

  return assessment;
};

const calculateSkillScore = (userSkills: string[], categorySkills: string[]): number => {
  const matches = userSkills.filter(userSkill => 
    categorySkills.some(catSkill => userSkill.toLowerCase().includes(catSkill.toLowerCase()))
  );
  return Math.min(10, (matches.length / categorySkills.length) * 10);
};

const generatePreUploadGuidance = (cvAnalysis: any, linkedinAnalysis: any) => {
  return {
    cvOptimization: {
      immediate: [
        {
          area: 'Technical Skills Section',
          action: 'Add a dedicated "Technical Skills" section with clear categorization',
          template: 'Expert: [3-5 languages], Proficient: [5-8 frameworks/tools], Familiar: [2-4 emerging tech]',
          impact: 'High - Makes technical competence immediately visible'
        },
        {
          area: 'Professional Summary',
          action: 'Write a 3-4 line summary highlighting years of experience and key technologies',
          template: 'Experienced [X-year] [role] specializing in [main tech stack]. Proven track record in [key achievements]. Available for consulting in [focus areas].',
          impact: 'High - First impression optimization'
        },
        {
          area: 'Quantified Achievements',
          action: 'Add numbers to your accomplishments in each role',
          template: 'Led team of X developers, Reduced load time by X%, Implemented solution serving X users',
          impact: 'Medium - Demonstrates measurable impact'
        }
      ],
      advanced: [
        {
          area: 'Project Portfolios',
          action: 'Add 2-3 detailed project descriptions with tech stack and results',
          template: 'Project: [Name] | Tech: [Stack] | Role: [Your role] | Result: [Business impact]',
          impact: 'High - Shows practical application'
        },
        {
          area: 'Certifications Section',
          action: 'List all relevant certifications with dates',
          template: 'AWS Certified Solutions Architect (2024), Certified Kubernetes Administrator (2023)',
          impact: 'Medium - Validates expertise'
        }
      ]
    },
    linkedinOptimization: {
      profile: [
        {
          area: 'Headline Optimization',
          action: 'Update headline to include key technologies and "Available for Consulting"',
          template: '[Role] | [Key Tech Stack] | Available for Consulting Projects',
          impact: 'High - Search visibility'
        },
        {
          area: 'About Section',
          action: 'Write compelling about section with client focus',
          template: 'I help companies [solve specific problems] using [technologies]. [X years] experience in [industries]. Available for [project types].',
          impact: 'High - Client attraction'
        },
        {
          area: 'Skills Section',
          action: 'Add and get endorsements for top 10 most relevant skills',
          template: 'Focus on skills that match job descriptions you want',
          impact: 'Medium - Algorithm boost'
        }
      ],
      content: [
        {
          area: 'Weekly Tech Posts',
          action: 'Share 1-2 posts per week about technology trends or learnings',
          template: 'Technical insights, project learnings, industry observations',
          impact: 'High - Thought leadership'
        },
        {
          area: 'Case Study Posts',
          action: 'Write about projects you\'ve worked on (anonymized)',
          template: 'Challenge → Solution → Result format with technical details',
          impact: 'High - Demonstrates expertise'
        }
      ]
    },
    marketPositioning: [
      {
        strategy: 'Niche Specialization',
        action: 'Focus on 2-3 specific technology combinations',
        example: 'React + Node.js + AWS for e-commerce platforms',
        timeline: '1-2 months to establish positioning'
      },
      {
        strategy: 'Industry Focus',
        action: 'Target specific industries where your experience fits',
        example: 'Fintech, E-commerce, SaaS, or HealthTech',
        timeline: '2-3 months to build industry credibility'
      },
      {
        strategy: 'Thought Leadership',
        action: 'Start sharing insights and building personal brand',
        example: 'Write about technology trends, best practices, lessons learned',
        timeline: '3-6 months to see results'
      }
    ],
    timeline: {
      week1: ['Update CV technical skills section', 'Optimize LinkedIn headline and about section'],
      week2: ['Add quantified achievements to CV', 'Start posting technical content on LinkedIn'],
      month1: ['Complete CV optimization', 'Build consistent LinkedIn presence'],
      month2: ['Focus on niche positioning', 'Engage with industry discussions'],
      month3: ['Establish thought leadership', 'Start receiving inbound opportunities']
    }
  };
};

const generateEnhancedImprovementTips = (cvAnalysis: any, linkedinAnalysis: any) => {
  const tips = {
    cvTips: [],
    linkedinTips: [],
    marketPositioning: [],
    teamFitOptimization: [],
    overallStrategy: []
  };

  if (cvAnalysis) {
    if (!cvAnalysis.technicalSkillsAnalysis?.programmingLanguages?.expert?.length) {
      tips.cvTips.push({
        category: 'Technical Skills',
        tip: 'Add a dedicated "Technical Skills" section with clear proficiency levels (Expert, Proficient, Familiar).',
        priority: 'High',
        action: 'Create sections: "Expert: [languages]", "Proficient: [frameworks]", "Tools: [software/platforms]"'
      });
    }

    if (!cvAnalysis.professionalSummary?.yearsOfExperience || cvAnalysis.professionalSummary.yearsOfExperience === 'Unknown') {
      tips.cvTips.push({
        category: 'Professional Summary',
        tip: 'Add a 3-4 line professional summary that describes your experience and expertise.',
        priority: 'High',
        action: 'Write: "Experienced [X-year] [role] specialized in [technologies]. Proven track record in [key achievements]. Available for consulting assignments in [focus areas]."'
      });
    }

    if (!cvAnalysis.workExperience?.length || cvAnalysis.workExperience.length < 3) {
      tips.cvTips.push({
        category: 'Work Experience',
        tip: 'Expand your work experience with specific achievements, technologies used, and measurable results.',
        priority: 'High',
        action: 'For each role, add: Technologies used, Key achievements with numbers, Team size if you led people'
      });
    }

    if (!cvAnalysis.education?.certifications?.length) {
      tips.cvTips.push({
        category: 'Certifications',
        tip: 'Add a "Certifications" section to show continuous professional development.',
        priority: 'Medium',
        action: 'Include: Professional certifications (AWS, Azure, GCP), Framework certifications, Industry certifications'
      });
    }
  }

  if (linkedinAnalysis) {
    if (linkedinAnalysis.marketPositioning?.uniqueValueProposition) {
      tips.marketPositioning.push({
        category: 'Unique Value Proposition',
        tip: 'Strengthen your unique value proposition in all professional communications.',
        priority: 'High',
        action: `Highlight: ${linkedinAnalysis.marketPositioning.uniqueValueProposition}`
      });
    }

    if (linkedinAnalysis.teamFitAssessment?.workStyle) {
      tips.teamFitOptimization.push({
        category: 'Team Collaboration Style',
        tip: 'Showcase your collaborative approach in project descriptions and posts.',
        priority: 'Medium',
        action: `Emphasize your ${linkedinAnalysis.teamFitAssessment.workStyle.toLowerCase()} work style with specific examples`
      });
    }

    if (linkedinAnalysis.clientFitIndicators?.consultingReadiness < 7) {
      tips.linkedinTips.push({
        category: 'Consulting Readiness',
        tip: 'Improve your consulting positioning with client-focused content.',
        priority: 'High',
        action: 'Share case studies, client success stories, and consulting methodology posts'
      });
    }

    if (linkedinAnalysis.growthPotential?.learningMindset < 4) {
      tips.linkedinTips.push({
        category: 'Growth Mindset',
        tip: 'Demonstrate continuous learning through posts about new technologies and skills.',
        priority: 'Medium',
        action: 'Share learning experiences, course completions, and skill development journey'
      });
    }
  }

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

  console.log('📋 Generated enhanced improvement tips:', tips);
  return tips;
};

const generateCertificationRecommendations = (cvAnalysis: any, linkedinAnalysis: any) => {
  const recommendations = {
    technical: [],
    business: [],
    leadership: [],
    industry: []
  };

  if (cvAnalysis?.technicalExpertise) {
    const skills = cvAnalysis.technicalExpertise.programmingLanguages?.expert || [];
    
    if (skills.includes('AWS') || skills.includes('Cloud')) {
      recommendations.technical.push({
        certification: 'AWS Solutions Architect',
        priority: 'High',
        reason: 'Enhance cloud consulting capabilities',
        timeToComplete: '2-3 months',
        marketValue: 'High demand in enterprise consulting'
      });
    }

    if (skills.includes('React') || skills.includes('JavaScript')) {
      recommendations.technical.push({
        certification: 'Google Professional Cloud Developer',
        priority: 'Medium',
        reason: 'Complement frontend skills with cloud backend',
        timeToComplete: '1-2 months',
        marketValue: 'Growing demand for full-stack cloud developers'
      });
    }
  }

  if (linkedinAnalysis?.businessAcumen) {
    recommendations.business.push({
      certification: 'Project Management Professional (PMP)',
      priority: 'High',
      reason: 'Essential for senior consulting roles',
      timeToComplete: '3-4 months',
      marketValue: 'Significantly increases hourly rates'
    });
  }

  if (linkedinAnalysis?.leadership >= 4) {
    recommendations.leadership.push({
      certification: 'Certified Scrum Master (CSM)',
      priority: 'Medium',
      reason: 'Demonstrate agile leadership capabilities',
      timeToComplete: '1 month',
      marketValue: 'High demand in agile organizations'
    });
  }

  return recommendations;
};

const generateROIPredictions = (cvAnalysis: any, linkedinAnalysis: any) => {
  // Fix: Handle both string and number values for hourly rate
  let baseRate = 800; // Default fallback
  
  if (cvAnalysis?.marketPositioning?.hourlyRateEstimate?.recommended) {
    const recommended = cvAnalysis.marketPositioning.hourlyRateEstimate.recommended;
    
    if (typeof recommended === 'number') {
      baseRate = recommended;
    } else if (typeof recommended === 'string') {
      baseRate = parseInt(recommended.replace(/\D/g, '')) || 800;
    }
  }
  
  return {
    currentMarketValue: {
      hourlyRate: baseRate,
      monthlyPotential: baseRate * 160,
      annualPotential: baseRate * 160 * 12
    },
    improvementPotential: {
      with6MonthsImprovement: {
        hourlyRate: Math.round(baseRate * 1.15),
        reasoning: 'LinkedIn optimization + 1 certification'
      },
      with1YearImprovement: {
        hourlyRate: Math.round(baseRate * 1.3),
        reasoning: 'Technical certifications + thought leadership'
      },
      with2YearImprovement: {
        hourlyRate: Math.round(baseRate * 1.5),
        reasoning: 'Senior positioning + niche expertise'
      }
    },
    teamFitValue: {
      startupFit: linkedinAnalysis?.clientFitIndicators?.startupCompatibility || 4,
      enterpriseFit: linkedinAnalysis?.clientFitIndicators?.enterpriseCompatibility || 4,
      consultingReadiness: linkedinAnalysis?.clientFitIndicators?.consultingReadiness || 7,
      expectedOnboardingTime: linkedinAnalysis?.teamFitAssessment?.projectApproach === 'Methodical' ? '1-2 weeks' : '2-3 weeks'
    }
  };
};
