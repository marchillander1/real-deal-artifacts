
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, context, role } = await req.json();

    console.log('Received message:', message);
    console.log('Context:', context);

    if (!GEMINI_API_KEY) {
      return new Response(JSON.stringify({ 
        response: getSimpleFallbackResponse(message)
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Enhanced system prompt for MatchWise AI Career Coach
    const systemPrompt = `Du är MatchWise AI Career Coach, en expert på tech-konsulting och karriärutveckling i Sverige. Du hjälper konsulter med:

**HUVUDOMRÅDEN:**
1. **Karriärutveckling:** Teknisk progression, specialisering, certifieringar
2. **Prissättningsstrategi:** Timpriser, förhandling, marknadsanalys
3. **CV & LinkedIn:** Optimering, nyckelord, personlig branding
4. **Kundrelationer:** Affärsutveckling, nätverkande, långsiktiga relationer
5. **MatchWise-plattformen:** Hur matchning fungerar, profiloptimering

**SVENSKA MARKNADEN 2024:**
- Junior (0-2 år): 650-850 SEK/timme
- Mellannivå (3-5 år): 850-1,200 SEK/timme  
- Senior (5-8 år): 1,200-1,600 SEK/timme
- Expert/Lead (8+ år): 1,600-2,200 SEK/timme

**HÖGVÄRDERADE TEKNOLOGIER:**
- AI/ML: +30-50% premium
- Cloud Native: +25-40% premium
- Data Engineering: +30-45% premium

**STIL & TON:**
- Svara alltid på engelska
- Var konkret, praktisk och ge genomförbara råd
- Använd emojis sparsamt men effektivt
- Fokusera på värdeskapande för konsulten
- Om användare frågar om ämnen utanför din expertis, hänvisa tillbaka till vad du kan hjälpa med

**KONTEXT:**
${context ? `Användarens profil: ${JSON.stringify(context)}` : 'Ingen specifik kontext tillgänglig'}`;

    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${systemPrompt}\n\nAnvändarens meddelande: ${message}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1000,
        }
      })
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error('Gemini API error:', geminiResponse.status, errorText);
      
      return new Response(JSON.stringify({ 
        response: getSimpleFallbackResponse(message)
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const geminiData = await geminiResponse.json();
    const aiResponse = geminiData.candidates[0].content.parts[0].text;

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in matchwise-chat function:', error);
    
    return new Response(JSON.stringify({ 
      response: 'Sorry, I cannot respond right now. Please try again in a moment.'
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
  
  return `# Hi! I'm the MatchWise AI Career Coach 🤖

I help you with:

💼 **Career Development** - Technical progression and specialization
💰 **Pricing Strategy** - Rates, negotiation, market prices  
📊 **Profile Optimization** - CV and LinkedIn improvement
🤝 **Client Relations** - Business development and networking
🚀 **MatchWise Platform** - How the platform works

What can I help you with today?`;
}
