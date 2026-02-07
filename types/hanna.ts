// ============================================
// HANNA SaaS Product - TypeScript Types
// ============================================

export type Plan = 'free' | 'pro'
export type SubscriptionStatus = 'active' | 'cancelled' | 'past_due'
export type MessageRole = 'user' | 'assistant' | 'system'
export type CouponType = 'workshop' | 'promo' | 'referral'
export type DiscountType = 'percentage' | 'fixed' | 'free_months'

// ============================================
// User Profile (extended for HANNA)
// ============================================
export interface HannaUserProfile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  plan: Plan
  subscription_status: SubscriptionStatus
  stripe_customer_id?: string
  stripe_subscription_id?: string
  messages_today: number
  last_message_date: string
  plan_started_at?: string
  plan_expires_at?: string
  created_at: string
  updated_at: string
}

// ============================================
// Chat Sessions
// ============================================
export interface HannaSession {
  id: string
  user_id: string
  title: string
  business_context: Record<string, unknown>
  created_at: string
  updated_at: string
  is_active: boolean
}

export interface CreateSessionInput {
  title?: string
  business_context?: Record<string, unknown>
}

// ============================================
// Chat Messages
// ============================================
export interface HannaMessage {
  id: string
  session_id: string
  role: MessageRole
  content: string
  tokens_used: number
  created_at: string
}

export interface CreateMessageInput {
  session_id: string
  role: MessageRole
  content: string
  tokens_used?: number
}

// ============================================
// Business Profile
// ============================================
export interface HannaBusinessProfile {
  id: string
  user_id: string
  business_name?: string
  business_type?: string
  target_audience?: string
  brand_voice?: string
  products_services?: string
  unique_value_proposition?: string
  common_questions: string[]
  custom_instructions?: string
  created_at: string
  updated_at: string
}

export interface UpdateBusinessProfileInput {
  business_name?: string
  business_type?: string
  target_audience?: string
  brand_voice?: string
  products_services?: string
  unique_value_proposition?: string
  common_questions?: string[]
  custom_instructions?: string
}

// ============================================
// Coupons
// ============================================
export interface HannaCoupon {
  id: string
  code: string
  type: CouponType
  discount_type: DiscountType
  discount_value: number
  free_months: number
  max_uses?: number
  current_uses: number
  valid_from: string
  valid_until?: string
  is_active: boolean
  created_at: string
}

export interface CouponRedemption {
  id: string
  coupon_id: string
  user_id: string
  redeemed_at: string
}

// ============================================
// API Response Types
// ============================================
export interface ChatResponse {
  success: boolean
  response?: string
  tokens_used?: number
  messages_remaining?: number
  error?: string
}

export interface MessageLimitResponse {
  can_send: boolean
  messages_remaining: number
  plan: Plan
  upgrade_url?: string
}

// ============================================
// Plan Configuration
// ============================================
export const PLAN_LIMITS = {
  free: {
    messages_per_day: 5,
    history_days: 7,
    business_profile: false,
    voice_enabled: false,
    price: 0,
  },
  pro: {
    messages_per_day: Infinity,
    history_days: Infinity,
    business_profile: true,
    voice_enabled: true,
    price: 19,
  },
} as const

export const PLAN_FEATURES = {
  free: [
    '5 mensajes por día',
    'Historial de 7 días',
    'Chat básico con Hanna',
  ],
  pro: [
    'Mensajes ilimitados',
    'Historial completo',
    'Perfil de negocio personalizado',
    'Voz (hablar con Hanna)',
    'Respuestas adaptadas a tu marca',
    'Soporte prioritario',
  ],
} as const

// ============================================
// Stripe Configuration
// ============================================
export const STRIPE_PRICES = {
  pro_monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO || 'price_xxx',
} as const
