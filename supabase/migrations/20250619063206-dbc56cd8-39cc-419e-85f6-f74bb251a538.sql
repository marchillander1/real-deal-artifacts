
-- Remove all network consultants (type = 'new') from the database
DELETE FROM public.consultants 
WHERE type = 'new';
