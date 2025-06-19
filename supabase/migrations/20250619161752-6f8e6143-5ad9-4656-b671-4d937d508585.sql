
DELETE FROM public.consultants 
WHERE LOWER(name) LIKE '%john doe%'
   OR LOWER(name) LIKE '%analysis in progress%'
   OR LOWER(name) LIKE '%not specified%'
   OR LOWER(name) LIKE '%mt ns%'
   OR LOWER(name) LIKE '%subtype image%'
   OR name = 'John Doe'
   OR name = 'Analysis in progress'
   OR name = 'Not specified'
   OR name = 'Mt Ns'
   OR name = 'Subtype image'
   OR name ILIKE 'John Doe%'
   OR name ILIKE '%Analysis in progress%'
   OR name ILIKE '%Not specified%'
   OR name ILIKE '%Mt Ns%'
   OR name ILIKE '%Subtype image%';
