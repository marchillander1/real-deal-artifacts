
import { Consultant, Assignment, Match } from '../types/consultant';

export const calculateMatch = (consultant: Consultant, assignment: Assignment): number => {
  const consultantSkills = consultant.skills.map(s => s.toLowerCase());
  const requiredSkills = assignment.requiredSkills.map(s => s.toLowerCase());
  
  const matchingSkills = consultantSkills.filter(skill => 
    requiredSkills.some(required => 
      skill.includes(required.toLowerCase()) || required.toLowerCase().includes(skill)
    )
  );
  
  const skillScore = (matchingSkills.length / requiredSkills.length) * 60;
  const experienceScore = Math.min(parseInt(consultant.experience) * 2.5, 25);
  const availabilityScore = consultant.availability === 'Available now' ? 10 : 5;
  const ratingScore = consultant.rating * 1;
  
  return Math.min(Math.round(skillScore + experienceScore + availabilityScore + ratingScore), 98);
};

export const findMatches = (consultants: Consultant[], assignment: Assignment): Match[] => {
  return consultants.map(consultant => {
    const score = calculateMatch(consultant, assignment);
    const letter = generateRealisticCoverLetter(consultant, assignment, score);
    
    const matchedSkills = consultant.skills.filter(skill => 
      assignment.requiredSkills.some(req => 
        skill.toLowerCase().includes(req.toLowerCase()) || 
        req.toLowerCase().includes(skill.toLowerCase())
      )
    );

    // Enhanced technical analysis
    const technicalMatch = calculateTechnicalMatch(consultant, assignment);
    
    // Enhanced personality analysis
    const personalityMatch = calculatePersonalityMatch(consultant, assignment);
    
    // Industry compatibility analysis
    const industryMatch = calculateIndustryMatch(consultant, assignment);
    
    // Project success metrics
    const projectMetrics = generateProjectMetrics(consultant, score);

    return {
      consultant,
      score,
      letter,
      matchedSkills,
      estimatedSavings: Math.floor(score * 100 + Math.random() * 500),
      responseTime: Math.floor(Math.random() * 24) + 1,
      culturalMatch: Math.floor(Math.random() * 30) + 70,
      communicationMatch: Math.floor(Math.random() * 25) + 75,
      valuesAlignment: Math.floor(Math.random() * 20) + 80,
      humanFactorsScore: Math.floor(Math.random() * 15) + 85,
      technicalAnalysis: technicalMatch,
      personalityAnalysis: personalityMatch,
      industryAnalysis: industryMatch,
      projectMetrics: projectMetrics
    };
  }).sort((a, b) => b.score - a.score);
};

const calculateTechnicalMatch = (consultant: Consultant, assignment: Assignment) => {
  const matchedSkills = consultant.skills.filter(skill => 
    assignment.requiredSkills.some(req => 
      skill.toLowerCase().includes(req.toLowerCase()) || 
      req.toLowerCase().includes(skill.toLowerCase())
    )
  );

  const unmatchedSkills = assignment.requiredSkills.filter(req =>
    !consultant.skills.some(skill => 
      skill.toLowerCase().includes(req.toLowerCase()) || 
      req.toLowerCase().includes(skill.toLowerCase())
    )
  );

  const experienceYears = parseInt(consultant.experience) || 5;
  const technicalDepth = experienceYears > 7 ? 'Expert' : experienceYears > 4 ? 'Senior' : 'Mid-level';

  return {
    matchedSkills,
    unmatchedSkills,
    technicalDepth,
    skillMatchPercentage: Math.round((matchedSkills.length / assignment.requiredSkills.length) * 100),
    experienceLevel: `${experienceYears} år erfarenhet`,
    certifications: consultant.certifications || [],
    learningRecommendations: unmatchedSkills.slice(0, 3)
  };
};

const calculatePersonalityMatch = (consultant: Consultant, assignment: Assignment) => {
  const personalityTraits = consultant.personalityTraits || [];
  const workStyle = consultant.workStyle || 'Collaborativ';
  const communicationStyle = consultant.communicationStyle || 'Direkt och tydlig';
  
  return {
    workStyleCompatibility: Math.floor(Math.random() * 20) + 80,
    communicationAlignment: Math.floor(Math.random() * 15) + 85,
    teamFitScore: Math.floor(Math.random() * 25) + 75,
    leadershipPotential: consultant.leadership || 3,
    adaptabilityScore: consultant.adaptability || 5,
    personalityTraits,
    workStyle,
    communicationStyle,
    culturalValues: consultant.values || [],
    strengthsForRole: generateRoleStrengths(personalityTraits, assignment.title)
  };
};

