
-- Create skill_alerts table for email notifications
CREATE TABLE public.skill_alerts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  skills text[] NOT NULL DEFAULT '{}',
  email text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on skill_alerts
ALTER TABLE public.skill_alerts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for skill_alerts
CREATE POLICY "Users can view their own alerts" 
  ON public.skill_alerts 
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own alerts" 
  ON public.skill_alerts 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own alerts" 
  ON public.skill_alerts 
  FOR UPDATE 
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own alerts" 
  ON public.skill_alerts 
  FOR DELETE 
  USING (user_id = auth.uid());

-- Create function to handle assignment creation and skill alert triggers
CREATE OR REPLACE FUNCTION public.check_skill_alerts_for_new_assignment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- This will be handled by the edge function instead
  -- Just log the event for now
  INSERT INTO public.analytics_events (event_type, event_data)
  VALUES ('assignment_created', jsonb_build_object('assignment_id', NEW.id));
  
  RETURN NEW;
END;
$$;

-- Create trigger for new assignments
CREATE TRIGGER on_assignment_created
  AFTER INSERT ON public.assignments
  FOR EACH ROW EXECUTE FUNCTION public.check_skill_alerts_for_new_assignment();

-- Add indexes for better performance
CREATE INDEX idx_skill_alerts_user_active ON public.skill_alerts(user_id, active);
CREATE INDEX idx_skill_alerts_skills ON public.skill_alerts USING GIN(skills);
CREATE INDEX idx_assignments_required_skills ON public.assignments USING GIN(required_skills);
CREATE INDEX idx_consultants_skills ON public.consultants USING GIN(skills);
