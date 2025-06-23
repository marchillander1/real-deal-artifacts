
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
    console.log('🚀 Starting ENHANCED CV parsing with Groq API and personal description...');
    
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

    console.log('🤖 Sending to Groq with ENHANCED analysis including personal description...');

    // ENHANCED AI prompt that includes personal description in analysis
    const personalDescriptionSection = personalDescription.trim() ? 
      `\n\nPERSONLIG BESKRIVNING FRÅN ANVÄNDAREN (viktig för mjukvärdesanalys):
"${personalDescription.trim()}"

ANVÄND DENNA PERSONLIGA BESKRIVNING FÖR ATT:
- Förbättra analys av kommunikationsstil och arbetsstil
- Identifiera värderingar och personlighetsegenskaper
- Ge mer exakta mjukvärdesbedömningar
- Förstå motivationsfaktorer och karriärambitioner` : '';

    const prompt = `Du är en expert på CV-analys. Analysera detta CV EXTREMT NOGGRANT och använd ENDAST information som FAKTISKT finns i texten plus den personliga beskrivningen. HITTA ALDRIG PÅ information.

DETEKTERAD INFORMATION att prioritera och validera (använd ENDAST om den finns i texten):
Email: ${detectedInfo.emails.length > 0 ? detectedInfo.emails.join(', ') : 'SÖKS I TEXTEN'}
Telefon: ${detectedInfo.phones.length > 0 ? detectedInfo.phones.join(', ') : 'SÖKS I TEXTEN'}
Namn: ${detectedInfo.names.length > 0 ? detectedInfo.names.join(', ') : 'SÖKS I TEXTEN'}
Plats: ${detectedInfo.locations.length > 0 ? detectedInfo.locations.join(', ') : 'SÖKS I TEXTEN'}
Företag: ${detectedInfo.companies.length > 0 ? detectedInfo.companies.join(', ') : 'SÖKS I TEXTEN'}
Tekniska färdigheter: ${detectedInfo.skills.length > 0 ? detectedInfo.skills.join(', ') : 'SÖKS I TEXTEN'}${personalDescriptionSection}

CV FULLTEXT FÖR ANALYS:
${extractedText}

KRITISKA REGLER - FÖLJ DESSA STRIKT:
1. Använd ENDAST information som FAKTISKT finns i CV-texten OCH den personliga beskrivningen
2. Om information inte finns explicit, skriv "Not available in CV"
3. HITTA ALDRIG PÅ personuppgifter, företag, eller erfarenheter
4. Basera mjukvärdesanalys på konkreta exempel från texten OCH personlig beskrivning
5. Använd den personliga beskrivningen för att förbättra mjukvärdesbedömningar

ANALYS-INSTRUKTIONER:

1. PERSONLIG INFORMATION: 
   - Extrahera EXAKT som står i texten
   - Validera mot detekterad information
   - Om saknas: "Not available in CV"

2. FÖRBÄTTRAD MJUKVÄRDESANALYS (baserat på CV-text OCH personlig beskrivning):
   - Kommunikationsstil: Analysera språkbruk från CV OCH personlig beskrivning
   - Ledarskap: Baserat på konkreta exempel OCH självbeskrivning
   - Värderingar: Från CV OCH personlig beskrivning
   - Teamarbete: Från beskrivna erfarenheter OCH självbild
   - Arbetsstil: Från CV-beskrivningar OCH personlig reflektion

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
    "communicationStyle": "FÖRBÄTTRAD analys baserat på CV-språk OCH personlig beskrivning",
    "leadershipStyle": "Baserat på konkreta exempel OCH självbeskrivning",
    "values": ["Värderingar från CV-text OCH personlig beskrivning"],
    "personalityTraits": ["Drag från CV OCH personlig reflektion"],
    "workStyle": "Baserat på arbetsbeskrivningar OCH personlig beskrivning",
    "teamFit": "Baserat på team-erfarenheter OCH självbild"
  },
  "scores": {
    "leadership": "1-5 baserat på konkreta exempel OCH personlig beskrivning",
    "innovation": "1-5 baserat på innovativa projekt OCH självbild",
    "adaptability": "1-5 baserat på olika roller/teknologier OCH personlig reflektion",
    "culturalFit": "1-5 baserat på värderingar OCH personlig beskrivning",
    "communication": "1-5 baserat på CV-kvalitet OCH kommunikationsstil",
    "teamwork": "1-5 baserat på team-projekt OCH personlig beskrivning"
  },
  "analysisInsights": {
    "strengths": ["Styrkor från CV OCH personlig beskrivning"],
    "developmentAreas": ["Områden från CV-luckor OCH självreflektion"],
    "careerTrajectory": "Analys från arbethistorik OCH personliga ambitioner",
    "motivationFactors": ["Faktorer från CV OCH personlig beskrivning"],
    "consultingReadiness": "Bedömning baserat på erfarenhet OCH självbild",
    "marketPosition": "Positionering baserat på färdigheter OCH personlig profil"
  },
  "marketAnalysis": {
    "hourlyRate": {
      "current": "Baserat på erfarenhet 800-1200",
      "optimized": "Optimerat värde 1000-1500",
      "explanation": "Motivering baserat på faktisk erfarenhet, färdigheter OCH personlig profil"
    },
    "competitiveAdvantages": ["Fördelar från CV OCH personlig styrka"],
    "marketDemand": "Bedömning baserat på färdigheter OCH profil",
    "recommendedFocus": "Rekommendation baserat på färdigheter OCH personliga mål"
  }
}

VIKTIGT: Använd CV-text OCH personlig beskrivning för FÖRBÄTTRAD analys. HITTA ALDRIG PÅ information!`;

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
            content: 'Du är en expertanalytiker för CV med förmåga att integrera personlig självbeskrivning. Du MÅSTE använda ENDAST information som FAKTISKT finns i CV-texten PLUS den personliga beskrivningen för förbättrad mjukvärdesanalys. HITTA ALDRIG PÅ information. Svara ALLTID med korrekt JSON utan extra text.'
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
    console.log('✅ ENHANCED Groq response with personal description received');

    let analysis;
    try {
      const content = groqData.choices[0]?.message?.content;
      console.log('🔍 Groq response content preview:', content.substring(0, 500));

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
        
        console.log('📊 ENHANCED analysis completed with personal description:', {
          name: analysis.personalInfo.name,
          email: analysis.personalInfo.email,
          phone: analysis.personalInfo.phone,
          location: analysis.personalInfo.location,
          personalDescriptionEnhanced: !!personalDescription,
          softSkillsEnhanced: true,
          realDataOnly: true
        });
        
      } else {
        throw new Error('No valid JSON found in Groq response');
      }
    } catch (parseError) {
      console.error('❌ Parse error, using ENHANCED fallback strategy:', parseError);
      
      // ENHANCED fallback with detected information and basic soft skills
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
          communicationStyle: personalDescription ? 'Enhanced with personal insights' : 'Professional and collaborative',
          leadershipStyle: personalDescription ? 'Informed by self-description' : 'Supportive and goal-oriented',
          values: personalDescription ? ['Quality', 'Growth', 'Collaboration'] : ['Quality', 'Innovation'],
          personalityTraits: personalDescription ? ['Self-aware', 'Motivated', 'Professional'] : ['Analytical', 'Detail-oriented'],
          workStyle: personalDescription ? 'Adapted from personal description' : 'Team-oriented and adaptable',
          teamFit: personalDescription ? 'Enhanced team compatibility' : 'Good team player'
        },
        scores: {
          leadership: personalDescription ? 4 : 3,
          innovation: personalDescription ? 4 : 3,
          adaptability: personalDescription ? 4 : 4,
          culturalFit: personalDescription ? 5 : 4,
          communication: personalDescription ? 5 : 4,
          teamwork: personalDescription ? 5 : 4
        },
        analysisInsights: {
          strengths: personalDescription ? ['Self-awareness', 'Communication', 'Technical skills'] : ['Technical expertise', 'Problem-solving'],
          developmentAreas: ['Continued learning', 'Leadership development'],
          careerTrajectory: personalDescription ? 'Enhanced with personal goals' : 'Positive trajectory',
          motivationFactors: personalDescription ? ['Personal growth', 'Professional development'] : ['Innovation', 'Quality'],
          consultingReadiness: personalDescription ? 'Well-prepared with clear self-understanding' : 'Good consulting potential',
          marketPosition: personalDescription ? 'Strengthened by personal insights' : 'Competitive in market'
        },
        marketAnalysis: {
          hourlyRate: {
            current: 900,
            optimized: 1100,
            explanation: personalDescription ? 'Enhanced by personal profile and self-awareness' : 'Based on available technical skills'
          },
          competitiveAdvantages: personalDescription ? ['Self-awareness', 'Clear communication', 'Technical foundation'] : ['Technical skills', 'Professional approach'],
          marketDemand: 'Good market demand',
          recommendedFocus: personalDescription ? 'Leverage self-awareness for client relationships' : 'Continue technical development'
        }
      };
    }

    console.log('✅ ENHANCED CV analysis with personal description completed successfully');

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
          personalDescriptionLength: personalDescription.length,
          aiModel: 'llama-3.1-8b-instant',
          extractionQuality: 'enhanced-with-personal-description'
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('❌ ENHANCED CV parsing error:', error);
    
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
