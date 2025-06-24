import React, { useState, useEffect } from 'react';
import { AssignmentsSection } from '@/components/dashboard/AssignmentsSection';
import { ConsultantsSection } from '@/components/dashboard/ConsultantsSection';
import { SkillAlertsDialog } from '@/components/SkillAlertsDialog';
import { Button } from '@/components/ui/button';
import { toast } from "@/components/ui/use-toast"
import { Bell } from 'lucide-react';
import { Assignment } from '@/types/assignment';
import { Consultant } from '@/types/consultant';
import { supabase } from '@/integrations/supabase/client';

const MatchWiseAI: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [consultants, setConsultants] = useState<Consultant[]>([]);
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
        // Transform the data to match Assignment interface
        const transformedAssignments: Assignment[] = (data || []).map(item => ({
          id: item.id,
          title: item.title,
          description: item.description,
          company: item.company,
          clientLogo: item.client_logo || '🏢',
          requiredSkills: item.required_skills || [],
          location: item.remote_type || 'Remote',
          duration: item.duration || '',
          budget: `${item.budget_min || 0}-${item.budget_max || 0} ${item.budget_currency || 'SEK'}`,
          teamSize: item.team_size || '',
          urgency: (item.urgency || 'Medium') as "High" | "Medium" | "Low",
          remote: item.remote_type || 'Remote',
          teamCulture: item.team_culture || '',
          status: (item.status || 'open') as "open" | "in_progress" | "completed" | "cancelled",
          createdAt: item.created_at,
          workload: item.workload || 'Full-time',
          hourlyRate: item.budget_min || 0,
          matchedConsultants: 0,
          industry: item.industry || 'Technology'
        }));
        setAssignments(transformedAssignments);
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
        // Transform the data to match Consultant interface
        const transformedConsultants: Consultant[] = (data || []).map(item => ({
          id: item.id,
          name: item.name,
          email: item.email,
          phone: item.phone || '',
          title: item.title || '',
          location: item.location || '',
          availability: item.availability || 'Available',
          experience: `${item.experience_years || 0} years`,
          skills: item.skills || [],
          certifications: item.certifications || [],
          languages: item.languages || [],
          rate: `${item.hourly_rate || 0} SEK/h`,
          projects: item.projects_completed || 0,
          rating: item.rating || 5,
          lastActive: item.last_active || 'Today',
          type: item.type === 'existing' ? 'my' : (item.type === 'new' ? 'network' : (item.type as 'my' | 'network' | 'existing' | 'new')),
          roles: item.roles || [],
          values: item.values || [],
          communicationStyle: item.communication_style || '',
          workStyle: item.work_style || '',
          personalityTraits: item.personality_traits || [],
          teamFit: item.team_fit || '',
          culturalFit: item.cultural_fit || 5,
          adaptability: item.adaptability || 5,
          leadership: item.leadership || 3
        }));
        setConsultants(transformedConsultants);
      }
    } catch (error) {
      console.error('Error loading consultants:', error);
    }
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
      const { data, error } = await supabase.functions.invoke('send-skill-alert', {
        body: {
          consultant,
          matchingSkills,
          subscriberEmail,
        },
      });

      if (error) {
        console.error('Failed to send skill alert email:', error);
        throw new Error(`Failed to send skill alert email: ${error.message}`);
      }

      console.log('Skill alert email sent:', data);
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
        </div>
      </div>

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
