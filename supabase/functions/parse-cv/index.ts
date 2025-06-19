
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
    console.log('🚀 Starting comprehensive CV parsing with enhanced extraction...');
    
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

    // 🔥 ADVANCED PDF TEXT EXTRACTION WITH MULTIPLE STRATEGIES
    let extractedText = '';
    let detectedInfo = {
      emails: [],
      phones: [],
      names: [],
      companies: [],
      skills: [],
      locations: [],
      years: [],
      urls: []
    };
    
    try {
      if (file.type === 'application/pdf') {
        console.log('📄 Processing PDF with advanced multi-layer extraction...');
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        
        // Strategy 1: Direct text decoding with multiple encodings
        const encodings = ['utf-8', 'latin1', 'ascii'];
        let rawTexts = [];
        
        for (const encoding of encodings) {
          try {
            const decoder = new TextDecoder(encoding, { ignoreBOM: true, fatal: false });
            const decoded = decoder.decode(uint8Array);
            rawTexts.push(decoded);
          } catch (e) {
            console.log(`⚠️ Failed to decode with ${encoding}`);
          }
        }
        
        // Combine all decoded texts
        const combinedRawText = rawTexts.join(' ');
        
        // Strategy 2: Advanced PDF content extraction patterns
        const advancedPatterns = {
          // Email patterns (multiple formats)
          emails: [
            /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}\b/g,
            /\b[a-zA-Z0-9]+[@][a-zA-Z0-9.-]+[.][a-zA-Z]{2,6}\b/g,
            /(?:email|e-mail|mail)[:]\s*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})/gi
          ],
          
          // Phone patterns (international and Swedish formats)
          phones: [
            /\+46[\s-]?[0-9]{1,3}[\s-]?[0-9]{3}[\s-]?[0-9]{2,4}/g,
            /0[0-9]{1,3}[\s-]?[0-9]{3}[\s-]?[0-9]{2,4}/g,
            /(?:tel|phone|telefon|mobil)[:]\s*([\+0-9\s\-\(\)]{8,20})/gi,
            /[\+]?[\d\s\-\(\)]{8,15}/g
          ],
          
          // Name patterns (Swedish and international)
          names: [
            /\b[A-ZÅÄÖÜ][a-zåäöüé]+\s+[A-ZÅÄÖÜ][a-zåäöüé]+(?:\s+[A-ZÅÄÖÜ][a-zåäöüé]+)?\b/g,
            /(?:name|namn|heter)[:]\s*([A-ZÅÄÖÜ][a-zåäöüé\s]+)/gi,
            /\b[A-ZÅÄÖÜ]{2,}\s+[A-ZÅÄÖÜ]{2,}\b/g
          ],
          
          // Company patterns
          companies: [
            /\b[A-ZÅÄÖÜ][a-zåäöüé\s&]{2,30}(?:AB|Ltd|Inc|Corp|AS|Oy|GmbH|Group|Solutions|Tech|Consulting|Development)\b/g,
            /(?:company|företag|arbetsgivare)[:]\s*([A-ZÅÄÖÜ][a-zåäöüé\s&]{2,40})/gi
          ],
          
          // Technical skills (comprehensive list)
          skills: [
            /\b(JavaScript|TypeScript|Python|Java|C#|C\+\+|PHP|Ruby|Go|Rust|Swift|Kotlin|Scala|HTML|CSS|React|Angular|Vue|Node\.js|Express|Django|Flask|Spring|Laravel|ASP\.NET|Docker|Kubernetes|AWS|Azure|GCP|Git|Linux|Windows|MacOS|SQL|MySQL|PostgreSQL|MongoDB|Redis|Elasticsearch|GraphQL|REST|API|Microservices|DevOps|CI\/CD|Jenkins|GitLab|GitHub|Jira|Confluence|Scrum|Agile|TDD|BDD|Machine Learning|AI|Data Science|Analytics|Tableau|Power BI|Figma|Adobe|Photoshop|Sketch|InVision|UX|UI|Frontend|Backend|Fullstack|Mobile|iOS|Android|Flutter|React Native|Xamarin|Unity|Game Development|Blockchain|Cryptocurrency|IoT|Embedded|Firmware|Networking|Security|Penetration Testing|Ethical Hacking|Cloud Computing|Big Data|Hadoop|Spark|Kafka|RabbitMQ|MQTT|WebSockets|WebRTC|Progressive Web Apps|PWA|Single Page Applications|SPA|Server Side Rendering|SSR|Static Site Generation|SSG|Content Management Systems|CMS|WordPress|Drupal|E-commerce|Shopify|Magento|WooCommerce|Payment Processing|Stripe|PayPal|Digital Marketing|SEO|SEM|Google Analytics|Social Media|Email Marketing|A\/B Testing|Conversion Optimization|Project Management|Product Management|Business Analysis|Requirements Gathering|Stakeholder Management|Change Management|Process Improvement|Quality Assurance|Testing|Automation|Manual Testing|Load Testing|Performance Testing|Database Design|Data Modeling|ETL|Data Warehousing|Business Intelligence|Reporting|Dashboards|Visualization|Statistical Analysis|R|MATLAB|SPSS|Excel|VBA|Macros|Microsoft Office|Google Workspace|Salesforce|CRM|ERP|SAP|Oracle|ServiceNow|ITIL|Infrastructure|Monitoring|Logging|Observability|Prometheus|Grafana|ELK Stack|Splunk|New Relic|Datadog)\b/gi
          ],
          
          // Location patterns (Swedish cities and international)
          locations: [
            /\b(Stockholm|Göteborg|Malmö|Uppsala|Linköping|Örebro|Helsingborg|Jönköping|Norrköping|Lund|Umeå|Gävle|Borås|Eskilstuna|Södertälje|Karlstad|Täby|Sundsvall|Växjö|Halmstad|Kristianstad|Karlskrona|Falun|Sandviken|Skövde|Uddevalla|Trollhättan|Östersund|Borlänge|Tumba|Lidingö|Märsta|Upplands Väsby|Vallentuna|Nacka|Danderyd|Sollentuna|Huddinge|Haninge|Tyresö|Värmdö|Norrtälje|Sigtuna|Sweden|Sverige|Denmark|Norge|Finland|London|Berlin|Amsterdam|Copenhagen|Oslo|Helsinki|Paris|Madrid|Barcelona|Rome|Milan|Zurich|Geneva|Vienna|Prague|Budapest|Warsaw|Krakow|New York|San Francisco|Los Angeles|Chicago|Boston|Toronto|Vancouver|Montreal|Sydney|Melbourne|Brisbane|Tokyo|Singapore|Hong Kong|Dubai|Mumbai|Bangalore|Remote|Distans|Hemarbete)\b/gi,
            /(?:location|plats|bor|address|adress)[:]\s*([A-ZÅÄÖÜ][a-zåäöüé\s,]+)/gi
          ],
          
          // Experience years
          years: [
            /\b(\d{1,2})\s*(?:år|year|years)\s*(?:experience|erfarenhet|experience)/gi,
            /(?:experience|erfarenhet)[:]\s*(\d{1,2})\s*(?:år|year|years)/gi,
            /\b(19|20)\d{2}\b/g
          ],
          
          // URLs and social media
          urls: [
            /https?:\/\/[^\s]+/g,
            /linkedin\.com\/in\/[^\s]+/gi,
            /github\.com\/[^\s]+/gi,
            /twitter\.com\/[^\s]+/gi
          ]
        };

        // Extract information using advanced patterns
        console.log('🔍 Extracting structured information...');
        
        for (const [category, patterns] of Object.entries(advancedPatterns)) {
          const categoryMatches = new Set();
          
          patterns.forEach(pattern => {
            const matches = combinedRawText.match(pattern) || [];
            matches.forEach(match => {
              const cleaned = match.trim().replace(/[^\w@.+\-\s]/g, ' ').trim();
              if (cleaned.length > 1) {
                categoryMatches.add(cleaned);
              }
            });
          });
          
          detectedInfo[category] = Array.from(categoryMatches).slice(0, 10); // Limit to 10 per category
          console.log(`📊 Found ${detectedInfo[category].length} ${category}:`, detectedInfo[category].slice(0, 3));
        }

        // Strategy 3: PDF-specific content extraction
        const pdfContentPatterns = [
          /stream\s*([\s\S]*?)\s*endstream/g,
          /\d+\s+0\s+obj\s*([\s\S]*?)\s*endobj/g,
          /BT\s*([\s\S]*?)\s*ET/g, // Text objects in PDF
          /\((.*?)\)/g // Text in parentheses
        ];

        let pdfSpecificContent = '';
        pdfContentPatterns.forEach(pattern => {
          const matches = combinedRawText.match(pattern) || [];
          pdfSpecificContent += matches.join(' ') + ' ';
        });

        // Combine all extracted text
        extractedText = [
          combinedRawText,
          pdfSpecificContent,
          Object.values(detectedInfo).flat().join(' ')
        ].join(' \n--- \n');

        console.log('📄 Total extracted content length:', extractedText.length);
        console.log('📊 Detection summary:', {
          emails: detectedInfo.emails.length,
          phones: detectedInfo.phones.length,
          names: detectedInfo.names.length,
          companies: detectedInfo.companies.length,
          skills: detectedInfo.skills.length,
          locations: detectedInfo.locations.length
        });
        
      } else {
        // For non-PDF files, read as text
        extractedText = await file.text();
        console.log('📄 Read text file content length:', extractedText.length);
      }
    } catch (error) {
      console.warn('⚠️ Content extraction failed:', error);
      extractedText = `CV file: ${file.name} (${file.type}) - Advanced extraction failed, using basic analysis`;
    }

    // 🔥 ENHANCED AI PROMPT WITH DETECTED INFORMATION
    const detectedInfoSummary = Object.entries(detectedInfo)
      .map(([key, values]) => `${key.toUpperCase()}: ${values.join(', ')}`)
      .join('\n');

    const prompt = `Du är en expert CV-analytiker med avancerade informationsextraktionsförmågor. Din uppgift är att analysera CV-innehållet och extrahera VERKLIG, KORREKT information.

CV-FIL: ${file.name}
DETEKTERAD INFORMATION FRÅN INITIAL SCANNING:
${detectedInfoSummary}

HUVUDINNEHÅLL ATT ANALYSERA:
${extractedText.substring(0, 15000)}

KRITISKA INSTRUKTIONER:
1. ✅ EXTRAHERA ENDAST VERKLIG INFORMATION som du tydligt kan se i innehållet
2. ✅ PRIORITERA den detekterade informationen ovan - använd den först
3. ✅ Sök systematiskt efter personuppgifter, erfarenhet och färdigheter
4. ✅ Beräkna erfarenhetsår från arbetsdatum (t.ex. 2019-2023 = 4 år)
5. ✅ Om information inte finns, använd "Not specified" - LJUG ALDRIG
6. ✅ Extrahera specifika teknologier, verktyg och certifieringar som nämns

EXEMPEL PÅ KORREKT EXTRAKTION:
- Namn: Om du ser "Anna Andersson" → extrahera "Anna Andersson"
- Email: Om du ser "anna@company.com" → extrahera "anna@company.com"  
- Telefon: Om du ser "+46 70 123 4567" → extrahera "+46 70 123 4567"
- Erfarenhet: Om du ser "Senior Developer 2019-2023" → beräkna 4 års erfarenhet
- Färdigheter: Om du ser "React, TypeScript, Node.js" → lägg till dessa exakt

SVARA MED DETTA EXAKTA JSON-FORMAT (ingen ytterligare text):

{
  "personalInfo": {
    "name": "Extrahera fullständigt namn eller 'Not specified'",
    "email": "Extrahera e-postadress eller 'Not specified'",
    "phone": "Extrahera telefonnummer eller 'Not specified'",
    "location": "Extrahera stad/plats eller 'Not specified'",
    "linkedinProfile": "Extrahera LinkedIn-URL eller 'Not specified'"
  },
  "professionalSummary": {
    "yearsOfExperience": "Beräkna från arbetsdatum eller 'Not specified'",
    "currentRole": "Extrahera senaste jobbtitel eller 'Not specified'",
    "seniorityLevel": "Junior/Mid-level/Senior/Expert baserat på erfarenhet",
    "careerTrajectory": "Växande/Stabil/Senior baserat på utveckling",
    "industryFocus": "Extrahera primär bransch eller 'Not specified'",
    "specializations": ["Lista verkliga specialiseringar"]
  },
  "technicalExpertise": {
    "programmingLanguages": {
      "expert": ["Språk med 5+ år eller expert-nivå"],
      "proficient": ["Språk med 2-4 år eller skicklig nivå"],
      "familiar": ["Språk med <2 år eller grundläggande"]
    },
    "frameworks": ["Extrahera alla ramverk som nämns"],
    "tools": ["Extrahera verktyg och mjukvara"],
    "databases": ["Extrahera databasteknologier"],
    "cloudPlatforms": ["Extrahera molnplattformar"],
    "methodologies": ["Extrahera metoder som Agile, Scrum"]
  },
  "workExperience": [
    {
      "company": "Verkligt företagsnamn",
      "role": "Verklig jobbtitel",
      "duration": "Verklig tidsperiod",
      "technologies": ["Teknologier för denna roll"],
      "achievements": ["Specifika prestationer"]
    }
  ],
  "education": {
    "degrees": ["Utbildningskvalifikationer"],
    "certifications": ["Professionella certifieringar"]
  },
  "marketPositioning": {
    "hourlyRateEstimate": {
      "min": 800,
      "max": 1200,
      "recommended": 1000,
      "currency": "SEK",
      "explanation": "Baserat på erfarenhet och färdigheter"
    }
  },
  "languages": ["Extrahera språk med kunskapsnivåer"]
}

VIKTIGT: Använd ENDAST verklig information från CV-innehållet. Använd "Not specified" för saknad data.
SVARA MED ENDAST JSON - INGEN YTTERLIGARE TEXT.`;

    console.log('🤖 Sending enhanced CV content to GROQ for comprehensive analysis');

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
            content: 'Du är en expert CV-analytiker som extraherar verklig information från CV-innehåll. Du använder endast information som tydligt finns i texten och svarar med korrekt JSON-format.'
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
    console.log('✅ GROQ comprehensive analysis response received');

    let analysis;
    try {
      const content = groqData.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content in GROQ response');
      }

      // Enhanced JSON extraction
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
        console.log('📊 Successfully parsed comprehensive CV analysis');
        console.log('📋 Extracted comprehensive data:', {
          personalInfo: analysis.personalInfo,
          hasRealName: analysis.personalInfo?.name !== 'Not specified',
          hasRealEmail: analysis.personalInfo?.email !== 'Not specified',
          hasRealPhone: analysis.personalInfo?.phone !== 'Not specified',
          technicalSkillsCount: (analysis.technicalExpertise?.programmingLanguages?.expert?.length || 0) + 
                               (analysis.technicalExpertise?.programmingLanguages?.proficient?.length || 0),
          workExperienceCount: analysis.workExperience?.length || 0,
          detectedEmails: detectedInfo.emails.length,
          detectedPhones: detectedInfo.phones.length,
          detectedNames: detectedInfo.names.length
        });
      } else {
        throw new Error('No valid JSON found in response');
      }
    } catch (parseError) {
      console.error('❌ Failed to parse GROQ response:', parseError);
      console.log('Raw GROQ response:', groqData.choices[0]?.message?.content);
      
      // Enhanced fallback with detected information
      analysis = {
        personalInfo: {
          name: detectedInfo.names[0] || 'Not specified',
          email: detectedInfo.emails[0] || 'Not specified',
          phone: detectedInfo.phones[0] || 'Not specified',
          location: detectedInfo.locations[0] || 'Not specified',
          linkedinProfile: detectedInfo.urls.find(url => url.includes('linkedin')) || 'Not specified'
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
          programmingLanguages: { 
            expert: detectedInfo.skills.slice(0, 3), 
            proficient: detectedInfo.skills.slice(3, 8), 
            familiar: detectedInfo.skills.slice(8, 12) 
          },
          frameworks: [],
          tools: [],
          databases: [],
          cloudPlatforms: [],
          methodologies: []
        },
        workExperience: detectedInfo.companies.slice(0, 3).map(company => ({
          company: company,
          role: 'Not specified',
          duration: 'Not specified',
          technologies: [],
          achievements: []
        })),
        education: { degrees: [], certifications: [] },
        marketPositioning: {
          hourlyRateEstimate: {
            min: 800,
            max: 1200,
            recommended: 1000,
            currency: 'SEK',
            explanation: 'Baserat på svenska konsultmarknaden.'
          }
        },
        languages: ['Swedish', 'English']
      };
      
      console.log('📊 Using enhanced fallback with detected information:', {
        detectedEmails: detectedInfo.emails.length,
        detectedPhones: detectedInfo.phones.length,
        detectedNames: detectedInfo.names.length,
        detectedSkills: detectedInfo.skills.length
      });
    }

    // Create enhanced analysis results
    const enhancedAnalysisResults = {
      cvAnalysis: analysis,
      linkedinAnalysis: null,
      detectedInformation: detectedInfo,
      extractionStats: {
        totalTextLength: extractedText.length,
        emailsFound: detectedInfo.emails.length,
        phonesFound: detectedInfo.phones.length,
        namesFound: detectedInfo.names.length,
        skillsFound: detectedInfo.skills.length,
        companiesFound: detectedInfo.companies.length,
        locationsFound: detectedInfo.locations.length
      }
    };

    console.log('✅ Enhanced CV analysis completed with comprehensive extraction');
    console.log('📊 Final extraction stats:', enhancedAnalysisResults.extractionStats);

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
    
    // Enhanced fallback for errors
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
          min: 800,
          max: 1200,
          recommended: 1000,
          currency: 'SEK',
          explanation: 'Baserat på svenska konsultmarknaden.'
        }
      },
      languages: ['Swedish', 'English']
    };

    const fallbackEnhancedResults = {
      cvAnalysis: fallbackAnalysis,
      linkedinAnalysis: null,
      detectedInformation: {
        emails: [],
        phones: [],
        names: [],
        companies: [],
        skills: [],
        locations: [],
        years: [],
        urls: []
      },
      extractionStats: {
        totalTextLength: 0,
        emailsFound: 0,
        phonesFound: 0,
        namesFound: 0,
        skillsFound: 0,
        companiesFound: 0,
        locationsFound: 0
      }
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
