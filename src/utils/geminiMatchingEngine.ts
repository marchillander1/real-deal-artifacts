
import { Consultant } from '@/types/consultant';
import { Assignment } from '@/types/assignment';

interface MatchResult {
  consultant: Consultant;
  technicalFit: number;
  culturalFit: number;
  totalMatchScore: number;
  matchedSkills: string[];
  matchedValues: string[];
  matchLetter: string;
  estimatedSavings: string;
  responseTime: string;
  successProbability: number;
}

export const generateGeminiMatches = async (
  assignment: Assignment,
  consultants: Consultant[]
): Promise<MatchResult[]> => {
  console.log('🚀 Starting Gemini AI matching process...');
  
  const matches: MatchResult[] = [];

  for (const consultant of consultants) {
    try {
      // Calculate basic technical and cultural fit
      const technicalFit = calculateTechnicalFit(assignment, consultant);
      const culturalFit = calculateCulturalFit(assignment, consultant);
      const totalMatchScore = Math.round((technicalFit * 0.6) + (culturalFit * 0.4));
      
      // Find matched skills and values
      const matchedSkills = findMatchedSkills(assignment.requiredSkills, consultant.skills);
      const matchedValues = findMatchedValues([], consultant.values || []); // Assignment doesn't have requiredValues
      
      // Generate AI match letter using Gemini
      const matchLetter = await generateGeminiMatchLetter(assignment, consultant, {
        technicalFit,
        culturalFit,
        totalMatchScore,
        matchedSkills,
        matchedValues
      });
      
      // Calculate metrics
      const estimatedSavings = calculateEstimatedSavings(consultant);
      const responseTime = calculateResponseTime(consultant);
      const successProbability = Math.min(95, totalMatchScore + Math.random() * 10);

      matches.push({
        consultant,
        technicalFit,
        culturalFit,
        totalMatchScore,
        matchedSkills,
        matchedValues,
        matchLetter,
        estimatedSavings,
        responseTime,
        successProbability
      });
      
    } catch (error) {
      console.error('Error processing consultant:', consultant.name, error);
    }
  }

  // Sort by match score and return top matches
  return matches
    .sort((a, b) => b.totalMatchScore - a.totalMatchScore)
    .slice(0, 10);
};

const calculateTechnicalFit = (assignment: Assignment, consultant: Consultant): number => {
  const requiredSkills = assignment.requiredSkills || [];
  const consultantSkills = consultant.skills || [];
  
  if (requiredSkills.length === 0) return 85;
  
  const matchedSkills = requiredSkills.filter(skill => 
    consultantSkills.some(cSkill => 
      cSkill.toLowerCase().includes(skill.toLowerCase()) ||
      skill.toLowerCase().includes(cSkill.toLowerCase())
    )
  );
  
  const baseScore = (matchedSkills.length / requiredSkills.length) * 100;
  const experienceBonus = Math.min(15, parseInt(consultant.experience) || 0);
  const skillDepthBonus = Math.min(10, Math.max(0, consultantSkills.length - requiredSkills.length) * 2);
  
  return Math.min(100, Math.round(baseScore + experienceBonus + skillDepthBonus));
};

const calculateCulturalFit = (assignment: Assignment, consultant: Consultant): number => {
  let culturalScore = 75; // Base score
  
  // Communication style match - using available properties
  const assignmentCommStyle = assignment.teamCulture;
  const consultantCommStyle = consultant.communicationStyle;
  
  if (assignmentCommStyle && consultantCommStyle) {
    if (assignmentCommStyle.toLowerCase() === consultantCommStyle.toLowerCase()) {
      culturalScore += 15;
    }
  }
  
  // Values alignment - Assignment doesn't have requiredValues, use default empty array
  const requiredValues: string[] = [];
  const consultantValues = consultant.values || [];
  
  if (requiredValues.length > 0) {
    const matchedValues = requiredValues.filter(value =>
      consultantValues.some(cValue => 
        cValue.toLowerCase().includes(value.toLowerCase())
      )
    );
    culturalScore += (matchedValues.length / requiredValues.length) * 20;
  }
  
  // Team culture fit
  if (assignment.teamCulture && consultant.teamFit) {
    culturalScore += 10;
  }
  
  return Math.min(100, Math.round(culturalScore));
};

const findMatchedSkills = (requiredSkills: string[], consultantSkills: string[]): string[] => {
  return requiredSkills.filter(skill => 
    consultantSkills.some(cSkill => 
      cSkill.toLowerCase().includes(skill.toLowerCase()) ||
      skill.toLowerCase().includes(cSkill.toLowerCase())
    )
  );
};

const findMatchedValues = (requiredValues: string[], consultantValues: string[]): string[] => {
  return requiredValues.filter(value =>
    consultantValues.some(cValue => 
      cValue.toLowerCase().includes(value.toLowerCase())
    )
  );
};

const generateGeminiMatchLetter = async (
  assignment: Assignment,
  consultant: Consultant,
  matchData: any
): Promise<string> => {
  try {
    const response = await fetch('/supabase/functions/ai-matching', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        assignment,
        consultant,
        matchData,
        type: 'match_letter'
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate match letter');
    }

    const data = await response.json();
    return data.matchLetter || generateFallbackMatchLetter(assignment, consultant, matchData);
    
  } catch (error) {
    console.error('Error generating Gemini match letter:', error);
    return generateFallbackMatchLetter(assignment, consultant, matchData);
  }
};

const generateFallbackMatchLetter = (
  assignment: Assignment,
  consultant: Consultant,
  matchData: any
): string => {
  return `Subject: Match Recommendation – ${consultant.name} for ${assignment.title}

Hello,

Based on your assignment, ${consultant.name} appears to be a highly relevant match for the ${assignment.title} role at ${assignment.company}.

**Technical Fit**
• Core skills: ${matchData.matchedSkills.slice(0, 3).join(', ')}
• Experience: ${consultant.experience || 'Several years'}
• Relevant background: ${consultant.roles?.slice(0, 2).join(', ') || 'Technology'}

**Cultural Fit**  
• Communication style: ${consultant.communicationStyle || 'Professional and collaborative'}
• Values alignment: ${matchData.matchedValues.slice(0, 3).join(', ')}
• Team fit: ${consultant.teamFit || 'Excellent team collaboration skills'}

**Match Score**
• Technical: ${matchData.technicalFit}%
• Cultural: ${matchData.culturalFit}%
• Overall: ${matchData.totalMatchScore}%
• Availability: ${consultant.availability || 'Available'}

${consultant.name} has completed ${consultant.projects || 'multiple'} successful projects with a ${consultant.rating}/5 rating. 

We recommend proceeding with this consultant for your ${assignment.title} position.

Best regards,
MatchWise AI`;
};

const calculateEstimatedSavings = (consultant: Consultant): string => {
  const rate = parseInt(consultant.rate) || 800;
  const marketAverage = 1200;
  const savings = marketAverage - rate;
  
  if (savings > 0) {
    return `${savings} SEK/h`;
  }
  return 'Premium rate';
};

const calculateResponseTime = (consultant: Consultant): string => {
  const availability = consultant.availability?.toLowerCase() || '';
  
  if (availability.includes('available')) return '< 24h';
  if (availability.includes('busy')) return '2-3 days';
  if (availability.includes('from')) return '1-2 weeks';
  
  return '< 48h';
};
