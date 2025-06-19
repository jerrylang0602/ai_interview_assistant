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
          active_stage: string[] | null
          alternate_mobile: string | null
          associated_tags: string[] | null
          candidate_id: string | null
          candidate_owner_id: string | null
          candidate_owner_name: string | null
          candidate_stage: string | null
          candidate_status: string | null
          career_page_invite_status: string | null
          city: string | null
          country: string | null
          created_at: string
          created_by_id: string | null
          created_by_name: string | null
          created_time: string | null
          current_employer: string | null
          current_employment_status: string | null
          current_job_title: string | null
          current_salary_zar: number | null
          desired_salary_zar: number | null
          email: string | null
          email_opt_out: boolean | null
          experience_in_years: number | null
          first_name: string | null
          fresh_candidate: boolean | null
          full_name: string | null
          how_did_you_hear_about_us: string | null
          id: string
          introduction_video_link: string | null
          is_attachment_present: boolean | null
          is_locked: boolean | null
          is_unqualified: boolean | null
          last_activity_time: string | null
          last_mailed_time: string | null
          last_name: string | null
          level_2_strengths: string | null
          level_3_skills: string | null
          linkedin_profile: string | null
          mobile: string | null
          monthly_rate: number | null
          no_of_applications: number | null
          notice_period_days: number | null
          origin: string | null
          province: string | null
          rating: number | null
          referral: string | null
          role_interest: string | null
          sa_id_number: string | null
          salutation: string | null
          scaled_level: string | null
          skill_set: string | null
          source: string | null
          state: string | null
          street: string | null
          title_position: string | null
          updated_at: string
          updated_on: string | null
          zip_code: string | null
          zoho_id: string
        }
        Insert: {
          active_stage?: string[] | null
          alternate_mobile?: string | null
          associated_tags?: string[] | null
          candidate_id?: string | null
          candidate_owner_id?: string | null
          candidate_owner_name?: string | null
          candidate_stage?: string | null
          candidate_status?: string | null
          career_page_invite_status?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          created_by_id?: string | null
          created_by_name?: string | null
          created_time?: string | null
          current_employer?: string | null
          current_employment_status?: string | null
          current_job_title?: string | null
          current_salary_zar?: number | null
          desired_salary_zar?: number | null
          email?: string | null
          email_opt_out?: boolean | null
          experience_in_years?: number | null
          first_name?: string | null
          fresh_candidate?: boolean | null
          full_name?: string | null
          how_did_you_hear_about_us?: string | null
          id?: string
          introduction_video_link?: string | null
          is_attachment_present?: boolean | null
          is_locked?: boolean | null
          is_unqualified?: boolean | null
          last_activity_time?: string | null
          last_mailed_time?: string | null
          last_name?: string | null
          level_2_strengths?: string | null
          level_3_skills?: string | null
          linkedin_profile?: string | null
          mobile?: string | null
          monthly_rate?: number | null
          no_of_applications?: number | null
          notice_period_days?: number | null
          origin?: string | null
          province?: string | null
          rating?: number | null
          referral?: string | null
          role_interest?: string | null
          sa_id_number?: string | null
          salutation?: string | null
          scaled_level?: string | null
          skill_set?: string | null
          source?: string | null
          state?: string | null
          street?: string | null
          title_position?: string | null
          updated_at?: string
          updated_on?: string | null
          zip_code?: string | null
          zoho_id: string
        }
        Update: {
          active_stage?: string[] | null
          alternate_mobile?: string | null
          associated_tags?: string[] | null
          candidate_id?: string | null
          candidate_owner_id?: string | null
          candidate_owner_name?: string | null
          candidate_stage?: string | null
          candidate_status?: string | null
          career_page_invite_status?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          created_by_id?: string | null
          created_by_name?: string | null
          created_time?: string | null
          current_employer?: string | null
          current_employment_status?: string | null
          current_job_title?: string | null
          current_salary_zar?: number | null
          desired_salary_zar?: number | null
          email?: string | null
          email_opt_out?: boolean | null
          experience_in_years?: number | null
          first_name?: string | null
          fresh_candidate?: boolean | null
          full_name?: string | null
          how_did_you_hear_about_us?: string | null
          id?: string
          introduction_video_link?: string | null
          is_attachment_present?: boolean | null
          is_locked?: boolean | null
          is_unqualified?: boolean | null
          last_activity_time?: string | null
          last_mailed_time?: string | null
          last_name?: string | null
          level_2_strengths?: string | null
          level_3_skills?: string | null
          linkedin_profile?: string | null
          mobile?: string | null
          monthly_rate?: number | null
          no_of_applications?: number | null
          notice_period_days?: number | null
          origin?: string | null
          province?: string | null
          rating?: number | null
          referral?: string | null
          role_interest?: string | null
          sa_id_number?: string | null
          salutation?: string | null
          scaled_level?: string | null
          skill_set?: string | null
          source?: string | null
          state?: string | null
          street?: string | null
          title_position?: string | null
          updated_at?: string
          updated_on?: string | null
          zip_code?: string | null
          zoho_id?: string
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
      interview_details_result: {
        Row: {
          ai_detection: boolean
          communication_score: number | null
          created_at: string | null
          date: string
          documentation_score: number | null
          id: string
          notes: string | null
          problem_solving_score: number | null
          questions: Json | null
          score: number
          status: string
          technical_score: number | null
          zoho_id: string
        }
        Insert: {
          ai_detection?: boolean
          communication_score?: number | null
          created_at?: string | null
          date: string
          documentation_score?: number | null
          id?: string
          notes?: string | null
          problem_solving_score?: number | null
          questions?: Json | null
          score: number
          status: string
          technical_score?: number | null
          zoho_id: string
        }
        Update: {
          ai_detection?: boolean
          communication_score?: number | null
          created_at?: string | null
          date?: string
          documentation_score?: number | null
          id?: string
          notes?: string | null
          problem_solving_score?: number | null
          questions?: Json | null
          score?: number
          status?: string
          technical_score?: number | null
          zoho_id?: string
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
        Relationships: [
          {
            foreignKeyName: "fk_interview_results_zoho_id"
            columns: ["zoho_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["zoho_id"]
          },
        ]
      }
      interview_settings: {
        Row: {
          ai_detection_enabled: boolean | null
          ai_detection_sensitivity: string | null
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
      [_ in never]: never
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
