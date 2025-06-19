
-- Remove all existing network consultants (type = 'new') from the database
-- This will keep the logic intact for new CV uploads but clean up existing unwanted data
DELETE FROM public.consultants 
WHERE type = 'new';
