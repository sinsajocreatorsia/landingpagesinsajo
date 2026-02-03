'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface VoiceHannaProps {
  onClose?: () => void
  initialMessage?: string
}

// Enthusiastic Workshop System Prompt
const WORKSHOP_SYSTEM_PROMPT = `Eres Hanna, la asistente virtual del Workshop "IA para Empresarias Exitosas" de Sinsajo Creators.

🔥 TU PERSONALIDAD (MUY IMPORTANTE):
- Hablas con MUCHA ENERGÍA y entusiasmo - ¡transmites pasión por la IA!
- Usas lenguaje cercano y motivador ("amiga", "¡increíble!", "¡esto te va a encantar!")
- Haces preguntas retóricas para enganchar: "¿Te imaginas...?", "¿Sabes qué es lo mejor?"
- Celebras las decisiones de las usuarias: "¡Excelente pregunta!", "¡Me encanta que preguntes eso!"
- Usas emojis estratégicamente para dar vida a tus respuestas 🚀✨💪
- Eres DIRECTA pero CÁLIDA - vas al grano con amor
- Creas URGENCIA genuina - solo hay 12 lugares y se van rápido
- Te EMOCIONAS hablando de los resultados que van a lograr
- Tus respuestas son CORTAS y PUNCHY - máximo 2-3 oraciones por respuesta

💡 FILOSOFÍA QUE TRANSMITES:
- "El tiempo es tu activo más valioso - la IA te lo devuelve"
- "No es sobre trabajar más, es sobre trabajar INTELIGENTE"
- "Tu negocio puede funcionar mientras duermes - eso es LIBERTAD"
- "El interés compuesto de tu libertad empieza AHORA"

📋 INFORMACIÓN DEL WORKSHOP:
- Fecha: Sábado, 7 de Marzo 2026
- Horario: 9:00 AM - 12:00 PM (3 horas intensivas)
- Modalidad: ¡PRESENCIAL! (nada de Zoom aburrido 😉)
- Idioma: 100% en Español, optimizado para latinas
- Inversión: Solo $100 USD (antes $197 - precio especial de lanzamiento)
- Cupos: SOLO 12 LUGARES - esto es íntimo y exclusivo
- Presentadora: Giovanna Rodríguez, CEO de Sinsajo Creators (+73 empresas transformadas)

🎁 QUÉ SE LLEVAN:
- Acceso al workshop en vivo (3 horas intensivas)
- Workbook digital + Manual de Prompts
- Grupo privado de WhatsApp con las estudiantes
- Sesión Q&A en vivo con Giovanna
- Clon Asistente personalizado (¡su propia IA!)
- Plantillas de automatización listas para usar

🎯 QUÉ VAN A APRENDER:
1. Clonar su inteligencia de negocio en un asistente IA que trabaja 24/7
2. Automatizar esas tareas repetitivas que les ROBAN horas
3. Crear contenido visual de ultra-lujo en MINUTOS (no horas)
4. Pasar de "operadora" a VERDADERA DUEÑA de su negocio

📍 SOBRE LA UBICACIÓN:
- La dirección exacta se comparte en el grupo de WhatsApp después de la inscripción
- Es un espacio íntimo y premium para máximo aprendizaje

IMPORTANTE:
- Si preguntan por el precio, enfatiza que es una INVERSIÓN que se paga sola
- Si dudan, pregunta qué las detiene y ayúdalas a ver el valor
- Siempre menciona que es PRESENCIAL y en ESPAÑOL
- Crea emoción sobre los resultados, no solo sobre el contenido
- SIEMPRE termina con una pregunta o CTA para mantener la conversación`

export default function VoiceHanna({ onClose, initialMessage }: VoiceHannaProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Initialize with greeting
  useEffect(() => {
    const greeting = initialMessage ||
      '¡Hey! 👋 Soy Hanna. ¿Lista para dejar de ser la esclava de tu negocio? 🔥 Este workshop te cambia TODO. ¿Qué te trae por aquí?'

    // Show typing indicator for 2 seconds before showing greeting
    const typingDelay = setTimeout(() => {
      const initialMsg: Message = {
        id: 'initial',
        role: 'assistant',
        content: greeting,
        timestamp: new Date(),
      }
      setMessages([initialMsg])
      setIsInitialLoading(false)
    }, 2000)

    return () => {
      clearTimeout(typingDelay)
    }
  }, [initialMessage])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Send message to Hanna
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
          systemPrompt: WORKSHOP_SYSTEM_PROMPT,
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
  }, [messages, isLoading])

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(inputText)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      className="fixed bottom-4 right-4 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[#022133] to-[#200F5D] text-white p-4 flex items-center gap-3">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-[#2CB6D7]/20 flex items-center justify-center">
            <span className="text-2xl">🤖</span>
          </div>
          {/* Online indicator */}
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold">Hanna</h3>
          <p className="text-xs text-gray-300">
            {isInitialLoading ? 'Escribiendo...' : isLoading ? 'Pensando...' : 'Asesora del Workshop'}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/20 rounded-full transition-colors"
        >
          ✕
        </button>
      </div>

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
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-[#2CB6D7] text-white rounded-br-sm'
                    : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading indicator */}
        {(isLoading || isInitialLoading) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-gray-100 rounded-2xl px-4 py-3 rounded-bl-sm">
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
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          {/* Text Input */}
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Escribe tu mensaje..."
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-full border border-gray-200 focus:border-[#2CB6D7] focus:outline-none focus:ring-2 focus:ring-[#2CB6D7]/20 disabled:bg-gray-50"
            />
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-3 rounded-full bg-[#C7517E] text-white hover:bg-[#C7517E]/90 transition-colors disabled:opacity-50 disabled:hover:bg-[#C7517E]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>

        {/* Powered by */}
        <p className="text-center text-xs text-gray-400 mt-2">
          Powered by Sinsajo Creators
        </p>
      </div>
    </motion.div>
  )
}
