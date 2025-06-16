
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Market data for Swedish consulting rates (SEK/hour)
const marketRates = {
  // Base rates by experience level
  experienceLevels: {
    junior: { min: 600, max: 900, avg: 750 },      // 0-2 years
    midLevel: { min: 800, max: 1200, avg: 1000 },  // 3-5 years  
    senior: { min: 1000, max: 1500, avg: 1250 },   // 6-8 years
    expert: { min: 1300, max: 2000, avg: 1650 },   // 9+ years
    architect: { min: 1500, max: 2500, avg: 2000 } // 10+ years with architecture experience
  },
  
  // Premium multipliers for high-demand skills
  skillMultipliers: {
    'Cloud Architecture': 1.3,
    'AWS': 1.25,
    'Azure': 1.25,
    'GCP': 1.2,
    'Kubernetes': 1.3,
    'DevOps': 1.25,
    'Machine Learning': 1.4,
    'AI': 1.4,
    'Blockchain': 1.5,
    'React': 1.1,
    'Angular': 1.1,
    'Vue.js': 1.05,
    'Node.js': 1.15,
    'Python': 1.15,
    'Java': 1.1,
    'C#': 1.1,
    '.NET': 1.1,
    'Golang': 1.2,
    'Rust': 1.3,
    'TypeScript': 1.1,
    'GraphQL': 1.2,
    'Microservices': 1.2,
    'System Architecture': 1.3,
    'Security': 1.25,
    'Cybersecurity': 1.3
  },
  
  // Role-based adjustments
  roleMultipliers: {
    'Solution Architect': 1.4,
    'Technical Architect': 1.4,
    'System Architect': 1.4,
    'Tech Lead': 1.3,
    'Team Lead': 1.25,
    'Senior Developer': 1.2,
    'Full Stack Developer': 1.15,
    'Frontend Developer': 1.0,
    'Backend Developer': 1.1,
    'DevOps Engineer': 1.25,
    'Data Engineer': 1.2,
    'Data Scientist': 1.3,
    'ML Engineer': 1.35,
    'Security Engineer': 1.3,
    'Consultant': 1.1,
    'Senior Consultant': 1.25
  }
};

function calculateMarketRate(analysis: any): { min: number, max: number, recommended: number, currency: string, explanation: string } {
  // Determine experience level
  const yearsExp = extractYearsOfExperience(analysis);
  let baseRate = getBaseRateByExperience(yearsExp);
  
  // Apply skill multipliers
  const skillMultiplier = calculateSkillMultiplier(analysis);
  
  // Apply role multiplier
  const roleMultiplier = calculateRoleMultiplier(analysis);
  
  // Calculate final rates
  const totalMultiplier = skillMultiplier * roleMultiplier;
  
  const adjustedMin = Math.round(baseRate.min * totalMultiplier);
  const adjustedMax = Math.round(baseRate.max * totalMultiplier);
  const recommended = Math.round(baseRate.avg * totalMultiplier);
  
  // Generate explanation
  const explanation = generateRateExplanation(yearsExp, skillMultiplier, roleMultiplier, baseRate);
  
  return {
    min: adjustedMin,
    max: adjustedMax,
    recommended: recommended,
    currency: 'SEK',
    explanation: explanation
  };
}

function extractYearsOfExperience(analysis: any): number {
  // Try to extract from professional summary
  if (analysis.professionalSummary?.yearsOfExperience) {
    const yearsStr = analysis.professionalSummary.yearsOfExperience;
    const match = yearsStr.match(/(\d+)/);
    if (match) {
      return parseInt(match[1]);
    }
  }
  
  // Try to calculate from work experience
  if (analysis.workExperience && Array.isArray(analysis.workExperience)) {
    // Estimate based on number of positions and typical duration
    return Math.min(analysis.workExperience.length * 2.5, 15);
  }
  
  // Default to mid-level if unclear
  return 4;
}

function getBaseRateByExperience(years: number) {
  if (years <= 2) return marketRates.experienceLevels.junior;
  if (years <= 5) return marketRates.experienceLevels.midLevel;
  if (years <= 8) return marketRates.experienceLevels.senior;
  if (years <= 12) return marketRates.experienceLevels.expert;
  return marketRates.experienceLevels.architect;
}

function calculateSkillMultiplier(analysis: any): number {
  let maxMultiplier = 1.0;
  const skills = getAllSkills(analysis);
  
  skills.forEach(skill => {
    const multiplier = marketRates.skillMultipliers[skill] || 1.0;
    if (multiplier > maxMultiplier) {
      maxMultiplier = multiplier;
    }
  });
  
  return maxMultiplier;
}

