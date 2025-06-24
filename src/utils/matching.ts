
import { Consultant, Assignment, Match } from '../types/consultant';

// Calculate match score between consultant and assignment
export const calculateMatchScore = (consultant: Consultant, assignment: Assignment): number => {
  // Base score starts at 50
  let score = 50;
  
  // Match skills (up to 30 points)
  const matchedSkills = findMatchedSkills(consultant.skills, assignment.requiredSkills || assignment.required_skills || []);
  const requiredSkills = assignment.requiredSkills || assignment.required_skills || [];
  if (requiredSkills.length > 0) {
    const skillScore = Math.min(30, (matchedSkills.length / requiredSkills.length) * 30);
    score += skillScore;
  }
  
  // Experience bonus (up to 10 points)
  const experienceYears = parseInt(consultant.experience) || consultant.experience_years || 0;
  const experienceScore = Math.min(10, experienceYears);
  score += experienceScore;
  
  // Availability bonus (up to 5 points)
  if (consultant.availability.toLowerCase().includes('available')) {
    score += 5;
  }
  
  // Location match (up to 5 points)
  if (consultant.location === assignment.location || assignment.remote) {
    score += 5;
  }
  
  return Math.min(100, Math.round(score));
};

// Find matched skills between consultant and assignment
export const findMatchedSkills = (consultantSkills: string[], requiredSkills: string[]): string[] => {
  return consultantSkills.filter(skill => 
    requiredSkills.some(reqSkill => 
      reqSkill.toLowerCase().includes(skill.toLowerCase()) || 
      skill.toLowerCase().includes(reqSkill.toLowerCase())
    )
  );
};

// Generate reasoning for match
export const generateMatchReasoning = (consultant: Consultant, assignment: Assignment): string => {
  const requiredSkills = assignment.requiredSkills || assignment.required_skills || [];
  const matchedSkills = findMatchedSkills(consultant.skills, requiredSkills);
  const matchScore = calculateMatchScore(consultant, assignment);
  
  let reasoning = `${consultant.name} is a ${matchScore >= 80 ? 'strong' : matchScore >= 60 ? 'good' : 'potential'} match for this assignment. `;
  
  if (matchedSkills.length > 0) {
    reasoning += `They have ${matchedSkills.length} of the ${requiredSkills.length} required skills including ${matchedSkills.slice(0, 3).join(', ')}${matchedSkills.length > 3 ? ' and more' : ''}. `;
  }
  
  reasoning += `With ${consultant.experience} of experience and ${consultant.availability.toLowerCase().includes('available') ? 'immediate availability' : 'limited availability'}, `;
  reasoning += `they could be a valuable addition to the team.`;
  
  return reasoning;
};

// Generate a cover letter for the consultant
export const generateCoverLetter = (consultant: Consultant, assignment: Assignment): string => {
  const requiredSkills = assignment.requiredSkills || assignment.required_skills || [];
  const matchedSkills = findMatchedSkills(consultant.skills, requiredSkills);
  const communicationStyle = consultant.communicationStyle || consultant.communication_style || 'professional';
  const teamCulture = assignment.teamCulture || assignment.team_culture || 'collaborative';
  
  return `Dear ${assignment.company},

I am writing to express my interest in the ${assignment.title} position. With ${consultant.experience} of experience and expertise in ${matchedSkills.join(', ')}, I believe I am well-suited for this role.

Throughout my career, I have worked on various projects that required ${requiredSkills.slice(0, 3).join(', ')} skills. My approach to work is ${communicationStyle.toLowerCase()}, and I thrive in ${teamCulture.toLowerCase()} environments.

I am currently ${consultant.availability.toLowerCase()} and can accommodate the ${assignment.workload || 'full-time'} workload required for this position. I am confident that my skills and experience make me a strong candidate for this role.

I look forward to the opportunity to discuss how my background aligns with your needs for this position.

Best regards,
${consultant.name}`;
};

export const findBestMatches = (
  consultants: Consultant[],
  assignment: Assignment,
  limit: number = 10
): Match[] => {
  return consultants
    .map(consultant => ({
      id: `${consultant.id}-${assignment.id}`,
      consultant,
      assignment,
      matchScore: calculateMatchScore(consultant, assignment),
      match_score: calculateMatchScore(consultant, assignment),
      technicalFit: calculateMatchScore(consultant, assignment),
      culturalFit: consultant.culturalFit || consultant.cultural_fit || 85,
      cultural_fit: consultant.culturalFit || consultant.cultural_fit || 85,
      matchedSkills: findMatchedSkills(consultant.skills, assignment.requiredSkills || assignment.required_skills || []),
      matched_skills: findMatchedSkills(consultant.skills, assignment.requiredSkills || assignment.required_skills || []),
      reasoning: generateMatchReasoning(consultant, assignment),
      coverLetter: generateCoverLetter(consultant, assignment),
      cover_letter: generateCoverLetter(consultant, assignment),
      created_at: new Date().toISOString(),
      status: 'pending'
    }))
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);
};
