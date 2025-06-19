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

function generateCertificationRecommendations(analysis: any) {
  const skills = getAllSkills(analysis);
  const currentRole = analysis.professionalSummary?.currentRole || '';
  const yearsExp = extractYearsOfExperience(analysis);
  
  const technical = [];
  const business = [];
  
  // Cloud certifications based on current skills
  if (skills.some(skill => skill.toLowerCase().includes('aws'))) {
    technical.push({
      certification: 'AWS Solutions Architect Professional',
      priority: 'High',
      reason: 'Elevate your AWS expertise to architect-level and increase market value significantly',
      timeToComplete: '3-4 months',
      marketValue: '+200-300 SEK/h potential increase'
    });
  } else if (skills.some(skill => skill.toLowerCase().includes('cloud'))) {
    technical.push({
      certification: 'AWS Solutions Architect Associate',
      priority: 'High',
      reason: 'Cloud skills are in extremely high demand in Swedish consulting market',
      timeToComplete: '2-3 months',
      marketValue: '+150-250 SEK/h potential increase'
    });
  }
  
  // Azure certifications
  if (skills.some(skill => skill.toLowerCase().includes('azure')) || skills.some(skill => skill.toLowerCase().includes('microsoft'))) {
    technical.push({
      certification: 'Microsoft Azure Solutions Architect Expert',
      priority: 'High',
      reason: 'Azure expertise opens doors to enterprise consulting opportunities',
      timeToComplete: '3-4 months',
      marketValue: '+200-300 SEK/h potential increase'
    });
  }
  
  // Kubernetes for DevOps/Container skills
  if (skills.some(skill => ['docker', 'kubernetes', 'devops', 'containers'].includes(skill.toLowerCase()))) {
    technical.push({
      certification: 'Certified Kubernetes Administrator (CKA)',
      priority: 'High',
      reason: 'Kubernetes skills are critical for modern cloud-native consulting',
      timeToComplete: '2-3 months',
      marketValue: '+250-350 SEK/h potential increase'
    });
  }
  
  // Security certifications for senior roles
  if (yearsExp >= 5) {
    technical.push({
      certification: 'Certified Information Systems Security Professional (CISSP)',
      priority: 'Medium',
      reason: 'Security expertise significantly increases consulting opportunities and rates',
      timeToComplete: '4-6 months',
      marketValue: '+300-400 SEK/h potential increase'
    });
  }
  
  // Business certifications
  if (yearsExp >= 3) {
    business.push({
      certification: 'Project Management Professional (PMP)',
      priority: 'Medium',
      reason: 'Project management skills essential for senior consulting roles',
      timeToComplete: '3-4 months',
      marketValue: '+150-200 SEK/h potential increase'
    });
  }
  
  if (currentRole.toLowerCase().includes('lead') || currentRole.toLowerCase().includes('architect')) {
    business.push({
      certification: 'Certified ScrumMaster (CSM) Advanced',
      priority: 'High',
      reason: 'Agile leadership certification for technical leaders',
      timeToComplete: '1-2 months',
      marketValue: '+100-150 SEK/h potential increase'
    });
  }
  
  return { technical, business };
}

