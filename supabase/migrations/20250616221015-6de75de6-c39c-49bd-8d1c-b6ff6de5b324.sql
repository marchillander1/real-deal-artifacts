
-- Add user_id column to consultants table to link consultants to specific users
ALTER TABLE public.consultants 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update existing consultants: set user_id to NULL for network consultants (type = 'new')
-- and assign a dummy user_id for existing consultants (type = 'existing') 
UPDATE public.consultants 
SET user_id = NULL 
WHERE type = 'new';

-- Create RLS policies for consultants table
DROP POLICY IF EXISTS "Public can insert new consultants" ON public.consultants;
DROP POLICY IF EXISTS "Public can read consultants" ON public.consultants;

-- Network consultants (user_id IS NULL) are visible to everyone
CREATE POLICY "Everyone can read network consultants" 
ON public.consultants 
FOR SELECT 
TO public
USING (user_id IS NULL);

-- Users can only see their own consultants when user_id is not null
CREATE POLICY "Users can read their own consultants" 
ON public.consultants 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

-- Users can insert network consultants (user_id = NULL) 
CREATE POLICY "Public can insert network consultants" 
ON public.consultants 
FOR INSERT 
TO public
WITH CHECK (user_id IS NULL);

-- Users can insert their own consultants
CREATE POLICY "Users can insert their own consultants" 
ON public.consultants 
FOR INSERT 
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Users can update their own consultants
CREATE POLICY "Users can update their own consultants" 
ON public.consultants 
FOR UPDATE 
TO authenticated
USING (user_id = auth.uid());

-- Users can delete their own consultants
CREATE POLICY "Users can delete their own consultants" 
ON public.consultants 
FOR DELETE 
TO authenticated
USING (user_id = auth.uid());
