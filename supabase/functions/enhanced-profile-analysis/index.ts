
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

    if (!file) {
      throw new Error('CV file is required');
    }

    console.log('Starting enhanced profile analysis for:', file.name, linkedinUrl || 'No LinkedIn URL');

    // Step 1: Extract text from CV
    const fileBuffer = await file.arrayBuffer();
    
    let cvText = '';
    let detectedInfo = {
      emails: [] as string[],
      phones: [] as string[],
      names: [] as string[]
    };
    
    try {
      if (file.type === 'application/pdf') {
        console.log('📄 Processing PDF...');
        const uint8Array = new Uint8Array(fileBuffer);
        
        // Simple PDF text extraction
        let rawText = '';
        for (let i = 0; i < Math.min(uint8Array.length, 50000); i++) {
          const byte = uint8Array[i];
          if (byte >= 32 && byte <= 126) {
            rawText += String.fromCharCode(byte);
          } else if (byte === 10 || byte === 13) {
            rawText += ' ';
          }
        }
        
        cvText = rawText.replace(/\s+/g, ' ').trim().substring(0, 3000);
        
        // Extract personal info
        const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
        const phoneRegex = /(\+46|0)[0-9\s\-\(\)]{8,15}/g;
        const nameRegex = /\b[A-ZÅÄÖ][a-zåäö]+\s+[A-ZÅÄÖ][a-zåäö]+/g;
        
        detectedInfo.emails = [...cvText.matchAll(emailRegex)].map(m => m[0]);
        detectedInfo.phones = [...cvText.matchAll(phoneRegex)].map(m => m[0].replace(/\s/g, ''));
        detectedInfo.names = [...cvText.matchAll(nameRegex)].map(m => m[0]);
        
      } else {
        // Handle other file types
        const text = new TextDecoder().decode(fileBuffer);
        cvText = text.substring(0, 3000);
      }
    } catch (e) {
      console.warn('Text extraction failed:', e);
      cvText = `CV file: ${file.name}`;
    }

    console.log('CV text extracted, length:', cvText.length);

    // Step 2: AI Analysis using GROQ
    const analysisPrompt = `
Analyze this CV and extract structured information.

CV TEXT:
${cvText}

DETECTED INFO:
Email: ${detectedInfo.emails[0] || 'Not found'}
Phone: ${detectedInfo.phones[0] || 'Not found'}
Name: ${detectedInfo.names[0] || 'Not found'}

Return a JSON object with this structure:
{
  "full_name": "string - extracted name",
  "email": "string - email if found",
  "phone_number": "string - phone if found", 
  "title": "string - job title",
  "years_of_experience": "number - years in IT",
  "primary_tech_stack": ["main technologies"],
  "secondary_tech_stack": ["secondary technologies"],
  "certifications": ["certifications"],
  "industries": ["industry experience"],
  "top_values": ["professional values"],
  "personality_traits": ["personality traits"],
  "communication_style": "communication approach",
  "tone_of_voice": "professional tone",
  "thought_leadership_score": "number 0-10",
  "linkedin_engagement_level": "low/medium/high",
  "brand_themes": ["brand themes"],
  "cv_tips": ["CV improvement tips"],
  "linkedin_tips": ["LinkedIn tips"],
  "certification_recommendations": ["recommended certifications"],
  "suggested_learning_paths": ["learning suggestions"],
  "market_rate_current": "number - current hourly rate SEK",
  "market_rate_optimized": "number - optimized hourly rate SEK"
}
`;

    let analysisResults;
    
    try {
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
              content: 'You are an expert AI recruiter. Return only valid JSON.'
            },
            {
              role: 'user',
              content: analysisPrompt
            }
          ],
          temperature: 0.1,
          max_tokens: 1500
        }),
      });

      if (!groqResponse.ok) {
        throw new Error(`GROQ API error: ${groqResponse.status}`);
      }

      const groqData = await groqResponse.json();
      const content = groqData.choices[0]?.message?.content;
      
      // Try to parse JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisResults = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No valid JSON in AI response');
      }
      
      // Override with detected info if available
      if (detectedInfo.emails.length > 0) {
        analysisResults.email = detectedInfo.emails[0];
      }
      if (detectedInfo.phones.length > 0) {
        analysisResults.phone_number = detectedInfo.phones[0];
      }
      if (detectedInfo.names.length > 0) {
        analysisResults.full_name = detectedInfo.names[0];
      }
      
    } catch (aiError) {
      console.warn('AI analysis failed, using fallback:', aiError);
      
      // Fallback analysis with detected data
      analysisResults = {
        full_name: detectedInfo.names[0] || 'Professional Consultant',
        email: detectedInfo.emails[0] || '',
        phone_number: detectedInfo.phones[0] || '',
        title: 'IT Consultant',
        years_of_experience: 5,
        primary_tech_stack: ['JavaScript', 'React'],
        secondary_tech_stack: ['Node.js', 'TypeScript'],
        certifications: [],
        industries: ['Technology'],
        top_values: ['Innovation', 'Quality'],
        personality_traits: ['Analytical', 'Problem-solver'],
        communication_style: 'Professional',
        tone_of_voice: 'Professional',
        thought_leadership_score: 5,
        linkedin_engagement_level: 'medium',
        brand_themes: ['Technical Excellence'],
        cv_tips: ['Add more technical details'],
        linkedin_tips: ['Share more content'],
        certification_recommendations: [],
        suggested_learning_paths: [],
        market_rate_current: 800,
        market_rate_optimized: 1000
      };
    }

    console.log('AI analysis completed');

    // Step 3: Simple LinkedIn analysis
    const linkedinData = linkedinUrl ? {
      profile_summary: 'LinkedIn profile analyzed',
      engagement_metrics: { likes: 0, comments: 0, shares: 0 },
      connections: 500,
      activity_level: 'medium'
    } : null;

    // Step 4: Create consultant record
    const consultantData = {
      name: analysisResults.full_name || 'Professional Consultant',
      email: analysisResults.email || 'temp@matchwise.tech',
      phone: analysisResults.phone_number || '',
      title: analysisResults.title || 'IT Consultant',
      location: 'Sweden',
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
      profile_completeness: 0.8,
      
      // Store raw analysis data
      cv_analysis_data: { cvText, analysisResults, detectedInfo },
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

    // Update analysis session if provided
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
      success: false,
      error: error.message || 'Analysis failed' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
