export interface SurveyFormData {
  // Section 1: Satisfaction
  overallRating: number
  likedMost: LikedOption[]
  improvements: ImprovementOption[]
  suggestions: string

  // Section 2: Learning Impact (NEW)
  learnedSkills: LearnedSkillOption[]
  knowledgeBefore: number
  knowledgeAfter: number
  firstImplementation: FirstImplementationOption | ''
  implementationBarriers: ImplementationBarrierOption[]

  // Section 3: Logistics & Expectations (NEW)
  expectationsMet: number
  durationFeedback: DurationFeedbackOption | ''
  scheduleFeedback: ScheduleFeedbackOption | ''
  preferredFormat: PreferredFormatOption | ''

  // Section 4: Future Interest
  futureTopics: FutureTopicOption[]
  futureTopicsOther: string
  continuingInterest: number
  willingnessToPay: WillingnessToPayOption | ''
  npsScore: number

  // Section 5: Community
  communityInterest: 'yes' | 'no' | 'maybe' | ''
  communityValues: CommunityValueOption[]
  preferredPlatform: PlatformOption | ''

  // Section 6: Contact & Google Review
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

export type LearnedSkillOption =
  | 'prompting'
  | 'content_with_ai'
  | 'automation_basics'
  | 'ai_tools_overview'
  | 'business_strategy_ai'
  | 'customer_service_ai'

export type FirstImplementationOption =
  | 'social_media_content'
  | 'customer_responses'
  | 'business_planning'
  | 'automating_tasks'
  | 'branding_materials'
  | 'not_sure'

export type ImplementationBarrierOption =
  | 'lack_of_time'
  | 'need_more_practice'
  | 'too_technical'
  | 'no_clear_use_case'
  | 'cost_of_tools'
  | 'none'

export type DurationFeedbackOption =
  | 'too_short'
  | 'just_right'
  | 'too_long'

export type ScheduleFeedbackOption =
  | 'perfect'
  | 'prefer_morning'
  | 'prefer_afternoon'
  | 'prefer_evening'
  | 'prefer_weekend'

export type PreferredFormatOption =
  | 'in_person'
  | 'virtual'
  | 'hybrid'
  | 'series_weekly'

export type WillingnessToPayOption =
  | 'free_only'
  | 'up_to_50'
  | 'up_to_100'
  | 'up_to_200'
  | 'more_than_200'

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
  learned_skills: string[]
  knowledge_before: number | null
  knowledge_after: number | null
  first_implementation: string | null
  implementation_barriers: string[]
  expectations_met: number | null
  duration_feedback: string | null
  schedule_feedback: string | null
  preferred_format: string | null
  future_topics: string[]
  future_topics_other: string | null
  continuing_interest: number
  willingness_to_pay: string | null
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

export const LEARNED_SKILL_OPTIONS: { value: LearnedSkillOption; label: string }[] = [
  { value: 'prompting', label: 'Como hacer buenos prompts' },
  { value: 'content_with_ai', label: 'Crear contenido con IA' },
  { value: 'automation_basics', label: 'Bases de automatizacion' },
  { value: 'ai_tools_overview', label: 'Conocer herramientas de IA' },
  { value: 'business_strategy_ai', label: 'Estrategia de negocio con IA' },
  { value: 'customer_service_ai', label: 'Servicio al cliente con IA' },
]

export const FIRST_IMPLEMENTATION_OPTIONS: { value: FirstImplementationOption; label: string }[] = [
  { value: 'social_media_content', label: 'Contenido para redes sociales' },
  { value: 'customer_responses', label: 'Respuestas a clientes' },
  { value: 'business_planning', label: 'Planificacion de negocio' },
  { value: 'automating_tasks', label: 'Automatizar tareas repetitivas' },
  { value: 'branding_materials', label: 'Materiales de branding' },
  { value: 'not_sure', label: 'Aun no estoy segura' },
]

export const IMPLEMENTATION_BARRIER_OPTIONS: { value: ImplementationBarrierOption; label: string }[] = [
  { value: 'lack_of_time', label: 'Falta de tiempo' },
  { value: 'need_more_practice', label: 'Necesito mas practica' },
  { value: 'too_technical', label: 'Es muy tecnico para mi' },
  { value: 'no_clear_use_case', label: 'No se por donde empezar' },
  { value: 'cost_of_tools', label: 'Costo de las herramientas' },
  { value: 'none', label: 'Ninguna, estoy lista!' },
]

export const DURATION_FEEDBACK_OPTIONS: { value: DurationFeedbackOption; label: string }[] = [
  { value: 'too_short', label: 'Muy corto' },
  { value: 'just_right', label: 'Perfecto' },
  { value: 'too_long', label: 'Muy largo' },
]

export const SCHEDULE_FEEDBACK_OPTIONS: { value: ScheduleFeedbackOption; label: string }[] = [
  { value: 'perfect', label: 'El horario fue perfecto' },
  { value: 'prefer_morning', label: 'Prefiero en la manana' },
  { value: 'prefer_afternoon', label: 'Prefiero en la tarde' },
  { value: 'prefer_evening', label: 'Prefiero en la noche' },
  { value: 'prefer_weekend', label: 'Prefiero fin de semana' },
]

export const PREFERRED_FORMAT_OPTIONS: { value: PreferredFormatOption; label: string }[] = [
  { value: 'in_person', label: 'Presencial' },
  { value: 'virtual', label: 'Virtual (Zoom)' },
  { value: 'hybrid', label: 'Hibrido' },
  { value: 'series_weekly', label: 'Serie de sesiones semanales' },
]

export const WILLINGNESS_TO_PAY_OPTIONS: { value: WillingnessToPayOption; label: string }[] = [
  { value: 'free_only', label: 'Solo si es gratis' },
  { value: 'up_to_50', label: 'Hasta $50' },
  { value: 'up_to_100', label: 'Hasta $100' },
  { value: 'up_to_200', label: 'Hasta $200' },
  { value: 'more_than_200', label: 'Mas de $200' },
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
