
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
    console.log('🚀 Starting ENHANCED CV parsing with REAL DATA ONLY...');
    
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

    // ENHANCED text extraction with multiple algorithms
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
        console.log('📄 Processing PDF with ENHANCED multi-layer extraction...');
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        
        // ENHANCED PDF text extraction with improved algorithms
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
        
        // ENHANCED text cleaning and normalization
        extractedText = rawText
          .replace(/\s+/g, ' ')                    // Normalize whitespace
          .replace(/([a-z])([A-Z])/g, '$1 $2')     // Add spaces between camelCase
          .replace(/([0-9])([A-Z])/g, '$1 $2')     // Add spaces between numbers and caps
          .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2') // Fix ALL CAPS words
          .replace(/([.!?])\s*([A-Z])/g, '$1 $2')  // Fix sentence spacing
          .trim()
          .substring(0, 15000); // Increased text limit for comprehensive analysis
        
        console.log('📝 ENHANCED text extraction completed. Length:', extractedText.length);
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
        
        console.log('🔍 ENHANCED pattern detection results:', {
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
        extractedText = extractedText.substring(0, 15000);
        console.log('📄 Text file processed, length:', extractedText.length);
      }
      
    } catch (error) {
      console.warn('⚠️ Text extraction partially failed:', error);
      extractedText = `File processing limited for ${file.name}. Detected type: ${file.type}`;
    }

    console.log('🤖 Sending to OpenAI with STRICT REAL DATA ONLY analysis prompt...');

    // STRICT AI prompt that ONLY uses real data from CV text
    const prompt = `Du är en expert på CV-analys. Analysera detta CV EXTREMT NOGGRANT och använd ENDAST information som FAKTISKT finns i texten. HITTA ALDRIG PÅ information.

DETEKTERAD INFORMATION att prioritera och validera (använd ENDAST om den finns i texten):
Email: ${detectedInfo.emails.length > 0 ? detectedInfo.emails.join(', ') : 'SÖKS I TEXTEN'}
Telefon: ${detectedInfo.phones.length > 0 ? detectedInfo.phones.join(', ') : 'SÖKS I TEXTEN'}
Namn: ${detectedInfo.names.length > 0 ? detectedInfo.names.join(', ') : 'SÖKS I TEXTEN'}
Plats: ${detectedInfo.locations.length > 0 ? detectedInfo.locations.join(', ') : 'SÖKS I TEXTEN'}
Företag: ${detectedInfo.companies.length > 0 ? detectedInfo.companies.join(', ') : 'SÖKS I TEXTEN'}
Tekniska färdigheter: ${detectedInfo.skills.length > 0 ? detectedInfo.skills.join(', ') : 'SÖKS I TEXTEN'}

CV FULLTEXT FÖR ANALYS:
${extractedText}

KRITISKA REGLER - FÖLJ DESSA STRIKT:
1. Använd ENDAST information som FAKTISKT finns i CV-texten
2. Om information inte finns explicit, skriv "Not available in CV"
3. HITTA ALDRIG PÅ personuppgifter, företag, eller erfarenheter
4. Basera mjukvärdesanalys ENDAST på konkreta exempel från texten
5. Om mjukvärden inte kan härledas från texten, skriv "Insufficient evidence in CV"

ANALYS-INSTRUKTIONER:

1. PERSONLIG INFORMATION: 
   - Extrahera EXAKT som står i texten
   - Validera mot detekterad information
   - Om saknas: "Not available in CV"

2. MJUKVÄRDESANALYS (endast baserat på konkreta bevis i texten):
   - Kommunikationsstil: Analysera språkbruk från CV-text
   - Ledarskap: ENDAST om det finns konkreta exempel på ledarskap
   - Värderingar: ENDAST vad som uttrycks explicit
   - Teamarbete: ENDAST baserat på beskrivna team-erfarenheter

3. TEKNISK EXPERTIS:
   - Lista ENDAST tekniker som nämns i texten
   - Bedöm erfarenhet baserat på sammanhang i texten

4. ARBETSHISTORIK:
   - ENDAST roller och företag som nämns i texten
   - EXAKTA perioder om angivet

Svara ENDAST med denna JSON-struktur (använd "Not available in CV" för saknad info):

{
  "personalInfo": {
    "name": "EXAKT NAMN FRÅN TEXTEN eller Not available in CV",
    "email": "EXAKT EMAIL FRÅN TEXTEN eller Not available in CV", 
    "phone": "EXAKT TELEFON FRÅN TEXTEN eller Not available in CV",
    "location": "EXAKT PLATS FRÅN TEXTEN eller Not available in CV"
  },
  "experience": {
    "years": "EXAKT ANTAL ÅR eller Not available in CV",
    "currentRole": "EXAKT NUVARANDE ROLL eller Not available in CV",
    "level": "Junior/Mid/Senior/Expert baserat på erfarenhet eller Not available in CV"
  },
  "skills": {
    "technical": ["ENDAST TEKNIKER SOM NÄMNS I TEXTEN"],
    "languages": ["ENDAST PROGRAMMERINGSSPRÅK SOM NÄMNS"],
    "tools": ["ENDAST VERKTYG SOM NÄMNS"]
  },
  "workHistory": [
    {
      "company": "EXAKT FÖRETAG FRÅN TEXTEN",
      "role": "EXAKT ROLL FRÅN TEXTEN", 
      "duration": "EXAKT PERIOD FRÅN TEXTEN",
      "description": "KORT BESKRIVNING BASERAT PÅ TEXTEN"
    }
  ],
  "education": [
    {
      "institution": "EXAKT INSTITUTION FRÅN TEXTEN",
      "degree": "EXAKT EXAMEN FRÅN TEXTEN",
      "year": "EXAKT ÅR FRÅN TEXTEN"
    }
  ],
  "softSkills": {
    "communicationStyle": "Analys baserat på CV-språk eller Insufficient evidence in CV",
    "leadershipStyle": "Baserat på konkreta ledarskapsexempel eller Insufficient evidence in CV",
    "values": ["Värderingar som uttrycks i texten"],
    "personalityTraits": ["Drag som kan härledas från text"],
    "workStyle": "Baserat på arbetsbeskrivningar eller Insufficient evidence in CV",
    "teamFit": "Baserat på team-erfarenheter eller Insufficient evidence in CV"
  },
  "scores": {
    "leadership": "1-5 baserat på konkreta exempel eller 0 om ingen info",
    "innovation": "1-5 baserat på innovativa projekt eller 0 om ingen info",
    "adaptability": "1-5 baserat på olika roller/teknologier eller 0 om ingen info",
    "culturalFit": "1-5 baserat på värderingar i text eller 3 som standard",
    "communication": "1-5 baserat på CV-kvalitet och språk eller 3 som standard",
    "teamwork": "1-5 baserat på team-projekt eller 0 om ingen info"
  },
  "analysisInsights": {
    "strengths": ["Styrkor baserade på konkreta exempel från CV"],
    "developmentAreas": ["Områden som kan identifieras från luckor i CV eller Not applicable"],
    "careerTrajectory": "Analys av karriärutveckling från arbethistorik eller Not available in CV",
    "motivationFactors": ["Faktorer som kan härledas från CV-text"],
    "consultingReadiness": "Bedömning baserat på erfarenhet eller Not available in CV",
    "marketPosition": "Positionering baserat på färdigheter och erfarenhet eller Not available in CV"
  },
  "marketAnalysis": {
    "hourlyRate": {
      "current": "Baserat på erfarenhet 800-1200 eller 0 om osäker",
      "optimized": "Optimerat värde 1000-1500 eller 0 om osäker",
      "explanation": "Motivering baserat på faktisk erfarenhet och färdigheter"
    },
    "competitiveAdvantages": ["Fördelar baserade på unika kombinationer i CV"],
    "marketDemand": "Bedömning baserat på färdigheter eller Not available",
    "recommendedFocus": "Rekommendation baserat på nuvarande färdigheter eller Not available"
  }
}

VIKTIGT: Basera ALLT på faktisk CV-text. HITTA ALDRIG PÅ information!`;

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
            content: 'Du är en expertanalytiker för CV. Du MÅSTE använda ENDAST information som FAKTISKT finns i CV-texten. HITTA ALDRIG PÅ information. Svara ALLTID med korrekt JSON utan extra text.'
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
    console.log('✅ STRICT OpenAI response received');

    let analysis;
    try {
      const content = openaiData.choices[0]?.message?.content;
      console.log('🔍 OpenAI response content preview:', content.substring(0, 500));

      // Enhanced JSON extraction and validation
      const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const jsonMatch = cleanedContent.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
        
        // STRICT data validation - only use detected data if it's valid
        if (detectedInfo.emails.length > 0 && detectedInfo.emails[0].includes('@')) {
          analysis.personalInfo.email = detectedInfo.emails[0];
          console.log('✅ Email from detection:', detectedInfo.emails[0]);
        }
        if (detectedInfo.phones.length > 0 && detectedInfo.phones[0].length >= 8) {
          analysis.personalInfo.phone = detectedInfo.phones[0];
          console.log('✅ Phone from detection:', detectedInfo.phones[0]);
        }
        if (detectedInfo.names.length > 0 && detectedInfo.names[0].split(' ').length >= 2) {
          analysis.personalInfo.name = detectedInfo.names[0];
          console.log('✅ Name from detection:', detectedInfo.names[0]);
        }
        if (detectedInfo.locations.length > 0) {
          analysis.personalInfo.location = detectedInfo.locations[0];
          console.log('✅ Location from detection:', detectedInfo.locations[0]);
        }
        
        // Enhance skills with detected technical skills only if they exist
        if (detectedInfo.skills.length > 0) {
          analysis.skills.technical = [...new Set([...analysis.skills.technical, ...detectedInfo.skills])];
          console.log('✅ Technical skills enhanced with detection');
        }
        
        console.log('📊 STRICT analysis completed:', {
          name: analysis.personalInfo.name,
          email: analysis.personalInfo.email,
          phone: analysis.personalInfo.phone,
          location: analysis.personalInfo.location,
          realDataOnly: true
        });
        
      } else {
        throw new Error('No valid JSON found in OpenAI response');
      }
    } catch (parseError) {
      console.error('❌ Parse error, using STRICT fallback strategy:', parseError);
      
      // STRICT fallback with only detected information
      analysis = {
        personalInfo: {
          name: detectedInfo.names[0] || 'Not available in CV',
          email: detectedInfo.emails[0] || 'Not available in CV',
          phone: detectedInfo.phones[0] || 'Not available in CV',
          location: detectedInfo.locations[0] || 'Not available in CV'
        },
        experience: {
          years: 'Not available in CV',
          currentRole: 'Not available in CV',
          level: 'Not available in CV'
        },
        skills: {
          technical: detectedInfo.skills || [],
          languages: [],
          tools: []
        },
        workHistory: [],
        education: [],
        softSkills: {
          communicationStyle: 'Insufficient evidence in CV',
          leadershipStyle: 'Insufficient evidence in CV',
          values: [],
          personalityTraits: [],
          workStyle: 'Insufficient evidence in CV',
          teamFit: 'Insufficient evidence in CV'
        },
        scores: {
          leadership: 0,
          innovation: 0,
          adaptability: 0,
          culturalFit: 3,
          communication: 3,
          teamwork: 0
        },
        analysisInsights: {
          strengths: [],
          developmentAreas: ['Not applicable'],
          careerTrajectory: 'Not available in CV',
          motivationFactors: [],
          consultingReadiness: 'Not available in CV',
          marketPosition: 'Not available in CV'
        },
        marketAnalysis: {
          hourlyRate: {
            current: 0,
            optimized: 0,
            explanation: 'Insufficient data in CV for rate estimation'
          },
          competitiveAdvantages: [],
          marketDemand: 'Not available',
          recommendedFocus: 'Not available'
        }
      };
    }

    console.log('✅ STRICT CV analysis with real data only completed successfully');

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
          aiModel: 'gpt-4o-strict-real-data-only',
          extractionQuality: 'strict-real-data'
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('❌ STRICT CV parsing error:', error);
    
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
