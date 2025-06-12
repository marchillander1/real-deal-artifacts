
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  userEmail: string;
  userName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("🚀 Welcome email function started");
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
    // Parse request body
    const body = await req.text();
    console.log("📦 Raw request body received");
    
    if (!body) {
      throw new Error("Request body is empty");
    }

    let requestData: WelcomeEmailRequest;
    try {
      requestData = JSON.parse(body);
    } catch (parseError) {
      console.error("❌ JSON parse error:", parseError);
      throw new Error("Invalid JSON in request body");
    }

    const { userEmail, userName } = requestData;

    console.log("📧 Sending welcome email to:", userEmail, "with name:", userName);

    // Validate email
    if (!userEmail) {
      throw new Error("userEmail is required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      throw new Error("Invalid email format");
    }

    // Check if API key exists
    const apiKey = Deno.env.get("RESEND_API_KEY");
    if (!apiKey) {
      console.error("❌ RESEND_API_KEY not found in environment");
      throw new Error("RESEND_API_KEY not configured");
    }
    console.log("🔑 RESEND_API_KEY found (length:", apiKey.length, ")");

    // Extract first name from full name or use email
    const firstName = userName ? userName.split(' ')[0] : userEmail.split('@')[0];

    console.log("👤 First name extracted:", firstName);

    // Initialize Resend with API key
    const resend = new Resend(apiKey);

    console.log("🔧 Resend client configured");

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.6;">
        <h2 style="color: #2563eb;">Hej ${firstName}!</h2>
        
        <p>Tack för att du laddade upp ditt CV och gick med i MatchWise!</p>
        
        <p>Du har precis tagit ett stort steg mot spännande nya konsultmöjligheter.</p>
        
        <p>Vår AI-drivna plattform analyserar både din erfarenhet och dina mjuka färdigheter för att matcha dig med rätt projekt – inte bara baserat på kompetens, utan också på personlighet och kulturell passform.</p>
        
        <h3 style="color: #2563eb;">🔍 Vad händer nu?</h3>
        <ul>
          <li>Din profil granskas av vårt team</li>
          <li>Du kommer snart att synas för anställande företag på plattformen</li>
          <li>Vi hör av oss om en särskilt bra matchning dyker upp</li>
        </ul>
        
        <h3 style="color: #2563eb;">💡 Tips:</h3>
        <p>Se till att hålla din profil uppdaterad och svara snabbt på eventuella erbjudanden – det ökar dina chanser att landa fantastiska uppdrag.</p>
        
        <p>Om du har några frågor, tveka inte att höra av dig på <a href="mailto:marc@matchwise.tech">marc@matchwise.tech</a>.</p>
        
        <p><strong>Välkommen till framtiden för konsultmatchning!</strong></p>
        
        <p>Bästa hälsningar,<br>
        MatchWise-teamet<br>
        <a href="https://www.matchwise.tech">www.matchwise.tech</a></p>
      </div>
    `;

    console.log("📝 Email HTML prepared");

    // Send welcome email via Resend
    const emailResponse = await resend.emails.send({
      from: "Marc från MatchWise <marc@matchwise.tech>",
      to: [userEmail],
      subject: "Välkommen till MatchWise – Du är ett steg närmare ditt nästa uppdrag 🚀",
      html: emailHtml,
    });

    console.log("📤 Email sent successfully via Resend:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("❌ Error sending welcome email:", error);
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
