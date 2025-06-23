
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
    console.log('🚀 Starting enhanced CV parsing with OpenAI...');
    
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      throw new Error('No file provided');
    }

    console.log('📄 Processing file:', file.name, 'Type:', file.type, 'Size:', file.size);

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      console.error('❌ OPENAI_API_KEY not found');
      throw new Error('OpenAI API key not configured');
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
          .substring(0, 4000); // Increased text limit for OpenAI
        
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
        extractedText = extractedText.substring(0, 4000);
      }
      
    } catch (error) {
      console.warn('⚠️ Text extraction failed:', error);
      extractedText = `Unable to extract text from ${file.name}`;
    }

    console.log('🤖 Sending to OpenAI GPT-4o-mini for enhanced analysis...');

    // Enhanced AI prompt for better personal info extraction
    const prompt = `Analysera detta CV MYCKET NOGGRANT och extrahera ALL personlig information. Du MÅSTE hitta namn, email och telefonnummer.

PRIORITERAD INFORMATION ATT ANVÄNDA:
Email: ${detectedInfo.emails.length > 0 ? detectedInfo.emails.join(', ') : 'MÅSTE HITTAS I TEXTEN'}
Telefon: ${detectedInfo.phones.length > 0 ? detectedInfo.phones.join(', ') : 'MÅSTE HITTAS I TEXTEN'}
Namn: ${detectedInfo.names.length > 0 ? detectedInfo.names.join(', ') : 'MÅSTE HITTAS I TEXTEN'}
Plats: ${detectedInfo.locations.length > 0 ? detectedInfo.locations.join(', ') : 'SÖK I TEXTEN'}

CV FULLTEXT:
${extractedText}

KRITISKA INSTRUKTIONER:
1. Om detekterad info finns - ANVÄND DEN
2. Om den saknas - SÖK AKTIVT efter mönster som "Tel:", "Email:", "E-post:", "@", telefonnummer
3. Leta EXTRA NOGGRANT efter fullständiga namn (för- och efternamn)
4. Kontrollera HELA texten för kontaktuppgifter
5. Var MYCKET mer noggrann än tidigare system

Svara ENDAST med denna JSON-struktur (INGEN annan text):

{
  "personalInfo": {
    "name": "FULLSTÄNDIGT NAMN (för- och efternamn) - MÅSTE HITTAS",
    "email": "GILTIG EMAIL-ADRESS - MÅSTE HITTAS", 
    "phone": "TELEFONNUMMER - MÅSTE HITTAS",
    "location": "STAD/REGION"
  },
  "experience": {
    "years": "ANTAL ÅR ARBETSLIVSERFARENHET (endast siffra)",
    "currentRole": "NUVARANDE/SENASTE JOBBTITEL",
    "level": "Junior/Mid/Senior"
  },
  "skills": {
    "technical": ["TEKNISKA FÄRDIGHETER", "PROGRAMMERINGSSPRÅK"],
    "languages": ["SPRÅK som svenska, engelska"],
    "tools": ["VERKTYG", "SYSTEM", "CERTIFIERINGAR"]
  },
  "workHistory": [
    {
      "company": "FÖRETAG",
      "role": "ROLL",
      "duration": "PERIOD",
      "description": "BESKRIVNING"
    }
  ],
  "education": [
    {
      "institution": "SKOLA/UNIVERSITET",
      "degree": "UTBILDNING",
      "year": "ÅR"
    }
  ]
}

KRITISKT: Om du INTE kan hitta namn, email eller telefon - skriv "HITTAS EJ" så vi vet att något är fel.`;

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Du är expert på CV-analys och personlig informationsextraktion. Du MÅSTE hitta namn, email och telefonnummer. Svara alltid med giltig JSON utan extra text.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 1500,
      }),
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error('❌ OpenAI API error:', errorText);
      throw new Error(`OpenAI API failed: ${openaiResponse.status}`);
    }

    const openaiData = await openaiResponse.json();
    console.log('✅ OpenAI response received');

    let analysis;
    try {
      const content = openaiData.choices[0]?.message?.content;
      console.log('🔍 OpenAI response content:', content);

      // Clean the content to extract JSON
      const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const jsonMatch = cleanedContent.match(/\{[\s\S]*\}/);
      
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
        throw new Error('No JSON found in OpenAI response');
      }
    } catch (parseError) {
      console.error('❌ Parse error, using enhanced fallback:', parseError);
      
      analysis = {
        personalInfo: {
          name: detectedInfo.names[0] || 'HITTAS EJ',
          email: detectedInfo.emails[0] || 'HITTAS EJ',
          phone: detectedInfo.phones[0] || 'HITTAS EJ',
          location: detectedInfo.locations[0] || 'Sverige'
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

    console.log('✅ Enhanced CV analysis completed with OpenAI');

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
          locationsFound: detectedInfo.locations.length,
          aiModel: 'gpt-4o-mini'
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
