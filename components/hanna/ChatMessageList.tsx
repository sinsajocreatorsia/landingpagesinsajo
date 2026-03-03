'use client'

import { forwardRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, ThumbsUp, ThumbsDown } from 'lucide-react'
import { MessageContent } from '@/components/hanna/MessageContent'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface MessageListThemeColors {
  bubbleUser: string
  bubbleAssistant: string
  bubbleAssistantBorder: string
  textPrimary: string
}

interface ChatMessageListProps {
  messages: Message[]
  userInitial: string
  theme: { colors: MessageListThemeColors }
  isLoading: boolean
  isSpeaking: boolean
  interimTranscript: string
  feedbackGiven: Record<string, 1 | -1>
  onFeedback: (messageId: string, rating: 1 | -1) => void
  isLight: boolean
}

export const ChatMessageList = forwardRef<HTMLDivElement, ChatMessageListProps>(
  function ChatMessageList(
    { messages, userInitial, theme, isLoading, isSpeaking, interimTranscript, feedbackGiven, onFeedback, isLight },
    ref
  ) {
    return (
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
                {message.role === 'user' ? (
                  <div className="w-10 h-10 rounded-full flex-shrink-0 bg-[#C7517E] flex items-center justify-center text-white font-medium">
                    {userInitial}
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden">
                    <Image src="/images/hanna-ai.png" alt="Hanna" width={40} height={40} className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Message Bubble */}
                <div>
                  <div
                    className={`rounded-2xl px-5 py-4 ${
                      message.role === 'user'
                        ? 'text-white rounded-tr-sm'
                        : 'backdrop-blur-sm rounded-tl-sm border'
                    }`}
                    style={message.role === 'user'
                      ? { backgroundColor: theme.colors.bubbleUser }
                      : { backgroundColor: theme.colors.bubbleAssistant, borderColor: theme.colors.bubbleAssistantBorder, color: theme.colors.textPrimary }
                    }
                  >
                    <MessageContent content={message.content} />
                  </div>

                  {/* Feedback buttons for assistant messages (not initial greeting) */}
                  {message.role === 'assistant' && message.id !== 'initial' && (
                    <div className="flex items-center gap-1 mt-1 ml-1">
                      <button
                        onClick={() => onFeedback(message.id, 1)}
                        className={`p-1 rounded transition-colors ${
                          feedbackGiven[message.id] === 1
                            ? 'text-green-400'
                            : (isLight ? 'text-black/20 hover:text-black/50' : 'text-white/20 hover:text-white/50')
                        }`}
                        title="Buena respuesta"
                        disabled={!!feedbackGiven[message.id]}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onFeedback(message.id, -1)}
                        className={`p-1 rounded transition-colors ${
                          feedbackGiven[message.id] === -1
                            ? 'text-red-400'
                            : (isLight ? 'text-black/20 hover:text-black/50' : 'text-white/20 hover:text-white/50')
                        }`}
                        title="Mala respuesta"
                        disabled={!!feedbackGiven[message.id]}
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
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
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                <Image src="/images/hanna-ai.png" alt="Hanna" width={40} height={40} className="w-full h-full object-cover" />
              </div>
              <div
                className="backdrop-blur-sm rounded-2xl px-5 py-4 rounded-tl-sm border"
                style={{ backgroundColor: theme.colors.bubbleAssistant, borderColor: theme.colors.bubbleAssistantBorder }}
              >
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

        <div ref={ref} />
      </div>
    )
  }
)
