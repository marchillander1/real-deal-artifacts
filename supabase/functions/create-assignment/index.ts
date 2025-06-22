
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
    console.log('🚀 Creating new assignment...');
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const assignmentData = await req.json();
    
    console.log('📝 Assignment data received:', assignmentData);

    // Insert the assignment into the database
    const { data: assignment, error } = await supabase
      .from('assignments')
      .insert([{
        title: assignmentData.title,
        description: assignmentData.description,
        company: assignmentData.company,
        industry: assignmentData.industry,
        required_skills: assignmentData.requiredSkills || [],
        duration: assignmentData.duration,
        workload: assignmentData.workload,
        budget_min: assignmentData.budgetMin,
        budget_max: assignmentData.budgetMax,
        budget_currency: assignmentData.budgetCurrency || 'SEK',
        team_size: assignmentData.teamSize,
        remote_type: assignmentData.remote,
        urgency: assignmentData.urgency || 'Medium',
        client_logo: assignmentData.clientLogo || '🏢',
        desired_communication_style: assignmentData.desiredCommunicationStyle,
        team_culture: assignmentData.teamCulture,
        required_values: assignmentData.requiredValues || [],
        team_dynamics: assignmentData.teamDynamics,
        start_date: assignmentData.startDate,
        leadership_level: assignmentData.leadershipLevel || 3,
        status: 'open'
      }])
      .select()
      .single();

    if (error) {
      console.error('❌ Database error:', error);
      throw error;
    }

    console.log('✅ Assignment created successfully:', assignment);

    return new Response(
      JSON.stringify({ 
        success: true,
        assignment: assignment
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('❌ Assignment creation error:', error);
    
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
