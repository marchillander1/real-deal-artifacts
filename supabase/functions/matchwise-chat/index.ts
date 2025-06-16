
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
                     ['hej', 'tack', 'vad', 'hur', 'kan', 'jag', 'är', 'det'].some(word => 
                       message.toLowerCase().includes(word));

    if (isSwedish) {
      if (message.toLowerCase().includes('matchwise') || message.toLowerCase().includes('vad är')) {
        reply = `Hej! MatchWise är en plattform som matchar konsulter med uppdrag. Vi använder AI för att analysera CV:n och LinkedIn-profiler för att hitta de bästa matchningarna.

🔍 **Våra tjänster:**
• AI-analys av teknisk expertis och ledarskap
• Personlig analys av CV och LinkedIn-profil
• Matchning med svenska företag och uppdrag
• Förbättringsförslag för din profil

Du har laddat upp ditt CV och fått en omfattande analys. Har du några frågor om resultatet eller vill du ha tips för att förbättra din profil?`;
      } else if (message.toLowerCase().includes('cv') || message.toLowerCase().includes('förbättra')) {
        reply = `Här är mina bästa tips för att förbättra ditt CV:

📝 **CV-tips:**
• Fokusera på kvantifierbara resultat (siffror och procent)
• Använd tekniska nyckelord som är relevanta för din bransch
• Strukturera med tydliga rubriker och punktlistor
• Inkludera konkreta projektexempel
• Anpassa CV:t för varje ansökan

💼 **För konsultuppdrag:**
• Betona din självständighet och problemlösningsförmåga
• Visa exempel på när du lett projekt eller team
• Inkludera certifieringar och kontinuerlig kompetensutveckling

Vill du ha mer specifika råd baserat på din bransch eller roll?`;
      } else if (message.toLowerCase().includes('linkedin')) {
        reply = `LinkedIn är viktigt för konsulter! Här är mina tips:

🔗 **LinkedIn-optimering:**
• Skriv en engagerande sammanfattning som visar din personlighet
• Använd professionell profilbild
• Dela regelbundet branschrelevant innehåll
• Kommentera och engagera dig i andras inlägg
• Visa upp projekt och prestationer i aktivitetsflödet

📊 **För konsulter specifikt:**
• Framhäv din specialisering tydligt
• Dela case studies och lärdomar från projekt
• Nätverka aktivt med potentiella klienter
• Använd rekommendationer från tidigare kunder

Har du några specifika frågor om din LinkedIn-strategi?`;
      } else {
        reply = `Hej! Jag är MatchWise AI-assistenten och hjälper gärna till med frågor om:

🎯 **MatchWise-plattformen:**
• Hur vi matchar konsulter med uppdrag
• AI-analys av CV och LinkedIn-profiler
• Förbättringsförslag för din profil

💡 **CV- och karriärtips:**
• Konkreta förbättringsförslag
• Branschspecifika råd
• LinkedIn-optimering
• Konsultkarriär i Sverige

Vad kan jag hjälpa dig med idag?`;
      }
    } else {
      // English responses
      if (message.toLowerCase().includes('matchwise') || message.toLowerCase().includes('what is')) {
        reply = `Hello! MatchWise is a consultant matching platform that connects skilled consultants with relevant assignments. We use AI to analyze CVs and LinkedIn profiles to find the best matches.

🔍 **Our services:**
• AI analysis of technical expertise and leadership
• Personal analysis of CV and LinkedIn profiles
• Matching with Swedish companies and assignments
• Improvement suggestions for your profile

You've uploaded your CV and received a comprehensive analysis. Do you have any questions about the results or would you like tips to improve your profile?`;
      } else if (message.toLowerCase().includes('cv') || message.toLowerCase().includes('improve')) {
        reply = `Here are my best tips for improving your CV:

📝 **CV Tips:**
• Focus on quantifiable results (numbers and percentages)
• Use technical keywords relevant to your industry
• Structure with clear headings and bullet points
• Include concrete project examples
• Customize your CV for each application

💼 **For consulting assignments:**
• Emphasize your independence and problem-solving skills
• Show examples of when you led projects or teams
• Include certifications and continuous skill development

Would you like more specific advice based on your industry or role?`;
      } else if (message.toLowerCase().includes('linkedin')) {
        reply = `LinkedIn is important for consultants! Here are my tips:

🔗 **LinkedIn optimization:**
• Write an engaging summary that shows your personality
• Use a professional profile picture
• Share industry-relevant content regularly
• Comment and engage with others' posts
• Showcase projects and achievements in your activity feed

📊 **Specifically for consultants:**
• Clearly highlight your specialization
• Share case studies and learnings from projects
• Network actively with potential clients
• Use recommendations from previous clients

Do you have any specific questions about your LinkedIn strategy?`;
      } else {
        reply = `Hello! I'm the MatchWise AI assistant and I'm happy to help with questions about:

🎯 **The MatchWise platform:**
• How we match consultants with assignments
• AI analysis of CVs and LinkedIn profiles
• Improvement suggestions for your profile

💡 **CV and career tips:**
• Concrete improvement suggestions
• Industry-specific advice
• LinkedIn optimization
• Consulting career in Sweden

What can I help you with today?`;
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
