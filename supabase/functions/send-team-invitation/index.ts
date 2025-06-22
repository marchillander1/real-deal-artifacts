
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { inviterName, inviterEmail, inviteeEmail, company } = await req.json();

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Create invitation email content
    const emailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>You're Invited to Join MatchWise AI</h1>
          </div>
          <div class="content">
            <h2>Hello!</h2>
            <p><strong>${inviterName}</strong> (${inviterEmail}) has invited you to join their team on MatchWise AI.</p>
            
            <p><strong>Company:</strong> ${company}</p>
            
            <p>MatchWise AI is an advanced platform for consultant matching using AI that analyzes both technical skills and soft factors.</p>
            
            <p>By joining this team, you'll have access to:</p>
            <ul>
              <li>Shared consultant database</li>
              <li>AI-powered matching capabilities</li>
              <li>Team collaboration features</li>
              <li>Advanced analytics and insights</li>
            </ul>
            
            <p>To accept this invitation and create your account:</p>
            <a href="${Deno.env.get('SUPABASE_URL')?.replace('/rest/v1', '')}/auth/v1/verify?token=signup&type=invite&redirect_to=${encodeURIComponent('https://xbliknlrikolcjjfhxqa.supabase.co/matchwiseai')}" class="button">Accept Invitation</a>
            
            <p>If you have any questions, feel free to reach out to ${inviterName} at ${inviterEmail}.</p>
            
            <p>Welcome to the team!</p>
            
            <p>Best regards,<br>The MatchWise AI Team</p>
          </div>
          <div class="footer">
            <p>This invitation was sent to ${inviteeEmail}. If you didn't expect this invitation, you can safely ignore this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Use Resend API to send email
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'MatchWise AI <noreply@matchwise.ai>',
        to: [inviteeEmail],
        subject: `${inviterName} invited you to join MatchWise AI`,
        html: emailContent,
      }),
    });

    if (!resendResponse.ok) {
      throw new Error(`Failed to send email: ${resendResponse.statusText}`);
    }

    return new Response(
      JSON.stringify({ message: 'Invitation sent successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error sending invitation:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
