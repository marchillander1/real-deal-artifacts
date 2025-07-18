import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ConsultantRegistrationRequest {
  email: string;
  full_name: string;
  password: string;
  consultant_id: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, full_name, password, consultant_id }: ConsultantRegistrationRequest = await req.json();

    console.log('Sending registration emails for consultant:', email);

    // Send welcome email to the consultant
    console.log('Attempting to send welcome email to:', email);
    try {
      const emailResponse = await resend.emails.send({
        from: "MatchWise <marc@matchwise.tech>",
        to: [email],
        subject: "🚀 Welcome to MatchWise Network!",
        html: `
          <p>Hi ${full_name.split(' ')[0]},</p>
          <br>
          <p>Welcome to the MatchWise network! 🎉</p>
          <br>
          <p>Congratulations on becoming part of our professional consultant network. Your profile has been analyzed and is ready to use.</p>
          <br>
          <p><strong>🔑 Your login credentials:</strong><br>
          Email: ${email}<br>
          Password: ${password}</p>
          <br>
          <p><strong>📊 Access your profile here:</strong><br>
          <a href="https://matchwise.tech/my-profile" style="background: linear-gradient(to right, #2563eb, #7c3aed); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px 0;">Open My Profile</a></p>
          <br>
          <p><strong>On your profile page you can:</strong></p>
          <ul>
            <li>📝 Edit and update your information</li>
            <li>👁️ Control visibility in the network</li>
            <li>🧠 View your AI-generated career insights</li>
            <li>💰 Set your preferred hourly rate</li>
            <li>🎯 Manage your skills and certifications</li>
          </ul>
          <br>
          <p>Your profile is now part of the MatchWise network where we connect top consultants with the right opportunities.</p>
          <br>
          <p>If you have any questions or need help, don't hesitate to reach out!</p>
          <br>
          <p><strong>📩 Contact:</strong> marc@matchwise.tech</p>
          <br>
          <p>Thank you for becoming part of MatchWise! 🚀</p>
          <br>
          <p>Best regards,<br>The MatchWise Team</p>
        `,
      });

      console.log('Welcome email sent successfully:', emailResponse);

      // Send notification email to Marc
      const notificationResponse = await resend.emails.send({
        from: "MatchWise <marc@matchwise.tech>",
        to: ["marc@matchwise.tech"],
        subject: "New consultant registered in network",
        html: `
          <h2>New Consultant Registered</h2>
          <p>A new consultant has completed the CV-upload process and registered in the MatchWise network:</p>
          <ul>
            <li><strong>Name:</strong> ${full_name}</li>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Consultant ID:</strong> ${consultant_id}</li>
            <li><strong>Registered:</strong> ${new Date().toLocaleString('en-US')}</li>
          </ul>
          <p>The consultant has received a welcome email with their login credentials and can now access their profile at:</p>
          <p><a href="https://matchwise.tech/my-profile">https://matchwise.tech/my-profile</a></p>
          <br>
          <p>You can view the consultant's profile in the admin panel.</p>
        `,
      });

      console.log('Notification email sent to Marc:', notificationResponse);
    } catch (emailError: any) {
      console.error('CRITICAL: Email sending failed:', emailError);
      // Log the specific error but don't fail the entire registration
      console.error('Email error details:', JSON.stringify(emailError));
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Registration emails sent successfully'
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in consultant-registration function:", error);
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