function calculateRoleMultiplier(analysis: any): number {
  const currentRole = analysis.professionalSummary?.currentRole || '';
  const targetRoles = analysis.marketPositioning?.targetRoles || [];
  
  // Check current role
  for (const [role, multiplier] of Object.entries(marketRates.roleMultipliers)) {
    if (currentRole.toLowerCase().includes(role.toLowerCase())) {
      return multiplier as number;
    }
  }
  
  // Check target roles
  for (const targetRole of targetRoles) {
    for (const [role, multiplier] of Object.entries(marketRates.roleMultipliers)) {
      if (targetRole.toLowerCase().includes(role.toLowerCase())) {
        return multiplier as number;
      }
    }
  }
  
  return 1.0;
}

function getAllSkills(analysis: any): string[] {
  const skills = new Set<string>();
  
  // Technical skills
  if (analysis.technicalExpertise?.programmingLanguages?.expert) {
    analysis.technicalExpertise.programmingLanguages.expert.forEach((skill: string) => skills.add(skill));
  }
  if (analysis.technicalExpertise?.programmingLanguages?.proficient) {
    analysis.technicalExpertise.programmingLanguages.proficient.forEach((skill: string) => skills.add(skill));
  }
  if (analysis.technicalExpertise?.frameworks) {
    analysis.technicalExpertise.frameworks.forEach((skill: string) => skills.add(skill));
  }
  if (analysis.technicalExpertise?.tools) {
    analysis.technicalExpertise.tools.forEach((skill: string) => skills.add(skill));
  }
  
  // Skills from other sections
  if (analysis.skills) {
    analysis.skills.forEach((skill: string) => skills.add(skill));
  }
  
  return Array.from(skills);
}

