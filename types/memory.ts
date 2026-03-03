export type MemoryCategory =
  | 'business_info'
  | 'goal'
  | 'decision'
  | 'metric'
  | 'insight'
  | 'action_item'
  | 'preference'
  | 'challenge'

export interface UserMemoryItem {
  id: string
  user_id: string
  category: MemoryCategory
  content: string
  source_session_id: string | null
  confidence: number
  is_active: boolean
  is_pinned: boolean
  created_at: string
  updated_at: string
}

export interface CreateMemoryInput {
  category: MemoryCategory
  content: string
  source_session_id?: string
  confidence?: number
}

export interface UpdateMemoryInput {
  content?: string
  category?: MemoryCategory
  is_active?: boolean
  is_pinned?: boolean
}

export interface SessionSummary {
  id: string
  session_id: string
  user_id: string
  summary: string
  key_topics: string[]
  action_items: string[]
  message_count: number
  created_at: string
}

export interface ExtractedMemory {
  category: MemoryCategory
  content: string
  confidence: number
}

export const VALID_CATEGORIES: MemoryCategory[] = [
  'business_info', 'goal', 'decision', 'metric',
  'insight', 'action_item', 'preference', 'challenge',
]

export const MEMORY_CATEGORY_META: Record<MemoryCategory, {
  label: string
  emoji: string
  color: string
}> = {
  business_info: { label: 'Negocio', emoji: '\u{1F3E2}', color: '#2CB6D7' },
  goal: { label: 'Meta', emoji: '\u{1F3AF}', color: '#C7517E' },
  decision: { label: 'Decisi\u00F3n', emoji: '\u2696\uFE0F', color: '#36B3AE' },
  metric: { label: 'M\u00E9trica', emoji: '\u{1F4CA}', color: '#7C3AED' },
  insight: { label: 'Insight', emoji: '\u{1F4A1}', color: '#F59E0B' },
  action_item: { label: 'Acci\u00F3n', emoji: '\u2705', color: '#10B981' },
  preference: { label: 'Preferencia', emoji: '\u{1F49C}', color: '#8B5CF6' },
  challenge: { label: 'Reto', emoji: '\u{1F525}', color: '#EF4444' },
}
