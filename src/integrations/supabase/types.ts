export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      leads: {
        Row: {
          accommodation_level: string | null
          ai_generated_program: Json | null
          assigned_to: string | null
          budget_per_person: number | null
          contact_email: string | null
          contact_line_id: string | null
          contact_name: string
          contact_phone: string
          created_at: string
          destination: string
          id: string
          meal_preference: string | null
          notes: string | null
          num_travelers: number
          org_name: string
          org_type: Database["public"]["Enums"]["org_type"]
          preferred_visits: string | null
          special_requests: string | null
          status: Database["public"]["Enums"]["lead_status"]
          study_objectives: string | null
          study_topics: string[] | null
          transport_preference: string | null
          travel_date_end: string | null
          travel_date_start: string | null
          updated_at: string
        }
        Insert: {
          accommodation_level?: string | null
          ai_generated_program?: Json | null
          assigned_to?: string | null
          budget_per_person?: number | null
          contact_email?: string | null
          contact_line_id?: string | null
          contact_name: string
          contact_phone: string
          created_at?: string
          destination: string
          id?: string
          meal_preference?: string | null
          notes?: string | null
          num_travelers?: number
          org_name: string
          org_type?: Database["public"]["Enums"]["org_type"]
          preferred_visits?: string | null
          special_requests?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          study_objectives?: string | null
          study_topics?: string[] | null
          transport_preference?: string | null
          travel_date_end?: string | null
          travel_date_start?: string | null
          updated_at?: string
        }
        Update: {
          accommodation_level?: string | null
          ai_generated_program?: Json | null
          assigned_to?: string | null
          budget_per_person?: number | null
          contact_email?: string | null
          contact_line_id?: string | null
          contact_name?: string
          contact_phone?: string
          created_at?: string
          destination?: string
          id?: string
          meal_preference?: string | null
          notes?: string | null
          num_travelers?: number
          org_name?: string
          org_type?: Database["public"]["Enums"]["org_type"]
          preferred_visits?: string | null
          special_requests?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          study_objectives?: string | null
          study_topics?: string[] | null
          transport_preference?: string | null
          travel_date_end?: string | null
          travel_date_start?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      quotations: {
        Row: {
          created_at: string
          custom_itinerary: Json | null
          id: string
          lead_id: string | null
          notes: string | null
          num_travelers: number
          price_per_person: number
          quotation_number: string
          status: string
          total_amount: number
          tour_program_id: string | null
          updated_at: string
          valid_until: string | null
        }
        Insert: {
          created_at?: string
          custom_itinerary?: Json | null
          id?: string
          lead_id?: string | null
          notes?: string | null
          num_travelers: number
          price_per_person: number
          quotation_number: string
          status?: string
          total_amount: number
          tour_program_id?: string | null
          updated_at?: string
          valid_until?: string | null
        }
        Update: {
          created_at?: string
          custom_itinerary?: Json | null
          id?: string
          lead_id?: string | null
          notes?: string | null
          num_travelers?: number
          price_per_person?: number
          quotation_number?: string
          status?: string
          total_amount?: number
          tour_program_id?: string | null
          updated_at?: string
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotations_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotations_tour_program_id_fkey"
            columns: ["tour_program_id"]
            isOneToOne: false
            referencedRelation: "tour_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      tour_programs: {
        Row: {
          airline: string | null
          code: string
          country: string
          created_at: string
          days: number
          destination: string
          excluded: string[] | null
          highlights: string[] | null
          id: string
          image_url: string | null
          included: string[] | null
          itinerary: Json | null
          name: string
          nights: number
          notes: string | null
          price_per_person: number | null
          status: Database["public"]["Enums"]["tour_status"]
          updated_at: string
        }
        Insert: {
          airline?: string | null
          code: string
          country: string
          created_at?: string
          days: number
          destination: string
          excluded?: string[] | null
          highlights?: string[] | null
          id?: string
          image_url?: string | null
          included?: string[] | null
          itinerary?: Json | null
          name: string
          nights: number
          notes?: string | null
          price_per_person?: number | null
          status?: Database["public"]["Enums"]["tour_status"]
          updated_at?: string
        }
        Update: {
          airline?: string | null
          code?: string
          country?: string
          created_at?: string
          days?: number
          destination?: string
          excluded?: string[] | null
          highlights?: string[] | null
          id?: string
          image_url?: string | null
          included?: string[] | null
          itinerary?: Json | null
          name?: string
          nights?: number
          notes?: string | null
          price_per_person?: number | null
          status?: Database["public"]["Enums"]["tour_status"]
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      registrations: {
        Row: {
          id: string
          registration_code: string | null
          line_user_id: string
          line_display_name: string | null
          line_picture_url: string | null
          full_name: string
          phone: string
          email: string
          province: string
          district: string
          occupation: string | null
          business_name: string | null
          interest_topic: string[] | null
          has_line_oa: string | null
          wants_coupon: boolean
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          registration_code?: string | null
          line_user_id: string
          line_display_name?: string | null
          line_picture_url?: string | null
          full_name: string
          phone: string
          email: string
          province: string
          district: string
          occupation?: string | null
          business_name?: string | null
          interest_topic?: string[] | null
          has_line_oa?: string | null
          wants_coupon?: boolean
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          registration_code?: string | null
          line_user_id?: string
          line_display_name?: string | null
          line_picture_url?: string | null
          full_name?: string
          phone?: string
          email?: string
          province?: string
          district?: string
          occupation?: string | null
          business_name?: string | null
          interest_topic?: string[] | null
          has_line_oa?: string | null
          wants_coupon?: boolean
          status?: string
          created_at?: string
        }
        Relationships: []
      }
      coupons: {
        Row: {
          id: string
          registration_id: string | null
          coupon_code: string
          coupon_token: string
          coupon_qr_url: string | null
          coupon_name: string
          coupon_value: number
          final_price: number
          status: string
          issued_at: string
          used_at: string | null
        }
        Insert: {
          id?: string
          registration_id?: string | null
          coupon_code: string
          coupon_token: string
          coupon_qr_url?: string | null
          coupon_name: string
          coupon_value?: number
          final_price?: number
          status?: string
          issued_at?: string
          used_at?: string | null
        }
        Update: {
          id?: string
          registration_id?: string | null
          coupon_code?: string
          coupon_token?: string
          coupon_qr_url?: string | null
          coupon_name?: string
          coupon_value?: number
          final_price?: number
          status?: string
          issued_at?: string
          used_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coupons_registration_id_fkey"
            columns: ["registration_id"]
            isOneToOne: false
            referencedRelation: "registrations"
            referencedColumns: ["id"]
          }
        ]
      }
      payments: {
        Row: {
          id: string
          registration_id: string | null
          amount: number
          payment_method: string
          payment_status: string
          paid_at: string | null
          admin_note: string | null
        }
        Insert: {
          id?: string
          registration_id?: string | null
          amount?: number
          payment_method: string
          payment_status?: string
          paid_at?: string | null
          admin_note?: string | null
        }
        Update: {
          id?: string
          registration_id?: string | null
          amount?: number
          payment_method?: string
          payment_status?: string
          paid_at?: string | null
          admin_note?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_registration_id_fkey"
            columns: ["registration_id"]
            isOneToOne: false
            referencedRelation: "registrations"
            referencedColumns: ["id"]
          }
        ]
      }
      checkins: {
        Row: {
          id: string
          registration_id: string | null
          checked_in_at: string
          checked_in_by: string | null
          status: string
        }
        Insert: {
          id?: string
          registration_id?: string | null
          checked_in_at?: string
          checked_in_by?: string | null
          status?: string
        }
        Update: {
          id?: string
          registration_id?: string | null
          checked_in_at?: string
          checked_in_by?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "checkins_registration_id_fkey"
            columns: ["registration_id"]
            isOneToOne: false
            referencedRelation: "registrations"
            referencedColumns: ["id"]
          }
        ]
      }
      line_messages: {
        Row: {
          id: string
          registration_id: string | null
          line_user_id: string
          message_type: string
          sent_status: string
          sent_at: string
        }
        Insert: {
          id?: string
          registration_id?: string | null
          line_user_id: string
          message_type: string
          sent_status?: string
          sent_at?: string
        }
        Update: {
          id?: string
          registration_id?: string | null
          line_user_id?: string
          message_type?: string
          sent_status?: string
          sent_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "line_messages_registration_id_fkey"
            columns: ["registration_id"]
            isOneToOne: false
            referencedRelation: "registrations"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      lead_status:
        | "new"
        | "contacted"
        | "proposal_sent"
        | "negotiating"
        | "won"
        | "lost"
      org_type:
        | "government"
        | "corporate"
        | "education"
        | "association"
        | "other"
      tour_status: "draft" | "active" | "archived"
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
    Enums: {
      app_role: ["admin", "moderator", "user"],
      lead_status: [
        "new",
        "contacted",
        "proposal_sent",
        "negotiating",
        "won",
        "lost",
      ],
      org_type: [
        "government",
        "corporate",
        "education",
        "association",
        "other",
      ],
      tour_status: ["draft", "active", "archived"],
    },
  },
} as const
