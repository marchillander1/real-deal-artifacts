
import { supabase } from '@/integrations/supabase/client';

export class CVParser {
  static async parseCV(file: File, personalDescription: string = '') {
    console.log('🚀 Starting enhanced CV parsing with Gemini...');
    console.log('📝 Personal description provided:', !!personalDescription);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('personalDescription', personalDescription);

      console.log('📤 Sending CV to parse-cv function with personal description...');

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

      console.log('✅ Enhanced CV parsing completed:', {
        hasAnalysis: !!result.analysis,
        personalDescriptionUsed: result.extractionStats?.personalDescriptionUsed || false,
        skillsDetected: result.extractionStats?.detectedSkills || 0
      });
      
      return {
        success: true,
        analysis: result.analysis,
        detectedInfo: result.detectedInformation || {},
        extractionStats: result.extractionStats || {}
      };

    } catch (error: any) {
      console.error('❌ Enhanced CV parsing error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}
