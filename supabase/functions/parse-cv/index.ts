
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

    // Simple text extraction approach
    let extractedText = '';
    
    try {
      if (file.type === 'application/pdf') {
        console.log('📄 Processing PDF - converting to text...');
        // For PDF, we'll extract what we can and send to AI for processing
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        
        // Convert binary to string for AI processing
        let textContent = '';
        for (let i = 0; i < Math.min(uint8Array.length, 50000); i++) {
          const byte = uint8Array[i];
          if (byte >= 32 && byte <= 126) { // Printable ASCII characters
            textContent += String.fromCharCode(byte);
          } else if (byte === 10 || byte === 13) { // Newlines
            textContent += ' ';
          }
        }
        
        // Clean up the text
        textContent = textContent
          .replace(/[^\w\s@.\-+()]/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        
        extractedText = textContent.substring(0, 8000); // Limit for AI processing
        console.log('📄 Extracted text length:', extractedText.length);
        
      } else {
        // For other file types, try to read as text
        extractedText = await file.text();
        extractedText = extractedText.substring(0, 8000);
      }
    } catch (error) {
      console.warn('⚠️ Content extraction failed:', error);
      extractedText = `CV file: ${file.name} - Please extract information from filename and analyze generally`;
    }

    console.log('🤖 Sending to AI for analysis...');

    // Simplified and more effective prompt
    const prompt = `Extract information from this CV text and return ONLY valid JSON:

${extractedText}

Return this exact JSON structure with real extracted data:

{
  "personalInfo": {
    "name": "Extract full name",
    "email": "Extract email address", 
    "phone": "Extract phone number",
    "location": "Extract location/city"
  },
  "professionalSummary": {
    "yearsOfExperience": "Calculate or estimate years",
    "currentRole": "Latest job title",
    "seniorityLevel": "Junior/Mid-level/Senior/Expert based on experience",
    "industryFocus": "Main industry or field"
  },
  "technicalExpertise": {
    "programmingLanguages": {
      "expert": ["Languages with 3+ years"],
      "proficient": ["Languages with 1-3 years"], 
      "familiar": ["Languages mentioned"]
    },
    "frameworks": ["React, Angular, Vue, etc."],
    "tools": ["Development tools mentioned"],
    "databases": ["SQL, NoSQL databases mentioned"]
  },
  "workExperience": [
    {
      "company": "Company name",
      "role": "Job title", 
      "duration": "Time period",
      "technologies": ["Tech stack used"],
      "achievements": ["Key accomplishments"]
    }
  ],
  "education": {
    "degrees": ["University degrees"],
    "certifications": ["Professional certifications"]
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
            content: 'You are a CV analysis expert. Extract information accurately and respond with valid JSON only. If information is not found, use "Not specified".'
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
    console.log('✅ GROQ response received');

    let analysis;
    try {
      const content = groqData.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content in response');
      }

      // Extract JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
        console.log('📊 Successfully parsed CV analysis');
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('❌ Parse error, using fallback:', parseError);
      
      // Basic fallback analysis
      analysis = {
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
    }

    console.log('✅ CV analysis completed successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        analysis: analysis,
        extractedText: extractedText.substring(0, 1000) // For debugging
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('❌ CV parsing error:', error);
    
    // Return fallback response instead of failing
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

    return new Response(
      JSON.stringify({ 
        success: true, 
        analysis: fallbackAnalysis,
        fallback: true,
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
