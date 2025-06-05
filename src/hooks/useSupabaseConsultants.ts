
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Consultant } from '@/types/consultant';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const demoConsultants = [
  {
    name: 'Erik Andersson',
    email: 'erik.andersson@techconsult.se',
    skills: ['React', 'TypeScript', 'Node.js', 'AWS', 'GraphQL'],
    experience_years: 8,
    roles: ['Senior Full-Stack Developer', 'Tech Lead'],
    location: 'Stockholm',
    hourly_rate: 1200,
    availability: 'Available now',
    phone: '+46 70 123 4567',
    projects_completed: 25,
    rating: 4.8,
    certifications: ['AWS Certified Solutions Architect', 'React Developer Certification'],
    languages: ['Swedish', 'English', 'German'],
    type: 'existing',
    linkedin_url: 'https://linkedin.com/in/erik-andersson-dev',
    communication_style: 'Direct and collaborative',
    work_style: 'Agile and iterative',
    values: ['Innovation', 'Quality', 'Teamwork', 'Learning'],
    personality_traits: ['Analytical', 'Creative', 'Leadership-oriented', 'Tech-savvy'],
    team_fit: 'Excellent team player with strong mentoring abilities',
    cultural_fit: 5,
    adaptability: 4,
    leadership: 4
  },
  {
    name: 'Anna Lindqvist',
    email: 'anna.lindqvist@design.se',
    skills: ['React', 'Vue.js', 'UX/UI Design', 'Figma', 'CSS'],
    experience_years: 6,
    roles: ['Frontend Developer', 'UX Designer'],
    location: 'Göteborg',
    hourly_rate: 950,
    availability: 'Available from February',
    phone: '+46 70 234 5678',
    projects_completed: 18,
    rating: 4.9,
    certifications: ['Google UX Design Certificate', 'Vue.js Developer'],
    languages: ['Swedish', 'English'],
    type: 'existing',
    linkedin_url: 'https://linkedin.com/in/anna-lindqvist-ux',
    communication_style: 'Empathetic and detail-oriented',
    work_style: 'User-centered and iterative',
    values: ['User experience', 'Accessibility', 'Creativity', 'Quality'],
    personality_traits: ['Empathetic', 'Detail-focused', 'Creative', 'User-oriented'],
    team_fit: 'Strong collaborator focused on user experience',
    cultural_fit: 5,
    adaptability: 4,
    leadership: 3
  },
  {
    name: 'Marcus Johansson',
    email: 'marcus.johansson@backend.se',
    skills: ['Python', 'Django', 'PostgreSQL', 'Docker', 'Kubernetes'],
    experience_years: 10,
    roles: ['Senior Backend Developer', 'DevOps Engineer'],
    location: 'Malmö',
    hourly_rate: 1350,
    availability: 'Available now',
    phone: '+46 70 345 6789',
    projects_completed: 35,
    rating: 4.7,
    certifications: ['AWS DevOps Professional', 'Kubernetes Administrator'],
    languages: ['Swedish', 'English', 'Danish'],
    type: 'existing',
    linkedin_url: 'https://linkedin.com/in/marcus-johansson-devops',
    communication_style: 'Strategic and technical',
    work_style: 'Systematic and scalable',
    values: ['Reliability', 'Performance', 'Security', 'Innovation'],
    personality_traits: ['Systematic', 'Problem-solver', 'Strategic', 'Technical'],
    team_fit: 'Backend specialist with strong architecture skills',
    cultural_fit: 4,
    adaptability: 5,
    leadership: 5
  },
  {
    name: 'Sarah Wilson',
    email: 'sarah.wilson@network.com',
    skills: ['Angular', 'TypeScript', 'RxJS', 'NgRx', 'Jest'],
    experience_years: 5,
    roles: ['Frontend Developer', 'Angular Specialist'],
    location: 'Remote (EU)',
    hourly_rate: 850,
    availability: 'Available now',
    phone: '+44 20 7946 0958',
    projects_completed: 12,
    rating: 4.6,
    certifications: ['Angular Certified Developer'],
    languages: ['English', 'French'],
    type: 'new',
    linkedin_url: 'https://linkedin.com/in/sarah-wilson-angular',
    communication_style: 'Clear and methodical',
    work_style: 'Test-driven and structured',
    values: ['Code quality', 'Testing', 'Documentation', 'Continuous learning'],
    personality_traits: ['Methodical', 'Detail-oriented', 'Reliable', 'Growth-minded'],
    team_fit: 'Reliable team member with strong technical discipline',
    cultural_fit: 4,
    adaptability: 4,
    leadership: 3
  },
  {
    name: 'David Chen',
    email: 'david.chen@fullstack.com',
    skills: ['React', 'Node.js', 'MongoDB', 'Express', 'JavaScript'],
    experience_years: 7,
    roles: ['Full-Stack Developer', 'MERN Specialist'],
    location: 'Remote (Global)',
    hourly_rate: 900,
    availability: 'Available from March',
    phone: '+1 555 123 4567',
    projects_completed: 22,
    rating: 4.5,
    certifications: ['MongoDB Developer', 'Node.js Certification'],
    languages: ['English', 'Mandarin', 'Swedish'],
    type: 'new',
    linkedin_url: 'https://linkedin.com/in/david-chen-mern',
    communication_style: 'Collaborative and adaptive',
    work_style: 'Full-stack and versatile',
    values: ['Collaboration', 'Adaptability', 'Efficiency', 'Innovation'],
    personality_traits: ['Versatile', 'Collaborative', 'Adaptive', 'Solution-oriented'],
    team_fit: 'Flexible team player with broad technical skills',
    cultural_fit: 4,
    adaptability: 5,
    leadership: 3
  }
];

