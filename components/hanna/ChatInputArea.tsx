'use client'

import { useRef } from 'react'
import {
  Send,
  Loader2,
  Mic,
  MicOff,
  Paperclip,
  X,
  FileText,
  ImageIcon,
} from 'lucide-react'

export interface FileAttachment {
  file: File
  preview?: string
  uploading?: boolean
}

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
  attachment?: FileAttachment | null
  onAttach?: (file: File) => void
  onRemoveAttachment?: () => void
}

const ALLOWED_TYPES = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp',
  'application/pdf', 'text/plain', 'text/csv',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
]

function isImageType(type: string) {
  return type.startsWith('image/')
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function ChatInputArea({
  plan,
  theme,
  inputText,
  onInputChange,
  onSubmit,
  isLoading,
  isListening,
  voiceEnabled,
  voiceSupport,
  onStartListening,
  onStopListening,
  isLight,
  attachment,
  onAttach,
  onRemoveAttachment,
}: ChatInputAreaProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isPro = plan === 'pro' || plan === 'business'
  const canUpload = plan === 'pro' || plan === 'business'

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !onAttach) return

    if (!ALLOWED_TYPES.includes(file.type)) {
      alert('Formato no soportado. Usa: imágenes, PDF, TXT, CSV, DOCX o XLSX.')
      return
    }

    onAttach(file)
    // Reset file input so user can re-select same file
    e.target.value = ''
  }

  return (
    <div className="p-4 border-t backdrop-blur-md" style={{ borderColor: theme.colors.cardBorder, backgroundColor: theme.colors.inputAreaBg }}>
      {/* File preview */}
      {attachment && (
        <div
          className="mb-3 flex items-center gap-3 p-3 rounded-xl border"
          style={{ backgroundColor: theme.colors.inputBg, borderColor: theme.colors.inputBorder }}
        >
          {isImageType(attachment.file.type) && attachment.preview ? (
            <img
              src={attachment.preview}
              alt={attachment.file.name}
              className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: theme.colors.accent + '20' }}>
              {attachment.file.type === 'application/pdf' ? (
                <FileText className="w-6 h-6" style={{ color: theme.colors.accent }} />
              ) : (
                <ImageIcon className="w-6 h-6" style={{ color: theme.colors.accent }} />
              )}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: theme.colors.textPrimary }}>
              {attachment.file.name}
            </p>
            <p className="text-xs" style={{ color: theme.colors.textMuted }}>
              {formatFileSize(attachment.file.size)}
            </p>
          </div>
          {attachment.uploading ? (
            <Loader2 className="w-5 h-5 animate-spin flex-shrink-0" style={{ color: theme.colors.accent }} />
          ) : (
            <button
              type="button"
              onClick={onRemoveAttachment}
              className="p-1 rounded-full hover:bg-red-500/20 transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4 text-red-400" />
            </button>
          )}
        </div>
      )}

      <form onSubmit={onSubmit} className="flex items-center gap-3">
        {/* File Upload Button (Pro/Business only) */}
        {canUpload && onAttach && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept={ALLOWED_TYPES.join(',')}
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading || !!attachment}
              className={`p-4 rounded-full transition-all ${
                isLight ? 'bg-black/5 text-black/60 hover:bg-black/10 hover:text-black' : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
              } disabled:opacity-50`}
              title="Adjuntar archivo"
            >
              <Paperclip className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Voice Input Button (Pro/Business with STT) */}
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
                : attachment
                  ? 'Describe qué quieres analizar...'
                  : 'Escribe tu mensaje...'
            }
            disabled={isLoading || isListening}
            className="w-full px-5 py-4 rounded-full border focus:outline-none focus:ring-2 disabled:opacity-50"
            style={{ backgroundColor: theme.colors.inputBg, borderColor: theme.colors.inputBorder, color: theme.colors.textPrimary, '--tw-ring-color': theme.colors.accent + '33' } as React.CSSProperties}
          />
        </div>

        <button
          type="submit"
          disabled={(!inputText.trim() && !attachment) || isLoading}
          className="p-4 rounded-full bg-gradient-to-r from-[#C7517E] to-[#b8456f] text-white hover:from-[#d4608d] hover:to-[#C7517E] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#C7517E]/20"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </form>

      {/* Voice Status (Pro/Business only) */}
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
