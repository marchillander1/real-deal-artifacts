
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
    
    // Simple text extraction
    let extractedText = '';
    
    if (file.type === 'application/pdf') {
      try {
        const textBytes = new Uint8Array(fileBuffer);
        const text = new TextDecoder('utf-8').decode(textBytes);
        
        // Extract readable text patterns
        const textMatches = text.match(/[A-Za-zÅÄÖåäö0-9\s\@\.\-\+\(\)]{10,}/g);
        if (textMatches) {
          extractedText = textMatches.join(' ').substring(0, 5000);
        }
      } catch (error) {
        console.log('PDF text extraction failed, will rely on AI analysis');
      }
    }

    console.log('📝 Extracted text length:', extractedText.length);

    // Regex patterns
    const namePattern = /(?:^|\n|\s)((?:[A-ZÅÄÖ][a-zåäö]+\s+){1,3}[A-ZÅÄÖ][a-zåäö]+)(?:\s|$)/g;
    const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const phonePattern = /(?:\+46|0)(?:\s*[-\(\)]?\s*)?(?:\d{1,4}(?:\s*[-\(\)]?\s*)?){2,4}\d{1,4}/g;

    // Technical skills array
    const technicalTerms = [
      'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue', 'Node.js', 'Python', 'Java', 'C#', 'PHP', 'SQL',
      'HTML', 'CSS', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'Git', 'Agile', 'Scrum', 'REST', 'API',
      'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Elasticsearch', 'Jenkins', 'CI/CD', 'DevOps'
    ];

    // Extract information
    const detectedNames = [];
    const detectedEmails = [];
    const detectedPhones = [];
    
    let match;
    while ((match = namePattern.exec(extractedText)) !== null) {
      const name = match[1];
      if (name && name.length > 3 && name.length < 50 && /^[A-ZÅÄÖ]/.test(name)) {
        detectedNames.push(name);
      }
    }
    
    while ((match = emailPattern.exec(extractedText)) !== null) {
      detectedEmails.push(match[0]);
    }
    
    while ((match = phonePattern.exec(extractedText)) !== null) {
      detectedPhones.push(match[0]);
    }
    
    // Find technical skills
    const detectedSkills = technicalTerms.filter(term => 
      extractedText.toLowerCase().includes(term.toLowerCase())
    );

    console.log('🔍 Detected information:', {
      names: detectedNames.slice(0, 3),
      emails: detectedEmails.slice(0, 2),
      phones: detectedPhones.slice(0, 2),
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

CV-text: ${extractedText.substring(0, 4000)}
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
      console.log('📋 Raw AI response:', content.substring(0, 500));
      
      // Clean and parse JSON
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('❌ JSON parsing failed:', parseError);
      throw new Error('Failed to parse AI analysis');
    }

    // Prepare final response
    const finalDetectedInfo = {
      names: detectedNames.length > 0 ? detectedNames : [analysis.personalInfo?.name || ''].filter(Boolean),
      emails: detectedEmails.length > 0 ? detectedEmails : [analysis.personalInfo?.email || ''].filter(Boolean),
      phones: detectedPhones.length > 0 ? detectedPhones : [analysis.personalInfo?.phone || ''].filter(Boolean),
      locations: analysis.personalInfo?.location ? [analysis.personalInfo.location] : []
    };

    // Ensure technical skills are populated
    if (analysis.skills && (!analysis.skills.technical || analysis.skills.technical.length === 0)) {
      analysis.skills.technical = detectedSkills.slice(0, 15);
    }

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
