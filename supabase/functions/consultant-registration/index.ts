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
        subject: "Välkommen till MatchWise-nätverket!",
        html: `
          <p>Hej ${full_name.split(' ')[0]},</p>
          <br>
          <p>Välkommen till MatchWise-nätverket! 🎉</p>
          <br>
          <p>Grattis till att du har blivit en del av vårt professionella konsultnätverk. Din profil har nu analyserats och är redo att användas.</p>
          <br>
          <p><strong>🔑 Dina inloggningsuppgifter:</strong><br>
          E-post: ${email}<br>
          Lösenord: ${password}</p>
          <br>
          <p><strong>📊 Kom åt din profil här:</strong><br>
          <a href="https://matchwise.tech/my-profile" style="background: linear-gradient(to right, #2563eb, #7c3aed); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px 0;">Öppna Min Profil</a></p>
          <br>
          <p><strong>På din profilsida kan du:</strong></p>
          <ul>
            <li>📝 Redigera och uppdatera din information</li>
            <li>👁️ Kontrollera synlighet i nätverket</li>
            <li>🧠 Se dina AI-genererade karriärinsikter</li>
            <li>💰 Ange önskad timtaxa</li>
            <li>🎯 Hantera dina kompetenser och certifieringar</li>
          </ul>
          <br>
          <p>Din profil är nu en del av MatchWise-nätverket där vi kopplar ihop toppkonsulter med rätt möjligheter.</p>
          <br>
          <p>Om du har några frågor eller behöver hjälp, tveka inte att höra av dig!</p>
          <br>
          <p><strong>📩 Kontakt:</strong> marc@matchwise.tech</p>
          <br>
          <p>Tack för att du blev en del av MatchWise! 🚀</p>
          <br>
          <p>Vänliga hälsningar,<br>MatchWise-teamet</p>
        `,
      });

      console.log('Welcome email sent successfully:', emailResponse);

      // Send notification email to Marc
      const notificationResponse = await resend.emails.send({
        from: "MatchWise <marc@matchwise.tech>",
        to: ["marc@matchwise.tech"],
        subject: "Ny konsult har registrerat sig i nätverket",
        html: `
          <h2>Ny Konsult Registrerad</h2>
          <p>En ny konsult har slutfört CV-upload processen och registrerat sig i MatchWise-nätverket:</p>
          <ul>
            <li><strong>Namn:</strong> ${full_name}</li>
            <li><strong>E-post:</strong> ${email}</li>
            <li><strong>Konsult-ID:</strong> ${consultant_id}</li>
            <li><strong>Registrerad:</strong> ${new Date().toLocaleString('sv-SE')}</li>
          </ul>
          <p>Konsulten har fått ett välkomstmejl med sina inloggningsuppgifter och kan nu komma åt sin profil på:</p>
          <p><a href="https://matchwise.tech/my-profile">https://matchwise.tech/my-profile</a></p>
          <br>
          <p>Du kan se konsultens profil i admin-panelen.</p>
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