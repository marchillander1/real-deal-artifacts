
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.10';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { assignmentId } = await req.json();
    
    console.log('Starting AI matching for assignment:', assignmentId);

    // Fetch assignment details
    const { data: assignment, error: assignmentError } = await supabase
      .from('assignments')
      .select('*')
      .eq('id', assignmentId)
      .single();

    if (assignmentError) {
      throw new Error(`Assignment not found: ${assignmentError.message}`);
    }

    // Fetch all consultants
    const { data: consultants, error: consultantsError } = await supabase
      .from('consultants')
      .select('*');

    if (consultantsError) {
      throw new Error(`Failed to fetch consultants: ${consultantsError.message}`);
    }

    console.log(`Found ${consultants.length} consultants to evaluate`);

    if (!GROQ_API_KEY) {
      console.log('No GROQ API key found, using basic matching');
      return basicMatching(assignment, consultants);
    }

    // Use AI for intelligent matching
    const matches = await aiMatching(assignment, consultants);
    
    // Store matches in database
    for (const match of matches) {
      const { error: insertError } = await supabase
        .from('matches')
        .upsert({
          assignment_id: assignmentId,
          consultant_id: match.consultant_id,
          match_score: match.score,
          matched_skills: match.matched_skills,
          human_factors_score: match.human_factors_score,
          cultural_match: match.cultural_match,
          communication_match: match.communication_match,
          values_alignment: match.values_alignment,
          response_time_hours: match.response_time_hours,
          estimated_savings: match.estimated_savings,
          cover_letter: match.cover_letter,
          status: 'pending'
        }, {
          onConflict: 'assignment_id,consultant_id'
        });

      if (insertError) {
        console.error('Error inserting match:', insertError);
      }
    }

    console.log(`Successfully created ${matches.length} matches`);

    return new Response(JSON.stringify({ 
      success: true, 
      matches: matches.length,
      message: `Skapade ${matches.length} AI-genererade matchningar`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('AI matching error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function aiMatching(assignment: any, consultants: any[]) {
  const prompt = `Du är en expert på konsultmatchning. Analysera detta uppdrag och alla konsulter för att hitta de bästa matchningarna.

UPPDRAG:
Titel: ${assignment.title}
Beskrivning: ${assignment.description}
Krävda färdigheter: ${assignment.required_skills?.join(', ') || 'Ej specificerat'}
Företag: ${assignment.company}
Bransch: ${assignment.industry || 'Ej specificerat'}
Teamkultur: ${assignment.team_culture || 'Ej specificerat'}
Kommunikationsstil: ${assignment.desired_communication_style || 'Ej specificerat'}
Krävda värderingar: ${assignment.required_values?.join(', ') || 'Ej specificerat'}
Ledarskapsnivå: ${assignment.leadership_level || 3}/5
Budget: ${assignment.budget_min || 0}-${assignment.budget_max || 0} ${assignment.budget_currency || 'SEK'}
Remote: ${assignment.remote_type || 'Ej specificerat'}

KONSULTER:
${consultants.map((c, i) => `
${i + 1}. ${c.name} (ID: ${c.id})
   - Färdigheter: ${c.skills?.join(', ') || 'Ej specificerat'}
   - Erfarenhet: ${c.experience_years || 'Okänd'} år
   - Timlön: ${c.hourly_rate || 'Ej angiven'} SEK
   - Plats: ${c.location || 'Ej angiven'}
   - Kommunikationsstil: ${c.communication_style || 'Ej angiven'}
   - Värderingar: ${c.values?.join(', ') || 'Ej angivna'}
   - Kulturell passform: ${c.cultural_fit || 5}/5
   - Ledarskap: ${c.leadership || 3}/5
   - Anpassningsförmåga: ${c.adaptability || 5}/5
   - Roller: ${c.roles?.join(', ') || 'Ej angivna'}
   - Certifieringar: ${c.certifications?.join(', ') || 'Ej angivna'}
`).join('')}

Skapa en matchningsanalys och returnera ENDAST valid JSON med denna struktur:

{
  "matches": [
    {
      "consultant_id": "konsult-id",
      "consultant_name": "konsultens namn",
      "score": 85,
      "matched_skills": ["skill1", "skill2"],
      "human_factors_score": 88,
      "cultural_match": 4,
      "communication_match": 5,
      "values_alignment": 4,
      "response_time_hours": 24,
      "estimated_savings": 15000,
      "cover_letter": "Personligt brev baserat på matchning",
      "match_reasoning": "Kort förklaring av varför denna konsult passar"
    }
  ]
}

Regler:
- Inkludera endast de 10 bästa matchningarna
- Score: 0-100 baserat på färdigheter, erfarenhet, kulturell passform
- Human factors: Genomsnitt av cultural_match, communication_match, values_alignment
- Cover letter: 2-3 meningar som förklarar varför konsulten passar
- Estimated savings: Baserat på budget vs konsultens lön
- Response time: Realistisk tid baserat på konsultens profil`;

  try {
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: 'Du är en expert konsultmatchningsanalytiker. Returnera alltid valid JSON utan extra text.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 4000
      })
    });

    if (!groqResponse.ok) {
      throw new Error(`Groq API error: ${groqResponse.status}`);
    }

    const groqData = await groqResponse.json();
    const responseText = groqData.choices[0].message.content;
    
    // Clean and parse the JSON response
    const cleanedText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const result = JSON.parse(cleanedText);
    
    return result.matches.map((match: any) => ({
      consultant_id: match.consultant_id,
      score: Math.min(100, Math.max(0, match.score)),
      matched_skills: match.matched_skills || [],
      human_factors_score: Math.min(100, Math.max(0, match.human_factors_score)),
      cultural_match: Math.min(5, Math.max(1, match.cultural_match)),
      communication_match: Math.min(5, Math.max(1, match.communication_match)),
      values_alignment: Math.min(5, Math.max(1, match.values_alignment)),
      response_time_hours: match.response_time_hours || 48,
      estimated_savings: match.estimated_savings || 0,
      cover_letter: match.cover_letter || `${match.consultant_name} skulle vara en utmärkt match för detta uppdrag baserat på deras färdigheter och erfarenhet.`
    }));

  } catch (error) {
    console.error('AI matching failed, using basic matching:', error);
    return basicMatching(assignment, consultants);
  }
}

