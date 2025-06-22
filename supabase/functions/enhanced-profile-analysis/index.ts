
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

    console.log('🚀 Starting enhanced profile analysis for:', file.name, linkedinUrl || 'No LinkedIn URL');

    // Step 1: Förbättrad text-extraktion från CV
    const fileBuffer = await file.arrayBuffer();
    
    let cvText = '';
    let detectedInfo = {
      emails: [] as string[],
      phones: [] as string[],
      names: [] as string[]
    };
    
    try {
      if (file.type === 'application/pdf') {
        console.log('📄 Processing PDF with improved extraction...');
        const uint8Array = new Uint8Array(fileBuffer);
        
        // Förbättrad PDF text-extraktion
        let rawText = '';
        let currentChar = '';
        
        // Läs igenom PDF och extrahera läsbar text
        for (let i = 0; i < Math.min(uint8Array.length, 100000); i++) {
          const byte = uint8Array[i];
          
          // Fokusera på ASCII-tecken som bildar ord
          if (byte >= 32 && byte <= 126) {
            currentChar = String.fromCharCode(byte);
            
            // Bygg upp text med spaces mellan ord
            if (currentChar.match(/[a-zA-Z0-9@.\-+åäöÅÄÖ]/)) {
              rawText += currentChar;
            } else if (currentChar === ' ' && rawText.slice(-1) !== ' ') {
              rawText += ' ';
            }
          } else if (byte === 10 || byte === 13) {
            // Ny rad
            if (rawText.slice(-1) !== ' ') {
              rawText += ' ';
            }
          }
        }
        
        // Rensa och strukturera text
        cvText = rawText
          .replace(/\s+/g, ' ')
          .replace(/[^\w\s@.\-+()åäöÅÄÖ]/g, ' ')
          .trim()
          .substring(0, 4000);
        
        console.log('📝 Extracted text length:', cvText.length);
        console.log('📝 Text sample:', cvText.substring(0, 300));
        
        // Förbättrad regex-detektion för personlig info
        const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
        const phoneRegex = /(\+46|0)[0-9\s\-\(\)]{8,15}/g;
        const nameRegex = /\b[A-ZÅÄÖ][a-zåäö]+\s+[A-ZÅÄÖ][a-zåäö]+(?:\s+[A-ZÅÄÖ][a-zåäö]+)*/g;
        
        detectedInfo.emails = [...cvText.matchAll(emailRegex)].map(m => m[0]);
        detectedInfo.phones = [...cvText.matchAll(phoneRegex)].map(m => m[0].replace(/\s/g, ''));
        detectedInfo.names = [...cvText.matchAll(nameRegex)].map(m => m[0]);
        
        console.log('🔍 Detected info:', detectedInfo);
        
      } else {
        // Text-filer
        const text = new TextDecoder().decode(fileBuffer);
        cvText = text.substring(0, 4000);
      }
    } catch (e) {
      console.warn('⚠️ Text extraction failed:', e);
      cvText = `CV file: ${file.name}`;
    }

    // Step 2: Förbättrad AI-analys med GROQ
    const analysisPrompt = `
Analysera detta CV noggrant och extrahera strukturerad information på svenska.

DETEKTERAD PERSONLIG INFORMATION:
Email: ${detectedInfo.emails[0] || 'Ej funnen'}
Telefon: ${detectedInfo.phones[0] || 'Ej funnen'}
Namn: ${detectedInfo.names[0] || 'Ej funnet'}

CV TEXT:
${cvText}

Returnera ENDAST denna JSON-struktur med verklig data från CV:n:

{
  "full_name": "ANVÄND DETEKTERAT NAMN eller hitta från CV-text",
  "email": "ANVÄND DETEKTERAD EMAIL eller hitta från CV-text", 
  "phone_number": "ANVÄND DETEKTERAD TELEFON eller hitta från CV-text",
  "title": "Aktuell jobbtitel från CV",
  "years_of_experience": "Antal år inom IT (siffra)",
  "primary_tech_stack": ["Huvudteknologier som JavaScript, React, etc"],
  "secondary_tech_stack": ["Sekundära teknologier"],
  "certifications": ["Certifieringar från CV"],
  "industries": ["Branschexpertis från CV"],
  "top_values": ["Professionella värderingar"],
  "personality_traits": ["Personlighetsegenskaper baserat på CV"],
  "communication_style": "Kommunikationsstil baserat på CV-text",
  "tone_of_voice": "Professionell ton",
  "thought_leadership_score": "Poäng 0-10 för tankeledning",
  "linkedin_engagement_level": "low/medium/high",
  "brand_themes": ["Varumärkesteman"],
  "cv_tips": ["3 konkreta tips för CV-förbättring"],
  "linkedin_tips": ["3 tips för LinkedIn-profil"],
  "certification_recommendations": ["Rekommenderade certifieringar"],
  "suggested_learning_paths": ["Föreslagna utbildningsvägar"],
  "market_rate_current": "Nuvarande marknadsvärde i SEK per timme",
  "market_rate_optimized": "Optimerat marknadsvärde i SEK per timme"
}

Använd verklig data från CV:n. Prioritera detekterad personlig information.
`;

    let analysisResults;
    
    try {
      console.log('🤖 Calling GROQ API for analysis...');
      
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
              content: 'Du är expert på CV-analys och HR. Extrahera verklig information från CV:n och returnera giltig JSON på svenska. Prioritera detekterad personlig information.'
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
        const errorText = await groqResponse.text();
        console.error('❌ GROQ API error:', errorText);
        throw new Error(`GROQ API failed: ${groqResponse.status}`);
      }

      const groqData = await groqResponse.json();
      const content = groqData.choices[0]?.message?.content;
      
      console.log('🔍 AI response content:', content);
      
      // Extrahera JSON från svar
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisResults = JSON.parse(jsonMatch[0]);
        
        // Säkerställ att detekterad data används
        if (detectedInfo.emails.length > 0) {
          analysisResults.email = detectedInfo.emails[0];
        }
        if (detectedInfo.phones.length > 0) {
          analysisResults.phone_number = detectedInfo.phones[0];
        }
        if (detectedInfo.names.length > 0) {
          analysisResults.full_name = detectedInfo.names[0];
        }
        
        console.log('✅ Final analysis results:', analysisResults);
      } else {
        throw new Error('No valid JSON found in AI response');
      }
      
    } catch (aiError) {
      console.warn('⚠️ AI analysis failed, using enhanced fallback:', aiError);
      
      // Förbättrad fallback med detekterad data
      analysisResults = {
        full_name: detectedInfo.names[0] || 'Professionell Konsult',
        email: detectedInfo.emails[0] || '',
        phone_number: detectedInfo.phones[0] || '',
        title: 'IT Konsult',
        years_of_experience: 5,
        primary_tech_stack: ['JavaScript', 'React', 'Node.js'],
        secondary_tech_stack: ['TypeScript', 'Python'],
        certifications: [],
        industries: ['Teknologi', 'IT'],
        top_values: ['Innovation', 'Kvalitet', 'Professionell utveckling'],
        personality_traits: ['Analytisk', 'Problemlösare', 'Teamspelare'],
        communication_style: 'Professionell och tydlig',
        tone_of_voice: 'Professionell',
        thought_leadership_score: 5,
        linkedin_engagement_level: 'medium',
        brand_themes: ['Teknisk excellens', 'Innovation'],
        cv_tips: [
          'Lägg till fler kvantifierbara resultat',
          'Förtydliga tekniska kompetenser',
          'Inkludera certifieringar'
        ],
        linkedin_tips: [
          'Dela mer tekniskt innehåll',
          'Engagera dig i branschgrupper',
          'Uppdatera profilen regelbundet'
        ],
        certification_recommendations: ['AWS Certified Solutions Architect', 'Scrum Master'],
        suggested_learning_paths: ['Cloud Computing', 'DevOps', 'AI/ML'],
        market_rate_current: 800,
        market_rate_optimized: 1000
      };
    }

    console.log('✅ AI analysis completed');

    // Step 3: LinkedIn-analys (förenklad)
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
      profile_summary: 'LinkedIn-profil analyserad',
      engagement_metrics: { likes: 0, comments: 0, shares: 0 },
      connections: 500,
      activity_level: 'medium'
    };

    // Step 4: Skapa konsult med förbättrade data
    const consultantData = {
      name: analysisResults.full_name || 'Professionell Konsult',
      email: analysisResults.email || 'temp@matchwise.tech',
      phone: analysisResults.phone_number || '',
      title: analysisResults.title || 'IT Konsult',
      location: 'Sverige',
      skills: [...(analysisResults.primary_tech_stack || []), ...(analysisResults.secondary_tech_stack || [])],
      experience_years: analysisResults.years_of_experience || 5,
      hourly_rate: analysisResults.market_rate_current || 800,
      availability: 'Tillgänglig',
      cv_file_path: file.name,
      certifications: analysisResults.certifications || [],
      languages: ['Svenska', 'Engelska'],
      roles: [analysisResults.title || 'IT Konsult'],
      values: analysisResults.top_values || [],
      communication_style: analysisResults.communication_style || 'Professionell',
      work_style: 'Kollaborativ',
      personality_traits: analysisResults.personality_traits || [],
      team_fit: 'Teamspelare',
      cultural_fit: 5,
      adaptability: 5,
      leadership: Math.min(Math.floor((analysisResults.years_of_experience || 5) / 3), 5),
      type: 'new',
      linkedin_url: linkedinUrl || '',
      
      // Förbättrade fält
      primary_tech_stack: analysisResults.primary_tech_stack || [],
      secondary_tech_stack: analysisResults.secondary_tech_stack || [],
      industries: analysisResults.industries || [],
      top_values: analysisResults.top_values || [],
      tone_of_voice: analysisResults.tone_of_voice || 'Professionell',
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
      
      // Lagra råanalysdata
      cv_analysis_data: { 
        cvText: cvText.substring(0, 1000), // Begränsa storlek
        analysisResults, 
        detectedInfo 
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

    // Uppdatera analyssession
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
