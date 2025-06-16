
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('📄 CV Analysis function called');
    
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      throw new Error('No file provided');
    }

    console.log('📄 Processing file:', file.name, 'Size:', file.size);

    const fileBuffer = await file.arrayBuffer();
    const fileContent = new TextDecoder().decode(fileBuffer);
    
    console.log('📄 File content length:', fileContent.length);

    if (!GROQ_API_KEY) {
      console.warn('⚠️ No GROQ API key found, returning basic analysis');
      return new Response(JSON.stringify({
        success: true,
        analysis: {
          personalInfo: {
            name: 'Unknown',
            email: 'Unknown',
            phone: 'Unknown',
            location: 'Unknown'
          },
          experience: 'Unknown',
          seniorityLevel: 'Unknown',
          strengths: ['Technical skills'],
          marketPosition: 'Mid-level',
          technicalDepth: 'Good',
          improvementAreas: ['Profile optimization']
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const analysisPrompt = `Analyze this CV/resume content and provide a comprehensive analysis in the following JSON structure. Be thorough and specific:

CV Content:
${fileContent.substring(0, 8000)}

Return ONLY valid JSON in this exact structure:
{
  "personalInfo": {
    "name": "Full name from CV",
    "email": "Email address",
    "phone": "Phone number", 
    "location": "Location/city",
    "linkedinProfile": "LinkedIn URL if found",
    "githubProfile": "GitHub URL if found",
    "portfolio": "Portfolio URL if found",
    "languages": ["Swedish", "English"]
  },
  "technicalSkillsAnalysis": {
    "programmingLanguages": {
      "expert": ["Languages with 5+ years or expert level"],
      "proficient": ["Languages with 2-4 years experience"],
      "familiar": ["Languages with <2 years or basic knowledge"]
    },
    "frontendTechnologies": {
      "frameworks": ["React", "Vue", "Angular", etc],
      "styling": ["CSS", "Sass", "Tailwind", etc],
      "stateManagement": ["Redux", "Vuex", etc],
      "buildTools": ["Webpack", "Vite", etc],
      "testingFrameworks": ["Jest", "Cypress", etc]
    },
    "backendTechnologies": {
      "frameworks": ["Node.js", "Express", "Django", etc],
      "databases": ["PostgreSQL", "MongoDB", etc],
      "messageQueues": ["RabbitMQ", "Kafka", etc],
      "caching": ["Redis", "Memcached", etc],
      "apiDesign": ["REST", "GraphQL", etc]
    },
    "cloudAndInfrastructure": {
      "platforms": ["AWS", "Azure", "GCP", etc],
      "containerization": ["Docker", "Kubernetes", etc],
      "cicd": ["Jenkins", "GitHub Actions", etc],
      "monitoring": ["Prometheus", "Grafana", etc],
      "iac": ["Terraform", "CloudFormation", etc]
    },
    "specializedSkills": {
      "aiMl": ["TensorFlow", "PyTorch", etc],
      "security": ["OWASP", "Penetration testing", etc],
      "mobile": ["React Native", "Flutter", etc],
      "dataEngineering": ["Apache Spark", "Kafka", etc]
    },
    "technicalDepthAssessment": "Deep analysis of technical expertise level",
    "emergingTechAdoption": "Assessment of adoption of new technologies"
  },
  "leadershipCapabilities": {
    "technicalLeadership": {
      "architecturalDecisions": "Evidence of system design and architecture decisions",
      "codeReviewAndMentoring": "Experience with code reviews and mentoring",
      "technicalVision": "Ability to set technical direction"
    },
    "teamLeadership": {
      "teamSize": "Number of people managed/led",
      "projectManagement": "Project management experience",
      "crossFunctionalCollaboration": "Working across teams",
      "conflictResolution": "Handling team conflicts"
    },
    "strategicLeadership": {
      "businessAlignment": "Aligning technical decisions with business goals",
      "stakeholderManagement": "Managing stakeholder relationships",
      "changeManagement": "Leading organizational changes",
      "innovationDriving": "Driving innovation and new initiatives"
    },
    "leadershipStyle": "Collaborative/Directive/Servant/Transformational",
    "leadershipPotential": "Assessment of future leadership potential"
  },
  "personalityTraits": {
    "problemSolvingApproach": "Analytical/Creative/Systematic",
    "communicationStyle": "Direct/Collaborative/Persuasive",
    "workStyle": "Independent/Team-oriented/Hybrid",
    "adaptability": "High/Medium/Low adaptability to change",
    "initiativeTaking": "Proactive/Reactive approach",
    "attentionToDetail": "High/Medium/Low attention to detail",
    "continuousLearning": "Evidence of continuous learning",
    "stressHandling": "How they handle pressure",
    "teamOrientation": "Preference for team vs individual work",
    "innovationMindset": "Openness to innovation and experimentation"
  },
  "careerPotential": {
    "currentLevel": "Junior/Mid/Senior/Lead/Principal/Architect",
    "experienceProgression": "Career trajectory analysis",
    "nextCareerSteps": ["Potential next roles"],
    "leadershipReadiness": 1-5,
    "specialistVsGeneralist": "Specialist/Generalist/Hybrid",
    "marketValue": "High/Medium/Low market demand",
    "growthTrajectory": "Rapid/Steady/Slow growth potential",
    "competitiveAdvantages": ["Unique strengths"],
    "developmentAreas": ["Areas for improvement"],
    "salaryProgression": "Expected salary growth"
  },
  "professionalSummary": {
    "yearsOfExperience": "X years",
    "seniorityLevel": "Junior/Mid/Senior/Lead/Principal",
    "industryFocus": ["Industries worked in"],
    "specializations": ["Key technical specializations"],
    "careerTrajectory": "Upward/Lateral/Varied trajectory",
    "currentRole": "Current or most recent role title",
    "uniqueValueProposition": "What makes this person unique"
  },
  "workExperience": [
    {
      "title": "Job title",
      "company": "Company name",
      "duration": "Start - End dates",
      "responsibilities": ["Key responsibilities"],
      "achievements": ["Quantified achievements"],
      "technologies": ["Technologies used"],
      "teamSize": "Size of team if leadership role",
      "impact": "Business impact of the role"
    }
  ],
  "projects": [
    {
      "name": "Project name",
      "description": "Project description",
      "technologies": ["Technologies used"],
      "role": "Your role in the project",
      "impact": "Impact/results of the project",
      "challenges": "Technical challenges faced",
      "learnings": "Key learnings from the project"
    }
  ],
  "education": {
    "formal": [
      {
        "degree": "Degree name",
        "institution": "University/school",
        "year": "Graduation year",
        "relevantCourses": ["Relevant courses"],
        "thesis": "Thesis topic if applicable"
      }
    ],
    "certifications": ["Professional certifications"],
    "continuousLearning": ["Online courses, bootcamps"],
    "professionalDevelopment": ["Conferences, workshops attended"]
  },
  "marketPositioning": {
    "uniqueValueProposition": "What sets this person apart",
    "competitiveAdvantages": ["Key competitive advantages"],
    "targetRoles": ["Suitable roles for this person"],
    "salaryBenchmarks": {
      "stockholm": "SEK X,XXX-Y,YYY/hour",
      "gothenburg": "SEK X,XXX-Y,YYY/hour", 
      "malmo": "SEK X,XXX-Y,YYY/hour",
      "remote": "SEK X,XXX-Y,YYY/hour"
    },
    "hourlyRateEstimate": {
      "min": 800,
      "max": 1200,
      "recommended": 1000,
      "currency": "SEK"
    },
    "marketReadiness": 1-5,
    "competitiveness": "High/Medium/Low",
    "demandLevel": "High/Medium/Low",
    "growthPotential": "Strong potential for X% annual growth"
  },
  "consultingReadiness": {
    "independentWorkAbility": "High/Medium/Low",
    "clientCommunication": "Excellent/Good/Needs development",
    "problemSolvingInNewEnvironments": "Strong/Average/Weak",
    "adaptabilityToClientCultures": "High/Medium/Low",
    "businessAcumen": "Strong/Average/Weak",
    "deliveryFocus": "Results-oriented/Process-oriented",
    "consultingExperience": "X years of consulting experience"
  }
}`;

    console.log('🤖 Calling Groq API for CV analysis...');
    
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: 'You are an expert CV analyzer specializing in technical consultants in Sweden. Analyze CVs comprehensively and provide detailed insights. Always respond with valid JSON only, no additional text.'
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
        temperature: 0.3,
        max_tokens: 4000
      })
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.error('❌ Groq API error:', groqResponse.status, errorText);
      throw new Error(`Groq API error: ${groqResponse.status}`);
    }

    const groqData = await groqResponse.json();
    const analysisText = groqData.choices[0].message.content;
    
    console.log('✅ Groq analysis completed, parsing JSON...');
    
    // Clean and parse the JSON response
    let analysis;
    try {
      const cleanedJson = analysisText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      analysis = JSON.parse(cleanedJson);
      console.log('✅ JSON parsed successfully');
    } catch (parseError) {
      console.error('❌ JSON parsing failed:', parseError);
      console.log('Raw response:', analysisText);
      
      // Fallback analysis
      analysis = {
        personalInfo: {
          name: 'Unknown',
          email: 'Unknown', 
          phone: 'Unknown',
          location: 'Unknown'
        },
        professionalSummary: {
          yearsOfExperience: 'Unknown',
          seniorityLevel: 'Mid-level',
          currentRole: 'Developer'
        },
        marketPositioning: {
          hourlyRateEstimate: {
            min: 800,
            max: 1200,
            recommended: 1000,
            currency: 'SEK'
          }
        }
      };
    }

    return new Response(JSON.stringify({
      success: true,
      analysis: analysis,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ CV analysis failed:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
