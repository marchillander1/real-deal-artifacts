
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

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

    // Create enhanced analysis prompt
    const analysisPrompt = `
Analyze this CV very carefully and extract ALL information according to the JSON structure below.

${personalDescription ? `
PERSONAL DESCRIPTION FROM USER: "${personalDescription}"
Use this information to enhance the analysis of personality traits, work style, values, and career goals.
` : ''}

${personalTagline ? `
PERSONAL TAGLINE FROM USER: "${personalTagline}"
This tagline represents how the consultant sees themselves and their career aspirations.
` : ''}

IMPORTANT INSTRUCTIONS:
- Use the personal description and tagline to provide more accurate personality and career insights
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

    // Call Google Gemini API
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    let analysis;
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

      try {
        const content = geminiData.candidates[0].content.parts[0].text;
        console.log('📋 Raw response preview:', content.substring(0, 200));
        
        // Clean and parse JSON
        let cleanContent = content.trim();
        
        if (cleanContent.startsWith('```json')) {
          cleanContent = cleanContent.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
        } else if (cleanContent.startsWith('```')) {
          cleanContent = cleanContent.replace(/```\n?/g, '').replace(/```\n?$/g, '');
        }
        
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
        
        // Provide fallback analysis
        analysis = {
          personalInfo: {
            name: "Professional Consultant",
            email: "consultant@example.com",
            phone: "",
            location: "Sweden"
          },
          experience: { years: 5, currentRole: "Senior Consultant", level: "Senior" },
          skills: { technical: ["Problem Solving"], languages: ["Swedish", "English"], tools: ["Microsoft Office"] },
          workHistory: [{"role": "Consultant", "company": "Various", "period": "Recent years", "description": "Professional consulting work"}],
          education: [{"degree": "Professional Education", "school": "University", "year": "2020", "field": "Business"}],
          softSkills: {
            communicationStyle: personalTagline ? `Professional communication style influenced by: ${personalTagline}` : "Professional and clear communication",
            leadershipStyle: "Collaborative leadership approach",
            workStyle: personalDescription ? `Work style informed by personal goals: ${personalDescription.substring(0, 100)}...` : "Structured and goal-oriented",
            values: ["Quality", "Reliability", "Innovation"],
            personalityTraits: ["Analytical", "Dedicated", "Professional"]
          },
          scores: { leadership: 4, innovation: 4, adaptability: 4, culturalFit: 4, communication: 4, teamwork: 4 },
          marketAnalysis: {
            hourlyRate: { current: 800, optimized: 950, explanation: "Competitive market rate" },
            competitiveAdvantages: ["Strong experience", "Professional approach"],
            marketDemand: "Good demand for experienced consultants",
            recommendedFocus: "Continue developing expertise"
          },
          analysisInsights: {
            strengths: ["Professional experience", "Strong work ethic"],
            developmentAreas: ["Market positioning"],
            careerTrajectory: personalTagline ? `Strong potential aligned with: ${personalTagline}` : "Strong potential for senior roles",
            consultingReadiness: "Well-positioned for consulting opportunities"
          }
        };
      }

    } catch (fetchError) {
      clearTimeout(timeoutId);
      throw fetchError;
    }

    // Extract personal info
    const personalInfo = analysis.personalInfo || {};
    const detectedInfo = {
      names: [personalInfo.name].filter(name => name && name !== 'Not specified' && name !== 'Professional Consultant'),
      emails: [personalInfo.email].filter(email => email && email !== 'Not specified' && email !== 'consultant@example.com' && email.includes('@')),
      phones: [personalInfo.phone].filter(phone => phone && phone !== 'Not specified' && phone.trim() !== ''),
      locations: personalInfo.location && personalInfo.location !== 'Not specified' ? [personalInfo.location] : []
    };

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('❌ Supabase configuration missing');
      throw new Error('Supabase configuration missing');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Save consultant to database as network consultant
    const consultantData = {
      name: detectedInfo.names[0] || personalInfo.name || 'Network Consultant',
      email: detectedInfo.emails[0] || personalInfo.email || 'temp@example.com',
      phone: detectedInfo.phones[0] || '',
      location: personalInfo.location || 'Sweden',
      skills: [...(analysis.skills?.technical || []), ...(analysis.skills?.languages || []), ...(analysis.skills?.tools || [])],
      experience: `${analysis.experience?.years || 5} years`,
      roles: [analysis.experience?.currentRole || 'Consultant'],
      availability: 'Available',
      rate: `${analysis.marketAnalysis?.hourlyRate?.optimized || 950} SEK/h`,
      rating: 4.5,
      cv_analysis: analysis,
      is_my_consultant: false, // This makes it a network consultant
      linkedin_url: linkedinUrl,
      personal_description: personalDescription,
      personal_tagline: personalTagline,
      source: 'cv_upload_network'
    };

    console.log('💾 Saving network consultant to database...');
    
    const { data: savedConsultant, error: saveError } = await supabase
      .from('consultants')
      .insert([consultantData])
      .select()
      .single();

    if (saveError) {
      console.error('❌ Error saving consultant:', saveError);
      throw new Error(`Failed to save consultant: ${saveError.message}`);
    }

    console.log('✅ Network consultant saved:', savedConsultant.id);

    // Send welcome email
    try {
      console.log('📧 Sending welcome email...');
      
      const emailResponse = await supabase.functions.invoke('send-welcome-email', {
        body: {
          consultantEmail: consultantData.email,
          consultantName: consultantData.name,
          isMyConsultant: false // Network consultant
        }
      });

      if (emailResponse.error) {
        console.warn('⚠️ Welcome email failed:', emailResponse.error);
      } else {
        console.log('✅ Welcome email sent successfully');
      }
    } catch (emailError) {
      console.warn('⚠️ Email sending failed:', emailError);
    }

    console.log('✅ CV analysis and consultant creation completed successfully');

    return new Response(JSON.stringify({
      success: true,
      analysis: analysis,
      detectedInformation: detectedInfo,
      consultant: savedConsultant,
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
