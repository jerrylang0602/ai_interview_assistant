
-- Enable Row Level Security on interview_results table (if not already enabled)
ALTER TABLE public.interview_results ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow public read access to interview results
CREATE POLICY "Allow public read access to interview results" 
  ON public.interview_results 
  FOR SELECT 
  USING (true);

-- Create a policy to allow public insert access to interview results
CREATE POLICY "Allow public insert access to interview results" 
  ON public.interview_results 
  FOR INSERT 
  WITH CHECK (true);

-- Create a policy to allow public update access to interview results
CREATE POLICY "Allow public update access to interview results" 
  ON public.interview_results 
  FOR UPDATE 
  USING (true);

-- Create a policy to allow public delete access to interview results
CREATE POLICY "Allow public delete access to interview results" 
  ON public.interview_results 
  FOR DELETE 
  USING (true);
