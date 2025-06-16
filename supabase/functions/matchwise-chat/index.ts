
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, context } = await req.json();

    const systemPrompt = `Du är en AI-assistent för MatchWise, en konsultmatchningsplattform. Du hjälper användare med:

1. Information om MatchWise:
- MatchWise är en plattform som matchar konsulter med uppdrag
- Vi använder AI för att analysera CV:n och LinkedIn-profiler
- Vi hjälper både konsulter att hitta uppdrag och företag att hitta rätt konsulter
- Plattformen är baserad i Sverige och fokuserar på den svenska marknaden
- Vi erbjuder personlig analys av teknisk expertis, ledarskap och kulturell passform

2. CV-tips och förbättringar:
- Ge konkreta, actionable råd för CV-förbättringar
- Fokusera på tekniska färdigheter, projektexempel och kvantifierbara resultat
- Råd om hur man strukturerar sitt CV för konsultarbete
- Tips om hur man framhäver relevant erfarenhet
- Vägledning om vad som är viktigt för svenska arbetsgivare

3. Användarens kontext:
${context ? `Användaren har: ${context}` : 'Ingen specifik kontext tillgänglig'}

Svara på svenska och var hjälpsam, professionell och konkret. Ge alltid praktiska råd som användaren kan implementera direkt.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    const data = await response.json();
    const reply = data.choices[0].message.content;

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in matchwise-chat function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
