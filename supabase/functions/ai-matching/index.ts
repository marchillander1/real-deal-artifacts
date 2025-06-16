
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
    
    console.log('🚀 Starting comprehensive AI matching for assignment:', assignmentId);

    // Fetch assignment details
    const { data: assignment, error: assignmentError } = await supabase
      .from('assignments')
      .select('*')
      .eq('id', assignmentId)
      .single();

    if (assignmentError) {
      throw new Error(`Assignment not found: ${assignmentError.message}`);
    }

    console.log('📋 Assignment loaded:', assignment.title);

    // Fetch all consultants with their analysis data
    const { data: consultants, error: consultantsError } = await supabase
      .from('consultants')
      .select('*');

    if (consultantsError) {
      throw new Error(`Failed to fetch consultants: ${consultantsError.message}`);
    }

    console.log(`👥 Found ${consultants.length} consultants to evaluate comprehensively`);

    if (!GROQ_API_KEY) {
      console.log('⚠️ No GROQ API key found, using enhanced basic matching');
      return enhancedBasicMatching(assignment, consultants);
    }

    // Use AI for intelligent, comprehensive matching
    const matches = await comprehensiveAiMatching(assignment, consultants);
    
    // Store matches in database
    let storedMatches = 0;
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
        console.error('❌ Error inserting match:', insertError);
      } else {
        storedMatches++;
      }
    }

    console.log(`✅ Successfully created ${storedMatches}/${matches.length} comprehensive AI matches`);

    return new Response(JSON.stringify({ 
      success: true, 
      matches: storedMatches,
      total_analyzed: consultants.length,
      message: `Skapade ${storedMatches} AI-genererade matchningar från ${consultants.length} analyserade konsulter`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Comprehensive AI matching error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function comprehensiveAiMatching(assignment: any, consultants: any[]) {
  console.log('🤖 Starting comprehensive AI analysis with detailed consultant profiles...');
  
  const prompt = `Du är en expert på konsultmatchning med djup förståelse för teknisk expertis och organisationspsykologi. Analysera detta uppdrag och alla konsulter för att hitta de absolut bästa matchningarna baserat på teknisk kompetens, kulturell passform, och affärsvärde.

UPPDRAG DETALJER:
Titel: ${assignment.title}
Beskrivning: ${assignment.description}
Krävda färdigheter: ${assignment.required_skills?.join(', ') || 'Ej specificerat'}
Företag: ${assignment.company}
Bransch: ${assignment.industry || 'Teknologi'}
Teamkultur: ${assignment.team_culture || 'Kollaborativ'}
Kommunikationsstil: ${assignment.desired_communication_style || 'Direkt och transparent'}
Krävda värderingar: ${assignment.required_values?.join(', ') || 'Innovation, kvalitet'}
Ledarskapsnivå: ${assignment.leadership_level || 3}/5
Budget: ${assignment.budget_min || 800}-${assignment.budget_max || 1500} ${assignment.budget_currency || 'SEK'}/timme
Remote: ${assignment.remote_type || 'Hybrid'}
Teamstorlek: ${assignment.team_size || 'Medium (5-10 personer)'}
Arbetsbörda: ${assignment.workload || '100%'}
Startdatum: ${assignment.start_date || 'Så snart som möjligt'}

KONSULTER MED FULLSTÄNDIG PROFIL ANALYS:
${consultants.map((c, i) => {
  // Parse CV analysis if it exists
  let cvAnalysis = null;
  try {
    if (typeof c.cv_analysis === 'string') {
      cvAnalysis = JSON.parse(c.cv_analysis);
    } else if (c.cv_analysis && typeof c.cv_analysis === 'object') {
      cvAnalysis = c.cv_analysis;
    }
  } catch (e) {
    console.log(`Warning: Could not parse CV analysis for ${c.name}`);
  }

  // Parse LinkedIn analysis if it exists
  let linkedinAnalysis = null;
  try {
    if (typeof c.linkedin_analysis === 'string') {
      linkedinAnalysis = JSON.parse(c.linkedin_analysis);
    } else if (c.linkedin_analysis && typeof c.linkedin_analysis === 'object') {
      linkedinAnalysis = c.linkedin_analysis;
    }
  } catch (e) {
    console.log(`Warning: Could not parse LinkedIn analysis for ${c.name}`);
  }

  return `
KONSULT ${i + 1}: ${c.name} (ID: ${c.id})
═══════════════════════════════════════════════════════════

GRUNDINFORMATION:
• Namn: ${c.name}
• Email: ${c.email}
• Telefon: ${c.phone || 'Ej angiven'}
• Plats: ${c.location || 'Ej angiven'}
• Erfarenhet: ${c.experience_years || 'Okänd'} år
• Nuvarande timlön: ${c.hourly_rate || 'Ej angiven'} SEK
• Tillgänglighet: ${c.availability || 'Okänd'}

TEKNISK PROFIL:
• Färdigheter: ${c.skills?.join(', ') || 'Ej specificerat'}
• Roller: ${c.roles?.join(', ') || 'Ej angivna'}
• Certifieringar: ${c.certifications?.join(', ') || 'Ej angivna'}
• Rating: ${c.rating || 5}/5
• Avslutade projekt: ${c.projects_completed || 0}

PERSONLIGHET & KULTUR:
• Kommunikationsstil: ${c.communication_style || 'Ej angiven'}
• Arbetsstil: ${c.work_style || 'Ej angiven'}
• Värderingar: ${c.values?.join(', ') || 'Ej angivna'}
• Personlighetsdrag: ${c.personality_traits?.join(', ') || 'Ej angivna'}
• Språk: ${c.languages?.join(', ') || 'Svenska, Engelska'}

MATCHNINGSDATA:
• Kulturell passform: ${c.cultural_fit || 5}/5
• Ledarskap: ${c.leadership || 3}/5
• Anpassningsförmåga: ${c.adaptability || 5}/5
• Senast aktiv: ${c.last_active || 'Okänd'}

${cvAnalysis ? `
CV-ANALYS (AI-GENERERAD):
• Senioritetsnivå: ${cvAnalysis.professionalSummary?.seniorityLevel || 'Okänd'}
• Nuvarande roll: ${cvAnalysis.professionalSummary?.currentRole || 'Okänd'}
• Specialiseringar: ${cvAnalysis.professionalSummary?.specializations?.join(', ') || 'Ej angivna'}
• Teknisk djup: ${cvAnalysis.technicalSkillsAnalysis?.technicalDepthAssessment || 'Ej bedömd'}
• Marknadsposition: ${cvAnalysis.marketPositioning?.competitiveness || 'Ej bedömd'}
• Rekommenderat timpris: ${cvAnalysis.marketPositioning?.hourlyRateEstimate?.recommended || 'Ej uppskattat'} SEK
• Ledarskapsförmåga: ${cvAnalysis.leadershipCapabilities?.leadershipStyle || 'Ej bedömd'}
• Affärsförståelse: ${cvAnalysis.consultingReadiness?.businessAcumen || 'Ej bedömd'}
` : ''}

${linkedinAnalysis ? `
LINKEDIN-ANALYS (AI-GENERERAD):
• Kommunikationsstil: ${linkedinAnalysis.communicationStyle || 'Ej bedömd'}
• Ledarskapsformat: ${linkedinAnalysis.leadershipStyle || 'Ej bedömd'}
• Problemlösning: ${linkedinAnalysis.problemSolving || 'Ej bedömd'}
• Teamsamarbete: ${linkedinAnalysis.teamCollaboration || 'Ej bedömd'}
• Innovation: ${linkedinAnalysis.innovation || 'Ej bedömd'}/5
• Affärsförståelse: ${linkedinAnalysis.businessAcumen || 'Ej bedömd'}
` : ''}
`;
}).join('\n')}

ANALYS INSTRUKTIONER:
Genomför en djup teknisk och kulturell matchningsanalys. Beakta:
• Teknisk kompatibilitet och expertis-nivå
• Kulturell passform och kommunikationsstil
• Affärsvärde och kostnad-nytta
• Leveransförmåga och projekthistorik
• Teamdynamik och ledarskapsförmåga

Skapa personliga, övertygande cover letters som förklarar varför varje konsult är perfekt för uppdraget.

Returnera ENDAST valid JSON:

{
  "matches": [
    {
      "consultant_id": "konsult-id",
      "consultant_name": "konsultens namn",
      "score": 92,
      "matched_skills": ["React", "TypeScript", "Node.js"],
      "human_factors_score": 88,
      "cultural_match": 5,
      "communication_match": 4,
      "values_alignment": 5,
      "response_time_hours": 24,
      "estimated_savings": 25000,
      "cover_letter": "Hej! Jag är övertygad om att [Konsultnamn] är den perfekta kandidaten för detta [uppdragstyp] uppdrag. Med [X år] års erfarenhet inom [relevanta teknologier] och bevisad track record från [specifika erfarenheter], kommer [hen] att leverera exceptionell värde. [Hans/hennes] expertis inom [specifika områden] matchar perfekt era behov inom [uppdragsområde]. [Personlig touch baserat på konsultens profil och uppdraget]. Jag ser fram emot att diskutera hur [konsultnamn] kan bidra till ert teams framgång!",
      "match_reasoning": "Omfattande förklaring av teknisk passform, kulturell matchning och affärsvärde"
    }
  ]
}

KRAV:
- Inkludera endast de 15 bästa matchningarna (minimum 70 poäng)
- Score: 0-100 baserat på teknisk expertis, kulturell passform, affärsvärde
- Cover letter: 4-6 meningar, personlig och specifik för uppdraget
- Använd VERKLIGA data från konsultprofilerna
- Estimated savings: Realistisk baserat på budget vs konsultens förväntade lön`;

  try {
    console.log('🤖 Calling Groq API for comprehensive matching analysis...');
    
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'Du är en expert konsultmatchningsanalytiker med djup förståelse för teknisk expertis, organisationspsykologi och affärsdynamik. Du skapar personliga, övertygande matchningar baserat på omfattande dataanalys. Returnera alltid valid JSON utan extra text.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 6000
      })
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.error('❌ Groq API error:', groqResponse.status, errorText);
      throw new Error(`Groq API error: ${groqResponse.status}`);
    }

    const groqData = await groqResponse.json();
    const responseText = groqData.choices[0].message.content;
    
    console.log('📝 AI response received, parsing comprehensive matches...');
    
    // Clean and parse the JSON response
    const cleanedText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const result = JSON.parse(cleanedText);
    
    console.log(`✅ Successfully parsed ${result.matches?.length || 0} AI-generated matches`);
    
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
      cover_letter: match.cover_letter || `${match.consultant_name} skulle vara en utmärkt match för detta uppdrag baserat på deras tekniska färdigheter och erfarenhet inom ${match.matched_skills?.slice(0,3).join(', ') || 'relevanta områden'}.`
    }));

  } catch (error) {
    console.error('❌ AI matching failed, using enhanced fallback:', error);
    return enhancedBasicMatching(assignment, consultants);
  }
}

