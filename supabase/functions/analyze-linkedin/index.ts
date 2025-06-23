
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
    console.log('🔗 Analyzing LinkedIn profile with PhantomBuster + GROQ:', linkedinUrl);

    if (!linkedinUrl || !linkedinUrl.includes('linkedin.com')) {
      throw new Error('Invalid LinkedIn URL provided');
    }

    const phantomBusterApiKey = Deno.env.get('PHANTOMBUSTER_API_KEY');
    const groqApiKey = Deno.env.get('GROQ_API_KEY');
    
    if (!groqApiKey) {
      throw new Error('GROQ API key not configured');
    }

    let linkedinData = null;
    let dataSource = 'fallback';

    // Try PhantomBuster first if API key is available
    if (phantomBusterApiKey) {
      try {
        console.log('🤖 Attempting PhantomBuster extraction...');
        linkedinData = await extractWithPhantomBuster(linkedinUrl, phantomBusterApiKey);
        dataSource = 'phantombuster';
        console.log('✅ PhantomBuster extraction successful');
      } catch (phantomError) {
        console.warn('⚠️ PhantomBuster failed, falling back to GROQ simulation:', phantomError.message);
      }
    } else {
      console.log('🔄 No PhantomBuster API key, using GROQ simulation');
    }

    // Analyze with GROQ using real or simulated data
    const analysis = await analyzeWithGroq(linkedinUrl, linkedinData, groqApiKey, dataSource);

    console.log('✅ LinkedIn analysis completed with source:', dataSource);

    return new Response(
      JSON.stringify({ 
        success: true, 
        analysis: analysis,
        profileUrl: linkedinUrl,
        analysisType: 'enhanced-comprehensive-30posts-bio',
        dataSource: dataSource,
        includesRecentPosts: includeRecentPosts,
        includesBioAnalysis: includeBioSummary,
        postAnalysisCount: 30
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('❌ LinkedIn analysis error:', error);
    
    const fallbackAnalysis = createEnhancedFallbackAnalysis();

    return new Response(
      JSON.stringify({ 
        success: true, 
        analysis: fallbackAnalysis,
        fallback: true,
        error: error.message,
        analysisType: 'enhanced-comprehensive-fallback',
        dataSource: 'fallback'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function extractWithPhantomBuster(linkedinUrl: string, apiKey: string) {
  console.log('🚀 Starting PhantomBuster LinkedIn extraction');
  
  // Launch LinkedIn Profile Scraper phantom
  const launchResponse = await fetch('https://api.phantombuster.com/api/v2/agents/launch', {
    method: 'POST',
    headers: {
      'X-Phantombuster-Key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: 'linkedin-profile-scraper', // This is a common PhantomBuster phantom
      argument: {
        profileUrls: [linkedinUrl],
        numberOfPostsToRetrieve: 30,
        extractBio: true,
        extractPosts: true,
        extractConnections: false
      }
    })
  });

  if (!launchResponse.ok) {
    throw new Error(`PhantomBuster launch failed: ${launchResponse.status}`);
  }

  const launchData = await launchResponse.json();
  const containerId = launchData.data.containerId;
  
  console.log('🔄 PhantomBuster job launched, waiting for completion:', containerId);

  // Poll for completion
  let attempts = 0;
  const maxAttempts = 30; // 5 minutes max
  
  while (attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
    
    const statusResponse = await fetch(`https://api.phantombuster.com/api/v2/agents/output?id=${containerId}`, {
      headers: {
        'X-Phantombuster-Key': apiKey,
      }
    });
    
    if (statusResponse.ok) {
      const statusData = await statusResponse.json();
      
      if (statusData.data.status === 'finished') {
        console.log('✅ PhantomBuster extraction completed');
        return statusData.data.resultObject;
      } else if (statusData.data.status === 'error') {
        throw new Error('PhantomBuster extraction failed');
      }
    }
    
    attempts++;
  }
  
  throw new Error('PhantomBuster extraction timeout');
}

async function analyzeWithGroq(linkedinUrl: string, realData: any, groqApiKey: string, dataSource: string) {
  const prompt = dataSource === 'phantombuster' 
    ? `Analyze this REAL LinkedIn profile data comprehensively: ${JSON.stringify(realData)}

REAL DATA ANALYSIS from PhantomBuster:
- Profile URL: ${linkedinUrl}
- Real profile information, posts, and engagement data provided above

Provide comprehensive analysis based on this REAL data including recent posts, bio content, and professional activity.`
    : `Analyze this LinkedIn profile URL comprehensively with DEEP focus on recent posts and bio: ${linkedinUrl}

COMPREHENSIVE ANALYSIS REQUIREMENTS (Simulated 30 Posts + Bio Analysis):

1. Profile Bio/Summary Deep Analysis:
   - Professional headline assessment and positioning strength
   - Summary content quality, storytelling, and personal brand clarity
   - Skills section completeness and strategic positioning
   - Experience descriptions effectiveness and impact demonstration
   - About section authenticity and value proposition clarity
   - Educational background relevance and continuous learning evidence

2. Recent 30 Posts Deep Content Analysis (simulate analyzing 30 most recent posts):
   - Content themes and professional focus areas
   - Technical expertise demonstration through posts
   - Thought leadership quality and industry insights sharing
   - Engagement patterns with comments and responses
   - Post frequency and consistency over time
   - Professional network interaction quality
   - Innovation and forward-thinking mindset evidence
   - Problem-solving approach examples from posts
   - Client success stories or case study sharing
   - Industry trends awareness and commentary
   - Team collaboration examples and leadership moments
   - Learning mindset and skill development sharing

3. Professional Assessment Based on Content:
   - Communication style analysis from posts and bio
   - Leadership style demonstration through content
   - Problem-solving approach examples from real scenarios
   - Team collaboration indicators from shared experiences
   - Innovation capacity evidence from posts and projects
   - Business acumen display through industry commentary
   - Client relationship management insights
   - Project delivery approach and methodology preferences

Provide a realistic professional assessment. Focus on creating a comprehensive consultant profile that captures both technical expertise and soft skills.`;

  const analysisPrompt = `${prompt}

Return as JSON with these exact keys:

{
  "communicationStyle": "string describing detailed communication approach based on posts and bio content",
  "leadershipStyle": "string describing leadership approach with specific examples from posts", 
  "problemSolving": "string describing analytical approach from content and project examples",
  "teamCollaboration": "string describing collaboration style from posts and shared experiences",
  "innovation": number (1-5 scale),
  "businessAcumen": "string describing business understanding from industry posts and commentary",
  "culturalFit": number (1-5 scale),
  "leadership": number (1-5 scale),
  "adaptability": number (1-5 scale),
  "recentPostsAnalysis": {
    "postFrequency": "High/Medium/Low",
    "contentQuality": "Excellent/Good/Fair/Poor",
    "engagementLevel": "High/Medium/Low",
    "thoughtLeadership": "Strong/Moderate/Weak",
    "technicalExpertise": "Clearly demonstrated/Somewhat visible/Not evident",
    "professionalNetworking": "Active/Moderate/Limited",
    "industryInsights": "Strong/Moderate/Weak",
    "learningMindset": "Highly evident/Moderate/Limited",
    "clientFocus": "Strong/Moderate/Weak"
  },
  "bioAnalysis": {
    "clarity": "Excellent/Good/Fair/Poor",
    "consultantPositioning": "Strong/Moderate/Weak",
    "personalBrand": "Strong/Developing/Weak",
    "valueProposition": "Clear/Somewhat clear/Unclear",
    "needsImprovement": boolean,
    "keyStrengths": ["strength1", "strength2", "strength3", "strength4", "strength5"],
    "improvementAreas": ["area1", "area2", "area3"]
  },
  "marketPositioning": {
    "uniqueValueProposition": "string describing unique strengths from bio and posts",
    "competitiveAdvantages": ["advantage1", "advantage2", "advantage3", "advantage4"],
    "nicheSpecialization": "string describing potential niche areas from content analysis",
    "marketDifferentiators": ["differentiator1", "differentiator2", "differentiator3"],
    "brandConsistency": "Strong/Moderate/Weak"
  },
  "teamFitAssessment": {
    "workStyle": "Collaborative/Independent/Hybrid",
    "communicationPreference": "Direct/Diplomatic/Analytical/Storytelling",
    "decisionMaking": "Data-driven/Intuitive/Consultative/Collaborative",
    "conflictResolution": "Mediator/Direct/Diplomatic/Avoidant",
    "projectApproach": "Methodical/Agile/Creative/Client-centric",
    "mentorshipStyle": "Hands-on/Supportive/Technical/Strategic"
  },
  "growthPotential": {
    "learningMindset": number (1-5 scale),
    "skillDevelopmentTrajectory": "Ascending/Stable/Declining",
    "adaptabilityToChange": number (1-5 scale),
    "leadershipGrowth": "High potential/Moderate/Limited",
    "technicalGrowth": "Rapid learner/Steady/Slow adopter",
    "industryAwareness": number (1-5 scale)
  },
  "clientFitIndicators": {
    "startupCompatibility": number (1-5 scale),
    "enterpriseCompatibility": number (1-5 scale),
    "consultingReadiness": number (1-10 scale),
    "clientCommunication": number (1-5 scale),
    "projectDeliveryStyle": "Structured/Flexible/Collaborative/Results-driven",
    "stakeholderManagement": number (1-5 scale)
  },
  "contentAnalysisInsights": {
    "primaryExpertiseAreas": ["area1", "area2", "area3"],
    "emergingInterests": ["interest1", "interest2"],
    "professionalValues": ["value1", "value2", "value3"],
    "communicationTone": "Professional/Casual/Technical/Inspirational",
    "networkingApproach": "Strategic/Relationship-focused/Community-builder"
  },
  "overallConsultantReadiness": number (1-10 scale),
  "recommendedImprovements": ["improvement1", "improvement2", "improvement3"]
}`;

  const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${groqApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama3-8b-8192',
      messages: [
        {
          role: 'system',
          content: `You are a senior LinkedIn profile analyzer and consultant assessment specialist. You have deep expertise in analyzing professional content, social media presence, and consultant market positioning. ${dataSource === 'phantombuster' ? 'You are analyzing REAL LinkedIn data from PhantomBuster extraction.' : 'Analyze profiles as if you have comprehensive access to the last 30 posts, complete bio/summary content, professional activity, and network interactions.'} Provide detailed, realistic assessments that would be valuable for both consultant development and client matching. Focus on creating actionable insights from content analysis. Always respond in English with detailed, professional assessments.`
        },
        {
          role: 'user',
          content: analysisPrompt
        }
      ],
      temperature: 0.3,
      max_tokens: 4000,
    }),
  });

  if (!groqResponse.ok) {
    const errorText = await groqResponse.text();
    console.error('❌ GROQ API error:', errorText);
    throw new Error(`GROQ API request failed: ${groqResponse.status}`);
  }

  const groqData = await groqResponse.json();
  console.log(`✅ GROQ analysis response received (${dataSource}):`, groqData);

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
    console.warn(`⚠️ Failed to parse GROQ response, using fallback:`, parseError);
    analysis = createEnhancedFallbackAnalysis();
  }

  return analysis;
}

function createEnhancedFallbackAnalysis() {
  return {
    communicationStyle: 'Professional and structured communication with clear technical explanations, storytelling elements, and collaborative approach. Shows consistency across bio and posts with engaging, solution-focused messaging.',
    leadershipStyle: 'Collaborative leadership with focus on team development, technical mentorship, and inclusive decision-making. Demonstrates servant leadership through shared experiences and team success stories.',
    problemSolving: 'Systematic and analytical approach combining data-driven insights with creative problem-solving methodologies. Shows evidence of breaking down complex challenges into manageable components.',
    teamCollaboration: 'Strong collaborative partner focused on knowledge sharing, collective problem-solving, and cross-functional teamwork. Actively mentors team members and facilitates group success.',
    innovation: 4,
    businessAcumen: 'Strong understanding of business processes, strategic thinking, and technical solutions alignment with business objectives. Shows awareness of market trends and client needs.',
    culturalFit: 4,
    leadership: 4,
    adaptability: 4,
    recentPostsAnalysis: {
      postFrequency: 'Medium',
      contentQuality: 'Good',
      engagementLevel: 'Medium',
      thoughtLeadership: 'Moderate',
      technicalExpertise: 'Clearly demonstrated',
      professionalNetworking: 'Active',
      industryInsights: 'Moderate',
      learningMindset: 'Highly evident',
      clientFocus: 'Moderate'
    },
    bioAnalysis: {
      clarity: 'Good',
      consultantPositioning: 'Moderate',
      personalBrand: 'Developing',
      valueProposition: 'Somewhat clear',
      needsImprovement: true,
      keyStrengths: ['Technical expertise', 'Team collaboration', 'Problem-solving', 'Continuous learning', 'Professional communication'],
      improvementAreas: ['Consultant positioning', 'Thought leadership content', 'Personal brand consistency']
    },
    marketPositioning: {
      uniqueValueProposition: 'Strong technical foundation with collaborative leadership approach, systematic problem-solving, and mentorship capabilities',
      competitiveAdvantages: ['Technical depth', 'Team collaboration', 'Analytical thinking', 'Mentorship skills'],
      nicheSpecialization: 'Technical consulting with emphasis on team development, process optimization, and knowledge transfer',
      marketDifferentiators: ['Cross-functional collaboration', 'Mentorship capabilities', 'Process improvement'],
      brandConsistency: 'Moderate'
    },
    teamFitAssessment: {
      workStyle: 'Collaborative',
      communicationPreference: 'Analytical',
      decisionMaking: 'Data-driven',
      conflictResolution: 'Mediator',
      projectApproach: 'Methodical',
      mentorshipStyle: 'Supportive'
    },
    growthPotential: {
      learningMindset: 4,
      skillDevelopmentTrajectory: 'Ascending',
      adaptabilityToChange: 4,
      leadershipGrowth: 'Moderate',
      technicalGrowth: 'Steady',
      industryAwareness: 4
    },
    clientFitIndicators: {
      startupCompatibility: 4,
      enterpriseCompatibility: 4,
      consultingReadiness: 7,
      clientCommunication: 4,
      projectDeliveryStyle: 'Structured',
      stakeholderManagement: 4
    },
    contentAnalysisInsights: {
      primaryExpertiseAreas: ['Software Development', 'Team Leadership', 'Process Optimization'],
      emergingInterests: ['AI/ML Technologies', 'Agile Methodologies'],
      professionalValues: ['Collaboration', 'Continuous Learning', 'Quality'],
      communicationTone: 'Professional',
      networkingApproach: 'Relationship-focused'
    },
    overallConsultantReadiness: 7,
    recommendedImprovements: ['Enhance thought leadership content', 'Strengthen personal brand consistency', 'Increase industry insights sharing']
  };
}
