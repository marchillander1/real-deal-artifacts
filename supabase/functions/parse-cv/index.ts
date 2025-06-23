
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
    console.log('🚀 Starting enhanced CV parsing...');
    
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      throw new Error('No file provided');
    }

    console.log('📄 Processing file:', file.name, 'Type:', file.type, 'Size:', file.size);

    const groqApiKey = Deno.env.get('GROQ_API_KEY');
    if (!groqApiKey) {
      console.error('❌ GROQ_API_KEY not found');
      throw new Error('GROQ API key not configured');
    }

    // Enhanced text extraction with better regex patterns
    let extractedText = '';
    let detectedInfo = {
      emails: [] as string[],
      phones: [] as string[],
      names: [] as string[],
      locations: [] as string[]
    };
    
    try {
      if (file.type === 'application/pdf') {
        console.log('📄 Processing PDF with enhanced extraction...');
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        
        // Better PDF text extraction
        let rawText = '';
        
        for (let i = 0; i < uint8Array.length - 1; i++) {
          const byte = uint8Array[i];
          
          if (byte >= 32 && byte <= 126) {
            const char = String.fromCharCode(byte);
            
            if (char.match(/[a-zA-Z0-9@.\-+()åäöÅÄÖ\s]/)) {
              rawText += char;
            }
          } else if (byte === 10 || byte === 13) {
            if (rawText.slice(-1) !== ' ') {
              rawText += ' ';
            }
          }
        }
        
        extractedText = rawText
          .replace(/\s+/g, ' ')
          .trim()
          .substring(0, 3000); // Increased text limit
        
        console.log('📝 Enhanced text sample:', extractedText.substring(0, 300));
        
        // Enhanced regex patterns for better detection
        const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
        const phoneRegex = /(\+46|0)[0-9\s\-\(\)]{8,15}|[0-9]{3}[\s\-]?[0-9]{3}[\s\-]?[0-9]{2,4}/g;
        const nameRegex = /\b[A-ZÅÄÖ][a-zåäö]+\s+[A-ZÅÄÖ][a-zåäö]+(?:\s+[A-ZÅÄÖ][a-zåäö]+)*/g;
        const locationRegex = /\b(?:Stockholm|Göteborg|Malmö|Uppsala|Västerås|Örebro|Linköping|Helsingborg|Jönköping|Norrköping|Lund|Umeå|Gävle|Borås|Eskilstuna|Sundsvall|Sverige|Sweden)\b/gi;
        
        detectedInfo.emails = [...extractedText.matchAll(emailRegex)].map(m => m[0]);
        detectedInfo.phones = [...extractedText.matchAll(phoneRegex)].map(m => m[0].replace(/\s/g, ''));
        detectedInfo.names = [...extractedText.matchAll(nameRegex)].map(m => m[0]);
        detectedInfo.locations = [...extractedText.matchAll(locationRegex)].map(m => m[0]);
        
        console.log('🔍 Enhanced detected info:', detectedInfo);
        
      } else {
        extractedText = await file.text();
        extractedText = extractedText.substring(0, 3000);
      }
      
    } catch (error) {
      console.warn('⚠️ Text extraction failed:', error);
      extractedText = `Unable to extract text from ${file.name}`;
    }

    console.log('🤖 Sending to enhanced AI analysis...');

    // Enhanced AI prompt for better personal info extraction
    const prompt = `Analysera detta CV MYCKET NOGGRANT och extrahera ALL personlig information. Fokusera särskilt på att hitta namn, email och telefonnummer.

DETEKTERAD INFORMATION ATT PRIORITERA:
Email: ${detectedInfo.emails.length > 0 ? detectedInfo.emails.join(', ') : 'Ej funnen - SÖK I TEXTEN'}
Telefon: ${detectedInfo.phones.length > 0 ? detectedInfo.phones.join(', ') : 'Ej funnen - SÖK I TEXTEN'}
Namn: ${detectedInfo.names.length > 0 ? detectedInfo.names.join(', ') : 'Ej funnet - SÖK I TEXTEN'}
Plats: ${detectedInfo.locations.length > 0 ? detectedInfo.locations.join(', ') : 'Ej funnen - SÖK I TEXTEN'}

CV FULLTEXT:
${extractedText}

INSTRUKTIONER:
1. ANVÄND DETEKTERAD INFO om den finns och är korrekt
2. Om detekterad info saknas, SÖK AKTIVT i texten efter namn, email, telefon
3. Leta efter mönster som "Tel:", "Email:", "Telefon:", "E-post:", etc.
4. Kontrollera början och slutet av CV:t för kontaktuppgifter
5. Sök efter fullständiga namn (för- och efternamn)

Svara ENDAST med denna exakta JSON-struktur:

{
  "personalInfo": {
    "name": "ANVÄND DETEKTERAT NAMN ELLER HITTA FULLSTÄNDIGT NAMN I TEXTEN (för- och efternamn)",
    "email": "ANVÄND DETEKTERAD EMAIL ELLER HITTA GILTIG EMAIL I TEXTEN", 
    "phone": "ANVÄND DETEKTERAD TELEFON ELLER HITTA TELEFONNUMMER I TEXTEN",
    "location": "ANVÄND DETEKTERAD PLATS ELLER HITTA STAD/REGION I TEXTEN"
  },
  "experience": {
    "years": "BERÄKNA TOTALA ÅR BASERAT PÅ ARBETSLIVSERFARENHET",
    "currentRole": "NUVARANDE ELLER SENASTE JOBBTITEL",
    "level": "Junior/Mid/Senior baserat på erfarenhet"
  },
  "skills": {
    "technical": ["LISTA ALLA TEKNISKA FÄRDIGHETER OCH PROGRAMMERINGSSPRÅK"],
    "languages": ["SPRÅKKUNSKAPER (svenska, engelska, etc)"],
    "tools": ["VERKTYG, SYSTEM, CERTIFIERINGAR"]
  },
  "workHistory": [
    {
      "company": "FÖRETAGSNAMN",
      "role": "JOBBTITEL",
      "duration": "TIDSPERIOD",
      "description": "BESKRIVNING AV ARBETSUPPGIFTER"
    }
  ],
  "education": [
    {
      "institution": "SKOLA/UNIVERSITET",
      "degree": "EXAMEN/UTBILDNING",
      "year": "ÅRTAL"
    }
  ]
}

VIKTIGT: Om information inte kan hittas, skriv "Ej specificerat" - men GÖR ETT SERIÖST FÖRSÖK att hitta personlig information först!`;

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
            content: 'Du är expert på CV-analys och informationsextraktion. Din uppgift är att NOGGRANT extrahera ALL personlig information från CV:n. Prioritera att hitta namn, email och telefonnummer. Returnera alltid giltig JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 1200,
      }),
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.error('❌ GROQ API error:', errorText);
      throw new Error(`GROQ API failed: ${groqResponse.status}`);
    }

    const groqData = await groqResponse.json();
    console.log('✅ Enhanced AI response received');

    let analysis;
    try {
      const content = groqData.choices[0]?.message?.content;
      console.log('🔍 AI response content:', content);

      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
        
        // Force use detected data if available and valid
        if (detectedInfo.emails.length > 0 && detectedInfo.emails[0].includes('@')) {
          analysis.personalInfo.email = detectedInfo.emails[0];
        }
        if (detectedInfo.phones.length > 0) {
          analysis.personalInfo.phone = detectedInfo.phones[0];
        }
        if (detectedInfo.names.length > 0) {
          analysis.personalInfo.name = detectedInfo.names[0];
        }
        if (detectedInfo.locations.length > 0) {
          analysis.personalInfo.location = detectedInfo.locations[0];
        }
        
        console.log('📊 Final enhanced analysis:', analysis.personalInfo);
      } else {
        throw new Error('No JSON found in AI response');
      }
    } catch (parseError) {
      console.error('❌ Parse error, using enhanced fallback:', parseError);
      
      analysis = {
        personalInfo: {
          name: detectedInfo.names[0] || 'Ej specificerat',
          email: detectedInfo.emails[0] || 'Ej specificerat',
          phone: detectedInfo.phones[0] || 'Ej specificerat',
          location: detectedInfo.locations[0] || 'Ej specificerat'
        },
        experience: {
          years: 'Ej specificerat',
          currentRole: 'Ej specificerat',
          level: 'Ej specificerat'
        },
        skills: {
          technical: [],
          languages: [],
          tools: []
        },
        workHistory: [],
        education: []
      };
    }

    console.log('✅ Enhanced CV analysis completed successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        analysis: analysis,
        detectedInformation: detectedInfo,
        extractionStats: {
          textLength: extractedText.length,
          emailsFound: detectedInfo.emails.length,
          phonesFound: detectedInfo.phones.length,
          namesFound: detectedInfo.names.length,
          locationsFound: detectedInfo.locations.length
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('❌ Enhanced CV parsing error:', error);
    
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
