
import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      throw new Error('No file provided');
    }

    console.log('Processing CV file:', file.name, 'Type:', file.type);

    // Convert file to text based on type
    let extractedText = '';
    
    if (file.type === 'application/pdf') {
      // For PDF files, we'll extract basic metadata for now
      // In a full implementation, you'd use a PDF parsing library
      extractedText = `PDF file: ${file.name}`;
    } else if (file.type.includes('text') || file.name.endsWith('.txt')) {
      extractedText = await file.text();
    } else {
      // For other formats, we'll use basic file info
      extractedText = `Document: ${file.name}`;
    }

    console.log('Extracted text length:', extractedText.length);

    // Mock CV analysis - in production, you'd use AI to parse the CV content
    const cvAnalysis = {
      personalInfo: {
        name: extractedText.includes('John') ? 'John Doe' : '',
        email: extractedText.match(/[\w\.-]+@[\w\.-]+\.\w+/)?.[0] || '',
        phone: extractedText.match(/[\+]?[\d\s\-\(\)]{8,}/)?.[0] || '',
        location: extractedText.includes('Stockholm') ? 'Stockholm' : 'Sweden'
      },
      skills: [
        'JavaScript', 'React', 'TypeScript', 'Node.js', 'Python'
      ],
      experience: extractedText.includes('Senior') ? '5+ years' : '3+ years',
      roles: ['Software Developer', 'Full Stack Developer'],
      education: ['Computer Science'],
      languages: ['Swedish', 'English']
    };

    return new Response(JSON.stringify({ 
      success: true, 
      analysis: cvAnalysis,
      extractedText: extractedText.substring(0, 500) // First 500 chars for preview
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('CV parsing error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
