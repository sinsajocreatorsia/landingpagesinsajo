'use client'

import { useRef } from 'react'
import Link from 'next/link'
import {
  Send,
  ChevronRight,
  Loader2,
  Mic,
  MicOff,
} from 'lucide-react'

interface InputThemeColors {
  cardBorder: string
  inputAreaBg: string
  textPrimary: string
  textMuted: string
  inputBg: string
  inputBorder: string
  accent: string
}

interface ChatInputAreaProps {
  plan: 'free' | 'pro' | 'business'
  theme: { colors: InputThemeColors }
  inputText: string
  onInputChange: (text: string) => void
  onSubmit: (e: React.FormEvent) => void
  isLoading: boolean
  isListening: boolean
  messagesRemaining: number
  voiceEnabled: boolean
  voiceSupport: { tts: boolean; stt: boolean }
  onStartListening: () => void
  onStopListening: () => void
  isLight: boolean
}

export function ChatInputArea({
  plan,
  theme,
  inputText,
  onInputChange,
  onSubmit,
  isLoading,
  isListening,
  messagesRemaining,
  voiceEnabled,
  voiceSupport,
  onStartListening,
  onStopListening,
  isLight,
}: ChatInputAreaProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const isPro = plan === 'pro' || plan === 'business'

  return (
    <div className="p-4 border-t backdrop-blur-md" style={{ borderColor: theme.colors.cardBorder, backgroundColor: theme.colors.inputAreaBg }}>
      {/* Limit Warning */}
      {plan === 'free' && messagesRemaining <= 1 && messagesRemaining > 0 && (
        <div className="mb-3 px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-yellow-200 text-sm flex items-center justify-between">
          <span>Te queda {messagesRemaining} mensaje gratis hoy</span>
          <Link href="/hanna/upgrade" className="text-yellow-100 hover:underline flex items-center gap-1">
            Actualizar <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* No Messages Left */}
      {plan === 'free' && messagesRemaining <= 0 && (
        <div className="mb-3 px-4 py-3 bg-[#C7517E]/20 border border-[#C7517E]/30 rounded-lg flex items-center justify-between" style={{ color: theme.colors.textPrimary }}>
          <div>
            <p className="font-medium">¡Límite alcanzado!</p>
            <p className="text-sm" style={{ color: theme.colors.textMuted }}>Actualiza a Pro para mensajes ilimitados</p>
          </div>
          <Link
            href="/hanna/upgrade"
            className="px-4 py-2 bg-gradient-to-r from-[#C7517E] to-[#b8456f] text-white text-sm font-medium rounded-lg hover:from-[#d4608d] hover:to-[#C7517E] transition-all"
          >
            Actualizar
          </Link>
        </div>
      )}

      <form onSubmit={onSubmit} className="flex items-center gap-3">
        {/* Voice Input Button (Pro only) */}
        {isPro && voiceSupport.stt && (
          <button
            type="button"
            onClick={isListening ? onStopListening : onStartListening}
            disabled={isLoading}
            className={`p-4 rounded-full transition-all ${
              isListening
                ? 'bg-red-500 text-white animate-pulse'
                : (isLight ? 'bg-black/5 text-black/60 hover:bg-black/10 hover:text-black' : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white')
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
            onChange={(e) => onInputChange(e.target.value)}
            placeholder={
              isListening
                ? 'Escuchando...'
                : messagesRemaining > 0 || isPro
                ? 'Escribe tu mensaje...'
                : 'Actualiza a Pro para continuar...'
            }
            disabled={isLoading || isListening || (plan === 'free' && messagesRemaining <= 0)}
            className="w-full px-5 py-4 rounded-full border focus:outline-none focus:ring-2 disabled:opacity-50"
            style={{ backgroundColor: theme.colors.inputBg, borderColor: theme.colors.inputBorder, color: theme.colors.textPrimary, '--tw-ring-color': theme.colors.accent + '33' } as React.CSSProperties}
          />
        </div>

        <button
          type="submit"
          disabled={!inputText.trim() || isLoading || (plan === 'free' && messagesRemaining <= 0)}
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
      {isPro && (voiceSupport.tts || voiceSupport.stt) && (
        <div className="mt-3 flex items-center justify-center gap-4 text-xs" style={{ color: theme.colors.textMuted }}>
          {voiceSupport.tts && (
            <span className="flex items-center gap-1">
              <span className={voiceEnabled ? 'text-green-500' : (isLight ? 'text-black/40' : 'text-white/40')}>●</span>
              Voz {voiceEnabled ? 'activada' : 'desactivada'}
            </span>
          )}
          {voiceSupport.stt && (
            <span className="flex items-center gap-1">
              <span className={isListening ? 'text-red-500 animate-pulse' : (isLight ? 'text-black/40' : 'text-white/40')}>●</span>
              {isListening ? 'Escuchando...' : 'Pulsa el micrófono para hablar'}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
