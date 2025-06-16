
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
    const { message, context } = await req.json();

    const systemPrompt = `You are an AI assistant for MatchWise, a consultant matching platform. You help users with:

1. Information about MatchWise:
- MatchWise is a platform that matches consultants with assignments
- We use AI to analyze CVs and LinkedIn profiles
- We help both consultants find assignments and companies find the right consultants
- The platform is based in Sweden and focuses on the Swedish market
- We offer personal analysis of technical expertise, leadership and cultural fit

2. CV tips and improvements:
- Give concrete, actionable advice for CV improvements
- Focus on technical skills, project examples and quantifiable results
- Advice on how to structure your CV for consulting work
- Tips on how to highlight relevant experience
- Guidance on what's important for Swedish employers

3. User context:
${context ? `The user has: ${context}` : 'No specific context available'}

IMPORTANT: Always respond in the same language as the user's message. If they write in Swedish, respond in Swedish. If they write in English, respond in English. Be helpful, professional and concrete. Always give practical advice that the user can implement directly.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    const data = await response.json();
    const reply = data.choices[0].message.content;

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in matchwise-chat function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
