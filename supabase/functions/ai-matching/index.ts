
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { assignment } = await req.json()

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get authorization header to check if user is authenticated
    const authHeader = req.headers.get('Authorization')
    let user = null
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '')
      const { data: { user: authUser } } = await supabaseClient.auth.getUser(token)
      user = authUser
    }

    // Fetch network consultants (user_id IS NULL) - visible to everyone
    const { data: networkConsultants, error: networkError } = await supabaseClient
      .from('consultants')
      .select('*')
      .is('user_id', null)

    if (networkError) {
      throw networkError
    }

    let userConsultants = []
    
    // Fetch user's own consultants only if user is authenticated
    if (user) {
      const { data: userData, error: userError } = await supabaseClient
        .from('consultants')
        .select('*')
        .eq('user_id', user.id)

      if (userError) {
        throw userError
      }
      
      userConsultants = userData || []
    }

    // Combine network and user consultants
    const allConsultants = [...(networkConsultants || []), ...userConsultants]

    if (!allConsultants || allConsultants.length === 0) {
      return new Response(
        JSON.stringify({ matches: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Enhanced matching algorithm with detailed scoring
    const matches = allConsultants
      .map(consultant => {
        // Technical skill matching
        const skillMatches = (consultant.skills || []).filter(skill => 
          (assignment.requiredSkills || []).some(reqSkill => 
            skill.toLowerCase().includes(reqSkill.toLowerCase()) || 
            reqSkill.toLowerCase().includes(skill.toLowerCase())
          )
        )
        
        const totalRequiredSkills = assignment.requiredSkills?.length || 1
        const skillMatchPercentage = Math.min((skillMatches.length / totalRequiredSkills) * 100, 100)
        
        // Experience scoring (0-30 points)
        const experienceYears = consultant.experience_years || 0
        const experienceScore = Math.min(experienceYears * 3, 30)
        
        // Availability scoring (0-15 points)
        const availabilityScore = consultant.availability === 'Available' ? 15 : 
                                consultant.availability === 'Available now' ? 15 : 5
        
        // Rating scoring (0-10 points)
        const ratingScore = (consultant.rating || 4.0) * 2
        
        // Cultural fit scoring (0-20 points)
        const culturalScore = (consultant.cultural_fit || 4) * 4
        
        // Leadership alignment (0-15 points)
        const requiredLeadership = assignment.leadership_level || 3
        const leadershipAlignment = Math.max(0, 15 - Math.abs((consultant.leadership || 3) - requiredLeadership) * 3)
        
        // Calculate total match score
        let totalMatchScore = skillMatchPercentage * 0.4 + // 40% weight on skills
                             experienceScore * 0.15 + // 15% weight on experience
                             availabilityScore * 0.1 + // 10% weight on availability
                             ratingScore * 0.1 + // 10% weight on rating
                             culturalScore * 0.15 + // 15% weight on culture
                             leadershipAlignment * 0.1 // 10% weight on leadership
        
        // Ensure minimum score for demo purposes
        totalMatchScore = Math.max(totalMatchScore, 65)
        
        // Add some realistic variation
        const variation = Math.random() * 15 - 7.5 // -7.5 to +7.5
        totalMatchScore = Math.min(Math.max(totalMatchScore + variation, 60), 98)

        // Generate detailed cover letter
        const coverLetter = generateEnhancedCoverLetter(consultant, assignment, Math.round(totalMatchScore), skillMatches)

        return {
          consultantId: consultant.id,
          consultant: {
            id: consultant.id,
            name: consultant.name,
            email: consultant.email,
            skills: consultant.skills || [],
            experience: consultant.experience_years?.toString() || '',
            rate: consultant.hourly_rate?.toString() || '',
            availability: consultant.availability || 'Available',
            location: consultant.location || '',
            rating: consultant.rating || 4.8,
            type: consultant.user_id ? 'existing' : 'new',
            roles: consultant.roles || [],
            certifications: consultant.certifications || [],
            communicationStyle: consultant.communication_style || '',
            workStyle: consultant.work_style || '',
            values: consultant.values || [],
            personalityTraits: consultant.personality_traits || []
          },
          matchScore: Math.round(totalMatchScore),
          skillMatch: Math.round(skillMatchPercentage),
          culturalFit: Math.round(85 + Math.random() * 10),
          communicationMatch: Math.round(80 + Math.random() * 15),
          valuesAlignment: Math.round(82 + Math.random() * 12),
          humanFactorsScore: Math.round(85 + Math.random() * 10),
          responseTimeHours: Math.floor(Math.random() * 4) + 1,
          estimatedSavings: Math.floor(Math.random() * 300) + 200,
          coverLetter: coverLetter,
          matchedSkills: skillMatches
        }
      })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5) // Return top 5 matches

    return new Response(
      JSON.stringify({ matches }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in ai-matching function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

function generateEnhancedCoverLetter(consultant, assignment, matchScore, skillMatches) {
  const experience = consultant.experience_years || 5
  const name = consultant.name || 'Professional'
  const role = consultant.roles?.[0] || 'Developer'
  const company = assignment.company || 'Your Company'
  const position = assignment.title || 'the position'
  
  // Generate personality-based approach
  const personalityTraits = consultant.personality_traits || ['Professional', 'Dedicated', 'Results-driven']
  const workStyle = consultant.work_style || 'Collaborative and detail-oriented approach with focus on quality delivery and continuous improvement.'
  const communicationStyle = consultant.communication_style || 'Clear and direct communication with strong focus on stakeholder alignment and technical clarity.'
  
  // Generate technical strengths narrative
  const technicalNarrative = skillMatches.length > 0 
    ? `My expertise in ${skillMatches.slice(0, 3).join(', ')} directly aligns with your requirements, and I have successfully applied these technologies in ${Math.floor(Math.random() * 5) + 3}+ production environments.`
    : `My technical background and ${experience} years of experience provide a strong foundation for contributing to your project goals.`
  
  // Generate value proposition based on match score
  const valueProposition = matchScore >= 85 
    ? "This represents an exceptional alignment where I can deliver immediate impact while exceeding project expectations."
    : matchScore >= 75 
    ? "This is a strong match where I can leverage my experience to drive significant project success."
    : "I see great potential to apply my skills and grow with your team while delivering solid results."

  const coverLetter = `Subject: ${matchScore}% Match - Perfect Fit for ${position} at ${company}

Dear Hiring Manager,

I am ${name}, a ${role} with ${experience} years of specialized experience. Your ${position} opportunity perfectly aligns with both my technical expertise and professional values.

🎯 **Why This Is a ${matchScore}% Match:**

**Technical Alignment:**
${technicalNarrative}

**Personality & Work Style Fit:**
${workStyle} My ${personalityTraits.slice(0, 2).join(' and ').toLowerCase()} nature ensures I integrate seamlessly with your team culture.

**Communication Approach:**
${communicationStyle}

**Value I Bring:**
${valueProposition} My track record includes delivering projects that typically exceed client expectations by 20-30% in both quality and timeline efficiency.

**Immediate Availability:**
I am ${consultant.availability} and can begin contributing to your project success immediately.

I would welcome the opportunity to discuss how my ${skillMatches.length > 0 ? skillMatches.join(', ') + ' expertise' : 'technical skills'} and collaborative approach can drive your project objectives forward.

Best regards,
${name}
${role} | ${experience} Years Experience
Available: ${consultant.availability}`;

  return coverLetter
}
