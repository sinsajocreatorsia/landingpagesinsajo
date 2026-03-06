'use client'

import { Heart } from 'lucide-react'
import type { PromptLibraryItem } from '@/types/prompt-library'

interface PromptCardProps {
  prompt: PromptLibraryItem
  onSelect: (prompt: PromptLibraryItem) => void
  onToggleFavorite: (promptId: string) => void
}

const PLACEHOLDER_IMG = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzFhMWEyZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjY2IiBmb250LXNpemU9IjE2Ij5TaW4gaW1hZ2VuPC90ZXh0Pjwvc3ZnPg=='

export default function PromptCard({ prompt, onSelect, onToggleFavorite }: PromptCardProps) {
  const imageUrl = prompt.media?.[0]?.url || PLACEHOLDER_IMG
  const hasImage = prompt.media?.length > 0

  return (
    <div
      className="group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
      style={{
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
      onClick={() => onSelect(prompt)}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#1a1a2e]">
        <img
          src={imageUrl}
          alt={prompt.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = PLACEHOLDER_IMG
          }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Featured badge */}
        {prompt.is_featured && (
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/90 text-white">
            Destacado
          </div>
        )}

        {/* Favorite button */}
        <button
          className="absolute top-2 right-2 p-1.5 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110"
          style={{
            background: prompt.is_favorited ? 'rgba(199, 81, 126, 0.9)' : 'rgba(0,0,0,0.5)',
          }}
          onClick={(e) => {
            e.stopPropagation()
            onToggleFavorite(prompt.id)
          }}
        >
          <Heart
            className="w-4 h-4"
            fill={prompt.is_favorited ? 'white' : 'none'}
            stroke="white"
            strokeWidth={2}
          />
        </button>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="text-sm font-medium text-white line-clamp-2 leading-tight">
            {prompt.title}
          </h3>
        </div>
      </div>

      {/* Bottom info */}
      <div className="px-3 py-2 flex items-center justify-between text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
        <div className="flex items-center gap-3">
          <span>{prompt.view_count} vistas</span>
          <span>{prompt.copy_count} copias</span>
        </div>
        {!hasImage && (
          <span className="text-[10px] opacity-50">Sin preview</span>
        )}
      </div>
    </div>
  )
}
