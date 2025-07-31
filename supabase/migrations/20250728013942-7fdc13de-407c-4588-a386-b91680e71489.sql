-- Allow public read access to candidates table for interview process
CREATE POLICY "Allow public read access to candidates" 
ON public.candidates 
FOR SELECT 
USING (true);

-- Keep the existing admin policy for all other operations
-- This ensures admins can still manage candidates while allowing public read access