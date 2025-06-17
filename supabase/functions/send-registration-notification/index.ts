
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
  consultantName?: string;
  consultantEmail?: string;
  isMyConsultant?: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userEmail, userName, consultantName, consultantEmail, isMyConsultant }: RegistrationNotificationRequest = await req.json();

    console.log("Registration notification request:", { userEmail, userName, consultantName, consultantEmail, isMyConsultant });

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

    // Determine email content based on registration type
    const emailData = consultantName && consultantEmail ? {
      name: consultantName,
      email: consultantEmail,
      type: isMyConsultant ? "My Consultant" : "Network Consultant"
    } : {
      name: userName || 'Unknown',
      email: userEmail,
      type: "User Registration"
    };

    // Prepare email content as a string
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">New ${emailData.type} Registration</h2>
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Name:</strong> ${emailData.name}</p>
          <p><strong>Email:</strong> ${emailData.email}</p>
          <p><strong>Registration Type:</strong> ${emailData.type}</p>
          <p><strong>Registration Time:</strong> ${new Date().toLocaleString('sv-SE', { timeZone: 'Europe/Stockholm' })}</p>
        </div>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #e2e8f0;">
        <p style="color: #64748b; font-size: 14px;">This notification was sent automatically from MatchWise AI platform.</p>
        <p style="color: #64748b; font-size: 14px;">
          <a href="https://xbliknlrikolcjjfhxqa.supabase.co/dashboard" style="color: #2563eb;">View in Supabase Dashboard</a>
        </p>
      </div>
    `;

    // Send notification to admin
    await client.send({
      from: Deno.env.get("SMTP_USERNAME")!,
      to: "marc@matchwise.tech",
      subject: `🚀 New ${emailData.type} Registration - MatchWise AI`,
      content: emailContent,
      html: true,
    });

    await client.close();

    console.log(`Registration notification sent successfully to marc@matchwise.tech for ${emailData.type}: ${emailData.email}`);

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
