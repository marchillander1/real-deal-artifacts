
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🤖 AI Matching request received');
    
    const { assignment, consultant, scores, type } = await req.json();
    
    const groqApiKey = Deno.env.get('GROQ_API_KEY');
    if (!groqApiKey) {
      console.error('❌ GROQ_API_KEY not found');
      throw new Error('GROQ API key not configured');
    }

    let prompt = '';
    
    if (type === 'match_letter') {
      prompt = `Skriv en professionell matchningsbrev på svenska för följande uppdrag och konsult.

UPPDRAG:
Titel: ${assignment.title}
Företag: ${assignment.company}
Beskrivning: ${assignment.description}
Krav: ${assignment.requiredSkills?.join(', ') || 'Ej specificerat'}
Budget: ${assignment.budget_min}-${assignment.budget_max} SEK
Varaktighet: ${assignment.duration}

KONSULT:
Namn: ${consultant.name}
Erfarenhet: ${consultant.experience}
Färdigheter: ${consultant.skills?.join(', ') || 'Ej specificerat'}
Rating: ${consultant.rating}/5
Projekt: ${consultant.projects} genomförda
Tillgänglighet: ${consultant.availability}

MATCHNINGSRESULTAT:
Teknisk passform: ${scores.technicalFit}%
Kulturell passform: ${scores.culturalFit}%
Total match: ${scores.totalMatchScore}%

Skriv ett professionellt matchningsbrev som:
1. Introducerar konsulten
2. Förklarar varför de är en bra match
3. Lyfter fram relevanta färdigheter och erfarenheter
4. Nämner praktiska detaljer som tillgänglighet
5. Avslutar med en rekommendation

Håll det koncist och professionellt (max 300 ord).`;
    }

    console.log('🚀 Sending request to Groq...');

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
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
            content: 'Du är en expert på konsultmatchning och skriver professionella rekommendationsbrev på svenska. Du är konkret, tydlig och fokuserad på affärsnytta.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.error('❌ GROQ API error:', errorText);
      throw new Error(`GROQ API failed: ${groqResponse.status}`);
    }

    const groqData = await groqResponse.json();
    const matchLetter = groqData.choices[0]?.message?.content;

    console.log('✅ AI matching letter generated successfully');

    return new Response(
      JSON.stringify({ 
        success: true,
        matchLetter: matchLetter
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
        error: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
