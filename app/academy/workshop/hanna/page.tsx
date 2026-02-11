'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Send, Mic, MicOff, Volume2, VolumeX } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function HannaWorkshopPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [isSpeaking, setIsSpeaking] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Initial greeting - Enthusiastic style
  useEffect(() => {
    const greeting = `¡Hola amiga! 👋✨ Soy Lisa y estoy SÚPER emocionada de que estés aquí.

¿Te imaginas tener un asistente que trabaje por ti 24/7 mientras tú duermes? 😴💰 ¡Eso es lo que vas a aprender!

Este workshop es **PRESENCIAL** (nada de Zoom aburrido 😉) y 100% en **Español**.

¿Qué te gustaría saber? 🚀
• 📅 Cuándo y dónde es
• 💡 Qué vas a aprender (spoiler: ¡cosas INCREÍBLES!)
• 👩‍💼 Quién es Giovanna
• 💳 Cómo asegurar tu lugar (¡solo quedan 7 cupos!)`

    const initialMsg: Message = {
      id: 'initial',
      role: 'assistant',
      content: greeting,
      timestamp: new Date(),
    }
    setMessages([initialMsg])
  }, [])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Send message
  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return

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
      const response = await fetch('/api/hanna/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          mode: 'workshop',
          history: messages.slice(-10).map(m => ({
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

        // Text-to-speech if enabled
        if (voiceEnabled && 'speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(data.response)
          utterance.lang = 'es-ES'
          utterance.rate = 1
          utterance.onstart = () => setIsSpeaking(true)
          utterance.onend = () => setIsSpeaking(false)
          speechSynthesis.speak(utterance)
        }
      } else {
        throw new Error(data.error || 'Error desconocido')
      }
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Lo siento, hubo un error al procesar tu mensaje. ¿Podrías intentarlo de nuevo?',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }, [messages, isLoading, voiceEnabled])

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(inputText)
  }

  // Toggle voice
  const toggleVoice = () => {
    if (isSpeaking) {
      speechSynthesis.cancel()
      setIsSpeaking(false)
    }
    setVoiceEnabled(!voiceEnabled)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#022133] to-[#200F5D]">
      {/* Header */}
      <header className="bg-[#022133]/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/academy/workshop"
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Volver al Workshop</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#2CB6D7] to-[#36B3AE] flex items-center justify-center">
              <span className="text-xl">🤖</span>
            </div>
            <div>
              <h1 className="text-white font-bold">Lisa</h1>
              <p className="text-white/60 text-xs">Asistente del Workshop</p>
            </div>
          </div>

          <button
            onClick={toggleVoice}
            className={`p-2 rounded-full transition-colors ${
              voiceEnabled ? 'bg-[#2CB6D7] text-white' : 'bg-white/10 text-white/60'
            }`}
            title={voiceEnabled ? 'Desactivar voz' : 'Activar voz'}
          >
            {voiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col">
        {/* Messages */}
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
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-white/60' : 'text-white/40'}`}>
                      {message.timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                    </p>
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
                Lisa está hablando...
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-white/10 bg-[#022133]/50 backdrop-blur-md">
          <form onSubmit={handleSubmit} className="flex items-center gap-3">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Escribe tu pregunta sobre el workshop..."
                disabled={isLoading}
                className="w-full px-5 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-[#2CB6D7] focus:outline-none focus:ring-2 focus:ring-[#2CB6D7]/20 disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="p-4 rounded-full bg-gradient-to-r from-[#C7517E] to-[#b8456f] text-white hover:from-[#d4608d] hover:to-[#C7517E] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#C7517E]/20"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>

          {/* Quick Actions */}
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {[
              '¿Cuándo es el workshop?',
              '¿Es presencial?',
              '¿Qué aprenderé?',
              '¿Cómo me inscribo?',
            ].map((question) => (
              <button
                key={question}
                onClick={() => sendMessage(question)}
                disabled={isLoading}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white/70 text-sm transition-colors disabled:opacity-50"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
