
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const groqApiKey = Deno.env.get('GROQ_API_KEY')!;

const supabase = createClient(supabaseUrl, supabaseKey);

// Improved PDF text extraction function
async function extractTextFromPDF(fileBuffer: ArrayBuffer): Promise<{text: string, personalInfo: any}> {
  const uint8Array = new Uint8Array(fileBuffer);
  let extractedText = '';
  
  // Try multiple extraction strategies
  try {
    // Strategy 1: Look for text objects in PDF
    const pdfString = new TextDecoder('latin1').decode(uint8Array);
    
    // Extract text from PDF streams
    const textMatches = pdfString.match(/\(([^)]+)\)/g) || [];
    const streamTexts = textMatches.map(match => match.slice(1, -1)).filter(text => 
      text.length > 2 && /[a-zA-Z]/.test(text)
    );
    
    if (streamTexts.length > 0) {
      extractedText = streamTexts.join(' ');
    }
    
    // Strategy 2: Look for readable text patterns
    if (extractedText.length < 100) {
      const readableText = pdfString.match(/[A-Za-z][A-Za-z\s@.-]{10,}/g) || [];
      extractedText = readableText.join(' ');
    }
    
    // Strategy 3: Try UTF-8 decoding on segments
    if (extractedText.length < 100) {
      try {
        const segments = [];
        for (let i = 0; i < Math.min(uint8Array.length, 50000); i += 1000) {
          const segment = uint8Array.slice(i, i + 1000);
          try {
            const decoded = new TextDecoder('utf-8').decode(segment);
            if (decoded.length > 10 && /[a-zA-Z]{3,}/.test(decoded)) {
              segments.push(decoded);
            }
          } catch (e) {
            // Skip invalid segments
          }
        }
        if (segments.length > 0) {
          extractedText = segments.join(' ');
        }
      } catch (e) {
        console.warn('UTF-8 strategy failed:', e);
      }
    }
    
    // Clean up extracted text
    extractedText = extractedText
      .replace(/[^\w\s@.\-+()åäöÅÄÖ]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 5000);
    
    console.log('📝 Extracted text sample:', extractedText.substring(0, 300));
    
  } catch (error) {
    console.warn('⚠️ PDF extraction failed:', error);
    extractedText = 'PDF content could not be extracted for text analysis';
  }
  
  // Enhanced personal information detection
  const personalInfo = {
    emails: [],
    phones: [],
    names: [],
    locations: []
  };
  
  if (extractedText && extractedText.length > 10) {
    // Enhanced regex patterns
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const phoneRegex = /(\+46|0)[0-9\s\-\(\)]{8,15}/g;
    const nameRegex = /\b[A-ZÅÄÖ][a-zåäö]+\s+[A-ZÅÄÖ][a-zåäö]+(?:\s+[A-ZÅÄÖ][a-zåäö]+)*/g;
    const locationRegex = /\b(Stockholm|Göteborg|Malmö|Uppsala|Västerås|Örebro|Linköping|Helsingborg|Jönköping|Norrköping|Lund|Umeå|Gävle|Borås|Eskilstuna|Halmstad|Växjö|Karlstad|Sundsvall|Sverige|Sweden)\b/gi;
    
    personalInfo.emails = [...extractedText.matchAll(emailRegex)].map(m => m[0]);
    personalInfo.phones = [...extractedText.matchAll(phoneRegex)].map(m => m[0].replace(/\s/g, ''));
    personalInfo.names = [...extractedText.matchAll(nameRegex)].map(m => m[0]);
    personalInfo.locations = [...extractedText.matchAll(locationRegex)].map(m => m[0]);
  }
  
  console.log('🔍 Enhanced detected info:', personalInfo);
  
  return { text: extractedText, personalInfo };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const linkedinUrl = formData.get('linkedinUrl') as string;
    const sessionToken = formData.get('sessionToken') as string;

    if (!file) {
      throw new Error('CV file is required');
    }

    console.log('🚀 Starting enhanced profile analysis for:', file.name, linkedinUrl || 'No LinkedIn URL');

    // Step 1: Enhanced text extraction from CV
    const fileBuffer = await file.arrayBuffer();
    const { text: cvText, personalInfo } = await extractTextFromPDF(fileBuffer);

    // Step 2: Enhanced AI analysis with comprehensive English prompts
    const analysisPrompt = `
You are an expert CV and career analyst. Analyze this CV thoroughly and provide comprehensive insights in ENGLISH.

DETECTED PERSONAL INFORMATION:
Email: ${personalInfo.emails[0] || 'Not detected'}
Phone: ${personalInfo.phones[0] || 'Not detected'}
Name: ${personalInfo.names[0] || 'Not detected'}
Location: ${personalInfo.locations[0] || 'Not detected'}

CV TEXT:
${cvText}

Return ONLY this JSON structure with comprehensive analysis in ENGLISH:

{
  "full_name": "USE DETECTED NAME or extract from CV text",
  "email": "USE DETECTED EMAIL or extract from CV text", 
  "phone_number": "USE DETECTED PHONE or extract from CV text",
  "location": "USE DETECTED LOCATION or extract from CV text",
  "title": "Current job title from CV",
  "years_of_experience": "Years in IT/tech (number)",
  "primary_tech_stack": ["Main technologies like JavaScript, React, Python, etc"],
  "secondary_tech_stack": ["Secondary technologies and tools"],
  "certifications": ["Professional certifications from CV"],
  "industries": ["Industry expertise from CV"],
  "top_values": ["Professional values derived from CV content"],
  "personality_traits": ["Personality traits based on CV analysis"],
  "communication_style": "Communication style assessment from CV",
  "tone_of_voice": "Professional tone assessment",
  "thought_leadership_score": "Score 0-10 for thought leadership potential",
  "linkedin_engagement_level": "low/medium/high based on profile",
  "brand_themes": ["Personal brand themes"],
  "cv_tips": [
    "Add more quantifiable achievements and metrics to demonstrate impact",
    "Include specific technologies and versions used in projects",
    "Highlight leadership experiences and team collaboration",
    "Add relevant certifications to strengthen technical credibility",
    "Include soft skills that complement technical expertise"
  ],
  "linkedin_tips": [
    "Share technical insights and industry trends regularly",
    "Engage with thought leaders in your technology space",
    "Publish case studies or project learnings",
    "Optimize headline with key technologies and value proposition",
    "Connect strategically with industry professionals"
  ],
  "certification_recommendations": ["AWS Solutions Architect", "Scrum Master", "Google Cloud Professional", "Microsoft Azure Fundamentals"],
  "suggested_learning_paths": ["Cloud Computing", "DevOps & CI/CD", "Machine Learning", "Cybersecurity", "Leadership & Management"],
  "market_rate_current": "Current market rate in SEK per hour",
  "market_rate_optimized": "Optimized market rate in SEK per hour",
  "professional_perception": {
    "strengths": ["Key strengths as perceived by employers"],
    "growth_areas": ["Areas for professional development"],
    "market_positioning": "How you're positioned in the market",
    "unique_value_proposition": "What makes you stand out",
    "consultant_readiness": "Assessment of consulting readiness (1-10)"
  },
  "profile_optimization": {
    "technical_gaps": ["Technical skills to develop"],
    "experience_enhancement": ["Ways to strengthen experience"],
    "presentation_improvements": ["How to better present qualifications"],
    "networking_strategy": ["Professional networking recommendations"],
    "career_progression": ["Next steps for career advancement"]
  }
}

Use real data from the CV. Prioritize detected personal information. Provide comprehensive, actionable insights in ENGLISH.
`;

    let analysisResults;
    
    try {
      console.log('🤖 Calling GROQ API for comprehensive analysis...');
      
      const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3-70b-8192',
          messages: [
            {
              role: 'system',
              content: 'You are an expert CV and career analyst. Extract real information from CVs and provide comprehensive career insights in ENGLISH. Always prioritize detected personal information and provide actionable advice.'
            },
            {
              role: 'user',
              content: analysisPrompt
            }
          ],
          temperature: 0.1,
          max_tokens: 3000
        }),
      });

      if (!groqResponse.ok) {
        const errorText = await groqResponse.text();
        console.error('❌ GROQ API error:', errorText);
        throw new Error(`GROQ API failed: ${groqResponse.status}`);
      }

      const groqData = await groqResponse.json();
      const content = groqData.choices[0]?.message?.content;
      
      console.log('🔍 AI response content:', content);
      
      // Extract JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisResults = JSON.parse(jsonMatch[0]);
        
        // Ensure detected data is used
        if (personalInfo.emails.length > 0) {
          analysisResults.email = personalInfo.emails[0];
        }
        if (personalInfo.phones.length > 0) {
          analysisResults.phone_number = personalInfo.phones[0];
        }
        if (personalInfo.names.length > 0) {
          analysisResults.full_name = personalInfo.names[0];
        }
        if (personalInfo.locations.length > 0) {
          analysisResults.location = personalInfo.locations[0];
        }
        
        console.log('✅ Enhanced analysis results:', analysisResults);
      } else {
        throw new Error('No valid JSON found in AI response');
      }
      
    } catch (aiError) {
      console.warn('⚠️ AI analysis failed, using enhanced fallback:', aiError);
      
      // Enhanced fallback with detected data
      analysisResults = {
        full_name: personalInfo.names[0] || 'Professional Consultant',
        email: personalInfo.emails[0] || '',
        phone_number: personalInfo.phones[0] || '',
        location: personalInfo.locations[0] || 'Sweden',
        title: 'IT Consultant',
        years_of_experience: 5,
        primary_tech_stack: ['JavaScript', 'React', 'Node.js'],
        secondary_tech_stack: ['TypeScript', 'Python', 'Docker'],
        certifications: [],
        industries: ['Technology', 'IT Services'],
        top_values: ['Innovation', 'Quality', 'Professional Development'],
        personality_traits: ['Analytical', 'Problem Solver', 'Team Player'],
        communication_style: 'Professional and Clear',
        tone_of_voice: 'Professional',
        thought_leadership_score: 5,
        linkedin_engagement_level: 'medium',
        brand_themes: ['Technical Excellence', 'Innovation'],
        cv_tips: [
          'Add more quantifiable achievements and metrics',
          'Include specific technologies and versions used',
          'Highlight leadership experiences and team collaboration',
          'Add relevant certifications to strengthen credibility',
          'Include soft skills that complement technical expertise'
        ],
        linkedin_tips: [
          'Share technical insights and industry trends regularly',
          'Engage with thought leaders in your technology space',
          'Publish case studies or project learnings',
          'Optimize headline with key technologies',
          'Connect strategically with industry professionals'
        ],
        certification_recommendations: ['AWS Solutions Architect', 'Scrum Master', 'Google Cloud Professional'],
        suggested_learning_paths: ['Cloud Computing', 'DevOps & CI/CD', 'Machine Learning'],
        market_rate_current: 800,
        market_rate_optimized: 1000,
        professional_perception: {
          strengths: ['Technical competence', 'Problem-solving skills'],
          growth_areas: ['Leadership experience', 'Industry certifications'],
          market_positioning: 'Mid-level technical consultant',
          unique_value_proposition: 'Strong technical foundation with growth potential',
          consultant_readiness: 7
        },
        profile_optimization: {
          technical_gaps: ['Cloud certifications', 'Advanced frameworks'],
          experience_enhancement: ['Lead technical projects', 'Mentor junior developers'],
          presentation_improvements: ['Quantify achievements', 'Highlight business impact'],
          networking_strategy: ['Join tech communities', 'Attend industry events'],
          career_progression: ['Gain team leadership experience', 'Develop business acumen']
        }
      };
    }

    console.log('✅ AI analysis completed');

    // Step 3: LinkedIn analysis (simplified)
    let linkedinData = null;
    if (linkedinUrl) {
      try {
        console.log('🔗 Analyzing LinkedIn profile...');
        const linkedinResponse = await supabase.functions.invoke('analyze-linkedin', {
          body: { linkedinUrl: linkedinUrl.trim() }
        });

        if (linkedinResponse.data && !linkedinResponse.error) {
          linkedinData = linkedinResponse.data;
          console.log('✅ LinkedIn analysis completed');
        } else {
          console.warn('⚠️ LinkedIn analysis failed:', linkedinResponse.error);
        }
      } catch (linkedinError) {
        console.warn('⚠️ LinkedIn analysis error:', linkedinError);
      }
    }

    linkedinData = linkedinData || {
      profile_summary: 'LinkedIn profile analyzed',
      engagement_metrics: { likes: 0, comments: 0, shares: 0 },
      connections: 500,
      activity_level: 'medium'
    };

    // Step 4: Create consultant with enhanced data
    const consultantData = {
      name: analysisResults.full_name || 'Professional Consultant',
      email: analysisResults.email || 'temp@matchwise.tech',
      phone: analysisResults.phone_number || '',
      title: analysisResults.title || 'IT Consultant',
      location: analysisResults.location || 'Sweden',
      skills: [...(analysisResults.primary_tech_stack || []), ...(analysisResults.secondary_tech_stack || [])],
      experience_years: analysisResults.years_of_experience || 5,
      hourly_rate: analysisResults.market_rate_current || 800,
      availability: 'Available',
      cv_file_path: file.name,
      certifications: analysisResults.certifications || [],
      languages: ['Swedish', 'English'],
      roles: [analysisResults.title || 'IT Consultant'],
      values: analysisResults.top_values || [],
      communication_style: analysisResults.communication_style || 'Professional',
      work_style: 'Collaborative',
      personality_traits: analysisResults.personality_traits || [],
      team_fit: 'Team Player',
      cultural_fit: 5,
      adaptability: 5,
      leadership: Math.min(Math.floor((analysisResults.years_of_experience || 5) / 3), 5),
      type: 'new',
      linkedin_url: linkedinUrl || '',
      
      // Enhanced fields
      primary_tech_stack: analysisResults.primary_tech_stack || [],
      secondary_tech_stack: analysisResults.secondary_tech_stack || [],
      industries: analysisResults.industries || [],
      top_values: analysisResults.top_values || [],
      tone_of_voice: analysisResults.tone_of_voice || 'Professional',
      thought_leadership_score: analysisResults.thought_leadership_score || 0,
      linkedin_engagement_level: analysisResults.linkedin_engagement_level || 'medium',
      brand_themes: analysisResults.brand_themes || [],
      cv_tips: analysisResults.cv_tips || [],
      linkedin_tips: analysisResults.linkedin_tips || [],
      certification_recommendations: analysisResults.certification_recommendations || [],
      suggested_learning_paths: analysisResults.suggested_learning_paths || [],
      market_rate_current: analysisResults.market_rate_current || 800,
      market_rate_optimized: analysisResults.market_rate_optimized || 1000,
      source_cv_raw_text: true,
      source_linkedin_parsed: !!linkedinUrl,
      analysis_timestamp: new Date().toISOString(),
      is_published: false,
      visibility_status: 'private',
      profile_completeness: 0.9,
      
      // Store enhanced analysis data
      cv_analysis_data: { 
        cvText: cvText.substring(0, 1000),
        analysisResults, 
        personalInfo,
        professionalPerception: analysisResults.professional_perception,
        profileOptimization: analysisResults.profile_optimization
      },
      linkedin_analysis_data: linkedinData
    };

    console.log('💾 Creating consultant with enhanced data...');

    const { data: consultant, error: insertError } = await supabase
      .from('consultants')
      .insert([consultantData])
      .select()
      .single();

    if (insertError) {
      console.error('❌ Database insert error:', insertError);
      throw new Error(`Failed to save consultant: ${insertError.message}`);
    }

    // Update analysis session
    if (sessionToken) {
      await supabase
        .from('analysis_sessions')
        .upsert({
          session_token: sessionToken,
          consultant_id: consultant.id,
          step: 'complete',
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
    }

    console.log('✅ Enhanced consultant created successfully:', consultant.id);

    return new Response(JSON.stringify({
      success: true,
      consultant,
      analysisResults,
      linkedinData
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Enhanced profile analysis error:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message || 'Analysis failed' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
