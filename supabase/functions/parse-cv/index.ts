
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🚀 Starting CV parsing...');
    
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      throw new Error('No file provided');
    }

    console.log('📄 Processing file:', file.name, 'Type:', file.type, 'Size:', file.size);

    const groqApiKey = Deno.env.get('GROQ_API_KEY');
    if (!groqApiKey) {
      console.error('❌ GROQ_API_KEY not found');
      throw new Error('GROQ API key not configured');
    }

    // Förbättrad text-extraktion
    let extractedText = '';
    let detectedInfo = {
      emails: [] as string[],
      phones: [] as string[],
      names: [] as string[]
    };
    
    try {
      if (file.type === 'application/pdf') {
        console.log('📄 Processing PDF with improved extraction...');
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        
        // Förbättrad PDF text-extraktion
        let rawText = '';
        let currentChar = '';
        
        // Läs igenom PDF och extrahera läsbar text
        for (let i = 0; i < uint8Array.length - 1; i++) {
          const byte = uint8Array[i];
          const nextByte = uint8Array[i + 1];
          
          // Fokusera på ASCII-tecken som bildar ord
          if (byte >= 32 && byte <= 126) {
            currentChar = String.fromCharCode(byte);
            
            // Bygg upp text med spaces mellan ord
            if (currentChar.match(/[a-zA-Z0-9@.\-+]/)) {
              rawText += currentChar;
            } else if (currentChar === ' ' && rawText.slice(-1) !== ' ') {
              rawText += ' ';
            }
          } else if (byte === 10 || byte === 13) {
            // Ny rad
            if (rawText.slice(-1) !== ' ') {
              rawText += ' ';
            }
          }
        }
        
        // Rensa och strukturera text
        extractedText = rawText
          .replace(/\s+/g, ' ')
          .replace(/[^\w\s@.\-+()åäöÅÄÖ]/g, ' ')
          .trim()
          .substring(0, 2000);
        
        console.log('📝 Extracted text sample:', extractedText.substring(0, 200));
        
        // Direkt regex-detektion för personlig info
        const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
        const phoneRegex = /(\+46|0)[0-9\s\-\(\)]{8,15}/g;
        const nameRegex = /\b[A-ZÅÄÖ][a-zåäö]+\s+[A-ZÅÄÖ][a-zåäö]+/g;
        
        detectedInfo.emails = [...extractedText.matchAll(emailRegex)].map(m => m[0]);
        detectedInfo.phones = [...extractedText.matchAll(phoneRegex)].map(m => m[0].replace(/\s/g, ''));
        detectedInfo.names = [...extractedText.matchAll(nameRegex)].map(m => m[0]);
        
        console.log('🔍 Detected info:', detectedInfo);
        
      } else {
        // Text-filer
        extractedText = await file.text();
        extractedText = extractedText.substring(0, 2000);
      }
      
    } catch (error) {
      console.warn('⚠️ Text extraction failed:', error);
      extractedText = `Unable to extract text from ${file.name}`;
    }

    console.log('🤖 Sending to AI for analysis...');

    // Förenklad AI-prompt för bättre resultat
    const prompt = `Analysera detta CV och extrahera information. Använd detekterad data när tillgänglig.

DETEKTERAD INFO:
Email: ${detectedInfo.emails[0] || 'Ej funnen'}
Telefon: ${detectedInfo.phones[0] || 'Ej funnen'}
Namn: ${detectedInfo.names[0] || 'Ej funnet'}

CV TEXT:
${extractedText}

Svara ENDAST med denna JSON-struktur:

{
  "personalInfo": {
    "name": "ANVÄND DETEKTERAT NAMN ELLER HITTA I TEXT",
    "email": "ANVÄND DETEKTERAD EMAIL ELLER HITTA I TEXT", 
    "phone": "ANVÄND DETEKTERAD TELEFON ELLER HITTA I TEXT",
    "location": "HITTA STAD/PLATS"
  },
  "experience": {
    "years": "BERÄKNA ELLER UPPSKATTA ÅR",
    "currentRole": "NUVARANDE JOBBTITEL",
    "level": "Junior/Mid/Senior"
  },
  "skills": {
    "technical": ["LISTA TEKNISKA FÄRDIGHETER"],
    "languages": ["PROGRAMMERINGSSPRÅK"],
    "tools": ["VERKTYG OCH SYSTEM"]
  },
  "workHistory": [
    {
      "company": "FÖRETAG",
      "role": "ROLL",
      "duration": "PERIOD"
    }
  ]
}

Använd verklig data från CV. Om info saknas, skriv "Ej specificerat".`;

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'system',
            content: 'Du är expert på CV-analys. Extrahera verklig information och returnera giltig JSON. Prioritera detekterad personlig information.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 800,
      }),
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.error('❌ GROQ API error:', errorText);
      throw new Error(`GROQ API failed: ${groqResponse.status}`);
    }

    const groqData = await groqResponse.json();
    console.log('✅ AI response received');

    let analysis;
    try {
      const content = groqData.choices[0]?.message?.content;
      console.log('🔍 AI response:', content);

      // Extrahera JSON från svar
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
        
        // Säkerställ att detekterad data används
        if (detectedInfo.emails.length > 0) {
          analysis.personalInfo.email = detectedInfo.emails[0];
        }
        if (detectedInfo.phones.length > 0) {
          analysis.personalInfo.phone = detectedInfo.phones[0];
        }
        if (detectedInfo.names.length > 0) {
          analysis.personalInfo.name = detectedInfo.names[0];
        }
        
        console.log('📊 Final analysis:', analysis);
      } else {
        throw new Error('No JSON found in AI response');
      }
    } catch (parseError) {
      console.error('❌ Parse error, using fallback:', parseError);
      
      // Fallback med detekterad data
      analysis = {
        personalInfo: {
          name: detectedInfo.names[0] || 'Ej specificerat',
          email: detectedInfo.emails[0] || 'Ej specificerat',
          phone: detectedInfo.phones[0] || 'Ej specificerat',
          location: 'Ej specificerat'
        },
        experience: {
          years: 'Ej specificerat',
          currentRole: 'Ej specificerat',
          level: 'Ej specificerat'
        },
        skills: {
          technical: [],
          languages: [],
          tools: []
        },
        workHistory: []
      };
    }

    console.log('✅ CV analysis completed successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        analysis: analysis,
        detectedInformation: detectedInfo,
        extractionStats: {
          textLength: extractedText.length,
          emailsFound: detectedInfo.emails.length,
          phonesFound: detectedInfo.phones.length,
          namesFound: detectedInfo.names.length
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('❌ CV parsing error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
