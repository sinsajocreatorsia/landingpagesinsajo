// ============================================
// SINSAJO WORKSHOP DATABASE TYPES
// Auto-generated types for Supabase schema
// ============================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// ============================================
// TABLE TYPES
// ============================================

export interface WorkshopRegistration {
  id: string
  email: string
  full_name: string
  phone: string | null
  country: string | null
  timezone: string | null

  // Payment info
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded'
  payment_method: 'stripe' | 'paypal' | null
  payment_id: string | null
  amount_paid: number | null
  currency: string

  // Registration status
  registration_status: 'registered' | 'confirmed' | 'attended' | 'no_show' | 'cancelled'

  // Source tracking
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  referral_code: string | null

  // Timestamps
  created_at: string
  updated_at: string
  confirmed_at: string | null
  attended_at: string | null
}

export interface WorkshopProfile {
  id: string
  registration_id: string

  // Business info
  business_name: string | null
  business_type: string | null
  industry: string | null
  years_in_business: number | null
  monthly_revenue: string | null
  team_size: string | null

  // Challenges (array of strings)
  challenges: string[]

  // Goals
  primary_goal: string | null
  expected_outcome: string | null

  // Tech readiness
  current_tools: string[]
  ai_experience: 'none' | 'basic' | 'intermediate' | 'advanced' | null

  // Preferences
  communication_preference: 'email' | 'whatsapp' | 'both' | null
  best_contact_time: string | null

  // Completion
  profile_completed: boolean
  profile_completion_percentage: number

  // Timestamps
  created_at: string
  updated_at: string
  completed_at: string | null
}

export interface HannaConversation {
  id: string
  registration_id: string | null
  session_id: string

  // Messages array
  messages: ChatMessage[]

  // Analytics
  message_count: number
  total_tokens_used: number

  // Context
  page_url: string | null
  user_agent: string | null
  ip_address: string | null

  // Status
  is_active: boolean
  ended_reason: string | null

  // Timestamps
  started_at: string
  last_message_at: string
  ended_at: string | null
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp?: string
}

export interface HannaAnalysis {
  id: string
  registration_id: string
  conversation_id: string | null

  // Scores (1-10)
  purchase_intent_score: number | null
  engagement_level: number | null
  urgency_indicator: number | null
  fit_score: number | null

  // Sentiment
  overall_sentiment: 'very_positive' | 'positive' | 'neutral' | 'negative' | 'very_negative' | null

  // Insights
  detected_pain_points: string[]
  detected_objections: string[]
  detected_interests: string[]

  // Recommendations
  follow_up_priority: 'high' | 'medium' | 'low' | null
  recommended_actions: string[]
  personalized_notes: string | null

  // Summary
  analysis_summary: string | null

  // Timestamps
  created_at: string
  updated_at: string
}

export interface EmailLog {
  id: string
  registration_id: string | null

  // Email details
  email_type: 'confirmation' | 'reminder_24h' | 'reminder_1h' | 'access_link' | 'recording' | 'follow_up'
  recipient_email: string
  subject: string | null

  // Status
  status: 'pending' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'failed'

  // Provider
  provider: string
  provider_message_id: string | null

  // Error handling
  error_message: string | null
  retry_count: number

  // Timestamps
  scheduled_at: string | null
  sent_at: string | null
  delivered_at: string | null
  opened_at: string | null
  clicked_at: string | null
  created_at: string
}

export interface AdminUser {
  id: string
  email: string
  full_name: string | null
  role: 'super_admin' | 'admin' | 'viewer'
  supabase_user_id: string | null
  is_active: boolean
  last_login_at: string | null
  created_at: string
  updated_at: string
}

export interface WorkshopSetting {
  id: string
  key: string
  value: Json
  description: string | null
  created_at: string
  updated_at: string
}

export interface AnalyticsEvent {
  id: string
  session_id: string | null
  registration_id: string | null

  // Event
  event_type: string
  event_data: Json

  // Context
  page_url: string | null
  referrer: string | null
  user_agent: string | null
  ip_address: string | null
  device_type: string | null

  // Timestamps
  created_at: string
}

// ============================================
// INSERT TYPES (for creating new records)
// ============================================

export type WorkshopRegistrationInsert = Omit<WorkshopRegistration, 'id' | 'created_at' | 'updated_at'> & {
  id?: string
  created_at?: string
  updated_at?: string
}

export type WorkshopProfileInsert = Omit<WorkshopProfile, 'id' | 'created_at' | 'updated_at'> & {
  id?: string
  created_at?: string
  updated_at?: string
}

export type HannaConversationInsert = Omit<HannaConversation, 'id' | 'started_at' | 'last_message_at'> & {
  id?: string
  started_at?: string
  last_message_at?: string
}

export type HannaAnalysisInsert = Omit<HannaAnalysis, 'id' | 'created_at' | 'updated_at'> & {
  id?: string
  created_at?: string
  updated_at?: string
}

export type EmailLogInsert = Omit<EmailLog, 'id' | 'created_at'> & {
  id?: string
  created_at?: string
}

export type AnalyticsEventInsert = Omit<AnalyticsEvent, 'id' | 'created_at'> & {
  id?: string
  created_at?: string
}

// ============================================
// DATABASE SCHEMA TYPE
// ============================================

export interface Database {
  public: {
    Tables: {
      workshop_registrations: {
        Row: WorkshopRegistration
        Insert: WorkshopRegistrationInsert
        Update: Partial<WorkshopRegistrationInsert>
      }
      workshop_profiles: {
        Row: WorkshopProfile
        Insert: WorkshopProfileInsert
        Update: Partial<WorkshopProfileInsert>
      }
      hanna_conversations: {
        Row: HannaConversation
        Insert: HannaConversationInsert
        Update: Partial<HannaConversationInsert>
      }
      hanna_analysis: {
        Row: HannaAnalysis
        Insert: HannaAnalysisInsert
        Update: Partial<HannaAnalysisInsert>
      }
      email_logs: {
        Row: EmailLog
        Insert: EmailLogInsert
        Update: Partial<EmailLogInsert>
      }
      admin_users: {
        Row: AdminUser
        Insert: Omit<AdminUser, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<AdminUser, 'id'>>
      }
      workshop_settings: {
        Row: WorkshopSetting
        Insert: Omit<WorkshopSetting, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<WorkshopSetting, 'id'>>
      }
      analytics_events: {
        Row: AnalyticsEvent
        Insert: AnalyticsEventInsert
        Update: Partial<AnalyticsEventInsert>
      }
    }
    Views: {
      v_registration_overview: {
        Row: {
          id: string
          email: string
          full_name: string
          phone: string | null
          country: string | null
          payment_status: string
          payment_method: string | null
          amount_paid: number | null
          registration_status: string
          created_at: string
          business_name: string | null
          industry: string | null
          profile_completed: boolean | null
          purchase_intent_score: number | null
          follow_up_priority: string | null
          conversation_count: number
        }
      }
      v_daily_stats: {
        Row: {
          date: string
          total_registrations: number
          paid_registrations: number
          total_revenue: number
        }
      }
    }
    Functions: {}
    Enums: {}
  }
}