function enhancedBasicMatching(assignment: any, consultants: any[]) {
  console.log('🔄 Using enhanced basic matching algorithm...');
  
  const matches = consultants.map(consultant => {
    // Calculate skill match with fuzzy matching
    const requiredSkills = assignment.required_skills || [];
    const consultantSkills = consultant.skills || [];
    const matchedSkills = requiredSkills.filter((skill: string) => 
      consultantSkills.some((cSkill: string) => 
        cSkill.toLowerCase().includes(skill.toLowerCase()) || 
        skill.toLowerCase().includes(cSkill.toLowerCase())
      )
    );
    
    const skillScore = requiredSkills.length > 0 ? 
      (matchedSkills.length / requiredSkills.length) * 50 : 40;
    
    // Calculate experience bonus
    const experienceBonus = Math.min(25, (consultant.experience_years || 0) * 2.5);
    
    // Calculate cultural and soft skills scores
    const culturalScore = (consultant.cultural_fit || 5) * 3;
    const leadershipScore = (consultant.leadership || 3) * 2;
    const adaptabilityScore = (consultant.adaptability || 5) * 2;
    
    const totalScore = Math.min(100, skillScore + experienceBonus + culturalScore + leadershipScore + adaptabilityScore);
    
    // Enhanced savings calculation
    const budgetMax = assignment.budget_max || 1200;
    const hourlyRate = consultant.hourly_rate || 900;
    const monthlySavings = Math.max(0, budgetMax - hourlyRate) * 160; // Full time month
    
    // Generate enhanced cover letter
    const coverLetter = generateEnhancedCoverLetter(consultant, assignment, matchedSkills);
    
    return {
      consultant_id: consultant.id,
      score: Math.round(totalScore),
      matched_skills: matchedSkills,
      human_factors_score: Math.round((culturalScore + leadershipScore + adaptabilityScore) / 3),
      cultural_match: consultant.cultural_fit || 5,
      communication_match: 4,
      values_alignment: 4,
      response_time_hours: 48,
      estimated_savings: monthlySavings,
      cover_letter: coverLetter
    };
  })
  .filter(match => match.score >= 50)
  .sort((a, b) => b.score - a.score)
  .slice(0, 15);
  
  console.log(`✅ Enhanced basic matching completed: ${matches.length} matches generated`);
  return matches;
}

