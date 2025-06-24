import { Consultant, Assignment } from '@/types/consultant';

interface AdvancedMatchResult {
  consultant: Consultant;
  technicalFit: number;
  culturalFit: number;
  experienceMatch: number;
  availabilityScore: number;
  communicationFit: number;
  industryExperience: number;
  totalMatchScore: number;
  confidenceLevel: number;
  matchedSkills: string[];
  matchedValues: string[];
  strengthAreas: string[];
  developmentAreas: string[];
  matchReasoning: string;
  riskFactors: string[];
  successPrediction: number;
  estimatedOnboardingTime: string;
  culturalAdaptation: number;
}

export const generateAdvancedAIMatches = async (
  assignment: Assignment,
  consultants: Consultant[]
): Promise<AdvancedMatchResult[]> => {
  console.log('🚀 Starting advanced AI matching process...');
  
  const matches: AdvancedMatchResult[] = [];

  for (const consultant of consultants) {
    try {
      // Calculate multiple match dimensions
      const technicalFit = calculateAdvancedTechnicalFit(assignment, consultant);
      const culturalFit = calculateAdvancedCulturalFit(assignment, consultant);
      const experienceMatch = calculateExperienceMatch(assignment, consultant);
      const availabilityScore = calculateAvailabilityScore(assignment, consultant);
      const communicationFit = calculateCommunicationFit(assignment, consultant);
      const industryExperience = calculateIndustryExperience(assignment, consultant);
      
      // Calculate weighted total score
      const totalMatchScore = Math.round(
        (technicalFit * 0.25) +
        (culturalFit * 0.20) +
        (experienceMatch * 0.20) +
        (availabilityScore * 0.10) +
        (communicationFit * 0.15) +
        (industryExperience * 0.10)
      );
      
      // Calculate confidence level based on data completeness
      const confidenceLevel = calculateConfidenceLevel(consultant);
      
      // Find matched elements
      const matchedSkills = findAdvancedMatchedSkills(assignment.requiredSkills, consultant.skills);
      const matchedValues = findMatchedValues(assignment.requiredValues || [], consultant.values);
      
      // Analyze strengths and development areas
      const strengthAreas = identifyStrengthAreas(assignment, consultant);
      const developmentAreas = identifyDevelopmentAreas(assignment, consultant);
      
      // Generate detailed reasoning
      const matchReasoning = generateAdvancedMatchReasoning(assignment, consultant, {
        technicalFit,
        culturalFit,
        experienceMatch,
        totalMatchScore
      });
      
      // Identify risk factors
      const riskFactors = identifyRiskFactors(assignment, consultant);
      
      // Predict success and onboarding
      const successPrediction = calculateSuccessPrediction(consultant, totalMatchScore);
      const estimatedOnboardingTime = estimateOnboardingTime(consultant, assignment);
      const culturalAdaptation = calculateCulturalAdaptation(assignment, consultant);

      matches.push({
        consultant,
        technicalFit,
        culturalFit,
        experienceMatch,
        availabilityScore,
        communicationFit,
        industryExperience,
        totalMatchScore,
        confidenceLevel,
        matchedSkills,
        matchedValues,
        strengthAreas,
        developmentAreas,
        matchReasoning,
        riskFactors,
        successPrediction,
        estimatedOnboardingTime,
        culturalAdaptation
      });
      
    } catch (error) {
      console.error('Error processing consultant:', consultant.name, error);
    }
  }

  // Sort by match score and confidence level
  return matches
    .sort((a, b) => {
      const scoreA = a.totalMatchScore * (a.confidenceLevel / 100);
      const scoreB = b.totalMatchScore * (b.confidenceLevel / 100);
      return scoreB - scoreA;
    })
    .slice(0, 15);
};

