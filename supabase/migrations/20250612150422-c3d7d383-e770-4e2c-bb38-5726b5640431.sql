
-- First, let's check what policies exist and drop them all
DROP POLICY IF EXISTS "Allow public consultant applications" ON public.consultants;
DROP POLICY IF EXISTS "Allow public read access to consultants" ON public.consultants;

-- Create a very permissive policy for INSERT that allows ALL public inserts
CREATE POLICY "Public can insert new consultants" 
ON public.consultants 
FOR INSERT 
TO public
WITH CHECK (true);

-- Create a very permissive policy for SELECT that allows ALL public reads
CREATE POLICY "Public can read consultants" 
ON public.consultants 
FOR SELECT 
TO public
USING (true);

-- Make sure RLS is enabled
ALTER TABLE public.consultants ENABLE ROW LEVEL SECURITY;
