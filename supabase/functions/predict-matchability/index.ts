
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.10';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🎯 Predicting assignment matchability...');
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { assignmentData } = await req.json();
    
    // Get available consultants
    const { data: consultants, error } = await supabase
      .from('consultants')
      .select('skills, availability, location, hourly_rate')
      .eq('availability', 'Available');

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    // Calculate matchability
    const prediction = calculateMatchability(assignmentData, consultants || []);

    return new Response(
      JSON.stringify({ 
        success: true,
        prediction: prediction
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('❌ Matchability prediction error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function calculateMatchability(assignmentData: any, consultants: any[]) {
  const requiredSkills = assignmentData.requiredSkills || [];
  const budgetMin = assignmentData.budgetMin || 0;
  const budgetMax = assignmentData.budgetMax || 999999;
  
  let matchingConsultants = 0;
  let totalSkillMatches = 0;
  let budgetMatches = 0;

  consultants.forEach(consultant => {
    const consultantSkills = consultant.skills || [];
    const skillMatches = requiredSkills.filter(skill => 
      consultantSkills.some(cs => cs.toLowerCase().includes(skill.toLowerCase()))
    ).length;
    
    const skillMatchRatio = requiredSkills.length > 0 ? skillMatches / requiredSkills.length : 0;
    const hourlyRate = consultant.hourly_rate || 800;
    const budgetMatch = hourlyRate >= budgetMin && hourlyRate <= budgetMax;

    if (skillMatchRatio >= 0.3) { // At least 30% skill match
      matchingConsultants++;
      totalSkillMatches += skillMatchRatio;
      if (budgetMatch) budgetMatches++;
    }
  });

  const avgSkillMatch = matchingConsultants > 0 ? totalSkillMatches / matchingConsultants : 0;
  const budgetCompatibility = matchingConsultants > 0 ? budgetMatches / matchingConsultants : 0;
  
  // Calculate total score (0-100)
  const totalScore = Math.round(
    (avgSkillMatch * 0.4 + 
     budgetCompatibility * 0.3 + 
     Math.min(matchingConsultants / 10, 1) * 0.3) * 100
  );

  // Determine quality
  let quality: 'High' | 'Medium' | 'Low' = 'Low';
  if (totalScore >= 75) quality = 'High';
  else if (totalScore >= 50) quality = 'Medium';

  // Generate insights
  const insights = [];
  if (avgSkillMatch < 0.5) {
    insights.push('Kompetenskraven kan vara för specifika - överväg att bredda kriterierna');
  }
  if (budgetCompatibility < 0.5) {
    insights.push('Budgetramen kan begränsa tillgängliga kandidater');
  }
  if (matchingConsultants < 3) {
    insights.push('Få kandidater matchar kraven - överväg att justera kravprofilen');
  }

  // Generate recommendations
  const recommendations = [];
  if (quality === 'Low') {
    recommendations.push('Överväg att minska antalet obligatoriska kompetenser');
    recommendations.push('Justera budget för att attrahera fler kandidater');
  }
  if (matchingConsultants > 15) {
    recommendations.push('Lägg till mer specifika krav för att förbättra matchningskvaliteten');
  }

  return {
    totalScore,
    availableCandidates: matchingConsultants,
    matchQuality: quality,
    insights,
    recommendations
  };
}
