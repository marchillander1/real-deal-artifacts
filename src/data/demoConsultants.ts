import { Consultant } from '@/types/consultant';

export const demoConsultants: Consultant[] = [
  {
    id: 1,
    name: "Anna Svensson",
    role: "Senior Frontend Developer",
    skills: ["React", "TypeScript", "Node.js", "GraphQL", "AWS"],
    experience: "8 years",
    rate: "950 SEK/hour",
    availability: "Available",
    location: "Stockholm",
    rating: 4.9,
    profileImage: "/placeholder.svg",
    type: "demo",
    email: "anna.svensson@example.com",
    phone: "+46 70 123 4567",
    linkedinUrl: "https://linkedin.com/in/annasvensson",
    
    // CV Analysis
    cvAnalysis: {
      technicalSkills: {
        frontend: ["React", "Vue.js", "Angular", "TypeScript", "JavaScript", "HTML5", "CSS3", "Sass"],
        backend: ["Node.js", "Express", "GraphQL", "REST APIs"],
        databases: ["PostgreSQL", "MongoDB", "Redis"],
        cloud: ["AWS", "Docker", "Kubernetes"],
        tools: ["Git", "Webpack", "Jest", "Cypress"]
      },
      personalityTraits: [
        "Analytisk och detaljorienterad",
        "Stark problemlösningsförmåga", 
        "Teamorienterad och samarbetsvillig",
        "Proaktiv och initiativtagande",
        "Fokuserad på kodkvalitet och best practices"
      ],
      workStyle: "Agile/Scrum-fokuserad med stark betoning på kvalitet och kontinuerlig förbättring. Föredrar kollaborativa miljöer med tydlig kommunikation.",
      communicationStyle: "Direkt och tydlig kommunikation. Bra på att förklara tekniska koncept för icke-tekniska intressenter.",
      leadershipExperience: "Lett utvecklingsteam på 4-5 personer i 2 år. Mentor för junior utvecklare.",
      achievements: [
        "Lett migration från legacy system till modern React-arkitektur",
        "Implementerade CI/CD pipeline som minskade deployment-tid med 70%",
        "Utvecklade designsystem som används av 3 produktteam"
      ],
      education: "MSc Computer Science, KTH Royal Institute of Technology",
      certifications: ["AWS Certified Developer", "React Professional Certificate"],
      languages: ["Svenska (modersmål)", "Engelska (flyt)", "Tyska (grundläggande)"],
      interests: ["Open source bidrag", "Tech meetups", "UX/UI design", "Hållbar utveckling"]
    },

    // LinkedIn Analysis  
    linkedinAnalysis: {
      professionalSummary: "Erfaren frontend-utvecklare med passion för att skapa användarvänliga och performanta webbapplikationer. Stark bakgrund inom React och TypeScript med fokus på skalbar arkitektur.",
      currentRole: "Senior Frontend Developer på TechCorp AB",
      careerProgression: "Konsekvent karriärutveckling från Junior till Senior på 8 år med ökande ansvar för arkitektur och teamledning.",
      networkQuality: "Starkt nätverk inom tech-communityn med 500+ kontakter, aktiv på LinkedIn med regelbundna posts om frontend-utveckling.",
      recommendationsReceived: [
        "Anna är en exceptionell utvecklare med djup teknisk kunskap och förmåga att leverera kvalitet under press - Maria Lindqvist, Tech Lead",
        "Annas mentorskap har varit ovärderligt för mitt utvecklande som utvecklare - Erik Johansson, Junior Developer"
      ],
      endorsements: {
        "React": 45,
        "TypeScript": 38,
        "JavaScript": 52,
        "Team Leadership": 23,
        "Problem Solving": 34
      },
      activityLevel: "Hög aktivitet med 2-3 posts per vecka, delar tekniska insights och branschartiklar",
      companyConnections: "Välkopplad inom tech-sektorn med kontakter på Google, Microsoft, Spotify och andra ledande företag"
    }
  },
  
  {
    id: 2,
    name: "Erik Johansson",
    role: "Full-Stack Developer", 
    skills: ["Python", "Django", "React", "PostgreSQL", "Docker"],
    experience: "5 years",
    rate: "750 SEK/hour",
    availability: "Partially Available",
    location: "Göteborg",
    rating: 4.7,
    profileImage: "/placeholder.svg",
    type: "demo",
    email: "erik.johansson@example.com",
    phone: "+46 70 234 5678",
    linkedinUrl: "https://linkedin.com/in/erikjohansson",
    
    cvAnalysis: {
      technicalSkills: {
        backend: ["Python", "Django", "Flask", "FastAPI", "PostgreSQL", "MongoDB"],
        frontend: ["React", "JavaScript", "TypeScript", "HTML5", "CSS3"],
        cloud: ["Docker", "AWS", "GCP"],
        tools: ["Git", "Jenkins", "Pytest", "Postman"]
      },
      personalityTraits: [
        "Systematisk och metodisk approach",
        "Stark fokus på kod-kvalitet och testning",
        "Självständig men bra teamspelare",
        "Nyfiken och lärvillig",
        "Balanserad mellan frontend och backend"
      ],
      workStyle: "Test-driven development med fokus på ren, underhållbar kod. Föredrar iterativ utveckling med kontinuerlig feedback.",
      communicationStyle: "Lugn och reflekterande kommunikationsstil. Bra på att lyssna och ställa rätt frågor.",
      leadershipExperience: "Teknisk lead för mindre projekt. Mentor för praktikanter.",
      achievements: [
        "Byggde skalbar API som hanterar 100k+ requests/dag",
        "Implementerade automatiserad testing som minskade bugs med 60%",
        "Utvecklade internal tools som sparar 10h/vecka för teamet"
      ],
      education: "BSc Software Engineering, Chalmers University",
      certifications: ["AWS Solutions Architect Associate", "Python Professional Certificate"],
      languages: ["Svenska (modersmål)", "Engelska (flyt)", "Spanska (konversation)"],
      interests: ["Machine Learning", "Hiking", "Photography", "Sustainable tech"]
    },

    linkedinAnalysis: {
      professionalSummary: "Full-stack utvecklare med stark passion för backend-utveckling och systemarkitektur. Älskar att lösa komplexa tekniska utmaningar.",
      currentRole: "Senior Developer på DataSolutions AB",
      careerProgression: "Steady growth från trainee till senior på 5 år, med fokus på både teknisk djupkunskap och projektledning.",
      networkQuality: "Växande nätverk med 300+ kontakter, aktiv i Python- och Django-communities.",
      recommendationsReceived: [
        "Erik levererar alltid kod av högsta kvalitet och är en problemlösare av rang - Anna Petersson, Project Manager"
      ],
      endorsements: {
        "Python": 32,
        "Django": 28,
        "PostgreSQL": 24,
        "Problem Solving": 18,
        "System Design": 15
      },
      activityLevel: "Måttlig aktivitet, delar mest tekniska artiklar och lärdommar från projekt",
      companyConnections: "Starka kopplingar inom fintech och healthtech-sektorn"
    }
  },

  {
    id: 3,
    name: "Maria Lindqvist",
    role: "DevOps Engineer",
    skills: ["Kubernetes", "Terraform", "AWS", "Docker", "Python"],
    experience: "6 years", 
    rate: "850 SEK/hour",
    availability: "Available",
    location: "Stockholm",
    rating: 4.8,
    profileImage: "/placeholder.svg",
    type: "demo",
    email: "maria.lindqvist@example.com",
    phone: "+46 70 345 6789",
    linkedinUrl: "https://linkedin.com/in/marialindqvist",
    
    cvAnalysis: {
      technicalSkills: {
        cloud: ["AWS", "GCP", "Azure", "Kubernetes", "Docker", "Terraform"],
        automation: ["Ansible", "Jenkins", "GitLab CI", "GitHub Actions"],
        monitoring: ["Prometheus", "Grafana", "ELK Stack", "DataDog"],
        scripting: ["Python", "Bash", "PowerShell"],
        databases: ["PostgreSQL", "MongoDB", "Redis"]
      },
      personalityTraits: [
        "Extremt strukturerad och organiserad",
        "Stark fokus på automation och effektivitet", 
        "Proaktiv problemlösare",
        "Säkerhetsfokuserad mindset",
        "Utmärkt under press och vid incidenter"
      ],
      workStyle: "Infrastructure as Code-fokuserad med stark betoning på säkerhet och skalbarhet. Föredrar automatiserade lösningar över manuella processer.",
      communicationStyle: "Tydlig och faktabaserad kommunikation. Excellent på att dokumentera och dela kunskap.",
      leadershipExperience: "DevOps lead för infrastruktur-team på 6 personer. Lett flera cloud migration-projekt.",
      achievements: [
        "Ledde migration till Kubernetes som resulterade i 40% kostnadsbesparingar",
        "Implementerade CI/CD pipeline som minskade deployment-tid från 2h till 10min",
        "Byggde monitoring-system som förbättrade incident response-tid med 75%"
      ],
      education: "MSc Systems Engineering, Linköping University",
      certifications: ["AWS Solutions Architect Professional", "Certified Kubernetes Administrator", "Terraform Associate"],
      languages: ["Svenska (modersmål)", "Engelska (flyt)", "Norska (flyt)"],
      interests: ["Cloud architecture", "Automation", "Security", "Mentoring women in tech"]
    },

    linkedinAnalysis: {
      professionalSummary: "DevOps engineer med djup expertis inom cloud infrastructure och automation. Passionate om att bygga stabila, skalbara system.",
      currentRole: "Senior DevOps Engineer på CloudFirst AB",
      careerProgression: "Snabb utveckling från system administrator till senior DevOps på 6 år, med flera större projektledningsuppdrag.",
      networkQuality: "Starkt nätverk inom DevOps och cloud communities med 450+ kontakter.",
      recommendationsReceived: [
        "Maria är den bästa DevOps engineer jag arbetat med - hennes tekniska skills och ledarskap är outstanding - Peter Nilsson, CTO"
      ],
      endorsements: {
        "Kubernetes": 38,
        "AWS": 42,
        "Terraform": 29,
        "DevOps": 35,
        "Team Leadership": 20
      },
      activityLevel: "Mycket aktiv med regelbundna posts om cloud trends och DevOps best practices",
      companyConnections: "Excellent kontakter inom enterprise och startup-världen"
    }
  }
];
