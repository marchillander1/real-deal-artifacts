
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
    console.log('🚀 Starting CV parsing...');
    
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

    // Enhanced information extraction
    let extractedText = '';
    let detectedInfo = {
      emails: [],
      phones: [],
      names: [],
      companies: [],
      skills: [],
      locations: []
    };
    
    try {
      if (file.type === 'application/pdf') {
        console.log('📄 Processing PDF...');
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        
        // Try multiple encodings for better text extraction
        const encodings = ['utf-8', 'latin1'];
        let bestText = '';
        
        for (const encoding of encodings) {
          try {
            const decoder = new TextDecoder(encoding, { ignoreBOM: true, fatal: false });
            const decoded = decoder.decode(uint8Array);
            if (decoded.length > bestText.length && decoded.length < 100000) {
              bestText = decoded;
            }
          } catch (e) {
            console.log(`⚠️ Failed to decode with ${encoding}`);
          }
        }
        
        // Enhanced patterns for Swedish/English CVs
        const patterns = {
          emails: [
            /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}\b/g,
            /(?:email|e-mail|mail|Email|E-mail)[:=\s]*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})/gi
          ],
          phones: [
            /\+46[\s-]?[0-9]{2,3}[\s-]?[0-9]{3}[\s-]?[0-9]{2,4}/g,
            /0[0-9]{2,3}[\s-]?[0-9]{3}[\s-]?[0-9]{2,4}/g,
            /(?:tel|phone|telefon|mobil|Phone|Tel)[:=\s]*([\+0-9\s\-\(\)]{8,20})/gi
          ],
          names: [
            /\b[A-ZÅÄÖÜ][a-zåäöüé]+\s+[A-ZÅÄÖÜ][a-zåäöüé]+(?:\s+[A-ZÅÄÖÜ][a-zåäöüé]+)?\b/g,
            /(?:name|namn|Name|NAMN)[:=\s]*([A-ZÅÄÖÜ][a-zåäöüé\s]{3,40})/gi
          ],
          companies: [
            /\b[A-ZÅÄÖÜ][a-zåäöüé\s&]{2,30}(?:AB|Ltd|Inc|Corp|AS|Oy|GmbH|Group|Solutions|Tech|Consulting|Development)\b/g
          ],
          skills: [
            /\b(JavaScript|TypeScript|Python|Java|C#|React|Angular|Vue|Node\.js|SQL|HTML|CSS|Git|Docker|AWS|Azure|Kubernetes|PHP|Ruby|Go|Swift|Kotlin|MongoDB|PostgreSQL|MySQL|Linux|Windows|Agile|Scrum|API|REST|GraphQL|Machine Learning|AI|Data Science|UX|UI|Frontend|Backend|Fullstack|DevOps|CI\/CD|Jenkins|GitHub|Jira|Figma|Adobe|Analytics|Excel|Project Management|Leadership|Communication|Problem Solving|Team Work|Analytical|Creative|Strategic)\b/gi
          ],
          locations: [
            /\b(Stockholm|Göteborg|Malmö|Uppsala|Linköping|London|Berlin|Amsterdam|Copenhagen|Oslo|Helsinki|New York|San Francisco|Remote|Sweden|Sverige|Denmark|Norge|Finland)\b/gi
          ]
        };

        // Extract information
        console.log('🔍 Extracting information...');
        
        for (const [category, patternList] of Object.entries(patterns)) {
          const categoryMatches = new Set();
          
          patternList.forEach(pattern => {
            const matches = bestText.match(pattern) || [];
            matches.forEach(match => {
              const cleaned = match.trim().replace(/[^\w@.+\-\s]/g, ' ').trim();
              if (cleaned.length > 1 && cleaned.length < 100) {
                categoryMatches.add(cleaned);
              }
            });
          });
          
          detectedInfo[category] = Array.from(categoryMatches).slice(0, 5);
          console.log(`📊 Found ${detectedInfo[category].length} ${category}:`, detectedInfo[category].slice(0, 2));
        }

        // Create focused content for AI - MUCH SHORTER
        extractedText = [
          `CV: ${file.name}`,
          `Emails: ${detectedInfo.emails.join(', ')}`,
          `Phones: ${detectedInfo.phones.join(', ')}`,
          `Names: ${detectedInfo.names.join(', ')}`,
          `Companies: ${detectedInfo.companies.join(', ')}`,
          `Skills: ${detectedInfo.skills.join(', ')}`,
          `Locations: ${detectedInfo.locations.join(', ')}`,
          `Text: ${bestText.substring(0, 3000)}`
        ].join('\n');
        
      } else {
        const rawText = await file.text();
        extractedText = rawText.substring(0, 5000);
      }
    } catch (error) {
      console.warn('⚠️ Content extraction failed:', error);
      extractedText = `CV file: ${file.name} - Extraction failed`;
    }

    // MUCH SHORTER AI PROMPT
    const prompt = `Analyze this CV and extract real information only. Use "Not specified" if not found.

${extractedText}

Return ONLY this JSON:

{
  "personalInfo": {
    "name": "Real name or 'Not specified'",
    "email": "Real email or 'Not specified'",
    "phone": "Real phone or 'Not specified'",
    "location": "Real location or 'Not specified'"
  },
  "professionalSummary": {
    "yearsOfExperience": "Calculate years or 'Not specified'",
    "currentRole": "Latest role or 'Not specified'",
    "seniorityLevel": "Junior/Mid-level/Senior/Expert or 'Not specified'",
    "industryFocus": "Main industry or 'Not specified'"
  },
  "technicalExpertise": {
    "programmingLanguages": {
      "expert": ["Languages with 5+ years"],
      "proficient": ["Languages with 2-4 years"],
      "familiar": ["Languages with <2 years"]
    },
    "frameworks": ["Real frameworks mentioned"],
    "tools": ["Real tools mentioned"],
    "databases": ["Real databases mentioned"]
  },
  "workExperience": [
    {
      "company": "Real company",
      "role": "Real role",
      "duration": "Real duration",
      "technologies": ["Tech used"],
      "achievements": ["Real achievements"]
    }
  ],
  "education": {
    "degrees": ["Real degrees"],
    "certifications": ["Real certifications"]
  },
  "marketPositioning": {
    "hourlyRateEstimate": {
      "min": 800,
      "max": 1200,
      "recommended": 1000,
      "currency": "SEK"
    }
  }
}`;

    console.log('🤖 Sending to GROQ, prompt length:', prompt.length);

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
            content: 'Extract CV information and respond with valid JSON only.'
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

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.error('❌ GROQ API error:', errorText);
      throw new Error(`GROQ API failed: ${groqResponse.status}`);
    }

    const groqData = await groqResponse.json();
    console.log('✅ GROQ response received');

    let analysis;
    try {
      const content = groqData.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content in response');
      }

      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
        console.log('📊 Parsed CV analysis successfully');
      } else {
        throw new Error('No JSON found');
      }
    } catch (parseError) {
      console.error('❌ Parse error:', parseError);
      
      // Enhanced fallback with detected information
      analysis = {
        personalInfo: {
          name: detectedInfo.names.find(n => n && n.length > 2 && !n.includes('If Gt')) || 'Not specified',
          email: detectedInfo.emails.find(e => e && e.includes('@') && e.includes('.')) || 'Not specified',
          phone: detectedInfo.phones.find(p => p && p.length > 5 && !p.includes('0000000000')) || 'Not specified',
          location: detectedInfo.locations[0] || 'Not specified'
        },
        professionalSummary: {
          yearsOfExperience: 'Not specified',
          currentRole: 'Not specified',
          seniorityLevel: 'Not specified',
          industryFocus: 'Not specified'
        },
        technicalExpertise: {
          programmingLanguages: { 
            expert: detectedInfo.skills.slice(0, 2), 
            proficient: detectedInfo.skills.slice(2, 4), 
            familiar: detectedInfo.skills.slice(4, 6) 
          },
          frameworks: [],
          tools: [],
          databases: []
        },
        workExperience: detectedInfo.companies.slice(0, 2).map(company => ({
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
            currency: 'SEK'
          }
        }
      };
      
      console.log('📊 Using fallback with detected info');
    }

    const enhancedAnalysisResults = {
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

    console.log('✅ CV analysis completed');

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
    
    const fallbackAnalysis = {
      personalInfo: {
        name: 'Not specified',
        email: 'Not specified',
        phone: 'Not specified',
        location: 'Not specified'
      },
      professionalSummary: {
        yearsOfExperience: 'Not specified',
        currentRole: 'Not specified',
        seniorityLevel: 'Not specified',
        industryFocus: 'Not specified'
      },
      technicalExpertise: {
        programmingLanguages: { expert: [], proficient: [], familiar: [] },
        frameworks: [],
        tools: [],
        databases: []
      },
      workExperience: [],
      education: { degrees: [], certifications: [] },
      marketPositioning: {
        hourlyRateEstimate: {
          min: 800,
          max: 1200,
          recommended: 1000,
          currency: 'SEK'
        }
      }
    };

    const fallbackEnhanced = {
      detectedInformation: {
        emails: [],
        phones: [],
        names: [],
        companies: [],
        skills: [],
        locations: []
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
        enhancedAnalysisResults: fallbackEnhanced,
        fallback: true,
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
