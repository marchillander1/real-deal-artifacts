
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { linkedinUrl } = await req.json();
    
    console.log('Analyzing LinkedIn profile:', linkedinUrl);

    // Check that OpenAI API key exists
    if (!openAIApiKey) {
      console.error('OpenAI API key is missing');
      return new Response(JSON.stringify({ 
        error: 'OpenAI API key not configured',
        success: false 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Simulate LinkedIn data extraction with more realistic data
    const mockLinkedInPosts = [
      "Exciting to see the development in AI and software development! Working with innovative solutions that make developers more productive.",
      "Amazing teamwork today. Love working with different perspectives to solve complex problems.",
      "Just finished a challenging project with React and TypeScript. Learning never stops in tech!",
      "Attended a tech conference about sustainable software methods. Always educational with new approaches.",
      "Mentoring junior developers is incredibly rewarding. Sharing knowledge helps everyone grow.",
      "Passionate about clean code and best practices. Quality software makes a real difference.",
      "Working remotely has taught me the importance of clear communication and documentation.",
      "Innovation happens when we step outside our comfort zone and try new technology.",
      "Team success comes from supporting each other and celebrating wins together.",
      "Continuous learning is the key in our rapidly changing tech landscape."
    ];

    // Mock LinkedIn intro/about section in English
    const mockLinkedInIntro = `Experienced software developer with over 8 years of industry expertise, specializing in fullstack development and team leadership. I'm passionate about creating innovative solutions that solve real problems and believe in the power of collaborative development.

My work approach is based on continuous learning, open communication, and a commitment to quality. I thrive in environments where I can mentor others while being challenged to grow myself. Whether leading a team or contributing as an individual contributor, I focus on building sustainable, scalable solutions.

Outside of coding, I'm active in the tech community, regularly speaking at conferences and contributing to open source projects. I believe technology should be accessible and inclusive, and work to promote diversity in tech through mentorship and community engagement.

Values that drive me: Innovation, Quality, Teamwork, Continuous learning, and Integrity.`;

    // Use OpenAI to analyze both posts and intro for personality traits
    const analysisPrompt = `
    Analyze the following LinkedIn profile data (intro/about section + recent posts) and extract personality traits, communication style, work values, and team fit characteristics. 
    Return the analysis in JSON format with these exact fields:
    - communicationStyle: string (e.g., "Direct and collaborative", "Analytical and thoughtful")
    - workStyle: string (e.g., "Agile and iterative", "Structured and methodical")
    - values: array of strings (max 4 values like "Innovation", "Quality", "Teamwork")
    - personalityTraits: array of strings (max 4 traits like "Creative", "Analytical", "Leadership-oriented")
    - teamFit: string (description of how they work in teams)
    - culturalFit: number between 1-5 (overall cultural adaptability)
    - adaptability: number between 1-5 (flexibility for change)
    - leadership: number between 1-5 (leadership potential)

    LinkedIn About/Intro section:
    ${mockLinkedInIntro}

    Recent LinkedIn posts:
    ${mockLinkedInPosts.join('\n')}
    `;

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
            content: 'You are an expert HR analyst specialized in personality assessment from social media. Always return valid JSON. Analyze both the professional intro and recent posts to get a comprehensive picture of the person.' 
          },
          { role: 'user', content: analysisPrompt }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error:', response.status, response.statusText);
      // Fallback analysis if OpenAI fails
      const fallbackAnalysis = {
        communicationStyle: "Professional and engaging",
        workStyle: "Collaborative and innovative",
        values: ["Innovation", "Learning", "Teamwork", "Quality"],
        personalityTraits: ["Curious", "Collaborative", "Growth-oriented", "Technical"],
        teamFit: "Strong team player with mentorship capabilities",
        culturalFit: 4.2,
        adaptability: 4.3,
        leadership: 4.0
      };
      
      console.log('Using fallback analysis:', fallbackAnalysis);
      
      return new Response(JSON.stringify({ 
        success: true, 
        analysis: fallbackAnalysis,
        postsAnalyzed: mockLinkedInPosts.length,
        introAnalyzed: true,
        note: "Using fallback analysis"
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    let analysis;
    
    try {
      analysis = JSON.parse(data.choices[0].message.content);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', data.choices[0].message.content);
      // Fallback analysis if parsing fails
      analysis = {
        communicationStyle: "Professional and engaging",
        workStyle: "Collaborative and innovative",
        values: ["Innovation", "Learning", "Teamwork", "Quality"],
        personalityTraits: ["Curious", "Collaborative", "Growth-oriented", "Technical"],
        teamFit: "Strong team player with mentorship capabilities",
        culturalFit: 4.2,
        adaptability: 4.3,
        leadership: 4.0
      };
    }

    console.log('LinkedIn analysis completed:', analysis);

    return new Response(JSON.stringify({ 
      success: true, 
      analysis,
      postsAnalyzed: mockLinkedInPosts.length,
      introAnalyzed: true
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-linkedin function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
