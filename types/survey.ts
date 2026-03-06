export interface SurveyFormData {
  // Section 1: Satisfaction
  overallRating: number
  likedMost: LikedOption[]
  improvements: ImprovementOption[]
  suggestions: string

  // Section 2: Future Interest
  futureTopics: FutureTopicOption[]
  futureTopicsOther: string
  continuingInterest: number
  npsScore: number

  // Section 3: Community
  communityInterest: 'yes' | 'no' | 'maybe' | ''
  communityValues: CommunityValueOption[]
  preferredPlatform: PlatformOption | ''

  // Section 4: Contact & Google Review
  email: string
  fullName: string
  googleRating: number
}

export type LikedOption =
  | 'content'
  | 'methodology'
  | 'speaker'
  | 'community'
  | 'practical_exercises'
  | 'tools_shown'

export type ImprovementOption =
  | 'duration'
  | 'content_depth'
  | 'more_practice'
  | 'more_examples'
  | 'pace'
  | 'materials'

export type FutureTopicOption =
  | 'ai_marketing'
  | 'ai_content_creation'
  | 'ai_business_strategy'
  | 'ai_automation'
  | 'ai_branding'
  | 'other'

export type CommunityValueOption =
  | 'live_sessions'
  | 'templates'
  | 'private_group'
  | 'mentoring'
  | 'discounts'

export type PlatformOption =
  | 'whatsapp'
  | 'discord'
  | 'telegram'
  | 'facebook_group'

export interface SurveySubmitResponse {
  success: boolean
  couponCode?: string
  message?: string
  error?: string
  shouldRedirectToGoogle?: boolean
  googleReviewUrl?: string
}

export interface SurveyRecord {
  id: string
  email: string
  full_name: string
  overall_rating: number
  liked_most: string[]
  improvements: string[]
  suggestions: string | null
  future_topics: string[]
  future_topics_other: string | null
  continuing_interest: number
  nps_score: number
  community_interest: string
  community_values: string[]
  preferred_platform: string | null
  google_rating: number | null
  google_review_clicked: boolean
  coupon_code: string | null
  workshop_id: string
  created_at: string
}

export interface SurveyStats {
  totalResponses: number
  avgRating: number
  avgNps: number
  npsCalculated: number
  promoters: number
  passives: number
  detractors: number
  communityYes: number
  communityMaybe: number
  googleReviewsSent: number
  avgContinuingInterest: number
}

export const LIKED_OPTIONS: { value: LikedOption; label: string }[] = [
  { value: 'content', label: 'Contenido del taller' },
  { value: 'methodology', label: 'Metodologia' },
  { value: 'speaker', label: 'La ponente/facilitadora' },
  { value: 'community', label: 'Comunidad y networking' },
  { value: 'practical_exercises', label: 'Ejercicios practicos' },
  { value: 'tools_shown', label: 'Herramientas mostradas' },
]

export const IMPROVEMENT_OPTIONS: { value: ImprovementOption; label: string }[] = [
  { value: 'duration', label: 'Duracion del taller' },
  { value: 'content_depth', label: 'Profundidad del contenido' },
  { value: 'more_practice', label: 'Mas practica hands-on' },
  { value: 'more_examples', label: 'Mas ejemplos reales' },
  { value: 'pace', label: 'Ritmo del taller' },
  { value: 'materials', label: 'Materiales de apoyo' },
]

export const FUTURE_TOPIC_OPTIONS: { value: FutureTopicOption; label: string }[] = [
  { value: 'ai_marketing', label: 'IA para Marketing' },
  { value: 'ai_content_creation', label: 'IA para Creacion de Contenido' },
  { value: 'ai_business_strategy', label: 'IA para Estrategia de Negocio' },
  { value: 'ai_automation', label: 'IA para Automatizacion' },
  { value: 'ai_branding', label: 'IA para Branding' },
  { value: 'other', label: 'Otro' },
]

export const COMMUNITY_VALUE_OPTIONS: { value: CommunityValueOption; label: string }[] = [
  { value: 'live_sessions', label: 'Sesiones en vivo' },
  { value: 'templates', label: 'Templates y plantillas' },
  { value: 'private_group', label: 'Grupo privado' },
  { value: 'mentoring', label: 'Mentoria personalizada' },
  { value: 'discounts', label: 'Descuentos exclusivos' },
]

export const PLATFORM_OPTIONS: { value: PlatformOption; label: string }[] = [
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'discord', label: 'Discord' },
  { value: 'telegram', label: 'Telegram' },
  { value: 'facebook_group', label: 'Facebook Group' },
]
