export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      candidates: {
        Row: {
          ai_interview_attempts: number | null
          ai_interview_created: string | null
          ai_interview_duration: number | null
          ai_interview_expire_date: string | null
          ai_interview_finished: string | null
          ai_interview_last_reminder: string | null
          ai_interview_link: string | null
          ai_interview_max_attempts: number | null
          ai_interview_notes: string | null
          ai_interview_reminder_sent: boolean | null
          ai_interview_score: number | null
          ai_interview_status: string | null
          available_ai_interview: boolean | null
          candidate_stage: string | null
          city: string | null
          country: string | null
          created_at: string | null
          current_employment_status_2: string | null
          desired_salary_zar: number | null
          email: string
          experience_in_years: number | null
          first_name: string | null
          full_name: string | null
          how_did_you_hear_about_scaled: string | null
          id: string
          last_ai_interview_date: string | null
          last_name: string | null
          mobile: string | null
          number_of_ai_interviews: number | null
          origin: string | null
          resume_ai_feedback: string | null
          resume_level: string | null
          resume_prescreening_status: string | null
          resume_score: string | null
          status: string | null
          title_position: string | null
          updated_at: string | null
          zoho_id: string | null
        }
        Insert: {
          ai_interview_attempts?: number | null
          ai_interview_created?: string | null
          ai_interview_duration?: number | null
          ai_interview_expire_date?: string | null
          ai_interview_finished?: string | null
          ai_interview_last_reminder?: string | null
          ai_interview_link?: string | null
          ai_interview_max_attempts?: number | null
          ai_interview_notes?: string | null
          ai_interview_reminder_sent?: boolean | null
          ai_interview_score?: number | null
          ai_interview_status?: string | null
          available_ai_interview?: boolean | null
          candidate_stage?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          current_employment_status_2?: string | null
          desired_salary_zar?: number | null
          email: string
          experience_in_years?: number | null
          first_name?: string | null
          full_name?: string | null
          how_did_you_hear_about_scaled?: string | null
          id?: string
          last_ai_interview_date?: string | null
          last_name?: string | null
          mobile?: string | null
          number_of_ai_interviews?: number | null
          origin?: string | null
          resume_ai_feedback?: string | null
          resume_level?: string | null
          resume_prescreening_status?: string | null
          resume_score?: string | null
          status?: string | null
          title_position?: string | null
          updated_at?: string | null
          zoho_id?: string | null
        }
        Update: {
          ai_interview_attempts?: number | null
          ai_interview_created?: string | null
          ai_interview_duration?: number | null
          ai_interview_expire_date?: string | null
          ai_interview_finished?: string | null
          ai_interview_last_reminder?: string | null
          ai_interview_link?: string | null
          ai_interview_max_attempts?: number | null
          ai_interview_notes?: string | null
          ai_interview_reminder_sent?: boolean | null
          ai_interview_score?: number | null
          ai_interview_status?: string | null
          available_ai_interview?: boolean | null
          candidate_stage?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          current_employment_status_2?: string | null
          desired_salary_zar?: number | null
          email?: string
          experience_in_years?: number | null
          first_name?: string | null
          full_name?: string | null
          how_did_you_hear_about_scaled?: string | null
          id?: string
          last_ai_interview_date?: string | null
          last_name?: string | null
          mobile?: string | null
          number_of_ai_interviews?: number | null
          origin?: string | null
          resume_ai_feedback?: string | null
          resume_level?: string | null
          resume_prescreening_status?: string | null
          resume_score?: string | null
          status?: string | null
          title_position?: string | null
          updated_at?: string | null
          zoho_id?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      dashboard_analytics: {
        Row: {
          ai_detection_rate: number | null
          avg_score: number | null
          created_at: string | null
          id: string
          month: string
          pass_rate: number | null
          total_interviews: number | null
          updated_at: string | null
          year: number
        }
        Insert: {
          ai_detection_rate?: number | null
          avg_score?: number | null
          created_at?: string | null
          id?: string
          month: string
          pass_rate?: number | null
          total_interviews?: number | null
          updated_at?: string | null
          year: number
        }
        Update: {
          ai_detection_rate?: number | null
          avg_score?: number | null
          created_at?: string | null
          id?: string
          month?: string
          pass_rate?: number | null
          total_interviews?: number | null
          updated_at?: string | null
          year?: number
        }
        Relationships: []
      }
      interview_questions: {
        Row: {
          category: string | null
          created_at: string | null
          difficulty: string | null
          id: string
          question: string
          section: string | null
          type: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          difficulty?: string | null
          id?: string
          question: string
          section?: string | null
          type?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          difficulty?: string | null
          id?: string
          question?: string
          section?: string | null
          type?: string | null
        }
        Relationships: []
      }
      interview_results: {
        Row: {
          ai_detected: boolean | null
          communication: number | null
          completed_at: string
          detailed_result: Json | null
          documentation: number | null
          feedback: string | null
          id: string
          overall_level: string | null
          overall_score: number | null
          problem_solving: number | null
          status: string | null
          technical_accuracy: number | null
          zoho_id: string | null
        }
        Insert: {
          ai_detected?: boolean | null
          communication?: number | null
          completed_at?: string
          detailed_result?: Json | null
          documentation?: number | null
          feedback?: string | null
          id?: string
          overall_level?: string | null
          overall_score?: number | null
          problem_solving?: number | null
          status?: string | null
          technical_accuracy?: number | null
          zoho_id?: string | null
        }
        Update: {
          ai_detected?: boolean | null
          communication?: number | null
          completed_at?: string
          detailed_result?: Json | null
          documentation?: number | null
          feedback?: string | null
          id?: string
          overall_level?: string | null
          overall_score?: number | null
          problem_solving?: number | null
          status?: string | null
          technical_accuracy?: number | null
          zoho_id?: string | null
        }
        Relationships: []
      }
      interview_settings: {
        Row: {
          ai_detection_enabled: boolean | null
          ai_detection_sensitivity: string | null
          category_weights: Json | null
          created_at: string | null
          duration: number | null
          easy_questions_percentage: number | null
          hard_questions_percentage: number | null
          id: string
          medium_questions_percentage: number | null
          pattern_similarity_threshold: number | null
          question_count: number | null
          selected_categories: Json | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          ai_detection_enabled?: boolean | null
          ai_detection_sensitivity?: string | null
          category_weights?: Json | null
          created_at?: string | null
          duration?: number | null
          easy_questions_percentage?: number | null
          hard_questions_percentage?: number | null
          id?: string
          medium_questions_percentage?: number | null
          pattern_similarity_threshold?: number | null
          question_count?: number | null
          selected_categories?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          ai_detection_enabled?: boolean | null
          ai_detection_sensitivity?: string | null
          category_weights?: Json | null
          created_at?: string | null
          duration?: number | null
          easy_questions_percentage?: number | null
          hard_questions_percentage?: number | null
          id?: string
          medium_questions_percentage?: number | null
          pattern_similarity_threshold?: number | null
          question_count?: number | null
          selected_categories?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
