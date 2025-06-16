
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
    const { message, context } = await req.json();

    console.log('Received message:', message);
    console.log('Context:', context);

    // Create a comprehensive response based on the message content
    let reply = '';
    
    // Detect language and respond accordingly
    const isSwedish = /[åäöÅÄÖ]/.test(message) || 
                     ['hej', 'tack', 'vad', 'hur', 'kan', 'jag', 'är', 'det', 'matchwise', 'plattform', 'fungerar'].some(word => 
                       message.toLowerCase().includes(word));

    if (isSwedish) {
      // Swedish responses with better formatting
      if (message.toLowerCase().includes('matchwise') || message.toLowerCase().includes('vad är') || message.toLowerCase().includes('plattform')) {
        reply = `# MatchWise - AI-driven konsultmatchning 🚀

MatchWise är en avancerad plattform som revolutionerar hur konsulter och företag hittar varandra.

## För Konsulter

### 🤖 AI-analys av CV
- Vår AI analyserar din tekniska expertis, ledarskapsförmåga och personlighet
- Automatisk kategorisering av färdighetsnivåer
- Djupgående analys av projektkontext

### 🔗 LinkedIn-integration  
- Vi analyserar din profil för att förstå din kommunikationsstil
- Bedömning av arbetssätt och samarbetsförmåga
- Personlighetsanalys baserad på innehåll

### 🎯 Automatisk matchning
- Du syns automatiskt för relevanta uppdrag
- Matchning baserad på dina tekniska skills
- Kulturell passform med företag

---

## För Företag

### 🔍 Sök i konsultdatabasen
- Hitta konsulter baserat på specifika tekniska färdigheter
- Filtrera på erfarenhetsnivå och branschexpertis
- Se kulturell passform direkt

### 🤝 Direktkontakt
- Kontakta konsulter direkt genom plattformen
- Snabb respons från kvalificerade kandidater

💡 **Vill du veta mer om någon specifik del?**`;

      } else if (message.toLowerCase().includes('cv') || message.toLowerCase().includes('ladda upp') || message.toLowerCase().includes('analys')) {
        reply = `# CV-analys på MatchWise 📊

## Teknisk Expertis-analys
- ✅ Identifierar programmeringsspråk och teknologier
- ✅ Kategoriserar färdighetsnivåer (nybörjare → expert)  
- ✅ Analyserar projektkontext och användningsområden
- ✅ Bedömer teknologisk bredd vs djup

## Professionell Bedömning
- 📈 Beräknar års erfarenhet inom olika områden
- 🎯 Identifierar senioritetsnivå och karriärbana
- 👑 Analyserar ledarskapsroller och projektansvar
- 🏢 Utvärderar branschexpertis

## Personlighetsanalys
- 💬 Kommunikationsstil baserat på CV-språk
- 🧩 Problemlösningsförmåga från projektbeskrivningar
- 🚀 Initiativtagande och innovation
- 🤝 Teamwork vs självständigt arbete

⚡ **Processen tar bara några sekunder men ger dig insights som normalt skulle kräva en professionell karriärcoach!**`;

      } else {
        reply = `# Hej! Jag är MatchWise AI-assistenten 🤖

## Jag kan hjälpa dig med:

### 🎯 Om MatchWise
- Hur plattformen fungerar för konsulter och företag
- AI-analysens olika komponenter
- Matchning-algoritmen

### 📈 Karriärutveckling  
- Personliga tips för CV-optimering
- LinkedIn-strategi för konsulter
- Marknadspositionering och arvodesoptimering

### 🔧 Teknisk expertis
- Hur olika teknologier värderas på marknaden
- Certifieringar som höjer ditt marknadsvärde
- Nischområden med hög efterfrågan

---

💬 **Ställ en specifik fråga så får du djupgående svar med konkreta tips!**

**Exempel:**
- "Hur fungerar CV-analysen?"
- "Tips för att förbättra min LinkedIn-profil"  
- "Vad kostar det att använda MatchWise?"

🚀 **Vad vill du veta mer om?**`;
      }
    } else {
      // English responses with better formatting
      if (message.toLowerCase().includes('matchwise') || message.toLowerCase().includes('what is') || message.toLowerCase().includes('platform')) {
        reply = `# MatchWise - AI-Driven Consultant Matching 🚀

MatchWise is an advanced platform that revolutionizes how consultants and companies find each other.

## For Consultants

### 🤖 AI CV Analysis
- Our AI analyzes your technical expertise, leadership abilities, and personality
- Automatic categorization of skill levels (beginner → expert)
- Deep analysis of project context and use cases

### 🔗 LinkedIn Integration  
- We analyze your profile to understand your communication style
- Assessment of work methods and collaboration skills
- Personality analysis based on content sharing

### 🎯 Automatic Matching
- You become automatically visible for relevant assignments
- Matching based on your technical skills
- Cultural fit assessment with companies

---

## For Companies

### 🔍 Search Consultant Database
- Find consultants based on specific technical skills and experience
- Filter by experience level and industry expertise  
- See cultural compatibility scores

### 🤝 Direct Contact
- Contact consultants directly through the platform
- Quick response from qualified candidates

### 📊 Advanced Analytics
- Market positioning analysis
- Salary benchmarking tools
- ROI calculations for different consultants

---

## The Technology Behind

### 🧠 Advanced AI
- Natural Language Processing for CV analysis
- Machine learning for personality assessment
- Predictive matching based on successful projects

💡 **Would you like to know more about any specific part of the platform?**`;

      } else if (message.toLowerCase().includes('cv') || message.toLowerCase().includes('upload') || message.toLowerCase().includes('analysis')) {
        reply = `# CV Analysis on MatchWise 📊

## Technical Expertise Analysis
- ✅ Identifies programming languages and technologies
- ✅ Categorizes skill levels (beginner → expert)
- ✅ Analyzes project context and use cases  
- ✅ Assesses technological breadth vs depth

## Professional Assessment
- 📈 Calculates years of experience in different areas
- 🎯 Identifies seniority level and career path
- 👑 Analyzes leadership roles and project responsibilities
- 🏢 Evaluates industry expertise

## Personality Analysis
- 💬 Communication style based on CV language
- 🧩 Problem-solving ability from project descriptions
- 🚀 Initiative and innovation indicators
- 🤝 Teamwork vs independent work preferences

## Market Positioning
- 💰 Hourly rate recommendations based on your profile
- 📊 Comparison with similar consultants in the market
- 🎯 Identification of niche areas and specializations
- 🚀 Suggestions for target roles and industries

---

### LinkedIn Integration Benefits
- 🔗 Analyzes your online presence and personal branding
- 📈 Assesses network size and industry connections
- 💡 Evaluates content sharing and thought leadership
- 📊 Measures engagement and professional activity

⚡ **The process takes just seconds but gives you insights that would normally require a professional career coach!**`;

      } else if (message.toLowerCase().includes('improve') || message.toLowerCase().includes('tips') || message.toLowerCase().includes('advice')) {
        reply = `# Improve Your Profile Systematically ⭐

## CV Optimization

### 📊 Quantify Results
- Add numbers, percentages, and concrete outcomes from your projects
- Show measurable impact and business value
- Use specific metrics whenever possible

### 🔑 Technical Keywords  
- Use specific technologies and tools that are in demand
- Include relevant certifications and frameworks
- Match industry terminology and buzzwords

### 📖 Project Stories
- Describe challenges, solutions, and results in a structured way
- Show progressive development over time
- Highlight complexity and responsibility growth

---

## LinkedIn Strategy

### 📱 Consistent Activity
- Share industry-relevant content regularly (2-3 times/week)
- Engage thoughtfully on others' posts within your expertise area
- Build strategic connections within your industry

### 💡 Thought Leadership
- Share your learnings and insights from projects
- Comment with valuable perspectives
- Establish expertise in your niche areas

---

## Personal Development

### 🏆 Certifications
- Get relevant certifications in your niche areas
- Stay updated with new technologies and trends
- Document and showcase your continuous learning

### 📈 Market Positioning
- Focus on becoming an expert in 2-3 niche areas
- Formulate clearly what makes you unique as a consultant
- Choose 1-2 industries to focus on for deeper expertise

---

## MatchWise-Specific Tips

### ✅ Complete Profile
- Ensure all information is filled in and updated
- Upload updated CV when you gain new experience
- Log in regularly and respond quickly to inquiries

### 🔄 Feedback Loop
- Use feedback from projects for continuous improvement
- Update your profile based on new skills and experiences

🚀 **Would you like more specific advice for your expertise area or career stage?**`;

      } else {
        reply = `# Hello! I'm the MatchWise AI Assistant 🤖

I know the platform inside and out and can help you with everything!

## 🎯 I can help you with:

### About MatchWise
- How the platform works for consultants and companies
- The different components of AI analysis and what it measures
- The matching algorithm and how it finds the right consultants

### 📈 Career Development
- Personal tips for CV optimization based on AI analysis
- LinkedIn strategy for consultants  
- Market positioning and rate optimization

### 🔧 Technical Expertise
- How different technologies are valued in the market
- Certifications that increase your market value
- Niche areas with high demand

### 💼 Practical Questions
- Step-by-step guide to get started
- Best practices from successful consultants
- Business development and client acquisition

---

💬 **Ask a specific question and you'll get in-depth answers with concrete tips and strategies!**

### Example questions:
- "How does the CV analysis work?"
- "Tips for improving my LinkedIn profile"
- "What does it cost to use MatchWise?"
- "How do I get started as a consultant?"

🚀 **What would you like to know more about?**`;
      }
    }

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in matchwise-chat function:', error);
    
    // Fallback response based on detected language
    const fallbackMessage = error.message && (error.message.includes('åäö') || error.message.includes('svenska')) 
      ? 'Tyvärr, jag kan inte svara just nu. Försök igen om en stund.'
      : 'Sorry, I cannot respond right now. Please try again in a moment.';
    
    return new Response(JSON.stringify({ 
      reply: fallbackMessage
    }), {
      status: 200, // Return 200 so the chat can display the fallback message
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
