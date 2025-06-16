
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { message, context } = await req.json();

    console.log('Received message:', message);
    console.log('Context:', context);

    if (!GROQ_API_KEY) {
      // Fallback to simple responses if no AI available
      return new Response(JSON.stringify({ 
        reply: getSimpleFallbackResponse(message)
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Use AI for intelligent responses
    const systemPrompt = `You are the MatchWise AI Assistant, an expert in tech consulting and career development in Sweden. You help consultants with:

1. **Career Development:** Technical progression, specialization, certifications
2. **Pricing Strategy:** Hourly rates, negotiation, market comparisons  
3. **CV & LinkedIn:** Optimization, keywords, personal branding
4. **Client Relations:** Business development, networking, long-term relationships
5. **MatchWise Platform:** How matching works, profile optimization

Always respond in English. Be concrete, practical and give actionable advice. If users ask about topics outside your expertise areas, redirect them back to what you can help with.

User context information: ${context || 'No specific context available'}`;

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
            content: systemPrompt
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
        top_p: 0.9
      })
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.error('Groq API error:', groqResponse.status, errorText);
      
      // Fallback to simple response
      return new Response(JSON.stringify({ 
        reply: getSimpleFallbackResponse(message)
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const groqData = await groqResponse.json();
    const aiReply = groqData.choices[0].message.content;

    return new Response(JSON.stringify({ reply: aiReply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in matchwise-chat function:', error);
    
    // Fallback response
    return new Response(JSON.stringify({ 
      reply: 'Sorry, I cannot respond right now. Please try again in a moment.'
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function getSimpleFallbackResponse(message: string): string {
  const messageLC = message.toLowerCase();
  
  if (messageLC.includes('matchwise') || messageLC.includes('platform') || messageLC.includes('what is')) {
    return `# MatchWise - AI-Powered Consultant Matching 🚀

MatchWise is a platform that uses AI to match consultants with the right assignments. We analyze your CV and LinkedIn profile to:

✅ **Find perfect assignments** matching your expertise
✅ **Optimize your profile** for better visibility  
✅ **Provide market insights** on rates and demand
✅ **Match company culture** for better collaborations

What would you like to know more about?`;
  }
  
  if (messageLC.includes('cv') || messageLC.includes('linkedin') || messageLC.includes('profile')) {
    return `# CV & LinkedIn Optimization 📊

Here are my best tips:

## CV Optimization
✅ **Use STAR method** for project descriptions
✅ **Quantify results** - "Increased performance by 40%"
✅ **Include right keywords** for your tech stack
✅ **Keep it relevant** - focus on last 5-8 years

## LinkedIn Strategy  
✅ **Optimize headline** with keywords and value proposition
✅ **Write engaging content** 2-3 times per week
✅ **Network strategically** with CTOs and tech leaders
✅ **Share success stories** from your projects

Want more specific tips for your situation?`;
  }
  
  if (messageLC.includes('price') || messageLC.includes('rate') || messageLC.includes('salary') || messageLC.includes('negotiat')) {
    return `# Pricing & Negotiation 💰

## Basic Pricing (Stockholm 2024)
- **Junior (0-2 years):** 650-850 SEK/hour
- **Mid-level (3-5 years):** 850-1,200 SEK/hour  
- **Senior (5-8 years):** 1,200-1,600 SEK/hour
- **Expert/Lead (8+ years):** 1,600-2,200 SEK/hour

## Negotiation Tips
✅ **Start with value** - explain what you can deliver
✅ **Quantify impact** - "Saved company 500k/month"
✅ **Have alternatives** - never negotiate from desperation
✅ **Annual adjustments** - 8-15% for inflation + skill growth

Which specific situation would you like to discuss?`;
  }
  
  if (messageLC.includes('career') || messageLC.includes('development') || messageLC.includes('senior')) {
    return `# Career Development for Consultants 🚀

## Technical Career Path
**Developer → Senior Developer (3-5 years)**
- Master 2-3 languages deeply
- Learn architecture and design patterns
- +40-60% rate increase

**Senior → Tech Lead (5-8 years)**  
- Develop leadership skills
- Mentorship and code reviews
- +50-80% rate increase

**Tech Lead → Architect (8-12 years)**
- System design and business understanding  
- Enterprise architecture
- +60-100% rate increase

## High-Value Technologies 2024
- **AI/ML:** +30-50% premium
- **Cloud Native:** +25-40% premium
- **Data Engineering:** +30-45% premium

Which part of your career would you like to develop?`;
  }
  
  return `# Hi! I'm the MatchWise AI Assistant 🤖

I help you with:

💼 **Career Development** - Technical progression and specialization
💰 **Pricing Strategy** - Rates, negotiation, market prices  
📊 **Profile Optimization** - CV and LinkedIn improvement
🤝 **Client Relations** - Business development and networking
🚀 **MatchWise Platform** - How the platform works

What can I help you with today?`;
}
