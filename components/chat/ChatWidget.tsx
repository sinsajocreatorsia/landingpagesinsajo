'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, MessageCircle } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

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
          }))
        })
      })

      const data = await response.json()

      if (data.message) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.message,
          timestamp: new Date()
        }])
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Hi! I\'m Hanna. I\'m currently being configured. Meanwhile, reach us at sinsajo.creators@gmail.com or WhatsApp: +1 (609) 288-5466',
        timestamp: new Date()
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Botón flotante - DRAGGABLE */}
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
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 shadow-lg hover:shadow-2xl transition-all cursor-grab active:cursor-grabbing"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Indicador Online */}
          <motion.div
            className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white z-10"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              className="absolute inset-0 bg-green-400 rounded-full"
              animate={{ scale: [1, 1.5], opacity: [1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>

          {/* Message Icon */}
          <MessageCircle size={32} className="text-white" />

          {/* Badge de notificación */}
          {!isOpen && messages.length === 0 && (
            <motion.div
              className="absolute -top-2 -left-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              1
            </motion.div>
          )}
        </motion.button>

        {/* Tooltip - Solo aparece con hover */}
        <AnimatePresence>
          {!isOpen && isHovered && (
            <motion.div
              className="absolute bottom-20 right-0 bg-white text-gray-800 px-4 py-2 rounded-lg shadow-lg whitespace-nowrap pointer-events-none"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              💬 Chat with Hanna
              <div className="absolute -bottom-2 right-4 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Ventana del Chat */}
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
                  <p className="text-white/80 text-sm">AI & Marketing Specialist</p>
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
              {/* Mensaje inicial de Hanna */}
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
                    <p className="text-white text-sm mb-2">
                      👋 Hi! I'm <strong>Hanna</strong>, your AI and Marketing specialist at Sinsajo Creators.
                    </p>
                    <p className="text-gray-300 text-sm mb-3">
                      I'm here to help you discover how AI agents can transform your business 🚀
                    </p>
                    <p className="text-gray-200 text-sm mb-4">
                      What's your biggest challenge with customer service or sales?
                    </p>

                    {/* Botones de contacto rápido */}
                    <div className="space-y-2">
                      <a
                        href="https://wa.me/16092885466?text=Hi!%20I'm%20interested%20in%20Sinsajo%20AI%20agents"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-all"
                      >
                        <span>💬</span>
                        <span>WhatsApp Direct</span>
                      </a>
                      <a
                        href="mailto:sinsajo.creators@gmail.com?subject=Interested%20in%20Sinsajo%20AI%20Agents"
                        className="flex items-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-all"
                      >
                        <span>📧</span>
                        <span>Email Sales Team</span>
                      </a>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Mensajes de conversación */}
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
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    <p className="text-xs text-white/60 mt-1">
                      {msg.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}

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

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} className="p-4 border-t border-cyan-400/20 bg-[#0A1628]">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-white/5 border border-cyan-400/30 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400 text-sm"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white flex items-center justify-center hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={20} />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Powered by Claude AI
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Responsive - Mobile adjustments */}
      <style jsx global>{`
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
