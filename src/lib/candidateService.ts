
import { supabase } from './supabase';

export interface CandidateRecord {
  zoho_id: string;
  candidate_id?: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  email?: string;
  mobile?: string;
  alternate_mobile?: string;
  city?: string;
  state?: string;
  province?: string;
  zip_code?: string;
  street?: string;
  country?: string;
  sa_id_number?: string;
  salutation?: string;
  current_job_title?: string;
  title_position?: string;
  current_employer?: string;
  current_employment_status?: string;
  experience_in_years?: number;
  notice_period_days?: number;
  current_salary_zar?: number;
  desired_salary_zar?: number;
  monthly_rate?: number;
  candidate_status?: string;
  candidate_stage?: string;
  scaled_level?: string;
  origin?: string;
  source?: string;
  skill_set?: string;
  level_2_strengths?: string;
  level_3_skills?: string;
  role_interest?: string;
  how_did_you_hear_about_us?: string;
  linkedin_profile?: string;
  introduction_video_link?: string;
  referral?: string;
  rating?: number;
  is_unqualified?: boolean;
  is_locked?: boolean;
  fresh_candidate?: boolean;
  email_opt_out?: boolean;
  is_attachment_present?: boolean;
  no_of_applications?: number;
  active_stage?: string[];
  associated_tags?: string[];
  career_page_invite_status?: string;
  candidate_owner_name?: string;
  candidate_owner_id?: string;
  created_by_name?: string;
  created_by_id?: string;
  created_time?: string;
  updated_on?: string;
  last_activity_time?: string;
  last_mailed_time?: string;
}

export const getCandidateByZohoId = async (zohoId: string): Promise<CandidateRecord | null> => {
  try {
    console.log('Fetching candidate from Supabase with zoho_id:', zohoId);

    const { data, error } = await supabase
      .from('candidates')
      .select('*')
      .eq('zoho_id', zohoId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        console.log('No candidate found with zoho_id:', zohoId);
        return null;
      }
      throw error;
    }

    console.log('Candidate found:', data);
    return data;
  } catch (error) {
    console.error('Error fetching candidate by zoho_id:', error);
    throw new Error('Failed to fetch candidate from database');
  }
};
