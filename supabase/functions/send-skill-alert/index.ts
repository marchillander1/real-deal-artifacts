
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
    console.log('📧 Processing skill alert...');
    
    const { consultant, matchingSkills, subscriberEmail } = await req.json();
    
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      console.error('❌ RESEND_API_KEY not found');
      throw new Error('Resend API key not configured');
    }

    console.log('🚀 Sending email alert for skills:', matchingSkills);

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'MatchWise AI <alerts@matchwise.ai>',
        to: [subscriberEmail],
        subject: `🎯 New Consultant Match Alert: ${matchingSkills.join(', ')}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2563eb;">🎯 New Consultant Match Found!</h1>
            
            <p>Vi har hittat en ny konsult som matchar dina skill alerts:</p>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1e293b; margin-top: 0;">${consultant.name}</h3>
              <p><strong>Titel:</strong> ${consultant.title || 'Not specified'}</p>
              <p><strong>Erfarenhet:</strong> ${consultant.experience}</p>
              <p><strong>Rating:</strong> ${consultant.rating}/5 ⭐</p>
              <p><strong>Plats:</strong> ${consultant.location}</p>
              <p><strong>Tillgänglighet:</strong> ${consultant.availability}</p>
              <p><strong>Pris:</strong> ${consultant.rate}</p>
            </div>
            
            <h4 style="color: #1e293b;">🎯 Matchande färdigheter:</h4>
            <ul>
              ${matchingSkills.map(skill => `<li style="color: #059669;">${skill}</li>`).join('')}
            </ul>
            
            <h4 style="color: #1e293b;">💼 Alla färdigheter:</h4>
            <p style="color: #64748b;">${consultant.skills.join(', ')}</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://matchwise.ai/dashboard" 
                 style="background: #2563eb; color: white; padding: 12px 24px; 
                        text-decoration: none; border-radius: 6px; display: inline-block;">
                Visa Konsult i Dashboard
              </a>
            </div>
            
            <hr style="border: 1px solid #e2e8f0; margin: 30px 0;">
            <p style="color: #64748b; font-size: 14px;">
              Du får detta mail eftersom du har ställt in skill alerts för: ${matchingSkills.join(', ')}<br>
              <a href="https://matchwise.ai/alerts">Hantera dina alerts</a>
            </p>
          </div>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error('❌ Resend API error:', errorText);
      throw new Error(`Resend API failed: ${emailResponse.status}`);
    }

    const emailResult = await emailResponse.json();
    console.log('✅ Skill alert email sent successfully:', emailResult);

    return new Response(
      JSON.stringify({ 
        success: true,
        emailId: emailResult.id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('❌ Skill alert error:', error);
    
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
