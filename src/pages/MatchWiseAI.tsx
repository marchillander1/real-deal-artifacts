import React, { useState, useEffect } from 'react';
import { AssignmentsSection } from '@/components/dashboard/AssignmentsSection';
import { ConsultantsSection } from '@/components/dashboard/ConsultantsSection';
import { CreateAssignmentForm } from '@/components/dashboard/CreateAssignmentForm';
import { SkillAlertsDialog } from '@/components/SkillAlertsDialog';
import { Button } from '@/components/ui/button';
import { toast } from "@/components/ui/use-toast"
import { Briefcase, Users, Bell } from 'lucide-react';
import { Assignment } from '@/types/assignment';
import { Consultant } from '@/types/consultant';
import { supabase } from '@/integrations/supabase/client';

const MatchWiseAI: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [matchingConsultants, setMatchingConsultants] = useState<Consultant[]>([]);
  const [isSkillAlertsOpen, setIsSkillAlertsOpen] = useState(false);

  useEffect(() => {
    loadAssignments();
    loadConsultants();
  }, []);

  const loadAssignments = async () => {
    try {
      const { data, error } = await supabase
        .from('assignments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading assignments:', error);
      } else {
        setAssignments(data || []);
      }
    } catch (error) {
      console.error('Error loading assignments:', error);
    }
  };

  const loadConsultants = async () => {
    try {
      const { data, error } = await supabase
        .from('consultants')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading consultants:', error);
      } else {
        setConsultants(data || []);
      }
    } catch (error) {
      console.error('Error loading consultants:', error);
    }
  };

  const handleCreateAssignment = (assignmentData: any) => {
    const newAssignment: Assignment = {
      id: Date.now(),
      ...assignmentData,
      status: 'open',
      createdAt: new Date().toISOString()
    };
    
    setAssignments([...assignments, newAssignment]);
    setShowCreateForm(false);
    
    toast({
      title: "Assignment created!",
      description: "The assignment has been added successfully.",
    });

    // Check for skill alerts
    checkSkillAlertsForAssignment(newAssignment);
  };

  const handleMatchAssignment = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    
    // Find consultants that match the assignment's required skills
    const matched = consultants.filter(consultant =>
      assignment.requiredSkills.every(skill => consultant.skills.includes(skill))
    );
    setMatchingConsultants(matched);
  };

  const checkSkillAlertsForAssignment = async (assignment: Assignment) => {
    try {
      const { data: skillAlerts, error: skillAlertsError } = await supabase
        .from('skill_alerts')
        .select('*')
        .eq('active', true)
        .contains('skills', assignment.requiredSkills);

      if (skillAlertsError) {
        console.error('Error fetching skill alerts:', skillAlertsError);
        return;
      }

      if (skillAlerts && skillAlerts.length > 0) {
        console.log('Skill alerts found:', skillAlerts);

        // Fetch consultants matching the assignment's skills
        const matchingConsultants = consultants.filter(consultant =>
          assignment.requiredSkills.every(skill => consultant.skills.includes(skill))
        );

        if (matchingConsultants.length > 0) {
          console.log('Matching consultants found:', matchingConsultants);

          // Send skill alert emails
          for (const alert of skillAlerts) {
            for (const consultant of matchingConsultants) {
              await sendSkillAlertEmail(consultant, assignment.requiredSkills, alert.email);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error checking skill alerts:', error);
    }
  };

  const sendSkillAlertEmail = async (consultant: Consultant, matchingSkills: string[], subscriberEmail: string) => {
    try {
      const resendApiKey = Deno.env.get('RESEND_API_KEY');
      if (!resendApiKey) {
        console.error('❌ RESEND_API_KEY not found');
        throw new Error('Resend API key not configured');
      }

      const response = await fetch('/api/send-skill-alert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          consultant,
          matchingSkills,
          subscriberEmail,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to send skill alert email:', errorData);
        throw new Error(`Failed to send skill alert email: ${response.status}`);
      }

      const result = await response.json();
      console.log('Skill alert email sent:', result);
    } catch (error) {
      console.error('Error sending skill alert email:', error);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">MatchWise AI Dashboard</h1>
        <div>
          <Button onClick={() => setIsSkillAlertsOpen(true)} className="mr-4">
            <Bell className="h-4 w-4 mr-2" />
            Skill Alerts
          </Button>
          <Button onClick={() => setShowCreateForm(true)}>
            <Briefcase className="h-4 w-4 mr-2" />
            Create Assignment
          </Button>
        </div>
      </div>

      {showCreateForm && (
        <CreateAssignmentForm
          onCreate={handleCreateAssignment}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      <AssignmentsSection
        assignments={assignments}
        onMatch={handleMatchAssignment}
        consultants={consultants}
      />

      <ConsultantsSection consultants={consultants} />

      <SkillAlertsDialog isOpen={isSkillAlertsOpen} onClose={() => setIsSkillAlertsOpen(false)} />
    </div>
  );
};

export default MatchWiseAI;
