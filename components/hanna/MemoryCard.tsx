'use client'

import { useState } from 'react'
import { Pin, PinOff, Trash2, Check, X, Pencil } from 'lucide-react'
import { MEMORY_CATEGORY_META } from '@/types/memory'
import type { UserMemoryItem, UpdateMemoryInput, MemoryCategory } from '@/types/memory'

interface MemoryCardProps {
  memory: UserMemoryItem
  onUpdate: (id: string, input: UpdateMemoryInput) => Promise<void>
  onDelete: (id: string) => Promise<void>
  readOnly?: boolean
}

export function MemoryCard({ memory, onUpdate, onDelete, readOnly = false }: MemoryCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(memory.content)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const meta = MEMORY_CATEGORY_META[memory.category as MemoryCategory]

  const handleSave = async () => {
    if (!editContent.trim() || editContent === memory.content) {
      setIsEditing(false)
      setEditContent(memory.content)
      return
    }
    setIsUpdating(true)
    await onUpdate(memory.id, { content: editContent.trim() })
    setIsEditing(false)
    setIsUpdating(false)
  }

  const handleTogglePin = async () => {
    setIsUpdating(true)
    await onUpdate(memory.id, { is_pinned: !memory.is_pinned })
    setIsUpdating(false)
  }

  const handleDelete = async () => {
    if (!isDeleting) {
      setIsDeleting(true)
      return
    }
    await onDelete(memory.id)
  }

  const date = new Date(memory.created_at).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
  })

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/[0.07] transition-colors group">
      <div className="flex items-start gap-3">
        {/* Category badge */}
        <span
          className="text-sm px-2 py-1 rounded-lg font-medium whitespace-nowrap flex-shrink-0"
          style={{ backgroundColor: meta.color + '20', color: meta.color }}
        >
          {meta.emoji} {meta.label}
        </span>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editContent}
                onChange={e => setEditContent(e.target.value)}
                maxLength={500}
                autoFocus
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2CB6D7]/50"
                onKeyDown={e => {
                  if (e.key === 'Enter') handleSave()
                  if (e.key === 'Escape') {
                    setIsEditing(false)
                    setEditContent(memory.content)
                  }
                }}
              />
              <button
                onClick={handleSave}
                disabled={isUpdating}
                className="p-1.5 text-green-400 hover:bg-green-400/20 rounded-lg transition-colors"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => { setIsEditing(false); setEditContent(memory.content) }}
                className="p-1.5 text-white/40 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <p className="text-white/90 text-sm leading-relaxed">{memory.content}</p>
          )}

          <div className="flex items-center gap-3 mt-2 text-[11px] text-white/30">
            <span>{date}</span>
            {memory.is_pinned && <span className="text-[#F59E0B]">Fijada</span>}
            {memory.confidence < 0.7 && <span className="text-white/20">Baja confianza</span>}
          </div>
        </div>

        {/* Actions (hidden for read-only / free users) */}
        {!readOnly && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="p-1.5 text-white/30 hover:text-white/70 hover:bg-white/10 rounded-lg transition-colors"
                title="Editar"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={handleTogglePin}
              disabled={isUpdating}
              className={`p-1.5 rounded-lg transition-colors ${
                memory.is_pinned
                  ? 'text-[#F59E0B] hover:bg-[#F59E0B]/20'
                  : 'text-white/30 hover:text-white/70 hover:bg-white/10'
              }`}
              title={memory.is_pinned ? 'Desfijar' : 'Fijar'}
            >
              {memory.is_pinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={handleDelete}
              className={`p-1.5 rounded-lg transition-colors ${
                isDeleting
                  ? 'text-red-400 bg-red-400/20'
                  : 'text-white/30 hover:text-red-400 hover:bg-red-400/10'
              }`}
              title={isDeleting ? 'Confirmar eliminar' : 'Eliminar'}
              onBlur={() => setIsDeleting(false)}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