const calculateAdvancedTechnicalFit = (assignment: Assignment, consultant: Consultant): number => {
  const requiredSkills = assignment.requiredSkills || [];
  const consultantSkills = consultant.skills || [];
  
  if (requiredSkills.length === 0) return 85;
  
  let totalScore = 0;
  let weightedRequirements = 0;
  
  requiredSkills.forEach(skill => {
    const skillWeight = getSkillWeight(skill);
    weightedRequirements += skillWeight;
    
    const matchLevel = getSkillMatchLevel(skill, consultantSkills);
    totalScore += matchLevel * skillWeight;
  });
  
  const baseScore = weightedRequirements > 0 ? (totalScore / weightedRequirements) : 0;
  
  // Bonus for additional relevant skills
  const bonusSkills = consultantSkills.filter(skill => 
    !requiredSkills.some(req => 
      req.toLowerCase().includes(skill.toLowerCase())
    )
  );
  const bonusScore = Math.min(15, bonusSkills.length * 2);
  
  // Experience level bonus
  const experienceYears = parseInt(consultant.experience) || 0;
  const experienceBonus = Math.min(10, experienceYears);
  
  return Math.min(100, Math.round(baseScore + bonusScore + experienceBonus));
};

const calculateAdvancedCulturalFit = (assignment: Assignment, consultant: Consultant): number => {
  let culturalScore = 70; // Base score
  
  // Values alignment (stronger weight)
  const requiredValues = assignment.requiredValues || [];
  const consultantValues = consultant.values || [];
  
  if (requiredValues.length > 0 && consultantValues.length > 0) {
    const valueMatches = requiredValues.filter(value =>
      consultantValues.some(cValue => 
        cValue.toLowerCase().includes(value.toLowerCase()) ||
        value.toLowerCase().includes(cValue.toLowerCase())
      )
    );
    culturalScore += (valueMatches.length / requiredValues.length) * 25;
  }
  
  // Communication style alignment
  if (assignment.desiredCommunicationStyle && consultant.communicationStyle) {
    const styleMatch = calculateCommunicationStyleMatch(
      assignment.desiredCommunicationStyle,
      consultant.communicationStyle
    );
    culturalScore += styleMatch * 0.15;
  }
  
  // Team dynamics fit
  if (assignment.teamDynamics && consultant.teamFit) {
    culturalScore += 10;
  }
  
  return Math.min(100, Math.round(culturalScore));
};

const calculateExperienceMatch = (assignment: Assignment, consultant: Consultant): number => {
  const consultantYears = parseInt(consultant.experience) || 0;
  const projectComplexity = getProjectComplexity(assignment);
  
  let experienceScore = 50;
  
  // Match experience level to project needs
  if (projectComplexity === 'junior' && consultantYears >= 2) experienceScore += 30;
  else if (projectComplexity === 'mid' && consultantYears >= 4) experienceScore += 35;
  else if (projectComplexity === 'senior' && consultantYears >= 7) experienceScore += 40;
  else if (projectComplexity === 'expert' && consultantYears >= 10) experienceScore += 45;
  
  // Relevant project experience - Use correct property name 'projects'
  if (consultant.projects && consultant.projects > 5) {
    experienceScore += Math.min(15, consultant.projects);
  }
  
  // Industry-specific experience
  if (consultant.industries && assignment.industry) {
    const hasIndustryExp = consultant.industries.some(ind => 
      ind.toLowerCase().includes(assignment.industry.toLowerCase())
    );
    if (hasIndustryExp) experienceScore += 10;
  }
  
  return Math.min(100, Math.round(experienceScore));
};

const calculateAvailabilityScore = (assignment: Assignment, consultant: Consultant): number => {
  const availability = consultant.availability.toLowerCase();
  
  if (availability.includes('available') || availability.includes('tillgänglig')) return 100;
  if (availability.includes('busy') || availability.includes('upptagen')) return 60;
  if (availability.includes('limited') || availability.includes('begränsad')) return 40;
  if (availability.includes('from') || availability.includes('från')) return 70;
  
  return 75; // Default moderate availability
};

const calculateCommunicationFit = (assignment: Assignment, consultant: Consultant): number => {
  // Base communication score from rating
  let commScore = (consultant.rating / 5) * 60;
  
  // Language alignment
  if (consultant.languages && consultant.languages.includes('Svenska')) {
    commScore += 20;
  }
  
  // Communication style match
  if (assignment.desiredCommunicationStyle && consultant.communicationStyle) {
    const styleAlignment = calculateCommunicationStyleMatch(
      assignment.desiredCommunicationStyle,
      consultant.communicationStyle
    );
    commScore += styleAlignment * 0.2;
  }
  
  return Math.min(100, Math.round(commScore));
};