function generateEnhancedCoverLetter(consultant: any, assignment: any, matchedSkills: string[]): string {
  const name = consultant.name;
  const experience = consultant.experience_years || 'flera';
  const skills = matchedSkills.slice(0, 3).join(', ') || 'relevanta teknologier';
  const company = assignment.company;
  
  const templates = [
    `Hej! Jag är övertygad om att ${name} är den perfekta kandidaten för ${assignment.title} uppdraget hos ${company}. Med ${experience} års bred erfarenhet inom ${skills} och stark bakgrund inom ${consultant.roles?.slice(0,2).join(' och ') || 'utveckling'}, kommer ${name} att leverera exceptionellt värde. Deras expertis matchar perfekt era behov och teamkulturen. Jag ser fram emot att diskutera hur ${name} kan bidra till ert projekts framgång!`,
    
    `${name} skulle vara en idealisk match för detta ${assignment.title} uppdrag. Med djup kompetens inom ${skills} och ${experience} års erfaren track record, är ${name} redo att leverera från dag ett. Deras ${consultant.communication_style || 'professionella'} kommunikationsstil och ${consultant.work_style || 'flexibla'} arbetssätt passar utmärkt för ${company}s kultur. Låt oss diskutera hur ${name} kan stärka ert team!`,
    
    `Jag rekommenderar starkt ${name} för ${assignment.title} positionen. ${name}s omfattande erfarenhet inom ${skills} kombinerat med ${experience} års praktisk expertis gör dem till en ovärderlig tillgång för ${company}. Deras bevisade förmåga att leverera kvalitet i tid och budget, tillsammans med stark teamsamarbetsförmåga, gör dem till den idealiska kandidaten för detta uppdrag.`
  ];
  
  return templates[Math.floor(Math.random() * templates.length)];
}
