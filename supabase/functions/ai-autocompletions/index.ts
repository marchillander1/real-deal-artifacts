
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
    console.log('🤖 Generating AI autocompletions...');
    
    const { assignmentData, fields } = await req.json();
    
    // Mock AI suggestions based on assignment context
    const suggestions = [];
    
    if (fields.includes('requiredSkills')) {
      const skillSuggestions = generateSkillSuggestions(assignmentData);
      suggestions.push({
        field: 'requiredSkills',
        suggestions: skillSuggestions,
        confidence: 0.85
      });
    }

    if (fields.includes('teamCulture')) {
      const cultureSuggestions = generateCultureSuggestions(assignmentData);
      suggestions.push({
        field: 'teamCulture',
        suggestions: cultureSuggestions,
        confidence: 0.78
      });
    }

    if (fields.includes('desiredCommunicationStyle')) {
      const commSuggestions = generateCommunicationSuggestions(assignmentData);
      suggestions.push({
        field: 'desiredCommunicationStyle',
        suggestions: commSuggestions,
        confidence: 0.72
      });
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        suggestions: suggestions
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('❌ AI autocompletion error:', error);
    
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

function generateSkillSuggestions(assignmentData: any): string[] {
  const title = assignmentData.title?.toLowerCase() || '';
  const description = assignmentData.description?.toLowerCase() || '';
  const industry = assignmentData.industry?.toLowerCase() || '';
  
  const skillMappings: { [key: string]: string[] } = {
    'react': ['TypeScript', 'JavaScript', 'HTML/CSS', 'Node.js', 'Git'],
    'backend': ['Node.js', 'Python', 'SQL', 'REST APIs', 'Docker'],
    'fullstack': ['React', 'Node.js', 'TypeScript', 'SQL', 'AWS'],
    'devops': ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Terraform'],
    'data': ['Python', 'SQL', 'Machine Learning', 'Pandas', 'Jupyter'],
    'fintech': ['Financial Regulations', 'Risk Management', 'Compliance', 'Banking APIs'],
    'ecommerce': ['Payment Integration', 'Inventory Management', 'Analytics', 'SEO']
  };

  let suggestions: string[] = [];
  
  for (const [key, skills] of Object.entries(skillMappings)) {
    if (title.includes(key) || description.includes(key) || industry.includes(key)) {
      suggestions.push(...skills);
    }
  }

  return [...new Set(suggestions)].slice(0, 5);
}

function generateCultureSuggestions(assignmentData: any): string[] {
  const cultures = [
    'Agile och kollaborativ',
    'Innovativ och experimentell',
    'Resultatfokuserad',
    'Öppen kommunikation',
    'Snabba beslut',
    'Kvalitetsfokuserad',
    'Kontinuerlig lärande',
    'Work-life balance'
  ];
  
  return cultures.slice(0, 4);
}

function generateCommunicationSuggestions(assignmentData: any): string[] {
  const styles = [
    'Dagliga standups',
    'Veckovis rapportering',
    'Slack/Teams kommunikation',
    'Direkt och transparent',
    'Strukturerade möten',
    'Kontinuerlig feedback',
    'Dokumenterad process'
  ];
  
  return styles.slice(0, 3);
}
