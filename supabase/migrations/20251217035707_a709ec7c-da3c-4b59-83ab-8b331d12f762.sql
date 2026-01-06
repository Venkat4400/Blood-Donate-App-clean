-- Add unique constraint for donor_matches upsert
ALTER TABLE public.donor_matches 
ADD CONSTRAINT donor_matches_request_donor_unique UNIQUE (request_id, donor_id);

-- Add RLS policy to allow service role to insert matches
CREATE POLICY "Service role can manage donor matches"
ON public.donor_matches
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);