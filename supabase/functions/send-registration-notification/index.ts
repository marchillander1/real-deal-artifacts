
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface RegistrationNotificationRequest {
  userEmail: string;
  userName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userEmail, userName }: RegistrationNotificationRequest = await req.json();

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

    // Send notification to admin
    await client.send({
      from: Deno.env.get("SMTP_USERNAME")!,
      to: "marc@matchwise.tech",
      subject: "🚀 New User Registration - MatchWise AI",
      content: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New User Registration</h2>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Email:</strong> ${userEmail}</p>
            <p><strong>Name:</strong> ${userName || 'Not provided'}</p>
            <p><strong>Registration Time:</strong> ${new Date().toLocaleString('sv-SE', { timeZone: 'Europe/Stockholm' })}</p>
          </div>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #e2e8f0;">
          <p style="color: #64748b; font-size: 14px;">This notification was sent automatically from MatchWise AI platform.</p>
          <p style="color: #64748b; font-size: 14px;">
            <a href="https://xbliknlrikolcjjfhxqa.supabase.co/dashboard" style="color: #2563eb;">View in Supabase Dashboard</a>
          </p>
        </div>
      `,
      html: true,
    });

    await client.close();

    console.log("Registration notification sent successfully to marc@matchwise.tech");

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending registration notification:", error);
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
