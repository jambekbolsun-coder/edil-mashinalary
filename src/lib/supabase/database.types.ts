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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      analytics_events: {
        Row: {
          anonymous_id: string | null
          created_at: string
          equipment_slug: string | null
          event_name: string
          id: number
          locale: string | null
          metadata: Json
          path: string | null
          referrer_host: string | null
          session_id: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          anonymous_id?: string | null
          created_at?: string
          equipment_slug?: string | null
          event_name: string
          id?: never
          locale?: string | null
          metadata?: Json
          path?: string | null
          referrer_host?: string | null
          session_id?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          anonymous_id?: string | null
          created_at?: string
          equipment_slug?: string | null
          event_name?: string
          id?: never
          locale?: string | null
          metadata?: Json
          path?: string | null
          referrer_host?: string | null
          session_id?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: []
      }
      chat_answers: {
        Row: {
          active: boolean
          answer: string
          created_at: string
          id: string
          question: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          answer: string
          created_at?: string
          id?: string
          question: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          answer?: string
          created_at?: string
          id?: string
          question?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      equipment: {
        Row: {
          brand: string
          bucket: string | null
          category: string
          created_at: string
          cylinders: number | null
          description: string
          down_payment: number | null
          engine: string | null
          equipment: Json
          featured: boolean
          id: string
          images: Json
          installment_months: number
          keywords: Json
          load_capacity: string | null
          monthly_payment: number | null
          name: string
          old_price: number | null
          power: number | null
          price: number | null
          promo: string | null
          published: boolean
          short_description: string
          slug: string
          specs: Json
          status: string
          turbo: boolean | null
          updated_at: string
          warranty_hours: number
        }
        Insert: {
          brand: string
          bucket?: string | null
          category: string
          created_at?: string
          cylinders?: number | null
          description: string
          down_payment?: number | null
          engine?: string | null
          equipment?: Json
          featured?: boolean
          id?: string
          images?: Json
          installment_months?: number
          keywords?: Json
          load_capacity?: string | null
          monthly_payment?: number | null
          name: string
          old_price?: number | null
          power?: number | null
          price?: number | null
          promo?: string | null
          published?: boolean
          short_description: string
          slug: string
          specs?: Json
          status?: string
          turbo?: boolean | null
          updated_at?: string
          warranty_hours?: number
        }
        Update: {
          brand?: string
          bucket?: string | null
          category?: string
          created_at?: string
          cylinders?: number | null
          description?: string
          down_payment?: number | null
          engine?: string | null
          equipment?: Json
          featured?: boolean
          id?: string
          images?: Json
          installment_months?: number
          keywords?: Json
          load_capacity?: string | null
          monthly_payment?: number | null
          name?: string
          old_price?: number | null
          power?: number | null
          price?: number | null
          promo?: string | null
          published?: boolean
          short_description?: string
          slug?: string
          specs?: Json
          status?: string
          turbo?: boolean | null
          updated_at?: string
          warranty_hours?: number
        }
        Relationships: []
      }
      leads: {
        Row: {
          comment: string | null
          consent: boolean
          consent_version: string
          consented_at: string | null
          created_at: string
          id: string
          interest: string | null
          landing_page: string | null
          locale: string
          manager_notes: string | null
          name: string
          next_contact_at: string | null
          phone: string
          preference: string
          source: string
          status: string
          updated_at: string
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          comment?: string | null
          consent?: boolean
          consent_version?: string
          consented_at?: string | null
          created_at?: string
          id?: string
          interest?: string | null
          landing_page?: string | null
          locale?: string
          manager_notes?: string | null
          name: string
          next_contact_at?: string | null
          phone: string
          preference?: string
          source?: string
          status?: string
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          comment?: string | null
          consent?: boolean
          consent_version?: string
          consented_at?: string | null
          created_at?: string
          id?: string
          interest?: string | null
          landing_page?: string | null
          locale?: string
          manager_notes?: string | null
          name?: string
          next_contact_at?: string | null
          phone?: string
          preference?: string
          source?: string
          status?: string
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: []
      }
      posts: {
        Row: {
          category: string
          content: Json
          created_at: string
          excerpt: string
          id: string
          image: string
          published: boolean
          published_at: string | null
          read_time: string
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          content?: Json
          created_at?: string
          excerpt: string
          id?: string
          image: string
          published?: boolean
          published_at?: string | null
          read_time?: string
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          content?: Json
          created_at?: string
          excerpt?: string
          id?: string
          image?: string
          published?: boolean
          published_at?: string | null
          read_time?: string
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      promotions: {
        Row: {
          active: boolean
          created_at: string
          description: string
          ends_at: string | null
          id: string
          starts_at: string | null
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description: string
          ends_at?: string | null
          id?: string
          starts_at?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string
          ends_at?: string | null
          id?: string
          starts_at?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: { id: string; slug: string; title: string; excerpt: string; content: Json; icon: string; sort_order: number; published: boolean; created_at: string; updated_at: string }
        Insert: { id?: string; slug: string; title: string; excerpt: string; content?: Json; icon?: string; sort_order?: number; published?: boolean; created_at?: string; updated_at?: string }
        Update: { id?: string; slug?: string; title?: string; excerpt?: string; content?: Json; icon?: string; sort_order?: number; published?: boolean; created_at?: string; updated_at?: string }
        Relationships: []
      }
      lead_activities: {
        Row: { id: number; lead_id: string; author_id: string | null; activity_type: string; note: string | null; metadata: Json; created_at: string }
        Insert: { id?: never; lead_id: string; author_id?: string | null; activity_type: string; note?: string | null; metadata?: Json; created_at?: string }
        Update: { id?: never; lead_id?: string; author_id?: string | null; activity_type?: string; note?: string | null; metadata?: Json; created_at?: string }
        Relationships: []
      }
      audit_logs: {
        Row: { id: number; actor_id: string | null; action: string; entity_type: string; entity_id: string | null; changes: Json; created_at: string }
        Insert: { id?: never; actor_id?: string | null; action: string; entity_type: string; entity_id?: string | null; changes?: Json; created_at?: string }
        Update: { id?: never; actor_id?: string | null; action?: string; entity_type?: string; entity_id?: string | null; changes?: Json; created_at?: string }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          public: boolean
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          public?: boolean
          updated_at?: string
          value: Json
        }
        Update: {
          key?: string
          public?: boolean
          updated_at?: string
          value?: Json
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
