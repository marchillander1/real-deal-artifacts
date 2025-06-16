
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

    let reply = '';
    
    // Enhanced keyword detection for more specific responses
    const messageLC = message.toLowerCase();

    // Career Development & Specialization
    if (messageLC.includes('karriär') || messageLC.includes('career') || messageLC.includes('utveckling') || messageLC.includes('senior') || messageLC.includes('tech lead') || messageLC.includes('arkitekt')) {
      reply = `# Career Development for Consultants 🚀

## Technical Career Paths

### 🔧 **Developer → Senior Developer**
- **Timeline:** 3-5 years
- **Key Skills:** Master 2-3 programming languages deeply
- **Rate Impact:** +40-60% increase
- **Focus Areas:**
  - Code architecture and design patterns
  - Performance optimization
  - Testing strategies and TDD/BDD

### 👑 **Senior Developer → Tech Lead**
- **Timeline:** 5-8 years
- **Key Skills:** Technical leadership + communication
- **Rate Impact:** +50-80% increase
- **Focus Areas:**
  - Team mentoring and code reviews
  - Technical decision making
  - Cross-team communication
  - Project planning and estimation

### 🏗️ **Tech Lead → Solution Architect**
- **Timeline:** 8-12 years
- **Key Skills:** System design + business understanding
- **Rate Impact:** +60-100% increase
- **Focus Areas:**
  - Enterprise architecture patterns
  - Cloud platform expertise (AWS/Azure/GCP)
  - Integration strategies
  - Business-technology alignment

---

## Industry Specialization Strategy

### 💰 **High-Value Industries**
- **Fintech:** +20-30% rate premium
- **Healthtech:** +15-25% rate premium
- **E-commerce:** +10-20% rate premium
- **Gaming:** +15-25% rate premium

### 🎯 **Niche Positioning**
- Choose 1-2 industries max for deep expertise
- Become the "go-to" person for specific challenges
- Build case studies and success stories
- Speak at industry conferences

---

## Technology Stack Valuation

### 🔥 **High-Demand Technologies (2024)**
- **AI/ML:** Python, TensorFlow, PyTorch (+30-50%)
- **Cloud Native:** Kubernetes, Docker, Microservices (+25-40%)
- **Data Engineering:** Spark, Kafka, Data Lakes (+30-45%)
- **DevOps/Platform:** Terraform, CI/CD, Monitoring (+20-35%)

### 📈 **Emerging Technologies**
- **Web3/Blockchain:** Solidity, DeFi protocols (+40-60%)
- **Quantum Computing:** Qiskit, Cirq (+50-80%)
- **Edge Computing:** IoT, Real-time processing (+25-40%)

---

## Certification ROI Analysis

### 🏆 **High-ROI Certifications**
- **AWS Solutions Architect:** +15-25% rate increase
- **Kubernetes (CKA/CKAD):** +20-30% rate increase
- **Scrum Master (PSM I/II):** +10-20% rate increase
- **Security (CISSP/CEH):** +25-35% rate increase

💡 **Pro Tip:** Combine technical certs with business skills for maximum impact!`;

    // Pricing & Negotiation
    } else if (messageLC.includes('pris') || messageLC.includes('arvode') || messageLC.includes('pricing') || messageLC.includes('rate') || messageLC.includes('förhandl') || messageLC.includes('negotiat')) {
      reply = `# Consultant Pricing & Negotiation Mastery 💰

## Dynamic Pricing Strategy

### 🎯 **Base Rate Calculation**
\`\`\`
Base Rate = (Desired Annual Income ÷ 1,600 billable hours) × 1.4
\`\`\`
*The 1.4 multiplier covers taxes, benefits, and business costs*

### 📊 **Technology Premium Matrix**

| Technology Stack | Base Multiplier | Senior Multiplier |
|-----------------|----------------|-------------------|
| Legacy Systems (COBOL, Mainframe) | +30% | +50% |
| AI/ML (Python, TensorFlow) | +25% | +45% |
| Cloud Native (K8s, Microservices) | +20% | +40% |
| Frontend Frameworks (React, Vue) | +10% | +25% |
| Backend APIs (Node.js, .NET) | +5% | +20% |

---

## Regional Rate Guidelines (Sweden 2024)

### 🏙️ **Stockholm Market**
- **Junior (0-2 years):** 650-850 SEK/hour
- **Mid-level (3-5 years):** 850-1,200 SEK/hour
- **Senior (5-8 years):** 1,200-1,600 SEK/hour
- **Expert/Lead (8+ years):** 1,600-2,200 SEK/hour

### 🌆 **Gothenburg/Malmö**
- Apply 0.85x Stockholm rates

### 🏞️ **Remote/Smaller Cities**
- Apply 0.75x Stockholm rates

---

## Negotiation Tactics

### 🎭 **The Value-First Approach**
1. **Lead with outcomes:** "I helped Company X reduce deployment time by 70%"
2. **Quantify impact:** "This saved them 200 developer hours monthly"
3. **Connect to revenue:** "Resulting in €50K monthly cost savings"

### 💡 **Rate Increase Strategies**

#### **Mid-Project Increases**
- Only when scope significantly expands
- Minimum 3-month notice for existing projects
- Position as "market adjustment" not personal need

#### **Annual Rate Reviews**
- Standard 8-15% increase for inflation
- Additional 15-30% for new certifications/skills
- 25-50% for role elevation (dev → tech lead)

### 🎯 **Premium Positioning Techniques**

#### **Urgency Premium:** +25-50%
- Same-day start requests
- Critical system failures
- Tight deadline projects

#### **Expertise Premium:** +30-60%
- Rare technology combinations
- Industry-specific knowledge
- Previous similar project success

#### **Risk Premium:** +20-40%
- Unproven technologies
- High-stakes projects
- Regulatory compliance requirements

---

## Contract Negotiation Checklist

### ✅ **Essential Terms**
- **Payment terms:** Net 15 maximum
- **Cancellation notice:** 2-4 weeks
- **IP ownership:** Clearly defined
- **Expense reimbursement:** Travel, equipment
- **Rate adjustment clause:** Annual or per milestone

### 🚫 **Red Flags to Avoid**
- Net 60+ payment terms
- Unlimited liability clauses
- Non-compete restrictions
- Fixed-price with unclear scope
- "Equity instead of payment" offers

💡 **Remember:** Your rate is not just payment—it's positioning. Price yourself as a premium expert, not a commodity resource.`;

    // CV & LinkedIn Optimization
    } else if (messageLC.includes('cv') || messageLC.includes('linkedin') || messageLC.includes('profil') || messageLC.includes('optimize') || messageLC.includes('förbättra')) {
      reply = `# CV & LinkedIn Optimization for Consultants 📊

## CV Optimization Strategy

### 🎯 **The STAR-C Method for Project Descriptions**
**Situation → Task → Action → Result → Context**

#### ❌ **Weak Example:**
"Worked on e-commerce platform development"

#### ✅ **Strong Example:**
"**Situation:** Legacy e-commerce platform causing 30% cart abandonment  
**Task:** Redesign checkout flow and optimize performance  
**Action:** Implemented React-based SPA with Redux state management  
**Result:** Reduced cart abandonment to 12% (+€2M annual revenue)  
**Context:** Led team of 4 developers, delivered in 8 weeks"

---

## Technology Keyword Optimization

### 🔍 **ATS-Friendly Formatting**
- Use standard section headers: "Professional Experience", "Technical Skills"
- Include both acronyms and full names: "AI/Artificial Intelligence"
- Add skill level indicators: "Expert", "Advanced", "Intermediate"

### 📈 **High-Value Keywords by Role**

#### **Frontend Developers**
Primary: React, TypeScript, Next.js, Vue.js, Angular
Secondary: Redux, GraphQL, Webpack, Jest, Cypress
Emerging: Svelte, Solid.js, Web Components

#### **Backend Developers**
Primary: Node.js, Python, Java, Microservices, APIs
Secondary: Docker, Kubernetes, AWS, PostgreSQL, Redis
Emerging: Rust, Go, Serverless, Event-driven architecture

#### **Full-Stack Developers**
Primary: JavaScript/TypeScript, React, Node.js, Cloud platforms
Secondary: DevOps, CI/CD, Database design, Security
Emerging: JAMstack, Edge computing, Headless CMS

---

## LinkedIn Profile Optimization

### 👑 **Headline Formula**
"[Role] | [Key Technology] Expert | [Value Proposition] | [Unique Differentiator]"

#### ✅ **Examples:**
- "Senior React Developer | TypeScript Expert | Building Scalable Frontend Solutions | Former Spotify Engineer"
- "Cloud Architect | AWS Certified | Helping Startups Scale to 1M+ Users | 50+ Successful Migrations"

### 📝 **About Section Structure**

#### **Hook (First 2 lines)**
"I help companies [specific outcome] by [your unique approach]"

#### **Credibility (Lines 3-5)**
- Years of experience
- Notable companies/projects
- Quantified achievements

#### **Skills & Expertise (Lines 6-8)**
- Core technologies
- Industry specializations
- Unique combinations

#### **Call to Action (Final line)**
"DM me to discuss your next project"

---

## Content Strategy for Maximum Visibility

### 📅 **Posting Schedule**
- **Monday:** Industry insights/trends
- **Wednesday:** Technical tutorials/tips
- **Friday:** Project showcases/wins
- **Frequency:** 2-3 posts per week minimum

### 🎭 **Content Types That Work**

#### **Tutorial Posts** (High Engagement)
"🧵 Thread: 5 React performance optimization techniques that reduced our app's load time by 60%"

#### **Behind-the-Scenes** (Builds Trust)
"Day 3 of migrating legacy PHP system to Node.js microservices. Here's what I learned..."

#### **Industry Commentary** (Thought Leadership)
"Hot take: The rush to microservices is causing more problems than it solves. Here's when you should (and shouldn't) use them..."

#### **Success Stories** (Social Proof)
"🎉 Just shipped a real-time analytics dashboard that processes 1M+ events/hour. Tech stack: React + Node.js + Redis Streams"

---

## Advanced LinkedIn Strategies

### 🎯 **Strategic Networking**
- Connect with CTOs/Engineering Managers
- Engage with their content before connecting
- Send personalized messages referencing their work
- Follow up with value-first conversations

### 📊 **LinkedIn Algorithm Optimization**
- Post during business hours (9-11 AM, 1-3 PM CET)
- Use 3-5 relevant hashtags max
- Include industry keywords naturally
- Respond to comments within first hour

### 🔄 **Content Repurposing**
1. **Blog Post** → LinkedIn carousel
2. **GitHub Project** → LinkedIn video demo
3. **Conference Talk** → LinkedIn article series
4. **Client Success** → Case study post

---

## A/B Testing Your Profile

### 🧪 **Elements to Test**
- Headlines (try 3 different versions over 3 months)
- Profile photos (professional vs. casual)
- About section hooks
- Featured section content

### 📈 **Metrics to Track**
- Profile views per week
- Connection requests received
- Message inquiries
- Job/project opportunities

💡 **Pro Tip:** Your LinkedIn profile should tell a story of progression and specialization. Each element should reinforce your positioning as a premium consultant in your niche.`;

    // Business Development & Client Relations
    } else if (messageLC.includes('kund') || messageLC.includes('client') || messageLC.includes('affär') || messageLC.includes('business') || messageLC.includes('relationship') || messageLC.includes('nätverk') || messageLC.includes('network')) {
      reply = `# Business Development & Client Relations Mastery 🤝

## Client Acquisition Strategy

### 🎯 **The Consultant's Sales Funnel**

#### **1. Awareness (Top of Funnel)**
- Technical blog posts solving real problems
- Speaking at conferences and meetups
- Open source contributions
- Thought leadership on LinkedIn

#### **2. Interest (Middle of Funnel)**
- Free technical audits or consultations
- Educational webinars or workshops
- Case studies and success stories
- Targeted networking events

#### **3. Decision (Bottom of Funnel)**
- Detailed project proposals
- References from previous clients
- Clear ROI projections
- Risk mitigation strategies

---

## Building Long-Term Client Relationships

### 💎 **The Trusted Advisor Framework**

#### **Phase 1: Prove Value (Months 1-3)**
- Deliver quick wins in first 30 days
- Exceed initial expectations
- Document and communicate all improvements
- Establish regular check-ins and reporting

#### **Phase 2: Expand Influence (Months 4-12)**
- Identify additional pain points
- Propose strategic improvements
- Introduce new technologies/processes
- Build relationships across the organization

#### **Phase 3: Strategic Partnership (Year 2+)**
- Participate in long-term planning
- Mentor internal teams
- Lead major transformation initiatives
- Become the "go-to" external expert

---

## Networking Strategies That Actually Work

### 🌐 **Digital Networking**

#### **LinkedIn Strategy**
- Engage authentically with industry leaders' content
- Share insights from your current projects (without breaching confidentiality)
- Offer helpful advice in relevant groups
- Create valuable content that demonstrates expertise

#### **GitHub/Open Source**
- Contribute to popular projects in your tech stack
- Maintain high-quality personal projects
- Write comprehensive README files
- Engage with other developers' work

### 🏢 **In-Person Networking**

#### **Industry Events**
- Focus on quality conversations over quantity
- Prepare 2-3 relevant questions for each person you meet
- Follow up within 48 hours with specific value
- Offer help before asking for anything

#### **Local Tech Communities**
- Join or organize meetups in your expertise area
- Volunteer to speak about your experiences
- Mentor junior developers
- Participate in hackathons or coding events

---

## Proposal & Presentation Mastery

### 📋 **The Winning Proposal Structure**

#### **1. Executive Summary (30 seconds to hook them)**
- Clear problem statement
- Your unique solution approach
- Expected business impact
- Timeline and investment overview

#### **2. Problem Analysis (Show deep understanding)**
- Current state assessment
- Root cause analysis
- Impact on business objectives
- Risks of inaction

#### **3. Solution Design (Demonstrate expertise)**
- Technical approach and architecture
- Implementation methodology
- Team structure and roles
- Technology stack rationale

#### **4. Business Case (Connect to revenue/savings)**
- ROI calculations and projections
- Risk mitigation strategies
- Success metrics and KPIs
- Comparison with alternatives

#### **5. Execution Plan (Build confidence)**
- Detailed project timeline
- Milestone deliverables
- Communication protocols
- Change management approach

---

## Client Retention & Expansion

### 🔄 **The Recurring Revenue Model**

#### **Retainer Agreements**
- Monthly strategic advisory (20-40 hours)
- Ongoing technical support and maintenance
- Regular technology reviews and updates
- Emergency response availability

#### **Success-Based Partnerships**
- Performance improvement bonuses
- Revenue share on successful initiatives
- Equity stakes in transformation projects
- Long-term technology partnerships

### 📈 **Expansion Opportunities**

#### **Horizontal Expansion**
- Different departments with similar needs
- Related companies in their portfolio
- Partners and suppliers in their ecosystem
- Industry connections and referrals

#### **Vertical Expansion**
- Advanced features and capabilities
- Integration with additional systems
- Training and knowledge transfer
- Ongoing optimization and evolution

---

## Managing Difficult Client Situations

### ⚠️ **Common Challenges & Solutions**

#### **Scope Creep**
- **Prevention:** Detailed SOW with specific deliverables
- **Response:** Immediate scope change documentation
- **Resolution:** "Change request" process with pricing

#### **Payment Delays**
- **Prevention:** Clear payment terms and late fees
- **Response:** Professional but firm collection process
- **Resolution:** Payment plans or project suspension

#### **Unrealistic Expectations**
- **Prevention:** Detailed requirement gathering phase
- **Response:** Transparent communication about constraints
- **Resolution:** Re-scope project with realistic goals

#### **Technical Disagreements**
- **Prevention:** Decision criteria established upfront
- **Response:** Present data-driven alternatives
- **Resolution:** Prototype competing approaches

---

## Building Your Expert Brand

### 🎭 **Personal Branding Strategy**

#### **Choose Your Positioning**
- "The React Performance Expert"
- "The Cloud Migration Specialist"
- "The Startup CTO Whisperer"
- "The Legacy System Modernization Expert"

#### **Content Pillars**
1. **Technical Tutorials** (40% of content)
2. **Industry Insights** (30% of content)
3. **Client Success Stories** (20% of content)
4. **Personal Journey/Learning** (10% of content)

#### **Thought Leadership Tactics**
- Predict industry trends 6-12 months ahead
- Challenge conventional wisdom with data
- Share contrarian but well-reasoned opinions
- Create frameworks and methodologies

💡 **Remember:** Business development is a long-term game. Focus on building genuine relationships and delivering exceptional value. The opportunities will follow naturally.`;

    // General MatchWise information (default)
    } else if (messageLC.includes('matchwise') || messageLC.includes('platform') || messageLC.includes('vad är') || messageLC.includes('what is')) {
      reply = `# MatchWise - AI-Driven Consultant Matching Platform 🚀

## How MatchWise Works

### 🤖 **Advanced AI Analysis**
Our sophisticated AI performs comprehensive analysis of:

#### **Technical Expertise Assessment**
- Programming languages and frameworks (skill levels from beginner to expert)
- Project complexity analysis and technology combinations
- Years of experience calculation per technology
- Industry-specific technical knowledge

#### **Professional Competency Evaluation**
- Leadership experience and team management skills
- Project delivery track record and success metrics
- Communication style and stakeholder management
- Problem-solving approach and innovation indicators

#### **Personality & Cultural Fit Analysis**
- Work style preferences (independent vs collaborative)
- Communication patterns and conflict resolution
- Adaptability and learning agility
- Cultural values and team dynamics compatibility

---

## For Consultants

### 📈 **Maximize Your Market Value**
- **AI-Powered Profile Optimization:** Get specific recommendations to improve your CV and LinkedIn
- **Rate Benchmarking:** See how your rates compare to similar consultants in the market
- **Skill Gap Analysis:** Identify high-value skills to develop for maximum ROI

### 🎯 **Find Perfect Matches**
- **Automatic Opportunity Matching:** Receive notifications for assignments that match your expertise
- **Cultural Fit Scoring:** Ensure alignment with company values and team dynamics
- **Project Complexity Matching:** Get assignments that challenge you at the right level

### 🚀 **Career Development**
- **Personalized Career Roadmap:** Get AI-driven advice on your next career moves
- **Market Trend Analysis:** Stay ahead of technology and industry trends
- **Network Building:** Connect with other consultants and potential clients

---

## For Companies

### 🔍 **Find the Right Consultant Fast**
- **Advanced Search & Filtering:** Find consultants by specific technical skills, experience level, and availability
- **Cultural Fit Assessment:** Ensure new team members align with your company culture
- **Performance Prediction:** AI-powered matching reduces hiring risks by 60%

### 💰 **Optimize Your Investment**
- **Rate Transparency:** See market rates for different skill combinations
- **ROI Calculation:** Understand the business impact of different consultant choices
- **Time-to-Value Metrics:** Track how quickly consultants deliver results

### 📊 **Data-Driven Decisions**
- **Consultant Performance Analytics:** Track project success rates and delivery metrics
- **Market Intelligence:** Understand talent availability and pricing trends
- **Predictive Matching:** AI learns from successful placements to improve future matches

---

## The MatchWise Advantage

### 🧠 **Proprietary AI Technology**
- **Natural Language Processing:** Deep analysis of CV content and communication style
- **Machine Learning Models:** Continuously improving match accuracy based on successful placements
- **Predictive Analytics:** Forecast project success probability and consultant performance

### 🔒 **Security & Privacy**
- **GDPR Compliant:** Full data protection and user control
- **Confidential Matching:** Companies can search without revealing identity
- **Secure Communication:** All interactions through encrypted platform

### 🌟 **Success Metrics**
- **95% Match Satisfaction Rate:** Both consultants and companies report high satisfaction
- **40% Faster Hiring:** Reduce time-to-hire from weeks to days
- **60% Higher Project Success Rate:** Better matching leads to better outcomes

---

## Getting Started

### 👨‍💻 **For Consultants**
1. **Upload Your CV:** Our AI analyzes your experience and skills
2. **Complete Your Profile:** Add LinkedIn, preferences, and availability
3. **Get Matched:** Receive opportunities that fit your expertise and goals
4. **Connect & Win:** Engage with clients and land your ideal assignments

### 🏢 **For Companies**
1. **Create Assignment Brief:** Describe your project needs and team culture
2. **Review AI Matches:** See top consultant recommendations with fit scores
3. **Connect Directly:** Reach out to consultants through our platform
4. **Track Success:** Monitor project progress and consultant performance

💡 **Ready to transform how you work as a consultant or find top talent for your projects?**

🚀 **Join MatchWise today and experience the future of consultant-client matching!**`;

    // Default helpful response
    } else {
      reply = `# Hello! I'm your MatchWise AI Consultant Expert 🤖

I'm here to help you excel as a consultant and make the most of the MatchWise platform. I have deep expertise in:

## 🎯 **What I Can Help You With:**

### 💼 **Career Development**
- Technical career progression strategies
- Industry specialization and niche positioning
- Certification ROI analysis and recommendations
- Technology trend analysis and future-proofing

### 💰 **Pricing & Business Strategy**
- Dynamic rate calculation and optimization
- Negotiation tactics and contract terms
- Market positioning and premium pricing
- Regional rate analysis and benchmarking

### 📊 **Profile Optimization**
- CV enhancement using STAR-C methodology
- LinkedIn algorithm optimization
- Personal branding and thought leadership
- ATS-friendly formatting and keyword optimization

### 🤝 **Client Relations & Business Development**
- Long-term client relationship building
- Proposal writing and presentation skills
- Networking strategies that actually work
- Managing difficult client situations

### 🚀 **MatchWise Platform Mastery**
- How the AI matching algorithm works
- Optimizing your profile for better matches
- Understanding cultural fit scoring
- Maximizing opportunities and visibility

---

## 💡 **Ask Me Specific Questions Like:**

- "How do I increase my hourly rate as a React developer?"
- "What certifications give the best ROI in 2024?"
- "How can I optimize my LinkedIn profile for consulting?"
- "What's the best way to handle scope creep with clients?"
- "How does MatchWise's cultural fit assessment work?"

---

## 🎭 **My Expertise Covers:**

### **Technologies:** React, Node.js, Python, AWS, Kubernetes, AI/ML, DevOps, and more
### **Industries:** Fintech, E-commerce, Startups, Enterprise, Healthcare, Gaming
### **Roles:** Developer, Tech Lead, Architect, Full-Stack, Frontend, Backend
### **Business:** Pricing, Negotiation, Networking, Proposals, Client Management

---

💬 **What specific challenge can I help you solve today?**

🚀 **Let's unlock your full potential as a consultant!**`;
    }

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in matchwise-chat function:', error);
    
    const fallbackMessage = 'Sorry, I cannot respond right now. Please try again in a moment.';
    
    return new Response(JSON.stringify({ 
      reply: fallbackMessage
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
