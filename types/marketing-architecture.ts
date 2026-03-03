// ============================================
// Marketing Architecture Types
// Maps to the 6 pillar templates (01-avatar through 06-embudo)
// ============================================

export interface AvatarData {
  identity?: {
    selfDefinition?: string
    aspiredRole?: string
    identifiesWith?: string
  }
  beliefs?: Array<{ belief: string; reason: string }>
  frustrations?: Array<{ frustration: string; reason: string }>
  values?: Array<{ value: string; manifestation: string }>
  hell?: {
    mainFrustration?: string
    failedAttempts?: string[]
    consequences?: string[]
  }
  heaven?: {
    dreamResult?: string
    transformation?: Array<{ before: string; after: string }>
  }
  buyingBehavior?: {
    trigger?: string
    trustSignals?: string
    objections?: string
    justification?: string
  }
  antiAvatar?: Array<{ type: string; reason: string }>
  language?: {
    wordsToUse?: string[]
    wordsToAvoid?: string[]
  }
  summary?: string
}

export interface OfferData {
  basicInfo?: {
    name?: string
    type?: string
    oneLiner?: string
  }
  pricing?: {
    model?: string
    plans?: Array<{ name: string; price: string; includes: string }>
  }
  hook?: string
  valueStack?: Array<{ component: string; description: string; value: string }>
  bonuses?: Array<{ bonus: string; description: string; value: string }>
  guarantee?: {
    type?: string
    text?: string
  }
  valueEquation?: {
    dreamResult?: string
    probabilityOfSuccess?: string[]
    timeWithout?: string
    timeWith?: string
    effortWithout?: string
    effortWith?: string
  }
  differentiation?: Array<{ competitorSays: string; youSay: string }>
  unfairAdvantage?: string
  objections?: Array<{ objection: string; response: string }>
  cta?: string
  summary?: string
}

export interface CommunicationData {
  coreMessage?: string
  coldProspectMessage?: string
  warmProspectMessage?: string
  hotProspectMessage?: string
  positioning?: string
  positioningPhrase?: string
  enemies?: Array<{ name: string; description: string; consequence: string; attack: string }>
  contentPillars?: Array<{ pillar: string; description: string; keyMessage: string }>
  tone?: {
    formality?: string
    energy?: string
    technical?: string
    humor?: string
    adjectives?: string[]
  }
  hooks?: string[]
  wordsToUse?: string[]
  wordsToAvoid?: string[]
  originStory?: string
  breakingPoint?: string
  ctas?: Array<{ context: string; cta: string }>
  manifesto?: string
}

export interface ContentStrategyData {
  insight?: {
    currentBelief?: string
    truthNeeded?: string
    creatorRole?: string
  }
  categories?: Array<{
    name: string
    description: string
    reason: string
    exampleTitles: string[]
  }>
  contentToAvoid?: Array<{ type: string; reason: string }>
  channels?: Array<{
    name: string
    reason: string
    format: string
    frequency: string
  }>
  hookFormulas?: string[]
  bankOfIdeas?: Record<string, string[]>
  northStarMetric?: string
}

export interface BrandingData {
  essence?: {
    aesthetic?: string
    archetype?: string
    threeWords?: string[]
  }
  verbal?: {
    brandName?: string
    tagline?: string
    longDescription?: string
    shortDescription?: string
    oneLiner?: string
  }
  visual?: {
    colors?: Array<{ use: string; name: string; hex: string; when: string }>
    mode?: string
    typography?: Array<{ use: string; font: string; weight: string }>
  }
  personality?: {
    perceivedAge?: string
    personality?: string[]
    howSpeaks?: string
  }
  toneByContext?: Array<{ context: string; tone: string }>
}

export interface FunnelData {
  trafficChannels?: Array<{ channel: string; type: string; percentage: string }>
  capture?: {
    mechanism?: string
    leadMagnetName?: string
    leadMagnetDescription?: string
    problemSolved?: string
    headlineUrl?: string
    fields?: string[]
    ctaButton?: string
  }
  nurturing?: {
    channel?: string
    emailSequence?: Array<{ day: number; topic: string; objective: string }>
  }
  conversion?: {
    model?: string
    pageStructure?: string[]
    paymentPlatform?: string
    upsell?: string
  }
  retention?: {
    strategy?: string
    postPurchaseComms?: Array<{ when: string; what: string; channel: string }>
    churnGoal?: string
    ltvGoal?: string
  }
  referrals?: {
    hasProgram?: boolean
    incentive?: string
    naturalReason?: string
  }
  metrics?: {
    traffic?: string
    optInRate?: string
    openRate?: string
    conversionRate?: string
    churn?: string
  }
}

export interface MarketingArchitecture {
  id?: string
  user_id: string
  avatar: AvatarData
  offer: OfferData
  communication: CommunicationData
  content_strategy: ContentStrategyData
  branding: BrandingData
  funnel: FunnelData
  completion_percentage: number
  last_section_edited?: string
  created_at?: string
  updated_at?: string
}

export type ArchitectureSection = 'avatar' | 'offer' | 'communication' | 'content_strategy' | 'branding' | 'funnel'

export const SECTION_LABELS: Record<ArchitectureSection, string> = {
  avatar: 'Avatar de Cliente',
  offer: 'La Oferta',
  communication: 'Comunicacion',
  content_strategy: 'Estrategia de Contenido',
  branding: 'Branding',
  funnel: 'Embudo de Conversion',
}

export const SECTION_ICONS: Record<ArchitectureSection, string> = {
  avatar: 'Users',
  offer: 'Gift',
  communication: 'MessageSquare',
  content_strategy: 'FileText',
  branding: 'Palette',
  funnel: 'Filter',
}

export const SECTION_ORDER: ArchitectureSection[] = [
  'avatar',
  'offer',
  'communication',
  'content_strategy',
  'branding',
  'funnel',
]
