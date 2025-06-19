
-- Dashboard Analytics Table
CREATE TABLE IF NOT EXISTS public.dashboard_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  month VARCHAR(10) NOT NULL,
  year INTEGER NOT NULL,
  avg_score NUMERIC(5,2),
  pass_rate NUMERIC(5,2),
  ai_detection_rate NUMERIC(5,2),
  total_interviews INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(month, year)
);

-- Enable Row Level Security
ALTER TABLE public.dashboard_analytics ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (you can restrict this later if needed)
CREATE POLICY "Allow all operations on dashboard_analytics" 
  ON public.dashboard_analytics 
  FOR ALL 
  USING (true)
  WITH CHECK (true);

-- Create index on month and year for faster lookups
CREATE INDEX idx_dashboard_analytics_month_year ON public.dashboard_analytics(month, year);
