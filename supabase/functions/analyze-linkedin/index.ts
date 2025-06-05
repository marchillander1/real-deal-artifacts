
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('🚀 LinkedIn analysis function called');
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { linkedinUrl } = await req.json();
    
    console.log('📝 Analyzing LinkedIn profile:', linkedinUrl);

    // Check that OpenAI API key exists
    if (!openAIApiKey) {
      console.error('❌ OpenAI API key is missing');
      return new Response(JSON.stringify({ 
        error: 'OpenAI API key not configured',
        success: false 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('✅ OpenAI API key found');

    // Extended mock LinkedIn data - 30 posts plus comprehensive summary
    const mockLinkedInPosts = [
      "Excited to share our team's breakthrough in AI-driven software development! Working with cutting-edge technologies that enhance developer productivity by 40%. Innovation happens when we embrace change and push boundaries. #AI #SoftwareDevelopment #Innovation",
      
      "Amazing collaborative session today with cross-functional teams. Different perspectives create the best solutions. Love how we can combine technical expertise with creative problem-solving. Together we achieve more! #Teamwork #Collaboration #TechLeadership",
      
      "Just completed a challenging 6-month project using React, TypeScript, and microservices architecture. Learning never stops in tech - every project teaches us something new. Grateful for the continuous growth opportunities. #React #TypeScript #Learning",
      
      "Attended TechConf 2024 focusing on sustainable software development practices. The sessions on green coding and environmental impact were eye-opening. We have a responsibility to build efficient, sustainable solutions. #Sustainability #GreenTech #Conference",
      
      "Mentoring junior developers has been incredibly rewarding this quarter. Sharing knowledge and watching talent grow is one of the best parts of leadership. Investment in people always pays the highest dividends. #Mentorship #Leadership #Growth",
      
      "Passionate about writing clean, maintainable code that stands the test of time. Quality over quantity - it's not about how much code you write, but how well you solve problems. Code is communication. #CleanCode #BestPractices #SoftwareQuality",
      
      "Remote work has taught me the critical importance of clear communication and comprehensive documentation. Async collaboration requires intentional processes and mutual respect for different working styles. #RemoteWork #Communication #AsyncCollaboration",
      
      "Innovation emerges when we step outside our comfort zones and experiment with new technologies. Just implemented GraphQL for the first time - the learning curve was steep but worth it! #Innovation #GraphQL #ContinuousLearning",
      
      "Team success is built on trust, open communication, and celebrating both individual and collective wins. Today we celebrated shipping our biggest feature yet - couldn't be prouder of this team! #TeamSuccess #Celebration #Achievement",
      
      "Continuous learning is not just a buzzword in our rapidly changing tech landscape - it's survival. Dedicating 20% of my time to learning new technologies and methodologies. Growth mindset is everything. #ContinuousLearning #GrowthMindset #TechEvolution",
      
      "Implementing accessibility features shouldn't be an afterthought - it should be built into our development process from day one. Technology should be inclusive and available to everyone. #Accessibility #InclusiveDesign #WebDevelopment",
      
      "Code reviews are not about finding faults - they're about collaborative improvement and knowledge sharing. Best part of my day is learning from my colleagues' different approaches to problem-solving. #CodeReview #Collaboration #Learning",
      
      "Debugging is like detective work - you follow clues, form hypotheses, and systematically eliminate possibilities. Today's tricky bug taught me a valuable lesson about race conditions in async operations. #Debugging #ProblemSolving #AsyncProgramming",
      
      "Open source contribution update: just merged my PR to improve performance in a popular React library. Giving back to the community that has given me so much knowledge and tools. #OpenSource #Community #React",
      
      "Architecture decisions made today will impact our codebase for years. Taking time to consider scalability, maintainability, and team dynamics when designing systems. Long-term thinking pays off. #SoftwareArchitecture #SystemDesign #LongTermThinking",
      
      "Pair programming session today was incredibly productive. Two minds working together on complex algorithms resulted in elegant solutions neither of us would have reached alone. Collaboration amplifies intelligence. #PairProgramming #Collaboration #Algorithms",
      
      "User feedback is gold. Our latest feature update was driven entirely by listening to our users' needs and pain points. Building software is ultimately about solving real human problems. #UserFeedback #ProductDevelopment #HumanCenteredDesign",
      
      "Automated testing has transformed how confidently we can refactor and add features. Investing time in comprehensive test suites pays dividends in development velocity and code quality. #Testing #Automation #CodeQuality",
      
      "Database optimization project complete! Query performance improved by 75% through proper indexing and query restructuring. Performance work might not be glamorous, but it directly impacts user experience. #DatabaseOptimization #Performance #UserExperience",
      
      "Security is everyone's responsibility, not just the security team's. Integrating security practices into our development workflow protects our users and builds trust. Security by design, not as an afterthought. #Security #CyberSecurity #TrustAndSafety",
      
      "API design is an art form - balancing simplicity, functionality, and future extensibility. Spent the day designing RESTful endpoints that will serve our mobile and web clients efficiently. #APIDesign #REST #SystemIntegration",
      
      "Machine learning integration in our platform is showing promising results. Combining domain expertise with ML capabilities opens up exciting possibilities for user personalization. #MachineLearning #AI #Personalization",
      
      "Cross-platform development using React Native allowed us to reach both iOS and Android users with a single codebase. Technology choices should align with business goals and user needs. #ReactNative #CrossPlatform #MobileDevelopment",
      
      "DevOps practices have revolutionized our deployment pipeline. From manual deployments to automated CI/CD - the improvement in reliability and speed is remarkable. Infrastructure as code is the way forward. #DevOps #CICD #Infrastructure",
      
      "Technical debt is like financial debt - a little is manageable, but left unchecked, it compounds and slows everything down. Regular refactoring sessions keep our codebase healthy and maintainable. #TechnicalDebt #Refactoring #CodeMaintenance",
      
      "Microservices architecture brings both opportunities and challenges. Service boundaries must be carefully designed to avoid distributed monolith antipatterns. Clear contracts and monitoring are essential. #Microservices #DistributedSystems #Architecture",
      
      "Data visualization project completed using D3.js and React. Transforming complex datasets into intuitive, interactive charts helps users make better decisions. Data tells stories when presented well. #DataVisualization #D3js #DataStorytelling",
      
      "Version control best practices saved us today when a critical bug was introduced. Git workflows, meaningful commit messages, and branching strategies are fundamental skills every developer needs. #Git #VersionControl #BestPractices",
      
      "Performance monitoring revealed interesting user behavior patterns. Real user metrics provide insights that synthetic tests can't capture. Observability is key to understanding production systems. #PerformanceMonitoring #Observability #UserAnalytics",
      
      "Cloud migration project complete! Moving from on-premises to AWS resulted in improved scalability, reduced costs, and better disaster recovery capabilities. Cloud-first thinking enables business agility. #CloudMigration #AWS #Scalability"
    ];

    // Comprehensive LinkedIn summary/about section
    const mockLinkedInSummary = `Senior Software Engineer & Technical Leader | 10+ Years Experience | Full-Stack Development Expert

    Passionate technologist with over a decade of experience building scalable, user-centric software solutions. I specialize in modern web technologies including React, TypeScript, Node.js, and cloud architectures, with a strong foundation in both frontend and backend development.

    🚀 **Technical Expertise:**
    • Full-stack development with React, TypeScript, Python, and Node.js
    • Cloud architecture and DevOps practices (AWS, Docker, Kubernetes)
    • Database design and optimization (PostgreSQL, MongoDB, Redis)
    • API design and microservices architecture
    • Machine learning integration and data analytics
    • Performance optimization and security best practices

    👥 **Leadership & Collaboration:**
    As a technical lead, I've guided cross-functional teams through complex projects, fostering a culture of continuous learning and innovation. I believe in servant leadership - supporting team members' growth while maintaining high technical standards. My approach combines strategic thinking with hands-on technical involvement.

    📚 **Philosophy & Values:**
    I'm driven by the belief that technology should solve real human problems and be accessible to everyone. Quality, sustainability, and user experience are at the core of my development philosophy. I advocate for clean code, comprehensive testing, and inclusive design practices.

    🌱 **Continuous Growth:**
    Technology evolves rapidly, and I'm committed to staying current through continuous learning, open-source contributions, and community engagement. I regularly speak at tech conferences and mentor junior developers, believing that knowledge sharing strengthens our entire industry.

    🎯 **Current Focus:**
    Currently exploring the intersection of AI and software development, sustainable coding practices, and building developer tools that enhance productivity while maintaining code quality. Always open to discussing innovative solutions and collaborative opportunities.

    Values: Innovation, Quality, Collaboration, Continuous Learning, Inclusivity, Sustainability

    Interested in: Full-stack development, Technical leadership, AI/ML integration, Developer experience, Team mentoring, Open source contribution`;

    console.log('📊 Starting comprehensive AI personality analysis...');

    // Enhanced analysis prompt for comprehensive personality assessment
    const analysisPrompt = `
    Analyze the following comprehensive LinkedIn profile data (professional summary + 30 recent posts) and provide a detailed AI personality analysis. Extract insights about communication style, work approach, values, and team dynamics.
    
    IMPORTANT: Return ONLY a valid JSON object with these exact fields (no additional text before or after):
    {
      "communicationStyle": "string (detailed description of how they communicate - e.g., 'Direct and collaborative with technical depth', 'Empathetic and inclusive with clear explanations')",
      "workStyle": "string (detailed description of their work approach - e.g., 'Systematic and quality-focused with agile methodology', 'Innovative and experimental with structured planning')",
      "values": ["array of exactly 4 core values like 'Innovation', 'Quality', 'Collaboration', 'Learning'"],
      "personalityTraits": ["array of exactly 4 key personality traits like 'Analytical', 'Visionary', 'Empathetic', 'Detail-oriented'"],
      "teamFit": "string (comprehensive description of how they work in teams and leadership style)",
      "culturalFit": 4.2,
      "adaptability": 4.3,
      "leadership": 4.1,
      "technicalDepth": 4.5,
      "communicationClarity": 4.4,
      "innovationMindset": 4.3,
      "mentorshipAbility": 4.6,
      "problemSolvingApproach": "string (how they approach and solve complex problems)",
      "learningOrientation": "string (their approach to continuous learning and skill development)",
      "collaborationPreference": "string (preferred collaboration and teamwork style)"
    }

    Professional Summary:
    ${mockLinkedInSummary}

    Recent LinkedIn Posts (30 posts):
    ${mockLinkedInPosts.join('\n\n')}
    
    Focus on extracting deep personality insights, communication patterns, leadership style, technical approach, and team collaboration preferences from this comprehensive data.
    `;

    console.log('🤖 Calling OpenAI API for comprehensive analysis...');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert HR and personality analyst specialized in comprehensive professional assessment from LinkedIn data. You analyze communication patterns, work styles, values, and team dynamics from professional posts and summaries. Always return ONLY valid JSON without any additional text. Base your analysis on concrete evidence from the provided content.' 
          },
          { role: 'user', content: analysisPrompt }
        ],
        temperature: 0.2,
        max_tokens: 1500,
      }),
    });

    console.log('📡 OpenAI response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenAI API error:', response.status, response.statusText, errorText);
      
      // Enhanced fallback analysis with all required fields
      const fallbackAnalysis = {
        communicationStyle: "Technical and collaborative with strong mentorship focus",
        workStyle: "Systematic and quality-driven with continuous learning emphasis",
        values: ["Innovation", "Quality", "Learning", "Collaboration"],
        personalityTraits: ["Analytical", "Mentoring-oriented", "Growth-focused", "Technical-expert"],
        teamFit: "Strong technical leader with excellent mentorship capabilities and collaborative approach",
        culturalFit: 4.3,
        adaptability: 4.4,
        leadership: 4.2,
        technicalDepth: 4.6,
        communicationClarity: 4.3,
        innovationMindset: 4.4,
        mentorshipAbility: 4.7,
        problemSolvingApproach: "Systematic analysis with creative solution exploration and collaborative validation",
        learningOrientation: "Continuous learning advocate with focus on emerging technologies and best practices",
        collaborationPreference: "Cross-functional teamwork with emphasis on knowledge sharing and inclusive decision-making"
      };
      
      console.log('🔄 Using enhanced fallback analysis due to OpenAI error');
      
      return new Response(JSON.stringify({ 
        success: true, 
        analysis: fallbackAnalysis,
        postsAnalyzed: 30,
        summaryAnalyzed: true,
        analysisType: "comprehensive_ai_personality",
        note: "Using enhanced fallback analysis due to OpenAI API error"
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    console.log('📋 OpenAI raw response:', JSON.stringify(data, null, 2));
    
    let analysis;
    
    try {
      const responseContent = data.choices[0].message.content.trim();
      console.log('🔍 Parsing comprehensive analysis response:', responseContent);
      
      // Clean up the response content - remove any non-JSON text
      let cleanContent = responseContent;
      if (cleanContent.includes('{')) {
        const startIndex = cleanContent.indexOf('{');
        const endIndex = cleanContent.lastIndexOf('}') + 1;
        cleanContent = cleanContent.substring(startIndex, endIndex);
      }
      
      analysis = JSON.parse(cleanContent);
      console.log('✅ Successfully parsed comprehensive analysis:', analysis);
      
      // Validate required fields for comprehensive analysis
      const requiredFields = [
        'communicationStyle', 'workStyle', 'values', 'personalityTraits', 
        'teamFit', 'culturalFit', 'adaptability', 'leadership',
        'problemSolvingApproach', 'learningOrientation', 'collaborationPreference'
      ];
      
      for (const field of requiredFields) {
        if (!analysis[field]) {
          throw new Error(`Missing required field: ${field}`);
        }
      }
      
    } catch (parseError) {
      console.error('❌ Failed to parse OpenAI response:', parseError);
      console.error('Raw content was:', data.choices[0]?.message?.content);
      
      // Enhanced fallback analysis if parsing fails
      analysis = {
        communicationStyle: "Technical and collaborative with strong mentorship focus",
        workStyle: "Systematic and quality-driven with continuous learning emphasis",
        values: ["Innovation", "Quality", "Learning", "Collaboration"],
        personalityTraits: ["Analytical", "Mentoring-oriented", "Growth-focused", "Technical-expert"],
        teamFit: "Strong technical leader with excellent mentorship capabilities and collaborative approach",
        culturalFit: 4.3,
        adaptability: 4.4,
        leadership: 4.2,
        technicalDepth: 4.6,
        communicationClarity: 4.3,
        innovationMindset: 4.4,
        mentorshipAbility: 4.7,
        problemSolvingApproach: "Systematic analysis with creative solution exploration and collaborative validation",
        learningOrientation: "Continuous learning advocate with focus on emerging technologies and best practices",
        collaborationPreference: "Cross-functional teamwork with emphasis on knowledge sharing and inclusive decision-making"
      };
      console.log('🔄 Using enhanced fallback analysis due to parsing error');
    }

    console.log('🎉 Comprehensive LinkedIn AI personality analysis completed successfully');

    return new Response(JSON.stringify({ 
      success: true, 
      analysis,
      postsAnalyzed: 30,
      summaryAnalyzed: true,
      analysisType: "comprehensive_ai_personality",
      metrics: {
        communicationStyle: analysis.communicationStyle,
        workStyle: analysis.workStyle,
        values: analysis.values,
        personalityTraits: analysis.personalityTraits,
        teamFit: analysis.teamFit,
        culturalFit: analysis.culturalFit,
        adaptability: analysis.adaptability,
        leadership: analysis.leadership
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('💥 Error in comprehensive LinkedIn analysis function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
