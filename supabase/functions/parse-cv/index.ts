
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
    console.log('🚀 Starting enhanced CV parsing...');
    
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

    // Enhanced text extraction with multiple methods
    let extractedText = '';
    let detectedEmails: string[] = [];
    let detectedPhones: string[] = [];
    let detectedNames: string[] = [];
    
    try {
      if (file.type === 'application/pdf') {
        console.log('📄 Enhanced PDF processing...');
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        
        // Method 1: Extract readable text patterns
        let textContent = '';
        let buffer = '';
        
        for (let i = 0; i < uint8Array.length; i++) {
          const byte = uint8Array[i];
          
          // Look for readable ASCII text
          if (byte >= 32 && byte <= 126) {
            buffer += String.fromCharCode(byte);
          } else if (buffer.length > 0) {
            if (buffer.length >= 2) {
              textContent += buffer + ' ';
            }
            buffer = '';
          }
        }
        
        if (buffer.length > 0) {
          textContent += buffer;
        }
        
        console.log('📝 Raw extracted length:', textContent.length);
        
        // Method 2: Direct pattern matching for critical info
        const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
        const phonePattern = /(\+46|0)[0-9\s\-\(\)]{8,15}/g;
        const namePattern = /\b[A-ZÅÄÖ][a-zåäö]+\s+[A-ZÅÄÖ][a-zåäö]+\b/g;
        
        detectedEmails = Array.from(textContent.matchAll(emailPattern)).map(match => match[0]);
        detectedPhones = Array.from(textContent.matchAll(phonePattern)).map(match => match[0].replace(/\s+/g, ''));
        detectedNames = Array.from(textContent.matchAll(namePattern)).map(match => match[0]);
        
        console.log('🔍 Direct detection results:', {
          emails: detectedEmails,
          phones: detectedPhones,
          names: detectedNames
        });
        
        // Clean and filter text for AI analysis
        const words = textContent.split(/\s+/)
          .filter(word => 
            word.length >= 2 && 
            word.length <= 50 &&
            /^[a-zA-Z0-9@.\-+()åäöÅÄÖ\/\s]+$/.test(word) &&
            !word.includes('obj') &&
            !word.includes('stream')
          );
        
        extractedText = words.join(' ').substring(0, 4000);
        console.log('✅ Cleaned text for AI analysis:', extractedText.length, 'characters');
        
      } else {
        // For other file types, try to read as text
        extractedText = await file.text();
        extractedText = extractedText.substring(0, 4000);
        
        // Also run pattern detection on non-PDF files
        const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
        const phonePattern = /(\+46|0)[0-9\s\-\(\)]{8,15}/g;
        const namePattern = /\b[A-ZÅÄÖ][a-zåäö]+\s+[A-ZÅÄÖ][a-zåäö]+\b/g;
        
        detectedEmails = Array.from(extractedText.matchAll(emailPattern)).map(match => match[0]);
        detectedPhones = Array.from(extractedText.matchAll(phonePattern)).map(match => match[0].replace(/\s+/g, ''));
        detectedNames = Array.from(extractedText.matchAll(namePattern)).map(match => match[0]);
      }
    } catch (error) {
      console.warn('⚠️ Content extraction failed:', error);
      extractedText = `CV file: ${file.name} - Unable to extract content`;
    }

    console.log('🤖 Sending to AI with enhanced prompt...');

    // Shorter, more focused prompt for better results
    const prompt = `Analyze this CV and extract information. Use detected data when available.

DETECTED INFO:
- Emails found: ${detectedEmails.join(', ') || 'None'}
- Phones found: ${detectedPhones.join(', ') || 'None'}  
- Names found: ${detectedNames.join(', ') || 'None'}

CV TEXT (first 2000 chars):
${extractedText.substring(0, 2000)}

Return ONLY this JSON structure with real data:

{
  "personalInfo": {
    "name": "${detectedNames[0] || 'FIND NAME'}",
    "email": "${detectedEmails[0] || 'FIND EMAIL'}",
    "phone": "${detectedPhones[0] || 'FIND PHONE'}",
    "location": "FIND LOCATION"
  },
  "professionalSummary": {
    "yearsOfExperience": "CALCULATE YEARS",
    "currentRole": "FIND CURRENT JOB",
    "seniorityLevel": "Junior/Mid/Senior/Expert",
    "industryFocus": "FIND INDUSTRY"
  },
  "technicalExpertise": {
    "programmingLanguages": {
      "expert": ["FIND MAIN LANGUAGES"],
      "proficient": ["FIND SECONDARY"],
      "familiar": ["FIND MENTIONED"]
    },
    "frameworks": ["FIND FRAMEWORKS"],
    "tools": ["FIND TOOLS"],
    "databases": ["FIND DATABASES"]
  },
  "workExperience": [
    {
      "company": "COMPANY NAME",
      "role": "JOB TITLE",
      "duration": "TIME PERIOD",
      "technologies": ["TECH USED"],
      "achievements": ["KEY ACCOMPLISHMENTS"]
    }
  ],
  "education": {
    "degrees": ["FIND DEGREES"],
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

Fill with real data from CV. If not found, use "Not specified".`;

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
            content: 'You are a CV analysis expert. Extract real information from CV text and return valid JSON only. Use provided detected data when available.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 1500,
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
        
        // Override with detected data if AI didn't find it
        if (detectedEmails.length > 0 && analysis.personalInfo.email === 'Not specified') {
          analysis.personalInfo.email = detectedEmails[0];
        }
        if (detectedPhones.length > 0 && analysis.personalInfo.phone === 'Not specified') {
          analysis.personalInfo.phone = detectedPhones[0];
        }
        if (detectedNames.length > 0 && analysis.personalInfo.name === 'Not specified') {
          analysis.personalInfo.name = detectedNames[0];
        }
        
        console.log('📊 Final analysis with overrides:', JSON.stringify(analysis, null, 2));
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('❌ Parse error, using detected data fallback:', parseError);
      
      // Fallback using detected patterns
      analysis = {
        personalInfo: {
          name: detectedNames[0] || 'Not specified',
          email: detectedEmails[0] || 'Not specified',
          phone: detectedPhones[0] || 'Not specified',
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

    console.log('✅ Enhanced CV analysis completed');

    return new Response(
      JSON.stringify({ 
        success: true, 
        analysis: analysis,
        detectedInformation: {
          emails: detectedEmails,
          phones: detectedPhones,
          names: detectedNames
        },
        extractionStats: {
          textLength: extractedText.length,
          emailsFound: detectedEmails.length,
          phonesFound: detectedPhones.length,
          namesFound: detectedNames.length
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('❌ Enhanced CV parsing error:', error);
    
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