const calculateIndustryExperience = (assignment: Assignment, consultant: Consultant): number => {
  if (!consultant.industries || !assignment.industry) return 60;
  
  const hasDirectExperience = consultant.industries.some(ind => 
    ind.toLowerCase().includes(assignment.industry.toLowerCase()) ||
    assignment.industry.toLowerCase().includes(ind.toLowerCase())
  );
  
  if (hasDirectExperience) return 95;
  
  // Check for related industries
  const relatedIndustries = getRelatedIndustries(assignment.industry);
  const hasRelatedExperience = consultant.industries.some(ind =>
    relatedIndustries.includes(ind.toLowerCase())
  );
  
  return hasRelatedExperience ? 75 : 50;
};

// Helper functions
const getSkillWeight = (skill: string): number => {
  const criticalSkills = ['react', 'typescript', 'node.js', 'aws', 'kubernetes'];
  const importantSkills = ['javascript', 'python', 'docker', 'postgresql'];
  
  if (criticalSkills.some(cs => skill.toLowerCase().includes(cs))) return 3;
  if (importantSkills.some(is => skill.toLowerCase().includes(is))) return 2;
  return 1;
};

const getSkillMatchLevel = (requiredSkill: string, consultantSkills: string[]): number => {
  const exactMatch = consultantSkills.some(skill => 
    skill.toLowerCase() === requiredSkill.toLowerCase()
  );
  if (exactMatch) return 100;
  
  const partialMatch = consultantSkills.some(skill => 
    skill.toLowerCase().includes(requiredSkill.toLowerCase()) ||
    requiredSkill.toLowerCase().includes(skill.toLowerCase())
  );
  if (partialMatch) return 80;
  
  return 0;
};

const findAdvancedMatchedSkills = (requiredSkills: string[], consultantSkills: string[]): string[] => {
  const matches: string[] = [];
  
  requiredSkills.forEach(reqSkill => {
    const match = consultantSkills.find(skill => 
      skill.toLowerCase().includes(reqSkill.toLowerCase()) ||
      reqSkill.toLowerCase().includes(skill.toLowerCase())
    );
    if (match) matches.push(reqSkill);
  });
  
  return matches;
};

const findMatchedValues = (requiredValues: string[], consultantValues: string[]): string[] => {
  return requiredValues.filter(value =>
    consultantValues.some(cValue => 
      cValue.toLowerCase().includes(value.toLowerCase()) ||
      value.toLowerCase().includes(cValue.toLowerCase())
    )
  );
};

const identifyStrengthAreas = (assignment: Assignment, consultant: Consultant): string[] => {
  const strengths: string[] = [];
  
  if (consultant.rating >= 4.5) strengths.push('Hög kundnöjdhet');
  if (consultant.projects && consultant.projects > 10) {
    strengths.push('Omfattande projekterfarenhet');
  }
  if (consultant.certifications && consultant.certifications.length > 2) {
    strengths.push('Stark certifieringsprofil');
  }
  if (consultant.thought_leadership_score && consultant.thought_leadership_score > 80) {
    strengths.push('Thought leadership');
  }
  
  return strengths;
};

const identifyDevelopmentAreas = (assignment: Assignment, consultant: Consultant): string[] => {
  const areas: string[] = [];
  
  const requiredSkills = assignment.requiredSkills || [];
  const consultantSkills = consultant.skills || [];
  
  const missingSkills = requiredSkills.filter(skill => 
    !consultantSkills.some(cSkill => 
      cSkill.toLowerCase().includes(skill.toLowerCase())
    )
  );
  
  if (missingSkills.length > 0) {
    areas.push(`Utvecklingsområden: ${missingSkills.slice(0, 2).join(', ')}`);
  }
  
  if (consultant.experience && parseInt(consultant.experience) < 3) {
    areas.push('Relativt junior - kan behöva mentorskap');
  }
  
  return areas;
};

const calculateConfidenceLevel = (consultant: Consultant): number => {
  let confidence = 60;
  
  if (consultant.skills && consultant.skills.length > 5) confidence += 10;
  if (consultant.experience) confidence += 10;
  if (consultant.rating && consultant.rating > 0) confidence += 10;
  if (consultant.values && consultant.values.length > 0) confidence += 5;
  if (consultant.certifications && consultant.certifications.length > 0) confidence += 5;
  
  return Math.min(100, confidence);
};

