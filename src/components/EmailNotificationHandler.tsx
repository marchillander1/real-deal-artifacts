
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
    console.log('📧 Using enhanced EmailService for welcome emails');
    console.log('📧 Sending to consultant:', finalEmail);
    console.log('📧 Also notifying marc@matchwise.tech');

    try {
      // Send welcome email to consultant
      console.log('📧 Step 1: Sending welcome email to consultant...');
      await EmailService.sendWelcomeEmail({
        consultantId,
        email: finalEmail,
        name: finalName,
        isMyConsultant
      });
      console.log('✅ Welcome email sent to consultant successfully');

      // Send admin notification to marc@matchwise.tech
      console.log('📧 Step 2: Sending admin notification...');
      await EmailService.sendAdminNotification({
        name: finalName,
        email: finalEmail,
        isMyConsultant
      });
      console.log('✅ Admin notification sent successfully');

      toast({
        title: "Welcome emails sent! ✅",
        description: `Welcome email sent to ${finalEmail} and notification sent to admin`,
        variant: "default",
      });

      return { success: true };

    } catch (error: any) {
      console.error('❌ Email notification failed:', error);
      
      toast({
        title: "Registration successful",
        description: "Profile created but email notification may have failed",
        variant: "default",
      });
      
      return { success: false, error: error.message };
    }
  }
};