function generateTechnicalAssessment(analysis: any) {
  const skills = getAllSkills(analysis);
  const yearsExp = extractYearsOfExperience(analysis);
  
  // Assess technical maturity levels
  const frontendSkills = skills.filter(skill => 
    ['react', 'angular', 'vue', 'javascript', 'typescript', 'html', 'css'].includes(skill.toLowerCase())
  ).length;
  
  const backendSkills = skills.filter(skill => 
    ['java', 'python', 'node.js', 'c#', '.net', 'golang', 'rust', 'ruby'].includes(skill.toLowerCase())
  ).length;
  
  const devopsSkills = skills.filter(skill => 
    ['docker', 'kubernetes', 'aws', 'azure', 'gcp', 'jenkins', 'terraform'].includes(skill.toLowerCase())
  ).length;
  
  const dataSkills = skills.filter(skill => 
    ['sql', 'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch'].includes(skill.toLowerCase())
  ).length;
  
  const frontendScore = Math.min(Math.round((frontendSkills * 2 + yearsExp * 0.5)), 10);
  const backendScore = Math.min(Math.round((backendSkills * 1.5 + yearsExp * 0.5)), 10);
  const devopsScore = Math.min(Math.round((devopsSkills * 2 + yearsExp * 0.3)), 10);
  const dataScore = Math.min(Math.round((dataSkills * 1.5 + yearsExp * 0.3)), 10);
  
  const overallScore = Math.round((frontendScore + backendScore + devopsScore + dataScore) / 4);
  
  let overallLevel = 'Junior';
  if (overallScore >= 8) overallLevel = 'Expert';
  else if (overallScore >= 6) overallLevel = 'Senior';
  else if (overallScore >= 4) overallLevel = 'Mid-level';
  
  // Skills gap analysis
  const strongSkills = skills.filter(skill => 
    marketRates.skillMultipliers[skill] && marketRates.skillMultipliers[skill] > 1.1
  );
  
  const missingHighValueSkills = ['AWS', 'Kubernetes', 'Machine Learning', 'System Architecture', 'DevOps']
    .filter(skill => !skills.includes(skill));
  
  // Improvement priorities
  const improvementPriority = [];
  
  if (devopsScore < 6) {
    improvementPriority.push({
      category: 'DevOps & Cloud',
      priority: 'High',
      reason: 'Critical for modern consulting assignments and high market rates',
      skills: ['AWS', 'Kubernetes', 'Docker', 'Terraform'],
      timeline: '3-6 months'
    });
  }
  
  if (overallScore >= 6 && !skills.some(skill => skill.toLowerCase().includes('architect'))) {
    improvementPriority.push({
      category: 'Architecture Skills',
      priority: 'High',
      reason: 'Architecture expertise significantly increases consulting rates and opportunities',
      skills: ['System Design', 'Solution Architecture', 'Technical Leadership'],
      timeline: '6-12 months'
    });
  }
  
  return {
    technicalMaturity: {
      frontendScore,
      backendScore,
      devopsScore,
      dataScore,
      overallLevel
    },
    skillsGapAnalysis: {
      strengths: strongSkills,
      missing: missingHighValueSkills
    },
    improvementPriority
  };
}

function generateROIPredictions(analysis: any) {
  const currentRate = analysis.marketPositioning?.hourlyRateEstimate?.recommended || 1000;
  const yearsExp = extractYearsOfExperience(analysis);
  
  // Current market value
  const monthlyPotential = currentRate * 160; // 20 days * 8 hours
  
  // Improvement potential based on certifications and skill development
  const with6MonthsImprovement = {
    hourlyRate: currentRate + 200,
    monthlyPotential: (currentRate + 200) * 160,
    improvements: ['AWS/Azure certification', 'DevOps skills', 'Consulting experience']
  };
  
  const with1YearImprovement = {
    hourlyRate: currentRate + 400,
    monthlyPotential: (currentRate + 400) * 160,
    improvements: ['Advanced certifications', 'Architecture skills', 'Leadership experience']
  };
  
  const with2YearImprovement = {
    hourlyRate: currentRate + 700,
    monthlyPotential: (currentRate + 700) * 160,
    improvements: ['Expert-level certifications', 'Thought leadership', 'Niche specialization']
  };
  
  // Team fit indicators
  const teamFitValue = {
    startupFit: yearsExp <= 5 ? 4 : 3,
    enterpriseFit: yearsExp >= 3 ? 4 : 2,
    consultingReadiness: Math.min(yearsExp + 3, 10)
  };
  
  return {
    currentMarketValue: {
      hourlyRate: currentRate,
      monthlyPotential
    },
    improvementPotential: {
      with6MonthsImprovement,
      with1YearImprovement,
      with2YearImprovement
    },
    teamFitValue
  };
}

