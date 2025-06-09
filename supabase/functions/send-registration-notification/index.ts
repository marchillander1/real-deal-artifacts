
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

    // Send email
    await client.send({
      from: Deno.env.get("SMTP_USERNAME")!,
      to: "marc@matchwise.tech",
      subject: "New User Registration - MatchWise AI",
      content: `
        <h2>New User Registration</h2>
        <p><strong>Email:</strong> ${userEmail}</p>
        <p><strong>Name:</strong> ${userName || 'Not provided'}</p>
        <p><strong>Registration Time:</strong> ${new Date().toLocaleString()}</p>
        <hr>
        <p>This notification was sent automatically from MatchWise AI.</p>
      `,
      html: true,
    });

    await client.close();

    console.log("Registration notification sent via SMTP");

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
