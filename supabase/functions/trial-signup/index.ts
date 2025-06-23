
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface TrialSignupRequest {
  name: string;
  email: string;
  company: string;
  jobTitle: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, company, jobTitle }: TrialSignupRequest = await req.json();

    // Send notification to admin
    await resend.emails.send({
      from: "MatchWise AI <onboarding@resend.dev>",
      to: ["marc@matchwise.tech"],
      subject: "New Trial Signup Request",
      html: `
        <h1>New Trial Signup Request</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Job Title:</strong> ${jobTitle}</p>
        <br>
        <p>Please contact this user to set up their trial account.</p>
      `,
    });

    // Send confirmation to user
    await resend.emails.send({
      from: "MatchWise AI <onboarding@resend.dev>",
      to: [email],
      subject: "Your MatchWise AI Trial Request",
      html: `
        <h1>Thank you for your interest in MatchWise AI!</h1>
        <p>Hi ${name},</p>
        <p>We've received your trial request and will contact you within 24 hours to set up your account.</p>
        <br>
        <p>What happens next:</p>
        <ul>
          <li>Personal onboarding call</li>
          <li>Account setup and configuration</li>
          <li>14-day free trial activation</li>
          <li>Training on platform features</li>
        </ul>
        <br>
        <p>Best regards,<br>The MatchWise AI Team</p>
      `,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in trial-signup function:", error);
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
