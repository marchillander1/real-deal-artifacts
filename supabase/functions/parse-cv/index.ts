
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

    // Extract text with multiple approaches
    let extractedText = '';
    let personalInfo = {
      emails: [] as string[],
      phones: [] as string[],
      names: [] as string[]
    };
    
    try {
      if (file.type === 'application/pdf') {
        console.log('📄 Processing PDF...');
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        
        // Convert PDF bytes to readable text
        let textContent = '';
        let currentWord = '';
        
        for (let i = 0; i < uint8Array.length; i++) {
          const byte = uint8Array[i];
          
          // Focus on readable ASCII characters
          if (byte >= 32 && byte <= 126) {
            currentWord += String.fromCharCode(byte);
          } else if (byte === 10 || byte === 13 || byte === 32) { // newline or space
            if (currentWord.length > 1) {
              textContent += currentWord + ' ';
            }
            currentWord = '';
          } else {
            if (currentWord.length > 1) {
              textContent += currentWord + ' ';
            }
            currentWord = '';
          }
        }
        
        // Add remaining word
        if (currentWord.length > 1) {
          textContent += currentWord;
        }
        
        console.log('📝 Extracted text length:', textContent.length);
        
        // Direct pattern matching for critical info
        const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
        const phonePattern = /(\+46|0)[0-9\s\-\(\)]{8,15}/g;
        const namePattern = /\b[A-ZÅÄÖ][a-zåäö]+\s+[A-ZÅÄÖ][a-zåäö]+\b/g;
        
        personalInfo.emails = Array.from(textContent.matchAll(emailPattern)).map(match => match[0]);
        personalInfo.phones = Array.from(textContent.matchAll(phonePattern)).map(match => match[0].replace(/\s+/g, ''));
        personalInfo.names = Array.from(textContent.matchAll(namePattern)).map(match => match[0]);
        
        console.log('🔍 Direct detection results:', personalInfo);
        
        // Clean text for AI
        const words = textContent.split(/\s+/)
          .filter(word => 
            word.length >= 2 && 
            word.length <= 50 &&
            /^[a-zA-Z0-9@.\-+()åäöÅÄÖ\/\s]+$/.test(word)
          );
        
        extractedText = words.join(' ').substring(0, 3000);
        console.log('✅ Cleaned text for AI:', extractedText.length, 'characters');
        
      } else {
        // For non-PDF files
        extractedText = await file.text();
        extractedText = extractedText.substring(0, 3000);
        
        // Pattern detection for other file types
        const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
        const phonePattern = /(\+46|0)[0-9\s\-\(\)]{8,15}/g;
        const namePattern = /\b[A-ZÅÄÖ][a-zåäö]+\s+[A-ZÅÄÖ][a-zåäö]+\b/g;
        
        personalInfo.emails = Array.from(extractedText.matchAll(emailPattern)).map(match => match[0]);
        personalInfo.phones = Array.from(extractedText.matchAll(phonePattern)).map(match => match[0].replace(/\s+/g, ''));
        personalInfo.names = Array.from(extractedText.matchAll(namePattern)).map(match => match[0]);
      }
    } catch (error) {
      console.warn('⚠️ Content extraction failed:', error);
      extractedText = `CV file: ${file.name} - Unable to extract content`;
    }

    console.log('🤖 Sending to AI...');

    // Focused AI prompt for better extraction
    const prompt = `Extract information from this CV. Use detected data when available.

DETECTED PERSONAL INFO:
- Emails: ${personalInfo.emails.join(', ') || 'None found'}
- Phones: ${personalInfo.phones.join(', ') || 'None found'}  
- Names: ${personalInfo.names.join(', ') || 'None found'}

CV TEXT:
${extractedText}

Extract and return ONLY this JSON structure:

{
  "personalInfo": {
    "name": "USE DETECTED NAME OR FIND IN TEXT",
    "email": "USE DETECTED EMAIL OR FIND IN TEXT",
    "phone": "USE DETECTED PHONE OR FIND IN TEXT",
    "location": "FIND CITY/LOCATION"
  },
  "professionalSummary": {
    "yearsOfExperience": "CALCULATE OR ESTIMATE YEARS",
    "currentRole": "FIND CURRENT JOB TITLE",
    "seniorityLevel": "Junior/Mid/Senior/Expert",
    "industryFocus": "FIND INDUSTRY OR SECTOR"
  },
  "technicalExpertise": {
    "programmingLanguages": {
      "expert": ["LIST MAIN PROGRAMMING LANGUAGES"],
      "proficient": ["LIST SECONDARY LANGUAGES"],
      "familiar": ["LIST MENTIONED LANGUAGES"]
    },
    "frameworks": ["LIST FRAMEWORKS AND LIBRARIES"],
    "tools": ["LIST TOOLS AND SOFTWARE"],
    "databases": ["LIST DATABASES"]
  },
  "workExperience": [
    {
      "company": "COMPANY NAME",
      "role": "JOB TITLE",
      "duration": "TIME PERIOD",
      "technologies": ["TECHNOLOGIES USED"],
      "achievements": ["KEY ACCOMPLISHMENTS"]
    }
  ],
  "education": {
    "degrees": ["LIST EDUCATION"],
    "certifications": ["LIST CERTIFICATIONS"]
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

Use real data from CV. If information not found, use "Not specified".`;

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
            content: 'You are a CV analysis expert. Extract real information from CV text and return valid JSON. Use detected personal information when available.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 1000,
      }),
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.error('❌ GROQ API error:', errorText);
      throw new Error(`GROQ API failed: ${groqResponse.status}`);
    }

    const groqData = await groqResponse.json();
    console.log('✅ AI response received');

    let analysis;
    try {
      const content = groqData.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content in response');
      }

      console.log('🔍 AI response content:', content);

      // Extract JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
        
        // Override with detected data if AI didn't find it or found incorrect data
        if (personalInfo.emails.length > 0 && (!analysis.personalInfo.email || analysis.personalInfo.email === 'Not specified')) {
          analysis.personalInfo.email = personalInfo.emails[0];
        }
        if (personalInfo.phones.length > 0 && (!analysis.personalInfo.phone || analysis.personalInfo.phone === 'Not specified')) {
          analysis.personalInfo.phone = personalInfo.phones[0];
        }
        if (personalInfo.names.length > 0 && (!analysis.personalInfo.name || analysis.personalInfo.name === 'Not specified')) {
          analysis.personalInfo.name = personalInfo.names[0];
        }
        
        console.log('📊 Final analysis:', JSON.stringify(analysis, null, 2));
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('❌ Parse error, using detected data fallback:', parseError);
      
      // Fallback using detected patterns
      analysis = {
        personalInfo: {
          name: personalInfo.names[0] || 'Not specified',
          email: personalInfo.emails[0] || 'Not specified',
          phone: personalInfo.phones[0] || 'Not specified',
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

    console.log('✅ CV analysis completed');

    return new Response(
      JSON.stringify({ 
        success: true, 
        analysis: analysis,
        detectedInformation: personalInfo,
        extractionStats: {
          textLength: extractedText.length,
          emailsFound: personalInfo.emails.length,
          phonesFound: personalInfo.phones.length,
          namesFound: personalInfo.names.length
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
