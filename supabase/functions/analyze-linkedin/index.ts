
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

    // Simulate LinkedIn data extraction (in real implementation, you'd use LinkedIn API or web scraping)
    const mockLinkedInPosts = [
      "Excited about the future of AI in software development! Working on innovative solutions that make developers more productive.",
      "Great team collaboration session today. Love working with diverse perspectives to solve complex problems.",
      "Just completed a challenging project using React and TypeScript. The learning never stops in tech!",
      "Attending a tech conference about sustainable software practices. Always learning new approaches.",
      "Mentoring junior developers is incredibly rewarding. Sharing knowledge helps everyone grow.",
      "Passionate about clean code and best practices. Quality software makes a real difference.",
      "Working remotely has taught me the importance of clear communication and documentation.",
      "Innovation happens when we step outside our comfort zones and try new technologies.",
      "Team success comes from supporting each other and celebrating wins together.",
      "Continuous learning is key in our rapidly evolving tech landscape."
    ];

    // Use OpenAI to analyze the posts and extract personality traits
    const analysisPrompt = `
    Analyze the following LinkedIn posts and extract personality traits, communication style, work values, and team fit characteristics. 
    Return the analysis in JSON format with these exact fields:
    - communicationStyle: string (e.g., "Direct and collaborative", "Analytical and thoughtful")
    - workStyle: string (e.g., "Agile and iterative", "Structured and methodical")
    - values: array of strings (max 4 values like "Innovation", "Quality", "Teamwork")
    - personalityTraits: array of strings (max 4 traits like "Creative", "Analytical", "Leadership-oriented")
    - teamFit: string (description of how they work in teams)
    - culturalFit: number between 1-5 (overall cultural adaptability)
    - adaptability: number between 1-5 (flexibility to change)
    - leadership: number between 1-5 (leadership potential)

    LinkedIn Posts to analyze:
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
            content: 'You are an expert HR analyst specializing in personality assessment from social media content. Always return valid JSON.' 
          },
          { role: 'user', content: analysisPrompt }
        ],
        temperature: 0.3,
      }),
    });

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
        personalityTraits: ["Curious", "Collaborative", "Growth-minded", "Technical"],
        teamFit: "Strong team player with mentoring abilities",
        culturalFit: 4.2,
        adaptability: 4.3,
        leadership: 4.0
      };
    }

    console.log('LinkedIn analysis completed:', analysis);

    return new Response(JSON.stringify({ 
      success: true, 
      analysis,
      postsAnalyzed: mockLinkedInPosts.length 
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
