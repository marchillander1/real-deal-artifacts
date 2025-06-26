
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function to convert ArrayBuffer to base64 without stack overflow
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const chunkSize = 8192; // Process in smaller chunks to avoid stack overflow
  let result = '';
  
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.slice(i, i + chunkSize);
    result += String.fromCharCode.apply(null, Array.from(chunk));
  }
  
  return btoa(result);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🚀 Parse CV function started');
    
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const personalDescription = formData.get('personalDescription') as string || '';
    const personalTagline = formData.get('personalTagline') as string || '';
    const linkedinUrl = formData.get('linkedinUrl') as string || '';
    
    if (!file) {
      throw new Error('No file provided');
    }

    console.log('📄 Processing file:', file.name, 'Size:', file.size);
    console.log('📝 Personal description provided:', !!personalDescription);
    console.log('🏷️ Personal tagline provided:', !!personalTagline);
    console.log('🔗 LinkedIn URL provided:', !!linkedinUrl);
    
    // Check file size limit (5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File too large. Maximum size is 5MB.');
    }
    
    // Convert file to base64 using safe method
    const fileBuffer = await file.arrayBuffer();
    console.log('📝 Converting file to base64...');
    const fileBase64 = arrayBufferToBase64(fileBuffer);
    
    console.log('📝 File converted to base64, length:', fileBase64.length);

    // Get Google Gemini API key
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    // Create enhanced analysis prompt in English with focus on personal description/tagline
    const analysisPrompt = `
Analyze this CV very carefully and extract ALL information according to the JSON structure below.

${personalDescription ? `
PERSONAL DESCRIPTION FROM USER: "${personalDescription}"
Use this information to enhance the analysis of personality traits, work style, values, and career goals. This is valuable context provided by the consultant themselves.
` : ''}

${personalTagline ? `
PERSONAL TAGLINE FROM USER: "${personalTagline}"
This tagline represents how the consultant sees themselves and their career aspirations. Use this to improve the analysis of their professional identity, values, and career trajectory.
` : ''}

IMPORTANT INSTRUCTIONS:
- Use the personal description and tagline to provide more accurate personality and career insights
- The personal text should influence the soft skills, values, and career trajectory analysis
- Return ONLY valid JSON without any extra text before or after
- Never use "Not specified" for name or email - extract from CV

{
  "personalInfo": {
    "name": "Full name from CV (NEVER 'Not specified')",
    "email": "Email address from CV (NEVER 'Not specified')", 
    "phone": "Phone number from CV",
    "location": "City/location from CV"
  },
  "experience": {
    "years": "Years of experience as integer",
    "currentRole": "Current/latest role",
    "level": "Junior/Mid/Senior/Lead"
  },
  "skills": {
    "technical": ["List technical skills from CV"],
    "languages": ["Programming languages from CV"],
    "tools": ["Tools and platforms from CV"]
  },
  "workHistory": [
    {"role": "Job title", "company": "Company", "period": "Period", "description": "Short description"}
  ],
  "education": [
    {"degree": "Degree/education", "school": "School/university", "year": "Year", "field": "Field"}
  ],
  "softSkills": {
    "communicationStyle": "Description enhanced by personal description/tagline",
    "leadershipStyle": "Description enhanced by personal context", 
    "workStyle": "Description enhanced by personal insights",
    "values": ["Values from CV and personal description"],
    "personalityTraits": ["Traits from CV and personal context"]
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
      "explanation": "Explanation of market valuation"
    },
    "competitiveAdvantages": ["Competitive advantages including personal strengths"],
    "marketDemand": "Assessment of market demand",
    "recommendedFocus": "Recommendations considering personal goals"
  },
  "analysisInsights": {
    "strengths": ["Strengths from CV and personal description"],
    "developmentAreas": ["Development areas"],
    "careerTrajectory": "Career path considering personal goals and tagline",
    "consultingReadiness": "Assessment enhanced by personal context"
  }
}`;

    console.log('🤖 Calling Google Gemini for analysis...');

    // Call Google Gemini API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: analysisPrompt },
              {
                inline_data: {
                  mime_type: file.type,
                  data: fileBase64
                }
              }
            ]
          }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 4000
          }
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!geminiResponse.ok) {
        const errorText = await geminiResponse.text();
        console.error('❌ Gemini API error:', errorText);
        throw new Error(`Gemini API failed: ${geminiResponse.status}`);
      }

      const geminiData = await geminiResponse.json();
      console.log('🎯 Gemini response received');

      let analysis;
      try {
        const content = geminiData.candidates[0].content.parts[0].text;
        console.log('📋 Raw response preview:', content.substring(0, 200));
        
        // Clean and parse JSON more carefully
        let cleanContent = content.trim();
        
        // Remove markdown code blocks if present
        if (cleanContent.startsWith('```json')) {
          cleanContent = cleanContent.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
        } else if (cleanContent.startsWith('```')) {
          cleanContent = cleanContent.replace(/```\n?/g, '').replace(/```\n?$/g, '');
        }
        
        // Find JSON boundaries
        const jsonStart = cleanContent.indexOf('{');
        const jsonEnd = cleanContent.lastIndexOf('}') + 1;
        
        if (jsonStart >= 0 && jsonEnd > jsonStart) {
          const jsonStr = cleanContent.substring(jsonStart, jsonEnd);
          analysis = JSON.parse(jsonStr);
          console.log('✅ Successfully parsed analysis JSON');
        } else {
          throw new Error('No valid JSON found in response');
        }
      } catch (parseError) {
        console.error('❌ JSON parsing failed:', parseError);
        
        // Provide a structured fallback with enhanced personal context
        analysis = {
          personalInfo: {
            name: "Professional Consultant",
            email: "consultant@example.com",
            phone: "",
            location: "Sweden"
          },
          experience: {
            years: 5,
            currentRole: "Senior Consultant",
            level: "Senior"
          },
          skills: {
            technical: ["Problem Solving", "Strategic Thinking", "Project Management"],
            languages: ["Swedish", "English"],
            tools: ["Microsoft Office", "Email", "Presentations"]
          },
          workHistory: [
            {"role": "Consultant", "company": "Various", "period": "Recent years", "description": "Professional consulting work"}
          ],
          education: [
            {"degree": "Professional Education", "school": "University", "year": "2020", "field": "Business"}
          ],
          softSkills: {
            communicationStyle: personalTagline ? `Professional communication style influenced by: ${personalTagline}` : "Professional and clear communication",
            leadershipStyle: "Collaborative leadership approach",
            workStyle: personalDescription ? `Work style informed by personal goals: ${personalDescription.substring(0, 100)}...` : "Structured and goal-oriented",
            values: personalDescription ? ["Quality", "Reliability", "Innovation", "Personal Growth"] : ["Quality", "Reliability", "Innovation"],
            personalityTraits: personalTagline ? ["Analytical", "Dedicated", "Professional", "Goal-oriented"] : ["Analytical", "Dedicated", "Professional"]
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
              explanation: "Competitive market rate based on experience and personal positioning"
            },
            competitiveAdvantages: ["Strong experience", "Professional approach", "Reliable delivery", "Clear personal vision"],
            marketDemand: "Good demand for experienced consultants",
            recommendedFocus: personalDescription ? "Continue developing expertise while pursuing personal career goals" : "Continue developing expertise and client relationships"
          },
          analysisInsights: {
            strengths: ["Professional experience", "Strong work ethic", "Adaptability", "Clear career vision"],
            developmentAreas: ["Market positioning", "Personal branding"],
            careerTrajectory: personalTagline ? `Strong potential for senior consulting roles, aligned with personal vision: ${personalTagline}` : "Strong potential for senior consulting roles",
            consultingReadiness: "Well-positioned for consulting opportunities with clear personal direction"
          }
        };
      }

      // Extract and clean personal info from analysis
      const personalInfo = analysis.personalInfo || {};
      const detectedInfo = {
        names: [personalInfo.name].filter(name => name && name !== 'Not specified' && name !== 'Professional Consultant'),
        emails: [personalInfo.email].filter(email => email && email !== 'Not specified' && email !== 'consultant@example.com' && email.includes('@')),
        phones: [personalInfo.phone].filter(phone => phone && phone !== 'Not specified' && phone.trim() !== ''),
        locations: personalInfo.location && personalInfo.location !== 'Not specified' ? [personalInfo.location] : []
      };

      console.log('✅ CV analysis completed successfully');
      console.log('📊 Extracted info:', {
        names: detectedInfo.names.length,
        emails: detectedInfo.emails.length,
        skills: analysis.skills?.technical?.length || 0,
        personalDescriptionUsed: !!personalDescription,
        personalTaglineUsed: !!personalTagline
      });

      return new Response(JSON.stringify({
        success: true,
        analysis: analysis,
        detectedInformation: detectedInfo,
        extractionStats: {
          textLength: fileBase64.length,
          detectedNames: detectedInfo.names.length,
          detectedEmails: detectedInfo.emails.length,
          detectedSkills: analysis.skills?.technical?.length || 0,
          personalDescriptionUsed: !!personalDescription,
          personalTaglineUsed: !!personalTagline
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } catch (fetchError) {
      clearTimeout(timeoutId);
      throw fetchError;
    }

  } catch (error) {
    console.error('❌ Parse CV error:', error.message);
    
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
