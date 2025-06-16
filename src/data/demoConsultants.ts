
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
    type: "existing",
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
      personalityTraits: {
        problemSolvingApproach: "Analytisk och detaljorienterad",
        communicationStyle: "Direkt och tydlig kommunikation",
        workStyle: "Agile/Scrum-fokuserad med stark betoning på kvalitet",
        adaptability: "Stark problemlösningsförmåga",
        initiativeTaking: "Proaktiv och initiativtagande",
        attentionToDetail: "Fokuserad på kodkvalitet och best practices",
        continuousLearning: "Teamorienterad och samarbetsvillig"
      },
      workStyle: "Agile/Scrum-fokuserad med stark betoning på kvalitet och kontinuerlig förbättring. Föredrar kollaborativa miljöer med tydlig kommunikation.",
      communicationStyle: "Direkt och tydlig kommunikation. Bra på att förklara tekniska koncept för icke-tekniska intressenter.",
      leadershipExperience: "Lett utvecklingsteam på 4-5 personer i 2 år. Mentor för junior utvecklare.",
      achievements: [
        "Lett migration från legacy system till modern React-arkitektur",
        "Implementerade CI/CD pipeline som minskade deployment-tid med 70%",
        "Utvecklade designsystem som används av 3 produktteam"
      ],
      education: {
        formal: [
          {
            degree: "MSc Computer Science",
            institution: "KTH Royal Institute of Technology",
            year: "2015"
          }
        ],
        certifications: ["AWS Certified Developer", "React Professional Certificate"]
      },
      languages: ["Svenska (modersmål)", "Engelska (flyt)", "Tyska (grundläggande)"],
      interests: ["Open source bidrag", "Tech meetups", "UX/UI design", "Hållbar utveckling"]
    },

    // LinkedIn Analysis  
    linkedinAnalysis: {
      communicationStyle: "Erfaren frontend-utvecklare med passion för att skapa användarvänliga och performanta webbapplikationer",
      leadershipStyle: "Konsekvent karriärutveckling från Junior till Senior på 8 år med ökande ansvar",
      culturalFit: 5,
      leadership: 4,
      innovation: 4,
      problemSolving: "Starkt nätverk inom tech-communityn med 500+ kontakter",
      businessAcumen: "Aktiv på LinkedIn med regelbundna posts om frontend-utveckling",
      teamCollaboration: "Anna är en exceptionell utvecklare med djup teknisk kunskap - Maria Lindqvist",
      adaptability: 5
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
    type: "existing",
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
      personalityTraits: {
        problemSolvingApproach: "Systematisk och metodisk approach",
        communicationStyle: "Lugn och reflekterande kommunikationsstil",
        workStyle: "Test-driven development med fokus på ren kod",
        adaptability: "Självständig men bra teamspelare",
        initiativeTaking: "Nyfiken och lärvillig",
        attentionToDetail: "Stark fokus på kod-kvalitet och testning",
        continuousLearning: "Balanserad mellan frontend och backend"
      },
      workStyle: "Test-driven development med fokus på ren, underhållbar kod. Föredrar iterativ utveckling med kontinuerlig feedback.",
      communicationStyle: "Lugn och reflekterande kommunikationsstil. Bra på att lyssna och ställa rätt frågor.",
      leadershipExperience: "Teknisk lead för mindre projekt. Mentor för praktikanter.",
      achievements: [
        "Byggde skalbar API som hanterar 100k+ requests/dag",
        "Implementerade automatiserad testing som minskade bugs med 60%",
        "Utvecklade internal tools som sparar 10h/vecka för teamet"
      ],
      education: {
        formal: [
          {
            degree: "BSc Software Engineering",
            institution: "Chalmers University",
            year: "2018"
          }
        ],
        certifications: ["AWS Solutions Architect Associate", "Python Professional Certificate"]
      },
      languages: ["Svenska (modersmål)", "Engelska (flyt)", "Spanska (konversation)"],
      interests: ["Machine Learning", "Hiking", "Photography", "Sustainable tech"]
    },

    linkedinAnalysis: {
      communicationStyle: "Full-stack utvecklare med stark passion för backend-utveckling och systemarkitektur",
      leadershipStyle: "Steady growth från trainee till senior på 5 år",
      culturalFit: 4,
      leadership: 3,
      innovation: 4,
      problemSolving: "Växande nätverk med 300+ kontakter",
      businessAcumen: "Aktiv i Python- och Django-communities",
      teamCollaboration: "Erik levererar alltid kod av högsta kvalitet - Anna Petersson",
      adaptability: 4
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
    type: "existing",
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
      personalityTraits: {
        problemSolvingApproach: "Extremt strukturerad och organiserad",
        communicationStyle: "Tydlig och faktabaserad kommunikation",
        workStyle: "Infrastructure as Code-fokuserad",
        adaptability: "Stark fokus på automation och effektivitet",
        initiativeTaking: "Proaktiv problemlösare",
        attentionToDetail: "Säkerhetsfokuserad mindset",
        continuousLearning: "Utmärkt under press och vid incidenter"
      },
      workStyle: "Infrastructure as Code-fokuserad med stark betoning på säkerhet och skalbarhet. Föredrar automatiserade lösningar över manuella processer.",
      communicationStyle: "Tydlig och faktabaserad kommunikation. Excellent på att dokumentera och dela kunskap.",
      leadershipExperience: "DevOps lead för infrastruktur-team på 6 personer. Lett flera cloud migration-projekt.",
      achievements: [
        "Ledde migration till Kubernetes som resulterade i 40% kostnadsbesparingar",
        "Implementerade CI/CD pipeline som minskade deployment-tid från 2h till 10min",
        "Byggde monitoring-system som förbättrade incident response-tid med 75%"
      ],
      education: {
        formal: [
          {
            degree: "MSc Systems Engineering",
            institution: "Linköping University",
            year: "2017"
          }
        ],
        certifications: ["AWS Solutions Architect Professional", "Certified Kubernetes Administrator", "Terraform Associate"]
      },
      languages: ["Svenska (modersmål)", "Engelska (flyt)", "Norska (flyt)"],
      interests: ["Cloud architecture", "Automation", "Security", "Mentoring women in tech"]
    },

    linkedinAnalysis: {
      communicationStyle: "DevOps engineer med djup expertis inom cloud infrastructure och automation",
      leadershipStyle: "Snabb utveckling från system administrator till senior DevOps på 6 år",
      culturalFit: 5,
      leadership: 5,
      innovation: 4,
      problemSolving: "Starkt nätverk inom DevOps och cloud communities med 450+ kontakter",
      businessAcumen: "Passionate om att bygga stabila, skalbara system",
      teamCollaboration: "Maria är den bästa DevOps engineer jag arbetat med - Peter Nilsson, CTO",
      adaptability: 5
    }
  }
];
