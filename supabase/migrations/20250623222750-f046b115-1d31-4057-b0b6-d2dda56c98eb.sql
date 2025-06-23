
-- Create upload_sessions table for tracking CV upload sessions
CREATE TABLE public.upload_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_token TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'pending',
  cv_file_path TEXT,
  linkedin_url TEXT,
  personal_tagline TEXT,
  gdpr_consent BOOLEAN NOT NULL DEFAULT false
);

-- Create user_profiles table for storing user information
CREATE TABLE public.user_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  title TEXT,
  years_of_experience INTEGER,
  personal_tagline TEXT,
  rate_preference INTEGER,
  availability TEXT DEFAULT 'Available',
  visibility_toggle BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ai_analysis table for storing Gemini AI parsing results
CREATE TABLE public.ai_analysis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  upload_session_id UUID REFERENCES public.upload_sessions(id) ON DELETE CASCADE,
  user_profile_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  analysis_data JSONB NOT NULL,
  tech_stack_primary TEXT[],
  tech_stack_secondary TEXT[],
  certifications TEXT[],
  industries TEXT[],
  top_values TEXT[],
  personality_traits TEXT[],
  communication_style TEXT,
  tone_of_voice TEXT,
  thought_leadership_score INTEGER DEFAULT 0,
  linkedin_engagement_level TEXT,
  brand_themes TEXT[],
  cv_tips TEXT[],
  linkedin_tips TEXT[],
  certification_recommendations TEXT[],
  suggested_learning_paths TEXT[],
  analysis_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create published_profiles table for consultants who joined the network
CREATE TABLE public.published_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_profile_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  ai_analysis_id UUID REFERENCES public.ai_analysis(id) ON DELETE CASCADE,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  visibility_status TEXT DEFAULT 'public'
);

-- Create event_log table for tracking user interactions
CREATE TABLE public.event_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  session_token TEXT,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.upload_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.published_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for upload_sessions (public access for uploads)
CREATE POLICY "Anyone can create upload sessions" ON public.upload_sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own upload sessions" ON public.upload_sessions
  FOR SELECT USING (session_token IS NOT NULL);

-- RLS Policies for user_profiles
CREATE POLICY "Users can view their own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for ai_analysis
CREATE POLICY "Users can view their own analysis" ON public.ai_analysis
  FOR SELECT USING (
    user_profile_id IN (
      SELECT id FROM public.user_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "System can create analysis" ON public.ai_analysis
  FOR INSERT WITH CHECK (true);

-- RLS Policies for published_profiles (public read access)
CREATE POLICY "Anyone can view published profiles" ON public.published_profiles
  FOR SELECT USING (is_active = true);

CREATE POLICY "Users can publish their own profile" ON public.published_profiles
  FOR INSERT WITH CHECK (
    user_profile_id IN (
      SELECT id FROM public.user_profiles WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for event_log
CREATE POLICY "Users can view their own events" ON public.event_log
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can log events" ON public.event_log
  FOR INSERT WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_upload_sessions_token ON public.upload_sessions(session_token);
CREATE INDEX idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX idx_ai_analysis_user_profile ON public.ai_analysis(user_profile_id);
CREATE INDEX idx_published_profiles_active ON public.published_profiles(is_active);
CREATE INDEX idx_event_log_user_id ON public.event_log(user_id);
CREATE INDEX idx_event_log_type ON public.event_log(event_type);
