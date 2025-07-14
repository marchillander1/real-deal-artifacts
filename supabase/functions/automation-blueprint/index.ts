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

Create a structured analysis in English. Do NOT mention specific automation tools, platforms, or software names. Focus on concepts, approaches, and feasibility.

## 🎯 AUTOMATION BLUEPRINT

### Executive Summary
[Brief description of the automation opportunity and its strategic value]

### 🔍 Process Analysis
**Current State:** [Analyze the current manual process and pain points]
**Automation Potential:** [Assess what can be automated and complexity level]

### ⚙️ Technical Approach
**Implementation Strategy:** [High-level technical approach without naming tools]
**Key Components:**
1. [Technical component or integration point]
2. [Data flow or trigger mechanism]
3. [Action or output generation]

**Integration Considerations:** [How different systems would connect]

### 📊 Expected Benefits
**Efficiency Gains:** [Quantified time and effort savings]
**Quality Improvements:** [Error reduction and consistency benefits]
**Scalability Impact:** [How this enables growth]

### 🚀 Implementation Roadmap
**Phase 1:** [Foundation and core automation]
**Phase 2:** [Enhancement and optimization]
**Estimated Timeline:** [Realistic timeframe]

### 🎯 Strategic Recommendations
[4-5 high-level strategic recommendations for successful implementation]

Be specific about the approach and benefits, but avoid mentioning any specific automation platforms, tools, or software names. Focus on the strategic and technical value proposition.`;

    console.log('Calling Gemini API...');
    
    // Set a timeout for the API call
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

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
Based on your requirements "${automationData?.description || 'automation'}", we have identified strategic automation opportunities that can significantly enhance operational efficiency.

### 🔍 Process Analysis
**Current State:** Manual processes consuming valuable time and potentially introducing human error
**Automation Potential:** High feasibility for eliminating repetitive tasks through systematic workflow automation

### ⚙️ Technical Approach
**Implementation Strategy:** Event-driven workflow automation with API integrations
**Key Components:**
1. Trigger configuration based on defined events or schedules
2. Data processing and transformation logic
3. Multi-system integration and output generation

**Integration Considerations:** Seamless connectivity between existing systems through standardized APIs

### 📊 Expected Benefits
**Efficiency Gains:** Estimated 60-80% reduction in manual processing time
**Quality Improvements:** Elimination of human error and consistent output quality
**Scalability Impact:** Ability to handle increased volume without proportional resource growth

### 🚀 Implementation Roadmap
**Phase 1:** Core automation infrastructure and primary workflow
**Phase 2:** Advanced features, monitoring, and optimization
**Estimated Timeline:** 3-6 weeks depending on complexity

### 🎯 Strategic Recommendations
1. Start with highest-impact, lowest-complexity processes
2. Establish robust monitoring and error handling protocols
3. Design for scalability and future enhancement
4. Implement comprehensive testing before production deployment
5. Create documentation and training for stakeholders

*Note: This analysis provides strategic guidance. Detailed technical specifications require further consultation.*`;

    return new Response(JSON.stringify({ 
      blueprint: fallbackBlueprint,
      fallback: true 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});