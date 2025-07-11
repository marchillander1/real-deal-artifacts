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

    const prompt = `You are an automation and process optimization expert. Create a detailed automation blueprint based on the following information:

**Description:** ${automationData.description}
**Trigger:** ${automationData.trigger}
**Steps:** ${automationData.steps}
**Systems:** ${automationData.systems}
**Error Handling:** ${automationData.errorHandling}
**Expected Output:** ${automationData.output}
${automationData.notifications ? `**Notifications:** ${automationData.notifications}` : ''}
${automationData.conditions ? `**Conditions:** ${automationData.conditions}` : ''}

Create a structured analysis in English with the following format:

## 🎯 AUTOMATION BLUEPRINT

### Executive Summary
[Brief description of the automation and its value proposition]

### 🔍 Process Analysis
**Current State:** [Analyze the current manual process]
**Automation Potential:** [What can be automated and feasibility assessment]

### ⚙️ Technical Approach
**Implementation Strategy:** [High-level approach without specific tool names]
**Key Components:**
1. [Specific component 1]
2. [Specific component 2]
3. [Specific component 3]

### 📊 Expected Benefits
**Time Savings:** [Estimate per week/month]
**Quality Improvements:** [Reduced errors, faster processing]
**Scalability:** [How this improves as volume grows]

### 🚀 Implementation Roadmap
**Phase 1:** [First concrete steps]
**Phase 2:** [Next concrete steps]
**Estimated Timeline:** [Timeframe for completion]

### 🎯 Next Actions
[3-5 concrete actionable steps to get started]

Be specific and practical. Focus on feasibility and actionable insights rather than specific tools.`;

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

### Executive Summary
Based on your description "${automationData?.description || 'automation'}", we have identified several automation opportunities.

### 🔍 Process Analysis
**Current State:** Manual processes that consume time and may contain errors
**Automation Potential:** Through automation, we can eliminate repetitive tasks

### ⚙️ Technical Approach
**Implementation Strategy:** Workflow automation using integration platforms
**Key Components:**
1. Configure triggers based on your specifications
2. Set up actions and integrations
3. Test and verify the workflow

### 📊 Expected Benefits
**Time Savings:** Estimated 2-5 hours per week
**Quality Improvements:** Reduced errors and faster processing

### 🚀 Implementation Roadmap
**Phase 1:** Pilot project with basic automation
**Phase 2:** Expand with additional integrations
**Estimated Timeline:** 2-4 weeks

### 🎯 Next Actions
1. Choose an automation platform
2. Map exact triggers and actions
3. Set up a test workflow
4. Test and iterate
5. Launch into production

*Note: This is a simplified analysis as the AI service was not available.*`;

    return new Response(JSON.stringify({ 
      blueprint: fallbackBlueprint,
      fallback: true 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});