const generateAdvancedMatchReasoning = (
  assignment: Assignment,
  consultant: Consultant,
  scores: any
): string => {
  const reasons: string[] = [];
  
  if (scores.technicalFit > 85) {
    reasons.push(`Excellent teknisk passform med ${consultant.skills.slice(0, 3).join(', ')}`);
  }
  
  if (scores.culturalFit > 80) {
    reasons.push('Stark kulturell alignment med teamets värderingar');
  }
  
  if (consultant.rating >= 4.5) {
    reasons.push(`Hög kundrating (${consultant.rating}/5)`);
  }
  
  if (consultant.availability.toLowerCase().includes('available')) {
    reasons.push('Omedelbart tillgänglig för projektstart');
  }
  
  return reasons.length > 0 ? reasons.join('. ') + '.' : 'Solid match baserat på profil och erfarenhet.';
};

const identifyRiskFactors = (assignment: Assignment, consultant: Consultant): string[] => {
  const risks: string[] = [];
  
  if (consultant.rating < 4.0) {
    risks.push('Lägre kundrating än genomsnitt');
  }
  
  if (!consultant.availability.toLowerCase().includes('available')) {
    risks.push('Begränsad tillgänglighet');
  }
  
  const experienceYears = parseInt(consultant.experience) || 0;
  if (experienceYears < 2) {
    risks.push('Relativt junior - kan kräva mer support');
  }
  
  return risks;
};

const calculateSuccessPrediction = (consultant: Consultant, matchScore: number): number => {
  let prediction = matchScore * 0.7;
  
  if (consultant.rating >= 4.5) prediction += 10;
  if (consultant.projects && consultant.projects > 5) prediction += 10;
  
  return Math.min(95, Math.round(prediction));
};

const estimateOnboardingTime = (consultant: Consultant, assignment: Assignment): string => {
  const experienceYears = parseInt(consultant.experience) || 0;
  
  if (experienceYears > 7) return '1-2 veckor';
  if (experienceYears > 3) return '2-3 veckor';
  return '3-4 veckor';
};

const calculateCulturalAdaptation = (assignment: Assignment, consultant: Consultant): number => {
  let adaptationScore = 75;
  
  if (consultant.values && consultant.values.includes('Anpassningsförmåga')) {
    adaptationScore += 15;
  }
  
  if (consultant.personalityTraits && consultant.personalityTraits.includes('Flexibel')) {
    adaptationScore += 10;
  }
  
  return Math.min(100, adaptationScore);
};

// Additional helper functions
const getProjectComplexity = (assignment: Assignment): string => {
  if (assignment.budget && assignment.budget.includes('2000000')) return 'expert';
  if (assignment.budget && assignment.budget.includes('1000000')) return 'senior';
  if (assignment.budget && assignment.budget.includes('500000')) return 'mid';
  return 'junior';
};

const calculateCommunicationStyleMatch = (required: string, consultant: string): number => {
  const requiredStyle = required.toLowerCase();
  const consultantStyle = consultant.toLowerCase();
  
  if (requiredStyle === consultantStyle) return 100;
  
  // Similar styles
  const directStyles = ['direct', 'tydlig', 'rak'];
  const collaborativeStyles = ['collaborative', 'samarbetsinriktad', 'team'];
  
  const requiredInDirect = directStyles.some(style => requiredStyle.includes(style));
  const consultantInDirect = directStyles.some(style => consultantStyle.includes(style));
  
  if (requiredInDirect && consultantInDirect) return 85;
  
  const requiredInCollab = collaborativeStyles.some(style => requiredStyle.includes(style));
  const consultantInCollab = collaborativeStyles.some(style => consultantStyle.includes(style));
  
  if (requiredInCollab && consultantInCollab) return 85;
  
  return 60; // Default partial match
};

const getRelatedIndustries = (industry: string): string[] => {
  const industryMap: Record<string, string[]> = {
    'fintech': ['finance', 'banking', 'insurance'],
    'healthtech': ['healthcare', 'medical', 'pharma'],
    'ecommerce': ['retail', 'commerce', 'marketplace'],
    'saas': ['software', 'tech', 'cloud']
  };
  
  const normalized = industry.toLowerCase();
  for (const [key, related] of Object.entries(industryMap)) {
    if (normalized.includes(key)) return related;
  }
  
  return [];
};
