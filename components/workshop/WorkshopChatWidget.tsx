'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, MessageCircle, Sparkles, Mic, MicOff, Volume2, VolumeX } from 'lucide-react'
import DOMPurify from 'isomorphic-dompurify'
import { processMessage } from '@/lib/utils/messageFormatter'
import {
  speakText,
  stopSpeaking,
  isSpeaking,
  createVoiceRecognition,
  isVoiceSupported,
  initVoices,
  type VoiceRecognition,
} from '@/lib/hanna/voice'

// Configuración segura de DOMPurify
const sanitizeHtml = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'strong', 'i', 'em', 'a', 'br', 'p', 'span'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
    ALLOW_DATA_ATTR: false,
    ADD_ATTR: ['target', 'rel'],
    FORBID_TAGS: ['script', 'style', 'iframe', 'form', 'input', 'img', 'svg'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover']
  })
}

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  isHtml?: boolean
}

// Workshop-specific greeting that auto-opens
const workshopGreeting = {
  line1: '¡Hola! Soy <strong>Hanna</strong> y te doy la bienvenida al Workshop',
  line2: '<strong>"IA para Empresarias Exitosas"</strong> - De Dueña Agotada a Estratega Imparable',
  line3: 'Gracias por tu interés en transformar tu negocio con IA. Este workshop exclusivo te enseñará a recuperar 10+ horas semanales automatizando las tareas que te tienen atrapada.',
  line4: '¿Cómo te llamas? Me encantaría conocerte y contarte más sobre lo que aprenderás el 7 de Marzo.',
}

