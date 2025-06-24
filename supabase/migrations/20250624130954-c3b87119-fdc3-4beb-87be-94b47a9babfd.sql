
-- Allow anonymous users to insert into user_profiles table
-- This is needed for the CV upload flow where users aren't authenticated yet
CREATE POLICY "Allow anonymous profile creation" 
  ON public.user_profiles 
  FOR INSERT 
  TO anon
  WITH CHECK (true);

-- Allow public read access to published profiles
CREATE POLICY "Allow public read of user_profiles" 
  ON public.user_profiles 
  FOR SELECT 
  TO anon, authenticated
  USING (true);

-- Enable RLS on user_profiles if not already enabled
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert into ai_analysis table
CREATE POLICY "Allow anonymous ai_analysis creation" 
  ON public.ai_analysis 
  FOR INSERT 
  TO anon
  WITH CHECK (true);

-- Allow anonymous users to insert into published_profiles table  
CREATE POLICY "Allow anonymous published_profiles creation" 
  ON public.published_profiles 
  FOR INSERT 
  TO anon
  WITH CHECK (true);

-- Enable RLS on these tables if not already enabled
ALTER TABLE public.ai_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.published_profiles ENABLE ROW LEVEL SECURITY;
