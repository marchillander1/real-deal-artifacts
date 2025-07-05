
-- Create a table for user management
CREATE TABLE public.user_management (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  full_name text NOT NULL,
  company text,
  role text NOT NULL DEFAULT 'user',
  status text NOT NULL DEFAULT 'active',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users NOT NULL,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_management ENABLE ROW LEVEL SECURITY;

-- Only admins can manage users
CREATE POLICY "Only admins can manage users" ON public.user_management
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Add admin role to profiles table if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE role = 'admin') THEN
    -- Update existing user to admin (replace with actual admin email)
    UPDATE public.profiles 
    SET role = 'admin' 
    WHERE email = 'admin@example.com';
  END IF;
END $$;
