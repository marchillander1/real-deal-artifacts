
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🚀 Starting welcome email function');
    
    if (!RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY not found in environment');
      throw new Error('RESEND_API_KEY not configured');
    }

    const { consultantEmail, consultantName, isMyConsultant } = await req.json();

    if (!consultantEmail || !consultantName) {
      console.error('❌ Missing required fields:', { consultantEmail, consultantName });
      throw new Error('Consultant email and name are required');
    }

    console.log('📧 Sending welcome email to:', consultantEmail);
    console.log('👤 Consultant name:', consultantName);
    console.log('🏢 Is my consultant:', isMyConsultant);

    // Generate simple password for consultant profile access
    const profilePassword = `${consultantName.toLowerCase().replace(/\s+/g, '')}123`;

    const welcomeEmailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to MatchWise Network!</title>
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">🚀 Welcome to MatchWise!</h1>
            <p style="color: #e8f4f8; margin: 10px 0 0 0; font-size: 16px;">You're now part of Sweden's premier IT consultant network</p>
        </div>
        
        <!-- Main Content -->
        <div style="background: #ffffff; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
            
            <h2 style="color: #2563eb; margin-bottom: 20px;">Hi ${consultantName}! 👋</h2>
            
            <p style="font-size: 16px; margin-bottom: 20px;">
                Congratulations! Your profile analysis is complete and you're now <strong>live</strong> on the MatchWise platform. 
                Here's what happens next:
            </p>
            
            <!-- Status Cards -->
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h3 style="color: #15803d; margin: 0 0 15px 0; font-size: 18px;">✅ Your Profile is Active</h3>
                <ul style="margin: 0; padding-left: 20px; color: #166534;">
                    <li>Visible to potential clients immediately</li>
                    <li>AI-powered matching based on your skills and values</li>
                    <li>Professional profile showcasing your expertise</li>
                    <li>Market-competitive rate recommendations</li>
                </ul>
            </div>
            
            <!-- Profile Management -->
            <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h3 style="color: #1d4ed8; margin: 0 0 15px 0; font-size: 18px;">🔧 Manage Your Profile</h3>
                <p style="margin: 0 0 10px 0; color: #1e40af;">
                    Access your personal profile portal at: <strong>matchwise.tech/my-profile</strong>
                </p>
                <p style="margin: 0 0 5px 0; color: #1e40af;"><strong>Login:</strong> ${consultantEmail}</p>
                <p style="margin: 0 0 15px 0; color: #1e40af;"><strong>Password:</strong> ${profilePassword}</p>
                <p style="margin: 0; font-size: 14px; color: #4b5563;">
                    Update your skills, availability, rates, and view your AI analysis anytime.
                </p>
            </div>
            
            <!-- Next Steps -->
            <div style="background: #fefce8; border: 1px solid #fde047; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h3 style="color: #a16207; margin: 0 0 15px 0; font-size: 18px;">🎯 Pro Tips for Success</h3>
                <ul style="margin: 0; padding-left: 20px; color: #92400e;">
                    <li><strong>Update regularly:</strong> Keep your skills and availability current</li>
                    <li><strong>Respond quickly:</strong> Fast responses increase your match rate</li>
                    <li><strong>Build your profile:</strong> Add certifications and project highlights</li>
                    <li><strong>Network actively:</strong> Engage with opportunities that match your goals</li>
                </ul>
            </div>
            
            <!-- How Matching Works -->
            <div style="background: #f3f4f6; border: 1px solid #d1d5db; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h3 style="color: #374151; margin: 0 0 15px 0; font-size: 18px;">🤖 How AI Matching Works</h3>
                <p style="margin: 0; color: #4b5563;">
                    Our AI analyzes your skills, experience, values, and personality traits to match you with 
                    assignments that truly fit. You'll only receive opportunities that align with your 
                    expertise and career goals.
                </p>
            </div>
            
            <!-- Dashboard Link -->
            <div style="text-align: center; margin: 30px 0;">
                <a href="https://matchwise.tech/my-profile" 
                   style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
                    Access Your Profile →
                </a>
            </div>
            
            <!-- Contact Info -->
            <div style="border-top: 2px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
                <p style="margin: 0; font-size: 14px; color: #6b7280;">
                    <strong>Questions?</strong> Reply to this email or contact us at 
                    <a href="mailto:support@matchwise.tech" style="color: #2563eb;">support@matchwise.tech</a>
                </p>
                <p style="margin: 10px 0 0 0; font-size: 14px; color: #6b7280;">
                    Follow us: 
                    <a href="https://linkedin.com/company/matchwise" style="color: #2563eb;">LinkedIn</a> | 
                    <a href="https://matchwise.tech" style="color: #2563eb;">Website</a>
                </p>
            </div>
            
        </div>
        
        <!-- Footer -->
        <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
            <p style="margin: 0;">
                MatchWise Technologies AB | Stockholm, Sweden<br>
                This email was sent to ${consultantEmail} because you joined our consultant network.
            </p>
        </div>
        
    </body>
    </html>
    `;

    const emailData = {
      from: 'MatchWise <noreply@matchwise.tech>',
      to: [consultantEmail],
      subject: `🚀 Welcome to MatchWise Network, ${consultantName}!`,
      html: welcomeEmailHtml
    };

    console.log('📤 Sending email with data:', JSON.stringify({ 
      from: emailData.from, 
      to: emailData.to, 
      subject: emailData.subject 
    }));

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    const responseText = await response.text();
    console.log('📨 Resend API response status:', response.status);
    console.log('📨 Resend API response:', responseText);

    if (!response.ok) {
      console.error('❌ Resend API error:', responseText);
      throw new Error(`Failed to send email: ${response.status} - ${responseText}`);
    }

    const result = JSON.parse(responseText);
    console.log('✅ Welcome email sent successfully:', result.id);

    return new Response(JSON.stringify({ 
      success: true, 
      messageId: result.id,
      message: 'Welcome email sent successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Welcome email error:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to send welcome email',
      success: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
