import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Client-side Supabase client (uses anon key)
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Server-side Supabase client (uses service role key for admin operations)
export const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Helper to get the appropriate client
export function getSupabaseClient(isServer: boolean = false) {
  return isServer ? supabaseAdmin : supabase
}

// Re-export types for convenience
export type {
  Database,
  WorkshopRegistration,
  WorkshopProfile,
  HannaConversation,
  HannaAnalysis,
  EmailLog,
  AdminUser,
  WorkshopSetting,
  AnalyticsEvent,
  ChatMessage,
} from './database.types'

// Legacy Lead type for backward compatibility
export interface Lead {
  id?: string
  name: string
  email: string
  company: string
  phone: string
  challenge: string
  created_at?: string
  updated_at?: string
}
