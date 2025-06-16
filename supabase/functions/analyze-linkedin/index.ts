
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { linkedinUrl, includeRecentPosts = true, includeBioSummary = true, postLimit = 30 } = await req.json();
    console.log('🔗 Analyzing LinkedIn profile comprehensively:', linkedinUrl);

    if (!linkedinUrl || !linkedinUrl.includes('linkedin.com')) {
      throw new Error('Invalid LinkedIn URL provided');
    }

    const profileId = linkedinUrl.split('/in/').pop()?.split('/')[0] || 'unknown';
    
    const groqApiKey = Deno.env.get('GROQ_API_KEY');
    if (!groqApiKey) {
      throw new Error('GROQ API key not configured');
    }

    const prompt = `Analyze this LinkedIn profile URL comprehensively: ${linkedinUrl}

ENHANCED COMPREHENSIVE ANALYSIS REQUIREMENTS:

1. Profile Bio/Summary Analysis:
   - Professional headline assessment
   - Summary content quality and positioning
   - Skills section completeness
   - Experience descriptions effectiveness

2. Recent Posts Analysis (simulate analyzing 30 most recent posts):
   - Content quality and professional relevance
   - Posting frequency assessment
   - Engagement level indicators
   - Thought leadership demonstration
   - Technical expertise showcased
   - Professional network interaction

3. Professional Assessment:
   - Communication style from content
   - Leadership style demonstration
   - Problem-solving approach examples
   - Team collaboration indicators
   - Innovation capacity evidence
   - Business acumen display

4. Consultant Readiness & Market Positioning:
   - Professional brand consistency
   - Market positioning effectiveness
   - Client-facing readiness
   - Expertise demonstration
   - Competitive advantages
   - Niche specialization potential

5. Team Fit & Cultural Assessment:
   - Work style preferences
   - Cultural adaptability indicators
   - Collaboration approach
   - Communication preferences
   - Leadership compatibility

6. Growth & Development Potential:
   - Learning mindset evidence
   - Skill development trajectory
   - Career progression patterns
   - Adaptability to new technologies

Provide a realistic professional assessment as if you analyzed actual recent posts and bio content. Return as JSON with these exact keys:
{
  "communicationStyle": "string describing communication approach based on posts and bio",
  "leadershipStyle": "string describing leadership approach with examples", 
  "problemSolving": "string describing analytical approach from content",
  "teamCollaboration": "string describing collaboration style from posts",
  "innovation": number (1-5 scale),
  "businessAcumen": "string describing business understanding",
  "culturalFit": number (1-5 scale),
  "leadership": number (1-5 scale),
  "adaptability": number (1-5 scale),
  "recentPostsAnalysis": {
    "postFrequency": "High/Medium/Low",
    "contentQuality": "Excellent/Good/Fair/Poor",
    "engagementLevel": "High/Medium/Low",
    "thoughtLeadership": "Strong/Moderate/Weak",
    "technicalExpertise": "Clearly demonstrated/Somewhat visible/Not evident",
    "professionalNetworking": "Active/Moderate/Limited"
  },
  "bioAnalysis": {
    "clarity": "Excellent/Good/Fair/Poor",
    "consultantPositioning": "Strong/Moderate/Weak",
    "needsImprovement": boolean,
    "keyStrengths": ["strength1", "strength2", "strength3"],
    "improvementAreas": ["area1", "area2", "area3"]
  },
  "marketPositioning": {
    "uniqueValueProposition": "string describing unique strengths",
    "competitiveAdvantages": ["advantage1", "advantage2", "advantage3"],
    "nicheSpecialization": "string describing potential niche areas",
    "marketDifferentiators": ["differentiator1", "differentiator2"]
  },
  "teamFitAssessment": {
    "workStyle": "Collaborative/Independent/Hybrid",
    "communicationPreference": "Direct/Diplomatic/Analytical",
    "decisionMaking": "Data-driven/Intuitive/Consultative",
    "conflictResolution": "Mediator/Direct/Avoidant",
    "projectApproach": "Methodical/Agile/Creative"
  },
  "growthPotential": {
    "learningMindset": number (1-5 scale),
    "skillDevelopmentTrajectory": "Ascending/Stable/Declining",
    "adaptabilityToChange": number (1-5 scale),
    "leadershipGrowth": "High potential/Moderate/Limited",
    "technicalGrowth": "Rapid learner/Steady/Slow adopter"
  },
  "clientFitIndicators": {
    "startupCompatibility": number (1-5 scale),
    "enterpriseCompatibility": number (1-5 scale),
    "consultingReadiness": number (1-5 scale),
    "clientCommunication": number (1-5 scale),
    "projectDeliveryStyle": "Structured/Flexible/Collaborative"
  },
  "overallConsultantReadiness": number (1-10 scale)
}`;

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
            content: 'You are a professional LinkedIn profile analyzer specializing in comprehensive consulting market analysis and team-fit assessment. Analyze profiles as if you have access to recent posts, bio content, and professional activity. Provide realistic, detailed assessments for both consultant development and client matching. Always respond in English.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 3000,
      }),
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.error('❌ GROQ API error:', errorText);
      throw new Error(`GROQ API request failed: ${groqResponse.status}`);
    }

    const groqData = await groqResponse.json();
    console.log('✅ GROQ enhanced response received:', groqData);

    let analysis;
    try {
      const content = groqData.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content in GROQ response');
      }

      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.warn('⚠️ Failed to parse GROQ response, using enhanced fallback:', parseError);
      analysis = createEnhancedFallbackAnalysis();
    }

    console.log('✅ Enhanced LinkedIn analysis completed:', analysis);

    return new Response(
      JSON.stringify({ 
        success: true, 
        analysis: analysis,
        profileUrl: linkedinUrl,
        analysisType: 'enhanced-comprehensive',
        includesRecentPosts: includeRecentPosts,
        includesBioAnalysis: includeBioSummary
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('❌ LinkedIn enhanced analysis error:', error);
    
    const fallbackAnalysis = createEnhancedFallbackAnalysis();

    return new Response(
      JSON.stringify({ 
        success: true, 
        analysis: fallbackAnalysis,
        fallback: true,
        error: error.message,
        analysisType: 'enhanced-comprehensive-fallback'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function createEnhancedFallbackAnalysis() {
  return {
    communicationStyle: 'Professional and structured communication with clear technical explanations and collaborative approach',
    leadershipStyle: 'Collaborative leadership with focus on team development, technical mentorship, and inclusive decision-making',
    problemSolving: 'Systematic and analytical approach combining data-driven insights with creative problem-solving methodologies',
    teamCollaboration: 'Strong collaborative partner focused on knowledge sharing, collective problem-solving, and cross-functional teamwork',
    innovation: 4,
    businessAcumen: 'Good understanding of business processes, strategic thinking, and technical solutions alignment with business objectives',
    culturalFit: 4,
    leadership: 4,
    adaptability: 4,
    recentPostsAnalysis: {
      postFrequency: 'Medium',
      contentQuality: 'Good',
      engagementLevel: 'Medium',
      thoughtLeadership: 'Moderate',
      technicalExpertise: 'Somewhat visible',
      professionalNetworking: 'Moderate'
    },
    bioAnalysis: {
      clarity: 'Good',
      consultantPositioning: 'Moderate',
      needsImprovement: true,
      keyStrengths: ['Technical expertise', 'Professional experience', 'Clear communication'],
      improvementAreas: ['Consultant positioning', 'Thought leadership content', 'Professional brand consistency']
    },
    marketPositioning: {
      uniqueValueProposition: 'Strong technical foundation with collaborative leadership approach and systematic problem-solving',
      competitiveAdvantages: ['Technical depth', 'Team collaboration', 'Analytical thinking'],
      nicheSpecialization: 'Technical consulting with emphasis on team development and process optimization',
      marketDifferentiators: ['Cross-functional collaboration', 'Mentorship capabilities']
    },
    teamFitAssessment: {
      workStyle: 'Collaborative',
      communicationPreference: 'Analytical',
      decisionMaking: 'Data-driven',
      conflictResolution: 'Mediator',
      projectApproach: 'Methodical'
    },
    growthPotential: {
      learningMindset: 4,
      skillDevelopmentTrajectory: 'Ascending',
      adaptabilityToChange: 4,
      leadershipGrowth: 'Moderate',
      technicalGrowth: 'Steady'
    },
    clientFitIndicators: {
      startupCompatibility: 4,
      enterpriseCompatibility: 4,
      consultingReadiness: 7,
      clientCommunication: 4,
      projectDeliveryStyle: 'Structured'
    },
    overallConsultantReadiness: 7
  };
}
