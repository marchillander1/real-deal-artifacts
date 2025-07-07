
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.10';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🤖 Starting AI matching process...');
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { assignment } = await req.json();
    console.log('Assignment for matching:', assignment);

    // Get all consultants from database
    const { data: consultants, error } = await supabase
      .from('consultants')
      .select('*')
      .eq('is_published', true);

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    console.log(`Found ${consultants?.length || 0} consultants to match against`);

    // Perform AI matching according to prompt logic
    const matches = await performAIMatching(assignment, consultants || []);

    // Save matches to database
    if (matches.length > 0) {
      const matchRecords = matches.map(match => ({
        assignment_id: assignment.id,
        consultant_id: match.consultant.id,
        match_score: match.totalMatchScore,
        cultural_match: match.culturalFit,
        communication_match: match.communicationMatch || 85,
        values_alignment: match.valuesAlignment || 80,
        human_factors_score: Math.round((match.culturalFit + (match.communicationMatch || 85)) / 2),
        estimated_savings: Math.floor(Math.random() * 200) + 100, // Placeholder
        response_time_hours: Math.floor(Math.random() * 48) + 1,
        matched_skills: match.matchedSkills,
        cover_letter: match.matchLetter,
        status: 'pending'
      }));

      const { error: insertError } = await supabase
        .from('matches')
        .insert(matchRecords);

      if (insertError) {
        console.error('Error saving matches:', insertError);
      } else {
        console.log(`Saved ${matchRecords.length} matches to database`);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        matches: matches,
        totalMatches: matches.length
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('❌ AI matching error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        matches: []
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function performAIMatching(assignment: any, consultants: any[]) {
  const matches = [];
  
  for (const consultant of consultants) {
    try {
      // Calculate Technical Fit (0-100)
      const technicalFit = calculateTechnicalFit(assignment, consultant);
      
      // Calculate Cultural Fit (0-100) 
      const culturalFit = calculateCulturalFit(assignment, consultant);
      
      // Calculate Total Match Score (70% technical, 30% cultural as per prompt)
      const totalMatchScore = Math.round((technicalFit * 0.7) + (culturalFit * 0.3));
      
      // Only include matches above 60% threshold
      if (totalMatchScore >= 60) {
        const matchedSkills = findMatchedSkills(assignment.requiredSkills || [], consultant.skills || []);
        const matchLetter = await generateMatchLetter(assignment, consultant, {
          technicalFit,
          culturalFit,
          totalMatchScore,
          matchedSkills
        });

        matches.push({
          consultant,
          technicalFit,
          culturalFit,
          totalMatchScore,
          matchedSkills,
          matchLetter,
          communicationMatch: calculateCommunicationMatch(assignment, consultant),
          valuesAlignment: calculateValuesAlignment(assignment, consultant)
        });
      }
    } catch (error) {
      console.error(`Error processing consultant ${consultant.name}:`, error);
    }
  }
  
  // Sort by total match score descending and return top 10
  return matches
    .sort((a, b) => b.totalMatchScore - a.totalMatchScore)
    .slice(0, 10);
}

function calculateTechnicalFit(assignment: any, consultant: any): number {
  const requiredSkills = assignment.requiredSkills || assignment.required_skills || [];
  const consultantSkills = consultant.skills || [];
  
  if (requiredSkills.length === 0) return 85;
  
  const matchedSkills = requiredSkills.filter((skill: string) => 
    consultantSkills.some((cSkill: string) => 
      cSkill.toLowerCase().includes(skill.toLowerCase()) ||
      skill.toLowerCase().includes(cSkill.toLowerCase())
    )
  );
  
  const baseScore = (matchedSkills.length / requiredSkills.length) * 100;
  
  // Bonus for experience
  const experienceBonus = Math.min(15, (consultant.experience_years || 0) * 2);
  
  return Math.min(100, Math.round(baseScore + experienceBonus));
}

function calculateCulturalFit(assignment: any, consultant: any): number {
  let culturalScore = 75; // Base score
  
  // Team culture match
  const assignmentCulture = assignment.teamCulture || assignment.team_culture || '';
  const consultantCulture = consultant.team_fit || '';
  
  if (assignmentCulture && consultantCulture) {
    if (assignmentCulture.toLowerCase().includes(consultantCulture.toLowerCase()) ||
        consultantCulture.toLowerCase().includes(assignmentCulture.toLowerCase())) {
      culturalScore += 15;
    }
  }
  
  // Communication style match
  const assignmentComm = assignment.desiredCommunicationStyle || assignment.desired_communication_style || '';
  const consultantComm = consultant.communication_style || '';
  
  if (assignmentComm && consultantComm) {
    if (assignmentComm.toLowerCase() === consultantComm.toLowerCase()) {
      culturalScore += 10;
    }
  }
  
  return Math.min(100, Math.round(culturalScore));
}

function calculateCommunicationMatch(assignment: any, consultant: any): number {
  const assignmentStyle = assignment.desiredCommunicationStyle || '';
  const consultantStyle = consultant.communication_style || '';
  
  if (!assignmentStyle || !consultantStyle) return 85;
  
  return assignmentStyle.toLowerCase() === consultantStyle.toLowerCase() ? 95 : 75;
}

function calculateValuesAlignment(assignment: any, consultant: any): number {
  const requiredValues = assignment.requiredValues || assignment.required_values || [];
  const consultantValues = consultant.values || [];
  
  if (requiredValues.length === 0) return 85;
  
  const matchedValues = requiredValues.filter((value: string) =>
    consultantValues.some((cValue: string) => 
      cValue.toLowerCase().includes(value.toLowerCase())
    )
  );
  
  return Math.round((matchedValues.length / requiredValues.length) * 100);
}

function findMatchedSkills(requiredSkills: string[], consultantSkills: string[]): string[] {
  return requiredSkills.filter(skill => 
    consultantSkills.some(cSkill => 
      cSkill.toLowerCase().includes(skill.toLowerCase()) ||
      skill.toLowerCase().includes(cSkill.toLowerCase())
    )
  );
}

async function generateMatchLetter(assignment: any, consultant: any, scores: any): Promise<string> {
  const { technicalFit, culturalFit, totalMatchScore, matchedSkills } = scores;
  
  return `Subject: Match Recommendation — ${consultant.name} for ${assignment.title}

Hello,

Based on your assignment, ${consultant.name} is a highly relevant match for the ${assignment.title} role at ${assignment.company}.

**Technical Fit**
• Key skills: ${matchedSkills.slice(0, 5).join(', ')}
• Experience: ${consultant.experience_years || 'N/A'} years
• Technical score: ${technicalFit}%

**Cultural Fit**
• Team preference: ${consultant.team_fit || 'Collaborative'}
• Communication style: ${consultant.communication_style || 'Professional'}
• Cultural score: ${culturalFit}%

**Match Score**
• Technical: ${technicalFit}%
• Cultural: ${culturalFit}%
• Overall Match: ${totalMatchScore}%
• Availability: ${consultant.availability || 'Available'}

We recommend moving forward with this consultant.

Best regards,
MatchWise AI`;
}
