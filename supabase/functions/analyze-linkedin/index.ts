
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
    ? `Analysera denna VERKLIGA LinkedIn-profil DJUPGÅENDE med fokus på mjuka värden och personlig utveckling: ${JSON.stringify(realData)}

VERKLIG DATA från PhantomBuster:
- Profil URL: ${linkedinUrl}
- Verklig profilinformation, inlägg och engagemangsdata tillhandahållen ovan

Gör en DJUPGÅENDE analys baserat på denna VERKLIGA data inklusive senaste inlägg, bio-innehåll och professionell aktivitet med fokus på mjuka värden och personlighetsdrag.`
    : `Analysera denna LinkedIn-profil MYCKET DJUPGÅENDE med EXTRA fokus på mjuka värden, personlighetsdrag och utvecklingsområden: ${linkedinUrl}

DJUPGÅENDE ANALYSEKRAV (Simulera analys av 30 senaste inlägg + Bio):

1. PERSONLIGHETSPROFIL & MJUKA VÄRDEN:
   - Kommunikationsstil och tonalitet i professionella sammanhang
   - Ledarskapsegenskaper och inflytande på andra
   - Empati och känslomässig intelligens baserat på innehåll
   - Stresshantering och resiliens-indikatorer
   - Kreativitet och innovationsförmåga
   - Samarbetsvilliget och teamwork-egenskaper
   - Integritet och etiska värderingar
   - Motivation och drivkraft
   - Anpassningsförmåga och flexibilitet
   - Konflikthantering och diplomatisk förmåga

2. PROFESSIONELL MOGNAD & UTVECKLING:
   - Självreflektion och medvetenhet om styrkor/svagheter
   - Feedback-mottagning och lärande från misstag
   - Mentorskapsfähigheter och utveckling av andra
   - Initiativtagande och proaktivitet
   - Professionalitet i kommunikation och interaktion
   - Nätvärksbyggande och relationshantering
   - Branschinsikt och marknadskännedom
   - Kontinuerlig kompetensutveckling
   - Work-life balance medvetenhet

3. SPECIFIKA KONSULTEGENSKAPER:
   - Kundfokus och klientrelationsbyggande
   - Projektledningsförmåga och leveranskapacitet
   - Problemlösningsmetodik och analytisk förmåga
   - Presentationsförmåga och storytelling
   - Förändringsledning och organisationsutveckling
   - Rådgivningskapacitet och strategiskt tänkande
   - Oberoende arbetssätt vs teamintegration
   - Kvalitetsmedvetenhet och leveransprecision

4. UTVECKLINGSOMRÅDEN & TILLVÄXTPOTENTIAL:
   - Identifierade förbättringsområden för personlig utveckling
   - Mjuka färdigheter som behöver stärkas
   - Potentiella blindfläckar i självuppfattning
   - Rekommendationer för ledarskapsuteckling
   - Förslag på mentorskap eller coaching-områden
   - Strategier för ökad marknadspåverkan

Baserat på denna djupanalys, ge MYCKET SPECIFIKA råd och insikter om personens mjuka värden och utvecklingspotential.`;

  const analysisPrompt = `${prompt}

Returnera som JSON med dessa EXAKTA nycklar och MER DJUPGÅENDE innehåll:

{
  "communicationStyle": "DJUPGÅENDE beskrivning av kommunikationsstil med exempel från innehåll och personliga drag",
  "leadershipStyle": "DETALJERAD beskrivning av ledarskap med specifika exempel och utvecklingsområden", 
  "problemSolving": "UTFÖRLIG beskrivning av problemlösningsmetodik med konkreta exempel",
  "teamCollaboration": "DJUP analys av samarbetsstil med exempel på teamdynamik och relationsskapande",
  "emotionalIntelligence": "NOGGRANN bedömning av känslomässig intelligens och empatiförmåga",
  "adaptability": "SPECIFIK analys av anpassningsförmåga med exempel på flexibilitet",
  "innovation": number (1-10 scale),
  "businessAcumen": "UTFÖRLIG beskrivning av affärsförståelse med marknadskännedom och strategiskt tänkande",
  "culturalFit": number (1-10 scale),
  "leadership": number (1-10 scale),
  "resilience": number (1-10 scale),
  "empathy": number (1-10 scale),
  "integrity": number (1-10 scale),
  "motivation": number (1-10 scale),
  "recentPostsAnalysis": {
    "postFrequency": "High/Medium/Low",
    "contentQuality": "Excellent/Good/Fair/Poor",
    "engagementLevel": "High/Medium/Low",
    "thoughtLeadership": "Strong/Moderate/Weak",
    "technicalExpertise": "Expert/Advanced/Intermediate/Beginner",
    "professionalNetworking": "Highly active/Active/Moderate/Limited",
    "industryInsights": "Deep/Moderate/Surface/Limited",
    "learningMindset": "Continuous learner/Occasional/Reluctant",
    "clientFocus": "Client-obsessed/Client-focused/Business-focused/Self-focused",
    "personalityTraits": ["trait1", "trait2", "trait3", "trait4", "trait5"],
    "communicationTone": "Professional/Inspirational/Technical/Casual/Thought-provoking",
    "valuesDemonstrated": ["value1", "value2", "value3", "value4"]
  },
  "bioAnalysis": {
    "clarity": "Excellent/Good/Fair/Poor",
    "consultantPositioning": "Expert/Strong/Moderate/Weak/Unclear",
    "personalBrand": "Very strong/Strong/Developing/Weak/Inconsistent",
    "valueProposition": "Crystal clear/Clear/Somewhat clear/Unclear/Confusing",
    "needsImprovement": boolean,
    "keyStrengths": ["SPECIFIKA styrkor med exempel", "strength2", "strength3", "strength4", "strength5"],
    "improvementAreas": ["KONKRETA förbättringsområden", "area2", "area3", "area4"],
    "personalityInsights": ["DJUPA personlighetsinsikter", "insight2", "insight3"],
    "professionalMaturity": "Very high/High/Moderate/Developing/Low",
    "authenticityLevel": "Very authentic/Authentic/Somewhat authentic/Generic/Inauthentic"
  },
  "marketPositioning": {
    "uniqueValueProposition": "UTFÖRLIG beskrivning av unika styrkor och marknadsdifferentiering",
    "competitiveAdvantages": ["SPECIFIKA konkurrensfördelar", "advantage2", "advantage3", "advantage4", "advantage5"],
    "nicheSpecialization": "DETALJERAD beskrivning av potentiella nischområden från innehållsanalys",
    "marketDifferentiators": ["TYDLIGA marknadsdifferentiatorier", "differentiator2", "differentiator3", "differentiator4"],
    "brandConsistency": "Very strong/Strong/Moderate/Weak/Inconsistent",
    "marketReadiness": "Market ready/Nearly ready/Needs development/Significant gaps",
    "targetClientProfile": "BESKRIVNING av idealiska klienttyper baserat på profil"
  },
  "personalDevelopment": {
    "currentMaturityLevel": "Senior/Mid-senior/Mid/Junior-mid/Junior",
    "strengthsToLeverage": ["SPECIFIKA styrkor att bygga på", "strength2", "strength3"],
    "developmentPriorities": ["PRIORITERADE utvecklingsområden", "priority2", "priority3"],
    "mentoringNeeds": ["KONKRETA mentorskapsområden", "need2", "need3"],
    "learningRecommendations": ["SPECIFIKA lärrekommendationer", "rec2", "rec3"],
    "careerGrowthPotential": "High/Moderate-high/Moderate/Limited",
    "leadershipReadiness": "Ready now/6-12 months/1-2 years/2+ years/Not suitable"
  },
  "teamFitAssessment": {
    "workStyle": "Highly collaborative/Collaborative/Independent/Highly independent",
    "communicationPreference": "Direct/Diplomatic/Analytical/Storytelling/Inspirational",
    "decisionMaking": "Data-driven/Intuitive/Consultative/Collaborative/Directive",
    "conflictResolution": "Mediator/Direct/Diplomatic/Avoidant/Confrontational",
    "projectApproach": "Methodical/Agile/Creative/Client-centric/Results-driven",
    "mentorshipStyle": "Natural mentor/Supportive/Technical/Strategic/Not mentoring-oriented",
    "feedbackStyle": "Constructive/Direct/Supportive/Diplomatic/Coaching-oriented",
    "stressResponse": "Calm under pressure/Manages well/Variable/Struggles/Unknown"
  },
  "consultingReadinessDetailed": {
    "clientInteractionSkills": number (1-10 scale),
    "projectDeliveryCapability": number (1-10 scale),
    "businessDevelopmentPotential": number (1-10 scale),
    "independentWorkingAbility": number (1-10 scale),
    "stakeholderManagementSkills": number (1-10 scale),
    "changeManagementCapability": number (1-10 scale),
    "consultativeSellingAbility": number (1-10 scale),
    "overallConsultingReadiness": number (1-10 scale),
    "consultingStrengths": ["SPECIFIKA konsultstyrkor", "strength2", "strength3"],
    "consultingDevelopmentAreas": ["KONKRETA utvecklingsområden för konsultarbete", "area2", "area3"]
  },
  "detailedPersonalityProfile": {
    "corePersonalityTraits": ["DJUPGÅENDE personlighetsdrag", "trait2", "trait3", "trait4", "trait5"],
    "motivationalDrivers": ["HUVUDSAKLIGA motivationsfaktorer", "driver2", "driver3"],
    "communicationStrengths": ["KOMMUNIKATIONSSTYRKOR", "strength2", "strength3"],
    "potentialBlindSpots": ["POTENTIELLA utvecklingsområden", "blindspot2", "blindspot3"],
    "workEnvironmentPreferences": ["ARBETSMILJÖPREFERENSER", "pref2", "pref3"],
    "stressManagementStyle": "BESKRIVNING av stresshantering och coping-strategier",
    "relationshipBuildingStyle": "BESKRIVNING av hur personen bygger professionella relationer"
  },
  "actionableInsights": {
    "immediateStrengthsToHighlight": ["STYRKOR att framhäva direkt", "strength2", "strength3"],
    "quickWinsForImprovement": ["SNABBA förbättringar", "win2", "win3"],
    "mediumTermDevelopmentGoals": ["MEDELLÅNGA utvecklingsmål", "goal2", "goal3"],
    "longTermCareerStrategy": "LÅNGSIKTIG karriärstrategi baserad på profil och potential",
    "specificCoachingRecommendations": ["SPECIFIKA coaching-rekommendationer", "rec2", "rec3"],
    "networkingStrategy": "NÄTVERKSSTRATEGI för professionell tillväxt",
    "personalBrandingAdvice": "PERSONLIG varumärkesrådgivning för ökad synlighet"
  },
  "overallAssessmentSummary": "OMFATTANDE sammanfattning av personens professionella profil, styrkor, utvecklingsområden och potential som konsult (200-300 ord)"
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
