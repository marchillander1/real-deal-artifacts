
import { supabase } from '@/integrations/supabase/client';

export class LinkedInAnalyzer {
  static async analyzeLinkedIn(linkedinUrl: string) {
    if (!linkedinUrl || !linkedinUrl.includes('linkedin.com')) {
      return null;
    }

    console.log('🔗 Starting LinkedIn analysis for:', linkedinUrl);

    const linkedinResponse = await supabase.functions.invoke('analyze-linkedin', {
      body: { linkedinUrl: linkedinUrl.trim() }
    });

    if (linkedinResponse.error) {
      console.warn('⚠️ LinkedIn analysis failed:', linkedinResponse.error);
      return null;
    }

    return linkedinResponse.data;
  }
}