function generateRateExplanation(years: number, skillMultiplier: number, roleMultiplier: number, baseRate: any): string {
  let explanation = `Based on ${years} years of experience (${baseRate.avg} SEK/h base rate)`;
  
  if (skillMultiplier > 1.0) {
    explanation += `, premium skills (+${Math.round((skillMultiplier - 1) * 100)}%)`;
  }
  
  if (roleMultiplier > 1.0) {
    explanation += `, leadership/architecture role (+${Math.round((roleMultiplier - 1) * 100)}%)`;
  }
  
  explanation += '. Rates based on current Swedish consulting market.';
  
  return explanation;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🚀 Starting CV parsing...');
    
    // Get the uploaded file from FormData
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      throw new Error('No file provided');
    }

    console.log('📄 Processing file:', file.name, 'Type:', file.type);

    // Use GROQ API for CV analysis
    const groqApiKey = Deno.env.get('GROQ_API_KEY');
    if (!groqApiKey) {
      throw new Error('GROQ API key not configured');
    }

    // Convert file to base64 for API
    const fileBuffer = await file.arrayBuffer();
    const base64File = btoa(String.fromCharCode(...new Uint8Array(fileBuffer)));

    const prompt = `Analyze this CV/resume and extract comprehensive professional information. 

Please provide a detailed analysis covering:

PERSONAL INFORMATION:
- Full name
- Email address  
- Phone number
- Location/Address
- LinkedIn profile URL

PROFESSIONAL SUMMARY:
- Years of total experience
- Current role/title
- Seniority level (Junior/Mid-level/Senior/Expert/Architect)
- Career trajectory (Growing/Stable/Advancing)

TECHNICAL EXPERTISE:
- Programming languages (categorize as Expert/Proficient/Familiar)
- Frameworks and libraries
- Tools and platforms
- Databases
- Cloud platforms
- Methodologies

WORK EXPERIENCE:
- List of previous positions with company, role, duration
- Key achievements and responsibilities
- Technologies used in each role

EDUCATION & CERTIFICATIONS:
- Educational background
- Professional certifications
- Training programs

SOFT SKILLS:
- Communication abilities
- Leadership experience
- Problem-solving approach
- Team collaboration style

LANGUAGES:
- Spoken languages and proficiency levels

Return as JSON with this structure:
{
  "personalInfo": {
    "name": "string",
    "email": "string", 
    "phone": "string",
    "location": "string",
    "linkedinProfile": "string"
  },
  "professionalSummary": {
    "yearsOfExperience": "string",
    "currentRole": "string",
    "seniorityLevel": "Junior|Mid-level|Senior|Expert|Architect",
    "careerTrajectory": "string"
  },
  "technicalExpertise": {
    "programmingLanguages": {
      "expert": ["string"],
      "proficient": ["string"],
      "familiar": ["string"]
    },
    "frameworks": ["string"],
    "tools": ["string"],
    "databases": ["string"],
    "cloudPlatforms": ["string"],
    "methodologies": ["string"]
  },
  "workExperience": [
    {
      "company": "string",
      "role": "string", 
      "duration": "string",
      "technologies": ["string"],
      "achievements": ["string"]
    }
  ],
  "education": {
    "degrees": ["string"],
    "certifications": ["string"],
    "training": ["string"]
  },
  "softSkills": {
    "communication": ["string"],
    "leadership": ["string"],
    "problemSolving": ["string"],
    "teamwork": ["string"]
  },
  "languages": ["string"]
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
            content: 'You are a professional CV/resume analyzer. Extract information accurately and format as requested JSON. If information is not available, use "Unknown" or empty arrays as appropriate. Always respond in English.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 2000,
      }),
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.error('❌ GROQ API error:', errorText);
      throw new Error(`GROQ API request failed: ${groqResponse.status}`);
    }

    const groqData = await groqResponse.json();
    console.log('✅ GROQ response received:', groqData);

    let analysis;
    try {
      const content = groqData.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content in GROQ response');
      }

      // Extract JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.warn('⚠️ Failed to parse GROQ response, using fallback:', parseError);
      analysis = {
        personalInfo: {
          name: 'Unknown',
          email: 'Unknown',
          phone: 'Unknown', 
          location: 'Unknown',
          linkedinProfile: 'Unknown'
        },
        professionalSummary: {
          yearsOfExperience: 'Unknown',
          currentRole: 'Software Developer',
          seniorityLevel: 'Mid-level',
          careerTrajectory: 'Advancing'
        },
        technicalExpertise: {
          programmingLanguages: {
            expert: [],
            proficient: [],
            familiar: []
          },
          frameworks: [],
          tools: [],
          databases: [],
          cloudPlatforms: [],
          methodologies: []
        },
        workExperience: [],
        education: {
          degrees: [],
          certifications: [],
          training: []
        },
        softSkills: {
          communication: ['Professional communication'],
          leadership: ['Team collaboration'],
          problemSolving: ['Analytical thinking'],
          teamwork: ['Collaborative approach']
        },
        languages: ['English']
      };
    }

    // Calculate market positioning with enhanced rate calculation
    const marketPositioning = calculateMarketRate(analysis);
    
    // Add market positioning to analysis
    analysis.marketPositioning = {
      hourlyRateEstimate: marketPositioning,
      targetRoles: analysis.professionalSummary?.currentRole ? [analysis.professionalSummary.currentRole] : ['Software Developer'],
      competitiveAdvantages: getAllSkills(analysis).slice(0, 5),
      marketDemand: 'High'
    };

    console.log('✅ CV analysis completed with market positioning:', analysis);

    return new Response(
      JSON.stringify({ 
        success: true, 
        analysis: analysis 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('❌ CV parsing error:', error);
    
    // Return fallback analysis with basic market positioning
    const fallbackAnalysis = {
      personalInfo: {
        name: 'Analysis failed',
        email: 'Analysis failed',
        phone: 'Analysis failed',
        location: 'Sweden',
        linkedinProfile: 'Unknown'
      },
      professionalSummary: {
        yearsOfExperience: 'Unknown',
        currentRole: 'Consultant', 
        seniorityLevel: 'Mid-level',
        careerTrajectory: 'Stable'
      },
      technicalExpertise: {
        programmingLanguages: {
          expert: [],
          proficient: [],
          familiar: []
        },
        frameworks: [],
        tools: [],
        databases: [],
        cloudPlatforms: [],
        methodologies: []
      },
      workExperience: [],
      education: {
        degrees: [],
        certifications: [],
        training: []
      },
      softSkills: {
        communication: ['Professional communication'],
        leadership: ['Team collaboration'],
        problemSolving: ['Analytical thinking'],
        teamwork: ['Collaborative approach']
      },
      languages: ['English'],
      marketPositioning: {
        hourlyRateEstimate: {
          min: 800,
          max: 1200,
          recommended: 1000,
          currency: 'SEK',
          explanation: 'Estimated rate based on mid-level consulting experience in Swedish market.'
        },
        targetRoles: ['Consultant'],
        competitiveAdvantages: [],
        marketDemand: 'Medium'
      }
    };

    return new Response(
      JSON.stringify({ 
        success: true, 
        analysis: fallbackAnalysis,
        fallback: true,
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
