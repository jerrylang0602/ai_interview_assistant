
-- Create the candidate_interview_result table
CREATE TABLE IF NOT EXISTS public.candidate_interview_result (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  position TEXT NOT NULL,
  date DATE NOT NULL,
  score INTEGER NOT NULL,
  status TEXT NOT NULL,
  ai_detection BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert sample candidate interview results
INSERT INTO public.candidate_interview_result (name, email, position, date, score, status, ai_detection) VALUES
('Alex Johnson', 'alex.johnson@example.com', 'Frontend Developer', '2023-06-15', 87, 'Passed', false),
('Sam Williams', 'sam.williams@example.com', 'Backend Developer', '2023-06-18', 92, 'Passed', false);

-- Enable RLS (Row Level Security)
ALTER TABLE public.candidate_interview_result ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow read access to candidate interview results for everyone
CREATE POLICY "Allow public read access to candidate interview results" 
  ON public.candidate_interview_result 
  FOR SELECT 
  USING (true);

-- Create a policy to allow insert access for authenticated users
CREATE POLICY "Allow insert access to candidate interview results" 
  ON public.candidate_interview_result 
  FOR INSERT 
  WITH CHECK (true);
