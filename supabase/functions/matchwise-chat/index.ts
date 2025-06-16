
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
      // Swedish responses with comprehensive MatchWise knowledge
      if (message.toLowerCase().includes('matchwise') || message.toLowerCase().includes('vad är') || message.toLowerCase().includes('plattform')) {
        reply = `**MatchWise - AI-driven konsultmatchning** 🚀

MatchWise är en avancerad plattform som revolutionerar hur konsulter och företag hittar varandra.

**För Konsulter:**
• **AI-analys av CV** - Vår AI analyserar din tekniska expertis, ledarskapsförmåga och personlighet
• **LinkedIn-integration** - Vi analyserar din profil för att förstå din kommunikationsstil och arbetsmetoder  
• **Automatisk matchning** - Du syns automatiskt för relevanta uppdrag baserat på dina skills
• **Personlig profil** - Få detaljerad feedback och förbättringsförslag för din karriär

**För Företag:**
• **Sök i konsultdatabasen** - Hitta konsulter baserat på specifika tekniska färdigheter och erfarenhet
• **AI-matchning** - Vår algoritm föreslår bästa kandidater för dina projekt
• **Kulturell passform** - Se hur konsulter passar in i din företagskultur
• **Direktkontakt** - Kontakta konsulter direkt genom plattformen

**Teknologin:**
• Avancerad NLP för CV-analys
• Maskininlärning för personlighetsanalys
• Prediktiv matchning baserad på framgångsrika projekt
• Kontinuerlig förbättring av algoritmer

💡 **Vill du veta mer om någon specifik del av plattformen?**`;

      } else if (message.toLowerCase().includes('cv') || message.toLowerCase().includes('ladda upp') || message.toLowerCase().includes('analys')) {
        reply = `**CV-analys på MatchWise** 📊

När du laddar upp ditt CV händer mycket mer än bara läsning!

**1. Teknisk Expertis-analys:**
• Identifierar programmeringsspråk och teknologier
• Kategoriserar färdighetsnivåer (nybörjare → expert)
• Analyserar projektkontext och användningsområden
• Bedömer teknologisk bredd vs djup

**2. Professionell Bedömning:**
• Beräknar års erfarenhet inom olika områden
• Identifierar senioritetsnivå och karriärbana
• Analyserar ledarskapsroller och projektansvar
• Utvärderar branschexpertis

**3. Personlighetsanalys:**
• Kommunikationsstil baserat på CV-språk
• Problemlösningsförmåga från projektbeskrivningar
• Initiativtagande och innovation
• Teamwork vs självständigt arbete

**4. Marknadspositionering:**
• Timarvode-rekommendationer baserat på profil
• Jämförelse med liknande konsulter på marknaden
• Identifiering av nischområden och specialiseringar
• Förslag på målroller och branscher

**5. LinkedIn-integration:**
• Analyserar din online-närvaro och personal branding
• Bedömer nätverksstorlek och branschkopplingar
• Utvärderar innehållsdelning och tankeledarsskap
• Mäter engagemang och professionell aktivitet

⚡ **Processen tar bara några sekunder men ger dig insights som normalt skulle kräva en professionell karriärcoach!**`;

      } else if (message.toLowerCase().includes('linkedin') || message.toLowerCase().includes('profil')) {
        reply = `**LinkedIn-analys på MatchWise** 🔗

Vi analyserar din LinkedIn-profil djupgående för unika insights!

**Kommunikationsstil:**
• Analyserar språkbruk och tonalitet i dina inlägg
• Bedömer professionell vs personlig kommunikation
• Identifierar retoriska styrkor och influencing-förmåga
• Mäter tydlighet och struktur i meddelanden

**Ledarskapsanalys:**
• Hur ofta du initierar diskussioner
• Vilken typ av innehåll du delar (trendspotting, problemlösning, etc.)
• Hur du engagerar dig i andras inlägg
• Mentorskap och kunskapsdelning

**Kulturell Passform:**
• Företagsvärden som återspeglas i dina aktiviteter
• Arbetssätt och samarbetsförmåga
• Innovation vs stabilitet i ditt approach
• Formell vs informell kommunikation

**Branschengagemang:**
• Vilka trender du följer och kommenterar
• Expertise-områden du demonstrerar
• Nätverk och branschkopplingar
• Continuous learning och utveckling

**Personlig Branding:**
• Konsistens mellan CV och LinkedIn-närvaro
• Autenticitet i presentation
• Unik value proposition
• Professional storytelling

**Konkreta användningsområden:**
• Företag kan se hur du skulle passa in i deras team
• Automatisk matching baserat på arbetsstil
• Identifiering av likasinnade konsulter för team-projekt
• Personlig utvecklingsplan för starkare LinkedIn-närvaro

🎯 **Genom att kombinera CV + LinkedIn får vi en 360-graders bild av dig som professionell!**`;

      } else if (message.toLowerCase().includes('företag') || message.toLowerCase().includes('hitta') || message.toLowerCase().includes('söka')) {
        reply = `**För Företag - Hitta rätt konsulter** 🏢

MatchWise gör det enkelt för företag att hitta perfekta konsulter!

**Dashboard-funktioner:**
• **Konsultdatabas** - Bläddra genom verifierade konsulter med detaljerade profiler
• **Avancerad sökning** - Filtrera på teknisk expertis, erfarenhet, plats, tillgänglighet
• **AI-rekommendationer** - Få förslag på konsulter baserat på era projektbehov
• **Kulturell matchning** - Se vilka konsulter som passar er företagskultur

**Sökfunktioner:**
• **Teknisk sökning** - Hitta experter inom specifika programmeringsspråk eller teknologier
• **Erfarenhetsnivå** - Filtrera på junior, medior, senior, eller expert-nivå
• **Branschexpertis** - Sök konsulter med erfarenhet från er specifika bransch
• **Projekttyp** - Matcha baserat på tidigare liknande projekt

**Konsultprofiler innehåller:**
• **Tekniska färdigheter** - Detaljerad breakdown av expertis-områden
• **Personlighetsanalys** - Arbetsstil, kommunikation, ledarskap
• **Portfolioinformation** - CV-analys och LinkedIn-insights
• **Tillgänglighet** - När konsulten kan börja och på vilka villkor
• **Referenser** - Betyg och feedback från tidigare uppdrag

**Matchning-algoritm:**
• **Teknisk kompatibilitet** - Matchar era tekniska krav med konsulternas expertis
• **Kulturell passform** - Analyserar om konsulten passar er arbetskultur
• **Projekthistorik** - Konsulter med framgångsrika liknande projekt prioriteras
• **Geografisk närhet** - Tar hänsyn till plats och resemöjligheter

**Kontakt och bokning:**
• **Direkt kontakt** - Skicka meddelanden direkt till konsulter
• **Videosamtal** - Boka möten direkt i plattformen
• **Projektbeskrivningar** - Dela detaljerad information om uppdraget
• **Snabb respons** - De flesta konsulter svarar inom 24 timmar

💼 **Vill du veta mer om någon specifik funktion för företag?**`;

      } else if (message.toLowerCase().includes('förbättra') || message.toLowerCase().includes('tips') || message.toLowerCase().includes('råd')) {
        reply = `**Förbättra din profil systematiskt** ⭐

MatchWise ger personliga förbättringsförslag baserat på din analys!

**CV-optimering:**
• **Kvantifiera resultat** - Lägg till siffror, procent och konkreta utfall från dina projekt
• **Tekniska nyckelord** - Använd specifika teknologier och verktyg som är efterfrågade
• **Projektberättelser** - Beskriv utmaningar, lösningar och resultat strukturerat
• **Progressiv utveckling** - Visa hur du utvecklats över tid i komplexitet och ansvar

**LinkedIn-strategi:**
• **Konsistent aktivitet** - Dela branschrelevant innehåll regelbundet (2-3 gånger/vecka)
• **Engagerad närvaro** - Kommentera genomtänkt på andras inlägg inom ditt expertområde
• **Thought leadership** - Dela dina lärdomar och insights från projekt
• **Professionellt nätverk** - Bygg strategiska kopplingar inom din bransch

**Personlig utveckling:**
• **Certifieringar** - Skaffa relevanta certifiering inom dina nischområden
• **Continuous learning** - Håll dig uppdaterad med nya teknologier och trender
• **Projektportfolj** - Dokumentera och visa upp dina bästa arbeten
• **Mentorskap** - Både ge och ta emot mentorskap för accelererad utveckling

**Marknadspositionering:**
• **Specialisering** - Fokusera på att bli expert inom 2-3 nischområden
• **Value proposition** - Formulera tydligt vad som gör dig unik som konsult
• **Branschfokus** - Välj 1-2 branscher att fokusera på för djupare expertis
• **Prispositionering** - Justera dina arvoden baserat på marknadsvärde

**MatchWise-specifika tips:**
• **Komplett profil** - Se till att all information är fylld i och uppdaterad
• **Regelbundna uppdateringar** - Ladda upp uppdaterat CV när du får nya erfarenheter
• **Aktiv närvaro** - Logga in regelbundet och svara snabbt på förfrågningar
• **Feedback-loop** - Använd feedback från projekt för kontinuerlig förbättring

🚀 **Vill du ha mer specifika råd för ditt expertområde eller karriärsteg?**`;

      } else if (message.toLowerCase().includes('pris') || message.toLowerCase().includes('kostar') || message.toLowerCase().includes('arvode')) {
        reply = `**Arvodesguide och prispositionering** 💰

MatchWise hjälper dig att positionera dig rätt på marknaden!

**För Konsulter:**
• **Kostnadsfri registrering** - Det kostar inget att ladda upp CV och skapa profil
• **Gratis AI-analys** - Du får detaljerad analys av din profil utan kostnad
• **Marknadsintäkter** - Du behåller 100% av dina konsultintäkter
• **Premium-funktioner** - Vissa avancerade funktioner kan ha en månadsavgift

**Arvodesanalys baserat på:**
• **Teknisk expertis** - Sällsynta och efterfrågade färdigheter ger högre arvoden
• **Erfarenhetsnivå** - Junior (400-600 kr/h), Medior (600-900 kr/h), Senior (900-1400 kr/h)
• **Branschexpertis** - Specialiserade branscher (fintech, medtech) betalar premium
• **Geografisk plats** - Stockholm/Göteborg har högre arvoden än mindre orter

**Faktorer som påverkar ditt marknadsvärde:**
• **Teknologisk nisch** - AI/ML, cybersecurity, cloud-arkitektur ger höga arvoden
• **Ledarskapsförmåga** - Tech leads och arkitekter kan ta 20-40% högre arvoden
• **Certifieringar** - AWS, Azure, Google Cloud certifieringar höjer marknadsvärdet
• **Branschdjup** - 3+ år inom samma bransch ger betydande premium

**Benchmarking-verktyg:**
• **Marknadsanalys** - Se vad liknande konsulter tar i arvode
• **Trend-analys** - Förstå vilka färdigheter som ökar/minskar i värde
• **Optimal pricing** - Rekommendationer för konkurrenskraftiga men lönsamma priser
• **Förhandlingsstöd** - Tips för att motivera dina arvoden gentemot kunder

**För Företag:**
• **Transparent prissättning** - Se konsulternas arvoden direkt i plattformen
• **Budgetplanering** - Filtrera konsulter baserat på era budgetramar
• **Value-analys** - Förstå vad som motiverar olika priser
• **ROI-beräkning** - Verktyg för att beräkna affärsvärdet av olika konsulter

💡 **Vill du ha en personlig arvodesanalys baserat på din profil?**`;

      } else if (message.toLowerCase().includes('hur') || message.toLowerCase().includes('kommer igång') || message.toLowerCase().includes('börjar')) {
        reply = `**Kom igång med MatchWise** 🚀

Så kommer du igång på bästa sätt:

**Steg 1 - Registrering (5 minuter):**
• Ladda upp ditt senaste CV (PDF eller bild fungerar)
• Fyll i grundläggande kontaktinformation
• Lägg till din LinkedIn-profil för djupare analys
• Acceptera användarvillkor

**Steg 2 - AI-analys (automatisk):**
• Vår AI analyserar ditt CV och identifierar tekniska färdigheter
• LinkedIn-profilen analyseras för personlighet och arbetsstil
• Du får detaljerade insights om din marknadsprofil
• Förbättringsförslag genereras automatiskt

**Steg 3 - Profiloptimering (15-30 minuter):**
• Granska AI-analysen och komplettera information
• Lägg till portfolioinformation och projektexempel
• Ställ in tillgänglighet och geografiska preferenser
• Justera arvode baserat på marknadsrekommendationer

**Steg 4 - Aktivering (omedelbart):**
• Din profil blir synlig för företag i databasen
• AI:n börjar matcha dig mot relevanta uppdrag
• Du får notifieringar när företag visar intresse
• Börja få förfrågningar inom 24-48 timmar

**Pro-tips för snabbare resultat:**
• **Komplett profil** - Fyll i alla fält för bättre synlighet
• **Professionella bilder** - Använd kvalitetsbilder i profilen
• **Tydlig specialisering** - Fokusera på dina starkaste områden
• **Snabb respons** - Svara på förfrågningar inom några timmar

**Efter aktivering:**
• **Dashboard-övervakning** - Följ upp intresse och matchningar
• **Kontinuerlig uppdatering** - Lägg till nya projekt och färdigheter
• **Nätverksbyggande** - Använd plattformen för att bygga professionella kontakter
• **Feedback-användning** - Använd projektfeedback för att förbättra profilen

**Support och hjälp:**
• **AI-chat** - Fråga mig vad som helst om plattformen
• **Video-guider** - Titta på tutorials för avancerade funktioner
• **Best practices** - Lär av framgångsrika konsulter på plattformen
• **Community** - Delta i diskussioner och kunskapsdelning

✨ **Är du redo att börja, eller har du frågor om någon specifik del?**`;

      } else {
        reply = `**Hej! Jag är MatchWise AI-assistenten** 🤖

Jag känner plattformen in och ut och kan hjälpa dig med allt!

**🎯 Jag kan hjälpa dig med:**

**Om MatchWise:**
• Hur plattformen fungerar för konsulter och företag
• AI-analysens olika komponenter och vad den mäter
• Matchning-algoritmen och hur den hittar rätt konsulter
• Alla funktioner i dashboard och databas

**Karriärutveckling:**
• Personliga tips för CV-optimering baserat på AI-analys
• LinkedIn-strategi för konsulter
• Marknadspositionering och arvodesoptimering
• Branschinsights och framtidstrender

**Teknisk expertis:**
• Hur olika teknologier värderas på marknaden
• Certifieringar som höjer ditt marknadsvärde
• Nischområden med hög efterfrågan
• Strategier för kompetensutveckling

**Praktiska frågor:**
• Steg-för-steg guide för att komma igång
• Troubleshooting och teknisk support
• Best practices från framgångsrika konsulter
• Affärsutveckling och kundskapande

💬 **Ställ en specifik fråga så får du djupgående svar med konkreta tips och strategier!**

**Exempel på frågor:**
• "Hur fungerar CV-analysen?"
• "Tips för att förbättra min LinkedIn-profil"
• "Vad kostar det att använda MatchWise?"
• "Hur kommer jag igång som konsult?"

🚀 **Vad vill du veta mer om?**`;
      }
    } else {
      // English responses with better formatting
      if (message.toLowerCase().includes('matchwise') || message.toLowerCase().includes('what is') || message.toLowerCase().includes('platform')) {
        reply = `**MatchWise - AI-Driven Consultant Matching** 🚀

MatchWise is an advanced platform that revolutionizes how consultants and companies find each other.

**For Consultants:**
• **AI CV Analysis** - Our AI analyzes your technical expertise, leadership abilities, and personality
• **LinkedIn Integration** - We analyze your profile to understand your communication style and work methods
• **Automatic Matching** - You become automatically visible for relevant assignments based on your skills
• **Personal Profile** - Get detailed feedback and improvement suggestions for your career

**For Companies:**
• **Consultant Database Search** - Find consultants based on specific technical skills and experience
• **AI Matching** - Our algorithm suggests the best candidates for your projects
• **Cultural Fit** - See how consultants would fit into your company culture
• **Direct Contact** - Contact consultants directly through the platform

**The Technology Behind:**
• Advanced NLP for CV analysis
• Machine learning for personality analysis
• Predictive matching based on successful projects
• Continuous improvement of algorithms

**Unique Features:**
• Real-time market positioning analysis
• Personalized improvement recommendations
• Cultural compatibility scoring
• Salary benchmarking and optimization
• Professional networking opportunities

💡 **Would you like to know more about any specific part of the platform?**`;

      } else if (message.toLowerCase().includes('cv') || message.toLowerCase().includes('upload') || message.toLowerCase().includes('analysis')) {
        reply = `**CV Analysis on MatchWise** 📊

MatchWise CV analysis is much more than just reading your resume!

**1. Technical Expertise Analysis:**
• Identifies programming languages and technologies
• Categorizes skill levels (beginner → expert)
• Analyzes project context and use cases
• Assesses technological breadth vs depth

**2. Professional Assessment:**
• Calculates years of experience in different areas
• Identifies seniority level and career path
• Analyzes leadership roles and project responsibilities
• Evaluates industry expertise

**3. Personality Analysis:**
• Communication style based on CV language
• Problem-solving ability from project descriptions
• Initiative and innovation indicators
• Teamwork vs independent work preferences

**4. Market Positioning:**
• Hourly rate recommendations based on your profile
• Comparison with similar consultants in the market
• Identification of niche areas and specializations
• Suggestions for target roles and industries

**5. LinkedIn Integration:**
• Analyzes your online presence and personal branding
• Assesses network size and industry connections
• Evaluates content sharing and thought leadership
• Measures engagement and professional activity

**Advanced Features:**
• Competency gap analysis
• Career trajectory mapping
• Skill depreciation/appreciation trends
• Competitive advantage identification

⚡ **The process takes just a few seconds but gives you insights that would normally require a professional career coach!**`;

      } else {
        reply = `**Hello! I'm the MatchWise AI Assistant** 🤖

I know the platform inside and out and can help you with everything!

**🎯 I can help you with:**

**About MatchWise:**
• How the platform works for consultants and companies
• The different components of AI analysis and what it measures
• The matching algorithm and how it finds the right consultants
• All features in dashboard and database

**Career Development:**
• Personal tips for CV optimization based on AI analysis
• LinkedIn strategy for consultants
• Market positioning and rate optimization
• Industry insights and future trends

**Technical Expertise:**
• How different technologies are valued in the market
• Certifications that increase your market value
• Niche areas with high demand
• Strategies for skill development

**Practical Questions:**
• Step-by-step guide to get started
• Troubleshooting and technical support
• Best practices from successful consultants
• Business development and client acquisition

💬 **Ask a specific question and you'll get in-depth answers with concrete tips and strategies!**

**Example questions:**
• "How does the CV analysis work?"
• "Tips for improving my LinkedIn profile"
• "What does it cost to use MatchWise?"
• "How do I get started as a consultant?"

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
