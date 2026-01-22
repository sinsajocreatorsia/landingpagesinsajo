'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, MessageCircle } from 'lucide-react'
import DOMPurify from 'isomorphic-dompurify'
import { processMessage, formatMessage } from '@/lib/utils/messageFormatter'
import { useLanguage } from '@/lib/contexts/LanguageContext'
import { fbEvents } from '@/components/analytics/FacebookPixel'
import { gaEvents } from '@/components/analytics/GoogleAnalytics'

// Configuración segura de DOMPurify - solo permite tags seguros
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

const chatTexts = {
  en: {
    subtitle: 'AI Business Advisor',
    hoverTooltip: '💬 Chat with Hanna',
    placeholder: 'Type your message...',
    typingIndicator: 'Hanna is typing',
    errorMessage: 'Hi! I\'m Hanna. I\'m having technical issues. Meanwhile, contact us at sales@sinsajocreators.com or WhatsApp: +1 (609) 288-5466',
    initialGreeting: {
      line1: 'Hey! I\'m <strong>Hanna</strong> 👋',
      line2: 'I\'m an AI business advisor at Sinsajo Creators. I help companies like yours automate processes and scale with intelligent agents.',
      line3: 'What industry are you in? I\'d love to learn about your business.'
    }
  },
  es: {
    subtitle: 'Asesora de Negocios IA',
    hoverTooltip: '💬 Chatea con Hanna',
    placeholder: 'Escribe tu mensaje...',
    typingIndicator: 'Hanna está escribiendo',
    errorMessage: 'Hola! Soy Hanna. Estoy teniendo problemas técnicos. Mientras tanto, escríbenos a sales@sinsajocreators.com o WhatsApp: +1 (609) 288-5466',
    initialGreeting: {
      line1: '¡Hola! Soy <strong>Hanna</strong> 👋',
      line2: 'Soy asesora de negocios especializada en IA en Sinsajo Creators. Ayudo a empresas como la tuya a automatizar procesos y escalar con agentes inteligentes.',
      line3: '¿En qué industria estás? Me encantaría conocer tu negocio.'
    }
  }
}

export default function ChatWidget() {
  const { language } = useLanguage()
  const texts = chatTexts[language]
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [hasTrackedChatOpen, setHasTrackedChatOpen] = useState(false)
  const [hasTrackedFirstMessage, setHasTrackedFirstMessage] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  // Track when user opens the chat for the first time
  const handleOpenChat = () => {
    if (!isOpen) {
      if (!hasTrackedChatOpen) {
        fbEvents.chatStarted()
        gaEvents.chatStarted()
        setHasTrackedChatOpen(true)
      }
    }
    setIsOpen(!isOpen)
  }

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  const sendProgressiveMessages = async (fullMessage: string) => {
    const parts = processMessage(fullMessage)

    for (let i = 0; i < parts.length; i++) {
      const { formattedText, delay } = parts[i]

      // Show typing indicator
      setIsTyping(true)

      // Wait for "typing" time
      await sleep(delay)

      // Hide typing and add message
      setIsTyping(false)

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: formattedText,
        timestamp: new Date(),
        isHtml: true
      }])

      // Small pause between messages
      if (i < parts.length - 1) {
        await sleep(400 + Math.random() * 500)
      }
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

    // Track first message as a Lead
    if (!hasTrackedFirstMessage) {
      fbEvents.lead({ content_name: 'Chat First Message', content_category: 'Chat Lead' })
      gaEvents.chatLead()
      setHasTrackedFirstMessage(true)
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
          language: language
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
        content: texts.errorMessage,
        timestamp: new Date()
      }])
    }
  }

  return (
    <>
      {/* Floating Button - DRAGGABLE */}
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
          className="relative w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 shadow-lg hover:shadow-2xl transition-all cursor-grab active:cursor-grabbing flex items-center justify-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <MessageCircle size={28} className="text-white" />
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
        </motion.button>

        <AnimatePresence>
          {!isOpen && isHovered && (
            <motion.div
              className="absolute bottom-20 right-0 bg-white text-gray-800 px-4 py-2 rounded-lg shadow-lg whitespace-nowrap pointer-events-none"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              {texts.hoverTooltip}
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
            className="fixed bottom-28 right-6 w-[380px] h-[600px] bg-[#0A1628] rounded-2xl shadow-2xl z-[9998] flex flex-col overflow-hidden border border-cyan-400/30"
            style={{ maxWidth: 'calc(100vw - 3rem)', maxHeight: 'calc(100vh - 10rem)' }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-cyan-500 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=faces"
                    alt="Hanna - AI Specialist"
                    className="w-12 h-12 rounded-full object-cover border-2 border-white"
                  />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Hanna</h3>
                  <p className="text-white/80 text-sm">{texts.subtitle}</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-[#0A1628] space-y-4">
              {/* Initial message */}
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2"
                >
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=faces"
                    alt="Hanna"
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl rounded-tl-none p-4 border border-cyan-400/20 max-w-[85%]">
                    <p className="text-white text-sm mb-2" dangerouslySetInnerHTML={{ __html: sanitizeHtml(texts.initialGreeting.line1) }} />
                    <p className="text-gray-300 text-sm mb-3">
                      {texts.initialGreeting.line2}
                    </p>
                    <p className="text-gray-200 text-sm">
                      {texts.initialGreeting.line3}
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
                    <img
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=faces"
                      alt="Hanna"
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    />
                  )}
                  <div
                    className={`rounded-2xl p-3 max-w-[80%] ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-tr-none'
                        : 'bg-white/10 backdrop-blur-sm text-white rounded-tl-none border border-cyan-400/20'
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
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=faces"
                    alt="Hanna"
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg border border-cyan-400/20">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
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
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=faces"
                    alt="Hanna"
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg border border-cyan-400/20">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-xs">{texts.typingIndicator}</span>
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} className="p-4 border-t border-cyan-400/20 bg-[#0A1628]">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={texts.placeholder}
                  disabled={isLoading || isTyping}
                  className="flex-1 px-4 py-3 bg-white/5 border border-cyan-400/30 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400 text-sm"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading || isTyping}
                  className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white flex items-center justify-center hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={20} />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Powered by Sinsajo Creators
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Styles for HTML messages */}
      <style jsx global>{`
        .chat-message a {
          color: #8B5CF6;
          text-decoration: underline;
        }
        .chat-message a:hover {
          color: #A78BFA;
        }
        .chat-message b {
          color: #8B5CF6;
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
