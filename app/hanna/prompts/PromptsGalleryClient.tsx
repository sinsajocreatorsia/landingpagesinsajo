'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Search, SlidersHorizontal, X, Sparkles } from 'lucide-react'
import Link from 'next/link'
import type { PromptLibraryItem, PromptCategory } from '@/types/prompt-library'
import PromptCard from './PromptCard'
import PromptDetailModal from './PromptDetailModal'

type SortOption = 'popular' | 'newest' | 'most_copied'

const SORT_LABELS: Record<SortOption, string> = {
  popular: 'Populares',
  newest: 'Recientes',
  most_copied: 'Mas copiados',
}

const CATEGORY_TYPE_LABELS: Record<string, string> = {
  use_cases: 'Uso',
  styles: 'Estilo',
  subjects: 'Tema',
}

export default function PromptsGalleryClient() {
  const router = useRouter()

  // Data
  const [prompts, setPrompts] = useState<PromptLibraryItem[]>([])
  const [categories, setCategories] = useState<{
    use_cases: PromptCategory[]
    styles: PromptCategory[]
    subjects: PromptCategory[]
  }>({ use_cases: [], styles: [], subjects: [] })
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  // UI state
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [sort, setSort] = useState<SortOption>('popular')
  const [selectedUseCases, setSelectedUseCases] = useState<string[]>([])
  const [selectedStyles, setSelectedStyles] = useState<string[]>([])
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  // Modal
  const [selectedPrompt, setSelectedPrompt] = useState<PromptLibraryItem | null>(null)
  const [relatedPrompts, setRelatedPrompts] = useState<PromptLibraryItem[]>([])

  const observerRef = useRef<HTMLDivElement>(null)
  const searchTimerRef = useRef<NodeJS.Timeout>(null)

  // Fetch categories once
  useEffect(() => {
    fetch('/api/hanna/prompts/categories')
      .then(r => r.json())
      .then(data => {
        if (data.success) setCategories(data.categories)
      })
      .catch(() => {})
  }, [])

  // Build query string
  const buildQuery = useCallback((p: number) => {
    const params = new URLSearchParams()
    if (search) params.set('q', search)
    if (selectedUseCases.length) params.set('use_cases', selectedUseCases.join(','))
    if (selectedStyles.length) params.set('styles', selectedStyles.join(','))
    if (selectedSubjects.length) params.set('subjects', selectedSubjects.join(','))
    params.set('sort', sort)
    params.set('page', String(p))
    params.set('limit', '24')
    return params.toString()
  }, [search, selectedUseCases, selectedStyles, selectedSubjects, sort])

  // Fetch prompts
  const fetchPrompts = useCallback(async (p: number, append = false) => {
    if (append) setLoadingMore(true)
    else setLoading(true)

    try {
      const res = await fetch(`/api/hanna/prompts?${buildQuery(p)}`)
      const data = await res.json()

      if (data.success) {
        if (append) {
          setPrompts(prev => [...prev, ...data.prompts])
        } else {
          setPrompts(data.prompts)
        }
        setTotal(data.total)
        setTotalPages(data.totalPages)
        setPage(p)
      }
    } catch {
      // Silently fail
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [buildQuery])

  // Initial load and filter changes
  useEffect(() => {
    fetchPrompts(1)
  }, [search, selectedUseCases, selectedStyles, selectedSubjects, sort])

  // Debounced search
  function handleSearchInput(value: string) {
    setSearchInput(value)
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current)
    searchTimerRef.current = setTimeout(() => {
      setSearch(value)
    }, 400)
  }

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore && page < totalPages) {
          fetchPrompts(page + 1, true)
        }
      },
      { threshold: 0.1 }
    )
    if (observerRef.current) observer.observe(observerRef.current)
    return () => observer.disconnect()
  }, [page, totalPages, loadingMore, fetchPrompts])

  // Toggle category filter
  function toggleFilter(type: 'use_cases' | 'styles' | 'subjects', slug: string) {
    const setter = type === 'use_cases' ? setSelectedUseCases
      : type === 'styles' ? setSelectedStyles
      : setSelectedSubjects
    setter(prev =>
      prev.includes(slug)
        ? prev.filter(s => s !== slug)
        : [...prev, slug]
    )
  }

  // Toggle favorite
  async function handleToggleFavorite(promptId: string) {
    try {
      const res = await fetch('/api/hanna/prompts/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt_id: promptId }),
      })
      const data = await res.json()

      if (data.error === 'No autorizado') {
        router.push('/hanna/login?redirect=/hanna/prompts')
        return
      }

      if (data.success) {
        // Update in list
        setPrompts(prev => prev.map(p =>
          p.id === promptId
            ? { ...p, is_favorited: data.favorited, favorite_count: p.favorite_count + (data.favorited ? 1 : -1) }
            : p
        ))
        // Update in modal
        if (selectedPrompt?.id === promptId) {
          setSelectedPrompt(prev => prev ? {
            ...prev,
            is_favorited: data.favorited,
            favorite_count: prev.favorite_count + (data.favorited ? 1 : -1),
          } : null)
        }
      }
    } catch {
      // Silently fail
    }
  }

  // Open detail modal
  async function handleSelectPrompt(prompt: PromptLibraryItem) {
    setSelectedPrompt(prompt)
    setRelatedPrompts([])

    try {
      const res = await fetch(`/api/hanna/prompts/${prompt.id}`)
      const data = await res.json()
      if (data.success) {
        setSelectedPrompt(data.prompt)
        setRelatedPrompts(data.related || [])
      }
    } catch {
      // Keep the prompt we already have
    }
  }

  // Navigate to Hanna chat with prompt reference
  function handleAskHanna(prompt: PromptLibraryItem) {
    // Track usage
    fetch('/api/hanna/prompts/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt_id: prompt.id, action: 'chat_use' }),
    })

    router.push(`/hanna/dashboard?prompt_ref=${prompt.id}`)
  }

  const hasActiveFilters = selectedUseCases.length > 0 || selectedStyles.length > 0 || selectedSubjects.length > 0
  const activeFilterCount = selectedUseCases.length + selectedStyles.length + selectedSubjects.length

  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(135deg, #022133 0%, #200F5D 100%)' }}
    >
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl" style={{ background: 'rgba(2, 33, 51, 0.85)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3 mb-3">
            <Link
              href="/hanna/dashboard"
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5" style={{ color: '#2CB6D7' }} />
                Biblioteca de Prompts
              </h1>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                {total > 0 ? `${total.toLocaleString()} prompts disponibles` : 'Cargando...'}
              </p>
            </div>
          </div>

          {/* Search + Filter bar */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(255,255,255,0.4)' }} />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => handleSearchInput(e.target.value)}
                placeholder="Buscar prompts..."
                className="w-full pl-10 pr-4 py-2 rounded-xl text-sm text-white placeholder:text-white/30 outline-none transition-all focus:ring-2"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              />
              {searchInput && (
                <button
                  onClick={() => { setSearchInput(''); setSearch('') }}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-white/40 hover:text-white/70" />
                </button>
              )}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm transition-all ${
                showFilters || hasActiveFilters ? 'text-white' : 'text-white/60'
              }`}
              style={{
                background: hasActiveFilters ? 'rgba(44, 182, 215, 0.2)' : 'rgba(255,255,255,0.08)',
                border: `1px solid ${hasActiveFilters ? 'rgba(44, 182, 215, 0.4)' : 'rgba(255,255,255,0.1)'}`,
              }}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filtros
              {activeFilterCount > 0 && (
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                  style={{ background: '#2CB6D7', color: '#022133' }}
                >
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Sort dropdown */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="px-3 py-2 rounded-xl text-sm text-white/80 outline-none cursor-pointer"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              {Object.entries(SORT_LABELS).map(([value, label]) => (
                <option key={value} value={value} style={{ background: '#022133' }}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Filters panel */}
          {showFilters && (
            <div className="mt-3 p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.08)' }}>
              {(['use_cases', 'styles', 'subjects'] as const).map((type) => {
                const cats = categories[type]
                if (!cats || cats.length === 0) return null
                const selected = type === 'use_cases' ? selectedUseCases
                  : type === 'styles' ? selectedStyles
                  : selectedSubjects

                return (
                  <div key={type} className="mb-3 last:mb-0">
                    <span className="text-xs font-medium uppercase tracking-wider mb-1.5 block" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      {CATEGORY_TYPE_LABELS[type]}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {cats.slice(0, 20).map((cat) => {
                        const isSelected = selected.includes(cat.slug)
                        return (
                          <button
                            key={cat.slug}
                            onClick={() => toggleFilter(type, cat.slug)}
                            className="px-2.5 py-1 rounded-full text-xs transition-all"
                            style={{
                              background: isSelected ? 'rgba(44, 182, 215, 0.25)' : 'rgba(255,255,255,0.06)',
                              color: isSelected ? '#2CB6D7' : 'rgba(255,255,255,0.6)',
                              border: `1px solid ${isSelected ? 'rgba(44, 182, 215, 0.4)' : 'rgba(255,255,255,0.1)'}`,
                            }}
                          >
                            {cat.label_es || cat.label} {cat.prompt_count > 0 && `(${cat.prompt_count})`}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}

              {hasActiveFilters && (
                <button
                  onClick={() => { setSelectedUseCases([]); setSelectedStyles([]); setSelectedSubjects([]) }}
                  className="mt-2 text-xs hover:text-white/80 transition-colors"
                  style={{ color: '#C7517E' }}
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Gallery grid */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl overflow-hidden animate-pulse"
                style={{ background: 'rgba(255,255,255,0.05)' }}
              >
                <div className="aspect-[4/3] bg-white/5" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-white/5 rounded w-3/4" />
                  <div className="h-2 bg-white/5 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : prompts.length === 0 ? (
          <div className="text-center py-20">
            <Sparkles className="w-12 h-12 mx-auto mb-4" style={{ color: 'rgba(255,255,255,0.2)' }} />
            <p className="text-lg font-medium text-white/60">No se encontraron prompts</p>
            <p className="text-sm text-white/30 mt-1">Intenta con otros terminos o limpia los filtros</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {prompts.map((prompt) => (
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                  onSelect={handleSelectPrompt}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>

            {/* Infinite scroll trigger */}
            <div ref={observerRef} className="h-10 mt-6">
              {loadingMore && (
                <div className="flex justify-center">
                  <div className="w-6 h-6 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
                </div>
              )}
            </div>

            {page >= totalPages && prompts.length > 0 && (
              <p className="text-center text-xs text-white/30 mt-4">
                Mostrando todos los {total} prompts
              </p>
            )}
          </>
        )}
      </main>

      {/* Detail modal */}
      <PromptDetailModal
        prompt={selectedPrompt}
        related={relatedPrompts}
        onClose={() => setSelectedPrompt(null)}
        onToggleFavorite={handleToggleFavorite}
        onAskHanna={handleAskHanna}
        onSelectRelated={handleSelectPrompt}
      />
    </div>
  )
}
