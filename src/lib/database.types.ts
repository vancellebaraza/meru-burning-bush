// Hand-written to match db/schema.sql. We will regenerate this later with the Supabase CLI
// (supabase gen types typescript), which will replace this file. Keep both in sync until then.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type FundraiserStatus = "active" | "completed" | "closed";

export type Database = {
  public: {
    Tables: {
      admins: {
        Row: { user_id: string; created_at: string };
        Insert: { user_id: string; created_at?: string };
        Update: { user_id?: string; created_at?: string };
        Relationships: [];
      };
      events: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string;
          starts_at: string;
          ends_at: string | null;
          location: string;
          cover_image_key: string | null;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description?: string;
          starts_at: string;
          ends_at?: string | null;
          location?: string;
          cover_image_key?: string | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          description?: string;
          starts_at?: string;
          ends_at?: string | null;
          location?: string;
          cover_image_key?: string | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      fundraisers: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string;
          goal_amount_kes: number;
          raised_amount_kes: number;
          deadline: string | null;
          payment_instructions: string;
          cover_image_key: string | null;
          status: FundraiserStatus;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description?: string;
          goal_amount_kes: number;
          raised_amount_kes?: number;
          deadline?: string | null;
          payment_instructions?: string;
          cover_image_key?: string | null;
          status?: FundraiserStatus;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          description?: string;
          goal_amount_kes?: number;
          raised_amount_kes?: number;
          deadline?: string | null;
          payment_instructions?: string;
          cover_image_key?: string | null;
          status?: FundraiserStatus;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      photos: {
        Row: {
          id: string;
          event_id: string | null;
          fundraiser_id: string | null;
          r2_key: string;
          caption: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id?: string | null;
          fundraiser_id?: string | null;
          r2_key: string;
          caption?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string | null;
          fundraiser_id?: string | null;
          r2_key?: string;
          caption?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "photos_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "photos_fundraiser_id_fkey";
            columns: ["fundraiser_id"];
            isOneToOne: false;
            referencedRelation: "fundraisers";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      is_admin: { Args: Record<PropertyKey, never>; Returns: boolean };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
