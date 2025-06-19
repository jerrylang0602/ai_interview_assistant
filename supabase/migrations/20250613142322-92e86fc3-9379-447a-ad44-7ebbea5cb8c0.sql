
CREATE TABLE IF NOT EXISTS public.interview_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  duration INTEGER DEFAULT 30,
  question_count INTEGER DEFAULT 5,
  easy_questions_percentage INTEGER DEFAULT 60,
  medium_questions_percentage INTEGER DEFAULT 28,
  hard_questions_percentage INTEGER DEFAULT 12,
  ai_detection_enabled BOOLEAN DEFAULT TRUE,
  ai_detection_sensitivity VARCHAR(20) DEFAULT 'medium',
  pattern_similarity_threshold INTEGER DEFAULT 70,
  selected_categories JSONB DEFAULT '["JavaScript", "React", "Behavioral"]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.interview_settings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (you can restrict this later if needed)
CREATE POLICY "Allow all operations on interview_settings" 
  ON public.interview_settings 
  FOR ALL 
  USING (true)
  WITH CHECK (true);

-- Create index on user_id for faster lookups
CREATE INDEX idx_interview_settings_user_id ON public.interview_settings(user_id);
