
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { assignment, consultant, matchData, type } = await req.json();
    
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    let prompt = '';
    
    if (type === 'match_letter') {
      prompt = `Generate a professional match letter for this consultant and assignment match.

Assignment: ${assignment.title} at ${assignment.company}
Required Skills: ${assignment.requiredSkills?.join(', ') || 'N/A'}
Team Culture: ${assignment.team_culture || 'N/A'}
Communication Style: ${assignment.desiredCommunicationStyle || 'N/A'}

Consultant: ${consultant.name}
Skills: ${consultant.skills?.join(', ') || 'N/A'}
Experience: ${consultant.experience_years || 'N/A'} years
Communication Style: ${consultant.communication_style || 'N/A'}

Match Scores:
- Technical Fit: ${matchData.technicalFit}%
- Cultural Fit: ${matchData.culturalFit}%
- Overall Match: ${matchData.totalMatchScore}%

Write a professional match letter following this format:
Subject: Match Recommendation – [Consultant Name] for [Assignment Title]

Hello,

Based on your assignment, [consultant details and why they're a good match]...

**Technical Fit**
• [specific technical points]

**Cultural Fit**
• [cultural alignment points]

**Match Score**
• [scores and availability]

[Recommendation conclusion]

Best regards,
MatchWise AI

Keep it professional, concise, and focused on the match quality.`;
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1000
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API failed: ${response.status}`);
    }

    const data = await response.json();
    const matchLetter = data.candidates[0].content.parts[0].text;

    return new Response(JSON.stringify({ matchLetter }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-matching function:', error);
    
    return new Response(JSON.stringify({
      error: error.message,
      matchLetter: null
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
