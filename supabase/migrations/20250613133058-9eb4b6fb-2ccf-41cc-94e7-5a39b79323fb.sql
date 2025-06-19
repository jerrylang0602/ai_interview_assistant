
-- Create candidates table to store candidate information
CREATE TABLE public.candidates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  zoho_id text UNIQUE NOT NULL,
  candidate_id text,
  first_name text,
  last_name text,
  full_name text,
  email text,
  mobile text,
  alternate_mobile text,
  city text,
  state text,
  province text,
  zip_code text,
  street text,
  country text,
  sa_id_number text,
  salutation text,
  current_job_title text,
  title_position text,
  current_employer text,
  current_employment_status text,
  experience_in_years integer,
  notice_period_days integer,
  current_salary_zar numeric,
  desired_salary_zar numeric,
  monthly_rate numeric,
  candidate_status text,
  candidate_stage text,
  scaled_level text,
  origin text,
  source text,
  skill_set text,
  level_2_strengths text,
  level_3_skills text,
  role_interest text,
  how_did_you_hear_about_us text,
  linkedin_profile text,
  introduction_video_link text,
  referral text,
  rating numeric,
  is_unqualified boolean DEFAULT false,
  is_locked boolean DEFAULT false,
  fresh_candidate boolean DEFAULT true,
  email_opt_out boolean DEFAULT false,
  is_attachment_present boolean DEFAULT false,
  no_of_applications integer DEFAULT 0,
  active_stage text[],
  associated_tags text[],
  career_page_invite_status text,
  candidate_owner_name text,
  candidate_owner_id text,
  created_by_name text,
  created_by_id text,
  created_time timestamp with time zone,
  updated_on timestamp with time zone,
  last_activity_time timestamp with time zone,
  last_mailed_time timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create index on zoho_id for faster lookups
CREATE INDEX idx_candidates_zoho_id ON public.candidates(zoho_id);

-- Create index on candidate_id for faster lookups
CREATE INDEX idx_candidates_candidate_id ON public.candidates(candidate_id);

-- Create index on email for faster lookups
CREATE INDEX idx_candidates_email ON public.candidates(email);

-- Enable Row Level Security (make it publicly accessible for now)
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (you can restrict this later)
CREATE POLICY "Allow all operations on candidates" 
  ON public.candidates 
  FOR ALL 
  USING (true)
  WITH CHECK (true);
