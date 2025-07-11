import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { automationData } = await req.json();

    const prompt = `Du är en expert på automation och processoptimering. Din uppgift är att skapa en detaljerad automation blueprint baserat på användarens input. 

Analysera noggrant vad användaren vill automatisera och skapa en praktisk, genomförbar plan som:
1. Identifierar exakt vad som kan automatiseras
2. Föreslår konkreta verktyg och teknologier
3. Bryter ner processen i steg-för-steg instruktioner
4. Identifierar potentiella utmaningar och lösningar
5. Uppskattar tidsbesparingar och ROI
6. Ger nästa steg för implementation

Var specifik och praktisk. Fokusera på värde och genomförbarhet.

Skapa en automation blueprint för följande scenario:

**Beskrivning:** ${automationData.description}
**Trigger:** ${automationData.trigger}
**Steg:** ${automationData.steps}
**System:** ${automationData.systems}
**Felhantering:** ${automationData.errorHandling}
**Förväntat resultat:** ${automationData.output}
${automationData.notifications ? `**Notifieringar:** ${automationData.notifications}` : ''}
${automationData.conditions ? `**Villkor:** ${automationData.conditions}` : ''}

Strukturera svaret enligt följande format:

## 🎯 AUTOMATION BLUEPRINT

### Sammanfattning
[Kort beskrivning av vad som kommer automatiseras och dess värde]

### 🔍 Procesanalys
**Nuvarande situation:**
[Analysera nuvarande manuella process]

**Automation potential:**
[Vad som kan automatiseras och varför]

### ⚙️ Teknisk Implementation

**Rekommenderade verktyg:**
[Konkreta verktyg och plattformar]

**Steg-för-steg process:**
1. [Detaljerat steg 1]
2. [Detaljerat steg 2]
3. [osv...]

**Integrationer:**
[Hur systemen ska kopplas ihop]

### 🛡️ Riskhantering & Säkerhet
[Identifiera risker och föreslå lösningar]

### 📊 Förväntad ROI
**Tidsbesparingar:** [Konkret uppskattning]
**Kostnadsbesparing:** [Om möjligt]
**Kvalitetsförbättringar:** [Mindre fel, snabbare processing etc]

### 🚀 Implementation Plan
**Fas 1:** [Första steg]
**Fas 2:** [Nästa steg]
**Fas 3:** [Slutliga steg]

**Uppskattat genomförande:** [Tidsram]

### ⚠️ Potentiella Utmaningar
[Identifiera möjliga hinder och lösningar]

### 🎯 Nästa Steg
[Konkreta åtgärder för att komma igång]

Gör analysen på svenska och var specifik och praktisk.`;

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
          maxOutputTokens: 2048,
        }
      }),
    });

    if (!response.ok) {
      console.error('Gemini API error:', response.status, await response.text());
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      console.error('Invalid response format from Gemini:', data);
      throw new Error('Invalid response format from Gemini API');
    }
    
    const blueprint = data.candidates[0].content.parts[0].text;

    return new Response(JSON.stringify({ blueprint }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in automation-blueprint function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Failed to generate automation blueprint'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});