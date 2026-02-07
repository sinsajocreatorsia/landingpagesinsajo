// Helpers for Supabase operations on tables without full type definitions
// These are typed at runtime but bypass strict compile-time checking

import { supabaseAdmin, supabase } from './supabase'

// Generic type for untyped table data
type AnyRecord = Record<string, unknown>

// Coupon types
export interface Coupon {
  id: string
  code: string
  type: string
  discount_type: string
  discount_value: number
  free_months: number | null
  valid_until: string | null
  is_active: boolean
  max_uses: number | null
  current_uses: number
  created_at: string
}

// Session types
export interface Session {
  id: string
  user_id: string
  title: string | null
  created_at: string
  updated_at: string
  is_active?: boolean
}

// Message types
export interface Message {
  id: string
  session_id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

// Profile types
export interface UserProfile {
  id: string
  email: string | null
  full_name: string | null
  plan: string | null
  messages_today: number | null
  last_message_date: string | null
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  subscription_status: string | null
  subscription_end_date: string | null
  plan_started_at: string | null
  plan_expires_at: string | null
}

// Helper to get untyped table from supabaseAdmin
function getTable(tableName: string) {
  return (supabaseAdmin.from(tableName) as ReturnType<typeof supabaseAdmin.from>)
}

// Coupon operations (uses discount_coupons table)
export const couponsTable = {
  async findByCode(code: string) {
    const { data, error } = await getTable('discount_coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single()
    // Map times_used to current_uses for compatibility
    if (data) {
      (data as AnyRecord).current_uses = (data as AnyRecord).times_used || 0
    }
    return { data: data as Coupon | null, error }
  },

  async incrementUses(couponId: string, currentUses: number) {
    return getTable('discount_coupons')
      .update({ times_used: currentUses + 1 } as AnyRecord)
      .eq('id', couponId)
  },
}

// Session operations
export const sessionsTable = {
  async getByUserId(userId: string) {
    const { data, error } = await getTable('hanna_sessions')
      .select('*, hanna_messages(id)')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
    return { data: data as (Session & { hanna_messages: { id: string }[] })[] | null, error }
  },

  async getById(sessionId: string, userId: string) {
    const { data, error } = await getTable('hanna_sessions')
      .select('*, hanna_messages(*)')
      .eq('id', sessionId)
      .eq('user_id', userId)
      .single()
    return { data: data as (Session & { hanna_messages: Message[] }) | null, error }
  },

  async create(userId: string, title?: string) {
    const { data, error } = await getTable('hanna_sessions')
      .insert({
        user_id: userId,
        title: title || 'Nueva conversación',
      } as AnyRecord)
      .select()
      .single()
    return { data: data as Session | null, error }
  },

  async update(sessionId: string, userId: string, updates: Partial<Session>) {
    const { data, error } = await getTable('hanna_sessions')
      .update({ ...updates, updated_at: new Date().toISOString() } as AnyRecord)
      .eq('id', sessionId)
      .eq('user_id', userId)
      .select()
      .single()
    return { data: data as Session | null, error }
  },

  async softDelete(sessionId: string, userId: string) {
    return getTable('hanna_sessions')
      .update({ is_active: false, updated_at: new Date().toISOString() } as AnyRecord)
      .eq('id', sessionId)
      .eq('user_id', userId)
  },
}

// Profile operations
export const profilesTable = {
  async getById(userId: string) {
    const { data, error } = await getTable('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    return { data: data as UserProfile | null, error }
  },

  async update(userId: string, updates: Partial<UserProfile>) {
    return getTable('profiles')
      .update(updates as AnyRecord)
      .eq('id', userId)
  },

  async updatePlan(userId: string, plan: string, options: {
    subscription_status?: string
    plan_started_at?: string
    plan_expires_at?: string | null
  }) {
    return getTable('profiles')
      .update({
        plan,
        subscription_status: options.subscription_status || 'active',
        plan_started_at: options.plan_started_at || new Date().toISOString(),
        plan_expires_at: options.plan_expires_at || null,
      } as AnyRecord)
      .eq('id', userId)
  },
}

// Coupon redemption operations
export const redemptionsTable = {
  async create(couponId: string, userId: string) {
    return getTable('hanna_coupon_redemptions')
      .insert({
        coupon_id: couponId,
        user_id: userId,
      } as AnyRecord)
  },
}
