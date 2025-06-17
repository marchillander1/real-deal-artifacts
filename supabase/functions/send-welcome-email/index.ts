
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

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
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { consultantName, consultantEmail, isMyConsultant }: WelcomeEmailRequest = await req.json();

    console.log("Welcome email request:", { consultantName, consultantEmail, isMyConsultant });

    // Configure SMTP client
    const client = new SMTPClient({
      connection: {
        hostname: Deno.env.get("SMTP_HOST")!,
        port: parseInt(Deno.env.get("SMTP_PORT")!),
        tls: true,
        auth: {
          username: Deno.env.get("SMTP_USERNAME")!,
          password: Deno.env.get("SMTP_PASSWORD")!,
        },
      },
    });

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
      subject: "🚀 Welcome to MatchWise AI Network - You're one step closer...",
      greeting: `Hello ${consultantName}!`,
      mainMessage: "Thank you for uploading your CV and joining MatchWise!",
      details: `
        <p>You've just taken a big step toward exciting new consulting opportunities.</p>
        <p>Our AI-driven platform analyzes both your experience and soft skills to match you with the right projects – not just based on competence, but also on personality and cultural fit.</p>
        
        <h3 style="color: #2563eb; margin-top: 20px;">🔍 What happens next?</h3>
        <ul style="margin-left: 20px;">
          <li>Your profile will be reviewed by our team</li>
          <li>You'll soon be visible to hiring companies on the platform</li>
          <li>We'll reach out if a particularly good match comes up</li>
        </ul>
        
        <h3 style="color: #f59e0b; margin-top: 20px;">💡 Tips:</h3>
        <p>Make sure to keep your profile updated and respond quickly to any offers – this increases your chances of landing fantastic assignments.</p>
      `,
      nextSteps: "",
      closing: "Welcome to the future of consultant matching!"
    };

    // Send welcome email to consultant
    await client.send({
      from: Deno.env.get("SMTP_USERNAME")!,
      to: consultantEmail,
      subject: emailContent.subject,
      content: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">${emailContent.greeting}</h2>
          
          <p style="font-size: 16px; line-height: 1.6;">${emailContent.mainMessage}</p>
          
          ${emailContent.details}
          
          ${emailContent.nextSteps}
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Questions?</strong> Don't hesitate to reach out at <a href="mailto:marc@matchwise.tech" style="color: #2563eb;">marc@matchwise.tech</a></p>
          </div>
          
          <p style="font-size: 18px; font-weight: bold; color: #2563eb; margin-top: 20px;">${emailContent.closing}</p>
          
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #e2e8f0;">
          <p style="color: #64748b; font-size: 14px;">
            Best regards,<br>
            The MatchWise Team
          </p>
          <p style="color: #64748b; font-size: 12px;">
            This email was sent automatically from MatchWise AI platform.
          </p>
        </div>
      `,
      html: true,
    });

    await client.close();

    console.log(`Welcome email sent successfully to ${consultantEmail} (${isMyConsultant ? 'My Consultant' : 'Network'})`);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending welcome email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
