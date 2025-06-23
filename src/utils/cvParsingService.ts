
import { supabase } from '@/integrations/supabase/client';

export const parseCV = async (file: File, linkedinUrl: string) => {
  console.log('🚀 Starting CV parsing with Gemini integration...');
  
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('linkedinUrl', linkedinUrl);

    console.log('📤 Sending CV to parse-cv function...');

    const response = await supabase.functions.invoke('parse-cv', {
      body: formData
    });

    if (response.error) {
      throw new Error(`CV parsing failed: ${response.error.message}`);
    }

    const result = response.data;
    
    if (!result.success) {
      throw new Error(result.error || 'CV parsing failed');
    }

    console.log('✅ CV parsed successfully:', result.analysis);
    
    return {
      success: true,
      analysis: result.analysis,
      detectedInformation: result.detectedInformation || {},
      extractionStats: result.extractionStats || {}
    };

  } catch (error) {
    console.error('❌ CV parsing error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const saveConsultantToDatabase = async (consultantData: any) => {
  console.log('💾 Saving consultant to database...');
  
  try {
    const response = await supabase.functions.invoke('save-consultant', {
      body: consultantData
    });

    if (response.error) {
      throw new Error(`Save failed: ${response.error.message}`);
    }

    const result = response.data;
    
    if (!result.success) {
      throw new Error(result.error || 'Save failed');
    }

    console.log('✅ Consultant saved successfully:', result.consultant);
    return result;

  } catch (error) {
    console.error('❌ Save consultant error:', error);
    throw error;
  }
};
