
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

    // Send welcome email with login details
    await resend.emails.send({
      from: "MatchWise AI <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to MatchWise AI - Your Account is Ready!",
      html: `
        <h1>Welcome to MatchWise AI, ${full_name}!</h1>
        <p>Your account has been created and is ready to use.</p>
        <br>
        <p><strong>Login Details:</strong></p>
        <p>Email: ${email}</p>
        <p>Password: ${password}</p>
        <br>
        <p><strong>Login URL:</strong> <a href="https://your-app-url.com/auth">Login to MatchWise AI</a></p>
        <br>
        <p>Get started:</p>
        <ul>
          <li>Upload your first consultant CVs</li>
          <li>Create assignment profiles</li>
          <li>Experience AI-powered matching</li>
        </ul>
        <br>
        <p>For support, reply to this email or contact us directly.</p>
        <p>Best regards,<br>The MatchWise AI Team</p>
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
