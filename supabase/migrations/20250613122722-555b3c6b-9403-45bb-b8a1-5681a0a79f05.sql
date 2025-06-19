
-- Create the interview_questions table with the correct structure
CREATE TABLE IF NOT EXISTS public.interview_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  category TEXT,
  difficulty TEXT,
  type TEXT,
  section TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert sample interview questions
INSERT INTO public.interview_questions (question, category, difficulty, type, section) VALUES
('Describe your process for migrating an on-premises Exchange server to Exchange Online. What tools do you typically use for migration, and why?', 'Office 365 Migration', 'Medium', 'Technical', 'Technical Competencies'),
('Explain how you set up and manage Azure Active Directory (AAD). What key elements do you focus on during initial deployment?', 'Azure Administration', 'Hard', 'Technical', 'Technical Competencies'),
('How do you deploy applications using Microsoft Intune? Provide a brief step-by-step scenario.', 'Microsoft Intune', 'Medium', 'Technical', 'Technical Competencies'),
('Detail the process for configuring Group Policy Objects (GPOs) to enforce security standards across multiple servers.', 'Group Policy', 'Hard', 'Technical', 'Technical Competencies'),
('Explain your process for troubleshooting a performance issue in a virtualized Azure VM environment.', 'Azure VMs', 'Hard', 'Technical', 'Technical Competencies'),
('How do you typically secure an Office 365 environment against phishing attacks and unauthorized access?', 'Office 365 Security', 'Medium', 'Technical', 'Technical Competencies'),
('A client reports intermittent connectivity issues with their Azure-based virtual machines. Outline your troubleshooting steps.', 'Troubleshooting', 'Medium', 'Scenario', 'Scenario-based Problem Solving'),
('An Office 365 migration resulted in critical emails missing post-migration. Describe your immediate response and resolution approach.', 'Migration Issues', 'Hard', 'Scenario', 'Scenario-based Problem Solving'),
('Describe a time when you collaborated on a challenging project. What was your role, and how did you ensure project success?', 'Collaboration', 'Easy', 'Behavioral', 'Behavioral & Soft Skills'),
('How do you approach creating and maintaining documentation for technical projects?', 'Documentation', 'Easy', 'Behavioral', 'Behavioral & Soft Skills');

-- Enable RLS (Row Level Security) - making it public for now since this is interview content
ALTER TABLE public.interview_questions ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow read access to interview questions for everyone
CREATE POLICY "Allow public read access to interview questions" 
  ON public.interview_questions 
  FOR SELECT 
  USING (true);