function generatePreUploadGuidance(analysis: any) {
  const yearsExp = extractYearsOfExperience(analysis);
  const skills = getAllSkills(analysis);
  
  const cvOptimization = {
    immediate: [
      {
        area: 'Technical Skills Section',
        action: 'Add a dedicated "Technical Skills" section with clear proficiency levels',
        impact: 'High',
        template: 'Expert: [languages] | Proficient: [frameworks] | Tools: [software]'
      },
      {
        area: 'Quantified Achievements',
        action: 'Add specific numbers and results to each work experience',
        impact: 'High',
        template: 'Improved performance by X%, Led team of Y people, Delivered Z projects'
      },
      {
        area: 'Consulting Experience',
        action: 'Highlight any project-based or consulting work prominently',
        impact: 'High',
        template: 'Project: [Name] | Client: [Type] | Impact: [Results] | Duration: [Timeline]'
      }
    ]
  };
  
  const linkedinOptimization = {
    profile: [
      {
        area: 'Professional Headline',
        action: 'Update headline to clearly state consulting availability',
        impact: 'High',
        template: 'Senior [Role] | Available for Consulting | [Key Skills]'
      },
      {
        area: 'About Section',
        action: 'Write consultant-focused summary with value proposition',
        impact: 'High',
        template: 'Experienced [Role] helping companies [solve what problems] through [your approach]'
      },
      {
        area: 'Recent Activity',
        action: 'Share 2-3 industry insights or project learnings weekly',
        impact: 'Medium',
        template: 'Share technical insights, comment on industry trends, post project successes'
      }
    ]
  };
  
  const timeline = {
    week1: ['Update LinkedIn headline', 'Add technical skills section to CV', 'Quantify 3 major achievements'],
    week2: ['Write new LinkedIn About section', 'Share first industry insight post', 'Update CV with consulting focus'],
    month1: ['Consistent LinkedIn activity', 'Gather client testimonials', 'Optimize for target consulting roles']
  };
  
  return {
    cvOptimization,
    linkedinOptimization,
    timeline
  };
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

    console.log('📄 Processing file:', file.name, 'Type:', file.type, 'Size:', file.size);

    // Get GROQ API key from environment
    const groqApiKey = Deno.env.get('GROQ_API_KEY');
    if (!groqApiKey) {
      console.error('❌ GROQ_API_KEY not found in environment');
      throw new Error('GROQ API key not configured');
    }

    // Enhanced file content extraction
    let fileContent = '';
    let extractedText = '';
    
    try {
      if (file.type === 'application/pdf') {
        console.log('📄 Processing PDF file...');
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        
        // Convert PDF binary to text - improved extraction
        const decoder = new TextDecoder('utf-8', { ignoreBOM: true });
        let rawText = decoder.decode(uint8Array);
        
        // Extract readable text from PDF structure
        // Look for common PDF text patterns and clean them
        const textPatterns = rawText.match(/[A-Za-zÅÄÖåäö0-9\s\-\+\(\)@\.]{10,}/g) || [];
        extractedText = textPatterns.join(' ').replace(/\s+/g, ' ').trim();
        
        // Also try to extract email and phone patterns specifically
        const emailMatch = rawText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g);
        const phoneMatch = rawText.match(/\+?[\d\s\-\(\)]{8,}/g);
        
        if (emailMatch) extractedText += ' EMAIL_FOUND: ' + emailMatch.join(' ');
        if (phoneMatch) extractedText += ' PHONE_FOUND: ' + phoneMatch.join(' ');
        
        fileContent = extractedText.substring(0, 4000); // Increase limit
        console.log('📄 Extracted PDF content length:', fileContent.length);
        console.log('📄 Sample extracted text:', fileContent.substring(0, 200));
      } else {
        // For other file types, try to read as text
        fileContent = await file.text();
        console.log('📄 Read file content length:', fileContent.length);
      }
    } catch (error) {
      console.warn('⚠️ Could not extract file content:', error);
      fileContent = `CV file: ${file.name} (${file.type}) - Could not extract text content directly`;
    }

    // Enhanced prompt for accurate data extraction
    const prompt = `You are a professional CV analyzer. Extract ONLY the real information that is actually present in this CV content.

CV FILE: ${file.name}
CONTENT TO ANALYZE:
${fileContent}

CRITICAL INSTRUCTIONS:
1. Look for REAL contact information (email addresses, phone numbers, names, addresses)
2. Extract ACTUAL work experience, companies, roles, and dates
3. Find REAL technical skills, programming languages, and tools mentioned
4. Use "Not specified" ONLY when information is genuinely not found
5. DO NOT make up or guess any information
6. BE PRECISE - only extract what you can clearly see in the content

Respond with this EXACT JSON format:

{
  "personalInfo": {
    "name": "Extract the actual full name from CV or 'Not specified'",
    "email": "Extract the actual email address from CV or 'Not specified'", 
    "phone": "Extract the actual phone number from CV or 'Not specified'",
    "location": "Extract actual city/location from CV or 'Not specified'",
    "linkedinProfile": "Extract LinkedIn URL if found or 'Not specified'"
  },
  "professionalSummary": {
    "yearsOfExperience": "Calculate from work history or estimate",
    "currentRole": "Extract most recent job title or 'Not specified'",
    "seniorityLevel": "Determine from experience level",
    "careerTrajectory": "Growing, Stable, or Senior based on progression"
  },
  "technicalExpertise": {
    "programmingLanguages": {
      "expert": ["List languages marked as expert/advanced"],
      "proficient": ["List languages marked as proficient/intermediate"],
      "familiar": ["List languages marked as basic/familiar"]
    },
    "frameworks": ["Extract actual frameworks mentioned"],
    "tools": ["Extract actual tools mentioned"],
    "databases": ["Extract database technologies mentioned"],
    "cloudPlatforms": ["Extract cloud platforms if mentioned"],
    "methodologies": ["Extract methodologies like Agile, Scrum"]
  },
  "workExperience": [
    {
      "company": "Extract actual company name",
      "role": "Extract actual job title", 
      "duration": "Extract actual time period worked",
      "technologies": ["Extract technologies used in this role"],
      "achievements": ["Extract specific achievements mentioned"]
    }
  ],
  "education": {
    "degrees": ["Extract actual educational qualifications"],
    "certifications": ["Extract certifications mentioned"],
    "training": ["Extract training courses mentioned"]
  },
  "softSkills": {
    "communication": ["Extract communication skills mentioned"],
    "leadership": ["Extract leadership experience mentioned"],
    "problemSolving": ["Extract problem-solving examples"],
    "teamwork": ["Extract teamwork experience mentioned"]
  },
  "languages": ["Extract spoken languages mentioned"]
}

RESPOND WITH ONLY THE JSON OBJECT - NO ADDITIONAL TEXT.`;

    console.log('🤖 Sending enhanced CV content to GROQ for analysis');

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
            content: 'You are a professional CV analyzer specializing in accurate data extraction. Extract ONLY information that is clearly visible in the CV content. Never make assumptions or create fake data.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1, // Very low temperature for accuracy
        max_tokens: 2500,
      }),
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.error('❌ GROQ API error:', errorText);
      throw new Error(`GROQ API request failed: ${groqResponse.status}`);
    }

    const groqData = await groqResponse.json();
    console.log('✅ GROQ response received');

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
        console.log('📊 Successfully parsed CV analysis');
        console.log('📋 Extracted personal info:', {
          name: analysis.personalInfo?.name,
          email: analysis.personalInfo?.email,
          phone: analysis.personalInfo?.phone,
          location: analysis.personalInfo?.location
        });
      } else {
        throw new Error('No valid JSON found in response');
      }
    } catch (parseError) {
      console.error('❌ Failed to parse GROQ response:', parseError);
      console.log('Raw GROQ response:', groqData.choices[0]?.message?.content);
      
      // Create minimal fallback
      analysis = {
        personalInfo: {
          name: 'Not specified',
          email: 'Not specified',
          phone: 'Not specified',
          location: 'Not specified',
          linkedinProfile: 'Not specified'
        },
        professionalSummary: {
          yearsOfExperience: 'Not specified',
          currentRole: 'Not specified',
          seniorityLevel: 'Not specified',
          careerTrajectory: 'Not specified'
        },
        technicalExpertise: {
          programmingLanguages: { expert: [], proficient: [], familiar: [] },
          frameworks: [],
          tools: [],
          databases: [],
          cloudPlatforms: [],
          methodologies: []
        },
        workExperience: [],
        education: { degrees: [], certifications: [], training: [] },
        softSkills: { communication: [], leadership: [], problemSolving: [], teamwork: [] },
        languages: []
      };
    }

    // Calculate market positioning with extracted data
    const marketPositioning = calculateMarketRate(analysis);
    
    // Add market positioning to analysis
    analysis.marketPositioning = {
      hourlyRateEstimate: marketPositioning,
      targetRoles: analysis.workExperience?.map(exp => exp.role).filter(role => role && role !== 'Not specified') || ['Consultant'],
      competitiveAdvantages: getAllSkills(analysis).slice(0, 5),
      marketDemand: 'Medium'
    };

    // Generate comprehensive insights
    const certificationRecommendations = generateCertificationRecommendations(analysis);
    const technicalAssessment = generateTechnicalAssessment(analysis);
    const roiPredictions = generateROIPredictions(analysis);
    const preUploadGuidance = generatePreUploadGuidance(analysis);

    console.log('✅ CV analysis completed with real extracted data');

    // Return enhanced analysis with all insights
    const enhancedAnalysisResults = {
      cvAnalysis: analysis,
      linkedinAnalysis: null, // Will be populated separately
      certificationRecommendations,
      technicalAssessment,
      roiPredictions,
      preUploadGuidance
    };

    return new Response(
      JSON.stringify({ 
        success: true, 
        analysis: analysis,
        enhancedAnalysisResults
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('❌ CV parsing error:', error);
    
    // Return minimal fallback for errors
    const fallbackAnalysis = {
      personalInfo: {
        name: 'Not specified',
        email: 'Not specified',
        phone: 'Not specified',
        location: 'Not specified',
        linkedinProfile: 'Not specified'
      },
      professionalSummary: {
        yearsOfExperience: 'Not specified',
        currentRole: 'Not specified', 
        seniorityLevel: 'Not specified',
        careerTrajectory: 'Not specified'
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
      education: { degrees: [], certifications: [], training: [] },
      softSkills: { communication: [], leadership: [], problemSolving: [], teamwork: [] },
      languages: [],
      marketPositioning: {
        hourlyRateEstimate: {
          min: 600,
          max: 900,
          recommended: 750,
          currency: 'SEK',
          explanation: 'Estimated rate based on available information.'
        },
        targetRoles: ['Consultant'],
        competitiveAdvantages: [],
        marketDemand: 'Medium'
      }
    };

    const fallbackEnhancedResults = {
      cvAnalysis: fallbackAnalysis,
      linkedinAnalysis: null,
      certificationRecommendations: generateCertificationRecommendations(fallbackAnalysis),
      technicalAssessment: generateTechnicalAssessment(fallbackAnalysis),
      roiPredictions: generateROIPredictions(fallbackAnalysis),
      preUploadGuidance: generatePreUploadGuidance(fallbackAnalysis)
    };

    return new Response(
      JSON.stringify({ 
        success: true, 
        analysis: fallbackAnalysis,
        enhancedAnalysisResults: fallbackEnhancedResults,
        fallback: true,
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
