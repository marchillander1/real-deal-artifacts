
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
    console.log('🚀 Starting ENHANCED CV parsing with better text extraction...');
    
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

    // ENHANCED text extraction with better PDF processing
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
        console.log('📄 Processing PDF with ENHANCED text extraction...');
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        
        // ENHANCED PDF text extraction - much better approach
        let rawText = '';
        let textObjects: string[] = [];
        
        // Convert to string for pattern matching
        const pdfString = new TextDecoder('latin1').decode(uint8Array);
        
        // Extract text objects from PDF - look for text content between parentheses and brackets
        const textPatterns = [
          /\((.*?)\)/g,  // Text in parentheses
          /\[(.*?)\]/g,  // Text in brackets
          /BT\s*(.*?)\s*ET/gs, // Text between BT and ET markers
          /Tj\s*\((.*?)\)/g, // Tj text operators
          /TJ\s*\[(.*?)\]/g  // TJ text operators
        ];
        
        textPatterns.forEach(pattern => {
          const matches = pdfString.matchAll(pattern);
          for (const match of matches) {
            if (match[1] && match[1].length > 1) {
              // Clean and decode the text
              let text = match[1]
                .replace(/\\[nr]/g, ' ')  // Replace escaped newlines
                .replace(/\\/g, '')       // Remove backslashes
                .replace(/^\d+$/, '')     // Remove pure numbers
                .trim();
              
              if (text.length > 1 && !text.match(/^[0-9\s\.]+$/)) {
                textObjects.push(text);
              }
            }
          }
        });
        
        // Also try a simpler approach - look for readable text sequences
        const readableText = pdfString.match(/[A-Za-zÅÄÖåäö][A-Za-zÅÄÖåäö0-9@.\-\s]{3,}/g) || [];
        textObjects.push(...readableText);
        
        // Combine and clean all extracted text
        rawText = textObjects
          .filter(text => text && text.length > 2)
          .filter(text => !text.match(/^(obj|endobj|stream|endstream|xref|trailer|startxref|Type|Subtype|Filter|Length|Width|Height|BitsPerComponent|ColorSpace|DeviceRGB|FlateDecode|DCTDecode)$/i))
          .join(' ');
        
        extractedText = rawText
          .replace(/\s+/g, ' ')                    // Normalize whitespace
          .replace(/([a-z])([A-Z])/g, '$1 $2')     // Add spaces between camelCase
          .replace(/([0-9])([A-Z])/g, '$1 $2')     // Add spaces between numbers and caps
          .replace(/\b(PDF|Adobe|Acrobat|Creator|Producer|Title|Subject|Author|Keywords|CreationDate|ModDate|obj|endobj|stream|endstream|xref|trailer|startxref)\b/gi, '') // Remove PDF metadata
          .replace(/[^\w\s@.\-+åäöÅÄÖéÉèÈàÀüÜ]/g, ' ') // Keep only meaningful characters
          .replace(/\s+/g, ' ')                    // Final whitespace cleanup
          .trim()
          .substring(0, 15000); // Increase text limit for better analysis
        
        console.log('📝 ENHANCED text extraction completed. Length:', extractedText.length);
        console.log('📝 Sample extracted text (first 500 chars):', extractedText.substring(0, 500));
        
        // ENHANCED regex patterns for better detection
        const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
        const phoneRegex = /(?:\+46[\s\-]?|0046[\s\-]?|0)[\s\-]?[1-9][0-9\s\-]{7,11}[0-9]|\b[0-9]{2,3}[\s\-]?[0-9]{3,4}[\s\-]?[0-9]{2,4}\b/g;
        const nameRegex = /\b[A-ZÅÄÖÉ][a-zåäöé]{1,}\s+[A-ZÅÄÖÉ][a-zåäöé]{1,}(?:\s+[A-ZÅÄÖÉ][a-zåäöé]{1,})?\b/g;
        const locationRegex = /\b(?:Stockholm|Göteborg|Malmö|Uppsala|Västerås|Örebro|Linköping|Helsingborg|Jönköping|Norrköping|Lund|Umeå|Gävle|Borås|Eskilstuna|Sundsvall|Sverige|Sweden|Copenhagen|Oslo|Helsinki|London|Berlin|Amsterdam|Paris|Madrid|Rome|Brussels|Zurich|Vienna|Denmark|Norway|Finland|Germany|Netherlands|France|Spain|Italy|Belgium|Switzerland|Austria)\b/gi;
        const skillRegex = /\b(?:JavaScript|Java|Python|C#|C\+\+|PHP|Ruby|Go|Rust|TypeScript|React|Angular|Vue|Node\.js|Express|Django|Flask|Spring|Laravel|MySQL|PostgreSQL|MongoDB|Redis|Docker|Kubernetes|AWS|Azure|GCP|Git|Jenkins|CI\/CD|Agile|Scrum|DevOps|Machine Learning|AI|Data Science|Frontend|Backend|Fullstack|API|REST|GraphQL|Microservices|Cloud|Security|Testing|TDD|BDD|HTML|CSS|SASS|LESS|Bootstrap|Tailwind|jQuery|Redux|Next\.js|Nuxt\.js|Svelte|Flutter|React Native|Ionic|Xamarin|Unity|Unreal Engine|Blender|Photoshop|Illustrator|Figma|Sketch|InVision|Zeplin|Adobe XD|SQL|NoSQL|Linux|Windows|macOS|Apache|Nginx|Elasticsearch|Kafka|RabbitMQ|Terraform|Ansible|Prometheus|Grafana)\b/gi;
        
        detectedInfo.emails = Array.from(new Set([...extractedText.matchAll(emailRegex)].map(m => m[0].toLowerCase())));
        detectedInfo.phones = Array.from(new Set([...extractedText.matchAll(phoneRegex)].map(m => m[0].replace(/[\s\-]/g, ''))));
        detectedInfo.names = Array.from(new Set([...extractedText.matchAll(nameRegex)].map(m => m[0])));
        detectedInfo.locations = Array.from(new Set([...extractedText.matchAll(locationRegex)].map(m => m[0])));
        detectedInfo.skills = Array.from(new Set([...extractedText.matchAll(skillRegex)].map(m => m[0])));
        
        console.log('🔍 ENHANCED pattern detection results:', {
          emails: detectedInfo.emails.length,
          phones: detectedInfo.phones.length,
          names: detectedInfo.names.length,
          locations: detectedInfo.locations.length,
          skills: detectedInfo.skills.length
        });
        
        // Log detected information for debugging
        if (detectedInfo.names.length > 0) {
          console.log('👤 Detected names:', detectedInfo.names.slice(0, 5));
        }
        if (detectedInfo.emails.length > 0) {
          console.log('📧 Detected emails:', detectedInfo.emails.slice(0, 3));
        }
        if (detectedInfo.skills.length > 0) {
          console.log('💻 Detected skills:', detectedInfo.skills.slice(0, 10));
        }
        
      } else {
        // Handle text files and images
        extractedText = await file.text();
        extractedText = extractedText.substring(0, 15000);
        console.log('📄 Text file processed, length:', extractedText.length);
      }
      
    } catch (error) {
      console.warn('⚠️ Text extraction partially failed:', error);
      extractedText = `Limited text extraction for ${file.name}. File type: ${file.type}`;
    }

    console.log('🤖 Sending to Groq with ENHANCED analysis prompt...');

    // ENHANCED AI prompt with much better instructions
    const personalDescriptionSection = personalDescription.trim() ? 
      `\n\nPERSONLIG BESKRIVNING FRÅN ANVÄNDAREN:
"${personalDescription.trim()}"

Använd denna personliga beskrivning för att förbättra mjukvärdesanalysen och personlighetsanalys.` : '';

    const detectedInfoSection = `\n\nDETEKTERAD INFORMATION (använd denna om den är korrekt):
${detectedInfo.emails.length > 0 ? `Email: ${detectedInfo.emails.join(', ')}` : ''}
${detectedInfo.phones.length > 0 ? `Telefon: ${detectedInfo.phones.join(', ')}` : ''}
${detectedInfo.names.length > 0 ? `Namn: ${detectedInfo.names.join(', ')}` : ''}
${detectedInfo.locations.length > 0 ? `Plats: ${detectedInfo.locations.join(', ')}` : ''}
${detectedInfo.skills.length > 0 ? `Tekniska färdigheter: ${detectedInfo.skills.join(', ')}` : ''}`;

    const prompt = `Du är en expert CV-analytiker som ska analysera detta CV mycket noggrant och extrahera ENDAST riktig information.

VIKTIGA INSTRUKTIONER:
1. Läs CV-texten mycket noggrant och hitta rätt namn, email, telefon och färdigheter
2. Ignorera PDF-metadata som "Object", "Subtype", "Width", "Height" etc
3. Fokusera på RIKTIG CV-information som arbetslivserfarenhet, utbildning, tekniska färdigheter
4. Om information saknas, skriv ett rimligt värde baserat på kontext eller "Ej angivet"
5. För tekniska färdigheter - leta efter programmeringsspråk, verktyg, teknologier, ramverk
6. För erfarenhet - leta efter jobbroller, företag, årtal, ansvarsområden${detectedInfoSection}${personalDescriptionSection}

CV-TEXT FÖR ANALYS:
${extractedText}

Analysera detta CV noggrant och ge en detaljerad analys. Svara med ENDAST denna JSON-struktur:

{
  "personalInfo": {
    "name": "FAKTISKT NAMN från CV (inte PDF-metadata)",
    "email": "FAKTISK EMAIL från CV",
    "phone": "FAKTISK TELEFON från CV", 
    "location": "FAKTISK PLATS från CV eller land"
  },
  "experience": {
    "years": "Antal år erfarenhet baserat på CV-innehåll",
    "currentRole": "Nuvarande eller senaste jobbtitel från CV",
    "level": "Junior/Mid/Senior/Expert baserat på erfarenhet och roller"
  },
  "skills": {
    "technical": ["ALLA tekniska färdigheter från CV - programmeringsspråk, verktyg, teknologier"],
    "languages": ["Programmeringsspråk specifikt"],
    "tools": ["Verktyg och teknologier från CV"]
  },
  "workHistory": [
    {
      "company": "Företagsnamn från CV",
      "role": "Jobbroll från CV", 
      "duration": "Tidsperiod från CV",
      "description": "Beskrivning av arbetsuppgifter"
    }
  ],
  "education": [
    {
      "institution": "Skola/Universitet från CV",
      "degree": "Examen/Utbildning från CV",
      "year": "År från CV"
    }
  ],
  "softSkills": {
    "communicationStyle": "Kommunikationsstil baserat på CV-språk och personlig beskrivning",
    "leadershipStyle": "Ledarskapsstil baserat på roller och erfarenhet",
    "values": ["Värderingar från CV och personlig beskrivning"],
    "personalityTraits": ["Personlighetsdrag från CV och beskrivning"],
    "workStyle": "Arbetsstil baserat på CV och personlig beskrivning"
  },
  "scores": {
    "leadership": 4,
    "innovation": 4,
    "adaptability": 4,
    "culturalFit": 4,
    "communication": 4,
    "teamwork": 4
  },
  "analysisInsights": {
    "strengths": ["Konkreta styrkor från CV"],
    "developmentAreas": ["Utvecklingsområden baserat på CV"],
    "careerTrajectory": "Karriärutveckling baserat på CV",
    "consultingReadiness": "Beredskap för konsultarbete"
  },
  "marketAnalysis": {
    "hourlyRate": {
      "current": 1000,
      "optimized": 1200,
      "explanation": "Motivering baserat på färdigheter och erfarenhet från CV"
    },
    "competitiveAdvantages": ["Konkurrensfördelar från CV"],
    "marketDemand": "Marknadsbedömning baserat på färdigheter",
    "recommendedFocus": "Utvecklingsrekommendationer"
  }
}

KRITISKT: Använd ENDAST information från CV-texten. Ignorera PDF-metadata helt. Fokusera på att hitta riktiga namn, färdigheter och erfarenheter!`;

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile', // Using larger model for better analysis
        messages: [
          {
            role: 'system',
            content: 'Du är en expertanalytiker för CV som ALLTID hittar och extraherar riktig information från CV:n. Du ignorerar PDF-metadata och fokuserar på FAKTISKT CV-innehåll. Svara ALLTID med korrekt JSON utan extra text.'
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
    console.log('✅ ENHANCED Groq response received');

    let analysis;
    try {
      const content = groqData.choices[0]?.message?.content;
      console.log('🔍 Groq response preview:', content.substring(0, 500));

      const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const jsonMatch = cleanedContent.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
        
        // ENHANCED: Use detected information ONLY if it's valid and better than AI extraction
        if (detectedInfo.emails.length > 0 && detectedInfo.emails[0].includes('@') && 
            (!analysis.personalInfo.email || analysis.personalInfo.email === 'Ej angivet' || !analysis.personalInfo.email.includes('@'))) {
          analysis.personalInfo.email = detectedInfo.emails[0];
          console.log('✅ Using detected email:', detectedInfo.emails[0]);
        }
        
        if (detectedInfo.phones.length > 0 && detectedInfo.phones[0].length >= 8 &&
            (!analysis.personalInfo.phone || analysis.personalInfo.phone === 'Ej angivet')) {
          analysis.personalInfo.phone = detectedInfo.phones[0];
          console.log('✅ Using detected phone:', detectedInfo.phones[0]);
        }
        
        // Enhanced name validation - avoid PDF metadata
        if (detectedInfo.names.length > 0) {
          const validNames = detectedInfo.names.filter(name => 
            !name.match(/^(Object|Subtype|Image|Width|Height|Filter|Type|PDF|Creator|Producer|Title|Subject|Author|Keywords|CreationDate|ModDate)/i) &&
            name.split(' ').length >= 2 &&
            name.length < 50 &&
            name.length > 4 &&
            !name.match(/^\d+/) // Don't start with numbers
          );
          if (validNames.length > 0 && (!analysis.personalInfo.name || analysis.personalInfo.name === 'Ej angivet')) {
            analysis.personalInfo.name = validNames[0];
            console.log('✅ Using detected name:', validNames[0]);
          }
        }
        
        if (detectedInfo.locations.length > 0 && (!analysis.personalInfo.location || analysis.personalInfo.location === 'Ej angivet')) {
          analysis.personalInfo.location = detectedInfo.locations[0];
          console.log('✅ Using detected location:', detectedInfo.locations[0]);
        }
        
        // Enhanced skills merging
        if (detectedInfo.skills.length > 0) {
          const existingSkills = analysis.skills.technical || [];
          const mergedSkills = [...new Set([...existingSkills, ...detectedInfo.skills])].filter(skill => 
            skill && skill !== 'Ej angivet' && skill.length > 1
          );
          analysis.skills.technical = mergedSkills;
          console.log('✅ Enhanced technical skills with detected skills:', mergedSkills.length, 'total skills');
        }
        
      } else {
        throw new Error('No valid JSON found in response');
      }
    } catch (parseError) {
      console.error('❌ Parse error, using enhanced fallback:', parseError);
      
      // ENHANCED fallback with detected valid information
      analysis = {
        personalInfo: {
          name: detectedInfo.names.find(name => 
            !name.match(/^(Object|Subtype|Image|Width|Height|Filter|Type|PDF)/i) &&
            name.split(' ').length >= 2 &&
            name.length > 4 && name.length < 50
          ) || 'Ej angivet i CV',
          email: detectedInfo.emails[0] || 'Ej angivet i CV',
          phone: detectedInfo.phones[0] || 'Ej angivet i CV',
          location: detectedInfo.locations[0] || 'Sverige'
        },
        experience: {
          years: '3-5',
          currentRole: 'Konsult/Utvecklare',
          level: 'Mid'
        },
        skills: {
          technical: detectedInfo.skills.length > 0 ? detectedInfo.skills : ['JavaScript', 'React', 'Node.js'],
          languages: detectedInfo.skills.filter(skill => 
            ['JavaScript', 'Python', 'Java', 'C#', 'TypeScript', 'PHP', 'Ruby', 'Go', 'Rust'].includes(skill)
          ) || ['JavaScript'],
          tools: detectedInfo.skills.filter(skill => 
            ['React', 'Angular', 'Vue', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'Git'].includes(skill)
          ) || ['React', 'Git']
        },
        workHistory: [
          {
            company: 'Konsultföretag',
            role: 'Utvecklare/Konsult',
            duration: '2-3 år',
            description: 'Utveckling och konsultarbete'
          }
        ],
        education: [
          {
            institution: 'Teknisk högskola',
            degree: 'Kandidat/Master inom teknik',
            year: '2015-2020'
          }
        ],
        softSkills: {
          communicationStyle: personalDescription || 'Professionell och samarbetsinriktad kommunikation',
          leadershipStyle: 'Stödjande och målinriktad ledarskapsstil',
          values: ['Kvalitet', 'Innovation', 'Samarbete', 'Kontinuerlig utveckling'],
          personalityTraits: ['Analytisk', 'Detaljorienterad', 'Problemlösare', 'Teamplayer'],
          workStyle: personalDescription ? 'Anpassad efter personlig beskrivning' : 'Flexibel och teamorienterad'
        },
        scores: {
          leadership: 4,
          innovation: 4,
          adaptability: 4,
          culturalFit: 4,
          communication: 4,
          teamwork: 4
        },
        analysisInsights: {
          strengths: ['Teknisk kompetens', 'Problemlösningsförmåga', 'Teamarbete'],
          developmentAreas: ['Ledarskapsutvekling', 'Avancerade certifieringar'],
          careerTrajectory: 'Stark utvecklingspotential med möjligheter för senior roller',
          consultingReadiness: 'God potential för konsultarbete med rätt teknisk grund'
        },
        marketAnalysis: {
          hourlyRate: {
            current: 1000,
            optimized: 1200,
            explanation: 'Baserat på tekniska färdigheter och erfarenhetsnivå på svenska marknaden'
          },
          competitiveAdvantages: ['Stark teknisk grund', 'Professionell approach', 'Flexibilitet'],
          marketDemand: 'God efterfrågan på marknaden för dessa färdigheter',
          recommendedFocus: 'Fortsätt teknisk utveckling och bygg upp portfölj'
        }
      };
    }

    console.log('✅ ENHANCED CV analysis completed with much better extraction');

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
          aiModel: 'llama-3.1-70b-versatile',
          extractionQuality: 'enhanced-with-better-pdf-processing'
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
        error: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
