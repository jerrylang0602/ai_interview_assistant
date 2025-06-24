
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
  created_at: string;
  updated_at: string;
}

export const getInterviewSettings = async (): Promise<InterviewSettings | null> => {
  try {
    console.log('Fetching interview settings from Supabase');

    const { data, error } = await supabase
      .from('interview_settings')
      .select('*')
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
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
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      }
      throw error;
    }

    console.log('Interview settings loaded:', data);
    return data;
  } catch (error) {
    console.error('Error fetching interview settings:', error);
    throw new Error('Failed to fetch interview settings');
  }
};
