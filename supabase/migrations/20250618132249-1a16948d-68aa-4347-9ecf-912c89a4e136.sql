
-- Remove the old answers and questions fields from interview_results table
-- and ensure detailed_result column exists for the new structure
ALTER TABLE public.interview_results 
DROP COLUMN IF EXISTS answers,
DROP COLUMN IF EXISTS questions;

-- Ensure detailed_result column exists (it should already exist based on the schema)
-- This is just to be safe
ALTER TABLE public.interview_results 
ADD COLUMN IF NOT EXISTS detailed_result jsonb;
