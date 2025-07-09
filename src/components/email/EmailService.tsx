
import { supabase } from '@/integrations/supabase/client';

interface WelcomeEmailParams {
  consultantId: string;
  email: string;
  name: string;
  isMyConsultant?: boolean;
}

export class EmailService {
  static async sendWelcomeEmail({ consultantId, email, name, isMyConsultant = false }: WelcomeEmailParams) {
    console.log('📧 Sending welcome email to consultant:', email, 'Name:', name);
    
    try {
      const response = await supabase.functions.invoke('send-welcome-email', {
        body: {
          consultantEmail: email,
          consultantName: name,
          isMyConsultant: isMyConsultant
        }
      });

      console.log('📨 Welcome email function response:', response);

      if (response.error) {
        console.error('❌ Welcome email failed:', response.error);
        throw new Error(`Welcome email failed: ${response.error.message}`);
      }

      if (!response.data?.success) {
        console.error('❌ Email service returned failure:', response.data);
        throw new Error(response.data?.error || 'Email sending failed');
      }

      console.log('✅ Welcome email sent successfully to consultant:', response.data.messageId);
      return { success: true, data: response.data };

    } catch (error: any) {
      console.error('❌ Welcome email service error:', error);
      throw error;
    }
  }

  static async sendAdminNotification({ name, email, isMyConsultant = false }: { name: string; email: string; isMyConsultant?: boolean }) {
    console.log('📧 Sending admin notification for consultant:', name, 'to marc@matchwise.tech');
    
    try {
      const response = await supabase.functions.invoke('send-registration-notification', {
        body: {
          consultantName: name,
          consultantEmail: email,
          isMyConsultant: isMyConsultant
        }
      });

      console.log('📨 Admin notification function response:', response);

      if (response.error) {
        console.warn('⚠️ Admin notification failed:', response.error);
        // Don't throw here - admin notification failure shouldn't block user flow
        return { success: false, error: response.error };
      }

      console.log('✅ Admin notification sent successfully to marc@matchwise.tech');
      return { success: true, data: response.data };

    } catch (error: any) {
      console.warn('⚠️ Admin notification error:', error);
      return { success: false, error: error.message };
    }
  }
}