export const useSupabaseConsultants = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const consultantsQuery = useQuery({
    queryKey: ['consultants'],
    queryFn: async (): Promise<Consultant[]> => {
      console.log('Fetching consultants from database...');
      
      try {
        let { data, error } = await supabase
          .from('consultants')
          .select('*')
          .order('name');

        if (error) {
          console.error('Error fetching consultants:', error);
          // Instead of throwing, let's return demo data
          console.log('Using demo data instead...');
          return demoConsultants.map((consultant: any) => ({
            id: consultant.name.replace(' ', '').toLowerCase(),
            name: consultant.name,
            skills: consultant.skills || [],
            experience: `${consultant.experience_years || 0} years experience`,
            roles: consultant.roles || [],
            location: consultant.location || 'Stockholm',
            rate: `${consultant.hourly_rate || 0} SEK/h`,
            availability: consultant.availability || 'Available',
            phone: consultant.phone || '',
            email: consultant.email,
            projects: consultant.projects_completed || 0,
            rating: consultant.rating || 5.0,
            lastActive: 'Today',
            cv: '',
            certifications: consultant.certifications || [],
            languages: consultant.languages || [],
            type: consultant.type as 'existing' | 'new',
            linkedinUrl: consultant.linkedin_url || '',
            communicationStyle: consultant.communication_style || '',
            workStyle: consultant.work_style || '',
            values: consultant.values || [],
            personalityTraits: consultant.personality_traits || [],
            teamFit: consultant.team_fit || '',
            culturalFit: consultant.cultural_fit || 5,
            adaptability: consultant.adaptability || 5,
            leadership: consultant.leadership || 3,
          }));
        }

        console.log('Database query successful, data length:', data?.length || 0);

        // If no consultants exist, try to add demo data
        if (!data || data.length === 0) {
          console.log('No consultants found, attempting to add demo data...');
          
          // Try to insert demo data one by one and handle errors gracefully
          for (const consultant of demoConsultants) {
            try {
              const { error: insertError } = await supabase
                .from('consultants')
                .insert([consultant]);
              
              if (insertError) {
                console.warn('Could not insert demo consultant:', consultant.name, insertError.message);
              } else {
                console.log('Successfully inserted:', consultant.name);
              }
            } catch (err) {
              console.warn('Error adding demo consultant:', consultant.name, err);
            }
          }

          // Try to fetch again after adding demo data
          const { data: newData, error: newError } = await supabase
            .from('consultants')
            .select('*')
            .order('name');

          if (newError || !newData || newData.length === 0) {
            console.log('Could not fetch from database, using demo data...');
            // Return demo data as fallback
            return demoConsultants.map((consultant: any) => ({
              id: consultant.name.replace(' ', '').toLowerCase(),
              name: consultant.name,
              skills: consultant.skills || [],
              experience: `${consultant.experience_years || 0} years experience`,
              roles: consultant.roles || [],
              location: consultant.location || 'Stockholm',
              rate: `${consultant.hourly_rate || 0} SEK/h`,
              availability: consultant.availability || 'Available',
              phone: consultant.phone || '',
              email: consultant.email,
              projects: consultant.projects_completed || 0,
              rating: consultant.rating || 5.0,
              lastActive: 'Today',
              cv: '',
              certifications: consultant.certifications || [],
              languages: consultant.languages || [],
              type: consultant.type as 'existing' | 'new',
              linkedinUrl: consultant.linkedin_url || '',
              communicationStyle: consultant.communication_style || '',
              workStyle: consultant.work_style || '',
              values: consultant.values || [],
              personalityTraits: consultant.personality_traits || [],
              teamFit: consultant.team_fit || '',
              culturalFit: consultant.cultural_fit || 5,
              adaptability: consultant.adaptability || 5,
              leadership: consultant.leadership || 3,
            }));
          }

          data = newData;
        }

        return data.map((consultant: any) => ({
          id: consultant.id,
          name: consultant.name,
          skills: consultant.skills || [],
          experience: `${consultant.experience_years || 0} years experience`,
          roles: consultant.roles || [],
          location: consultant.location || 'Stockholm',
          rate: `${consultant.hourly_rate || 0} SEK/h`,
          availability: consultant.availability || 'Available',
          phone: consultant.phone || '',
          email: consultant.email,
          projects: consultant.projects_completed || 0,
          rating: consultant.rating || 5.0,
          lastActive: consultant.last_active || 'Today',
          cv: consultant.cv_file_path || '',
          certifications: consultant.certifications || [],
          languages: consultant.languages || [],
          type: consultant.type as 'existing' | 'new',
          linkedinUrl: consultant.linkedin_url || '',
          communicationStyle: consultant.communication_style || '',
          workStyle: consultant.work_style || '',
          values: consultant.values || [],
          personalityTraits: consultant.personality_traits || [],
          teamFit: consultant.team_fit || '',
          culturalFit: consultant.cultural_fit || 5,
          adaptability: consultant.adaptability || 5,
          leadership: consultant.leadership || 3,
        }));
      } catch (error) {
        console.error('Unexpected error in consultants query:', error);
        // Return demo data as final fallback
        return demoConsultants.map((consultant: any) => ({
          id: consultant.name.replace(' ', '').toLowerCase(),
          name: consultant.name,
          skills: consultant.skills || [],
          experience: `${consultant.experience_years || 0} years experience`,
          roles: consultant.roles || [],
          location: consultant.location || 'Stockholm',
          rate: `${consultant.hourly_rate || 0} SEK/h`,
          availability: consultant.availability || 'Available',
          phone: consultant.phone || '',
          email: consultant.email,
          projects: consultant.projects_completed || 0,
          rating: consultant.rating || 5.0,
          lastActive: 'Today',
          cv: '',
          certifications: consultant.certifications || [],
          languages: consultant.languages || [],
          type: consultant.type as 'existing' | 'new',
          linkedinUrl: consultant.linkedin_url || '',
          communicationStyle: consultant.communication_style || '',
          workStyle: consultant.work_style || '',
          values: consultant.values || [],
          personalityTraits: consultant.personality_traits || [],
          teamFit: consultant.team_fit || '',
          culturalFit: consultant.cultural_fit || 5,
          adaptability: consultant.adaptability || 5,
          leadership: consultant.leadership || 3,
        }));
      }
    },
  });

  const createConsultantMutation = useMutation({
    mutationFn: async (consultantData: Partial<Consultant>) => {
      const experienceYears = consultantData.experience 
        ? parseInt(consultantData.experience.split(' ')[0]) || 0 
        : 0;
      
      const hourlyRate = consultantData.rate 
        ? parseInt(consultantData.rate.split(' ')[0]) || 0 
        : 0;

      const { data, error } = await supabase
        .from('consultants')
        .insert([{
          name: consultantData.name,
          email: consultantData.email,
          skills: consultantData.skills || [],
          experience_years: experienceYears,
          roles: consultantData.roles || [],
          location: consultantData.location,
          hourly_rate: hourlyRate,
          availability: consultantData.availability,
          phone: consultantData.phone,
          projects_completed: consultantData.projects || 0,
          rating: consultantData.rating || 5.0,
          certifications: consultantData.certifications || [],
          languages: consultantData.languages || [],
          type: consultantData.type || 'new',
          linkedin_url: consultantData.linkedinUrl,
          communication_style: consultantData.communicationStyle,
          work_style: consultantData.workStyle,
          values: consultantData.values || [],
          personality_traits: consultantData.personalityTraits || [],
          team_fit: consultantData.teamFit,
          cultural_fit: consultantData.culturalFit || 5,
          adaptability: consultantData.adaptability || 5,
          leadership: consultantData.leadership || 3,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consultants'] });
      toast.success('Consultant added!');
    },
    onError: (error) => {
      console.error('Error creating consultant:', error);
      toast.error('Could not add consultant');
    },
  });

  const updateConsultantMutation = useMutation({
    mutationFn: async (consultantData: Consultant) => {
      const experienceYears = consultantData.experience 
        ? parseInt(consultantData.experience.split(' ')[0]) || 0 
        : 0;
      
      const hourlyRate = consultantData.rate 
        ? parseInt(consultantData.rate.split(' ')[0]) || 0 
        : 0;

      const { data, error } = await supabase
        .from('consultants')
        .update({
          name: consultantData.name,
          email: consultantData.email,
          skills: consultantData.skills,
          experience_years: experienceYears,
          roles: consultantData.roles,
          location: consultantData.location,
          hourly_rate: hourlyRate,
          availability: consultantData.availability,
          phone: consultantData.phone,
          projects_completed: consultantData.projects,
          rating: consultantData.rating,
          certifications: consultantData.certifications,
          languages: consultantData.languages,
          linkedin_url: consultantData.linkedinUrl,
          communication_style: consultantData.communicationStyle,
          work_style: consultantData.workStyle,
          values: consultantData.values,
          personality_traits: consultantData.personalityTraits,
          team_fit: consultantData.teamFit,
          cultural_fit: consultantData.culturalFit,
          adaptability: consultantData.adaptability,
          leadership: consultantData.leadership,
        })
        .eq('id', consultantData.id.toString())
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consultants'] });
      toast.success('Consultant updated!');
    },
    onError: (error) => {
      console.error('Error updating consultant:', error);
      toast.error('Could not update consultant');
    },
  });

  return {
    consultants: consultantsQuery.data || [],
    isLoading: consultantsQuery.isLoading,
    error: consultantsQuery.error,
    createConsultant: createConsultantMutation.mutate,
    updateConsultant: updateConsultantMutation.mutate,
    isCreating: createConsultantMutation.isPending,
    isUpdating: updateConsultantMutation.isPending,
  };
};
