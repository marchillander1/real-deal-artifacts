
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

    // Improved text extraction for PDF files
    let extractedText = '';
    
    try {
      if (file.type === 'application/pdf') {
        console.log('📄 Processing PDF - extracting text with improved method...');
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        
        // More sophisticated text extraction
        let rawText = '';
        let currentWord = '';
        
        for (let i = 0; i < Math.min(uint8Array.length, 100000); i++) {
          const byte = uint8Array[i];
          
          if (byte >= 32 && byte <= 126) { // Printable ASCII
            currentWord += String.fromCharCode(byte);
          } else if (byte === 10 || byte === 13 || byte === 32) { // Whitespace
            if (currentWord.length > 0) {
              rawText += currentWord + ' ';
              currentWord = '';
            }
          }
        }
        
        // Add final word
        if (currentWord.length > 0) {
          rawText += currentWord;
        }
        
        // Clean and filter meaningful text
        const words = rawText.split(/\s+/)
          .filter(word => 
            word.length >= 2 && 
            word.length <= 50 &&
            /^[a-zA-Z0-9@.\-+()åäöÅÄÖ]+$/.test(word)
          );
        
        extractedText = words.join(' ').substring(0, 6000);
        console.log('📄 Extracted meaningful text length:', extractedText.length);
        console.log('📄 Sample text:', extractedText.substring(0, 200));
        
      } else {
        // For other file types, try to read as text
        extractedText = await file.text();
        extractedText = extractedText.substring(0, 6000);
      }
    } catch (error) {
      console.warn('⚠️ Content extraction failed:', error);
      extractedText = `CV file: ${file.name} - Unable to extract content`;
    }

    console.log('🤖 Sending to AI for analysis...');

    // Improved and focused prompt for better extraction
    const prompt = `Analyze this CV text and extract specific information. Return ONLY valid JSON.

CV TEXT:
${extractedText}

Extract information and return this EXACT JSON structure with real data:

{
  "personalInfo": {
    "name": "FIND FULL NAME - look for person's name",
    "email": "FIND EMAIL - look for @ symbol", 
    "phone": "FIND PHONE - look for numbers like +46, 07, phone patterns",
    "location": "FIND LOCATION - look for city, address, Sweden, Stockholm etc"
  },
  "professionalSummary": {
    "yearsOfExperience": "CALCULATE YEARS - look at work history dates",
    "currentRole": "FIND LATEST JOB TITLE",
    "seniorityLevel": "DETERMINE: Junior/Mid-level/Senior/Expert based on experience",
    "industryFocus": "IDENTIFY MAIN INDUSTRY - IT, Tech, Finance etc"
  },
  "technicalExpertise": {
    "programmingLanguages": {
      "expert": ["FIND MAIN LANGUAGES - Python, Java, C# etc"],
      "proficient": ["FIND SECONDARY LANGUAGES"], 
      "familiar": ["FIND MENTIONED LANGUAGES"]
    },
    "frameworks": ["FIND FRAMEWORKS - React, Angular, Spring etc"],
    "tools": ["FIND TOOLS - Docker, Git, AWS etc"],
    "databases": ["FIND DATABASES - MySQL, PostgreSQL etc"]
  },
  "workExperience": [
    {
      "company": "FIND COMPANY NAME",
      "role": "FIND JOB TITLE", 
      "duration": "FIND TIME PERIOD",
      "technologies": ["FIND TECH USED"],
      "achievements": ["FIND KEY ACCOMPLISHMENTS"]
    }
  ],
  "education": {
    "degrees": ["FIND UNIVERSITY DEGREES"],
    "certifications": ["FIND CERTIFICATIONS"]
  },
  "marketPositioning": {
    "hourlyRateEstimate": {
      "min": 800,
      "max": 1500, 
      "recommended": 1200,
      "currency": "SEK"
    }
  }
}

IMPORTANT: 
- Look carefully for names, emails, phone numbers in the text
- If you can't find something, put "Not specified" 
- Focus on extracting REAL data from the CV text
- Make sure ALL fields have values, not empty strings`;

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
            content: 'You are a CV analysis expert. Extract real information from CV text. Always respond with valid JSON only. If information is missing, use "Not specified".'
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

      console.log('🔍 Raw AI response:', content);

      // Extract JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
        console.log('📊 Successfully parsed CV analysis:', JSON.stringify(analysis, null, 2));
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('❌ Parse error, creating structured fallback:', parseError);
      
      // Create fallback with some basic extracted info if possible
      const emailMatch = extractedText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
      const phoneMatch = extractedText.match(/(\+46|0)[0-9\s\-]{8,15}/);
      
      analysis = {
        personalInfo: {
          name: 'Not specified',
          email: emailMatch ? emailMatch[0] : 'Not specified', 
          phone: phoneMatch ? phoneMatch[0] : 'Not specified',
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
    }

    console.log('✅ CV analysis completed successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        analysis: analysis,
        extractedText: extractedText.substring(0, 500), // For debugging
        debugInfo: {
          textLength: extractedText.length,
          hasEmailInText: extractedText.includes('@'),
          hasPhonePattern: /(\+46|07|08)/.test(extractedText)
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('❌ CV parsing error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        fallback: true
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
