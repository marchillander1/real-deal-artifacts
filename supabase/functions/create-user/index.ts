
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface CreateUserRequest {
  email: string;
  full_name: string;
  company: string;
  password: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, full_name, company, password }: CreateUserRequest = await req.json();

    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Create user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name,
      }
    });

    if (authError) {
      throw authError;
    }

    // Create profile
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: authData.user.id,
        email,
        full_name,
        company,
        role: 'user'
      });

    if (profileError) {
      console.error('Profile creation error:', profileError);
    }

    // Add to user_management table using admin client to bypass RLS
    const { error: userMgmtError } = await supabaseAdmin
      .from('user_management')
      .insert({
        email,
        full_name,
        company: company || null,
        role: 'user',
        created_by: authData.user.id
      });

    if (userMgmtError) {
      console.error('User management insertion error:', userMgmtError);
    }

    // Send welcome email with login details
    await resend.emails.send({
      from: "MatchWise <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to MatchWise — Let's get you matched!",
      html: `
        <p>Hi ${full_name.split(' ')[0]},</p>
        <br>
        <p>Welcome to MatchWise! 🎉</p>
        <br>
        <p>We're excited to have you join a smarter, more human way to connect top consultants with the right opportunities.</p>
        <br>
        <p><strong>👉 Get started right away here:</strong><br>
        <a href="https://matchwise.tech/matchwiseai">matchwise.tech/matchwiseai</a></p>
        <br>
        <p>Inside, you'll find your personalized dashboard where you can explore matches, update your profile, and manage your preferences.</p>
        <br>
        <p><strong>Your login details:</strong><br>
        Email: ${email}<br>
        Password: ${password}</p>
        <br>
        <p>If you have any questions or need a hand, just reach out — we're here to help!</p>
        <br>
        <p><strong>📩 Contact:</strong> marc@matchwise.tech</p>
        <br>
        <p>Thanks for joining us — let's make magic happen together. 🚀</p>
        <br>
        <p>Warm regards,<br>The MatchWise Team</p>
      `,
    });

    return new Response(JSON.stringify({ 
      success: true, 
      user: { id: authData.user.id, email, full_name, company }
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in create-user function:", error);
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
