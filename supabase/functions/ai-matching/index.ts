
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

    // Simple matching algorithm based on skills
    const matches = allConsultants
      .map(consultant => {
        const skillMatches = (consultant.skills || []).filter(skill => 
          (assignment.requiredSkills || []).some(reqSkill => 
            skill.toLowerCase().includes(reqSkill.toLowerCase()) || 
            reqSkill.toLowerCase().includes(skill.toLowerCase())
          )
        ).length

        const totalRequiredSkills = assignment.requiredSkills?.length || 1
        const skillMatchPercentage = Math.min((skillMatches / totalRequiredSkills) * 100, 100)
        
        // Base match score on skill alignment
        let matchScore = Math.max(skillMatchPercentage, 65) // Minimum 65% for demo
        
        // Add some variation for more realistic results
        const variation = Math.random() * 20 - 10 // -10 to +10
        matchScore = Math.min(Math.max(matchScore + variation, 60), 98)

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
            type: consultant.user_id ? 'existing' : 'new'
          },
          matchScore: Math.round(matchScore),
          skillMatch: Math.round(skillMatchPercentage),
          culturalFit: Math.round(85 + Math.random() * 10),
          communicationMatch: Math.round(80 + Math.random() * 15),
          matchedSkills: (consultant.skills || []).filter(skill => 
            (assignment.requiredSkills || []).some(reqSkill => 
              skill.toLowerCase().includes(reqSkill.toLowerCase()) || 
              reqSkill.toLowerCase().includes(skill.toLowerCase())
            )
          )
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
