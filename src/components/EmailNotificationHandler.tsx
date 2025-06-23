
import { EmailService } from './email/EmailService';

interface EmailNotificationHandlerProps {
  consultantId: string;
  finalEmail: string;
  finalName: string;
  isMyConsultant?: boolean;
  toast: (options: { title: string; description: string; variant?: "default" | "destructive" }) => void;
}

export const EmailNotificationHandler = {
  sendWelcomeEmails: async ({ consultantId, finalEmail, finalName, isMyConsultant = false, toast }: EmailNotificationHandlerProps) => {
    console.log('📧 Using new EmailService for welcome emails');

    try {
      // Send welcome email
      await EmailService.sendWelcomeEmail({
        consultantId,
        email: finalEmail,
        name: finalName,
        isMyConsultant
      });

      // Send admin notification (non-blocking)
      await EmailService.sendAdminNotification({
        name: finalName,
        email: finalEmail,
        isMyConsultant
      });

      toast({
        title: "Welcome email sent! ✅",
        description: `Welcome email sent to ${finalEmail}`,
        variant: "default",
      });

      return { success: true };

    } catch (error: any) {
      console.error('❌ Email notification failed:', error);
      
      toast({
        title: "Registration successful",
        description: "Profile created but email notification failed",
        variant: "default",
      });
      
      return { success: false, error: error.message };
    }
  }
};
