
-- Create the interview_details_result table
CREATE TABLE public.interview_details_result (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  position TEXT NOT NULL,
  date DATE NOT NULL,
  score INTEGER NOT NULL,
  status TEXT NOT NULL,
  ai_detection BOOLEAN NOT NULL DEFAULT false,
  technical_score INTEGER,
  problem_solving_score INTEGER,
  communication_score INTEGER,
  documentation_score INTEGER,
  notes TEXT,
  questions JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.interview_details_result ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow read access to interview details results for everyone
CREATE POLICY "Allow public read access to interview details results" 
  ON public.interview_details_result 
  FOR SELECT 
  USING (true);

-- Create a policy to allow insert access for authenticated users
CREATE POLICY "Allow insert access to interview details results" 
  ON public.interview_details_result 
  FOR INSERT 
  WITH CHECK (true);

-- Insert sample data based on your provided structure
INSERT INTO public.interview_details_result (
  name, email, position, date, score, status, ai_detection, 
  technical_score, problem_solving_score, communication_score, documentation_score, 
  notes, questions
) VALUES
(
  'Alex Johnson',
  'alex.johnson@example.com',
  'Frontend Developer',
  '2023-06-15',
  87,
  'Passed',
  false,
  85,
  90,
  82,
  88,
  'Strong candidate with excellent problem-solving skills. Good cultural fit.',
  '[
    {
      "id": "q1",
      "question": "Explain the difference between let, const, and var in JavaScript.",
      "answer": "Let and const were introduced in ES6. Var is function-scoped, while let and const are block-scoped. Const creates a variable that cannot be reassigned.",
      "score": 90,
      "aiDetected": false
    },
    {
      "id": "q2",
      "question": "How would you optimize a React application''s performance?",
      "answer": "I would use React.memo for functional components, shouldComponentUpdate for class components, use the useCallback and useMemo hooks, and implement code splitting with React.lazy.",
      "score": 85,
      "aiDetected": false
    },
    {
      "id": "q3",
      "question": "Describe your experience with responsive design.",
      "answer": "I''ve implemented responsive designs using media queries, flexible grid layouts, and relative units. I follow a mobile-first approach and test across multiple devices.",
      "score": 88,
      "aiDetected": false
    }
  ]'::jsonb
),
(
  'Sam Williams',
  'sam.williams@example.com',
  'Backend Developer',
  '2023-06-18',
  92,
  'Passed',
  false,
  94,
  90,
  88,
  95,
  'Exceptional candidate with deep knowledge of backend systems. Highly recommended.',
  '[
    {
      "id": "q1",
      "question": "Explain RESTful API design principles.",
      "answer": "REST APIs should be stateless, have a uniform interface, be cacheable, use standard HTTP methods, and provide resources in a hierarchical structure.",
      "score": 95,
      "aiDetected": false
    },
    {
      "id": "q2",
      "question": "How would you handle database migrations in a production environment?",
      "answer": "I would use a migration tool like Flyway or Liquibase, test migrations in staging first, schedule during low-traffic periods, have a rollback plan, and monitor closely during execution.",
      "score": 90,
      "aiDetected": false
    }
  ]'::jsonb
);
