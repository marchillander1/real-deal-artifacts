
import { supabase } from '@/integrations/supabase/client';

export class CVParser {
  static async parseCV(file: File) {
    console.log('📄 Starting CV parsing for:', file.name);
    
    const formData = new FormData();
    formData.append('file', file);

    const cvResponse = await supabase.functions.invoke('parse-cv', {
      body: formData
    });

    if (cvResponse.error) {
      throw new Error(`CV-analys misslyckades: ${cvResponse.error.message}`);
    }

    return {
      analysis: cvResponse.data.analysis,
      detectedInfo: cvResponse.data.detectedInformation
    };
  }
}
