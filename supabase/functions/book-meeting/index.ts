
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface BookMeetingRequest {
  name: string;
  email: string;
  company: string;
  phone?: string;
  message?: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("🚀 Book meeting function started");
  console.log("📋 Request method:", req.method);
  
  if (req.method === "OPTIONS") {
    console.log("✅ Handling CORS preflight request");
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    console.error("❌ Invalid method:", req.method);
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        status: 405,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }

  try {
    const body = await req.text();
    console.log("📦 Raw request body received");
    
    if (!body) {
      throw new Error("Request body is empty");
    }

    let requestData: BookMeetingRequest;
    try {
      requestData = JSON.parse(body);
    } catch (parseError) {
      console.error("❌ JSON parse error:", parseError);
      throw new Error("Invalid JSON in request body");
    }

    const { name, email, company, phone, message } = requestData;

    console.log("📧 Sending meeting request email for:", name, "from company:", company);

    // Validate required fields
    if (!name || !email || !company) {
      throw new Error("Name, email, and company are required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }

    // Check if API key exists
    const apiKey = Deno.env.get("RESEND_API_KEY");
    if (!apiKey) {
      console.error("❌ RESEND_API_KEY not found in environment");
      throw new Error("RESEND_API_KEY not configured");
    }
    console.log("🔑 RESEND_API_KEY found (length:", apiKey.length, ")");

    // Initialize Resend with API key
    const resend = new Resend(apiKey);

    console.log("🔧 Resend client configured");

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.6;">
        <h2 style="color: #2563eb;">New Meeting Request - MatchWise AI</h2>
        
        <p><strong>A new meeting has been requested through the MatchWise website.</strong></p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #2563eb; margin-top: 0;">Contact Information</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Company:</strong> ${company}</p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
        </div>
        
        ${message ? `
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #2563eb; margin-top: 0;">Message</h3>
          <p>${message}</p>
        </div>
        ` : ''}
        
        <p style="margin-top: 30px;">
          <strong>Next steps:</strong><br>
          Reply to this email to schedule the meeting, or contact ${name} directly at ${email}.
        </p>
        
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
        
        <p style="color: #666; font-size: 14px;">
          This meeting request was submitted through the MatchWise AI landing page.<br>
          <a href="https://www.matchwise.tech">www.matchwise.tech</a>
        </p>
      </div>
    `;

    console.log("📝 Email HTML prepared");

    // Send meeting request email to Marc
    const emailResponse = await resend.emails.send({
      from: "MatchWise Meeting Requests <marc@matchwise.tech>",
      to: ["marc@matchwise.tech"],
      replyTo: [email],
      subject: `New Meeting Request from ${name} (${company})`,
      html: emailHtml,
    });

    console.log("📤 Meeting request email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("❌ Error sending meeting request email:", error);
    console.error("❌ Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    return new Response(
      JSON.stringify({ error: error.message, details: error.toString() }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
