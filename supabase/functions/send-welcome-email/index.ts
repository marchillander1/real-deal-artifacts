
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

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

    console.log("🔧 SMTP client configured");

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

    // Send welcome email
    await client.send({
      from: "Marc <marc@matchwise.tech>",
      to: userEmail,
      subject: "Welcome to MatchWise – You're One Step Closer to Your Next Mission 🚀",
      html: emailHtml,
    });

    console.log("📤 Email sent successfully");

    await client.close();

    console.log("✅ SMTP client closed");

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("❌ Error sending welcome email:", error);
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
