
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
    console.log('🔔 Checking skill alerts for new consultant...');
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { consultant } = await req.json();
    
    if (!consultant || !consultant.skills) {
      console.log('❌ No consultant or skills provided');
      return new Response(JSON.stringify({ success: false, error: 'No consultant data' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('👤 Processing consultant:', consultant.name, 'with skills:', consultant.skills);

    // Get all active skill alerts
    const { data: skillAlerts, error: alertsError } = await supabase
      .from('skill_alerts')
      .select('*')
      .eq('active', true);

    if (alertsError) {
      console.error('❌ Error fetching skill alerts:', alertsError);
      throw alertsError;
    }

    console.log(`📧 Found ${skillAlerts?.length || 0} active skill alerts`);

    // Check each alert against consultant skills
    const matchedAlerts = [];
    
    for (const alert of skillAlerts || []) {
      const matchingSkills = alert.skills.filter(alertSkill => 
        consultant.skills.some(consultantSkill => 
          consultantSkill.toLowerCase().includes(alertSkill.toLowerCase()) ||
          alertSkill.toLowerCase().includes(consultantSkill.toLowerCase())
        )
      );

      if (matchingSkills.length > 0) {
        matchedAlerts.push({
          alert,
          matchingSkills
        });
        console.log(`🎯 Match found for ${alert.email}: ${matchingSkills.join(', ')}`);
      }
    }

    // Send emails for matched alerts
    let emailsSent = 0;
    for (const { alert, matchingSkills } of matchedAlerts) {
      try {
        const { error: emailError } = await supabase.functions.invoke('send-skill-alert', {
          body: {
            consultant,
            matchingSkills,
            subscriberEmail: alert.email
          }
        });

        if (emailError) {
          console.error(`❌ Failed to send email to ${alert.email}:`, emailError);
        } else {
          emailsSent++;
          console.log(`✅ Email sent to ${alert.email}`);
        }
      } catch (error) {
        console.error(`❌ Email sending failed for ${alert.email}:`, error);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        alertsChecked: skillAlerts?.length || 0,
        matchesFound: matchedAlerts.length,
        emailsSent
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('❌ Skill alert check error:', error);
    
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
