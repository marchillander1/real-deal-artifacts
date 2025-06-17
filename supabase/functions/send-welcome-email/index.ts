
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  consultantName: string;
  consultantEmail: string;
  isMyConsultant?: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  console.log('🎯 Welcome email function called');
  console.log('🔑 RESEND_API_KEY exists:', !!Deno.env.get("RESEND_API_KEY"));
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { consultantName, consultantEmail, isMyConsultant }: WelcomeEmailRequest = await req.json();

    console.log("📧 Sending welcome email:", { consultantName, consultantEmail, isMyConsultant });
    console.log("📧 Email will be sent from: marc@matchwise.tech");
    console.log("📧 Email will be sent to:", consultantEmail);

    // Different email content based on whether it's "My Consultant" or network registration
    const emailContent = isMyConsultant ? {
      subject: "You've been added to a MatchWise AI team!",
      greeting: `Hi ${consultantName}!`,
      mainMessage: "You've been successfully added to a MatchWise AI team as a consultant.",
      details: `
        <p><strong>What this means:</strong></p>
        <ul style="margin-left: 20px;">
          <li>You're now part of a curated consultant team</li>
          <li>You'll be matched with relevant assignments automatically</li>
          <li>Your profile has been analyzed and optimized by our AI</li>
          <li>You'll receive notifications about potential opportunities</li>
        </ul>
      `,
      nextSteps: `
        <p><strong>Next steps:</strong></p>
        <ul style="margin-left: 20px;">
          <li>Keep your profile updated for better matching</li>
          <li>Respond quickly to assignment opportunities</li>
          <li>Maintain professional availability status</li>
        </ul>
      `,
      closing: "Welcome to the team!"
    } : {
      subject: "🚀 Welcome to MatchWise AI Network - You're in the platform!",
      greeting: `Hello ${consultantName}!`,
      mainMessage: "Congratulations! You're now part of the MatchWise AI consultant network.",
      details: `
        <p><strong>You're now in our platform and visible to companies looking for consultants!</strong></p>
        <p>Our AI-driven platform has analyzed your profile and will automatically match you with relevant projects based on:</p>
        <ul style="margin-left: 20px;">
          <li>✅ Your technical skills and expertise</li>
          <li>✅ Your personality and cultural fit</li>
          <li>✅ Your communication style and work preferences</li>
          <li>✅ Your experience level and project history</li>
        </ul>
        
        <h3 style="color: #2563eb; margin-top: 20px;">🎯 What happens next?</h3>
        <ul style="margin-left: 20px;">
          <li><strong>You're live!</strong> Companies can now see your profile</li>
          <li><strong>Smart matching:</strong> Our AI will notify you about relevant opportunities</li>
          <li><strong>Quality leads:</strong> Only receive assignments that match your skills</li>
          <li><strong>No spam:</strong> We pre-filter all opportunities for quality</li>
        </ul>
        
        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
          <h4 style="color: #1e40af; margin: 0 0 10px 0;">💡 Pro Tips for Success:</h4>
          <ul style="margin: 0; padding-left: 20px;">
            <li>Keep your availability status updated</li>
            <li>Respond to opportunities within 24 hours</li>
            <li>Update your skills as you learn new technologies</li>
            <li>Maintain a professional LinkedIn presence</li>
          </ul>
        </div>
      `,
      nextSteps: `
        <div style="background: #ecfdf5; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
          <h4 style="color: #047857; margin: 0 0 10px 0;">🚀 Ready to get started?</h4>
          <p style="margin: 0;">Your profile is now active and companies can find you. The first matching opportunities should start coming in within the next few days!</p>
        </div>
      `,
      closing: "Welcome to the future of consultant matching! 🎉"
    };

    // Prepare email content with the HTML properly encoded
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.6;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">MatchWise AI</h1>
          <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 16px;">Intelligent Consultant Matching</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #2563eb; margin: 0 0 20px 0;">${emailContent.greeting}</h2>
          
          <p style="font-size: 16px; margin-bottom: 20px;">${emailContent.mainMessage}</p>
          
          ${emailContent.details}
          
          ${emailContent.nextSteps}
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0;">
            <p style="margin: 0; text-align: center;"><strong>Questions or need support?</strong></p>
            <p style="margin: 10px 0 0 0; text-align: center;">
              Reach out at <a href="mailto:marc@matchwise.tech" style="color: #2563eb; text-decoration: none;">marc@matchwise.tech</a>
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="font-size: 18px; font-weight: bold; color: #2563eb; margin: 0;">${emailContent.closing}</p>
          </div>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;">
          <div style="text-align: center;">
            <p style="color: #64748b; font-size: 14px; margin: 0;">
              Best regards,<br>
              <strong>Marc & The MatchWise Team</strong>
            </p>
            <p style="color: #94a3b8; font-size: 12px; margin: 15px 0 0 0;">
              This email was sent automatically from MatchWise AI platform.
            </p>
          </div>
        </div>
      </div>
    `;

    console.log("🚀 About to send email via Resend...");

    // Send welcome email to consultant using verified sender
    const emailResponse = await resend.emails.send({
      from: "marc@matchwise.tech",
      to: [consultantEmail],
      subject: emailContent.subject,
      html: emailHtml,
    });

    console.log(`✅ Welcome email sent successfully to ${consultantEmail} (${isMyConsultant ? 'My Consultant' : 'Network'})`);
    console.log("📨 Resend email response:", JSON.stringify(emailResponse, null, 2));

    if (emailResponse.error) {
      console.error("❌ Resend error:", emailResponse.error);
      throw new Error(`Resend error: ${JSON.stringify(emailResponse.error)}`);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      emailId: emailResponse.data?.id,
      emailResponse: emailResponse
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("❌ Error sending welcome email:", error);
    console.error("❌ Error stack:", error.stack);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack,
        type: 'welcome_email_error'
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
