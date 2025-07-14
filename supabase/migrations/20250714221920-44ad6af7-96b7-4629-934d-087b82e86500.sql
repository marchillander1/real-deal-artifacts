-- Add page access permissions to user_management table
ALTER TABLE public.user_management 
ADD COLUMN access_matchwiseai boolean DEFAULT false,
ADD COLUMN access_talent_activation boolean DEFAULT false;

-- Update existing users to have access to matchwiseai by default
UPDATE public.user_management 
SET access_matchwiseai = true 
WHERE access_matchwiseai IS NULL;