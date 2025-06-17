
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface EmailNotificationHandlerProps {
  consultantId: string;
  finalEmail: string;
  finalName: string;
  isMyConsultant?: boolean;
}

export const EmailNotificationHandler = {
  sendWelcomeEmails: async ({ consultantId, finalEmail, finalName, isMyConsultant = false }: EmailNotificationHandlerProps) => {
    const { toast } = useToast();
    
    console.log('📧 🚨 SENDING EMAILS AFTER FORM SUBMISSION');
    console.log('📧 🔥 Will send welcome email to FORM EMAIL:', finalEmail);
    console.log('📧 📝 Consultant name for email:', finalName);
    console.log('📧 🆔 Consultant ID:', consultantId);

    try {
      // 🔥 🚨 Send welcome email to the FORM EMAIL address
      console.log('📧 🚀 Calling send-welcome-email function with FORM EMAIL...');
      const welcomeEmailResponse = await supabase.functions.invoke('send-welcome-email', {
        body: {
          consultantEmail: finalEmail, // 🔥 🚨 ALWAYS use form email
          consultantName: finalName,
          isMyConsultant: isMyConsultant
        }
      });

      console.log('📧 Welcome email full response:', JSON.stringify(welcomeEmailResponse, null, 2));

      if (welcomeEmailResponse.error) {
        console.error('❌ Welcome email error details:', welcomeEmailResponse.error);
        toast({
          title: "Welcome email failed",
          description: `Failed to send welcome email: ${welcomeEmailResponse.error.message || 'Unknown error'}`,
          variant: "destructive",
        });
      } else if (welcomeEmailResponse.data) {
        console.log('✅ Welcome email sent successfully!');
        console.log('📧 Email response data:', welcomeEmailResponse.data);
        toast({
          title: "Welcome email sent!",
          description: `Welcome email sent to ${finalEmail}`,
          variant: "default",
        });
      } else {
        console.warn('⚠️ Welcome email response has no data or error');
        toast({
          title: "Email status unclear",
          description: "Welcome email may not have been sent properly",
          variant: "default",
        });
      }

      // Send registration notification to admin
      console.log('📧 Sending admin notification...');
      const adminNotificationResponse = await supabase.functions.invoke('send-registration-notification', {
        body: {
          consultantName: finalName,
          consultantEmail: finalEmail, // 🔥 🚨 ALWAYS use form email
          isMyConsultant: isMyConsultant
        }
      });

      console.log('📧 Admin notification response:', adminNotificationResponse);

      if (adminNotificationResponse.error) {
        console.error('❌ Admin notification error:', adminNotificationResponse.error);
      } else {
        console.log('✅ Admin notification sent successfully');
      }

      return { success: true };

    } catch (emailError: any) {
      console.error('❌ Email sending failed with exception:', emailError);
      console.error('❌ Email error stack:', emailError.stack);
      toast({
        title: "Email sending failed",
        description: `Could not send welcome email: ${emailError.message}`,
        variant: "destructive",
      });
      return { success: false, error: emailError.message };
    }
  }
};
