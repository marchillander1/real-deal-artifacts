export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      ai_analysis: {
        Row: {
          analysis_complete: boolean | null
          analysis_data: Json
          analysis_timestamp: string
          brand_themes: string[] | null
          certification_recommendations: string[] | null
          certifications: string[] | null
          communication_style: string | null
          created_at: string
          cv_tips: string[] | null
          fallback_flags: Json | null
          id: string
          industries: string[] | null
          linkedin_engagement_level: string | null
          linkedin_tips: string[] | null
          personality_traits: string[] | null
          suggested_learning_paths: string[] | null
          tech_stack_primary: string[] | null
          tech_stack_secondary: string[] | null
          thought_leadership_score: number | null
          tone_of_voice: string | null
          top_values: string[] | null
          upload_session_id: string | null
          user_profile_id: string | null
        }
        Insert: {
          analysis_complete?: boolean | null
          analysis_data: Json
          analysis_timestamp?: string
          brand_themes?: string[] | null
          certification_recommendations?: string[] | null
          certifications?: string[] | null
          communication_style?: string | null
          created_at?: string
          cv_tips?: string[] | null
          fallback_flags?: Json | null
          id?: string
          industries?: string[] | null
          linkedin_engagement_level?: string | null
          linkedin_tips?: string[] | null
          personality_traits?: string[] | null
          suggested_learning_paths?: string[] | null
          tech_stack_primary?: string[] | null
          tech_stack_secondary?: string[] | null
          thought_leadership_score?: number | null
          tone_of_voice?: string | null
          top_values?: string[] | null
          upload_session_id?: string | null
          user_profile_id?: string | null
        }
        Update: {
          analysis_complete?: boolean | null
          analysis_data?: Json
          analysis_timestamp?: string
          brand_themes?: string[] | null
          certification_recommendations?: string[] | null
          certifications?: string[] | null
          communication_style?: string | null
          created_at?: string
          cv_tips?: string[] | null
          fallback_flags?: Json | null
          id?: string
          industries?: string[] | null
          linkedin_engagement_level?: string | null
          linkedin_tips?: string[] | null
          personality_traits?: string[] | null
          suggested_learning_paths?: string[] | null
          tech_stack_primary?: string[] | null
          tech_stack_secondary?: string[] | null
          thought_leadership_score?: number | null
          tone_of_voice?: string | null
          top_values?: string[] | null
          upload_session_id?: string | null
          user_profile_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_analysis_upload_session_id_fkey"
            columns: ["upload_session_id"]
            isOneToOne: false
            referencedRelation: "upload_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_analysis_user_profile_id_fkey"
            columns: ["user_profile_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      analysis_sessions: {
        Row: {
          completed_at: string | null
          consultant_id: string | null
          created_at: string | null
          id: string
          session_token: string
          step: string | null
          updated_at: string | null
        }
        Insert: {
          completed_at?: string | null
          consultant_id?: string | null
          created_at?: string | null
          id?: string
          session_token: string
          step?: string | null
          updated_at?: string | null
        }
        Update: {
          completed_at?: string | null
          consultant_id?: string | null
          created_at?: string | null
          id?: string
          session_token?: string
          step?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analysis_sessions_consultant_id_fkey"
            columns: ["consultant_id"]
            isOneToOne: false
            referencedRelation: "consultants"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_events: {
        Row: {
          consultant_id: string | null
          created_at: string | null
          event_data: Json | null
          event_type: string
          id: string
          session_token: string | null
        }
        Insert: {
          consultant_id?: string | null
          created_at?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          session_token?: string | null
        }
        Update: {
          consultant_id?: string | null
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          session_token?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_consultant_id_fkey"
            columns: ["consultant_id"]
            isOneToOne: false
            referencedRelation: "consultants"
            referencedColumns: ["id"]
          },
        ]
      }
      assignments: {
        Row: {
          budget_currency: string | null
          budget_max: number | null
          budget_min: number | null
          client_logo: string | null
          company: string
          created_at: string | null
          created_by: string | null
          description: string
          desired_communication_style: string | null
          duration: string | null
          id: string
          industry: string | null
          leadership_level: number | null
          remote_type: string | null
          required_skills: string[] | null
          required_values: string[] | null
          start_date: string | null
          status: string | null
          team_culture: string | null
          team_dynamics: string | null
          team_size: string | null
          title: string
          updated_at: string | null
          urgency: string | null
          workload: string | null
        }
        Insert: {
          budget_currency?: string | null
          budget_max?: number | null
          budget_min?: number | null
          client_logo?: string | null
          company: string
          created_at?: string | null
          created_by?: string | null
          description: string
          desired_communication_style?: string | null
          duration?: string | null
          id?: string
          industry?: string | null
          leadership_level?: number | null
          remote_type?: string | null
          required_skills?: string[] | null
          required_values?: string[] | null
          start_date?: string | null
          status?: string | null
          team_culture?: string | null
          team_dynamics?: string | null
          team_size?: string | null
          title: string
          updated_at?: string | null
          urgency?: string | null
          workload?: string | null
        }
        Update: {
          budget_currency?: string | null
          budget_max?: number | null
          budget_min?: number | null
          client_logo?: string | null
          company?: string
          created_at?: string | null
          created_by?: string | null
          description?: string
          desired_communication_style?: string | null
          duration?: string | null
          id?: string
          industry?: string | null
          leadership_level?: number | null
          remote_type?: string | null
          required_skills?: string[] | null
          required_values?: string[] | null
          start_date?: string | null
          status?: string | null
          team_culture?: string | null
          team_dynamics?: string | null
          team_size?: string | null
          title?: string
          updated_at?: string | null
          urgency?: string | null
          workload?: string | null
        }
        Relationships: []
      }
      consultant_favorites: {
        Row: {
          consultant_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          consultant_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          consultant_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "consultant_favorites_consultant_id_fkey"
            columns: ["consultant_id"]
            isOneToOne: false
            referencedRelation: "consultants"
            referencedColumns: ["id"]
          },
        ]
      }
      consultant_notes: {
        Row: {
          consultant_id: string
          created_at: string
          id: string
          note_text: string
          updated_at: string
          user_id: string
        }
        Insert: {
          consultant_id: string
          created_at?: string
          id?: string
          note_text: string
          updated_at?: string
          user_id: string
        }
        Update: {
          consultant_id?: string
          created_at?: string
          id?: string
          note_text?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "consultant_notes_consultant_id_fkey"
            columns: ["consultant_id"]
            isOneToOne: false
            referencedRelation: "consultants"
            referencedColumns: ["id"]
          },
        ]
      }
      consultants: {
        Row: {
          adaptability: number | null
          analysis_results: Json | null
          analysis_timestamp: string | null
          availability: string | null
          brand_themes: string[] | null
          certification_recommendations: string[] | null
          certifications: string[] | null
          communication_style: string | null
          company_id: string | null
          created_at: string | null
          cultural_fit: number | null
          cv_analysis_data: Json | null
          cv_file_path: string | null
          cv_tips: string[] | null
          email: string
          experience_years: number | null
          fallback_flags: Json | null
          hourly_rate: number | null
          id: string
          industries: string[] | null
          is_published: boolean | null
          languages: string[] | null
          last_active: string | null
          leadership: number | null
          linkedin_analysis_data: Json | null
          linkedin_engagement_level: string | null
          linkedin_tips: string[] | null
          linkedin_url: string | null
          location: string | null
          market_rate_current: number | null
          market_rate_optimized: number | null
          name: string
          personality_traits: string[] | null
          phone: string | null
          primary_tech_stack: string[] | null
          profile_completeness: number | null
          projects_completed: number | null
          rating: number | null
          roles: string[] | null
          secondary_tech_stack: string[] | null
          self_description: string | null
          skills: string[] | null
          source_cv_raw_text: boolean | null
          source_linkedin_parsed: boolean | null
          suggested_learning_paths: string[] | null
          tagline: string | null
          team_fit: string | null
          thought_leadership_score: number | null
          title: string | null
          tone_of_voice: string | null
          top_values: string[] | null
          type: string | null
          updated_at: string | null
          user_id: string | null
          values: string[] | null
          visibility_status: string | null
          work_style: string | null
        }
        Insert: {
          adaptability?: number | null
          analysis_results?: Json | null
          analysis_timestamp?: string | null
          availability?: string | null
          brand_themes?: string[] | null
          certification_recommendations?: string[] | null
          certifications?: string[] | null
          communication_style?: string | null
          company_id?: string | null
          created_at?: string | null
          cultural_fit?: number | null
          cv_analysis_data?: Json | null
          cv_file_path?: string | null
          cv_tips?: string[] | null
          email: string
          experience_years?: number | null
          fallback_flags?: Json | null
          hourly_rate?: number | null
          id?: string
          industries?: string[] | null
          is_published?: boolean | null
          languages?: string[] | null
          last_active?: string | null
          leadership?: number | null
          linkedin_analysis_data?: Json | null
          linkedin_engagement_level?: string | null
          linkedin_tips?: string[] | null
          linkedin_url?: string | null
          location?: string | null
          market_rate_current?: number | null
          market_rate_optimized?: number | null
          name: string
          personality_traits?: string[] | null
          phone?: string | null
          primary_tech_stack?: string[] | null
          profile_completeness?: number | null
          projects_completed?: number | null
          rating?: number | null
          roles?: string[] | null
          secondary_tech_stack?: string[] | null
          self_description?: string | null
          skills?: string[] | null
          source_cv_raw_text?: boolean | null
          source_linkedin_parsed?: boolean | null
          suggested_learning_paths?: string[] | null
          tagline?: string | null
          team_fit?: string | null
          thought_leadership_score?: number | null
          title?: string | null
          tone_of_voice?: string | null
          top_values?: string[] | null
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
          values?: string[] | null
          visibility_status?: string | null
          work_style?: string | null
        }
        Update: {
          adaptability?: number | null
          analysis_results?: Json | null
          analysis_timestamp?: string | null
          availability?: string | null
          brand_themes?: string[] | null
          certification_recommendations?: string[] | null
          certifications?: string[] | null
          communication_style?: string | null
          company_id?: string | null
          created_at?: string | null
          cultural_fit?: number | null
          cv_analysis_data?: Json | null
          cv_file_path?: string | null
          cv_tips?: string[] | null
          email?: string
          experience_years?: number | null
          fallback_flags?: Json | null
          hourly_rate?: number | null
          id?: string
          industries?: string[] | null
          is_published?: boolean | null
          languages?: string[] | null
          last_active?: string | null
          leadership?: number | null
          linkedin_analysis_data?: Json | null
          linkedin_engagement_level?: string | null
          linkedin_tips?: string[] | null
          linkedin_url?: string | null
          location?: string | null
          market_rate_current?: number | null
          market_rate_optimized?: number | null
          name?: string
          personality_traits?: string[] | null
          phone?: string | null
          primary_tech_stack?: string[] | null
          profile_completeness?: number | null
          projects_completed?: number | null
          rating?: number | null
          roles?: string[] | null
          secondary_tech_stack?: string[] | null
          self_description?: string | null
          skills?: string[] | null
          source_cv_raw_text?: boolean | null
          source_linkedin_parsed?: boolean | null
          suggested_learning_paths?: string[] | null
          tagline?: string | null
          team_fit?: string | null
          thought_leadership_score?: number | null
          title?: string | null
          tone_of_voice?: string | null
          top_values?: string[] | null
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
          values?: string[] | null
          visibility_status?: string | null
          work_style?: string | null
        }
        Relationships: []
      }
      event_log: {
        Row: {
          created_at: string
          event_data: Json | null
          event_type: string
          id: string
          session_token: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_data?: Json | null
          event_type: string
          id?: string
          session_token?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          session_token?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      matches: {
        Row: {
          assignment_id: string | null
          communication_match: number | null
          consultant_id: string | null
          cover_letter: string | null
          created_at: string | null
          cultural_match: number | null
          estimated_savings: number | null
          human_factors_score: number | null
          id: string
          match_score: number
          matched_skills: string[] | null
          response_time_hours: number | null
          status: string | null
          values_alignment: number | null
        }
        Insert: {
          assignment_id?: string | null
          communication_match?: number | null
          consultant_id?: string | null
          cover_letter?: string | null
          created_at?: string | null
          cultural_match?: number | null
          estimated_savings?: number | null
          human_factors_score?: number | null
          id?: string
          match_score: number
          matched_skills?: string[] | null
          response_time_hours?: number | null
          status?: string | null
          values_alignment?: number | null
        }
        Update: {
          assignment_id?: string | null
          communication_match?: number | null
          consultant_id?: string | null
          cover_letter?: string | null
          created_at?: string | null
          cultural_match?: number | null
          estimated_savings?: number | null
          human_factors_score?: number | null
          id?: string
          match_score?: number
          matched_skills?: string[] | null
          response_time_hours?: number | null
          status?: string | null
          values_alignment?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_consultant_id_fkey"
            columns: ["consultant_id"]
            isOneToOne: false
            referencedRelation: "consultants"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          company: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      published_profiles: {
        Row: {
          ai_analysis_id: string | null
          id: string
          is_active: boolean | null
          published_at: string
          user_profile_id: string | null
          visibility_status: string | null
        }
        Insert: {
          ai_analysis_id?: string | null
          id?: string
          is_active?: boolean | null
          published_at?: string
          user_profile_id?: string | null
          visibility_status?: string | null
        }
        Update: {
          ai_analysis_id?: string | null
          id?: string
          is_active?: boolean | null
          published_at?: string
          user_profile_id?: string | null
          visibility_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "published_profiles_ai_analysis_id_fkey"
            columns: ["ai_analysis_id"]
            isOneToOne: false
            referencedRelation: "ai_analysis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "published_profiles_user_profile_id_fkey"
            columns: ["user_profile_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      skill_alerts: {
        Row: {
          active: boolean
          created_at: string
          email: string
          id: string
          skills: string[]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          active?: boolean
          created_at?: string
          email: string
          id?: string
          skills?: string[]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          active?: boolean
          created_at?: string
          email?: string
          id?: string
          skills?: string[]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      upload_sessions: {
        Row: {
          created_at: string
          cv_file_path: string | null
          gdpr_consent: boolean
          id: string
          linkedin_url: string | null
          personal_description: string | null
          personal_tagline: string | null
          session_token: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          cv_file_path?: string | null
          gdpr_consent?: boolean
          id?: string
          linkedin_url?: string | null
          personal_description?: string | null
          personal_tagline?: string | null
          session_token: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          cv_file_path?: string | null
          gdpr_consent?: boolean
          id?: string
          linkedin_url?: string | null
          personal_description?: string | null
          personal_tagline?: string | null
          session_token?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_management: {
        Row: {
          company: string | null
          created_at: string
          created_by: string
          email: string
          full_name: string
          id: string
          role: string
          status: string
          updated_at: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          created_by: string
          email: string
          full_name: string
          id?: string
          role?: string
          status?: string
          updated_at?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          created_by?: string
          email?: string
          full_name?: string
          id?: string
          role?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          availability: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          personal_tagline: string | null
          phone: string | null
          rate_preference: number | null
          title: string | null
          updated_at: string
          user_id: string | null
          visibility_toggle: boolean | null
          years_of_experience: number | null
        }
        Insert: {
          availability?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          personal_tagline?: string | null
          phone?: string | null
          rate_preference?: number | null
          title?: string | null
          updated_at?: string
          user_id?: string | null
          visibility_toggle?: boolean | null
          years_of_experience?: number | null
        }
        Update: {
          availability?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          personal_tagline?: string | null
          phone?: string | null
          rate_preference?: number | null
          title?: string | null
          updated_at?: string
          user_id?: string | null
          visibility_toggle?: boolean | null
          years_of_experience?: number | null
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
