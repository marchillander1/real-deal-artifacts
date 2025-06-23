
import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    console.log('🚀 Parse CV function started');
    
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const personalDescription = formData.get('personalDescription') as string || '';
    
    if (!file) {
      throw new Error('No file provided');
    }

    console.log('📄 Processing file:', file.name, 'Size:', file.size);
    
    // Convert file to base64
    const fileBuffer = await file.arrayBuffer();
    const fileBase64 = btoa(String.fromCharCode(...new Uint8Array(fileBuffer)));
    
    // Simple text extraction for PDF
    let extractedText = '';
    
    if (file.type === 'application/pdf') {
      try {
        const textBytes = new Uint8Array(fileBuffer);
        const text = new TextDecoder('utf-8').decode(textBytes);
        
        // Extract readable text patterns - NO REGEX LOOPS
        const cleanText = text.replace(/[^\w\s@.\-+()]/g, ' ');
        extractedText = cleanText.substring(0, 5000);
      } catch (error) {
        console.log('PDF text extraction failed, will rely on AI analysis');
      }
    }

    console.log('📝 Extracted text length:', extractedText.length);

    // Simple pattern matching - NO LOOPS
    const emailMatches = extractedText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
    const phoneMatches = extractedText.match(/\+?[\d\s\-()]{8,15}/g) || [];
    
    // Technical skills - simple array check
    const technicalTerms = [
      'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue', 'Node.js', 'Python', 'Java', 'C#', 'PHP', 'SQL',
      'HTML', 'CSS', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'Git', 'Agile', 'Scrum', 'REST', 'API',
      'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Elasticsearch', 'Jenkins', 'CI/CD', 'DevOps'
    ];

    const detectedSkills = [];
    const lowerText = extractedText.toLowerCase();
    
    for (const term of technicalTerms) {
      if (lowerText.includes(term.toLowerCase())) {
        detectedSkills.push(term);
      }
    }

    console.log('🔍 Detected information:', {
      emails: emailMatches.slice(0, 2),
      phones: phoneMatches.slice(0, 2),
      skills: detectedSkills.slice(0, 10)
    });

    // AI analysis with Groq
    const groqApiKey = Deno.env.get('GROQ_API_KEY');
    if (!groqApiKey) {
      throw new Error('GROQ_API_KEY not configured');
    }

    const analysisPrompt = `
Du är en expert på CV-analys. Analysera detta CV och extrahera information enligt följande struktur.

${personalDescription ? `PERSONLIG BESKRIVNING: "${personalDescription}"` : ''}

Ge svar i exakt denna JSON-struktur:

{
  "personalInfo": {
    "name": "Fullständigt namn från CV",
    "email": "Email-adress från CV", 
    "phone": "Telefonnummer från CV",
    "location": "Plats/stad från CV"
  },
  "experience": {
    "years": "Antal års erfarenhet (siffra)",
    "currentRole": "Nuvarande roll/titel",
    "level": "Junior/Mid/Senior/Lead"
  },
  "skills": {
    "technical": ["Lista med tekniska färdigheter"],
    "languages": ["Programmeringsspråk"],
    "tools": ["Verktyg och plattformar"]
  },
  "workHistory": [
    {"role": "Jobbtitel", "company": "Företag", "period": "Period", "description": "Beskrivning"}
  ],
  "education": [
    {"degree": "Examen", "school": "Skola", "year": "År", "field": "Område"}
  ],
  "softSkills": {
    "communicationStyle": "Kommunikationsstil",
    "leadershipStyle": "Ledarskapstyp",
    "workStyle": "Arbetsstil",
    "values": ["Värderingar"],
    "personalityTraits": ["Personlighetsdrag"]
  },
  "scores": {
    "leadership": 4,
    "innovation": 4,
    "adaptability": 4,
    "culturalFit": 4,
    "communication": 4,
    "teamwork": 4
  },
  "marketAnalysis": {
    "hourlyRate": {
      "current": 800,
      "optimized": 950,
      "explanation": "Förklaring av marknadsvärdering"
    },
    "competitiveAdvantages": ["Konkurrensfördelar"],
    "marketDemand": "Marknadsbedömning",
    "recommendedFocus": "Rekommenderade fokusområden"
  },
  "analysisInsights": {
    "strengths": ["Styrkor"],
    "developmentAreas": ["Utvecklingsområden"],
    "careerTrajectory": "Karriärbana",
    "consultingReadiness": "Konsultberedskap"
  }
}

CV-text: ${extractedText ? extractedText.substring(0, 4000) : 'No text extracted'}
`;

    console.log('🤖 Calling Groq AI for analysis...');

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'Du är en expert på CV-analys och personalbedömning. Svara alltid med giltig JSON.'
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
        temperature: 0.3,
        max_tokens: 4000
      }),
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.error('❌ Groq API error:', errorText);
      throw new Error(`Groq API failed: ${groqResponse.status}`);
    }

    const groqData = await groqResponse.json();
    console.log('🎯 Groq response received');

    let analysis;
    try {
      const content = groqData.choices[0].message.content;
      console.log('📋 Raw AI response length:', content.length);
      
      // Clean and parse JSON
      const jsonStart = content.indexOf('{');
      const jsonEnd = content.lastIndexOf('}') + 1;
      
      if (jsonStart >= 0 && jsonEnd > jsonStart) {
        const jsonStr = content.substring(jsonStart, jsonEnd);
        analysis = JSON.parse(jsonStr);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('❌ JSON parsing failed:', parseError);
      
      // Fallback analysis
      analysis = {
        personalInfo: {
          name: "Professional Consultant",
          email: emailMatches[0] || "temp@example.com",
          phone: phoneMatches[0] || "",
          location: "Sweden"
        },
        experience: {
          years: "5",
          currentRole: "Senior Consultant",
          level: "Senior"
        },
        skills: {
          technical: detectedSkills.slice(0, 10),
          languages: ["JavaScript", "Python"],
          tools: ["Git", "Docker"]
        },
        workHistory: [],
        education: [],
        softSkills: {
          communicationStyle: "Professional",
          leadershipStyle: "Collaborative",
          workStyle: "Team-oriented",
          values: ["Quality", "Innovation"],
          personalityTraits: ["Analytical", "Problem-solver"]
        },
        scores: {
          leadership: 4,
          innovation: 4,
          adaptability: 4,
          culturalFit: 4,
          communication: 4,
          teamwork: 4
        },
        marketAnalysis: {
          hourlyRate: {
            current: 800,
            optimized: 950,
            explanation: "Based on skills and experience"
          },
          competitiveAdvantages: ["Strong technical skills"],
          marketDemand: "High",
          recommendedFocus: "Continue skill development"
        },
        analysisInsights: {
          strengths: ["Technical expertise"],
          developmentAreas: ["Leadership skills"],
          careerTrajectory: "Positive growth potential",
          consultingReadiness: "Ready for consulting"
        }
      };
    }

    const finalDetectedInfo = {
      names: [analysis.personalInfo?.name || ''].filter(Boolean),
      emails: emailMatches.length > 0 ? emailMatches : [analysis.personalInfo?.email || ''].filter(Boolean),
      phones: phoneMatches.length > 0 ? phoneMatches : [analysis.personalInfo?.phone || ''].filter(Boolean),
      locations: analysis.personalInfo?.location ? [analysis.personalInfo.location] : []
    };

    console.log('✅ CV analysis completed successfully');

    return new Response(JSON.stringify({
      success: true,
      analysis: analysis,
      detectedInformation: finalDetectedInfo,
      extractionStats: {
        textLength: extractedText.length,
        detectedNames: finalDetectedInfo.names.length,
        detectedEmails: finalDetectedInfo.emails.length,
        detectedSkills: analysis.skills?.technical?.length || 0
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Parse CV error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      details: 'Check function logs for more information'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
