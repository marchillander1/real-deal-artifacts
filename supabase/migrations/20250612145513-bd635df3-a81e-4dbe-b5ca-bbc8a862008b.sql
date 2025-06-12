
-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Allow public consultant applications" ON public.consultants;
DROP POLICY IF EXISTS "Allow public read access to consultants" ON public.consultants;

-- Create RLS policy to allow public inserts for new consultant applications
CREATE POLICY "Allow public consultant applications" 
ON public.consultants 
FOR INSERT 
TO public
WITH CHECK (type = 'new');

-- Create RLS policy to allow public read access for consultant data
CREATE POLICY "Allow public read access to consultants" 
ON public.consultants 
FOR SELECT 
TO public;

-- Ensure RLS is enabled
ALTER TABLE public.consultants ENABLE ROW LEVEL SECURITY;
