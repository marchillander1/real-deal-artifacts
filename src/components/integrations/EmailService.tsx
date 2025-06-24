
import React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface EmailTemplate {
  type: 'match_found' | 'assignment_created' | 'interest_notification' | 'welcome';
  recipient: string;
  data: any;
}

export class EmailService {
  static async sendEmail(template: EmailTemplate): Promise<boolean> {
    try {
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          template: template.type,
          recipient: template.recipient,
          data: template.data
        }
      });

      if (error) {
        console.error('Email sending error:', error);
        return false;
      }

      toast.success('E-post skickad!');
      return true;
    } catch (error) {
      console.error('Email service error:', error);
      toast.error('Kunde inte skicka e-post');
      return false;
    }
  }

  static async sendMatchNotification(
    consultantEmail: string, 
    assignmentTitle: string, 
    matchScore: number,
    assignmentId: string
  ): Promise<boolean> {
    return this.sendEmail({
      type: 'match_found',
      recipient: consultantEmail,
      data: {
        assignmentTitle,
        matchScore,
        assignmentId,
        actionUrl: `${window.location.origin}/dashboard?assignment=${assignmentId}`
      }
    });
  }

  static async sendAssignmentAlert(
    recipientEmail: string,
    assignmentTitle: string,
    company: string,
    skills: string[]
  ): Promise<boolean> {
    return this.sendEmail({
      type: 'assignment_created',
      recipient: recipientEmail,
      data: {
        assignmentTitle,
        company,
        skills: skills.join(', '),
        actionUrl: `${window.location.origin}/dashboard`
      }
    });
  }

  static async sendInterestNotification(
    clientEmail: string,
    consultantName: string,
    assignmentTitle: string
  ): Promise<boolean> {
    return this.sendEmail({
      type: 'interest_notification',
      recipient: clientEmail,
      data: {
        consultantName,
        assignmentTitle,
        actionUrl: `${window.location.origin}/dashboard`
      }
    });
  }

  static async sendWelcomeEmail(
    consultantEmail: string,
    consultantName: string
  ): Promise<boolean> {
    return this.sendEmail({
      type: 'welcome',
      recipient: consultantEmail,
      data: {
        consultantName,
        platformUrl: window.location.origin,
        supportEmail: 'support@matchwise.ai'
      }
    });
  }
}

// React component for email status
export const EmailStatusIndicator: React.FC<{ 
  sent: boolean;
  pending: boolean;
  error?: string;
}> = ({ sent, pending, error }) => {
  if (pending) {
    return (
      <div className="flex items-center text-yellow-600 text-xs">
        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-yellow-600 mr-1"></div>
        Skickar...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-xs">
        ⚠️ Misslyckades
      </div>
    );
  }

  if (sent) {
    return (
      <div className="text-green-600 text-xs">
        ✅ Skickad
      </div>
    );
  }

  return null;
};
