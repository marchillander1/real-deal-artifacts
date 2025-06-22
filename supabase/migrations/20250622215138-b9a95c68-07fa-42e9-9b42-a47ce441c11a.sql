
-- Add company_id to consultants table to link them to teams (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'consultants' AND column_name = 'company_id') THEN
        ALTER TABLE public.consultants ADD COLUMN company_id text;
    END IF;
END $$;

-- Create index for better performance when filtering by company (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_consultants_company_id') THEN
        CREATE INDEX idx_consultants_company_id ON public.consultants(company_id);
    END IF;
END $$;

-- Update existing consultants to use user's company from profiles
UPDATE public.consultants 
SET company_id = (
  SELECT p.company 
  FROM public.profiles p 
  WHERE p.id = consultants.user_id
)
WHERE user_id IS NOT NULL AND company_id IS NULL;

-- Enable real-time for notifications
ALTER TABLE public.consultants REPLICA IDENTITY FULL;
ALTER TABLE public.assignments REPLICA IDENTITY FULL;

-- Add consultants and assignments to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.consultants;
ALTER PUBLICATION supabase_realtime ADD TABLE public.assignments;

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Users can view team consultants" ON public.consultants;
DROP POLICY IF EXISTS "Users can insert consultants to their team" ON public.consultants;
DROP POLICY IF EXISTS "Users can update their own consultants" ON public.consultants;
DROP POLICY IF EXISTS "Users can delete their own consultants" ON public.consultants;

-- Create RLS policies for team sharing
CREATE POLICY "Users can view team consultants" 
  ON public.consultants 
  FOR SELECT 
  USING (
    -- Own consultants
    auth.uid() = user_id 
    OR 
    -- Team consultants (same company)
    company_id IN (
      SELECT company 
      FROM public.profiles 
      WHERE id = auth.uid() AND company IS NOT NULL AND company != ''
    )
    OR
    -- Network consultants (no user_id)
    user_id IS NULL
  );

CREATE POLICY "Users can insert consultants to their team" 
  ON public.consultants 
  FOR INSERT 
  WITH CHECK (
    auth.uid() = user_id 
    AND 
    company_id IN (
      SELECT company 
      FROM public.profiles 
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own consultants" 
  ON public.consultants 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own consultants" 
  ON public.consultants 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Enable RLS on consultants table
ALTER TABLE public.consultants ENABLE ROW LEVEL SECURITY;
