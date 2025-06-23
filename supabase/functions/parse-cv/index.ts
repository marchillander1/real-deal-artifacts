
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
    console.log('🚀 Starting IMPROVED CV parsing with better text extraction...');
    
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const personalDescription = formData.get('personalDescription') as string || '';
    
    if (!file) {
      throw new Error('No file provided');
    }

    console.log('📄 Processing file:', file.name, 'Type:', file.type, 'Size:', file.size);
    console.log('📝 Personal description provided:', !!personalDescription, 'Length:', personalDescription.length);

    const groqApiKey = Deno.env.get('GROQ_API_KEY');
    if (!groqApiKey) {
      console.error('❌ GROQ_API_KEY not found');
      throw new Error('Groq API key not configured');
    }

    // IMPROVED text extraction focusing on readable content
    let extractedText = '';
    let detectedInfo = {
      emails: [] as string[],
      phones: [] as string[],
      names: [] as string[],
      locations: [] as string[],
      companies: [] as string[],
      skills: [] as string[]
    };
    
    try {
      if (file.type === 'application/pdf') {
        console.log('📄 Processing PDF with IMPROVED text extraction...');
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        
        // IMPROVED PDF text extraction - focus on actual text content
        let rawText = '';
        let currentWord = '';
        let inTextMode = false;
        
        for (let i = 0; i < uint8Array.length - 10; i++) {
          const byte = uint8Array[i];
          
          // Look for text stream markers
          if (i < uint8Array.length - 6) {
            const next6 = Array.from(uint8Array.slice(i, i + 6));
            const streamMarker = String.fromCharCode(...next6);
            if (streamMarker.includes('stream') || streamMarker.includes('BT')) {
              inTextMode = true;
              continue;
            }
            if (streamMarker.includes('endstream') || streamMarker.includes('ET')) {
              inTextMode = false;
              continue;
            }
          }
          
          // Only process readable characters in text mode
          if (inTextMode && byte >= 32 && byte <= 126) {
            const char = String.fromCharCode(byte);
            
            // Focus on letters, numbers, and common symbols
            if (char.match(/[a-zA-Z0-9@.\-+()åäöÅÄÖéÉèÈàÀüÜ\s]/)) {
              currentWord += char;
            } else if (currentWord.length > 0) {
              // Add word if it's meaningful (not PDF metadata)
              if (currentWord.length > 1 && 
                  !currentWord.match(/^(obj|endobj|Type|Subtype|Width|Height|Filter|Length|stream|endstream)$/i)) {
                rawText += currentWord + ' ';
              }
              currentWord = '';
            }
          }
          
          // Handle line breaks
          if (byte === 10 || byte === 13) {
            if (currentWord.length > 0) {
              if (!currentWord.match(/^(obj|endobj|Type|Subtype|Width|Height|Filter|Length|stream|endstream)$/i)) {
                rawText += currentWord + ' ';
              }
              currentWord = '';
            }
            rawText += '\n';
          }
        }
        
        // Clean and normalize the extracted text
        extractedText = rawText
          .replace(/\s+/g, ' ')                    // Normalize whitespace
          .replace(/([a-z])([A-Z])/g, '$1 $2')     // Add spaces between camelCase
          .replace(/([0-9])([A-Z])/g, '$1 $2')     // Add spaces between numbers and caps
          .replace(/\b(obj|endobj|Type|Subtype|Width|Height|Filter|Length|stream|endstream|PDF)\b/gi, '') // Remove PDF keywords
          .replace(/[^\w\s@.\-+åäöÅÄÖéÉèÈàÀüÜ]/g, ' ') // Keep only meaningful characters
          .replace(/\s+/g, ' ')                    // Final whitespace cleanup
          .trim()
          .substring(0, 12000); // Reasonable text limit
        
        console.log('📝 IMPROVED text extraction completed. Length:', extractedText.length);
        console.log('📝 Sample extracted text:', extractedText.substring(0, 300));
        
        // IMPROVED regex patterns for better detection
        const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
        const phoneRegex = /(?:\+46[\s\-]?|0046[\s\-]?|0)[\s\-]?[1-9][0-9\s\-]{7,11}[0-9]/g;
        const nameRegex = /\b[A-ZÅÄÖÉ][a-zåäöé]{2,}\s+[A-ZÅÄÖÉ][a-zåäöé]{2,}(?:\s+[A-ZÅÄÖÉ][a-zåäöé]{2,})?\b/g;
        const locationRegex = /\b(?:Stockholm|Göteborg|Malmö|Uppsala|Västerås|Örebro|Linköping|Helsingborg|Jönköping|Norrköping|Lund|Umeå|Gävle|Borås|Eskilstuna|Sundsvall|Sverige|Sweden|Copenhagen|Oslo|Helsinki|London|Berlin|Amsterdam|Paris|Madrid|Rome|Brussels|Zurich|Vienna)\b/gi;
        const skillRegex = /\b(?:JavaScript|Java|Python|C#|C\+\+|PHP|Ruby|Go|Rust|TypeScript|React|Angular|Vue|Node\.js|Express|Django|Flask|Spring|Laravel|MySQL|PostgreSQL|MongoDB|Redis|Docker|Kubernetes|AWS|Azure|GCP|Git|Jenkins|CI\/CD|Agile|Scrum|DevOps|Machine Learning|AI|Data Science|Frontend|Backend|Fullstack|API|REST|GraphQL|Microservices|Cloud|Security|Testing|TDD|BDD|HTML|CSS|SASS|LESS|Bootstrap|Tailwind|jQuery|Redux|Next\.js|Nuxt\.js|Svelte|Flutter|React Native|Ionic|Xamarin|Unity|Unreal Engine|Blender|Photoshop|Illustrator|Figma|Sketch|InVision|Zeplin|Adobe XD)\b/gi;
        
        detectedInfo.emails = Array.from(new Set([...extractedText.matchAll(emailRegex)].map(m => m[0].toLowerCase())));
        detectedInfo.phones = Array.from(new Set([...extractedText.matchAll(phoneRegex)].map(m => m[0].replace(/[\s\-]/g, ''))));
        detectedInfo.names = Array.from(new Set([...extractedText.matchAll(nameRegex)].map(m => m[0])));
        detectedInfo.locations = Array.from(new Set([...extractedText.matchAll(locationRegex)].map(m => m[0])));
        detectedInfo.skills = Array.from(new Set([...extractedText.matchAll(skillRegex)].map(m => m[0])));
        
        console.log('🔍 IMPROVED pattern detection results:', {
          emails: detectedInfo.emails.length,
          phones: detectedInfo.phones.length,
          names: detectedInfo.names.length,
          locations: detectedInfo.locations.length,
          skills: detectedInfo.skills.length
        });
        
        // Log samples for debugging
        if (detectedInfo.names.length > 0) {
          console.log('👤 Detected names:', detectedInfo.names.slice(0, 3));
        }
        if (detectedInfo.emails.length > 0) {
          console.log('📧 Detected emails:', detectedInfo.emails.slice(0, 2));
        }
        
      } else {
        // Handle text files
        extractedText = await file.text();
        extractedText = extractedText.substring(0, 12000);
        console.log('📄 Text file processed, length:', extractedText.length);
      }
      
    } catch (error) {
      console.warn('⚠️ Text extraction partially failed:', error);
      extractedText = `Limited text extraction for ${file.name}. File type: ${file.type}`;
    }

    console.log('🤖 Sending to Groq with IMPROVED analysis prompt...');

    // IMPROVED AI prompt with better instructions
    const personalDescriptionSection = personalDescription.trim() ? 
      `\n\nPERSONLIG BESKRIVNING FRÅN ANVÄNDAREN:
"${personalDescription.trim()}"

Använd denna personliga beskrivning för att förbättra mjukvärdesanalysen.` : '';

    const prompt = `Du är en CV-analysexpert. Analysera detta CV EXTREMT NOGGRANT och extrahera ENDAST riktig information från texten.

VIKTIGA REGLER:
1. Använd ENDAST information som FAKTISKT finns i CV-texten
2. Ignorera PDF-metadata som "Object", "Subtype", "Width", "Height", etc.
3. Hitta rätt namn, email, telefon från CV:t - inte från PDF-struktur
4. Om information inte finns explicit, skriv "Ej angiven"
5. Fokusera på RIKTIG CV-information, inte teknisk PDF-data

DETEKTERAD INFORMATION (validera mot CV-text):
Email: ${detectedInfo.emails.length > 0 ? detectedInfo.emails.join(', ') : 'Söks i CV-text'}
Telefon: ${detectedInfo.phones.length > 0 ? detectedInfo.phones.join(', ') : 'Söks i CV-text'}
Namn: ${detectedInfo.names.length > 0 ? detectedInfo.names.join(', ') : 'Söks i CV-text'}
Plats: ${detectedInfo.locations.length > 0 ? detectedInfo.locations.join(', ') : 'Söks i CV-text'}
Tekniska färdigheter: ${detectedInfo.skills.length > 0 ? detectedInfo.skills.join(', ') : 'Söks i CV-text'}${personalDescriptionSection}

CV-TEXT FÖR ANALYS:
${extractedText}

Analysera detta CV och svara med ENDAST denna JSON-struktur:

{
  "personalInfo": {
    "name": "RIKTIGT NAMN från CV (inte PDF-metadata)",
    "email": "RIKTIG EMAIL från CV",
    "phone": "RIKTIG TELEFON från CV",
    "location": "RIKTIG PLATS från CV"
  },
  "experience": {
    "years": "Antal år erfarenhet baserat på CV",
    "currentRole": "Nuvarande eller senaste roll",
    "level": "Junior/Mid/Senior/Expert baserat på erfarenhet"
  },
  "skills": {
    "technical": ["ENDAST riktiga tekniska färdigheter från CV"],
    "languages": ["Programmeringsspråk från CV"],
    "tools": ["Verktyg och teknologier från CV"]
  },
  "workHistory": [
    {
      "company": "Företagsnamn från CV",
      "role": "Rollens titel från CV",
      "duration": "Tidsperiod från CV",
      "description": "Kort beskrivning av rollen"
    }
  ],
  "education": [
    {
      "institution": "Utbildningsinstitution från CV",
      "degree": "Examen/Utbildning från CV",
      "year": "År från CV"
    }
  ],
  "softSkills": {
    "communicationStyle": "Analys baserat på CV-språk och personlig beskrivning",
    "leadershipStyle": "Ledarskapsstil baserat på erfarenhet",
    "values": ["Värderingar från CV och personlig beskrivning"],
    "personalityTraits": ["Personlighetsdrag från CV och beskrivning"],
    "workStyle": "Arbetsstil baserat på CV och personlig beskrivning"
  },
  "scores": {
    "leadership": 3,
    "innovation": 3,
    "adaptability": 4,
    "culturalFit": 4,
    "communication": 4,
    "teamwork": 4
  },
  "analysisInsights": {
    "strengths": ["Styrkor från CV"],
    "developmentAreas": ["Utvecklingsområden"],
    "careerTrajectory": "Karriärutveckling",
    "consultingReadiness": "Konsultberedskap"
  },
  "marketAnalysis": {
    "hourlyRate": {
      "current": 900,
      "optimized": 1100,
      "explanation": "Motivering baserat på färdigheter och erfarenhet"
    },
    "competitiveAdvantages": ["Konkurrensfördelar"],
    "marketDemand": "Marknadsbedömning",
    "recommendedFocus": "Utvecklingsrekommendationer"
  }
}

VIKTIGT: Använd ENDAST riktig CV-information. Ignorera PDF-metadata helt!`;

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: 'Du är en expertanalytiker för CV som IGNORERAR PDF-metadata och fokuserar på RIKTIG CV-information. Svara ALLTID med korrekt JSON utan extra text.'
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
      console.error('❌ Groq API error:', errorText);
      throw new Error(`Groq API failed: ${groqResponse.status}`);
    }

    const groqData = await groqResponse.json();
    console.log('✅ IMPROVED Groq response received');

    let analysis;
    try {
      const content = groqData.choices[0]?.message?.content;
      console.log('🔍 Groq response preview:', content.substring(0, 300));

      const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const jsonMatch = cleanedContent.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
        
        // Use detected information ONLY if it's valid and not PDF metadata
        if (detectedInfo.emails.length > 0 && detectedInfo.emails[0].includes('@')) {
          analysis.personalInfo.email = detectedInfo.emails[0];
          console.log('✅ Valid email detected:', detectedInfo.emails[0]);
        }
        if (detectedInfo.phones.length > 0 && detectedInfo.phones[0].length >= 8) {
          analysis.personalInfo.phone = detectedInfo.phones[0];
          console.log('✅ Valid phone detected:', detectedInfo.phones[0]);
        }
        // Only use names that look like real names (not PDF metadata)
        if (detectedInfo.names.length > 0) {
          const validNames = detectedInfo.names.filter(name => 
            !name.match(/^(Object|Subtype|Image|Width|Height|Filter|Type|PDF)/i) &&
            name.split(' ').length >= 2 &&
            name.length < 50
          );
          if (validNames.length > 0) {
            analysis.personalInfo.name = validNames[0];
            console.log('✅ Valid name detected:', validNames[0]);
          }
        }
        if (detectedInfo.locations.length > 0) {
          analysis.personalInfo.location = detectedInfo.locations[0];
          console.log('✅ Valid location detected:', detectedInfo.locations[0]);
        }
        if (detectedInfo.skills.length > 0) {
          analysis.skills.technical = [...new Set([...analysis.skills.technical, ...detectedInfo.skills])];
          console.log('✅ Technical skills enhanced');
        }
        
      } else {
        throw new Error('No valid JSON found in response');
      }
    } catch (parseError) {
      console.error('❌ Parse error, using fallback:', parseError);
      
      // Improved fallback with detected valid information
      analysis = {
        personalInfo: {
          name: detectedInfo.names.find(name => 
            !name.match(/^(Object|Subtype|Image|Width|Height|Filter|Type|PDF)/i) &&
            name.split(' ').length >= 2
          ) || 'Ej angivet i CV',
          email: detectedInfo.emails[0] || 'Ej angivet i CV',
          phone: detectedInfo.phones[0] || 'Ej angivet i CV',
          location: detectedInfo.locations[0] || 'Ej angivet i CV'
        },
        experience: {
          years: 'Ej angivet i CV',
          currentRole: 'Ej angivet i CV',
          level: 'Mid'
        },
        skills: {
          technical: detectedInfo.skills || [],
          languages: [],
          tools: []
        },
        workHistory: [],
        education: [],
        softSkills: {
          communicationStyle: personalDescription ? 'Baserat på personlig beskrivning' : 'Professionell kommunikation',
          leadershipStyle: 'Stödjande och målinriktad',
          values: ['Kvalitet', 'Innovation', 'Samarbete'],
          personalityTraits: ['Analytisk', 'Detaljorienterad', 'Problemlösare'],
          workStyle: personalDescription ? 'Anpassad efter personlig beskrivning' : 'Teamorienterad och flexibel'
        },
        scores: {
          leadership: 3,
          innovation: 3,
          adaptability: 4,
          culturalFit: 4,
          communication: 4,
          teamwork: 4
        },
        analysisInsights: {
          strengths: ['Teknisk kompetens', 'Problemlösning', 'Teamarbete'],
          developmentAreas: ['Ledarskapsutvekling', 'Certifieringar'],
          careerTrajectory: 'Positiv utveckling med potential för senior roller',
          consultingReadiness: 'God potential för konsultarbete'
        },
        marketAnalysis: {
          hourlyRate: {
            current: 900,
            optimized: 1100,
            explanation: 'Baserat på tillgängliga tekniska färdigheter och erfarenhet'
          },
          competitiveAdvantages: ['Teknisk grund', 'Professionell approach'],
          marketDemand: 'God efterfrågan på marknaden',
          recommendedFocus: 'Fortsätt teknisk utveckling'
        }
      };
    }

    console.log('✅ IMPROVED CV analysis completed with better data extraction');

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
          skillsFound: detectedInfo.skills.length,
          personalDescriptionLength: personalDescription.length,
          aiModel: 'llama-3.1-8b-instant',
          extractionQuality: 'improved-filtering'
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('❌ IMPROVED CV parsing error:', error);
    
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
