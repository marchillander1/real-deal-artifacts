import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('Automation blueprint function called');
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Processing request...');
    const { automationData } = await req.json();
    console.log('Received automation data:', JSON.stringify(automationData, null, 2));

    if (!geminiApiKey) {
      console.error('GEMINI_API_KEY not found');
      throw new Error('GEMINI_API_KEY not configured');
    }

    const prompt = `Du är en expert på automation och processoptimering. Skapa en detaljerad automation blueprint baserat på följande information:

**Beskrivning:** ${automationData.description}
**Trigger:** ${automationData.trigger}
**Steg:** ${automationData.steps}
**System:** ${automationData.systems}
**Felhantering:** ${automationData.errorHandling}
**Förväntat resultat:** ${automationData.output}
${automationData.notifications ? `**Notifieringar:** ${automationData.notifications}` : ''}
${automationData.conditions ? `**Villkor:** ${automationData.conditions}` : ''}

Skapa en strukturerad analys på svenska med följande format:

## 🎯 AUTOMATION BLUEPRINT

### Sammanfattning
[Kort beskrivning av automationen och dess värde]

### 🔍 Procesanalys
**Nuvarande situation:** [Analysera nuvarande process]
**Automation potential:** [Vad som kan automatiseras]

### ⚙️ Teknisk Implementation
**Verktyg:** [Konkreta verktyg som Zapier, Make, Power Automate]
**Steg-för-steg:**
1. [Specifikt steg 1]
2. [Specifikt steg 2]
3. [Specifikt steg 3]

### 📊 Förväntad ROI
**Tidsbesparingar:** [Uppskattning per vecka/månad]
**Kvalitetsförbättringar:** [Mindre fel, snabbare processing]

### 🚀 Implementation Plan
**Fas 1:** [Första konkreta steg]
**Fas 2:** [Nästa konkreta steg]
**Uppskattat genomförande:** [Tidsram]

### 🎯 Nästa Steg
[3-5 konkreta åtgärder för att komma igång]

Var specifik och praktisk. Fokusera på konkreta verktyg och åtgärder.`;

    console.log('Calling Gemini API...');
    
    // Set a timeout for the API call
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1500,
        }
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Gemini response received');
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      console.error('Invalid response format from Gemini:', data);
      throw new Error('Invalid response format from Gemini API');
    }
    
    const blueprint = data.candidates[0].content.parts[0].text;
    console.log('Blueprint generated successfully');

    return new Response(JSON.stringify({ blueprint }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in automation-blueprint function:', error);
    
    // Return a fallback response if API fails
    const fallbackBlueprint = `## 🎯 AUTOMATION BLUEPRINT

### Sammanfattning
Baserat på din beskrivning "${automationData?.description || 'automation'}" har vi identifierat flera möjligheter för automation.

### 🔍 Procesanalys
**Nuvarande situation:** Manuella processer som tar tid och kan innehålla fel
**Automation potential:** Genom automation kan vi eliminera repetitiva uppgifter

### ⚙️ Teknisk Implementation
**Verktyg:** Zapier, Microsoft Power Automate, eller Make (tidigare Integromat)
**Steg-för-steg:**
1. Konfigurera triggers baserat på dina specificationer
2. Sätt upp åtgärder och integrationer
3. Testa och verifiera flödet

### 📊 Förväntad ROI
**Tidsbesparingar:** Uppskattningsvis 2-5 timmar per vecka
**Kvalitetsförbättringar:** Minskade fel och snabbare processning

### 🚀 Implementation Plan
**Fas 1:** Pilotprojekt med grundläggande automation
**Fas 2:** Utöka med fler integrationer
**Uppskattat genomförande:** 2-4 veckor

### 🎯 Nästa Steg
1. Välj automation-plattform (rekommenderar Zapier för enkelhet)
2. Kartlägg exakta triggers och åtgärder
3. Sätt upp ett testflöde
4. Testa och iterera
5. Lansera i produktion

*Observera: Detta är en förenklad analys då AI-tjänsten inte var tillgänglig.*`;

    return new Response(JSON.stringify({ 
      blueprint: fallbackBlueprint,
      fallback: true 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});