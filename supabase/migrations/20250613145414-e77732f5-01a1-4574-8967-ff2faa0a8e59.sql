
-- Safe migration: Update interview_results table to use zoho_id with data cleanup

-- Step 1: Add the new zoho_id column (if it doesn't exist already)
ALTER TABLE public.interview_results 
ADD COLUMN IF NOT EXISTS zoho_id text;

-- Step 2: Check and clean up orphaned records
-- First, let's see what zoho_id values in interview_results don't have matching candidates
-- We'll set these to NULL temporarily to avoid constraint violations
UPDATE public.interview_results 
SET zoho_id = NULL 
WHERE zoho_id IS NOT NULL 
AND zoho_id NOT IN (SELECT zoho_id FROM public.candidates WHERE zoho_id IS NOT NULL);

-- Step 3: For valid records, migrate data from candidate_id to zoho_id if needed
-- (Skip if zoho_id is already populated correctly)
UPDATE public.interview_results 
SET zoho_id = candidate_id 
WHERE candidate_id IS NOT NULL 
AND zoho_id IS NULL
AND candidate_id IN (SELECT zoho_id FROM public.candidates WHERE zoho_id IS NOT NULL);

-- Step 4: Now we can safely add the foreign key constraint
-- But first, let's make the column nullable to handle orphaned records
ALTER TABLE public.interview_results 
ADD CONSTRAINT fk_interview_results_zoho_id 
FOREIGN KEY (zoho_id) REFERENCES public.candidates(zoho_id) 
ON DELETE SET NULL;

-- Step 5: Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_interview_results_zoho_id 
ON public.interview_results(zoho_id);

-- Step 6: Drop the old candidate_id column
ALTER TABLE public.interview_results 
DROP COLUMN IF EXISTS candidate_id;

-- Step 7: Add comment to document the relationship
COMMENT ON COLUMN public.interview_results.zoho_id IS 'Foreign key reference to candidates.zoho_id for linking interview results with candidate data. Can be NULL for orphaned records.';
