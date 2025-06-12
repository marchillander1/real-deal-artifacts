
-- Create RLS policy to allow public inserts for new consultant applications
CREATE POLICY "Allow public consultant applications" 
ON public.consultants 
FOR INSERT 
WITH CHECK (type = 'new');

-- Create RLS policy to allow public read access for consultant data
CREATE POLICY "Allow public read access to consultants" 
ON public.consultants 
FOR SELECT 
TO public;

-- Enable RLS if not already enabled
ALTER TABLE public.consultants ENABLE ROW LEVEL SECURITY;
