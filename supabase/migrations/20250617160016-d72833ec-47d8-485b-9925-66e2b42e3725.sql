
-- Remove all network consultants (where user_id IS NULL)
DELETE FROM public.consultants WHERE user_id IS NULL;
