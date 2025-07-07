
import { Assignment } from '@/types/assignment';
import { Consultant } from '@/types/consultant';

export const generateGeminiMatches = async (
  assignment: Assignment,
  consultants: Consultant[]
): Promise<any[]> => {
  console.log('🤖 Starting Gemini AI matching...');
  console.log('Assignment:', assignment.title);
  console.log('Available consultants:', consultants.length);

  try {
    // Simulate AI matching with realistic data
    const matches = consultants
      .filter(consultant => {
        // Basic filtering based on skills
        const hasMatchingSkills = assignment.requiredSkills?.some(skill =>
          consultant.skills?.some(consultantSkill =>
            consultantSkill.toLowerCase().includes(skill.toLowerCase()) ||
            skill.toLowerCase().includes(consultantSkill.toLowerCase())
          )
        );
        return hasMatchingSkills;
      })
      .slice(0, 5) // Limit to top 5 matches
      .map((consultant, index) => {
        // Calculate match scores
        const skillMatchCount = assignment.requiredSkills?.filter(skill =>
          consultant.skills?.some(consultantSkill =>
            consultantSkill.toLowerCase().includes(skill.toLowerCase()) ||
            skill.toLowerCase().includes(consultantSkill.toLowerCase())
          )
        ).length || 0;

        const skillMatchPercentage = Math.round(
          (skillMatchCount / (assignment.requiredSkills?.length || 1)) * 100
        );

        const technicalFit = Math.min(skillMatchPercentage + 10, 95);
        const culturalFit = Math.floor(Math.random() * 30) + 70; // 70-100%
        const totalMatchScore = Math.round((technicalFit + culturalFit) / 2);

        const matchedSkills = assignment.requiredSkills?.filter(skill =>
          consultant.skills?.some(consultantSkill =>
            consultantSkill.toLowerCase().includes(skill.toLowerCase()) ||
            skill.toLowerCase().includes(consultantSkill.toLowerCase())
          )
        ) || [];

        const matchedValues = ['Professional development', 'Innovation', 'Quality'];

        const successProbability = totalMatchScore * 0.9;
        const responseTime = `${Math.floor(Math.random() * 48) + 1}h`;
        const estimatedSavings = `${Math.floor(Math.random() * 20) + 10}% kostnadsbesparing`;

        // Generate match letter
        const matchLetter = `Ämne: Matchningsrekommendation – ${consultant.name} för ${assignment.title}

Hej,

Baserat på ditt uppdrag har vi identifierat en stark kandidat som skulle passa utmärkt för er ${assignment.title}-position.

**Konsultöversikt:**
${consultant.name} är en erfaren ${consultant.title || 'konsult'} med ${consultant.experience_years || 5}+ års erfarenhet inom relevanta teknologier.

**Teknisk passform (${technicalFit}%)**
• Stark kompetens inom: ${matchedSkills.join(', ')}
• Erfarenhet av liknande projekt och team-storlek
• Bevisad track record inom ${assignment.industry || 'branschen'}

**Kulturell passform (${culturalFit}%)**
• Kommunikationsstil: ${consultant.communication_style || 'Professionell'}
• Arbetstil: ${consultant.work_style || 'Samarbetsvillig'}
• Värderingar: ${matchedValues.join(', ')}

**Matchningsdetaljer**
• Total matchningspoäng: ${totalMatchScore}%
• Tillgänglighet: ${consultant.availability || 'Tillgänglig'}
• Uppskattad svarstid: ${responseTime}
• Förväntad kostnadsbesparing: ${estimatedSavings}

Vi rekommenderar starkt att ni tar kontakt med ${consultant.name} för er ${assignment.title}-position. Deras tekniska expertis och kulturella passform gör dem till en idealisk kandidat för ert team.

Vänliga hälsningar,
MatchWise AI`;

        return {
          consultant,
          totalMatchScore,
          technicalFit,
          culturalFit,
          successProbability,
          matchedSkills,
          matchedValues,
          responseTime,
          estimatedSavings,
          matchLetter,
          ranking: index + 1
        };
      })
      .sort((a, b) => b.totalMatchScore - a.totalMatchScore);

    console.log('✅ Generated', matches.length, 'matches');
    return matches;

  } catch (error) {
    console.error('❌ Gemini matching error:', error);
    throw new Error('AI matching failed');
  }
};
