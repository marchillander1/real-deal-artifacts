
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
    description: "Vi söker en erfaren React-utvecklare för att bygga vår e-handelsplattform",
    teamCulture: "Agile and collaborative",
    desiredCommunicationStyle: "Direct and clear",
    requiredValues: ["Innovation", "Quality", "Teamwork"],
    leadershipLevel: 3,
    teamDynamics: "Small, close-knit team"
  },
  {
    id: "demo-2", 
    title: "Full Stack Developer",
    company: "StartupXYZ",
    industry: "Fintech",
    requiredSkills: ["Vue.js", "Python", "AWS"],
    description: "Utveckla vår fintech-plattform med modern teknologi",
    teamCulture: "Fast-paced and innovative",
    desiredCommunicationStyle: "Collaborative and proactive",
    requiredValues: ["Excellence", "Innovation", "Transparency"],
    leadershipLevel: 4,
    teamDynamics: "Cross-functional team"
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

    // Calculate matches for each consultant using enhanced scoring
    const matches = [];
    for (const consultant of consultants) {
      const technicalScore = calculateTechnicalMatch(consultant, assignment);
      const personalityScore = calculatePersonalityMatch(consultant, assignment);
      const communicationScore = calculateCommunicationMatch(consultant, assignment);
      const valuesScore = calculateValuesAlignment(consultant, assignment);
      const culturalScore = calculateCulturalFit(consultant, assignment);
      
      // Combined match score with weighted factors
      const matchScore = Math.round(
        technicalScore * 0.4 +      // 40% technical skills
        personalityScore * 0.25 +    // 25% personality fit
        communicationScore * 0.15 +  // 15% communication style
        valuesScore * 0.15 +         // 15% values alignment
        culturalScore * 0.05         // 5% cultural fit
      );

      const humanFactorsScore = Math.round((personalityScore + communicationScore + valuesScore + culturalScore) / 4);
      const coverLetter = await generateCoverLetterWithGroq(consultant, assignment, matchScore);

      const match = {
        id: crypto.randomUUID(),
        consultant_id: consultant.id,
        assignment_id: assignmentId,
        match_score: Math.min(matchScore, 98),
        human_factors_score: humanFactorsScore,
        cultural_match: culturalScore,
        communication_match: communicationScore,
        values_alignment: valuesScore,
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

    console.log(`Generated ${matches.length} matches with enhanced personality scoring`);

    return new Response(JSON.stringify({
      success: true,
      message: `AI matching complete! Found ${matches.length} potential matches with personality analysis.`,
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

function calculateTechnicalMatch(consultant: any, assignment: any): number {
  const consultantSkills = consultant.skills || [];
  const requiredSkills = assignment.requiredSkills || [];
  
  if (requiredSkills.length === 0) return 75;
  
  const matchingSkills = consultantSkills.filter((skill: string) => 
    requiredSkills.some((required: string) => 
      skill.toLowerCase().includes(required.toLowerCase()) || 
      required.toLowerCase().includes(skill.toLowerCase())
    )
  );
  
  const skillMatchPercentage = (matchingSkills.length / requiredSkills.length) * 100;
  const experienceBonus = Math.min((consultant.experience_years || 0) * 2, 20);
  const ratingBonus = (consultant.rating || 0) * 2;
  
  return Math.min(Math.round(skillMatchPercentage * 0.6 + experienceBonus + ratingBonus), 100);
}

function calculatePersonalityMatch(consultant: any, assignment: any): number {
  // Analyze personality traits compatibility
  const consultantTraits = consultant.personality_traits || [];
  const workStyle = consultant.work_style || '';
  const teamFit = consultant.team_fit || '';
  
  let personalityScore = 70; // Base score
  
  // Boost score based on relevant personality traits
  const positiveTraits = ['Collaborative', 'Adaptable', 'Problem-solver', 'Detail-oriented', 'Proactive'];
  const matchingTraits = consultantTraits.filter(trait => 
    positiveTraits.some(positive => trait.toLowerCase().includes(positive.toLowerCase()))
  );
  
  personalityScore += matchingTraits.length * 5;
  
  // Work style compatibility
  if (workStyle.toLowerCase().includes('team') && assignment.teamDynamics?.toLowerCase().includes('team')) {
    personalityScore += 10;
  }
  
  if (workStyle.toLowerCase().includes('independent') && assignment.teamSize?.toLowerCase().includes('small')) {
    personalityScore += 8;
  }
  
  // Team fit analysis
  if (teamFit.toLowerCase().includes('excellent') || teamFit.toLowerCase().includes('strong')) {
    personalityScore += 15;
  }
  
  return Math.min(personalityScore, 100);
}

function calculateCommunicationMatch(consultant: any, assignment: any): number {
  const consultantStyle = consultant.communication_style || '';
  const desiredStyle = assignment.desiredCommunicationStyle || assignment.desired_communication_style || '';
  
  let communicationScore = 75; // Base score
  
  if (!desiredStyle) return communicationScore;
  
  // Direct style matching
  if (consultantStyle.toLowerCase().includes('direct') && desiredStyle.toLowerCase().includes('direct')) {
    communicationScore += 20;
  }
  
  if (consultantStyle.toLowerCase().includes('collaborative') && desiredStyle.toLowerCase().includes('collaborative')) {
    communicationScore += 20;
  }
  
  if (consultantStyle.toLowerCase().includes('clear') && desiredStyle.toLowerCase().includes('clear')) {
    communicationScore += 15;
  }
  
  if (consultantStyle.toLowerCase().includes('proactive') && desiredStyle.toLowerCase().includes('proactive')) {
    communicationScore += 15;
  }
  
  return Math.min(communicationScore, 100);
}

function calculateValuesAlignment(consultant: any, assignment: any): number {
  const consultantValues = consultant.values || [];
  const requiredValues = assignment.requiredValues || assignment.required_values || [];
  
  if (requiredValues.length === 0) return 80;
  
  const matchingValues = consultantValues.filter(value => 
    requiredValues.some(required => 
      value.toLowerCase().includes(required.toLowerCase()) || 
      required.toLowerCase().includes(value.toLowerCase())
    )
  );
  
  const valueMatchPercentage = (matchingValues.length / requiredValues.length) * 100;
  const baseScore = 60;
  
  return Math.min(Math.round(baseScore + valueMatchPercentage * 0.4), 100);
}

function calculateCulturalFit(consultant: any, assignment: any): number {
  let culturalScore = consultant.cultural_fit ? consultant.cultural_fit * 20 : 80; // Scale 1-5 to 20-100
  
  const teamCulture = assignment.teamCulture || assignment.team_culture || '';
  const consultantAdaptability = consultant.adaptability || 4;
  
  // Adaptability bonus
  culturalScore += (consultantAdaptability - 3) * 5;
  
  // Culture-specific matching
  if (teamCulture.toLowerCase().includes('agile') && consultant.work_style?.toLowerCase().includes('agile')) {
    culturalScore += 10;
  }
  
  if (teamCulture.toLowerCase().includes('innovative') && consultant.personality_traits?.some(trait => 
    trait.toLowerCase().includes('innovative') || trait.toLowerCase().includes('creative')
  )) {
    culturalScore += 10;
  }
  
  if (teamCulture.toLowerCase().includes('fast-paced') && consultant.personality_traits?.some(trait => 
    trait.toLowerCase().includes('proactive') || trait.toLowerCase().includes('efficient')
  )) {
    culturalScore += 10;
  }
  
  return Math.min(culturalScore, 100);
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
    const personalityHighlights = consultant.personality_traits?.slice(0, 3).join(', ') || 'Profesionell och målinriktad';
    const valuesAlignment = consultant.values?.slice(0, 2).join(' och ') || 'kvalitet och innovation';
    
    const prompt = `Skriv ett professionellt motivationsbrev på svenska för ${consultant.name} som ${consultant.roles?.[0] || 'Konsult'} för positionen "${assignment.title}" på ${assignment.company}.

Konsultens information:
- Namn: ${consultant.name}
- Erfarenhet: ${consultant.experience_years || 'Flera'} år
- Kompetenser: ${(consultant.skills || []).slice(0, 5).join(', ')}
- Matchande kompetenser: ${matchedSkills.join(', ')}
- Personlighet: ${personalityHighlights}
- Värderingar: ${valuesAlignment}
- Kommunikationsstil: ${consultant.communication_style || 'Professionell och tydlig'}
- Arbetssätt: ${consultant.work_style || 'Målinriktat och samarbetsinriktat'}
- Betyg: ${consultant.rating || 5}/5

Uppdragsinformation:
- Titel: ${assignment.title}
- Företag: ${assignment.company}
- Bransch: ${assignment.industry}
- Beskrivning: ${assignment.description}
- Teamkultur: ${assignment.teamCulture || assignment.team_culture || 'Professionell och samarbetsinriktad'}
- Önskad kommunikation: ${assignment.desiredCommunicationStyle || assignment.desired_communication_style || 'Tydlig och effektiv'}

Match score: ${matchScore}% (inkluderar både teknisk kompetens och personlighet)

Skriv ett kortfattat men övertygande motivationsbrev (max 200 ord) som betonar:
1. Tekniska färdigheter som matchar uppdraget
2. Personlighet och arbetssätt som passar teamkulturen
3. Värderingar som alignar med företaget
4. Kommunikationsstil som passar önskemålen

Börja med "Hej ${assignment.company}!" och avsluta med "Med vänliga hälsningar, ${consultant.name}".`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          { 
            role: 'system', 
            content: 'Du är en expert på att skriva professionella motivationsbrev för konsulter som tar hänsyn till både teknisk kompetens och personlighet. Skriv kortfattat, övertygande och på svenska.' 
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 350,
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
    
    console.log('Successfully generated personality-aware cover letter with Groq AI');
    return generatedLetter;

  } catch (error) {
    console.error('Error generating cover letter with Groq:', error);
    return generateFallbackCoverLetter(consultant, assignment, matchScore);
  }
}

function generateFallbackCoverLetter(consultant: any, assignment: any, matchScore: number): string {
  const matchedSkills = getMatchedSkills(consultant.skills || [], assignment.requiredSkills || []);
  const personalityHighlights = consultant.personality_traits?.slice(0, 2).join(' och ') || 'professionell och målinriktad';
  const communicationStyle = consultant.communication_style || 'tydlig och effektiv';
  
  return `Hej ${assignment.company}!

Som erfaren ${consultant.roles?.[0] || 'konsult'} med ${consultant.experience_years || 'flera'} års erfarenhet och en ${personalityHighlights} personlighet, är jag mycket intresserad av er ${assignment.title}-position.

Min tekniska expertis inom ${matchedSkills.slice(0, 3).join(', ')} kombinerat med min ${communicationStyle} kommunikationsstil gör mig till en idealisk kandidat. Med en matchning på ${matchScore}% som inkluderar både teknisk kompetens och personlighet, samt ett betyg på ${consultant.rating || 5}/5, är jag redo att leverera exceptionella resultat.

Min arbetsstil (${consultant.work_style || 'samarbetsinriktad och målinriktad'}) passar perfekt för er teamkultur, och mina värderingar kring ${consultant.values?.slice(0, 2).join(' och ') || 'kvalitet och innovation'} alignar väl med era behov.

Jag ser fram emot att bidra till ert teams framgång och hjälpa er uppnå era mål för detta projekt.

Med vänliga hälsningar,
${consultant.name}`;
}
