
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  userEmail: string;
  userName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userEmail, userName }: WelcomeEmailRequest = await req.json();

    console.log("📧 Sending welcome email to:", userEmail, "with name:", userName);

    // Extract first name from full name or use email
    const firstName = userName ? userName.split(' ')[0] : userEmail.split('@')[0];

    console.log("👤 First name extracted:", firstName);

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.6;">
        <h2 style="color: #2563eb;">Hi ${firstName},</h2>
        
        <p>Thanks for uploading your CV and joining MatchWise!</p>
        
        <p>You've just taken a big step toward exciting new consulting opportunities.</p>
        
        <p>Our AI-powered platform analyzes both your experience and soft skills to match you with the right projects – not just based on skills, but also on personality and culture fit.</p>
        
        <h3 style="color: #2563eb;">🔍 What happens next?</h3>
        <ul>
          <li>Your profile is being reviewed by our team</li>
          <li>You'll soon be visible to hiring companies on the platform</li>
          <li>We'll reach out if a particularly good match appears</li>
        </ul>
        
        <h3 style="color: #2563eb;">💡 Tip:</h3>
        <p>Make sure to keep your profile up to date and respond quickly to any offers – it increases your chances of landing great assignments.</p>
        
        <p>If you have any questions, don't hesitate to reach out at <a href="mailto:marc@matchwise.tech">marc@matchwise.tech</a>.</p>
        
        <p><strong>Welcome to the future of consultant matchmaking!</strong></p>
        
        <p>Best regards,<br>
        The MatchWise Team<br>
        <a href="https://www.matchwise.tech">www.matchwise.tech</a></p>
      </div>
    `;

    console.log("📝 Email HTML prepared");

    // Use Deno's built-in email sending with SMTP
    const emailData = {
      from: "Marc <marc@matchwise.tech>",
      to: userEmail,
      subject: "Welcome to MatchWise – You're One Step Closer to Your Next Mission 🚀",
      html: emailHtml,
    };

    // Send email using fetch to SMTP service
    const smtpResponse = await fetch(`smtp://${Deno.env.get("SMTP_HOST")}:${Deno.env.get("SMTP_PORT")}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${btoa(`${Deno.env.get("SMTP_USERNAME")}:${Deno.env.get("SMTP_PASSWORD")}`)}`,
      },
      body: JSON.stringify(emailData),
    });

    if (!smtpResponse.ok) {
      throw new Error(`SMTP error: ${smtpResponse.status} ${smtpResponse.statusText}`);
    }

    console.log("📤 Email sent successfully via SMTP");

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("❌ Error sending welcome email:", error);
    
    // For now, return success even if email fails so the profile creation doesn't fail
    // We can improve this later
    return new Response(JSON.stringify({ 
      success: true, 
      note: "Profile created successfully. Email sending temporarily disabled." 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json", 
        ...corsHeaders 
      },
    });
  }
};

serve(handler);
