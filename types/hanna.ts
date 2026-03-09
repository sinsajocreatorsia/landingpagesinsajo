// ============================================
// HANNA SaaS Product - TypeScript Types
// ============================================

export type Plan = 'free' | 'pro' | 'business'
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
    messages_per_day: Infinity,
    history_days: 7,
    history_context: 10,
    max_tokens: 600,
    business_profile: false,
    voice_enabled: true,
    voice_engine: 'edge-tts' as const,
    stt_enabled: false,
    memory_limit: 10,
    summary_limit: 1,
    reminders_limit: 0,
    file_upload: false,
    file_limit: 0,
    file_max_size_mb: 0,
    adaptive_tone: false,
    export_conversations: false,
    weekly_summary: false,
    price: 0,
  },
  pro: {
    messages_per_day: Infinity,
    history_days: Infinity,
    history_context: 20,
    max_tokens: 1500,
    business_profile: true,
    voice_enabled: true,
    voice_engine: 'edge-tts-ssml' as const,
    stt_enabled: true,
    memory_limit: 30,
    summary_limit: 3,
    reminders_limit: 5,
    file_upload: true,
    file_limit: 5,
    file_max_size_mb: 5,
    adaptive_tone: true,
    adaptive_tone_patterns: 10,
    export_conversations: false,
    weekly_summary: false,
    price: 15,
  },
  business: {
    messages_per_day: Infinity,
    history_days: Infinity,
    history_context: 30,
    max_tokens: 2500,
    business_profile: true,
    voice_enabled: true,
    voice_engine: 'openai-tts' as const,
    stt_enabled: true,
    memory_limit: 50,
    summary_limit: 5,
    reminders_limit: 20,
    file_upload: true,
    file_limit: 20,
    file_max_size_mb: 25,
    adaptive_tone: true,
    adaptive_tone_patterns: 30,
    export_conversations: true,
    weekly_summary: true,
    price: 29,
  },
} as const

export const PLAN_FEATURES = {
  free: [
    'Mensajes ilimitados',
    'Historial de 7 días',
    'Chat básico con Hanna',
    'Voz básica (escucha a Hanna)',
  ],
  pro: [
    'Mensajes ilimitados',
    'Historial completo',
    'Perfil de negocio personalizado',
    'Voz mejorada + micrófono',
    'IA estratégica (Gemini 2.5 Pro)',
    'Hanna aprende tu estilo',
    '5 recordatorios activos',
    'Subir archivos (imágenes, PDFs)',
    'Diagramas y visualizaciones',
    'Respuestas adaptadas a tu marca',
    'Soporte por email',
  ],
  business: [
    'Todo lo de Pro',
    'Voz HD ultra-natural (OpenAI)',
    'IA Premium (Claude + Gemini Pro)',
    'Hanna aprende tu estilo completo',
    '20 recordatorios + seguimiento diario',
    'Subir hasta 20 archivos (25MB c/u)',
    'Resumen semanal automático',
    'Análisis de negocio avanzado',
    'Memoria de negocio extendida (50)',
    'Exportar conversaciones',
    'Soporte prioritario',
    'Acceso anticipado a nuevas funciones',
  ],
} as const

// ============================================
// Stripe Configuration
// ============================================
export const STRIPE_PRICES = {
  pro_monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO || 'price_xxx',
} as const