export default function WorkshopChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [hasAutoOpened, setHasAutoOpened] = useState(false)
  const [showPulse, setShowPulse] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Voice state
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [isListening, setIsListening] = useState(false)
  const [isSpeakingState, setIsSpeakingState] = useState(false)
  const [voiceSupport, setVoiceSupport] = useState({ tts: false, stt: false })
  const [interimTranscript, setInterimTranscript] = useState('')
  const recognitionRef = useRef<VoiceRecognition | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  // Initialize voice support
  useEffect(() => {
    const support = isVoiceSupported()
    setVoiceSupport(support)
    initVoices()
    recognitionRef.current = createVoiceRecognition()

    return () => {
      stopSpeaking()
      recognitionRef.current?.abort()
    }
  }, [])

  // Speak Hanna's response
  const speakResponse = useCallback((text: string) => {
    if (!voiceEnabled || !voiceSupport.tts) return

    // Strip HTML tags for speech
    const plainText = text.replace(/<[^>]*>/g, '')
    speakText(
      plainText,
      () => setIsSpeakingState(true),
      () => setIsSpeakingState(false)
    )
  }, [voiceEnabled, voiceSupport.tts])

  // Start voice input
  const startListening = useCallback(() => {
    if (!recognitionRef.current?.isSupported || isListening) return

    stopSpeaking()

    recognitionRef.current.start({
      onResult: (transcript, isFinal) => {
        if (isFinal) {
          setInput(transcript)
          setInterimTranscript('')
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
        console.error('Recognition error:', error)
        setIsListening(false)
        setInterimTranscript('')
      },
    })
  }, [isListening])

  // Stop voice input
  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
  }, [])

  // Auto-open chat after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasAutoOpened) {
        setIsOpen(true)
        setHasAutoOpened(true)
        setShowPulse(false)
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [hasAutoOpened])

  const handleOpenChat = () => {
    if (!isOpen) {
      setShowPulse(false)
    }
    setIsOpen(!isOpen)
  }

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  const sendProgressiveMessages = async (fullMessage: string) => {
    const parts = processMessage(fullMessage)

    for (let i = 0; i < parts.length; i++) {
      const { formattedText, delay } = parts[i]

      setIsTyping(true)
      await sleep(delay)
      setIsTyping(false)

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: formattedText,
        timestamp: new Date(),
        isHtml: true
      }])

      if (i < parts.length - 1) {
        await sleep(400 + Math.random() * 500)
      }
    }

    // Speak the full message after displaying all parts
    if (voiceEnabled && voiceSupport.tts) {
      const plainText = fullMessage.replace(/<[^>]*>/g, '')
      speakResponse(plainText)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
          language: 'es',
          context: 'workshop'
        })
      })

      const data = await response.json()
      setIsLoading(false)

      if (data.message) {
        await sendProgressiveMessages(data.message)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setIsLoading(false)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '¡Hola! Parece que tengo problemas técnicos. Mientras tanto, puedes escribirnos a sales@sinsajocreators.com o reservar tu lugar directamente haciendo clic en el botón de abajo.',
        timestamp: new Date()
      }])
    }
  }

  return (
    <>
      {/* Floating Button with Workshop styling */}
      <motion.div
        drag
        dragMomentum={false}
        dragElastic={0.1}
        dragConstraints={{
          top: typeof window !== 'undefined' ? -window.innerHeight + 200 : -600,
          left: typeof window !== 'undefined' ? -window.innerWidth + 100 : -1000,
          right: 0,
          bottom: 0
        }}
        className="fixed bottom-6 right-6 z-[9999]"
        style={{ touchAction: 'none' }}
      >
        <motion.button
          data-chat-widget="true"
          onClick={handleOpenChat}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative w-16 h-16 rounded-full bg-gradient-to-r from-[#C7517E] to-[#2CB6D7] shadow-lg hover:shadow-2xl transition-all cursor-grab active:cursor-grabbing flex items-center justify-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <MessageCircle size={28} className="text-white" />

          {/* Online indicator */}
          <motion.div
            className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              className="absolute inset-0 bg-green-400 rounded-full"
              animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>

          {/* Pulse effect to attract attention */}
          {showPulse && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-[#C7517E]"
              animate={{ scale: [1, 1.5], opacity: [0.8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
        </motion.button>

        {/* Hover tooltip */}
        <AnimatePresence>
          {!isOpen && isHovered && (
            <motion.div
              className="absolute bottom-20 right-0 bg-white text-gray-800 px-4 py-2 rounded-lg shadow-lg whitespace-nowrap pointer-events-none"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C7517E]" />
                <span>¡Pregúntame sobre el Workshop!</span>
              </div>
              <div className="absolute -bottom-2 right-4 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 100 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed bottom-28 right-6 w-[400px] h-[550px] bg-[#022133] rounded-2xl shadow-2xl z-[9998] flex flex-col overflow-hidden border border-[#2CB6D7]/30"
            style={{ maxWidth: 'calc(100vw - 3rem)', maxHeight: 'calc(100vh - 10rem)' }}
          >
            {/* Header with Workshop branding */}
            <div className="bg-gradient-to-r from-[#C7517E] to-[#2CB6D7] p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  {isSpeakingState && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 0.8 }}
                      className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-white flex items-center justify-center"
                    >
                      <Volume2 className="w-2 h-2 text-white" />
                    </motion.div>
                  )}
                  {!isSpeakingState && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                  )}
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Hanna</h3>
                  <p className="text-white/80 text-sm">
                    {isSpeakingState ? '🎙️ Hablando...' : 'Asesora del Workshop'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Voice toggle */}
                {voiceSupport.tts && (
                  <button
                    onClick={() => {
                      setVoiceEnabled(!voiceEnabled)
                      if (isSpeaking()) stopSpeaking()
                      setIsSpeakingState(false)
                    }}
                    className={`p-2 rounded-full transition-colors ${
                      voiceEnabled ? 'bg-white/20 text-white' : 'bg-white/10 text-white/50'
                    }`}
                    title={voiceEnabled ? 'Desactivar voz' : 'Activar voz'}
                  >
                    {voiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-[#022133] space-y-4">
              {/* Initial workshop greeting */}
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#C7517E] to-[#2CB6D7] flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl rounded-tl-none p-4 border border-[#2CB6D7]/20 max-w-[85%]">
                    <p className="text-white text-sm mb-2" dangerouslySetInnerHTML={{ __html: sanitizeHtml(workshopGreeting.line1) }} />
                    <p className="text-[#2CB6D7] text-sm mb-3" dangerouslySetInnerHTML={{ __html: sanitizeHtml(workshopGreeting.line2) }} />
                    <p className="text-gray-300 text-sm mb-3">
                      {workshopGreeting.line3}
                    </p>
                    <p className="text-[#C7517E] text-sm font-medium">
                      {workshopGreeting.line4}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Conversation messages */}
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#C7517E] to-[#2CB6D7] flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`rounded-2xl p-3 max-w-[80%] ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-[#C7517E] to-[#2CB6D7] text-white rounded-tr-none'
                        : 'bg-white/10 backdrop-blur-sm text-white rounded-tl-none border border-[#2CB6D7]/20'
                    }`}
                  >
                    {msg.isHtml ? (
                      <div
                        className="text-sm whitespace-pre-wrap chat-message"
                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(msg.content) }}
                      />
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    )}
                    <p className="text-xs text-white/60 mt-1">
                      {msg.timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start gap-2"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#C7517E] to-[#2CB6D7] flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg border border-[#2CB6D7]/20">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-[#2CB6D7] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-[#2CB6D7] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-[#2CB6D7] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Typing indicator */}
              {isTyping && !isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-start gap-2"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#C7517E] to-[#2CB6D7] flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg border border-[#2CB6D7]/20">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-xs">Hanna está escribiendo</span>
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-[#2CB6D7] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-1.5 h-1.5 bg-[#2CB6D7] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-1.5 h-1.5 bg-[#2CB6D7] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {messages.length === 0 && (
              <div className="px-4 pb-2">
                <div className="flex flex-wrap gap-2">
                  {['¿Qué aprenderé?', '¿Cuál es el precio?', 'Cuéntame más'].map((quick, i) => (
                    <button
                      key={i}
                      onClick={() => setInput(quick)}
                      className="text-xs bg-[#2CB6D7]/20 text-[#2CB6D7] px-3 py-1.5 rounded-full hover:bg-[#2CB6D7]/30 transition-colors border border-[#2CB6D7]/30"
                    >
                      {quick}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Interim transcript display */}
            {interimTranscript && (
              <div className="px-4 pb-2">
                <div className="bg-[#2CB6D7]/10 rounded-lg px-3 py-2 text-sm text-[#2CB6D7] italic">
                  🎤 {interimTranscript}...
                </div>
              </div>
            )}

            {/* Input */}
            <form onSubmit={sendMessage} className="p-4 border-t border-[#2CB6D7]/20 bg-[#022133]">
              <div className="flex gap-2">
                {/* Voice input button */}
                {voiceSupport.stt && (
                  <button
                    type="button"
                    onClick={isListening ? stopListening : startListening}
                    disabled={isLoading || isTyping}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      isListening
                        ? 'bg-red-500 text-white animate-pulse'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    } disabled:opacity-50`}
                    title={isListening ? 'Detener grabación' : 'Hablar a Hanna'}
                  >
                    {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                  </button>
                )}
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isListening ? 'Escuchando...' : 'Escribe tu mensaje...'}
                  disabled={isLoading || isTyping || isListening}
                  className="flex-1 px-4 py-3 bg-white/5 border border-[#2CB6D7]/30 rounded-full focus:outline-none focus:ring-2 focus:ring-[#C7517E] text-white placeholder-gray-400 text-sm disabled:opacity-70"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading || isTyping}
                  className="w-12 h-12 rounded-full bg-gradient-to-r from-[#C7517E] to-[#2CB6D7] text-white flex items-center justify-center hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={20} />
                </button>
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-500">
                  Powered by Sinsajo Creators
                </p>
                {(voiceSupport.tts || voiceSupport.stt) && (
                  <p className="text-xs text-[#2CB6D7]/60 flex items-center gap-1">
                    {voiceSupport.stt && <Mic size={10} />}
                    {voiceSupport.tts && <Volume2 size={10} />}
                    Voz habilitada
                  </p>
                )}
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Styles for HTML messages */}
      <style jsx global>{`
        .chat-message a {
          color: #2CB6D7;
          text-decoration: underline;
        }
        .chat-message a:hover {
          color: #36B3AE;
        }
        .chat-message b, .chat-message strong {
          color: #C7517E;
        }
        @media (max-width: 640px) {
          .fixed.bottom-28.right-6 {
            width: calc(100vw - 2rem) !important;
            right: 1rem !important;
            left: 1rem !important;
            max-height: calc(100vh - 8rem) !important;
          }
        }
      `}</style>
    </>
  )
}
