import { Consultant, Assignment, Match } from '../types/consultant';

// Calculate match score between consultant and assignment
export const calculateMatchScore = (consultant: Consultant, assignment: Assignment): number => {
  // Base score starts at 50
  let score = 50;
  
  // Match skills (up to 30 points)
  const matchedSkills = findMatchedSkills(consultant.skills, assignment.requiredSkills);
  const skillScore = Math.min(30, (matchedSkills.length / assignment.requiredSkills.length) * 30);
  score += skillScore;
  
  // Experience bonus (up to 10 points)
  const experienceYears = parseInt(consultant.experience) || 0;
  const experienceScore = Math.min(10, experienceYears);
  score += experienceScore;
  
  // Availability bonus (up to 5 points)
  if (consultant.availability.toLowerCase().includes('available')) {
    score += 5;
  }
  
  // Location match (up to 5 points)
  // This is a simplified example - in real world, you might use geocoding
  if (consultant.location === assignment.remote) {
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
  const matchedSkills = findMatchedSkills(consultant.skills, assignment.requiredSkills);
  const matchScore = calculateMatchScore(consultant, assignment);
  
  let reasoning = `${consultant.name} is a ${matchScore >= 80 ? 'strong' : matchScore >= 60 ? 'good' : 'potential'} match for this assignment. `;
  
  if (matchedSkills.length > 0) {
    reasoning += `They have ${matchedSkills.length} of the ${assignment.requiredSkills.length} required skills including ${matchedSkills.slice(0, 3).join(', ')}${matchedSkills.length > 3 ? ' and more' : ''}. `;
  }
  
  reasoning += `With ${consultant.experience} of experience and ${consultant.availability.toLowerCase().includes('available') ? 'immediate availability' : 'limited availability'}, `;
  reasoning += `they could be a valuable addition to the team.`;
  
  return reasoning;
};

// Generate a cover letter for the consultant
export const generateCoverLetter = (consultant: Consultant, assignment: Assignment): string => {
  const matchedSkills = findMatchedSkills(consultant.skills, assignment.requiredSkills);
  
  return `Dear ${assignment.company},

I am writing to express my interest in the ${assignment.title} position. With ${consultant.experience} of experience and expertise in ${matchedSkills.join(', ')}, I believe I am well-suited for this role.

Throughout my career, I have worked on various projects that required ${assignment.requiredSkills.slice(0, 3).join(', ')} skills. My approach to work is ${consultant.communicationStyle.toLowerCase()}, and I thrive in ${assignment.teamCulture.toLowerCase()} environments.

I am currently ${consultant.availability.toLowerCase()} and can accommodate the ${assignment.workload} workload required for this position. I am confident that my skills and experience make me a strong candidate for this role.

I look forward to the opportunity to discuss how my background aligns with your needs for this position.

Best regards,
${consultant.name}`;
};

export const findBestMatches = (
  consultants: Consultant[],
  assignment: Assignment,
  limit: number = 5
): Match[] => {
  const matches = consultants.map(consultant => ({
    consultant,
    matchScore: calculateMatchScore(consultant, assignment),
    matchedSkills: findMatchedSkills(consultant.skills, assignment.requiredSkills),
    reasoning: generateMatchReasoning(consultant, assignment)
  }));

  return matches
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);
};

// Enhanced matching that considers soft skills and cultural fit
export const enhancedMatching = (consultants: Consultant[], assignment: Assignment, limit: number = 5): Match[] => {
  const matches = consultants.map(consultant => {
    // Technical match (60% of total score)
    const technicalScore = calculateMatchScore(consultant, assignment) * 0.6;
    
    // Cultural fit (20% of total score)
    let culturalScore = 0;
    if (consultant.culturalFit) {
      culturalScore = Math.min(20, consultant.culturalFit * 2);
    }
    
    // Communication style match (10% of total score)
    let communicationScore = 0;
    if (consultant.communicationStyle && assignment.teamCulture) {
      // Simple string matching - in real world, use more sophisticated NLP
      if (consultant.communicationStyle.toLowerCase().includes(assignment.teamCulture.toLowerCase()) ||
          assignment.teamCulture.toLowerCase().includes(consultant.communicationStyle.toLowerCase())) {
        communicationScore = 10;
      } else {
        communicationScore = 5; // Partial match
      }
    }
    
    // Adaptability score (10% of total score)
    const adaptabilityScore = consultant.adaptability ? Math.min(10, consultant.adaptability) : 5;
    
    // Calculate total score
    const totalScore = Math.round(technicalScore + culturalScore + communicationScore + adaptabilityScore);
    
    // Generate more detailed reasoning
    const matchedSkills = findMatchedSkills(consultant.skills, assignment.requiredSkills);
    let reasoning = `${consultant.name} is a ${totalScore >= 80 ? 'strong' : totalScore >= 60 ? 'good' : 'potential'} match with an overall score of ${totalScore}%. `;
    reasoning += `Technical match: ${Math.round(technicalScore / 0.6)}% with ${matchedSkills.length} matching skills. `;
    reasoning += `Cultural fit: ${Math.round(culturalScore / 0.2)}%. `;
    reasoning += `Communication style compatibility: ${Math.round(communicationScore / 0.1)}%. `;
    reasoning += `Adaptability: ${Math.round(adaptabilityScore / 0.1)}%.`;
    
    return {
      consultant,
      matchScore: totalScore,
      matchedSkills,
      reasoning,
      coverLetter: generateCoverLetter(consultant, assignment)
    };
  });
  
  return matches
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);
};