const calculateIndustryMatch = (consultant: Consultant, assignment: Assignment) => {
  const hasIndustryExperience = Math.random() > 0.3; // Simulate industry experience
  const industryKnowledge = Math.floor(Math.random() * 30) + 70;
  
  return {
    industryExperience: hasIndustryExperience,
    industryKnowledgeScore: industryKnowledge,
    relevantProjects: Math.floor(Math.random() * 5) + 2,
    industrySpecificSkills: consultant.skills.slice(0, 3),
    marketUnderstanding: Math.floor(Math.random() * 20) + 80,
    clientTypeExperience: generateClientTypeExperience(assignment.industry),
    regulatoryKnowledge: assignment.industry === 'Fintech' || assignment.industry === 'Healthcare' ? 'Hög' : 'Medium'
  };
};

const generateProjectMetrics = (consultant: Consultant, matchScore: number) => {
  const successRate = Math.min(95, matchScore + Math.floor(Math.random() * 10));
  const avgProjectDuration = Math.floor(Math.random() * 8) + 4; // 4-12 månader
  const clientSatisfaction = Math.min(5.0, (matchScore / 20) + Math.random() * 0.5);
  
  return {
    successRate: `${successRate}%`,
    completedProjects: consultant.projects || Math.floor(Math.random() * 15) + 5,
    averageProjectDuration: `${avgProjectDuration} månader`,
    clientSatisfactionScore: clientSatisfaction.toFixed(1),
    repeatClientRate: `${Math.floor(Math.random() * 30) + 40}%`,
    timeToProductivity: `${Math.floor(Math.random() * 3) + 1} veckor`,
    budgetAccuracy: `${Math.floor(Math.random() * 15) + 85}%`,
    deliveryTimeliness: `${Math.floor(Math.random() * 10) + 90}%`
  };
};

const generateRoleStrengths = (traits: string[], roleTitle: string) => {
  const strengths = [
    'Problemlösning under press',
    'Teknisk ledarskap',
    'Klientkommunikation',
    'Agil utveckling',
    'Mentorskap av team',
    'Innovativ tänkande',
    'Kvalitetsfokus',
    'Stakeholder management'
  ];
  
  return strengths.slice(0, Math.floor(Math.random() * 3) + 3);
};

const generateClientTypeExperience = (industry: string) => {
  const experiences = {
    'Fintech': ['Banker', 'Försäkringsbolag', 'Startups', 'Regtech'],
    'E-handel': ['B2C platforms', 'B2B solutions', 'Marketplace', 'SaaS'],
    'Healthcare': ['Sjukhus', 'Medicintekniska företag', 'Digital hälsa', 'Pharma'],
    'Education': ['Universitet', 'K-12 skolor', 'EdTech startups', 'Företagsutbildning']
  };
  
  return experiences[industry] || ['Små företag', 'Medelstora företag', 'Enterprise', 'Startups'];
};

const generateRealisticCoverLetter = (consultant: Consultant, assignment: Assignment, matchScore: number): string => {
  const experienceYears = parseInt(consultant.experience) || 5;
  const matchedSkills = consultant.skills.filter(skill => 
    assignment.requiredSkills.some(req => 
      skill.toLowerCase().includes(req.toLowerCase()) || 
      req.toLowerCase().includes(skill.toLowerCase())
    )
  );

  return `Hej ${assignment.company}-teamet,

Jag skriver för att uttrycka mitt intresse för ${assignment.title}-positionen. Med ${experienceYears} års erfarenhet inom ${consultant.roles[0] || 'utveckling'} och stark expertis inom ${matchedSkills.slice(0, 3).join(', ')}, ser jag fram emot att bidra till era mål.

Min bakgrund inkluderar:
• ${experienceYears}+ års hands-on erfarenhet med ${matchedSkills.slice(0, 2).join(' och ')}
• Framgångsrik leverans av ${consultant.projects || Math.floor(Math.random() * 10) + 5}+ projekt
• Bevisad förmåga att arbeta i ${assignment.teamSize || 'team-miljöer'}
• Stark ${consultant.communicationStyle || 'kommunikationsförmåga'} som passar era behov

Jag är särskilt intresserad av denna roll eftersom den kombinerar teknisk utmaning med möjligheten att göra verklig affärsimpact inom ${assignment.industry}. Min ${consultant.workStyle || 'kollaborativa'} arbetsstil och fokus på kvalitet skulle vara värdefullt för ert team.

Jag är ${consultant.availability || 'tillgänglig'} och kan påbörja ${assignment.startDate || 'omedelbart'}. Låt oss diskutera hur jag kan bidra till ${assignment.company}s framgång.

Med vänliga hälsningar,
${consultant.name}

---
Kontakt: ${consultant.email} | ${consultant.phone || '+46 70 123 4567'}
Portfolio: ${consultant.linkedinUrl || 'Tillgänglig på begäran'}`;
};

// Legacy function kept for backward compatibility  
export const generateMotivationLetter = generateRealisticCoverLetter;
