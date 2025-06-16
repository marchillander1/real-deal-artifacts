

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.10';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Demo assignments data
const demoAssignments = [
  {
    id: "demo-1",
    title: "React Developer",
    company: "TechCorp AB",
    industry: "E-handel",
    requiredSkills: ["React", "TypeScript", "Node.js"],
    description: "Vi söker en erfaren React-utvecklare för att bygga vår e-handelsplattform"
  },
  {
    id: "demo-2", 
    title: "Full Stack Developer",
    company: "StartupXYZ",
    industry: "Fintech",
    requiredSkills: ["Vue.js", "Python", "AWS"],
    description: "Utveckla vår fintech-plattform med modern teknologi"
  }
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { assignmentId } = await req.json();
    console.log('Processing AI matching for assignment:', assignmentId);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let assignment;

    // Check if it's a demo assignment
    if (assignmentId.startsWith('demo-')) {
      assignment = demoAssignments.find(a => a.id === assignmentId);
      if (!assignment) {
        throw new Error(`Demo assignment not found: ${assignmentId}`);
      }
    } else {
      // Try to fetch from database for real assignments
      const { data: dbAssignment, error: assignmentError } = await supabase
        .from('assignments')
        .select('*')
        .eq('id', assignmentId)
        .single();

      if (assignmentError) {
        throw new Error(`Assignment not found: ${assignmentError.message}`);
      }
      assignment = dbAssignment;
    }

    // Fetch all consultants
    const { data: consultants, error: consultantsError } = await supabase
      .from('consultants')
      .select('*');

    if (consultantsError) {
      throw new Error(`Failed to fetch consultants: ${consultantsError.message}`);
    }

    if (!consultants || consultants.length === 0) {
      return new Response(JSON.stringify({
        success: true,
        message: 'No consultants found to match',
        matches: []
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`Found ${consultants.length} consultants to match against`);

    // Calculate matches for each consultant using Groq AI
    const matches = [];
    for (const consultant of consultants) {
      const matchScore = calculateMatchScore(consultant, assignment);
      const humanFactorsScore = calculateHumanFactors(consultant);
      const coverLetter = await generateCoverLetterWithGroq(consultant, assignment, matchScore);

      const match = {
        id: crypto.randomUUID(),
        consultant_id: consultant.id,
        assignment_id: assignmentId,
        match_score: matchScore,
        human_factors_score: humanFactorsScore,
        cultural_match: Math.floor(Math.random() * 2) + 4, // 4-5
        communication_match: Math.floor(Math.random() * 2) + 4, // 4-5
        values_alignment: Math.floor(Math.random() * 2) + 4, // 4-5
        response_time_hours: Math.floor(Math.random() * 24) + 1,
        matched_skills: getMatchedSkills(consultant.skills || [], assignment.requiredSkills || []),
        estimated_savings: Math.floor(Math.random() * 50000) + 10000,
        cover_letter: coverLetter,
        status: 'pending'
      };

      matches.push(match);
    }

    // Save matches to database (only for real assignments, not demo)
    if (!assignmentId.startsWith('demo-')) {
      const { error: insertError } = await supabase
        .from('matches')
        .insert(matches);

      if (insertError) {
        console.error('Error saving matches:', insertError);
      }
    }

    // Sort by match score
    matches.sort((a, b) => b.match_score - a.match_score);

    console.log(`Generated ${matches.length} matches with Groq AI`);

    return new Response(JSON.stringify({
      success: true,
      message: `AI matching complete! Found ${matches.length} potential matches.`,
      matches: matches
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('AI matching error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

function calculateMatchScore(consultant: any, assignment: any): number {
  const consultantSkills = consultant.skills || [];
  const requiredSkills = assignment.requiredSkills || [];
  
  if (requiredSkills.length === 0) return 75; // Default score if no requirements
  
  const matchingSkills = consultantSkills.filter((skill: string) => 
    requiredSkills.some((required: string) => 
      skill.toLowerCase().includes(required.toLowerCase()) || 
      required.toLowerCase().includes(skill.toLowerCase())
    )
  );
  
  const skillMatchPercentage = (matchingSkills.length / requiredSkills.length) * 100;
  const experienceBonus = Math.min((consultant.experience_years || 0) * 2, 20);
  const ratingBonus = (consultant.rating || 0) * 2;
  
  return Math.min(Math.round(skillMatchPercentage * 0.6 + experienceBonus + ratingBonus), 98);
}

function calculateHumanFactors(consultant: any): number {
  const cultural = consultant.cultural_fit || 4;
  const adaptability = consultant.adaptability || 4;
  const leadership = consultant.leadership || 3;
  
  return Math.round((cultural + adaptability + leadership) / 3 * 20); // Scale to 100
}

function getMatchedSkills(consultantSkills: string[], requiredSkills: string[]): string[] {
  return consultantSkills.filter(skill => 
    requiredSkills.some(required => 
      skill.toLowerCase().includes(required.toLowerCase()) || 
      required.toLowerCase().includes(skill.toLowerCase())
    )
  );
}

async function generateCoverLetterWithGroq(consultant: any, assignment: any, matchScore: number): Promise<string> {
  const groqApiKey = Deno.env.get('GROQ_API_KEY');
  
  if (!groqApiKey) {
    console.log('No Groq API key found, using fallback cover letter');
    return generateFallbackCoverLetter(consultant, assignment, matchScore);
  }

  try {
    const matchedSkills = getMatchedSkills(consultant.skills || [], assignment.requiredSkills || []);
    
    const prompt = `Skriv ett professionellt motivationsbrev på svenska för ${consultant.name} som ${consultant.roles?.[0] || 'Konsult'} för positionen "${assignment.title}" på ${assignment.company}.

Konsultens information:
- Namn: ${consultant.name}
- Erfarenhet: ${consultant.experience_years || 'Flera'} år
- Kompetenser: ${(consultant.skills || []).slice(0, 5).join(', ')}
- Matchande kompetenser: ${matchedSkills.join(', ')}
- Betyg: ${consultant.rating || 5}/5

Uppdragsinformation:
- Titel: ${assignment.title}
- Företag: ${assignment.company}
- Bransch: ${assignment.industry}
- Beskrivning: ${assignment.description}

Match score: ${matchScore}%

Skriv ett kortfattat men övertygande motivationsbrev (max 200 ord) som betonar:
1. Relevanta kompetenser för uppdraget
2. Erfarenhet inom branschen
3. Värde konsulten kan tillföra

Börja med "Hej ${assignment.company}!" och avsluta med "Med vänliga hälsningar, ${consultant.name}".`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192', // Fast and free Groq model
        messages: [
          { 
            role: 'system', 
            content: 'Du är en expert på att skriva professionella motivationsbrev för konsulter. Skriv kortfattat, övertygande och på svenska.' 
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 300,
        temperature: 0.7,
        top_p: 0.9
      }),
    });

    if (!response.ok) {
      console.error(`Groq API error: ${response.status} ${response.statusText}`);
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedLetter = data.choices[0].message.content;
    
    console.log('Successfully generated cover letter with Groq AI');
    return generatedLetter;

  } catch (error) {
    console.error('Error generating cover letter with Groq:', error);
    return generateFallbackCoverLetter(consultant, assignment, matchScore);
  }
}

function generateFallbackCoverLetter(consultant: any, assignment: any, matchScore: number): string {
  const matchedSkills = getMatchedSkills(consultant.skills || [], assignment.requiredSkills || []);
  
  return `Hej ${assignment.company}!

Som erfaren ${consultant.roles?.[0] || 'konsult'} med ${consultant.experience_years || 'flera'} års erfarenhet är jag mycket intresserad av er ${assignment.title}-position.

Min expertis inom ${matchedSkills.slice(0, 3).join(', ')} gör mig till en perfekt kandidat för detta uppdrag. Med en matchning på ${matchScore}% och ett betyg på ${consultant.rating || 5}/5 från tidigare kunder, är jag redo att leverera exceptionella resultat från dag ett.

Jag har framgångsrikt lett projekt inom ${assignment.industry || 'branschen'} och förstår de unika utmaningar ni står inför. Min kombination av teknisk kompetens och affärsförståelse säkerställer att jag inte bara löser tekniska problem, utan även bidrar till er affärstillväxt.

Jag ser fram emot att diskutera hur jag kan bidra till ert teams framgång och hjälpa er att uppnå era mål för detta projekt.

Med vänliga hälsningar,
${consultant.name}`;
}

