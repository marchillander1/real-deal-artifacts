
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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

    const emailResponse = await resend.emails.send({
      from: "MatchWise AI <onboarding@resend.dev>",
      to: ["marc@matchwise.tech"],
      subject: "New User Registration - MatchWise AI",
      html: `
        <h2>New User Registration</h2>
        <p><strong>Email:</strong> ${userEmail}</p>
        <p><strong>Name:</strong> ${userName || 'Not provided'}</p>
        <p><strong>Registration Time:</strong> ${new Date().toLocaleString()}</p>
        <hr>
        <p>This notification was sent automatically from MatchWise AI.</p>
      `,
    });

    console.log("Registration notification sent:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
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
