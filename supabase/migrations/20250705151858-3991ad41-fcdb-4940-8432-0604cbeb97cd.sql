
-- Create table for consultant favorites
CREATE TABLE public.consultant_favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  consultant_id UUID REFERENCES public.consultants(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, consultant_id)
);

-- Create table for internal notes on consultants
CREATE TABLE public.consultant_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  consultant_id UUID REFERENCES public.consultants(id) ON DELETE CASCADE NOT NULL,
  note_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, consultant_id)
);

-- Enable RLS on both tables
ALTER TABLE public.consultant_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultant_notes ENABLE ROW LEVEL SECURITY;

-- RLS policies for consultant_favorites
CREATE POLICY "Users can view their own favorites" 
  ON public.consultant_favorites 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own favorites" 
  ON public.consultant_favorites 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" 
  ON public.consultant_favorites 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS policies for consultant_notes
CREATE POLICY "Users can view their own notes" 
  ON public.consultant_notes 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own notes" 
  ON public.consultant_notes 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes" 
  ON public.consultant_notes 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes" 
  ON public.consultant_notes 
  FOR DELETE 
  USING (auth.uid() = user_id);
