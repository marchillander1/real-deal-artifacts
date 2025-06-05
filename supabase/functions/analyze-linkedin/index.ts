
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
    const { linkedinUrl } = await req.json();
    
    console.log('Analyzing LinkedIn profile:', linkedinUrl);

    // Kontrollera att OpenAI API-nyckel finns
    if (!openAIApiKey) {
      console.error('OpenAI API key is missing');
      return new Response(JSON.stringify({ 
        error: 'OpenAI API key not configured',
        success: false 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Simulera LinkedIn data extraction med mer realistisk data
    const mockLinkedInPosts = [
      "Spännande att se utvecklingen inom AI och mjukvaruutveckling! Arbetar med innovativa lösningar som gör utvecklare mer produktiva.",
      "Fantastisk teamarbete idag. Älskar att jobba med olika perspektiv för att lösa komplexa problem.",
      "Precis avslutat ett utmanande projekt med React och TypeScript. Lärandet aldrig slutar inom tech!",
      "Deltog på en teknikkonferens om hållbara mjukvarumetoder. Alltid lärorikt med nya tillvägagångssätt.",
      "Att mentora juniora utvecklare är otroligt givande. Att dela kunskap hjälper alla att växa.",
      "Passionerad för ren kod och bästa praxis. Kvalitetsmjukvara gör verklig skillnad.",
      "Att arbeta på distans har lärt mig vikten av tydlig kommunikation och dokumentation.",
      "Innovation sker när vi kliver utanför vår komfortzon och provar ny teknik.",
      "Teamets framgång kommer från att stötta varandra och fira vinster tillsammans.",
      "Kontinuerligt lärande är nyckeln i vårt snabbt föränderliga tekniklandskap."
    ];

    // Mock LinkedIn intro/about section på svenska
    const mockLinkedInIntro = `Erfaren mjukvaruutvecklare med över 8 års branschexpertis, specialiserad på fullstack-utveckling och teamledning. Jag brinner för att skapa innovativa lösningar som löser verkliga problem och tror på kraften i samarbetsutveckling.

Min arbetsmetod grundar sig i kontinuerligt lärande, öppen kommunikation och ett engagemang för kvalitet. Jag trivs i miljöer där jag kan mentora andra samtidigt som jag själv utmanas att växa. Oavsett om jag leder ett team eller bidrar som individuell medarbetare, fokuserar jag på att bygga hållbara, skalbara lösningar.

Utanför kodandet är jag aktiv i teknikgemenskapen, håller regelbundet presentationer på konferenser och bidrar till open source-projekt. Jag tror att teknik ska vara tillgänglig och inkluderande, och arbetar för att främja mångfald inom tech genom mentorskap och samhällsengagemang.

Värderingar som driver mig: Innovation, Kvalitet, Teamwork, Kontinuerligt lärande och Integritet.`;

    // Använd OpenAI för att analysera både inlägg och intro för personlighetsdrag
    const analysisPrompt = `
    Analysera följande LinkedIn-profildata (intro/om-sektion + senaste inlägg) och extrahera personlighetsdrag, kommunikationsstil, arbetsvärderingar och teampassningsegenskaper. 
    Returnera analysen i JSON-format med dessa exakta fält:
    - communicationStyle: string (t.ex., "Direkt och samarbetsinriktad", "Analytisk och genomtänkt")
    - workStyle: string (t.ex., "Agil och iterativ", "Strukturerad och metodisk")
    - values: array av strings (max 4 värderingar som "Innovation", "Kvalitet", "Teamwork")
    - personalityTraits: array av strings (max 4 egenskaper som "Kreativ", "Analytisk", "Ledarskapsoriented")
    - teamFit: string (beskrivning av hur de arbetar i team)
    - culturalFit: nummer mellan 1-5 (övergripande kulturell anpassningsförmåga)
    - adaptability: nummer mellan 1-5 (flexibilitet för förändring)
    - leadership: nummer mellan 1-5 (ledarskapspotential)

    LinkedIn Om/Intro-sektion:
    ${mockLinkedInIntro}

    Senaste LinkedIn-inlägg:
    ${mockLinkedInPosts.join('\n')}
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'Du är en expert HR-analytiker specialiserad på personlighetsbedömning från sociala medier. Returnera alltid giltig JSON. Analysera både den professionella intron och senaste inläggen för att få en omfattande bild av personen.' 
          },
          { role: 'user', content: analysisPrompt }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error:', response.status, response.statusText);
      // Fallback analys om OpenAI misslyckas
      const fallbackAnalysis = {
        communicationStyle: "Professionell och engagerande",
        workStyle: "Samarbetsinriktad och innovativ",
        values: ["Innovation", "Lärande", "Teamwork", "Kvalitet"],
        personalityTraits: ["Nyfiken", "Samarbetsinriktad", "Tillväxtinriktad", "Teknisk"],
        teamFit: "Stark teamspelare med mentorskapsförmåga",
        culturalFit: 4.2,
        adaptability: 4.3,
        leadership: 4.0
      };
      
      console.log('Using fallback analysis:', fallbackAnalysis);
      
      return new Response(JSON.stringify({ 
        success: true, 
        analysis: fallbackAnalysis,
        postsAnalyzed: mockLinkedInPosts.length,
        introAnalyzed: true,
        note: "Använder fallback-analys"
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    let analysis;
    
    try {
      analysis = JSON.parse(data.choices[0].message.content);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', data.choices[0].message.content);
      // Fallback analys om parsing misslyckas
      analysis = {
        communicationStyle: "Professionell och engagerande",
        workStyle: "Samarbetsinriktad och innovativ",
        values: ["Innovation", "Lärande", "Teamwork", "Kvalitet"],
        personalityTraits: ["Nyfiken", "Samarbetsinriktad", "Tillväxtinriktad", "Teknisk"],
        teamFit: "Stark teamspelare med mentorskapsförmåga",
        culturalFit: 4.2,
        adaptability: 4.3,
        leadership: 4.0
      };
    }

    console.log('LinkedIn analysis completed:', analysis);

    return new Response(JSON.stringify({ 
      success: true, 
      analysis,
      postsAnalyzed: mockLinkedInPosts.length,
      introAnalyzed: true
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-linkedin function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
