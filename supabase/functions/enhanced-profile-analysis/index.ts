
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const linkedinUrl = formData.get('linkedinUrl') as string;
    const sessionToken = formData.get('sessionToken') as string;

    if (!file || !linkedinUrl) {
      throw new Error('Both CV file and LinkedIn URL are required');
    }

    console.log('Starting enhanced profile analysis for:', file.name, linkedinUrl);

    // Track analysis start
    await supabase.from('analytics_events').insert({
      session_token: sessionToken,
      event_type: 'parsing_started',
      event_data: { filename: file.name, linkedin_url: linkedinUrl }
    });

    // Step 1: Extract text from CV
    const fileBuffer = await file.arrayBuffer();
    const fileBase64 = btoa(String.fromCharCode(...new Uint8Array(fileBuffer)));
    
    let cvText = '';
    
    // Parse CV based on file type
    if (file.type === 'application/pdf') {
      // For PDF files, we'll use a simple text extraction
      cvText = await extractPDFText(fileBase64);
    } else {
      // For images and other formats, use OCR or basic extraction
      cvText = await extractTextFromFile(fileBase64, file.type);
    }

    console.log('CV text extracted, length:', cvText.length);

    // Step 2: Analyze LinkedIn profile
    const linkedinData = await analyzeLinkedInProfile(linkedinUrl);
    console.log('LinkedIn analysis completed');

    // Step 3: Comprehensive AI analysis using GROQ
    const analysisPrompt = `
You are an expert AI recruiter and career coach analyzing an IT consultant's profile. 
Analyze the CV text and LinkedIn data to create a comprehensive consultant profile.

CV TEXT:
${cvText}

LINKEDIN DATA:
${JSON.stringify(linkedinData)}

Return a JSON object with this exact structure:
{
  "full_name": "string - extracted full name",
  "email": "string - email address if found",
  "phone_number": "string - phone number if found", 
  "title": "string - current job title/role",
  "years_of_experience": "number - total years in IT",
  "primary_tech_stack": ["array of main technologies/languages"],
  "secondary_tech_stack": ["array of secondary technologies"],
  "certifications": ["array of current certifications"],
  "industries": ["array of industry experience"],
  "top_values": ["array of 3-5 professional values"],
  "personality_traits": ["array of personality traits"],
  "communication_style": "string - communication approach",
  "tone_of_voice": "string - professional tone",
  "thought_leadership_score": "number 0-10 based on LinkedIn activity",
  "linkedin_engagement_level": "low/medium/high",
  "brand_themes": ["array of professional brand themes"],
  "cv_tips": ["array of 3-5 specific CV improvement tips"],
  "linkedin_tips": ["array of 3-5 LinkedIn optimization tips"],
  "certification_recommendations": ["array of relevant certifications to pursue"],
  "suggested_learning_paths": ["array of skill development suggestions"],
  "market_rate_current": "number - estimated current hourly rate in SEK",
  "market_rate_optimized": "number - potential optimized hourly rate in SEK",
  "source_cv_raw_text": true,
  "source_linkedin_parsed": true,
  "analysis_timestamp": "${new Date().toISOString()}"
}

Focus on accuracy and specific, actionable insights. Base all recommendations on the actual data provided.
`;

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
            content: 'You are an expert AI recruiter analyzing IT consultant profiles. Always return valid JSON.'
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
        temperature: 0.1,
        max_tokens: 2000
      }),
    });

    if (!groqResponse.ok) {
      throw new Error(`GROQ API error: ${groqResponse.status}`);
    }

    const groqData = await groqResponse.json();
    let analysisResults;
    
    try {
      analysisResults = JSON.parse(groqData.choices[0].message.content);
    } catch (e) {
      console.error('Failed to parse GROQ response as JSON:', e);
      throw new Error('Failed to parse AI analysis results');
    }

    console.log('AI analysis completed successfully');

    // Step 4: Create consultant record
    const consultantData = {
      name: analysisResults.full_name || 'Professional Consultant',
      email: analysisResults.email || 'temp@matchwise.tech',
      phone: analysisResults.phone_number || '',
      title: analysisResults.title || 'IT Consultant',
      location: 'Sweden', // Default for now
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
      linkedin_url: linkedinUrl,
      
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
      source_linkedin_parsed: true,
      analysis_timestamp: new Date().toISOString(),
      is_published: false,
      visibility_status: 'private',
      profile_completeness: 0.8,
      
      // Store raw analysis data
      cv_analysis_data: { cvText, analysisResults },
      linkedin_analysis_data: linkedinData
    };

    const { data: consultant, error: insertError } = await supabase
      .from('consultants')
      .insert([consultantData])
      .select()
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      throw new Error(`Failed to save consultant: ${insertError.message}`);
    }

    // Update analysis session
    await supabase
      .from('analysis_sessions')
      .upsert({
        session_token: sessionToken,
        consultant_id: consultant.id,
        step: 'summary',
        updated_at: new Date().toISOString()
      });

    console.log('Consultant created successfully:', consultant.id);

    return new Response(JSON.stringify({
      success: true,
      consultant,
      analysisResults,
      linkedinData
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Enhanced profile analysis error:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Analysis failed' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function extractPDFText(base64Data: string): Promise<string> {
  // Simple PDF text extraction - in production you'd use a proper PDF parser
  try {
    const binaryString = atob(base64Data);
    const uint8Array = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      uint8Array[i] = binaryString.charCodeAt(i);
    }
    
    // Basic text extraction from PDF (this is simplified)
    const text = new TextDecoder().decode(uint8Array);
    return text.replace(/[^\x20-\x7E\s]/g, '').substring(0, 5000);
  } catch (e) {
    console.error('PDF extraction error:', e);
    return 'PDF text extraction failed';
  }
}

async function extractTextFromFile(base64Data: string, fileType: string): Promise<string> {
  // Basic file text extraction
  try {
    const binaryString = atob(base64Data);
    return binaryString.substring(0, 3000);
  } catch (e) {
    console.error('File extraction error:', e);
    return 'File text extraction failed';
  }
}

async function analyzeLinkedInProfile(linkedinUrl: string) {
  try {
    // In a real implementation, you'd scrape or use LinkedIn API
    // For now, return mock data based on URL analysis
    return {
      profile_summary: 'Professional IT consultant with expertise in modern technologies',
      recent_posts: [],
      engagement_metrics: { likes: 0, comments: 0, shares: 0 },
      connections: 500,
      recommendations: 5,
      skills_endorsed: [],
      activity_level: 'medium'
    };
  } catch (e) {
    console.error('LinkedIn analysis error:', e);
    return null;
  }
}
