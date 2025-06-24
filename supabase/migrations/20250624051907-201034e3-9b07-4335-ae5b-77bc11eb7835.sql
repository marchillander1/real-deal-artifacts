
-- Update upload_sessions table to match prompt specifications
ALTER TABLE public.upload_sessions 
ADD COLUMN IF NOT EXISTS personal_description TEXT;

-- Update consultants table to ensure all required fields from prompt exist
ALTER TABLE public.consultants 
ADD COLUMN IF NOT EXISTS fallback_flags JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS market_rate_current INTEGER,
ADD COLUMN IF NOT EXISTS market_rate_optimized INTEGER;

-- Update ai_analysis table to store the standardized JSON output from prompt
ALTER TABLE public.ai_analysis 
ADD COLUMN IF NOT EXISTS fallback_flags JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS analysis_complete BOOLEAN DEFAULT false;

-- Ensure published_profiles table exists with correct structure
CREATE TABLE IF NOT EXISTS public.published_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_profile_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  ai_analysis_id UUID REFERENCES public.ai_analysis(id) ON DELETE CASCADE,
  consultant_id UUID REFERENCES public.consultants(id) ON DELETE CASCADE,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  visibility_status TEXT DEFAULT 'public'
);

-- Add index for better performance on published profiles
CREATE INDEX IF NOT EXISTS idx_published_profiles_active ON public.published_profiles(is_active);
CREATE INDEX IF NOT EXISTS idx_published_profiles_user ON public.published_profiles(user_profile_id);
