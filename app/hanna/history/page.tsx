'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  MessageSquare,
  Trash2,
  Clock,
  Loader2,
  Search,
  History as HistoryIcon,
} from 'lucide-react'

interface Session {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  messageCount: number
}

interface SessionMessages {
  id: string
  role: string
  content: string
  createdAt: string
}

export default function HistoryPage() {
  const router = useRouter()
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSession, setSelectedSession] = useState<string | null>(null)
  const [sessionMessages, setSessionMessages] = useState<SessionMessages[]>([])
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Fetch sessions on mount
  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    try {
      const res = await fetch('/api/hanna/sessions')
      const data = await res.json()
      if (data.success) {
        setSessions(data.sessions)
      }
    } catch (error) {
      console.error('Error fetching sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSessionMessages = async (sessionId: string) => {
    setLoadingMessages(true)
    try {
      const res = await fetch(`/api/hanna/sessions/${sessionId}`)
      const data = await res.json()
      if (data.success) {
        setSessionMessages(data.messages)
        setSelectedSession(sessionId)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoadingMessages(false)
    }
  }

  const deleteSession = async (sessionId: string) => {
    setDeletingId(sessionId)
    try {
      const res = await fetch(`/api/hanna/sessions/${sessionId}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (data.success) {
        setSessions(prev => prev.filter(s => s.id !== sessionId))
        if (selectedSession === sessionId) {
          setSelectedSession(null)
          setSessionMessages([])
        }
      }
    } catch (error) {
      console.error('Error deleting session:', error)
    } finally {
      setDeletingId(null)
    }
  }

  const filteredSessions = sessions.filter(s =>
    s.title?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = diffMs / (1000 * 60 * 60)

    if (diffHours < 1) return 'Hace unos minutos'
    if (diffHours < 24) return `Hace ${Math.floor(diffHours)} horas`
    if (diffHours < 48) return 'Ayer'
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#022133] to-[#200F5D]">
      {/* Header */}
      <header className="bg-[#022133]/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            href="/hanna/dashboard"
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm hidden sm:inline">Volver al chat</span>
          </Link>
          <div className="flex-1">
            <h1 className="text-white font-bold text-lg">Historial de Conversaciones</h1>
            <p className="text-white/50 text-xs">{sessions.length} conversaciones</p>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar conversaciones..."
            className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#2CB6D7]"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#2CB6D7] animate-spin" />
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="text-center py-20">
            <HistoryIcon className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h2 className="text-white/60 text-lg font-medium mb-2">
              {searchQuery ? 'Sin resultados' : 'Sin conversaciones aún'}
            </h2>
            <p className="text-white/40 text-sm mb-6">
              {searchQuery
                ? 'Intenta con otros términos de búsqueda'
                : 'Tus conversaciones con Hanna aparecerán aquí'}
            </p>
            <Link
              href="/hanna/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#C7517E] to-[#b8456f] text-white font-medium rounded-xl hover:from-[#d4608d] hover:to-[#C7517E] transition-all"
            >
              <MessageSquare className="w-5 h-5" />
              Iniciar conversación
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr,1.5fr] gap-6">
            {/* Sessions List */}
            <div className="space-y-3">
              {filteredSessions.map((session) => (
                <motion.button
                  key={session.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => fetchSessionMessages(session.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    selectedSession === session.id
                      ? 'bg-[#2CB6D7]/20 border-[#2CB6D7]/50'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium truncate">
                        {session.title || 'Nueva conversación'}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-white/40 text-xs">
                          <Clock className="w-3 h-3" />
                          {formatDate(session.updatedAt)}
                        </span>
                        <span className="flex items-center gap-1 text-white/40 text-xs">
                          <MessageSquare className="w-3 h-3" />
                          {session.messageCount} msgs
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteSession(session.id)
                      }}
                      disabled={deletingId === session.id}
                      className="p-2 text-white/30 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                      title="Eliminar conversación"
                    >
                      {deletingId === session.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Message Preview */}
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
              {loadingMessages ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="w-6 h-6 text-[#2CB6D7] animate-spin" />
                </div>
              ) : selectedSession && sessionMessages.length > 0 ? (
                <div className="max-h-[70vh] overflow-y-auto p-4 space-y-4">
                  <AnimatePresence>
                    {sessionMessages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                            msg.role === 'user'
                              ? 'bg-[#C7517E] text-white rounded-tr-sm'
                              : 'bg-white/10 text-white/90 rounded-tl-sm border border-white/10'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                          <p className={`text-xs mt-1 ${msg.role === 'user' ? 'text-white/50' : 'text-white/30'}`}>
                            {new Date(msg.createdAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-white/30">
                  <MessageSquare className="w-12 h-12 mb-3" />
                  <p className="text-sm">Selecciona una conversación para ver los mensajes</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
