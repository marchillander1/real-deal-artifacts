
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
    console.log('🚀 Starting enhanced CV parsing with improved OpenAI integration...');
    
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

    // Enhanced text extraction with improved regex patterns
    let extractedText = '';
    let detectedInfo = {
      emails: [] as string[],
      phones: [] as string[],
      names: [] as string[],
      locations: [] as string[]
    };
    
    try {
      if (file.type === 'application/pdf') {
        console.log('📄 Processing PDF with enhanced extraction algorithms...');
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        
        // Improved PDF text extraction algorithm
        let rawText = '';
        let previousByte = 0;
        
        for (let i = 0; i < uint8Array.length - 1; i++) {
          const byte = uint8Array[i];
          
          // Enhanced character detection
          if (byte >= 32 && byte <= 126) {
            const char = String.fromCharCode(byte);
            
            // Improved character filtering with Swedish characters
            if (char.match(/[a-zA-Z0-9@.\-+()åäöÅÄÖéÉ\s]/)) {
              rawText += char;
            }
          } else if ((byte === 10 || byte === 13) && previousByte !== 10 && previousByte !== 13) {
            // Better line break handling
            if (rawText.slice(-1) !== ' ' && rawText.slice(-1) !== '\n') {
              rawText += ' ';
            }
          }
          
          previousByte = byte;
        }
        
        // Enhanced text cleaning
        extractedText = rawText
          .replace(/\s+/g, ' ')
          .replace(/([a-z])([A-Z])/g, '$1 $2') // Add spaces between camelCase
          .replace(/([0-9])([A-Z])/g, '$1 $2') // Add spaces between numbers and caps
          .trim()
          .substring(0, 5000); // Increased text limit for better analysis
        
        console.log('📝 Enhanced text extraction completed. Sample:', extractedText.substring(0, 300));
        
        // Improved regex patterns for better Swedish/international detection
        const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
        const phoneRegex = /(\+46|0046|0)[0-9\s\-\(\)]{8,15}|[0-9]{2,3}[\s\-]?[0-9]{3}[\s\-]?[0-9]{2,4}[\s\-]?[0-9]{2,4}/g;
        const nameRegex = /\b[A-ZÅÄÖÉ][a-zåäöé]+\s+[A-ZÅÄÖÉ][a-zåäöé]+(?:\s+[A-ZÅÄÖÉ][a-zåäöé]+)*/g;
        const locationRegex = /\b(?:Stockholm|Göteborg|Malmö|Uppsala|Västerås|Örebro|Linköping|Helsingborg|Jönköping|Norrköping|Lund|Umeå|Gävle|Borås|Eskilstuna|Sundsvall|Sverige|Sweden|Denmark|Norge|Norway|Finland|Copenhagen|Oslo|Helsinki|London|Berlin|Amsterdam|Paris)\b/gi;
        
        detectedInfo.emails = Array.from(new Set([...extractedText.matchAll(emailRegex)].map(m => m[0])));
        detectedInfo.phones = Array.from(new Set([...extractedText.matchAll(phoneRegex)].map(m => m[0].replace(/\s/g, ''))));
        detectedInfo.names = Array.from(new Set([...extractedText.matchAll(nameRegex)].map(m => m[0])));
        detectedInfo.locations = Array.from(new Set([...extractedText.matchAll(locationRegex)].map(m => m[0])));
        
        console.log('🔍 Enhanced pattern detection results:', {
          emails: detectedInfo.emails.length,
          phones: detectedInfo.phones.length,
          names: detectedInfo.names.length,
          locations: detectedInfo.locations.length
        });
        
      } else {
        // Handle text files and other formats
        extractedText = await file.text();
        extractedText = extractedText.substring(0, 5000);
        console.log('📄 Text file processed, length:', extractedText.length);
      }
      
    } catch (error) {
      console.warn('⚠️ Text extraction partially failed:', error);
      extractedText = `File processing limited for ${file.name}. Detected type: ${file.type}`;
    }

    console.log('🤖 Sending to OpenAI with enhanced prompt for better analysis...');

    // Enhanced AI prompt with better instructions for Swedish context
    const prompt = `Analysera detta CV MED HÖGSTA NOGGRANNHET. Du MÅSTE extrahera ALL personlig information som finns.

PRIORITERAD DETEKTERAD INFORMATION:
Email: ${detectedInfo.emails.length > 0 ? detectedInfo.emails.join(', ') : 'MÅSTE HITTAS I TEXTEN'}
Telefon: ${detectedInfo.phones.length > 0 ? detectedInfo.phones.join(', ') : 'MÅSTE HITTAS I TEXTEN'}
Namn: ${detectedInfo.names.length > 0 ? detectedInfo.names.join(', ') : 'MÅSTE HITTAS I TEXTEN'}
Plats: ${detectedInfo.locations.length > 0 ? detectedInfo.locations.join(', ') : 'SÖK I TEXTEN'}

CV FULLTEXT:
${extractedText}

KRITISKA INSTRUKTIONER:
1. Använd ALLTID detekterad info om den finns och är giltig
2. Sök AKTIVT efter kontaktuppgifter i hela texten
3. Leta efter mönster: "Tel:", "Email:", "E-post:", "@", telefonnummer
4. Hitta FULLSTÄNDIGA namn (för- och efternamn)
5. Var EXTREMT noggrann med dataextraktion
6. För svenska/nordiska CV:n, leta efter svenska tecken (å, ä, ö)
7. Identifiera års-erfarenhet från arbetserfarenhet

Svara ENDAST med denna exakta JSON-struktur:

{
  "personalInfo": {
    "name": "FULLSTÄNDIGT NAMN",
    "email": "GILTIG EMAIL-ADRESS", 
    "phone": "TELEFONNUMMER",
    "location": "STAD/REGION"
  },
  "experience": {
    "years": "ANTAL ÅR ERFARENHET (endast siffra)",
    "currentRole": "SENASTE JOBBTITEL",
    "level": "Junior/Mid/Senior/Expert"
  },
  "skills": {
    "technical": ["TEKNISKA FÄRDIGHETER"],
    "languages": ["PROGRAMMERINGSSPRÅK"],
    "tools": ["VERKTYG", "SYSTEM", "CERTIFIERINGAR"]
  },
  "workHistory": [
    {
      "company": "FÖRETAG",
      "role": "ROLL",
      "duration": "PERIOD",
      "description": "KORT BESKRIVNING"
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

VIKTIGT: Om information VERKLIGEN inte kan hittas, skriv "Ej specificerat" för den specifika egenskapen.`;

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
            content: 'Du är expertanalytiker för CV och personlig informationsextraktion. Du MÅSTE hitta och extrahera namn, email och telefonnummer med högsta noggrannhet. Svara ALLTID med korrekt JSON utan extra text.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 2000,
      }),
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error('❌ OpenAI API error:', errorText);
      throw new Error(`OpenAI API failed: ${openaiResponse.status}`);
    }

    const openaiData = await openaiResponse.json();
    console.log('✅ Enhanced OpenAI response received');

    let analysis;
    try {
      const content = openaiData.choices[0]?.message?.content;
      console.log('🔍 OpenAI response content preview:', content.substring(0, 200));

      // Enhanced JSON extraction and validation
      const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const jsonMatch = cleanedContent.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
        
        // Enhanced data validation and override with detected data
        if (detectedInfo.emails.length > 0 && detectedInfo.emails[0].includes('@')) {
          analysis.personalInfo.email = detectedInfo.emails[0];
          console.log('✅ Email overridden with detected value:', detectedInfo.emails[0]);
        }
        if (detectedInfo.phones.length > 0 && detectedInfo.phones[0].length > 5) {
          analysis.personalInfo.phone = detectedInfo.phones[0];
          console.log('✅ Phone overridden with detected value:', detectedInfo.phones[0]);
        }
        if (detectedInfo.names.length > 0 && detectedInfo.names[0].split(' ').length >= 2) {
          analysis.personalInfo.name = detectedInfo.names[0];
          console.log('✅ Name overridden with detected value:', detectedInfo.names[0]);
        }
        if (detectedInfo.locations.length > 0) {
          analysis.personalInfo.location = detectedInfo.locations[0];
          console.log('✅ Location overridden with detected value:', detectedInfo.locations[0]);
        }
        
        console.log('📊 Final enhanced analysis result:', {
          name: analysis.personalInfo.name,
          email: analysis.personalInfo.email,
          phone: analysis.personalInfo.phone,
          location: analysis.personalInfo.location,
          skillsCount: (analysis.skills.technical?.length || 0) + (analysis.skills.languages?.length || 0) + (analysis.skills.tools?.length || 0)
        });
        
      } else {
        throw new Error('No valid JSON found in OpenAI response');
      }
    } catch (parseError) {
      console.error('❌ Parse error, using enhanced fallback strategy:', parseError);
      
      // Enhanced fallback with better data structure
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
          locationsFound: detectedInfo.locations.length,
          aiModel: 'gpt-4o-mini-enhanced',
          extractionQuality: 'enhanced'
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
        error: error.message,
        extractionQuality: 'failed'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
