
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
    console.log('🚀 Starting optimized CV parsing with size limits...');
    
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

    // 🔥 OPTIMIZED PDF TEXT EXTRACTION WITH SIZE LIMITS
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
        console.log('📄 Processing PDF with optimized extraction...');
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        
        // Strategy 1: Smart text extraction with multiple encodings
        const encodings = ['utf-8', 'latin1'];
        let bestText = '';
        
        for (const encoding of encodings) {
          try {
            const decoder = new TextDecoder(encoding, { ignoreBOM: true, fatal: false });
            const decoded = decoder.decode(uint8Array);
            if (decoded.length > bestText.length && decoded.length < 500000) { // Limit to 500k chars
              bestText = decoded;
            }
          } catch (e) {
            console.log(`⚠️ Failed to decode with ${encoding}`);
          }
        }
        
        // Strategy 2: Enhanced information extraction patterns
        const advancedPatterns = {
          // Email patterns - more comprehensive
          emails: [
            /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}\b/g,
            /(?:email|e-mail|mail|Email|E-mail)[:|\s]*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})/gi
          ],
          
          // Phone patterns - Swedish and international
          phones: [
            /\+46[\s-]?[0-9]{2,3}[\s-]?[0-9]{3}[\s-]?[0-9]{2,4}/g,
            /0[0-9]{2,3}[\s-]?[0-9]{3}[\s-]?[0-9]{2,4}/g,
            /(?:tel|phone|telefon|mobil|Phone|Tel)[:|\s]*([\+0-9\s\-\(\)]{8,20})/gi
          ],
          
          // Name patterns - better detection
          names: [
            /\b[A-ZÅÄÖÜ][a-zåäöüé]+\s+[A-ZÅÄÖÜ][a-zåäöüé]+(?:\s+[A-ZÅÄÖÜ][a-zåäöüé]+)?\b/g,
            /(?:name|namn|Name|NAMN)[:|\s]*([A-ZÅÄÖÜ][a-zåäöüé\s]{3,40})/gi
          ],
          
          // Company patterns
          companies: [
            /\b[A-ZÅÄÖÜ][a-zåäöüé\s&]{2,30}(?:AB|Ltd|Inc|Corp|AS|Oy|GmbH|Group|Solutions|Tech|Consulting|Development)\b/g
          ],
          
          // Skills - focused on common tech skills
          skills: [
            /\b(JavaScript|TypeScript|Python|Java|C#|React|Angular|Vue|Node\.js|SQL|HTML|CSS|Git|Docker|AWS|Azure|Kubernetes|PHP|Ruby|Go|Swift|Kotlin|MongoDB|PostgreSQL|MySQL|Linux|Windows|Agile|Scrum|API|REST|GraphQL|Machine Learning|AI|Data Science|UX|UI|Frontend|Backend|Fullstack|DevOps|CI\/CD|Jenkins|GitHub|Jira|Figma|Adobe|Analytics|Excel|Project Management|Leadership|Communication|Problem Solving|Team Work|Analytical|Creative|Strategic)\b/gi
          ],
          
          // Locations - focused on major cities
          locations: [
            /\b(Stockholm|Göteborg|Malmö|Uppsala|Linköping|London|Berlin|Amsterdam|Copenhagen|Oslo|Helsinki|New York|San Francisco|Remote|Sweden|Sverige|Denmark|Norge|Finland)\b/gi
          ]
        };

        // Extract information using optimized patterns
        console.log('🔍 Extracting structured information from text...');
        
        for (const [category, patterns] of Object.entries(advancedPatterns)) {
          const categoryMatches = new Set();
          
          patterns.forEach(pattern => {
            const matches = bestText.match(pattern) || [];
            matches.forEach(match => {
              const cleaned = match.trim().replace(/[^\w@.+\-\s]/g, ' ').trim();
              if (cleaned.length > 1 && cleaned.length < 100) {
                categoryMatches.add(cleaned);
              }
            });
          });
          
          detectedInfo[category] = Array.from(categoryMatches).slice(0, 5); // Limit to 5 per category
          console.log(`📊 Found ${detectedInfo[category].length} ${category}:`, detectedInfo[category].slice(0, 2));
        }

        // Create focused content for AI analysis - MUCH SMALLER
        const focusedContent = [
          `CV FILE: ${file.name}`,
          `DETECTED EMAILS: ${detectedInfo.emails.join(', ')}`,
          `DETECTED PHONES: ${detectedInfo.phones.join(', ')}`,
          `DETECTED NAMES: ${detectedInfo.names.join(', ')}`,
          `DETECTED COMPANIES: ${detectedInfo.companies.join(', ')}`,
          `DETECTED SKILLS: ${detectedInfo.skills.join(', ')}`,
          `DETECTED LOCATIONS: ${detectedInfo.locations.join(', ')}`,
          `RELEVANT TEXT EXCERPT:`,
          bestText.substring(0, 8000) // Only first 8k characters
        ].join('\n');

        extractedText = focusedContent;
        console.log('📄 Optimized content length for AI:', extractedText.length);
        
      } else {
        // For non-PDF files, read as text with size limit
        const rawText = await file.text();
        extractedText = rawText.substring(0, 10000); // Limit text files to 10k chars
        console.log('📄 Read text file content length:', extractedText.length);
      }
    } catch (error) {
      console.warn('⚠️ Content extraction failed:', error);
      extractedText = `CV file: ${file.name} (${file.type}) - Extraction failed, using basic analysis`;
    }

    // 🔥 OPTIMIZED AI PROMPT - MUCH SHORTER AND MORE FOCUSED
    const prompt = `Analyze this CV and extract ONLY real, verified information. Use "Not specified" if information is not clearly present.

${extractedText}

CRITICAL: Extract ONLY information that is clearly visible. Do not invent or assume anything.

Respond with EXACTLY this JSON format (no other text):

{
  "personalInfo": {
    "name": "Extract full name or 'Not specified'",
    "email": "Extract email address or 'Not specified'",
    "phone": "Extract phone number or 'Not specified'",
    "location": "Extract city/location or 'Not specified'",
    "linkedinProfile": "Extract LinkedIn URL or 'Not specified'"
  },
  "professionalSummary": {
    "yearsOfExperience": "Calculate from work dates or 'Not specified'",
    "currentRole": "Extract latest job title or 'Not specified'",
    "seniorityLevel": "Junior/Mid-level/Senior/Expert or 'Not specified'",
    "careerTrajectory": "Growing/Stable/Senior or 'Not specified'",
    "industryFocus": "Extract primary industry or 'Not specified'",
    "specializations": ["List real specializations"]
  },
  "technicalExpertise": {
    "programmingLanguages": {
      "expert": ["Languages with 5+ years"],
      "proficient": ["Languages with 2-4 years"],
      "familiar": ["Languages with <2 years"]
    },
    "frameworks": ["Extract frameworks mentioned"],
    "tools": ["Extract tools and software"],
    "databases": ["Extract database technologies"],
    "cloudPlatforms": ["Extract cloud platforms"],
    "methodologies": ["Extract methodologies like Agile"]
  },
  "workExperience": [
    {
      "company": "Real company name",
      "role": "Real job title",
      "duration": "Real time period",
      "technologies": ["Technologies for this role"],
      "achievements": ["Specific achievements"]
    }
  ],
  "education": {
    "degrees": ["Educational qualifications"],
    "certifications": ["Professional certifications"]
  },
  "marketPositioning": {
    "hourlyRateEstimate": {
      "min": 800,
      "max": 1200,
      "recommended": 1000,
      "currency": "SEK",
      "explanation": "Based on experience and skills"
    }
  },
  "languages": ["Extract languages with proficiency"]
}`;

    console.log('🤖 Sending optimized CV content to GROQ for analysis');
    console.log('📊 Prompt length:', prompt.length);

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
            content: 'You are a CV analyzer that extracts real information from CV content and responds only with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 3000,
      }),
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.error('❌ GROQ API error:', errorText);
      throw new Error(`GROQ API request failed: ${groqResponse.status}`);
    }

    const groqData = await groqResponse.json();
    console.log('✅ GROQ analysis response received');

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
        console.log('📊 Successfully parsed CV analysis');
        console.log('📋 Extracted personal info:', {
          name: analysis.personalInfo?.name,
          email: analysis.personalInfo?.email,
          phone: analysis.personalInfo?.phone,
          location: analysis.personalInfo?.location
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
          specializations: detectedInfo.skills.slice(0, 3)
        },
        technicalExpertise: {
          programmingLanguages: { 
            expert: detectedInfo.skills.slice(0, 2), 
            proficient: detectedInfo.skills.slice(2, 5), 
            familiar: detectedInfo.skills.slice(5, 8) 
          },
          frameworks: [],
          tools: [],
          databases: [],
          cloudPlatforms: [],
          methodologies: []
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
            currency: 'SEK',
            explanation: 'Based on Swedish market rates'
          }
        },
        languages: ['Swedish', 'English']
      };
      
      console.log('📊 Using enhanced fallback with detected information');
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

    console.log('✅ Optimized CV analysis completed successfully');
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
          explanation: 'Based on Swedish market rates'
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
