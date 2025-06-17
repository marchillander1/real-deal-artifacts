
-- Ta bort alla network consultants (där user_id är NULL)
DELETE FROM public.consultants WHERE user_id IS NULL;
