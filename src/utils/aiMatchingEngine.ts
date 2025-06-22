
import { Consultant, Assignment } from '@/types/consultant';

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

export const generateAIMatches = async (
  assignment: Assignment,
  consultants: Consultant[]
): Promise<MatchResult[]> => {
  console.log('🚀 Starting AI matching process...');
  
  const matches: MatchResult[] = [];

  for (const consultant of consultants) {
    try {
      // Calculate technical fit
      const technicalFit = calculateTechnicalFit(assignment, consultant);
      
      // Calculate cultural fit
      const culturalFit = calculateCulturalFit(assignment, consultant);
      
      // Calculate overall match score
      const totalMatchScore = Math.round((technicalFit * 0.6) + (culturalFit * 0.4));
      
      // Find matched skills and values
      const matchedSkills = findMatchedSkills(assignment.requiredSkills, consultant.skills);
      const matchedValues = findMatchedValues(assignment.requiredValues || [], consultant.values);
      
      // Generate AI match letter
      const matchLetter = await generateMatchLetter(assignment, consultant, {
        technicalFit,
        culturalFit,
        totalMatchScore
      });
      
      // Calculate estimated savings and response time
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
  
  // Bonus for experience and additional skills
  const experienceBonus = Math.min(15, parseInt(consultant.experience) || 0);
  const skillDepthBonus = Math.min(10, (consultantSkills.length - requiredSkills.length) * 2);
  
  return Math.min(100, Math.round(baseScore + experienceBonus + skillDepthBonus));
};

const calculateCulturalFit = (assignment: Assignment, consultant: Consultant): number => {
  let culturalScore = 75; // Base score
  
  // Communication style match
  if (assignment.desiredCommunicationStyle && consultant.communicationStyle) {
    if (assignment.desiredCommunicationStyle.toLowerCase() === consultant.communicationStyle.toLowerCase()) {
      culturalScore += 15;
    }
  }
  
  // Values alignment
  const requiredValues = assignment.requiredValues || [];
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
  
  // Leadership level alignment
  const leadershipAlignment = Math.abs((assignment.leadershipLevel || 3) - consultant.leadership);
  culturalScore += Math.max(0, 10 - (leadershipAlignment * 3));
  
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

const generateMatchLetter = async (
  assignment: Assignment,
  consultant: Consultant,
  scores: { technicalFit: number; culturalFit: number; totalMatchScore: number }
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
        scores,
        type: 'match_letter'
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate match letter');
    }

    const data = await response.json();
    return data.matchLetter || generateFallbackMatchLetter(assignment, consultant, scores);
    
  } catch (error) {
    console.error('Error generating AI match letter:', error);
    return generateFallbackMatchLetter(assignment, consultant, scores);
  }
};

const generateFallbackMatchLetter = (
  assignment: Assignment,
  consultant: Consultant,
  scores: { technicalFit: number; culturalFit: number; totalMatchScore: number }
): string => {
  return `Hej!

Jag har identifierat ${consultant.name} som en stark kandidat för uppdraget "${assignment.title}" hos ${assignment.company}.

Matchningsanalys:
• Teknisk passform: ${scores.technicalFit}% - ${consultant.name} har stark kompetens inom ${consultant.skills.slice(0, 3).join(', ')}
• Kulturell passform: ${scores.culturalFit}% - Passar bra med teamets arbetssätt och värderingar
• Helhetsbedömning: ${scores.totalMatchScore}% match

${consultant.name} har ${consultant.experience} erfarenhet och har genomfört ${consultant.projects} framgångsrika projekt. Med en rating på ${consultant.rating}/5 och specialisering inom ${consultant.skills[0]}, skulle hen vara ett utmärkt tillskott till ert team.

Uppdraget verkar passa perfekt med hens profil och tidigare erfarenheter. Hen är tillgänglig ${consultant.availability} och kan troligen starta inom kort.

Rekommenderar starkt att ni kontaktar ${consultant.name} för en närmare diskussion.

Vänliga hälsningar,
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
  const availability = consultant.availability.toLowerCase();
  
  if (availability.includes('available')) return '< 24h';
  if (availability.includes('busy')) return '2-3 days';
  if (availability.includes('from')) return '1-2 weeks';
  
  return '< 48h';
};
