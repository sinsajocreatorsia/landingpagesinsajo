'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Brain, Plus, Loader2, X, ChevronRight, Crown } from 'lucide-react'
import { MemoryCard } from '@/components/hanna/MemoryCard'
import { MEMORY_CATEGORY_META, VALID_CATEGORIES } from '@/types/memory'
import type { UserMemoryItem, MemoryCategory, UpdateMemoryInput } from '@/types/memory'

type FilterTab = 'all' | MemoryCategory

export default function MemoryPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [memories, setMemories] = useState<UserMemoryItem[]>([])
  const [activeTab, setActiveTab] = useState<FilterTab>('all')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newCategory, setNewCategory] = useState<MemoryCategory>('business_info')
  const [newContent, setNewContent] = useState('')
  const [addingMemory, setAddingMemory] = useState(false)
  const [plan, setPlan] = useState<string>('free')

  const isPaidPlan = plan === 'pro' || plan === 'business'

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const fetchMemories = useCallback(async () => {
    try {
      const res = await fetch('/api/hanna/memory')
      const data = await res.json()

      if (data.success) {
        setMemories(data.memories)
        if (data.plan) setPlan(data.plan)
      }
    } catch (err) {
      console.error('Error fetching memories:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/hanna/login')
        return
      }
      fetchMemories()
    }
    checkAuth()
  }, [supabase.auth, router, fetchMemories])

  const handleUpdate = async (id: string, input: UpdateMemoryInput) => {
    if (!isPaidPlan) return
    try {
      const res = await fetch(`/api/hanna/memory/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      const data = await res.json()
      if (data.success && data.memory) {
        setMemories(prev => prev.map(m => m.id === id ? data.memory : m))
      }
    } catch (err) {
      console.error('Error updating memory:', err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!isPaidPlan) return
    try {
      const res = await fetch(`/api/hanna/memory/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        setMemories(prev => prev.filter(m => m.id !== id))
      }
    } catch (err) {
      console.error('Error deleting memory:', err)
    }
  }

  const handleAdd = async () => {
    if (!newContent.trim() || !isPaidPlan) return
    setAddingMemory(true)

    try {
      const res = await fetch('/api/hanna/memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: newCategory, content: newContent.trim() }),
      })
      const data = await res.json()
      if (data.success && data.memory) {
        setMemories(prev => [data.memory, ...prev])
        setNewContent('')
        setShowAddForm(false)
      }
    } catch (err) {
      console.error('Error adding memory:', err)
    } finally {
      setAddingMemory(false)
    }
  }

  const filteredMemories = activeTab === 'all'
    ? memories
    : memories.filter(m => m.category === activeTab)

  // Sort: pinned first, then by date
  const sortedMemories = [...filteredMemories].sort((a, b) => {
    if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#022133] to-[#200F5D] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#2CB6D7] animate-spin" />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#022133] to-[#200F5D] p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/hanna/dashboard"
            className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Brain className="w-6 h-6 text-[#2CB6D7]" />
              Memoria de Negocio
            </h1>
            <p className="text-white/60 text-sm">
              {isPaidPlan
                ? 'Hanna recuerda estos datos sobre tu negocio para darte mejores consejos'
                : 'Memorias de los ultimos 7 dias. Actualiza a Pro para historial completo.'
              }
            </p>
          </div>
          {isPaidPlan && (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#2CB6D7]/20 text-[#2CB6D7] border border-[#2CB6D7]/30 rounded-xl hover:bg-[#2CB6D7]/30 transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Agregar
            </button>
          )}
        </div>

        {/* Free plan banner */}
        {!isPaidPlan && memories.length > 0 && (
          <div className="mb-6 bg-gradient-to-r from-[#C7517E]/15 to-[#200F5D]/15 border border-[#C7517E]/25 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Crown className="w-5 h-5 text-[#C7517E] flex-shrink-0" />
              <div>
                <p className="text-white/90 text-sm font-medium">Memoria limitada a 7 dias</p>
                <p className="text-white/40 text-xs">Actualiza para historial completo, editar y agregar memorias manualmente</p>
              </div>
            </div>
            <Link
              href="/hanna/upgrade"
              className="flex-shrink-0 px-4 py-2 bg-gradient-to-r from-[#C7517E] to-[#b8456f] text-white text-xs font-medium rounded-lg hover:from-[#d4608d] hover:to-[#C7517E] transition-all"
            >
              Actualizar
            </Link>
          </div>
        )}

        {/* Add Form (Pro/Business only) */}
        <AnimatePresence>
          {showAddForm && isPaidPlan && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-medium">Agregar memoria</h3>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="p-1 text-white/40 hover:text-white/70 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex gap-3 mb-3">
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as MemoryCategory)}
                    className="bg-white/10 border border-white/20 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2CB6D7]/50"
                  >
                    {VALID_CATEGORIES.map(cat => (
                      <option key={cat} value={cat} className="bg-[#1a1a2e] text-white">
                        {MEMORY_CATEGORY_META[cat].emoji} {MEMORY_CATEGORY_META[cat].label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newContent}
                    onChange={e => setNewContent(e.target.value)}
                    placeholder="Ej: Mi negocio vende pasteles artesanales en Ciudad de Mexico"
                    maxLength={500}
                    className="flex-1 bg-white/10 border border-white/20 text-white rounded-lg px-4 py-2.5 text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#2CB6D7]/50"
                    onKeyDown={e => e.key === 'Enter' && handleAdd()}
                  />
                  <button
                    onClick={handleAdd}
                    disabled={!newContent.trim() || addingMemory}
                    className="px-5 py-2.5 bg-[#2CB6D7] text-white rounded-lg text-sm font-medium hover:bg-[#2CB6D7]/80 transition-colors disabled:opacity-50"
                  >
                    {addingMemory ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Guardar'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === 'all'
                ? 'bg-white/20 text-white'
                : 'text-white/40 hover:text-white/70 hover:bg-white/5'
            }`}
          >
            Todos ({memories.length})
          </button>
          {VALID_CATEGORIES.map(cat => {
            const count = memories.filter(m => m.category === cat).length
            if (count === 0) return null
            const meta = MEMORY_CATEGORY_META[cat]
            return (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === cat
                    ? 'text-white'
                    : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                }`}
                style={activeTab === cat ? { backgroundColor: meta.color + '30' } : {}}
              >
                {meta.emoji} {meta.label} ({count})
              </button>
            )
          })}
        </div>

        {/* Memories List */}
        {sortedMemories.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Brain className="w-16 h-16 text-white/10 mx-auto mb-4" />
            <h3 className="text-white/40 text-lg font-medium mb-2">
              {activeTab === 'all'
                ? 'Hanna aun no tiene memorias de tu negocio'
                : `No hay memorias en la categoria "${MEMORY_CATEGORY_META[activeTab as MemoryCategory]?.label}"`
              }
            </h3>
            <p className="text-white/20 text-sm max-w-md mx-auto">
              Inicia una conversacion con Hanna y ella empezara a recordar datos importantes sobre tu negocio automaticamente.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {sortedMemories.map(memory => (
                <motion.div
                  key={memory.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  layout
                >
                  <MemoryCard
                    memory={memory}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                    readOnly={!isPaidPlan}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Info footer */}
        {memories.length > 0 && (
          <div className="mt-8 text-center text-white/20 text-xs">
            {memories.length} memoria{memories.length !== 1 ? 's' : ''} guardada{memories.length !== 1 ? 's' : ''}
            {!isPaidPlan && ' (ultimos 7 dias)'}
            {' '}&middot;{' '}
            Las memorias se extraen automaticamente de tus conversaciones con Hanna
          </div>
        )}
      </div>
    </main>
  )
}
