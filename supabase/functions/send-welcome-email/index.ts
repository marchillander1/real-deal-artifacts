
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  consultantEmail: string;
  consultantName: string;
  isMyConsultant?: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  console.log('🎯 Welcome email function called');
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🔑 RESEND_API_KEY exists:', !!Deno.env.get("RESEND_API_KEY"));
    
    const body = await req.json();
    console.log('📧 Sending welcome email:', {
      consultantName: body.consultantName,
      consultantEmail: body.consultantEmail,
      isMyConsultant: body.isMyConsultant
    });

    const { consultantEmail, consultantName, isMyConsultant = false }: WelcomeEmailRequest = body;

    console.log('📧 Email will be sent from: marc@matchwise.tech');
    console.log('📧 Email will be sent to FORM EMAIL (NOT CV EMAIL):', consultantEmail);

    if (!consultantEmail || !consultantName) {
      throw new Error('Missing required email parameters');
    }

    const emailSubject = isMyConsultant 
      ? `Welcome to MatchWise - ${consultantName} added to network!`
      : `Welcome to MatchWise Network, ${consultantName}! 🎉`;

    const emailHtml = isMyConsultant ? `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #3B82F6 0%, #10B981 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to MatchWise! 🎉</h1>
        </div>
        
        <div style="padding: 40px 20px; background: white;">
          <h2 style="color: #1F2937; margin-bottom: 20px;">Hi ${consultantName}!</h2>
          
          <p style="color: #4B5563; line-height: 1.6; margin-bottom: 20px;">
            Great news! You've been successfully added to the MatchWise consultant network. 
            Your profile has been analyzed and you're now part of our exclusive talent pool.
          </p>
          
          <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1F2937; margin-top: 0;">What's Next?</h3>
            <ul style="color: #4B5563; line-height: 1.6;">
              <li>Your profile is now live in our consultant database</li>
              <li>We'll match you with relevant opportunities</li>
              <li>Expect to hear from us when suitable projects arise</li>
            </ul>
          </div>
          
          <p style="color: #4B5563; line-height: 1.6;">
            If you have any questions, feel free to reach out to us at any time.
          </p>
          
          <p style="color: #4B5563; line-height: 1.6; margin-top: 30px;">
            Best regards,<br>
            <strong>Marc & The MatchWise Team</strong><br>
            <a href="mailto:marc@matchwise.tech" style="color: #3B82F6;">marc@matchwise.tech</a>
          </p>
        </div>
      </div>
    ` : `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #3B82F6 0%, #10B981 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to MatchWise Network! 🎉</h1>
        </div>
        
        <div style="padding: 40px 20px; background: white;">
          <h2 style="color: #1F2937; margin-bottom: 20px;">Congratulations, ${consultantName}!</h2>
          
          <p style="color: #4B5563; line-height: 1.6; margin-bottom: 20px;">
            You've successfully joined the MatchWise Network! Your comprehensive analysis is complete, 
            and your profile is now live among our exclusive community of top consultants.
          </p>
          
          <div style="background: #EBF8FF; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3B82F6;">
            <h3 style="color: #1E40AF; margin-top: 0;">🚀 What happens next?</h3>
            <ul style="color: #1E3A8A; line-height: 1.6; margin: 0;">
              <li><strong>Profile Activation:</strong> Your profile is now visible to premium clients</li>
              <li><strong>AI Matching:</strong> Our system will match you with relevant opportunities</li>
              <li><strong>First Contacts:</strong> Expect initial matches within 24-48 hours</li>
              <li><strong>Rate Optimization:</strong> Implement the suggestions from your analysis report</li>
            </ul>
          </div>
          
          <div style="background: #F0FDF4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10B981;">
            <h3 style="color: #15803D; margin-top: 0;">💡 Quick Tips for Success</h3>
            <ul style="color: #166534; line-height: 1.6; margin: 0;">
              <li>Update your LinkedIn profile with the suggestions from your analysis</li>
              <li>Consider the strategic certifications we recommended</li>
              <li>Keep your availability status updated</li>
              <li>Respond quickly to match notifications</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://matchwise.tech" style="background: linear-gradient(135deg, #3B82F6 0%, #10B981 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              View Your Dashboard
            </a>
          </div>
          
          <p style="color: #4B5563; line-height: 1.6;">
            Remember, you're now part of an exclusive network where 85% of consultants get their first 
            interview within 2 weeks, and members see an average 40% rate increase.
          </p>
          
          <p style="color: #4B5563; line-height: 1.6; margin-top: 30px;">
            Questions? We're here to help!<br>
            <strong>Marc & The MatchWise Team</strong><br>
            <a href="mailto:marc@matchwise.tech" style="color: #3B82F6;">marc@matchwise.tech</a>
          </p>
        </div>
        
        <div style="background: #F9FAFB; padding: 20px; text-align: center; color: #6B7280; font-size: 12px;">
          <p>MatchWise - Connecting exceptional consultants with premium opportunities</p>
        </div>
      </div>
    `;

    console.log('🚀 About to send email via Resend to FORM EMAIL...');
    console.log('✅ Welcome email sent successfully to FORM EMAIL', consultantEmail);

    const emailResponse = await resend.emails.send({
      from: "Marc from MatchWise <marc@matchwise.tech>",
      to: [consultantEmail],
      subject: emailSubject,
      html: emailHtml,
    });

    console.log('📨 Resend email response:', JSON.stringify(emailResponse, null, 2));

    if (emailResponse.error) {
      console.error('❌ Resend error:', emailResponse.error);
      throw new Error(`Resend error: ${JSON.stringify(emailResponse.error)}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Welcome email sent successfully',
        emailId: emailResponse.data?.id 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error: any) {
    console.error('❌ Error sending welcome email:', error);
    console.error('❌ Error stack:', error.stack);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
