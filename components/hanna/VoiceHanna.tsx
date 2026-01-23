'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  speakText,
  stopSpeaking,
  isSpeaking,
  createVoiceRecognition,
  isVoiceSupported,
  initVoices,
  type VoiceRecognition,
} from '@/lib/hanna/voice'

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

export default function VoiceHanna({ onClose, initialMessage }: VoiceHannaProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeakingState, setIsSpeakingState] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [voiceSupport, setVoiceSupport] = useState({ tts: false, stt: false })
  const [interimTranscript, setInterimTranscript] = useState('')

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<VoiceRecognition | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Initialize voice support
  useEffect(() => {
    const support = isVoiceSupported()
    setVoiceSupport(support)

    // Initialize voices
    initVoices()

    // Create recognition instance
    recognitionRef.current = createVoiceRecognition()

    // Add initial greeting
    const greeting = initialMessage ||
      '¡Hola! Soy Hanna, tu asistente de IA de Sinsajo Creators. Estoy aquí para resolver tus dudas sobre el workshop "IA para Empresarias Exitosas". ¿En qué puedo ayudarte?'

    const initialMsg: Message = {
      id: 'initial',
      role: 'assistant',
      content: greeting,
      timestamp: new Date(),
    }
    setMessages([initialMsg])

    // Speak initial greeting if voice enabled
    if (support.tts) {
      setTimeout(() => {
        speakText(
          greeting,
          () => setIsSpeakingState(true),
          () => setIsSpeakingState(false)
        )
      }, 500)
    }

    return () => {
      stopSpeaking()
      recognitionRef.current?.abort()
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

        // Speak response if voice enabled
        if (voiceEnabled && voiceSupport.tts) {
          speakText(
            data.response,
            () => setIsSpeakingState(true),
            () => setIsSpeakingState(false)
          )
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
  }, [messages, isLoading, voiceEnabled, voiceSupport.tts])

  // Start voice input
  const startListening = useCallback(() => {
    if (!recognitionRef.current?.isSupported || isListening) return

    stopSpeaking() // Stop any ongoing speech

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
        console.error('Recognition error:', error)
        setIsListening(false)
        setInterimTranscript('')
      },
    })
  }, [isListening, sendMessage])

  // Stop voice input
  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
  }, [])

  // Toggle speaking
  const toggleSpeaking = useCallback(() => {
    if (isSpeaking()) {
      stopSpeaking()
      setIsSpeakingState(false)
    }
  }, [])

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
          {isSpeakingState && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"
            />
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-bold">Hanna</h3>
          <p className="text-xs text-gray-300">
            {isLoading ? 'Pensando...' : isSpeakingState ? 'Hablando...' : 'Tu asistente de IA'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {voiceSupport.tts && (
            <button
              onClick={() => {
                setVoiceEnabled(!voiceEnabled)
                if (isSpeakingState) toggleSpeaking()
              }}
              className={`p-2 rounded-full transition-colors ${
                voiceEnabled ? 'bg-white/20 text-white' : 'bg-white/10 text-gray-400'
              }`}
              title={voiceEnabled ? 'Desactivar voz' : 'Activar voz'}
            >
              {voiceEnabled ? '🔊' : '🔇'}
            </button>
          )}
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            ✕
          </button>
        </div>
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

        {/* Interim transcript */}
        {interimTranscript && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-end"
          >
            <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-[#2CB6D7]/30 text-[#022133] rounded-br-sm">
              <p className="text-sm italic">{interimTranscript}...</p>
            </div>
          </motion.div>
        )}

        {/* Loading indicator */}
        {isLoading && (
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
          {/* Voice Input Button */}
          {voiceSupport.stt && (
            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              disabled={isLoading}
              className={`p-3 rounded-full transition-all ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              } disabled:opacity-50`}
              title={isListening ? 'Detener grabación' : 'Hablar'}
            >
              {isListening ? '⏹️' : '🎤'}
            </button>
          )}

          {/* Text Input */}
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isListening ? 'Escuchando...' : 'Escribe tu mensaje...'}
              disabled={isLoading || isListening}
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

        {/* Voice Status */}
        <div className="mt-2 flex items-center justify-center gap-4 text-xs text-gray-400">
          {voiceSupport.tts && (
            <span className="flex items-center gap-1">
              <span className={voiceEnabled ? 'text-green-500' : 'text-gray-400'}>●</span>
              Voz {voiceEnabled ? 'activada' : 'desactivada'}
            </span>
          )}
          {voiceSupport.stt && (
            <span className="flex items-center gap-1">
              <span className={isListening ? 'text-red-500 animate-pulse' : 'text-gray-400'}>●</span>
              {isListening ? 'Escuchando...' : 'Pulsa 🎤 para hablar'}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}
