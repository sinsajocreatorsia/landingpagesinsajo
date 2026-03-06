'use client'

import { useState, useEffect } from 'react'
import { X, Copy, Check, Wand2, Heart, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react'
import type { PromptLibraryItem } from '@/types/prompt-library'

interface PromptDetailModalProps {
  prompt: PromptLibraryItem | null
  related: PromptLibraryItem[]
  onClose: () => void
  onToggleFavorite: (promptId: string) => void
  onAskHanna: (prompt: PromptLibraryItem) => void
  onSelectRelated: (prompt: PromptLibraryItem) => void
}

const PLACEHOLDER_IMG = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzFhMWEyZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjY2IiBmb250LXNpemU9IjE2Ij5TaW4gaW1hZ2VuPC90ZXh0Pjwvc3ZnPg=='

export default function PromptDetailModal({
  prompt,
  related,
  onClose,
  onToggleFavorite,
  onAskHanna,
  onSelectRelated,
}: PromptDetailModalProps) {
  const [copied, setCopied] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    setCurrentImageIndex(0)
    setCopied(false)
  }, [prompt?.id])

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  if (!prompt) return null

  const images = prompt.media?.length > 0 ? prompt.media : [{ url: PLACEHOLDER_IMG, alt: 'Sin imagen' }]
  const allTags = [...prompt.use_cases, ...prompt.styles, ...prompt.subjects]

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(prompt!.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)

      // Track copy
      fetch('/api/hanna/prompts/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt_id: prompt!.id, action: 'copy' }),
      })
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea')
      textarea.value = prompt!.content
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.8)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, #022133, #200F5D)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        <div className="grid md:grid-cols-2 gap-0">
          {/* Left: Images */}
          <div className="relative bg-black/30">
            <div className="aspect-square flex items-center justify-center">
              <img
                src={images[currentImageIndex]?.url}
                alt={images[currentImageIndex]?.alt || prompt.title}
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = PLACEHOLDER_IMG
                }}
              />
            </div>

            {/* Image navigation */}
            {images.length > 1 && (
              <>
                <button
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                  onClick={() => setCurrentImageIndex(i => (i - 1 + images.length) % images.length)}
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                  onClick={() => setCurrentImageIndex(i => (i + 1) % images.length)}
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        i === currentImageIndex ? 'bg-white' : 'bg-white/30'
                      }`}
                      onClick={() => setCurrentImageIndex(i)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Right: Details */}
          <div className="p-6 flex flex-col gap-4">
            {/* Title */}
            <h2 className="text-xl font-bold text-white pr-8">{prompt.title}</h2>

            {/* Tags */}
            {allTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {allTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-full text-xs"
                    style={{
                      background: 'rgba(44, 182, 215, 0.15)',
                      color: '#2CB6D7',
                      border: '1px solid rgba(44, 182, 215, 0.3)',
                    }}
                  >
                    {tag.replace(/-/g, ' ')}
                  </span>
                ))}
              </div>
            )}

            {/* Description */}
            {prompt.description && (
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
                {prompt.description}
              </p>
            )}

            {/* Prompt content */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  Prompt
                </span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: copied ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255,255,255,0.1)',
                    color: copied ? '#22c55e' : 'white',
                  }}
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copiado' : 'Copiar'}
                </button>
              </div>
              <div
                className="p-3 rounded-lg text-sm font-mono max-h-48 overflow-y-auto leading-relaxed"
                style={{
                  background: 'rgba(0,0,0,0.3)',
                  color: 'rgba(255,255,255,0.85)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                {prompt.content}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-auto pt-2">
              <button
                onClick={() => onAskHanna(prompt)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #C7517E, #9b3d63)' }}
              >
                <Wand2 className="w-4 h-4" />
                Refinar con Hanna
              </button>
              <button
                onClick={() => onToggleFavorite(prompt.id)}
                className="p-2.5 rounded-xl transition-all hover:bg-white/10"
                style={{
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: prompt.is_favorited ? 'rgba(199, 81, 126, 0.2)' : 'transparent',
                }}
              >
                <Heart
                  className="w-5 h-5"
                  fill={prompt.is_favorited ? '#C7517E' : 'none'}
                  stroke={prompt.is_favorited ? '#C7517E' : 'white'}
                />
              </button>
            </div>

            {/* Meta */}
            <div className="flex items-center gap-4 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {prompt.author && <span>Por {prompt.author}</span>}
              {prompt.source_link && (
                <a
                  href={prompt.source_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-white/60 transition-colors"
                >
                  Fuente <ExternalLink className="w-3 h-3" />
                </a>
              )}
              <span>{prompt.view_count} vistas</span>
              <span>{prompt.favorite_count} favoritos</span>
            </div>
          </div>
        </div>

        {/* Related prompts */}
        {related.length > 0 && (
          <div className="px-6 pb-6">
            <h3 className="text-sm font-semibold text-white/70 mb-3">Prompts relacionados</h3>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {related.slice(0, 6).map((r) => (
                <div
                  key={r.id}
                  className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-[#2CB6D7] transition-all"
                  onClick={() => onSelectRelated(r)}
                >
                  <img
                    src={r.media?.[0]?.url || PLACEHOLDER_IMG}
                    alt={r.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = PLACEHOLDER_IMG
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
