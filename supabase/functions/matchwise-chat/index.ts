
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
        reply = `Hej! MatchWise är en avancerad AI-driven plattform som revolutionerar hur konsulter och företag hittar varandra. 

🎯 **Så fungerar MatchWise:**

**För Konsulter:**
• **AI-analys av CV:** Vår AI analyserar din tekniska expertis, ledarskapsförmåga och personlighet
• **LinkedIn-integration:** Vi analyserar din LinkedIn-profil för att förstå din kommunikationsstil och arbetsmetoder
• **Automatisk matchning:** Du syns automatiskt för relevanta uppdrag baserat på dina skills
• **Personlig profil:** Få detaljerad feedback och förbättringsförslag för din karriär

**För Företag:**
• **Sök i konsultdatabasen:** Hitta konsulter baserat på specifika tekniska färdigheter och erfarenhet
• **AI-matchning:** Vår algoritm föreslår bästa kandidater för dina projekt
• **Kulturell passform:** Se hur konsulter passar in i din företagskultur
• **Direktkontakt:** Kontakta konsulter direkt genom plattformen

**Teknologin bakom:**
• Avancerad NLP för CV-analys
• Maskininlärning för personlighetsanalys
• Prediktiv matchning baserad på framgångsrika projekt
• Kontinuerlig förbättring av algoritmer

Vill du veta mer om någon specifik del av plattformen?`;

      } else if (message.toLowerCase().includes('cv') || message.toLowerCase().includes('ladda upp') || message.toLowerCase().includes('analys')) {
        reply = `MatchWise CV-analys är mycket mer än bara att läsa ditt CV! 

📊 **Vad händer när du laddar upp ditt CV:**

**1. Teknisk Expertis-analys:**
• Identifierar programmeringsspråk och teknologier
• Kategoriserar färdighetsnivåer (nybörjare, medel, expert)
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

**5. LinkedIn-integration (om du anger profil):**
• Analyserar din online-närvaro och personal branding
• Bedömer nätverksstorlek och branschkopplingar
• Utvärderar innehållsdelning och tankeledarsskap
• Mäter engagemang och professionell aktivitet

Processen tar bara några sekunder men ger dig insights som normalt skulle kräva en professionell karriärcoach!`;

      } else if (message.toLowerCase().includes('linkedin') || message.toLowerCase().includes('profil')) {
        reply = `LinkedIn-analysen på MatchWise är djupgående och ger unika insights! 

🔗 **Så analyserar vi din LinkedIn-profil:**

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

Genom att kombinera CV + LinkedIn får vi en 360-graders bild av dig som professionell!`;

      } else if (message.toLowerCase().includes('företag') || message.toLowerCase().includes('hitta') || message.toLowerCase().includes('söka')) {
        reply = `MatchWise gör det enkelt för företag att hitta rätt konsulter! 

🏢 **För Företag - Så hittar ni perfekta konsulter:**

**Dashboard-funktioner:**
• **Konsultdatabas:** Bläddra genom verifierade konsulter med detaljerade profiler
• **Avancerad sökning:** Filtrera på teknisk expertis, erfarenhet, plats, tillgänglighet
• **AI-rekommendationer:** Få förslag på konsulter baserat på era projektbehov
• **Kulturell matchning:** Se vilka konsulter som passar er företagskultur

**Sökfunktioner:**
• **Teknisk sökning:** Hitta experter inom specifika programmeringsspråk eller teknologier
• **Erfarenhetsnivå:** Filtrera på junior, medior, senior, eller expert-nivå
• **Branschexpertis:** Sök konsulter med erfarenhet från er specifika bransch
• **Projekttyp:** Matcha baserat på tidigare liknande projekt

**Konsultprofiler innehåller:**
• **Tekniska färdigheter:** Detaljerad breakdown av expertis-områden
• **Personlighetsanalys:** Arbetsstil, kommunikation, ledarskap
• **Portfolioinformation:** CV-analys och LinkedIn-insights
• **Tillgänglighet:** När konsulten kan börja och på vilka villkor
• **Referenser:** Betyg och feedback från tidigare uppdrag

**Matchning-algoritm:**
• **Teknisk kompatibilitet:** Matchar era tekniska krav med konsulternas expertis
• **Kulturell passform:** Analyserar om konsulten passar er arbetskultur
• **Projekthistorik:** Konsulter med framgångsrika liknande projekt prioriteras
• **Geografisk närhet:** Tar hänsyn till plats och resemöjligheter

**Kontakt och bokning:**
• **Direkt kontakt:** Skicka meddelanden direkt till konsulter
• **Videosamtal:** Boka möten direkt i plattformen
• **Projektbeskrivningar:** Dela detaljerad information om uppdraget
• **Snabb respons:** De flesta konsulter svarar inom 24 timmar

Vill du veta mer om någon specifik funktion för företag?`;

      } else if (message.toLowerCase().includes('förbättra') || message.toLowerCase().includes('tips') || message.toLowerCase().includes('råd')) {
        reply = `MatchWise ger personliga förbättringsförslag baserat på din analys! 

⭐ **Så förbättrar du din profil systematiskt:**

**CV-optimering:**
• **Kvantifiera resultat:** Lägg till siffror, procent och konkreta utfall från dina projekt
• **Tekniska nyckelord:** Använd specifika teknologier och verktyg som är efterfrågade
• **Projektberättelser:** Beskriv utmaningar, lösningar och resultat strukturerat
• **Progressiv utveckling:** Visa hur du utvecklats över tid i komplexitet och ansvar

**LinkedIn-strategi:**
• **Konsistent aktivitet:** Dela branschrelevant innehåll regelbundet (2-3 gånger/vecka)
• **Engagerad närvaro:** Kommentera genomtänkt på andras inlägg inom ditt expertområde
• **Thought leadership:** Dela dina lärdomar och insights från projekt
• **Professionellt nätverk:** Bygg strategiska kopplingar inom din bransch

**Personlig utveckling:**
• **Certifieringar:** Skaffa relevanta certifiering inom dina nischområden
• **Continuous learning:** Håll dig uppdaterad med nya teknologier och trender
• **Projektportfolj:** Dokumentera och visa upp dina bästa arbeten
• **Mentorskap:** Både ge och ta emot mentorskap för accelererad utveckling

**Marknadspositionering:**
• **Specialisering:** Fokusera på att bli expert inom 2-3 nischområden
• **Value proposition:** Formulera tydligt vad som gör dig unik som konsult
• **Branschfokus:** Välj 1-2 branscher att fokusera på för djupare expertis
• **Prispositionering:** Justera dina arvoden baserat på marknadsvärde

**MatchWise-specifika tips:**
• **Komplett profil:** Se till att all information är fylld i och uppdaterad
• **Regelbundna uppdateringar:** Ladda upp uppdaterat CV när du får nya erfarenheter
• **Aktiv närvaro:** Logga in regelbundet och svara snabbt på förfrågningar
• **Feedback-loop:** Använd feedback från projekt för kontinuerlig förbättring

Vill du ha mer specifika råd för ditt expertområde eller karriärsteg?`;

      } else if (message.toLowerCase().includes('pris') || message.toLowerCase().includes('kostar') || message.toLowerCase().includes('arvode')) {
        reply = `MatchWise hjälper dig att positionera dig rätt på marknaden! 

💰 **Arvodesguide och prispositionering:**

**För Konsulter:**
• **Kostnadsfri registrering:** Det kostar inget att ladda upp CV och skapa profil
• **Gratis AI-analys:** Du får detaljerad analys av din profil utan kostnad
• **Marknadsintäkter:** Du behåller 100% av dina konsultintäkter
• **Premium-funktioner:** Vissa avancerade funktioner kan ha en månadsavgift

**Arvodesanalys baserat på:**
• **Teknisk expertis:** Sällsynta och efterfrågade färdigheter ger högre arvoden
• **Erfarenhetsnivå:** Junior (400-600 kr/h), Medior (600-900 kr/h), Senior (900-1400 kr/h)
• **Branschexpertis:** Specialiserade branscher (fintech, medtech) betalar premium
• **Geografisk plats:** Stockholm/Göteborg har högre arvoden än mindre orter

**Faktorer som påverkar ditt marknadsvärde:**
• **Teknologisk nisch:** AI/ML, cybersecurity, cloud-arkitektur ger höga arvoden
• **Ledarskapsförmåga:** Tech leads och arkitekter kan ta 20-40% högre arvoden
• **Certifieringar:** AWS, Azure, Google Cloud certifieringar höjer marknadsvärdet
• **Branschdjup:** 3+ år inom samma bransch ger betydande premium

**Benchmarking-verktyg:**
• **Marknadsanalys:** Se vad liknande konsulter tar i arvode
• **Trend-analys:** Förstå vilka färdigheter som ökar/minskar i värde
• **Optimal pricing:** Rekommendationer för konkurrenskraftiga men lönsamma priser
• **Förhandlingsstöd:** Tips för att motivera dina arvoden gentemot kunder

**För Företag:**
• **Transparent prissättning:** Se konsulternas arvoden direkt i plattformen
• **Budgetplanering:** Filtrera konsulter baserat på era budgetramar
• **Value-analys:** Förstå vad som motiverar olika priser
• **ROI-beräkning:** Verktyg för att beräkna affärsvärdet av olika konsulter

Vill du ha en personlig arvodesanalys baserat på din profil?`;

      } else if (message.toLowerCase().includes('hur') || message.toLowerCase().includes('kommer igång') || message.toLowerCase().includes('börjar')) {
        reply = `Så kommer du igång med MatchWise på bästa sätt! 

🚀 **Steg-för-steg guide:**

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
• **Komplett profil:** Fyll i alla fält för bättre synlighet
• **Professionella bilder:** Använd kvalitetsbilder i profilen
• **Tydlig specialisering:** Fokusera på dina starkaste områden
• **Snabb respons:** Svara på förfrågningar inom några timmar

**Efter aktivering:**
• **Dashboard-övervakning:** Följ upp intresse och matchningar
• **Kontinuerlig uppdatering:** Lägg till nya projekt och färdigheter
• **Nätverksbyggande:** Använd plattformen för att bygga professionella kontakter
• **Feedback-användning:** Använd projektfeedback för att förbättra profilen

**Support och hjälp:**
• **AI-chat:** Fråga mig vad som helst om plattformen
• **Video-guider:** Titta på tutorials för avancerade funktioner
• **Best practices:** Lär av framgångsrika konsulter på plattformen
• **Community:** Delta i diskussioner och kunskapsdelning

Är du redo att börja, eller har du frågor om någon specifik del?`;

      } else {
        reply = `Hej! Jag är MatchWise AI-assistenten och jag känner plattformen in och ut! 🤖

🎯 **Jag kan hjälpa dig med:**

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

Ställ en specifik fråga så får du djupgående svar med konkreta tips och strategier! 

Vad vill du veta mer om?`;
      }
    } else {
      // English responses with comprehensive MatchWise knowledge
      if (message.toLowerCase().includes('matchwise') || message.toLowerCase().includes('what is') || message.toLowerCase().includes('platform')) {
        reply = `Hello! MatchWise is an advanced AI-driven platform that revolutionizes how consultants and companies find each other.

🎯 **How MatchWise Works:**

**For Consultants:**
• **AI CV Analysis:** Our AI analyzes your technical expertise, leadership abilities, and personality
• **LinkedIn Integration:** We analyze your LinkedIn profile to understand your communication style and work methods
• **Automatic Matching:** You become automatically visible for relevant assignments based on your skills
• **Personal Profile:** Get detailed feedback and improvement suggestions for your career

**For Companies:**
• **Consultant Database Search:** Find consultants based on specific technical skills and experience
• **AI Matching:** Our algorithm suggests the best candidates for your projects
• **Cultural Fit:** See how consultants would fit into your company culture
• **Direct Contact:** Contact consultants directly through the platform

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

Would you like to know more about any specific part of the platform?`;

      } else if (message.toLowerCase().includes('cv') || message.toLowerCase().includes('upload') || message.toLowerCase().includes('analysis')) {
        reply = `MatchWise CV analysis is much more than just reading your resume!

📊 **What happens when you upload your CV:**

**1. Technical Expertise Analysis:**
• Identifies programming languages and technologies
• Categorizes skill levels (beginner, intermediate, expert)
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

**5. LinkedIn Integration (if you provide profile):**
• Analyzes your online presence and personal branding
• Assesses network size and industry connections
• Evaluates content sharing and thought leadership
• Measures engagement and professional activity

**Advanced Features:**
• Competency gap analysis
• Career trajectory mapping
• Skill depreciation/appreciation trends
• Competitive advantage identification

The process takes just a few seconds but gives you insights that would normally require a professional career coach!`;

      } else if (message.toLowerCase().includes('linkedin') || message.toLowerCase().includes('profile')) {
        reply = `LinkedIn analysis on MatchWise is deep and provides unique insights!

🔗 **How we analyze your LinkedIn profile:**

**Communication Style:**
• Analyzes language use and tone in your posts
• Assesses professional vs personal communication
• Identifies rhetorical strengths and influencing ability
• Measures clarity and structure in messages

**Leadership Analysis:**
• How often you initiate discussions
• What type of content you share (trend spotting, problem solving, etc.)
• How you engage with others' posts
• Mentorship and knowledge sharing activities

**Cultural Fit:**
• Company values reflected in your activities
• Work methods and collaboration ability
• Innovation vs stability in your approach
• Formal vs informal communication style

**Industry Engagement:**
• Which trends you follow and comment on
• Expertise areas you demonstrate
• Network and industry connections
• Continuous learning and development

**Personal Branding:**
• Consistency between CV and LinkedIn presence
• Authenticity in presentation
• Unique value proposition
• Professional storytelling ability

**Networking Analysis:**
• Quality and relevance of your connections
• Engagement patterns with industry leaders
• Content amplification and reach
• Professional relationship building

**Concrete Use Cases:**
• Companies can see how you would fit into their team
• Automatic matching based on work style
• Identification of like-minded consultants for team projects
• Personal development plan for stronger LinkedIn presence

By combining CV + LinkedIn, we get a 360-degree view of you as a professional!`;

      } else if (message.toLowerCase().includes('company') || message.toLowerCase().includes('find') || message.toLowerCase().includes('search')) {
        reply = `MatchWise makes it easy for companies to find the right consultants!

🏢 **For Companies - How to find perfect consultants:**

**Dashboard Features:**
• **Consultant Database:** Browse through verified consultants with detailed profiles
• **Advanced Search:** Filter by technical expertise, experience, location, availability
• **AI Recommendations:** Get consultant suggestions based on your project needs
• **Cultural Matching:** See which consultants fit your company culture

**Search Functions:**
• **Technical Search:** Find experts in specific programming languages or technologies
• **Experience Level:** Filter by junior, mid-level, senior, or expert level
• **Industry Expertise:** Search consultants with experience from your specific industry
• **Project Type:** Match based on similar previous projects

**Consultant Profiles Include:**
• **Technical Skills:** Detailed breakdown of expertise areas
• **Personality Analysis:** Work style, communication, leadership
• **Portfolio Information:** CV analysis and LinkedIn insights
• **Availability:** When the consultant can start and on what terms
• **References:** Ratings and feedback from previous assignments

**Matching Algorithm:**
• **Technical Compatibility:** Matches your technical requirements with consultants' expertise
• **Cultural Fit:** Analyzes if the consultant fits your work culture
• **Project History:** Consultants with successful similar projects are prioritized
• **Geographic Proximity:** Takes location and travel possibilities into account

**Contact and Booking:**
• **Direct Contact:** Send messages directly to consultants
• **Video Calls:** Book meetings directly in the platform
• **Project Descriptions:** Share detailed information about the assignment
• **Quick Response:** Most consultants respond within 24 hours

**Advanced Features:**
• **Team Formation:** Build entire consultant teams
• **Skill Gap Analysis:** Identify missing competencies in your organization
• **Market Intelligence:** Understand consultant availability and pricing trends
• **Project Success Prediction:** AI-powered success probability scoring

Would you like to know more about any specific function for companies?`;

      } else if (message.toLowerCase().includes('improve') || message.toLowerCase().includes('tips') || message.toLowerCase().includes('advice')) {
        reply = `MatchWise provides personalized improvement suggestions based on your analysis!

⭐ **How to systematically improve your profile:**

**CV Optimization:**
• **Quantify Results:** Add numbers, percentages, and concrete outcomes from your projects
• **Technical Keywords:** Use specific technologies and tools that are in demand
• **Project Stories:** Describe challenges, solutions, and results in a structured way
• **Progressive Development:** Show how you've evolved over time in complexity and responsibility

**LinkedIn Strategy:**
• **Consistent Activity:** Share industry-relevant content regularly (2-3 times/week)
• **Engaged Presence:** Comment thoughtfully on others' posts within your expertise area
• **Thought Leadership:** Share your learnings and insights from projects
• **Professional Network:** Build strategic connections within your industry

**Personal Development:**
• **Certifications:** Obtain relevant certifications within your niche areas
• **Continuous Learning:** Stay updated with new technologies and trends
• **Project Portfolio:** Document and showcase your best work
• **Mentorship:** Both give and receive mentorship for accelerated development

**Market Positioning:**
• **Specialization:** Focus on becoming an expert in 2-3 niche areas
• **Value Proposition:** Clearly articulate what makes you unique as a consultant
• **Industry Focus:** Choose 1-2 industries to focus on for deeper expertise
• **Price Positioning:** Adjust your rates based on market value

**MatchWise-Specific Tips:**
• **Complete Profile:** Ensure all information is filled in and updated
• **Regular Updates:** Upload updated CV when you gain new experience
• **Active Presence:** Log in regularly and respond quickly to inquiries
• **Feedback Loop:** Use project feedback for continuous improvement

**Performance Metrics:**
• **Profile Views:** Track how often companies view your profile
• **Match Quality:** Monitor the relevance of project suggestions
• **Response Rate:** Measure how quickly you respond to opportunities
• **Success Rate:** Track your project acquisition and completion rates

Would you like more specific advice for your expertise area or career stage?`;

      } else {
        reply = `Hello! I'm the MatchWise AI assistant and I know the platform inside and out! 🤖

🎯 **I can help you with:**

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

Ask a specific question and you'll get in-depth answers with concrete tips and strategies!

What would you like to know more about?`;
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
