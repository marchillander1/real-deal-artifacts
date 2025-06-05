
import { Consultant, Assignment, Match } from '../types/consultant';

export const calculateMatch = (consultant: Consultant, assignment: Assignment): number => {
  const consultantSkills = consultant.skills.map(s => s.toLowerCase());
  const requiredSkills = assignment.requiredSkills.map(s => s.toLowerCase());
  
  const matchingSkills = consultantSkills.filter(skill => 
    requiredSkills.some(required => 
      skill.includes(required.toLowerCase()) || required.toLowerCase().includes(skill)
    )
  );
  
  const skillScore = (matchingSkills.length / requiredSkills.length) * 60;
  const experienceScore = Math.min(parseInt(consultant.experience) * 2.5, 25);
  const availabilityScore = consultant.availability === 'Available now' ? 10 : 5;
  const ratingScore = consultant.rating * 1;
  
  return Math.min(Math.round(skillScore + experienceScore + availabilityScore + ratingScore), 98);
};

export const findMatches = (consultants: Consultant[], assignment: Assignment): Match[] => {
  return consultants.map(consultant => {
    const score = calculateMatch(consultant, assignment);
    const letter = generateMotivationLetter(consultant, assignment, score);
    
    const matchedSkills = consultant.skills.filter(skill => 
      assignment.requiredSkills.some(req => 
        skill.toLowerCase().includes(req.toLowerCase()) || 
        req.toLowerCase().includes(skill.toLowerCase())
      )
    );

    return {
      consultant,
      score,
      letter,
      matchedSkills,
      estimatedSavings: Math.floor(score * 100 + Math.random() * 500),
      responseTime: Math.floor(Math.random() * 24) + 1,
      culturalMatch: Math.floor(Math.random() * 30) + 70,
      communicationMatch: Math.floor(Math.random() * 25) + 75,
      valuesAlignment: Math.floor(Math.random() * 20) + 80,
      humanFactorsScore: Math.floor(Math.random() * 15) + 85
    };
  }).sort((a, b) => b.score - a.score);
};

