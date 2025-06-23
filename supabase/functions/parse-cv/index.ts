
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
    console.log('🚀 Starting ADVANCED CV parsing with comprehensive professional analysis...');
    
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

    // ADVANCED text extraction with multiple algorithms
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
        console.log('📄 Processing PDF with ADVANCED multi-layer extraction...');
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        
        // ADVANCED PDF text extraction with improved algorithms
        let rawText = '';
        let wordBuffer = '';
        let previousByte = 0;
        
        for (let i = 0; i < uint8Array.length - 1; i++) {
          const byte = uint8Array[i];
          const nextByte = uint8Array[i + 1];
          
          // Enhanced character detection with better Unicode support
          if (byte >= 32 && byte <= 126) {
            const char = String.fromCharCode(byte);
            
            // Enhanced character filtering including international characters
            if (char.match(/[a-zA-Z0-9@.\-+()åäöÅÄÖéÉèÈàÀüÜ\s]/)) {
              wordBuffer += char;
            }
          } else if ((byte === 10 || byte === 13 || byte === 32) && wordBuffer.length > 0) {
            // Better word boundary detection
            rawText += wordBuffer + ' ';
            wordBuffer = '';
          }
          
          // Enhanced line break handling
          if ((byte === 10 || byte === 13) && previousByte !== 10 && previousByte !== 13) {
            if (rawText.slice(-1) !== ' ' && rawText.slice(-1) !== '\n') {
              rawText += ' ';
            }
          }
          
          previousByte = byte;
        }
        
        // Add remaining buffer
        if (wordBuffer.length > 0) {
          rawText += wordBuffer;
        }
        
        // ADVANCED text cleaning and normalization
        extractedText = rawText
          .replace(/\s+/g, ' ')                    // Normalize whitespace
          .replace(/([a-z])([A-Z])/g, '$1 $2')     // Add spaces between camelCase
          .replace(/([0-9])([A-Z])/g, '$1 $2')     // Add spaces between numbers and caps
          .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2') // Fix ALL CAPS words
          .replace(/([.!?])\s*([A-Z])/g, '$1 $2')  // Fix sentence spacing
          .trim()
          .substring(0, 12000); // Increased text limit for comprehensive analysis
        
        console.log('📝 ADVANCED text extraction completed. Length:', extractedText.length);
        console.log('📝 Sample text:', extractedText.substring(0, 500));
        
        // ENHANCED regex patterns for comprehensive information detection
        const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
        const phoneRegex = /(\+46[\s\-]?|0046[\s\-]?|0)[\s\-]?[0-9]{1,3}[\s\-]?[0-9]{3,4}[\s\-]?[0-9]{2,4}[\s\-]?[0-9]{0,4}|[0-9]{3}[\s\-]?[0-9]{3}[\s\-]?[0-9]{2,4}/g;
        const nameRegex = /\b[A-ZÅÄÖÉ][a-zåäöé]{2,}\s+[A-ZÅÄÖÉ][a-zåäöé]{2,}(?:\s+[A-ZÅÄÖÉ][a-zåäöé]{2,})*/g;
        const locationRegex = /\b(?:Stockholm|Göteborg|Malmö|Uppsala|Västerås|Örebro|Linköping|Helsingborg|Jönköping|Norrköping|Lund|Umeå|Gävle|Borås|Eskilstuna|Sundsvall|Sverige|Sweden|Denmark|Norge|Norway|Finland|Copenhagen|Oslo|Helsinki|London|Berlin|Amsterdam|Paris|Madrid|Rome|Brussels|Zurich|Vienna)\b/gi;
        const companyRegex = /\b(?:AB|Ltd|Inc|Corp|GmbH|AS|Oy|ApS)\b|\b[A-ZÅÄÖ][a-zåäöé]+(?:\s[A-ZÅÄÖ][a-zåäöé]+)*(?:\sAB|\sLtd|\sInc|\sCorp|\sGmbH|\sAS|\sOy|\sApS)?\b/g;
        const skillRegex = /\b(?:JavaScript|Java|Python|C\#|C\+\+|PHP|Ruby|Go|Rust|TypeScript|React|Angular|Vue|Node\.js|Express|Django|Flask|Spring|Laravel|MySQL|PostgreSQL|MongoDB|Redis|Docker|Kubernetes|AWS|Azure|GCP|Git|Jenkins|CI\/CD|Agile|Scrum|DevOps|Machine Learning|AI|Data Science|Frontend|Backend|Fullstack|API|REST|GraphQL|Microservices|Cloud|Security|Testing|TDD|BDD)\b/gi;
        
        detectedInfo.emails = Array.from(new Set([...extractedText.matchAll(emailRegex)].map(m => m[0].toLowerCase())));
        detectedInfo.phones = Array.from(new Set([...extractedText.matchAll(phoneRegex)].map(m => m[0].replace(/[\s\-]/g, ''))));
        detectedInfo.names = Array.from(new Set([...extractedText.matchAll(nameRegex)].map(m => m[0])));
        detectedInfo.locations = Array.from(new Set([...extractedText.matchAll(locationRegex)].map(m => m[0])));
        detectedInfo.companies = Array.from(new Set([...extractedText.matchAll(companyRegex)].map(m => m[0]))).slice(0, 10);
        detectedInfo.skills = Array.from(new Set([...extractedText.matchAll(skillRegex)].map(m => m[0]))).slice(0, 20);
        
        console.log('🔍 ADVANCED pattern detection results:', {
          emails: detectedInfo.emails.length,
          phones: detectedInfo.phones.length,
          names: detectedInfo.names.length,
          locations: detectedInfo.locations.length,
          companies: detectedInfo.companies.length,
          skills: detectedInfo.skills.length
        });
        
      } else {
        // Handle text files and other formats
        extractedText = await file.text();
        extractedText = extractedText.substring(0, 12000);
        console.log('📄 Text file processed, length:', extractedText.length);
      }
      
    } catch (error) {
      console.warn('⚠️ Text extraction partially failed:', error);
      extractedText = `File processing limited for ${file.name}. Detected type: ${file.type}`;
    }

    console.log('🤖 Sending to OpenAI with COMPREHENSIVE PROFESSIONAL analysis prompt...');

    // ADVANCED AI prompt for comprehensive professional analysis
    const prompt = `Du är en expert på CV-analys, rekrytering och professionell utvärdering. Analysera detta CV MYCKET NOGGRANT för att skapa en komplett professionell bedömning.

DETEKTERAD INFORMATION att prioritera och validera:
Email: ${detectedInfo.emails.length > 0 ? detectedInfo.emails.join(', ') : 'MÅSTE HITTAS I TEXTEN'}
Telefon: ${detectedInfo.phones.length > 0 ? detectedInfo.phones.join(', ') : 'MÅSTE HITTAS I TEXTEN'}
Namn: ${detectedInfo.names.length > 0 ? detectedInfo.names.join(', ') : 'MÅSTE HITTAS I TEXTEN'}
Plats: ${detectedInfo.locations.length > 0 ? detectedInfo.locations.join(', ') : 'LETA I TEXTEN'}
Företag: ${detectedInfo.companies.length > 0 ? detectedInfo.companies.join(', ') : 'IDENTIFIERA FRÅN TEXTEN'}
Tekniska färdigheter: ${detectedInfo.skills.length > 0 ? detectedInfo.skills.join(', ') : 'EXTRAHERA FRÅN TEXTEN'}

CV FULLTEXT FÖR DJUPANALYS:
${extractedText}

OMFATTANDE ANALYS-INSTRUKTIONER:

1. PERSONLIG INFORMATION: 
   - Hitta EXAKT namn, email, telefon från texten
   - Validera mot detekterad information ovan
   - Om information saknas, sök NOGGRANT i hela texten

2. DJUP MJUKVÄRDESANALYS:
   - Kommunikationsstil: Analysera språkbruk, struktur, tydlighet
   - Ledarskapsegenskaper: Hitta bevis på ansvar, team-ledning, initiativ
   - Värderingar: Vad betonar personen som viktigt (kvalitet, innovation, teamwork)
   - Personlighetstyp: Analytisk, kreativ, systematisk, entreprenöriell
   - Teamanpassning: Samarbetsförmåga från beskrivningar och projekt
   - Kulturell passform: Arbetssätt, värderingar, kommunikationsstil
   - Anpassningsförmåga: Flexibilitet från olika roller/teknologier
   - Innovation: Kreativa lösningar, nya teknologier, förbättringsinitiativ

3. TEKNISK EXPERTIS:
   - Identifiera ALLA tekniska färdigheter från texten
   - Bedöm erfarenhetsnivå baserat på sammanhang
   - Analysera teknisk progression över tid

4. PROFESSIONELL UTVECKLING:
   - Karriärens progression och riktning
   - Utbildningsbakgrund och certifieringar
   - Kompetensområden och specialiseringar

5. MARKNADSPOSITIONERING:
   - Beräkna realistisk timpris baserat på erfarenhet och färdigheter
   - Identifiera konkurrensfördelar
   - Bedöm konsultberedskap

Svara ENDAST med denna exakta JSON-struktur:

{
  "personalInfo": {
    "name": "FULLSTÄNDIGT RIKTIGT NAMN FRÅN TEXTEN",
    "email": "RIKTIG EMAIL FRÅN TEXTEN", 
    "phone": "TELEFONNUMMER FRÅN TEXTEN",
    "location": "PLATS FRÅN TEXTEN ELLER DETEKTERAD"
  },
  "experience": {
    "years": "ANTAL ÅR TOTAL ERFARENHET",
    "currentRole": "SENASTE/NUVARANDE ROLL",
    "level": "Junior/Mid/Senior/Expert"
  },
  "skills": {
    "technical": ["ALLA TEKNISKA FÄRDIGHETER FRÅN TEXTEN"],
    "languages": ["PROGRAMMERINGSSPRÅK"],
    "tools": ["VERKTYG", "RAMVERK", "PLATTFORMAR"]
  },
  "workHistory": [
    {
      "company": "FÖRETAG",
      "role": "ROLL", 
      "duration": "PERIOD",
      "description": "KORT BESKRIVNING AV ANSVAR"
    }
  ],
  "education": [
    {
      "institution": "UTBILDNINGSINSTITUTION",
      "degree": "EXAMEN/UTBILDNING",
      "year": "ÅR ELLER PERIOD"
    }
  ],
  "softSkills": {
    "communicationStyle": "DETALJERAD BEDÖMNING AV KOMMUNIKATIONSSTIL BASERAT PÅ CV-TEXT",
    "leadershipStyle": "LEDARSKAPSTYP OCH APPROACH BASERAT PÅ BEVIS I CV",
    "values": ["VÄRDERING 1", "VÄRDERING 2", "VÄRDERING 3"],
    "personalityTraits": ["PERSONLIGHETSDRAG 1", "PERSONLIGHETSDRAG 2", "PERSONLIGHETSDRAG 3"],
    "workStyle": "ARBETSSTIL OCH PREFERENSER BASERAT PÅ CV-INNEHÅLL",
    "teamFit": "TEAMANPASSNING OCH SAMARBETSFÖRMÅGA FRÅN CV-BESKRIVNINGAR"
  },
  "scores": {
    "leadership": 1-5,
    "innovation": 1-5,
    "adaptability": 1-5,
    "culturalFit": 1-5,
    "communication": 1-5,
    "teamwork": 1-5
  },
  "analysisInsights": {
    "strengths": ["SPECIFIK STYRKA 1", "SPECIFIK STYRKA 2", "SPECIFIK STYRKA 3"],
    "developmentAreas": ["UTVECKLINGSOMRÅDE 1", "UTVECKLINGSOMRÅDE 2"],
    "careerTrajectory": "DETALJERAD ANALYS AV KARRIÄRUTVECKLING OCH FRAMTIDA RIKTNING",
    "motivationFactors": ["VAD SOM DRIVER PERSONEN BASERAT PÅ CV", "MOTIVATION 2"],
    "consultingReadiness": "BEDÖMNING AV BEREDSKAP FÖR KONSULTARBETE",
    "marketPosition": "MARKNADSPOSITIONERING OCH KONKURRENSFÖRDELAR"
  },
  "marketAnalysis": {
    "hourlyRate": {
      "current": 800-1200,
      "optimized": 1000-1500,
      "explanation": "MOTIVERING BASERAT PÅ ERFARENHET OCH FÄRDIGHETER"
    },
    "competitiveAdvantages": ["FÖRDEL 1", "FÖRDEL 2"],
    "marketDemand": "HÖG/MEDIUM/LÅG",
    "recommendedFocus": "REKOMMENDERAT FOKUSOMRÅDE FÖR KARRIÄRUTVECKLING"
  }
}

KRITISKT VIKTIGT: 
- Basera ALLA mjukvärden på faktisk text och formuleringar från CV:t
- Om information saknas, skriv "Ej tillräckligt underlag" för den egenskapen
- Prioritera DETEKTERAD information för personuppgifter
- Ge KONKRETA bevis för alla bedömningar`;

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'Du är en expertanalytiker för CV och professionell utvärdering. Du MÅSTE extrahera personlig information EXAKT från texten och ge djupgående mjukvärdesanalys. Svara ALLTID med korrekt JSON utan extra text. Din analys ska vara detaljerad och professionell.'
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

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error('❌ OpenAI API error:', errorText);
      throw new Error(`OpenAI API failed: ${openaiResponse.status}`);
    }

    const openaiData = await openaiResponse.json();
    console.log('✅ ADVANCED OpenAI response received');

    let analysis;
    try {
      const content = openaiData.choices[0]?.message?.content;
      console.log('🔍 OpenAI response content preview:', content.substring(0, 500));

      // Enhanced JSON extraction and validation
      const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const jsonMatch = cleanedContent.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
        
        // ADVANCED data validation and override with detected data
        if (detectedInfo.emails.length > 0 && detectedInfo.emails[0].includes('@')) {
          analysis.personalInfo.email = detectedInfo.emails[0];
          console.log('✅ Email prioritized from detection:', detectedInfo.emails[0]);
        }
        if (detectedInfo.phones.length > 0 && detectedInfo.phones[0].length >= 8) {
          analysis.personalInfo.phone = detectedInfo.phones[0];
          console.log('✅ Phone prioritized from detection:', detectedInfo.phones[0]);
        }
        if (detectedInfo.names.length > 0 && detectedInfo.names[0].split(' ').length >= 2) {
          analysis.personalInfo.name = detectedInfo.names[0];
          console.log('✅ Name prioritized from detection:', detectedInfo.names[0]);
        }
        if (detectedInfo.locations.length > 0) {
          analysis.personalInfo.location = detectedInfo.locations[0];
          console.log('✅ Location prioritized from detection:', detectedInfo.locations[0]);
        }
        
        // Enhance skills with detected technical skills
        if (detectedInfo.skills.length > 0) {
          analysis.skills.technical = [...new Set([...analysis.skills.technical, ...detectedInfo.skills])];
          console.log('✅ Technical skills enhanced with detection');
        }
        
        console.log('📊 ADVANCED analysis completed:', {
          name: analysis.personalInfo.name,
          email: analysis.personalInfo.email,
          phone: analysis.personalInfo.phone,
          location: analysis.personalInfo.location,
          softSkillsAnalyzed: !!analysis.softSkills,
          scoresProvided: !!analysis.scores,
          marketAnalysis: !!analysis.marketAnalysis,
          insightsGenerated: !!analysis.analysisInsights
        });
        
      } else {
        throw new Error('No valid JSON found in OpenAI response');
      }
    } catch (parseError) {
      console.error('❌ Parse error, using ENHANCED fallback strategy:', parseError);
      
      // ENHANCED fallback with comprehensive structure
      analysis = {
        personalInfo: {
          name: detectedInfo.names[0] || 'Namn ej detekterat',
          email: detectedInfo.emails[0] || 'Email ej detekterad',
          phone: detectedInfo.phones[0] || 'Telefon ej detekterad',
          location: detectedInfo.locations[0] || 'Sverige'
        },
        experience: {
          years: 'Ej specificerat',
          currentRole: 'Ej specificerat',
          level: 'Ej specificerat'
        },
        skills: {
          technical: detectedInfo.skills || [],
          languages: [],
          tools: []
        },
        workHistory: [],
        education: [],
        softSkills: {
          communicationStyle: 'Ej tillräckligt underlag',
          leadershipStyle: 'Ej tillräckligt underlag',
          values: [],
          personalityTraits: [],
          workStyle: 'Ej tillräckligt underlag',
          teamFit: 'Ej tillräckligt underlag'
        },
        scores: {
          leadership: 3,
          innovation: 3,
          adaptability: 3,
          culturalFit: 3,
          communication: 3,
          teamwork: 3
        },
        analysisInsights: {
          strengths: [],
          developmentAreas: [],
          careerTrajectory: 'Ej tillräckligt underlag',
          motivationFactors: [],
          consultingReadiness: 'Ej tillräckligt underlag',
          marketPosition: 'Ej tillräckligt underlag'
        },
        marketAnalysis: {
          hourlyRate: {
            current: 800,
            optimized: 1000,
            explanation: 'Baserat på genomsnittliga marknadsrater'
          },
          competitiveAdvantages: [],
          marketDemand: 'Medium',
          recommendedFocus: 'Teknisk vidareutveckling'
        }
      };
    }

    console.log('✅ COMPREHENSIVE CV analysis with advanced soft skills completed successfully');

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
          companiesFound: detectedInfo.companies.length,
          skillsFound: detectedInfo.skills.length,
          aiModel: 'gpt-4o-comprehensive-professional-analysis',
          extractionQuality: 'advanced'
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('❌ ADVANCED CV parsing error:', error);
    
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
