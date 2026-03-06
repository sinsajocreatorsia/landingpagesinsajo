// Prompt Library Types

export interface PromptMedia {
  url: string
  width?: number
  height?: number
  alt?: string
}

export interface PromptLibraryItem {
  id: string
  source_external_id: string | null
  title: string
  description: string | null
  content: string
  language: string
  author: string | null
  source_link: string | null
  is_featured: boolean
  media: PromptMedia[]
  use_cases: string[]
  styles: string[]
  subjects: string[]
  view_count: number
  favorite_count: number
  copy_count: number
  chat_use_count: number
  created_at: string
  updated_at: string
  is_favorited?: boolean
}

export type PromptCategoryType = 'use_case' | 'style' | 'subject'

export interface PromptCategory {
  id: string
  type: PromptCategoryType
  slug: string
  label: string
  label_es: string | null
  description: string | null
  prompt_count: number
}

export interface PromptFavorite {
  id: string
  user_id: string
  prompt_id: string
  created_at: string
}

export type PromptUsageAction = 'view' | 'copy' | 'favorite' | 'unfavorite' | 'chat_use'

export interface PromptSearchParams {
  q?: string
  use_cases?: string[]
  styles?: string[]
  subjects?: string[]
  featured?: boolean
  sort?: 'newest' | 'popular' | 'most_copied'
  page?: number
  limit?: number
}

export interface PromptListResponse {
  success: boolean
  prompts: PromptLibraryItem[]
  total: number
  page: number
  totalPages: number
}

export interface PromptDetailResponse {
  success: boolean
  prompt: PromptLibraryItem
  related: PromptLibraryItem[]
}