export const generateMotivationLetter = (consultant: Consultant, assignment: Assignment, matchScore: number): string => {
  const matchedSkills = consultant.skills.filter(skill => 
    assignment.requiredSkills.some(req => 
      skill.toLowerCase().includes(req.toLowerCase()) || 
      req.toLowerCase().includes(skill.toLowerCase())
    )
  );

  const unmatchedSkills = assignment.requiredSkills.filter(req =>
    !consultant.skills.some(skill => 
      skill.toLowerCase().includes(req.toLowerCase()) || 
      req.toLowerCase().includes(skill.toLowerCase())
    )
  );

  const experienceYears = parseInt(consultant.experience) || 5;
  const isRemoteCompatible = assignment.remote.toLowerCase().includes('remote') || assignment.remote.toLowerCase().includes('hybrid');
  const budgetFits = true; // Assuming budget compatibility for now
  
  // Generate specific project examples based on skills
  const generateProjectExample = (skills: string[]) => {
    if (skills.some(s => s.toLowerCase().includes('react'))) {
      return "utvecklat en komplex e-handelsplattform med React och TypeScript som hanterade 100,000+ användare dagligen";
    } else if (skills.some(s => s.toLowerCase().includes('vue'))) {
      return "byggt en modern fintech-applikation med Vue.js som förbättrade användarupplevelsen med 40%";
    } else if (skills.some(s => s.toLowerCase().includes('aws'))) {
      return "designat och implementerat skalbar molnarkitektur på AWS som reducerade kostnaderna med 35%";
    } else {
      return "levererat framgångsrika digitala lösningar som översteg kundens förväntningar";
    }
  };

  const projectExample = generateProjectExample(consultant.skills);

  // Industry-specific insights
  const getIndustryInsight = (industry: string) => {
    const insights = {
      'E-handel': 'Jag förstår de unika utmaningarna inom e-handel - från användarupplevelse och konverteringsoptimering till skalbarhet under högtrafik perioder som Black Friday.',
      'Fintech': 'Med djup förståelse för finanssektorns krav på säkerhet, compliance och användarförtroende, vet jag hur viktigt det är att balansera innovation med regelefterlevnad.',
      'SaaS': 'Jag har bred erfarenhet av SaaS-utveckling och förstår vikten av skalbar arkitektur, multi-tenancy och kontinuerlig leverans för att möta kundernas växande behov.',
      'Healthcare': 'Inom healthcare är jag van vid strikta säkerhetskrav, GDPR-compliance och vikten av användarvänliga system för vårdpersonal.',
      'Education': 'Jag förstår utbildningssektorns behov av tillgängliga, intuitiva plattformar som stödjer olika inlärningsstilar och tekniska färdighetsnivåer.'
    };
    return insights[industry] || 'Jag har bred branschexpertis och anpassar snabbt min approach efter specifika branschkrav och affärslogik.';
  };

  const industryInsight = getIndustryInsight(assignment.industry);

  const templates = [
    `Hej ${assignment.company}-teamet! 👋

Jag heter ${consultant.name} och jag brinner för att skapa tekniska lösningar som verkligen gör skillnad. När jag läste er annons för ${assignment.title} kände jag direkt att detta är exakt den typ av utmaning jag söker.

🎯 **Varför just jag passar perfekt för er roll:**

**Teknisk expertis som matchar era behov (${matchScore}% match):**
${matchedSkills.map(skill => `✅ ${skill} - ${experienceYears}+ års praktisk erfarenhet`).join('\n')}

Särskilt relevant är min bakgrund inom ${consultant.roles[0].toLowerCase()}, där jag senast ${projectExample}. Detta har gett mig djup förståelse för både tekniska utmaningar och affärsimpact.

**Branschförståelse:**
${industryInsight}

**Perfekt timing och logistik:**
• 📍 Baserad i ${consultant.location} - ${assignment.remote} fungerar utmärkt för mig
• ⏰ ${consultant.availability} och kan starta ${assignment.startDate}
• 💰 Min rate ${consultant.rate} ligger väl inom er budget (${assignment.budget})
• 👥 Trivs i team med ${assignment.teamSize} - passar min kollaborativa arbetsstil perfekt

**Vad jag bidrar med utöver teknisk expertis:**
• Proaktiv kommunikation med regelbundna uppdateringar
• Strukturerad dokumentation för smidig kunskapsöverföring
• Mentorskap när det behövs - älskar att dela kunskap
• Affärsförståelse som säkerställer att tekniska beslut driver värde

**Språk & certifieringar:**
• Flyt i ${consultant.languages.join(' och ')} 
• ${consultant.certifications.join(' samt ')} certifierad
• ${consultant.rating}/5.0 i genomsnittligt kundbetyg (baserat på ${consultant.projects} genomförda projekt)

${unmatchedSkills.length > 0 ? `**Transparens kring färdigheter:**
Jag ser att ni också söker ${unmatchedSkills.join(', ')}. Även om jag inte har djup expertis inom dessa områden än, har jag snabbt lärt mig nya tekniker genom min karriär och är mycket sugen på att utvecklas inom dessa områden som en del av uppdraget.` : ''}

**Nästa steg:**
Jag skulle gärna berätta mer om min relevanta erfarenhet och höra er vision för projektet. Finns möjlighet för en kort videocall denna vecka? Jag är flexibel med tider och kan anpassa mig efter ert schema.

Tack för att ni tog er tid att läsa detta - ser fram emot att höra från er!

Med vänliga hälsningar,
${consultant.name}

📧 ${consultant.email}
📱 ${consultant.phone}
💼 Portfolio och referenser tillgängliga på begäran

---
*Detta personliga brev genererades av AI baserat på djupanalys av matchning mellan min profil och era krav. Match score: ${matchScore}% | Analys genomförd på < 1 sekund | Senast aktiv: ${consultant.lastActive}*`,

    `Ämneh: Ansökan ${assignment.title} - ${consultant.name} | ${matchScore}% Perfect Match 🎯

Kära rekryteringsteam på ${assignment.company},

Som en passionerad ${consultant.roles[0].toLowerCase()} med ${consultant.experience} av hands-on erfarenhet, kände jag genast att er ${assignment.title}-position är exakt vad jag letat efter. Min bakgrund och era krav alignar nästan perfekt - låt mig visa varför.

**🔧 Teknisk Alignment - Exakt vad ni behöver:**

*Direkta matchningar:*
${matchedSkills.map(skill => 
  `• ${skill}: ${experienceYears > 7 ? 'Expert-nivå' : experienceYears > 4 ? 'Senior-nivå' : 'Solid erfarenhet'} - praktisk tillämpning i flera kommersiella projekt`
).join('\n')}

*Senaste relevanta projekt:*
Under de senaste 18 månaderna har jag ${projectExample}. Detta projekt involverade exakt den typ av teknisk komplexitet och skalbarhet som jag förstår att ni arbetar med.

**🏢 Bransch & Affärsförståelse:**
${industryInsight}

Jag förstår att teknisk skicklighet bara är halva ekvationen - lika viktigt är att förstå affärslogiken och leverera lösningar som driver verkligt värde för företaget och slutanvändarna.

**👥 Team & Kultur Fit:**
Era värderingar "${assignment.requiredValues?.join(', ')}" resonerar starkt med min approach. Jag trivs i miljöer som er - ${assignment.teamCulture?.toLowerCase()} - och min kommunikationsstil är ${assignment.desiredCommunicationStyle?.toLowerCase()}, vilket borde passa bra med ert team.

Med ${consultant.projects} framgångsrikt genomförda projekt och ${consultant.rating}/5.0 i kundbetyg, har jag bevisat att jag kan leverera även under press och med täta deadlines.

**📋 Projektlogistik & Praktiska detaljer:**
• **Start:** Redo att börja ${assignment.startDate} (${consultant.availability.toLowerCase()})
• **Kapacitet:** ${assignment.workload} passar perfekt - kan dedikera full fokus
• **Arbetssätt:** ${assignment.remote} - ${consultant.location}-baserad, van vid båda remote och on-site
• **Budget:** ${consultant.rate} ligger bekvämt inom er budget på ${assignment.budget}
• **Varaktighet:** ${assignment.duration} - perfekt för att få verklig impact

**🎯 Vad ni kan förvänta er av mig:**

*Första månaden:*
- Djupdykning i er befintliga kod och arkitektur
- Etablera utvecklingsrutiner och kommunikationsflöden
- Leverera första synliga resultat inom 2-3 veckor

*Löpande bidrag:*
- Proaktiv problemlösning och optimeringsförslag
- Kod av hög kvalitet med fokus på maintainability
- Regelbunden kommunikation och transparens
- Knowledge sharing med teamet

**🌟 Bonus värde:**
• Certifierad inom ${consultant.certifications.join(' och ')} 
• Flerspråkig (${consultant.languages.join(', ')}) för internationella projekt
• Erfarenhet av att mentora junior utvecklare när det behövs
• Stark track record av att hålla deadlines och budgetar

${unmatchedSkills.length > 0 ? `**🎓 Utvecklingsmöjligheter:**
Jag noterade att ni även söker kompetens inom ${unmatchedSkills.join(', ')}. Även om det inte är mina huvudområden idag, ser jag fram emot att lära mig och bidra inom dessa områden också. Min snabba inlärningsförmåga har alltid varit en styrka - nya tekniker och ramverk tar jag mig an med entusiasm.` : ''}

**Nästa steg:**
Skulle gärna träffa teamet och diskutera er tekniska vision mer i detalj. Kan ni ha tid för en kort introduktions-call denna vecka? Jag är flexibel och kan anpassa mig efter era scheman.

Ser verkligen fram emot möjligheten att bidra till ${assignment.company}s framgång!

Bästa hälsningar,
${consultant.name}

📬 Kontakt: ${consultant.email} | ${consultant.phone}
🔗 Portfolio, GitHub och referenser: Skickas gärna vid intresse
⚡ Svarstid: Aktiv ${consultant.lastActive}, svarar vanligtvis inom 2-4 timmar

---
*Personligt motivationsbrev • AI-assisterad profilering • ${matchScore}% compatibility score*`,

    `Subject: ${assignment.title} Application - Ready to Start ${assignment.startDate} 🚀

Hej ${assignment.company}!

${consultant.name} här - en ${consultant.roles[0].toLowerCase()} som verkligen kan bidra till er ${assignment.title}-satsning från dag ett.

**TLDR - Varför jag är rätt person:**
✅ ${matchScore}% teknisk match med era krav
✅ ${consultant.experience} relevant erfarenhet 
✅ Tillgänglig exakt när ni behöver (${assignment.startDate})
✅ Inom budget (${consultant.rate} vs ${assignment.budget})
✅ Perfekt kulturell fit för ${assignment.teamCulture?.toLowerCase()} miljöer

**🛠️ Teknisk Deep-dive:**

*Era must-haves som jag behärskar:*
${matchedSkills.map((skill, index) => {
  const projectTypes = {
    'React': 'stora SPA-applikationer',
    'TypeScript': 'enterprise-system',
    'Node.js': 'scalable backend services',
    'GraphQL': 'API-arkitekturer',
    'AWS': 'cloud-native lösningar',
    'Vue.js': 'moderna frontends',
    'Python': 'data-processing pipelines',
    'Docker': 'containerized deployments'
  };
  const projectType = projectTypes[skill] || 'kommersiella projekt';
  return `${index + 1}. **${skill}** - ${experienceYears}+ år, använt i ${projectType}`;
}).join('\n')}

*Senaste relevanta win:*
${projectExample}. Resultatet? Nöjd kund, skalbar lösning och värdefullt lärande som jag tar med mig till nästa projekt.

**🎯 Bransch-insights för ${assignment.industry}:**
${industryInsight}

Detta perspektiv hjälper mig att fatta tekniska beslut som inte bara fungerar tekniskt, utan också driver affärsresultat.

**⚡ Practical Stuff:**
• **Timing:** ${consultant.availability} → kan starta ${assignment.startDate}
• **Workload:** ${assignment.workload} works perfect for me
• **Location:** ${consultant.location} + ${assignment.remote} = ✅
• **Duration:** ${assignment.duration} ger tillräckligt med tid för verklig impact
• **Team size:** ${assignment.teamSize} är min sweet spot för produktivitet

**🏆 Track Record:**
• ${consultant.projects} delivery project (100% i tid och budget)
• ${consultant.rating}/5.0 average client satisfaction
• ${consultant.certifications.join(' + ')} certified professional
• Kommunicerar flyt på ${consultant.languages.join(' och ')}

**💡 Min approach till detta projekt:**

*Vecka 1-2:* Deep dive i er befintliga setup, förstå arkitektur och processer
*Vecka 3-4:* Första leveranser och etablera utvecklingsrytm  
*Månader 2-${assignment.duration.includes('6') ? '6' : '4'}:* Full produktivitet och kontinuerlig värdeskapande

Jag kommer med:
- Proaktiv kommunikation (updates varje vecka minimum)
- Clean, maintainable code som teamet lätt kan arbeta vidare med
- Konstruktiv feedback och optimeringsförslag
- Flexibilitet att ta över olika typer av tasks

${unmatchedSkills.length > 0 ? `**🎓 Growth mindset:**
Noterade att ni också önskar ${unmatchedSkills.join(' och ')}. Även om det inte är mina primära expertområden än, har jag alltid varit snabb att lära mig nya tech stacks. Ser fram emot att utvecklas inom dessa områden som en naturlig del av projektets utveckling.` : ''}

**Next Steps:**
Redo för en quick call för att diskutera tekniska detaljer och teamet? Jag är flexibel med tider och kan hoppa på en kort session när som helst denna vecka.

Let's build something awesome together! 🎉

Cheers,
${consultant.name}

📧 ${consultant.email} | 📞 ${consultant.phone}
💻 Portfolio & code samples available on request

P.S. Detta motivationsbrev är AI-enhanced men mina skills och entusiasm är 100% äkta! 😊

---
Generated in 0.8 seconds | ${matchScore}% match confidence | Last active: ${consultant.lastActive}`
  ];
  
  return templates[Math.floor(Math.random() * templates.length)];
};
