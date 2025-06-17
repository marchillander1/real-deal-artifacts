
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  consultantName: string;
  consultantEmail: string;
  isMyConsultant?: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  console.log('🎯 Welcome email function called');
  console.log('🔑 RESEND_API_KEY exists:', !!Deno.env.get("RESEND_API_KEY"));
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { consultantName, consultantEmail, isMyConsultant }: WelcomeEmailRequest = await req.json();

    console.log("📧 Sending welcome email:", { consultantName, consultantEmail, isMyConsultant });
    console.log("📧 Email will be sent from: marc@matchwise.tech");
    console.log("📧 Email will be sent to FORM EMAIL (NOT CV EMAIL):", consultantEmail);

    // Alla analyser går nu till Network Consultants
    const emailContent = {
      subject: "🚀 Välkommen till MatchWise AI Network - Du är nu i plattformen!",
      greeting: `Hej ${consultantName}!`,
      mainMessage: "Grattis! Du är nu en del av MatchWise AI:s konsultnätverk.",
      details: `
        <p><strong>Du är nu i vår plattform och synlig för företag som söker konsulter!</strong></p>
        <p>Vår AI-drivna plattform har analyserat din profil och kommer automatiskt matcha dig med relevanta projekt baserat på:</p>
        <ul style="margin-left: 20px;">
          <li>✅ Dina tekniska färdigheter och expertis</li>
          <li>✅ Din personlighet och kulturella passform</li>
          <li>✅ Din kommunikationsstil och arbetspreferenser</li>
          <li>✅ Din erfarenhetsnivå och projekthistorik</li>
        </ul>
        
        <h3 style="color: #2563eb; margin-top: 20px;">🎯 Vad händer nu?</h3>
        <ul style="margin-left: 20px;">
          <li><strong>Du är live!</strong> Företag kan nu se din profil i Network Consultants</li>
          <li><strong>Smart matchning:</strong> Vår AI kommer meddela dig om relevanta möjligheter</li>
          <li><strong>Kvalitetsled:</strong> Få bara uppdrag som matchar dina färdigheter</li>
          <li><strong>Ingen spam:</strong> Vi förfiltrerar alla möjligheter för kvalitet</li>
        </ul>
        
        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
          <h4 style="color: #1e40af; margin: 0 0 10px 0;">💡 Tips för framgång:</h4>
          <ul style="margin: 0; padding-left: 20px;">
            <li>Håll din tillgänglighetsstatus uppdaterad</li>
            <li>Svara på möjligheter inom 24 timmar</li>
            <li>Uppdatera dina färdigheter när du lär dig nya teknologier</li>
            <li>Underhåll en professionell LinkedIn-närvaro</li>
          </ul>
        </div>
      `,
      nextSteps: `
        <div style="background: #ecfdf5; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
          <h4 style="color: #047857; margin: 0 0 10px 0;">🚀 Redo att komma igång?</h4>
          <p style="margin: 0;">Din profil är nu aktiv och företag kan hitta dig. De första matchningsmöjligheterna bör börja komma in inom de närmaste dagarna!</p>
          <p style="margin: 10px 0 0 0;"><strong>Du hittar din profil under "Network Consultants" på plattformen.</strong></p>
        </div>
      `,
      closing: "Välkommen till framtiden för konsultmatchning! 🎉"
    };

    // Prepare email content with the HTML properly encoded
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.6;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">MatchWise AI</h1>
          <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 16px;">Intelligent Konsultmatchning</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #2563eb; margin: 0 0 20px 0;">${emailContent.greeting}</h2>
          
          <p style="font-size: 16px; margin-bottom: 20px;">${emailContent.mainMessage}</p>
          
          ${emailContent.details}
          
          ${emailContent.nextSteps}
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0;">
            <p style="margin: 0; text-align: center;"><strong>Frågor eller behöver support?</strong></p>
            <p style="margin: 10px 0 0 0; text-align: center;">
              Kontakta oss på <a href="mailto:marc@matchwise.tech" style="color: #2563eb; text-decoration: none;">marc@matchwise.tech</a>
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="font-size: 18px; font-weight: bold; color: #2563eb; margin: 0;">${emailContent.closing}</p>
          </div>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;">
          <div style="text-align: center;">
            <p style="color: #64748b; font-size: 14px; margin: 0;">
              Med vänliga hälsningar,<br>
              <strong>Marc & MatchWise-teamet</strong>
            </p>
            <p style="color: #94a3b8; font-size: 12px; margin: 15px 0 0 0;">
              Detta email skickades automatiskt från MatchWise AI-plattformen.
            </p>
          </div>
        </div>
      </div>
    `;

    console.log("🚀 About to send email via Resend to FORM EMAIL...");

    // Send welcome email to consultant using the FORM EMAIL (not CV email)
    const emailResponse = await resend.emails.send({
      from: "marc@matchwise.tech",
      to: [consultantEmail], // Detta är nu SÄKERT form email
      subject: emailContent.subject,
      html: emailHtml,
    });

    console.log(`✅ Welcome email sent successfully to FORM EMAIL ${consultantEmail}`);
    console.log("📨 Resend email response:", JSON.stringify(emailResponse, null, 2));

    if (emailResponse.error) {
      console.error("❌ Resend error:", emailResponse.error);
      throw new Error(`Resend error: ${JSON.stringify(emailResponse.error)}`);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      emailId: emailResponse.data?.id,
      emailResponse: emailResponse,
      sentToFormEmail: consultantEmail
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("❌ Error sending welcome email:", error);
    console.error("❌ Error stack:", error.stack);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack,
        type: 'welcome_email_error'
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