function basicMatching(assignment: any, consultants: any[]) {
  const matches = consultants.map(consultant => {
    // Calculate skill match
    const requiredSkills = assignment.required_skills || [];
    const consultantSkills = consultant.skills || [];
    const matchedSkills = requiredSkills.filter((skill: string) => 
      consultantSkills.some((cSkill: string) => 
        cSkill.toLowerCase().includes(skill.toLowerCase()) || 
        skill.toLowerCase().includes(cSkill.toLowerCase())
      )
    );
    
    const skillScore = requiredSkills.length > 0 ? 
      (matchedSkills.length / requiredSkills.length) * 60 : 50;
    
    // Calculate experience bonus
    const experienceBonus = Math.min(30, (consultant.experience_years || 0) * 3);
    
    // Calculate cultural fit score
    const culturalScore = (consultant.cultural_fit || 5) * 2;
    
    const totalScore = Math.min(100, skillScore + experienceBonus + culturalScore);
    
    // Estimate savings based on budget vs hourly rate
    const budgetMax = assignment.budget_max || 1000;
    const hourlyRate = consultant.hourly_rate || 800;
    const estimatedSavings = Math.max(0, budgetMax - hourlyRate) * 40; // 40 hours per month
    
    return {
      consultant_id: consultant.id,
      score: Math.round(totalScore),
      matched_skills: matchedSkills,
      human_factors_score: Math.round((consultant.cultural_fit || 5) * 20),
      cultural_match: consultant.cultural_fit || 5,
      communication_match: 4,
      values_alignment: 4,
      response_time_hours: 48,
      estimated_savings: estimatedSavings,
      cover_letter: `${consultant.name} har ${matchedSkills.length} matchande färdigheter och ${consultant.experience_years || 0} års erfarenhet som gör dem lämpliga för detta uppdrag.`
    };
  })
  .filter(match => match.score >= 30)
  .sort((a, b) => b.score - a.score)
  .slice(0, 10);
  
  return matches;
}
