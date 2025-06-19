
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🚀 Starting comprehensive CV parsing...');
    
    // Get the uploaded file from FormData
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      throw new Error('No file provided');
    }

    console.log('📄 Processing file:', file.name, 'Type:', file.type, 'Size:', file.size);

    // Get GROQ API key from environment
    const groqApiKey = Deno.env.get('GROQ_API_KEY');
    if (!groqApiKey) {
      console.error('❌ GROQ_API_KEY not found in environment');
      throw new Error('GROQ API key not configured');
    }

    // 🔥 FÖRBÄTTRAD PDF-TEXTEXTRAKTION
    let fileContent = '';
    let extractedText = '';
    
    try {
      if (file.type === 'application/pdf') {
        console.log('📄 Processing PDF file with improved extraction...');
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        
        // Konvertera till text och sök efter läsbar text
        const decoder = new TextDecoder('utf-8', { ignoreBOM: true });
        let rawText = decoder.decode(uint8Array);
        
        // Extrahera text mellan stream/obj markörer (PDF-innehåll)
        const streamMatches = rawText.match(/stream\s*([\s\S]*?)\s*endstream/g) || [];
        const objMatches = rawText.match(/\d+\s+0\s+obj\s*([\s\S]*?)\s*endobj/g) || [];
        
        // Kombinera alla textavsnitt
        let allTextContent = [...streamMatches, ...objMatches].join(' ');
        
        // Sök efter läsbar text med förbättrade mönster
        const readableTextPatterns = [
          /\b[A-ZÅÄÖ][a-zåäöé]+(?:\s+[A-ZÅÄÖ][a-zåäöé]+)+/g, // Namn
          /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, // E-post
          /[\+]?[\d\s\-\(\)]{8,}/g, // Telefonnummer
          /\b(19|20)\d{2}\b/g, // År
          /\b(JavaScript|TypeScript|Python|Java|React|Angular|Vue|Node|Docker|AWS|Azure|SQL|HTML|CSS|Git|Linux|C\#|PHP|Swift|Kotlin|Ruby|Go|Rust|Scala|MongoDB|PostgreSQL|MySQL|Firebase|Kubernetes|Jenkins|Terraform|Ansible|Scrum|Agile|DevOps|Microservices|REST|GraphQL|Machine Learning|AI|Blockchain|IoT|Cloud|Backend|Frontend|Fullstack|Senior|Junior|Lead|Manager|Developer|Engineer|Consultant|Architect)\b/gi, // Tekniska färdigheter
          /\b(Stockholm|Göteborg|Malmö|Uppsala|Linköping|Örebro|Helsingborg|Jönköping|Norrköping|Lund|Umeå|Gävle|Borås|Eskilstuna|Södertälje|Karlstad|Täby|Sundsvall|Växjö|Halmstad|Sweden|Sverige|Denmark|Norge|Finland)\b/gi, // Platser
          /\b[A-ZÅÄÖ][a-zåäöé\s]{2,30}(?:AB|Ltd|Inc|Corp|AS|Oy|GmbH)\b/g, // Företagsnamn
          /\b(CEO|CTO|CFO|Developer|Engineer|Manager|Director|Lead|Senior|Junior|Consultant|Analyst|Specialist|Coordinator|Administrator|Assistant|Executive|Vice President|VP)\b/gi // Roller
        ];
        
        let extractedParts = [];
        readableTextPatterns.forEach(pattern => {
          const matches = allTextContent.match(pattern) || [];
          extractedParts.push(...matches);
          
          // Sök också i rå-texten
          const rawMatches = rawText.match(pattern) || [];
          extractedParts.push(...rawMatches);
        });
        
        // Ta bort dubbletter och filtrera bort för korta strängar
        extractedText = [...new Set(extractedParts)]
          .filter(text => text && text.length > 2 && !text.match(/^[\d\s\-\(\)]+$/))
          .join(' ');
        
        console.log('📄 Extracted readable content:', extractedText.substring(0, 500));
        
        // Om vi inte hittade tillräckligt med text, försök med enklare textextraktion
        if (extractedText.length < 50) {
          console.log('⚠️ Limited text found, trying alternative extraction...');
          const simpleText = rawText.match(/[A-Za-zÅÄÖåäöé0-9\s\@\.\-\+\(\)]{3,}/g) || [];
          extractedText = simpleText.join(' ');
        }
        
        fileContent = extractedText.substring(0, 10000); // Öka gränsen för mer innehåll
        console.log('📊 Final extracted content length:', fileContent.length);
        
      } else {
        // För andra filtyper, försök läsa som text
        fileContent = await file.text();
        console.log('📄 Read text file content length:', fileContent.length);
      }
    } catch (error) {
      console.warn('⚠️ Could not extract file content:', error);
      fileContent = `CV file: ${file.name} (${file.type}) - Text extraction failed, using filename analysis`;
    }

    // 🔥 FÖRBÄTTRAD AI-PROMPT MED EXEMPEL
    const prompt = `Du är en expert CV-analytiker som extraherar verklig, korrekt information från CV-innehåll. Din uppgift är att noggrant läsa CV-innehållet och extrahera ENDAST information som faktiskt finns där.

CV-FIL: ${file.name}
INNEHÅLL ATT ANALYSERA:
${fileContent}

KRITISKA INSTRUKTIONER:
1. Extrahera ENDAST verklig information som du tydligt kan se i CV-innehållet
2. Leta efter faktiska personuppgifter, arbetslivserfarenhet och färdigheter som nämns
3. Om information inte är tydligt synlig, använd "Not specified"
4. Extrahera år av erfarenhet genom att titta på arbetsdatum
5. Identifiera specifika teknologier, programmeringsspråk och ramverk som nämns
6. Leta efter utbildning, certifieringar och prestationer

EXEMPEL PÅ KORREKT EXTRAKTION:
- Om du ser "John Andersson", extrahera "John Andersson" (inte "Not specified")
- Om du ser "john@example.com", extrahera "john@example.com"
- Om du ser "React, JavaScript, Node.js", lägg till dessa i teknisk expertis
- Om du ser "2019-2023 Senior Developer", beräkna 4 års erfarenhet

Svara med detta EXAKTA JSON-format (ingen ytterligare text):

{
  "personalInfo": {
    "name": "Extrahera verkligt fullständigt namn från CV eller 'Not specified'",
    "email": "Extrahera verklig e-postadress från CV eller 'Not specified'", 
    "phone": "Extrahera verkligt telefonnummer från CV eller 'Not specified'",
    "location": "Extrahera verklig stad/plats från CV eller 'Not specified'",
    "linkedinProfile": "Extrahera LinkedIn-URL om den finns eller 'Not specified'"
  },
  "professionalSummary": {
    "yearsOfExperience": "Beräkna från verkliga arbetsdatum eller 'Not specified'",
    "currentRole": "Extrahera senaste jobbtitel eller 'Not specified'",
    "seniorityLevel": "Junior/Mid-level/Senior/Expert baserat på verklig erfarenhet eller 'Not specified'",
    "careerTrajectory": "Växande/Stabil/Senior baserat på karriärutveckling eller 'Not specified'",
    "industryFocus": "Extrahera primär bransch från arbetserfarenhet eller 'Not specified'",
    "specializations": ["Lista verkliga specialiseringsområden som nämns eller tom array"]
  },
  "technicalExpertise": {
    "programmingLanguages": {
      "expert": ["Språk med 5+ år eller markerade som expert"],
      "proficient": ["Språk med 2-4 år eller markerade som skickliga"], 
      "familiar": ["Språk med <2 år eller markerade som grundläggande"]
    },
    "frameworks": ["Extrahera alla ramverk som faktiskt nämns"],
    "tools": ["Extrahera alla verktyg och mjukvara som faktiskt nämns"],
    "databases": ["Extrahera databasteknologier som nämns"],
    "cloudPlatforms": ["Extrahera molnplattformar som nämns"],
    "methodologies": ["Extrahera metoder som Agile, Scrum som nämns"]
  },
  "workExperience": [
    {
      "company": "Extrahera verkligt företagsnamn",
      "role": "Extrahera verklig jobbtitel", 
      "duration": "Extrahera verklig tidsperiod",
      "technologies": ["Teknologier som använts i denna roll"],
      "achievements": ["Specifika prestationer som nämns"]
    }
  ],
  "education": {
    "degrees": ["Extrahera utbildningskvalifikationer med institutioner"],
    "certifications": ["Extrahera professionella certifieringar som nämns"]
  },
  "marketPositioning": {
    "hourlyRateEstimate": {
      "min": 800,
      "max": 1200,
      "recommended": 1000,
      "currency": "SEK",
      "explanation": "Baserat på erfarenhet och färdigheter på svenska marknaden"
    }
  },
  "languages": ["Extrahera talade språk med kunskapsnivåer"]
}

EXTRAHERA ENDAST VERKLIG INFORMATION FRÅN CV-INNEHÅLLET. Använd "Not specified" för saknad data.
SVARA MED ENDAST JSON-OBJEKTET - INGEN YTTERLIGARE TEXT ELLER FÖRKLARINGAR.`;

    console.log('🤖 Sending enhanced CV content to GROQ for detailed analysis');

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
            content: 'Du är en expert CV-analytiker som extraherar verklig, korrekt information från CV-innehåll. Du extraherar endast information som tydligt finns i CV-innehållet och använder "Not specified" för saknad information.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 4000,
      }),
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.error('❌ GROQ API error:', errorText);
      throw new Error(`GROQ API request failed: ${groqResponse.status}`);
    }

    const groqData = await groqResponse.json();
    console.log('✅ GROQ enhanced analysis response received');

    let analysis;
    try {
      const content = groqData.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content in GROQ response');
      }

      // Extrahera JSON från svar mer tillförlitligt
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
        console.log('📊 Successfully parsed enhanced CV analysis');
        console.log('📋 Extracted enhanced data:', {
          personalInfo: analysis.personalInfo,
          hasRealName: analysis.personalInfo?.name !== 'Not specified',
          hasRealEmail: analysis.personalInfo?.email !== 'Not specified',
          technicalSkillsCount: (analysis.technicalExpertise?.programmingLanguages?.expert?.length || 0) + 
                               (analysis.technicalExpertise?.programmingLanguages?.proficient?.length || 0),
          workExperienceCount: analysis.workExperience?.length || 0
        });
      } else {
        throw new Error('No valid JSON found in response');
      }
    } catch (parseError) {
      console.error('❌ Failed to parse GROQ response:', parseError);
      console.log('Raw GROQ response:', groqData.choices[0]?.message?.content);
      
      // Fallback med mer realistisk exempeldata
      analysis = {
        personalInfo: {
          name: 'Not specified',
          email: 'Not specified', 
          phone: 'Not specified',
          location: 'Not specified',
          linkedinProfile: 'Not specified'
        },
        professionalSummary: {
          yearsOfExperience: 'Not specified',
          currentRole: 'Not specified',
          seniorityLevel: 'Not specified',
          careerTrajectory: 'Not specified',
          industryFocus: 'Not specified',
          specializations: []
        },
        technicalExpertise: {
          programmingLanguages: { expert: [], proficient: [], familiar: [] },
          frameworks: [],
          tools: [],
          databases: [],
          cloudPlatforms: [],
          methodologies: []
        },
        workExperience: [],
        education: { degrees: [], certifications: [] },
        marketPositioning: {
          hourlyRateEstimate: {
            min: 700,
            max: 1100,
            recommended: 900,
            currency: 'SEK',
            explanation: 'Baserat på svenska konsultmarknaden.'
          }
        },
        languages: []
      };
    }

    // Skapa förbättrade analysresultat
    const enhancedAnalysisResults = {
      cvAnalysis: analysis,
      linkedinAnalysis: null
    };

    console.log('✅ Enhanced CV analysis completed with comprehensive data');

    return new Response(
      JSON.stringify({ 
        success: true, 
        analysis: analysis,
        enhancedAnalysisResults
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('❌ CV parsing error:', error);
    
    // Returnera förbättrad fallback för fel
    const fallbackAnalysis = {
      personalInfo: {
        name: 'Not specified',
        email: 'Not specified',
        phone: 'Not specified', 
        location: 'Not specified',
        linkedinProfile: 'Not specified'
      },
      professionalSummary: {
        yearsOfExperience: 'Not specified',
        currentRole: 'Not specified',
        seniorityLevel: 'Not specified',
        careerTrajectory: 'Not specified',
        industryFocus: 'Not specified',
        specializations: []
      },
      technicalExpertise: {
        programmingLanguages: { expert: [], proficient: [], familiar: [] },
        frameworks: [],
        tools: [],
        databases: [],
        cloudPlatforms: [],
        methodologies: []
      },
      workExperience: [],
      education: { degrees: [], certifications: [] },
      marketPositioning: {
        hourlyRateEstimate: {
          min: 700,
          max: 1100,
          recommended: 900,
          currency: 'SEK',
          explanation: 'Baserat på svenska konsultmarknaden.'
        }
      },
      languages: ['Swedish', 'English']
    };

    const fallbackEnhancedResults = {
      cvAnalysis: fallbackAnalysis,
      linkedinAnalysis: null
    };

    return new Response(
      JSON.stringify({ 
        success: true, 
        analysis: fallbackAnalysis,
        enhancedAnalysisResults: fallbackEnhancedResults,
        fallback: true,
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
