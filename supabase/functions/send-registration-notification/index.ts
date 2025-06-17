
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  consultantName: string;
  consultantEmail: string;
  isMyConsultant?: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  console.log('🔔 Registration notification function called');
  console.log('🔑 RESEND_API_KEY exists:', !!Deno.env.get("RESEND_API_KEY"));
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { consultantName, consultantEmail, isMyConsultant }: NotificationRequest = await req.json();
    
    console.log('📧 Sending registration notification:', { consultantName, consultantEmail, isMyConsultant });

    console.log("🚀 About to send admin notification via Resend...");

    // Send notification to admin using verified sender
    const adminEmailResponse = await resend.emails.send({
      from: "marc@matchwise.tech",
      to: ["marc@matchwise.tech"],
      subject: `New ${isMyConsultant ? 'Team' : 'Network'} Consultant Registration`,
      html: `
        <h2>New Consultant Registration</h2>
        <p><strong>Name:</strong> ${consultantName}</p>
        <p><strong>Email:</strong> ${consultantEmail}</p>
        <p><strong>Type:</strong> ${isMyConsultant ? 'Team Consultant' : 'Network Consultant'}</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString('sv-SE')}</p>
        
        <p>Please review the consultant's profile in the admin panel.</p>
      `,
    });

    console.log("✅ Admin notification sent:", JSON.stringify(adminEmailResponse, null, 2));

    if (adminEmailResponse.error) {
      console.error("❌ Resend error:", adminEmailResponse.error);
      throw new Error(`Resend error: ${JSON.stringify(adminEmailResponse.error)}`);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      adminEmailId: adminEmailResponse.data?.id,
      emailResponse: adminEmailResponse
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("❌ Error in registration notification:", error);
    console.error("❌ Error stack:", error.stack);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack,
        type: 'registration_notification_error'
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
