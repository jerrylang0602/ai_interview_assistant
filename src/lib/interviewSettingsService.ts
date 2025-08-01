
import { supabase } from './supabase';

export interface InterviewSettings {
  id: string;
  user_id?: string;
  duration: number; // in minutes
  question_count: number;
  easy_questions_percentage: number;
  medium_questions_percentage: number;
  hard_questions_percentage: number;
  ai_detection_enabled: boolean;
  ai_detection_sensitivity: string;
  pattern_similarity_threshold: number;
  selected_categories: string[];
  assessment_passing_score: number;
  assessment_passing_level: string;
  resume_passing_score?: number;
  resume_passing_level?: string;
  created_at: string;
  updated_at: string;
}

export const getInterviewSettings = async (): Promise<InterviewSettings | null> => {
  try {
    console.log('Fetching interview settings from Supabase');

    const { data, error } = await supabase
      .from('interview_settings')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      // No settings found, return default settings
      console.log('No interview settings found, using defaults');
      return {
        id: 'default',
        duration: 30,
        question_count: 10,
        easy_questions_percentage: 60,
        medium_questions_percentage: 28,
        hard_questions_percentage: 12,
        ai_detection_enabled: true,
        ai_detection_sensitivity: 'medium',
        pattern_similarity_threshold: 70,
        selected_categories: ['JavaScript', 'React', 'Behavioral'],
        assessment_passing_score: 70,
        assessment_passing_level: 'Level 3',
        resume_passing_score: 70,
        resume_passing_level: 'Level 3',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }

    console.log('Interview settings loaded:', data);
    return data;
  } catch (error) {
    console.error('Error fetching interview settings:', error);
    throw new Error('Failed to fetch interview settings');
  }
};
