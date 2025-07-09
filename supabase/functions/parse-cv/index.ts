
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

    // Enhanced comprehensive career coaching analysis prompt
    const analysisPrompt = `
You are an AI career coach built into MatchWise.tech, an AI-powered consultant matching platform specializing in IT freelancers and consultants.

Your role is to help IT freelancers and consultants understand and act on their AI-generated profile analysis to maximize their career potential and market value.

Each consultant has uploaded a CV. The AI system analyzes:
- Technical skills
- Certifications  
- Years of experience
- Suggested learning paths
- Market value range
- CV optimization tips
- Personality traits
- Communication style
- Top personal values
- Tone of voice
- Thought leadership score

${personalDescription ? `
PERSONAL CONTEXT FROM CONSULTANT: "${personalDescription}"
Use this information to enhance personality analysis, work style assessment, and career trajectory insights.
` : ''}

${personalTagline ? `
CONSULTANT'S PROFESSIONAL TAGLINE: "${personalTagline}"
This represents their professional identity and career aspirations.
` : ''}

CRITICAL REQUIREMENTS:
- ALL TEXT MUST BE IN ENGLISH ONLY - no Swedish, no other languages
- Provide DETAILED career coaching insights in each section
- Extract ALL available information from the CV
- Use personal context to enhance career development recommendations
- Focus on actionable career advice and market positioning
- Return ONLY valid JSON without markdown formatting

COMPREHENSIVE CAREER ANALYSIS JSON STRUCTURE:

{
  "personalInfo": {
    "name": "Extract full name from CV (never use 'Not specified')",
    "email": "Extract email from CV (never use 'Not specified')", 
    "phone": "Extract phone number from CV",
    "location": "Extract city/location from CV"
  },
  "experience": {
    "years": "Calculate total years of professional experience as integer",
    "currentRole": "Most recent/current position title",
    "level": "Assess as Junior (0-2 years), Mid (3-5 years), Senior (6-10 years), or Lead (10+ years)"
  },
  "skills": {
    "technical": ["Extract ALL technical skills, programming languages, frameworks, tools"],
    "languages": ["Extract ALL spoken/written languages mentioned"],
    "tools": ["Extract ALL software tools, platforms, applications mentioned"]
  },
  "workHistory": [
    {
      "role": "Job title",
      "company": "Company name", 
      "period": "Employment period",
      "description": "Detailed description of responsibilities and achievements"
    }
  ],
  "education": [
    {
      "degree": "Degree or certification name",
      "school": "Institution name",
      "year": "Graduation year or period",
      "field": "Field of study"
    }
  ],
  "certifications": ["All professional certifications and credentials mentioned"],
  "suggestedLearningPaths": [
    {
      "path": "Technology/skill area to focus on",
      "reasoning": "Why this learning path will advance their career",
      "timeframe": "Recommended timeframe for completion",
      "priority": "High/Medium/Low based on market demand and career goals"
    }
  ],
  "softSkills": {
    "communicationStyle": "DETAILED assessment of communication approach based on CV content and personal context - IN ENGLISH",
    "leadershipStyle": "DETAILED analysis of leadership qualities and management approach - IN ENGLISH", 
    "workStyle": "DETAILED description of work methodology and approach - IN ENGLISH",
    "personalityTraits": ["Personality characteristics based on CV analysis - IN ENGLISH"],
    "toneOfVoice": "Professional tone and communication style assessment - IN ENGLISH",
    "thoughtLeadershipScore": "Rate 1-10 based on publications, speaking, thought leadership activities",
    "values": ["Core professional values extracted from CV and context - IN ENGLISH"]
  },
  "scores": {
    "leadership": "Rate 1-5 based on management experience and leadership indicators",
    "innovation": "Rate 1-5 based on creative projects and problem-solving",
    "adaptability": "Rate 1-5 based on diverse experiences and learning",
    "culturalFit": "Rate 1-5 based on team collaboration and values alignment",
    "communication": "Rate 1-5 based on presentation skills and client interaction",
    "teamwork": "Rate 1-5 based on collaborative project experience"
  },
  "marketAnalysis": {
    "hourlyRate": {
      "current": "Estimated current market rate in SEK based on experience and location",
      "optimized": "Recommended optimized rate in SEK based on skills and experience",
      "explanation": "DETAILED explanation of rate calculation factors and market positioning"
    },
    "competitiveAdvantages": ["SPECIFIC advantages this consultant has over competitors"],
    "marketDemand": "DETAILED assessment of market demand for this profile",
    "recommendedFocus": "SPECIFIC recommendations for skill development and market positioning"
  },
  "careerCoaching": {
    "cvOptimizationTips": [
      "Specific actionable tips to improve CV presentation and impact",
      "Focus on quantifiable achievements and results",
      "Industry-specific keyword optimization recommendations"
    ],
    "careerTrajectory": "DETAILED analysis of potential career path and growth opportunities",
    "consultingReadiness": "COMPREHENSIVE assessment of readiness for consulting work with specific reasoning",
    "brandingRecommendations": [
      "Personal brand development suggestions",
      "Professional positioning strategies",
      "Thought leadership opportunities"
    ],
    "networkingStrategy": "Recommendations for building professional network and visibility"
  },
  "analysisInsights": {
    "strengths": ["SPECIFIC strengths identified from CV analysis"],
    "developmentAreas": ["SPECIFIC areas for professional development with actionable steps"],
    "uniqueValueProposition": "What makes this consultant stand out in the market",
    "riskFactors": ["Potential career risks or gaps to address"],
    "opportunityAreas": ["Market opportunities this consultant should pursue"]
  }
}

COACHING FOCUS AREAS:
- Provide actionable career development advice
- Identify specific skill gaps and learning opportunities  
- Assess market positioning and competitive advantages
- Recommend concrete steps for career advancement
- Evaluate consulting readiness and specialization potential
- Suggest personal branding and thought leadership strategies

IMPORTANT: 
- Provide substantive, detailed content in every field
- Use the personal context to enhance accuracy where available
- ALL content must be in English
- Be specific rather than generic in all descriptions
- Calculate realistic market rates for Swedish consulting market
- Focus on actionable career coaching insights`;

    console.log('🤖 Calling Google Gemini for comprehensive career analysis...');

    // Call Google Gemini API with enhanced career coaching prompt
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 50000); // Increased timeout for comprehensive analysis

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
            temperature: 0.2, // Lower temperature for more consistent career advice
            maxOutputTokens: 8000 // Increased for comprehensive career analysis
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
        console.log('📋 Raw response preview:', content.substring(0, 300));
        
        // Clean and parse JSON more carefully
        let cleanContent = content.trim();
        
        // Remove markdown formatting
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
          console.log('✅ Successfully parsed comprehensive career analysis JSON');
          
          // Validate that soft skills are in English
          if (analysis.softSkills) {
            console.log('🔍 Validating career coaching content language...');
            console.log('Communication style:', analysis.softSkills.communicationStyle);
            console.log('Leadership style:', analysis.softSkills.leadershipStyle);
            console.log('CV optimization tips:', analysis.careerCoaching?.cvOptimizationTips);
          }
        } else {
          throw new Error('No valid JSON found in response');
        }
      } catch (parseError) {
        console.error('❌ JSON parsing failed:', parseError);
        throw new Error('Failed to parse career analysis results');
      }

    } catch (fetchError) {
      clearTimeout(timeoutId);
      throw fetchError;
    }

    // Extract and validate personal info
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

    // Save consultant to database as network consultant with career coaching data
    const consultantData = {
      name: detectedInfo.names[0] || personalInfo.name || 'Network Consultant',
      email: detectedInfo.emails[0] || personalInfo.email || 'temp@example.com',
      phone: detectedInfo.phones[0] || '',
      location: personalInfo.location || 'Sweden',
      skills: [...(analysis.skills?.technical || []), ...(analysis.skills?.languages || []), ...(analysis.skills?.tools || [])],
      experience_years: analysis.experience?.years || 5,
      title: analysis.experience?.currentRole || 'Consultant',
      roles: [analysis.experience?.currentRole || 'Consultant'],
      availability: 'Available',
      hourly_rate: analysis.marketAnalysis?.hourlyRate?.optimized || 950,
      rating: 4.5,
      analysis_results: analysis,
      user_id: null, // Network consultant
      linkedin_url: linkedinUrl,
      self_description: personalDescription,
      tagline: personalTagline,
      is_published: true,
      market_rate_current: analysis.marketAnalysis?.hourlyRate?.current || 800,
      market_rate_optimized: analysis.marketAnalysis?.hourlyRate?.optimized || 950,
      visibility_status: 'public',
      
      // Enhanced soft skills mapping from career coaching analysis
      communication_style: analysis.softSkills?.communicationStyle || 'Professional communication approach',
      work_style: analysis.softSkills?.workStyle || 'Structured and goal-oriented work approach',
      personality_traits: analysis.softSkills?.personalityTraits || ['Professional', 'Dedicated'],
      values: analysis.softSkills?.values || ['Quality', 'Reliability'],
      cultural_fit: analysis.scores?.culturalFit || 4,
      adaptability: analysis.scores?.adaptability || 4,
      leadership: analysis.scores?.leadership || 3,
      
      // Career coaching specific fields
      certifications: analysis.certifications || [],
      cv_tips: analysis.careerCoaching?.cvOptimizationTips || [],
      tone_of_voice: analysis.softSkills?.toneOfVoice || 'Professional and collaborative',
      thought_leadership_score: analysis.softSkills?.thoughtLeadershipScore || 5,
      
      // Additional fields
      languages: analysis.skills?.languages || ['English', 'Swedish'],
      primary_tech_stack: analysis.skills?.technical?.slice(0, 5) || [],
      secondary_tech_stack: analysis.skills?.tools || [],
      industries: [],
      type: 'consultant',
      last_active: 'Today'
    };

    console.log('💾 Saving comprehensive career analysis to database...');
    
    const { data: savedConsultant, error: saveError } = await supabase
      .from('consultants')
      .insert([consultantData])
      .select()
      .single();

    if (saveError) {
      console.error('❌ Error saving consultant:', saveError);
      throw new Error(`Failed to save consultant: ${saveError.message}`);
    }

    console.log('✅ Comprehensive career analysis saved:', savedConsultant.id);

    // Send welcome email with proper error handling
    try {
      console.log('📧 Sending welcome email to:', consultantData.email);
      console.log('📧 Also sending notification to: marc@matchwise.tech');
      
      const emailResponse = await supabase.functions.invoke('send-welcome-email', {
        body: {
          consultantEmail: consultantData.email,
          consultantName: consultantData.name,
          isMyConsultant: false // Network consultant
        }
      });

      if (emailResponse.error) {
        console.error('❌ Welcome email failed:', emailResponse.error);
      } else {
        console.log('✅ Welcome email sent successfully to consultant');
      }

      // Send notification to marc@matchwise.tech
      const adminEmailResponse = await supabase.functions.invoke('send-registration-notification', {
        body: {
          consultantName: consultantData.name,
          consultantEmail: consultantData.email,
          isMyConsultant: false
        }
      });

      if (adminEmailResponse.error) {
        console.error('❌ Admin notification failed:', adminEmailResponse.error);
      } else {
        console.log('✅ Admin notification sent successfully to marc@matchwise.tech');
      }

    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError);
      // Don't throw here - consultant creation succeeded
    }

    console.log('✅ Comprehensive career coaching analysis completed successfully');

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
        personalTaglineUsed: !!personalTagline,
        careerCoachingAnalysis: true,
        analysisEnhanced: true
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Enhanced career coaching analysis error:', error.message);
    
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
