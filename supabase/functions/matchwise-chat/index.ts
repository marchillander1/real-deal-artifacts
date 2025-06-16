
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, context } = await req.json();

    console.log('Received message:', message);
    console.log('Context:', context);

    if (!GROQ_API_KEY) {
      // Fallback to simple responses if no AI available
      return new Response(JSON.stringify({ 
        reply: getSimpleFallbackResponse(message)
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Use AI for intelligent responses
    const systemPrompt = `Du är MatchWise AI-assistent, en expert på konsultverksamhet och karriärutveckling inom tech-branschen i Sverige. Du hjälper konsulter med:

1. **Karriärutveckling:** Teknisk progression, specialisering, certifieringar
2. **Prissättning:** Timarvodering, förhandling, marknadsjämförelser  
3. **CV & LinkedIn:** Optimering, nyckelord, personal branding
4. **Kundrelationer:** Affärsutveckling, nätverk, långsiktiga relationer
5. **MatchWise-plattformen:** Hur matchning fungerar, profil-optimering

Svara alltid på svenska. Var konkret, praktisk och ge actionable råd. Om användaren frågar om något utanför dina expertområden, hänvisa tillbaka till vad du kan hjälpa med.

Kontextinformation om användaren: ${context || 'Ingen specifik kontext tillgänglig'}`;

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
            content: systemPrompt
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
        top_p: 0.9
      })
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.error('Groq API error:', groqResponse.status, errorText);
      
      // Fallback to simple response
      return new Response(JSON.stringify({ 
        reply: getSimpleFallbackResponse(message)
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const groqData = await groqResponse.json();
    const aiReply = groqData.choices[0].message.content;

    return new Response(JSON.stringify({ reply: aiReply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in matchwise-chat function:', error);
    
    // Fallback response
    return new Response(JSON.stringify({ 
      reply: 'Ursäkta, jag kan inte svara just nu. Försök igen om ett ögonblick.'
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function getSimpleFallbackResponse(message: string): string {
  const messageLC = message.toLowerCase();
  
  if (messageLC.includes('matchwise') || messageLC.includes('plattform') || messageLC.includes('vad är')) {
    return `# MatchWise - AI-driven Konsultmatchning 🚀

MatchWise är en plattform som använder AI för att matcha konsulter med rätt uppdrag. Vi analyserar din CV och LinkedIn-profil för att:

✅ **Hitta perfekta uppdrag** som matchar din expertis
✅ **Optimera din profil** för bättre synlighet  
✅ **Ge marknadsinformation** om priser och efterfrågan
✅ **Matcha företagskultur** för bättre samarbeten

Vad vill du veta mer om?`;
  }
  
  if (messageLC.includes('cv') || messageLC.includes('linkedin') || messageLC.includes('profil')) {
    return `# CV & LinkedIn Optimering 📊

Här är mina bästa tips:

## CV-optimering
✅ **Använd STAR-metoden** för projektbeskrivningar
✅ **Kvantifiera resultat** - "Ökade prestanda med 40%"
✅ **Inkludera rätt nyckelord** för din teknikstack
✅ **Håll det relevant** - fokusera på senaste 5-8 åren

## LinkedIn-strategi  
✅ **Optimera rubriken** med nyckelord och värdeproposition
✅ **Skriv engagerande innehåll** 2-3 gånger per vecka
✅ **Nätverka strategiskt** med CTOs och techchefer
✅ **Dela framgångshistorier** från dina projekt

Vill du ha mer specifika tips för din situation?`;
  }
  
  if (messageLC.includes('pris') || messageLC.includes('arvode') || messageLC.includes('förhandl')) {
    return `# Prissättning & Förhandling 💰

## Grundläggande prissättning (Stockholm 2024)
- **Junior (0-2 år):** 650-850 SEK/timme
- **Mid-level (3-5 år):** 850-1,200 SEK/timme  
- **Senior (5-8 år):** 1,200-1,600 SEK/timme
- **Expert/Lead (8+ år):** 1,600-2,200 SEK/timme

## Förhandlingstips
✅ **Börja med värde** - berätta vad du kan leverera
✅ **Kvantifiera påverkan** - "Sparade företaget 500k/månad"
✅ **Ha alternativ** - förhandla aldrig från desperation
✅ **Årliga justeringar** - 8-15% för inflation + kompetensökning

Vilken specifik situation vill du diskutera?`;
  }
  
  if (messageLC.includes('karriär') || messageLC.includes('utveckling') || messageLC.includes('senior')) {
    return `# Karriärutveckling för Konsulter 🚀

## Teknisk karriärväg
**Developer → Senior Developer (3-5 år)**
- Fördjupa dig i 2-3 språk
- Lär dig arkitektur och designmönster
- +40-60% arvodeökning

**Senior → Tech Lead (5-8 år)**  
- Utveckla ledarskapsförmågor
- Mentorskap och kodgranskning
- +50-80% arvodeökning

**Tech Lead → Arkitekt (8-12 år)**
- Systemdesign och affärsförståelse  
- Enterprise-arkitektur
- +60-100% arvodeökning

## Högvärderade teknologier 2024
- **AI/ML:** +30-50% premium
- **Cloud Native:** +25-40% premium
- **Data Engineering:** +30-45% premium

Vilken del av din karriär vill du utveckla?`;
  }
  
  return `# Hej! Jag är MatchWise AI-assistent 🤖

Jag hjälper dig med:

💼 **Karriärutveckling** - Teknisk progression och specialisering
💰 **Prissättning** - Arvoden, förhandling, marknadspriser  
📊 **Profil-optimering** - CV och LinkedIn förbättring
🤝 **Kundrelationer** - Affärsutveckling och nätverk
🚀 **MatchWise** - Hur plattformen fungerar

Vad kan jag hjälpa dig med idag?`;
}
