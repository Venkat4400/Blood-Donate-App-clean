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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      blood_banks: {
        Row: {
          address: string
          city: string
          created_at: string
          email: string | null
          has_component_facility: boolean | null
          id: string
          is_24x7: boolean | null
          is_verified: boolean | null
          latitude: number
          longitude: number
          name: string
          phone: string
          pincode: string | null
          rating: number | null
          state: string
          total_reviews: number | null
          updated_at: string
          website: string | null
        }
        Insert: {
          address: string
          city: string
          created_at?: string
          email?: string | null
          has_component_facility?: boolean | null
          id?: string
          is_24x7?: boolean | null
          is_verified?: boolean | null
          latitude: number
          longitude: number
          name: string
          phone: string
          pincode?: string | null
          rating?: number | null
          state: string
          total_reviews?: number | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string
          city?: string
          created_at?: string
          email?: string | null
          has_component_facility?: boolean | null
          id?: string
          is_24x7?: boolean | null
          is_verified?: boolean | null
          latitude?: number
          longitude?: number
          name?: string
          phone?: string
          pincode?: string | null
          rating?: number | null
          state?: string
          total_reviews?: number | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      blood_inventory: {
        Row: {
          blood_bank_id: string
          blood_type: Database["public"]["Enums"]["blood_type"]
          id: string
          last_updated: string
          units_available: number | null
        }
        Insert: {
          blood_bank_id: string
          blood_type: Database["public"]["Enums"]["blood_type"]
          id?: string
          last_updated?: string
          units_available?: number | null
        }
        Update: {
          blood_bank_id?: string
          blood_type?: Database["public"]["Enums"]["blood_type"]
          id?: string
          last_updated?: string
          units_available?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "blood_inventory_blood_bank_id_fkey"
            columns: ["blood_bank_id"]
            isOneToOne: false
            referencedRelation: "blood_banks"
            referencedColumns: ["id"]
          },
        ]
      }
      blood_requests: {
        Row: {
          blood_type: Database["public"]["Enums"]["blood_type"]
          city: string
          contact_email: string | null
          contact_phone: string
          created_at: string
          fulfilled_at: string | null
          hospital_address: string | null
          hospital_name: string | null
          id: string
          latitude: number | null
          longitude: number | null
          notes: string | null
          patient_name: string
          reason: string | null
          requester_id: string
          required_by: string | null
          state: string
          status: Database["public"]["Enums"]["request_status"] | null
          units_needed: number
          updated_at: string
          urgency: Database["public"]["Enums"]["urgency_level"] | null
        }
        Insert: {
          blood_type: Database["public"]["Enums"]["blood_type"]
          city: string
          contact_email?: string | null
          contact_phone: string
          created_at?: string
          fulfilled_at?: string | null
          hospital_address?: string | null
          hospital_name?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          notes?: string | null
          patient_name: string
          reason?: string | null
          requester_id: string
          required_by?: string | null
          state: string
          status?: Database["public"]["Enums"]["request_status"] | null
          units_needed?: number
          updated_at?: string
          urgency?: Database["public"]["Enums"]["urgency_level"] | null
        }
        Update: {
          blood_type?: Database["public"]["Enums"]["blood_type"]
          city?: string
          contact_email?: string | null
          contact_phone?: string
          created_at?: string
          fulfilled_at?: string | null
          hospital_address?: string | null
          hospital_name?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          notes?: string | null
          patient_name?: string
          reason?: string | null
          requester_id?: string
          required_by?: string | null
          state?: string
          status?: Database["public"]["Enums"]["request_status"] | null
          units_needed?: number
          updated_at?: string
          urgency?: Database["public"]["Enums"]["urgency_level"] | null
        }
        Relationships: []
      }
      donation_appointments: {
        Row: {
          blood_bank_id: string | null
          blood_request_id: string | null
          created_at: string
          donor_id: string
          id: string
          notes: string | null
          scheduled_date: string
          scheduled_time: string
          status: string | null
          units_donated: number | null
          updated_at: string
        }
        Insert: {
          blood_bank_id?: string | null
          blood_request_id?: string | null
          created_at?: string
          donor_id: string
          id?: string
          notes?: string | null
          scheduled_date: string
          scheduled_time: string
          status?: string | null
          units_donated?: number | null
          updated_at?: string
        }
        Update: {
          blood_bank_id?: string | null
          blood_request_id?: string | null
          created_at?: string
          donor_id?: string
          id?: string
          notes?: string | null
          scheduled_date?: string
          scheduled_time?: string
          status?: string | null
          units_donated?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "donation_appointments_blood_bank_id_fkey"
            columns: ["blood_bank_id"]
            isOneToOne: false
            referencedRelation: "blood_banks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donation_appointments_blood_request_id_fkey"
            columns: ["blood_request_id"]
            isOneToOne: false
            referencedRelation: "blood_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      donor_matches: {
        Row: {
          created_at: string
          distance_km: number | null
          donor_id: string
          id: string
          match_score: number
          notified_at: string | null
          request_id: string
          responded_at: string | null
          status: string | null
        }
        Insert: {
          created_at?: string
          distance_km?: number | null
          donor_id: string
          id?: string
          match_score: number
          notified_at?: string | null
          request_id: string
          responded_at?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string
          distance_km?: number | null
          donor_id?: string
          id?: string
          match_score?: number
          notified_at?: string | null
          request_id?: string
          responded_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donor_matches_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "blood_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      donor_profiles: {
        Row: {
          blood_type: Database["public"]["Enums"]["blood_type"]
          consumes_alcohol: boolean | null
          created_at: string
          eligibility_score: number | null
          has_chronic_illness: boolean | null
          has_infectious_disease: boolean | null
          has_surgery_recently: boolean | null
          has_tattoo_recently: boolean | null
          height: number | null
          id: string
          is_available: boolean | null
          is_smoker: boolean | null
          last_donation_date: string | null
          medications: string | null
          reliability_score: number | null
          total_donations: number | null
          updated_at: string
          user_id: string
          weight: number | null
        }
        Insert: {
          blood_type: Database["public"]["Enums"]["blood_type"]
          consumes_alcohol?: boolean | null
          created_at?: string
          eligibility_score?: number | null
          has_chronic_illness?: boolean | null
          has_infectious_disease?: boolean | null
          has_surgery_recently?: boolean | null
          has_tattoo_recently?: boolean | null
          height?: number | null
          id?: string
          is_available?: boolean | null
          is_smoker?: boolean | null
          last_donation_date?: string | null
          medications?: string | null
          reliability_score?: number | null
          total_donations?: number | null
          updated_at?: string
          user_id: string
          weight?: number | null
        }
        Update: {
          blood_type?: Database["public"]["Enums"]["blood_type"]
          consumes_alcohol?: boolean | null
          created_at?: string
          eligibility_score?: number | null
          has_chronic_illness?: boolean | null
          has_infectious_disease?: boolean | null
          has_surgery_recently?: boolean | null
          has_tattoo_recently?: boolean | null
          height?: number | null
          id?: string
          is_available?: boolean | null
          is_smoker?: boolean | null
          last_donation_date?: string | null
          medications?: string | null
          reliability_score?: number | null
          total_donations?: number | null
          updated_at?: string
          user_id?: string
          weight?: number | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          is_read: boolean | null
          message: string
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          city: string | null
          created_at: string
          date_of_birth: string | null
          email: string
          full_name: string
          gender: string | null
          id: string
          latitude: number | null
          longitude: number | null
          phone: string | null
          pincode: string | null
          state: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          date_of_birth?: string | null
          email: string
          full_name: string
          gender?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          phone?: string | null
          pincode?: string | null
          state?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string
          full_name?: string
          gender?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          phone?: string | null
          pincode?: string | null
          state?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          blood_bank_id: string | null
          comment: string | null
          created_at: string
          donor_id: string | null
          id: string
          is_verified: boolean | null
          rating: number
          reviewee_type: string
          reviewer_id: string
        }
        Insert: {
          blood_bank_id?: string | null
          comment?: string | null
          created_at?: string
          donor_id?: string | null
          id?: string
          is_verified?: boolean | null
          rating: number
          reviewee_type: string
          reviewer_id: string
        }
        Update: {
          blood_bank_id?: string | null
          comment?: string | null
          created_at?: string
          donor_id?: string | null
          id?: string
          is_verified?: boolean | null
          rating?: number
          reviewee_type?: string
          reviewer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_blood_bank_id_fkey"
            columns: ["blood_bank_id"]
            isOneToOne: false
            referencedRelation: "blood_banks"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
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
      app_role: "donor" | "receiver" | "hospital" | "admin"
      blood_type: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-"
      request_status:
        | "pending"
        | "matched"
        | "fulfilled"
        | "cancelled"
        | "expired"
      urgency_level: "normal" | "urgent" | "emergency"
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
      app_role: ["donor", "receiver", "hospital", "admin"],
      blood_type: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      request_status: [
        "pending",
        "matched",
        "fulfilled",
        "cancelled",
        "expired",
      ],
      urgency_level: ["normal", "urgent", "emergency"],
    },
  },
} as const
