'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { createBrowserClient } from '@supabase/ssr'
import {
  Send,
  Menu,
  X,
  Plus,
  MessageSquare,
  Settings,
  LogOut,
  Crown,
  Sparkles,
  History,
  User,
  ChevronRight,
  Loader2,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
} from 'lucide-react'
import {
  speakText,
  stopSpeaking,
  createVoiceRecognition,
  isVoiceSupported,
  initVoices,
  type VoiceRecognition,
} from '@/lib/hanna/voice'
import { MessageContent } from '@/components/hanna/MessageContent'
import { ToneConfigDialog, type ToneConfig } from '@/components/hanna/ToneConfigDialog'

interface DashboardProps {
  user: {
    id: string
    email: string
    fullName: string
    avatarUrl?: string
  }
  profile: {
    plan: 'free' | 'pro'
    subscriptionStatus: string
    messagesRemaining: number
  }
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function HannaDashboardClient({ user, profile }: DashboardProps) {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [messagesRemaining, setMessagesRemaining] = useState(profile.messagesRemaining)

  // Tone configuration
  const [showToneConfig, setShowToneConfig] = useState(false)
  const [toneConfig, setToneConfig] = useState<ToneConfig | null>(null)

  // Voice states (Pro only)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voiceSupport, setVoiceSupport] = useState({ tts: false, stt: false })
  const [interimTranscript, setInterimTranscript] = useState('')

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<VoiceRecognition | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Initialize voice features for Pro users
  useEffect(() => {
    if (profile.plan === 'pro') {
      const support = isVoiceSupported()
      setVoiceSupport(support)
      initVoices()
      recognitionRef.current = createVoiceRecognition()
    }

    return () => {
      stopSpeaking()
      recognitionRef.current?.abort()
    }
  }, [profile.plan])

  // Check for tone configuration on mount
  useEffect(() => {
    const storedConfig = localStorage.getItem(`hanna-tone-${user.id}`)
    if (storedConfig) {
      try {
        setToneConfig(JSON.parse(storedConfig))
      } catch (e) {
        // Invalid JSON, show config dialog
        setShowToneConfig(true)
      }
    } else {
      // First time user - show tone config dialog
      setShowToneConfig(true)
    }
  }, [user.id])

  // Initial greeting (after tone config)
  useEffect(() => {
    if (toneConfig === null && !showToneConfig) return // Wait for config

    const styleGreeting = {
      energetic: '¡Hola! 🔥 Soy Hanna, y estoy aquí para ayudarte a ROMPERLA en tu negocio.',
      calm: 'Hola, soy Hanna. Me da gusto poder acompañarte en el crecimiento estratégico de tu negocio.',
      professional: 'Buen día. Soy Hanna, consultora estratégica de negocios. Será un placer asesorarte.',
      friendly: `¡Hola ${user.fullName.split(' ')[0]}! 💙 Soy Hanna, tu amiga consultora de negocios.`,
    }

    const greeting = toneConfig
      ? styleGreeting[toneConfig.style]
      : `¡Hola ${user.fullName.split(' ')[0]}! Soy Hanna, tu consultora estratégica de negocios.`

    setMessages([{
      id: 'initial',
      role: 'assistant',
      content: greeting,
      timestamp: new Date(),
    }])
  }, [user.fullName, toneConfig, showToneConfig])

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Handle tone configuration complete
  const handleToneConfigComplete = (config: ToneConfig) => {
    setToneConfig(config)
    localStorage.setItem(`hanna-tone-${user.id}`, JSON.stringify(config))
    setShowToneConfig(false)
  }

  // Send message
  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return

    // Check message limit for free users
    if (profile.plan === 'free' && messagesRemaining <= 0) {
      setMessages(prev => [...prev, {
        id: `limit-${Date.now()}`,
        role: 'assistant',
        content: '¡Has alcanzado tu límite de mensajes gratuitos por hoy! Actualiza a Hanna Pro para mensajes ilimitados.',
        timestamp: new Date(),
      }])
      return
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsLoading(true)

    try {
      // Pro users send more conversation history for better context
      const historyLimit = profile.plan === 'pro' ? 20 : 10

      const response = await fetch('/api/hanna/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          userId: user.id,
          toneConfig: toneConfig,
          history: messages.slice(-historyLimit).map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      const data = await response.json()

      if (data.success && data.response) {
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
        }

        setMessages(prev => [...prev, assistantMessage])

        // Update remaining messages
        if (data.messages_remaining !== undefined) {
          setMessagesRemaining(data.messages_remaining)
        } else if (profile.plan === 'free') {
          setMessagesRemaining(prev => Math.max(0, prev - 1))
        }

        // Text-to-speech for Pro users
        if (profile.plan === 'pro' && voiceEnabled && voiceSupport.tts) {
          speakText(
            data.response,
            () => setIsSpeaking(true),
            () => setIsSpeaking(false)
          )
        }
      } else if (data.error?.includes('limit')) {
        setMessages(prev => [...prev, {
          id: `limit-${Date.now()}`,
          role: 'assistant',
          content: '¡Has alcanzado tu límite de mensajes gratuitos por hoy! Actualiza a Hanna Pro para mensajes ilimitados.',
          timestamp: new Date(),
        }])
      } else {
        throw new Error(data.error || 'Error desconocido')
      }
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Lo siento, hubo un error al procesar tu mensaje. ¿Podrías intentarlo de nuevo?',
        timestamp: new Date(),
      }])
    } finally {
      setIsLoading(false)
    }
  }, [messages, isLoading, user.id, profile.plan, messagesRemaining, voiceEnabled, voiceSupport.tts, toneConfig])

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(inputText)
  }

  // Handle logout
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/hanna')
    router.refresh()
  }

  // Voice input handlers (Pro only)
  const startListening = useCallback(() => {
    if (!recognitionRef.current?.isSupported || isListening || profile.plan !== 'pro') return

    stopSpeaking() // Stop any ongoing speech
    setIsSpeaking(false)

    recognitionRef.current.start({
      onResult: (transcript, isFinal) => {
        if (isFinal) {
          setInputText(transcript)
          setInterimTranscript('')
          // Auto-send after final result
          setTimeout(() => sendMessage(transcript), 300)
        } else {
          setInterimTranscript(transcript)
        }
      },
      onStart: () => {
        setIsListening(true)
        setInterimTranscript('')
      },
      onEnd: () => {
        setIsListening(false)
      },
      onError: (error) => {
        console.error('Voice recognition error:', error)
        setIsListening(false)
        setInterimTranscript('')
      },
    })
  }, [isListening, profile.plan, sendMessage])

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
  }, [])

  const toggleVoice = useCallback(() => {
    if (isSpeaking) {
      stopSpeaking()
      setIsSpeaking(false)
    }
    setVoiceEnabled(!voiceEnabled)
  }, [isSpeaking, voiceEnabled])

  return (
    <>
      {/* Tone Configuration Dialog */}
      {showToneConfig && (
        <ToneConfigDialog
          userName={user.fullName}
          onComplete={handleToneConfigComplete}
        />
      )}

      <div className="min-h-screen bg-gradient-to-br from-[#022133] to-[#200F5D] flex">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />

            {/* Sidebar Panel */}
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-[#022133] border-r border-white/10 z-50 flex flex-col"
            >
              {/* Sidebar Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#2CB6D7] to-[#36B3AE] flex items-center justify-center">
                    <span className="text-xl">🤖</span>
                  </div>
                  <div>
                    <h2 className="text-white font-bold">Hanna</h2>
                    <p className="text-white/50 text-xs">Tu asistente IA</p>
                  </div>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 text-white/60 hover:text-white lg:hidden"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* New Chat Button */}
              <div className="p-4">
                <button className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white flex items-center gap-2 transition-colors">
                  <Plus className="w-5 h-5" />
                  Nueva conversación
                </button>
              </div>

              {/* Menu Items */}
              <nav className="flex-1 p-4 space-y-2">
                <Link
                  href="/hanna/dashboard"
                  className="flex items-center gap-3 px-4 py-3 bg-white/10 rounded-xl text-white"
                >
                  <MessageSquare className="w-5 h-5" />
                  Chat
                </Link>
                <Link
                  href="/hanna/history"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-xl text-white/70 hover:text-white transition-colors"
                >
                  <History className="w-5 h-5" />
                  Historial
                </Link>
                <Link
                  href="/hanna/profile"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-xl text-white/70 hover:text-white transition-colors"
                >
                  <User className="w-5 h-5" />
                  Perfil de Negocio
                </Link>
                <Link
                  href="/hanna/settings"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-xl text-white/70 hover:text-white transition-colors"
                >
                  <Settings className="w-5 h-5" />
                  Configuración
                </Link>
              </nav>

              {/* Upgrade Banner (Free users only) */}
              {profile.plan === 'free' && (
                <div className="p-4">
                  <div className="bg-gradient-to-r from-[#C7517E]/20 to-[#200F5D]/20 border border-[#C7517E]/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Crown className="w-5 h-5 text-[#C7517E]" />
                      <span className="text-white font-medium">Hanna Pro</span>
                    </div>
                    <p className="text-white/60 text-sm mb-3">
                      Mensajes ilimitados, voz, y más.
                    </p>
                    <Link
                      href="/hanna/upgrade"
                      className="block w-full py-2 px-4 bg-gradient-to-r from-[#C7517E] to-[#b8456f] text-white text-center text-sm font-medium rounded-lg hover:from-[#d4608d] hover:to-[#C7517E] transition-all"
                    >
                      Actualizar a Pro
                    </Link>
                  </div>
                </div>
              )}

              {/* User Section */}
              <div className="p-4 border-t border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[#C7517E] flex items-center justify-center text-white font-medium">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{user.fullName}</p>
                    <p className="text-white/50 text-xs truncate">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar sesión
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen">
        {/* Header */}
        <header className="bg-[#022133]/80 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex-1 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#2CB6D7] to-[#36B3AE] flex items-center justify-center">
              <span className="text-xl">🤖</span>
            </div>
            <div>
              <h1 className="text-white font-bold">Hanna</h1>
              <p className="text-white/50 text-xs">Tu asistente de marketing IA</p>
            </div>
          </div>

          {/* Message Counter (Free users) */}
          {profile.plan === 'free' && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full">
              <Sparkles className="w-4 h-4 text-[#2CB6D7]" />
              <span className="text-white/80 text-sm">
                {messagesRemaining} / 5 mensajes
              </span>
            </div>
          )}

          {/* Pro Badge */}
          {profile.plan === 'pro' && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#C7517E]/20 to-[#200F5D]/20 border border-[#C7517E]/30 rounded-full">
              <Crown className="w-4 h-4 text-[#C7517E]" />
              <span className="text-white/80 text-sm font-medium">Pro</span>
            </div>
          )}

          {/* Voice Toggle (Pro only) */}
          {profile.plan === 'pro' && voiceSupport.tts && (
            <button
              onClick={toggleVoice}
              className={`p-2 rounded-full transition-colors ${
                voiceEnabled ? 'bg-[#2CB6D7] text-white' : 'bg-white/10 text-white/60'
              }`}
              title={voiceEnabled ? 'Desactivar voz' : 'Activar voz'}
            >
              {voiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
          )}
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start gap-3 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${
                    message.role === 'user'
                      ? 'bg-[#C7517E]'
                      : 'bg-gradient-to-r from-[#2CB6D7] to-[#36B3AE]'
                  }`}>
                    <span className="text-lg">{message.role === 'user' ? '👩' : '🤖'}</span>
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`rounded-2xl px-5 py-4 ${
                      message.role === 'user'
                        ? 'bg-[#C7517E] text-white rounded-tr-sm'
                        : 'bg-white/10 backdrop-blur-sm text-white rounded-tl-sm border border-white/10'
                    }`}
                  >
                    <MessageContent content={message.content} />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#2CB6D7] to-[#36B3AE] flex items-center justify-center">
                  <span className="text-lg">🤖</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-4 rounded-tl-sm border border-white/10">
                  <div className="flex gap-1">
                    <motion.span
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                      className="w-2 h-2 bg-[#2CB6D7] rounded-full"
                    />
                    <motion.span
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                      className="w-2 h-2 bg-[#2CB6D7] rounded-full"
                    />
                    <motion.span
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                      className="w-2 h-2 bg-[#2CB6D7] rounded-full"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Speaking indicator */}
          {isSpeaking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center"
            >
              <div className="bg-[#2CB6D7]/20 text-[#2CB6D7] px-4 py-2 rounded-full text-sm flex items-center gap-2">
                <Volume2 className="w-4 h-4 animate-pulse" />
                Hanna está hablando...
              </div>
            </motion.div>
          )}

          {/* Interim transcript (voice input) */}
          {interimTranscript && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-end"
            >
              <div className="max-w-[85%] rounded-2xl px-5 py-4 bg-[#C7517E]/30 text-white rounded-tr-sm">
                <p className="text-sm italic">{interimTranscript}...</p>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-white/10 bg-[#022133]/50 backdrop-blur-md">
          {/* Limit Warning */}
          {profile.plan === 'free' && messagesRemaining <= 1 && messagesRemaining > 0 && (
            <div className="mb-3 px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-yellow-200 text-sm flex items-center justify-between">
              <span>Te queda {messagesRemaining} mensaje gratis hoy</span>
              <Link href="/hanna/upgrade" className="text-yellow-100 hover:underline flex items-center gap-1">
                Actualizar <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {/* No Messages Left */}
          {profile.plan === 'free' && messagesRemaining <= 0 && (
            <div className="mb-3 px-4 py-3 bg-[#C7517E]/20 border border-[#C7517E]/30 rounded-lg text-white flex items-center justify-between">
              <div>
                <p className="font-medium">¡Límite alcanzado!</p>
                <p className="text-white/60 text-sm">Actualiza a Pro para mensajes ilimitados</p>
              </div>
              <Link
                href="/hanna/upgrade"
                className="px-4 py-2 bg-gradient-to-r from-[#C7517E] to-[#b8456f] text-white text-sm font-medium rounded-lg hover:from-[#d4608d] hover:to-[#C7517E] transition-all"
              >
                Actualizar
              </Link>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex items-center gap-3">
            {/* Voice Input Button (Pro only) */}
            {profile.plan === 'pro' && voiceSupport.stt && (
              <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                disabled={isLoading}
                className={`p-4 rounded-full transition-all ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
                } disabled:opacity-50`}
                title={isListening ? 'Detener grabación' : 'Hablar'}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
            )}

            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  isListening
                    ? 'Escuchando...'
                    : messagesRemaining > 0 || profile.plan === 'pro'
                    ? 'Escribe tu mensaje...'
                    : 'Actualiza a Pro para continuar...'
                }
                disabled={isLoading || isListening || (profile.plan === 'free' && messagesRemaining <= 0)}
                className="w-full px-5 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-[#2CB6D7] focus:outline-none focus:ring-2 focus:ring-[#2CB6D7]/20 disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={!inputText.trim() || isLoading || (profile.plan === 'free' && messagesRemaining <= 0)}
              className="p-4 rounded-full bg-gradient-to-r from-[#C7517E] to-[#b8456f] text-white hover:from-[#d4608d] hover:to-[#C7517E] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#C7517E]/20"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </form>

          {/* Voice Status (Pro only) */}
          {profile.plan === 'pro' && (voiceSupport.tts || voiceSupport.stt) && (
            <div className="mt-3 flex items-center justify-center gap-4 text-xs text-white/40">
              {voiceSupport.tts && (
                <span className="flex items-center gap-1">
                  <span className={voiceEnabled ? 'text-green-500' : 'text-white/40'}>●</span>
                  Voz {voiceEnabled ? 'activada' : 'desactivada'}
                </span>
              )}
              {voiceSupport.stt && (
                <span className="flex items-center gap-1">
                  <span className={isListening ? 'text-red-500 animate-pulse' : 'text-white/40'}>●</span>
                  {isListening ? 'Escuchando...' : 'Pulsa el micrófono para hablar'}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  )
}
