/**
 * Hanna Voice Module
 * Provides text-to-speech and speech-to-text capabilities for Hanna
 */

// Type declarations for Web Speech API (browser-only APIs)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SpeechRecognitionType = any

// Voice configuration for Hanna
const HANNA_VOICE_CONFIG = {
  lang: 'es-ES',
  rate: 0.95, // Slightly slower for clarity
  pitch: 1.1, // Slightly higher pitch for feminine voice
  preferredVoices: [
    'Microsoft Helena', // Windows Spanish
    'Paulina', // macOS Spanish
    'Google español de España', // Chrome
    'Monica', // Spanish female
  ],
}

/**
 * Get the best available Spanish female voice
 */
export function getHannaVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return null
  }

  const voices = window.speechSynthesis.getVoices()

  // Try to find preferred voices first
  for (const preferredName of HANNA_VOICE_CONFIG.preferredVoices) {
    const voice = voices.find(v =>
      v.name.toLowerCase().includes(preferredName.toLowerCase())
    )
    if (voice) return voice
  }

  // Fall back to any Spanish female voice
  const spanishVoice = voices.find(v =>
    v.lang.startsWith('es') &&
    (v.name.toLowerCase().includes('female') ||
     v.name.toLowerCase().includes('helena') ||
     v.name.toLowerCase().includes('paulina') ||
     v.name.toLowerCase().includes('monica'))
  )
  if (spanishVoice) return spanishVoice

  // Fall back to any Spanish voice
  const anySpanish = voices.find(v => v.lang.startsWith('es'))
  return anySpanish || null
}

/**
 * Speak text using Web Speech API
 */
export function speakText(
  text: string,
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (error: Error) => void
): SpeechSynthesisUtterance | null {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    onError?.(new Error('Speech synthesis not supported'))
    return null
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)

  // Set voice
  const voice = getHannaVoice()
  if (voice) {
    utterance.voice = voice
  }

  // Set speech parameters
  utterance.lang = HANNA_VOICE_CONFIG.lang
  utterance.rate = HANNA_VOICE_CONFIG.rate
  utterance.pitch = HANNA_VOICE_CONFIG.pitch

  // Event handlers
  utterance.onstart = () => onStart?.()
  utterance.onend = () => onEnd?.()
  utterance.onerror = (event) => {
    onError?.(new Error(event.error))
  }

  // Speak
  window.speechSynthesis.speak(utterance)

  return utterance
}

/**
 * Stop any ongoing speech
 */
export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel()
  }
}

/**
 * Check if speech synthesis is currently speaking
 */
export function isSpeaking(): boolean {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return false
  }
  return window.speechSynthesis.speaking
}

/**
 * Speech Recognition wrapper for voice input
 */
export class VoiceRecognition {
  private recognition: SpeechRecognitionType | null = null
  private isListening = false

  constructor() {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

      if (SpeechRecognitionAPI) {
        this.recognition = new SpeechRecognitionAPI()
        this.recognition.continuous = false
        this.recognition.interimResults = true
        this.recognition.lang = 'es-ES'
      }
    }
  }

  get isSupported(): boolean {
    return this.recognition !== null
  }

  get listening(): boolean {
    return this.isListening
  }

  start(callbacks: {
    onResult: (transcript: string, isFinal: boolean) => void
    onStart?: () => void
    onEnd?: () => void
    onError?: (error: string) => void
  }): boolean {
    if (!this.recognition) {
      callbacks.onError?.('Speech recognition not supported')
      return false
    }

    if (this.isListening) {
      return false
    }

    this.recognition.onstart = () => {
      this.isListening = true
      callbacks.onStart?.()
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.recognition.onresult = (event: any) => {
      let finalTranscript = ''
      let interimTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript
        } else {
          interimTranscript += transcript
        }
      }

      if (finalTranscript) {
        callbacks.onResult(finalTranscript.trim(), true)
      } else if (interimTranscript) {
        callbacks.onResult(interimTranscript.trim(), false)
      }
    }

    this.recognition.onend = () => {
      this.isListening = false
      callbacks.onEnd?.()
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.recognition.onerror = (event: any) => {
      this.isListening = false
      callbacks.onError?.(event.error)
    }

    try {
      this.recognition.start()
      return true
    } catch (error) {
      callbacks.onError?.('Failed to start recognition')
      return false
    }
  }

  stop(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop()
    }
  }

  abort(): void {
    if (this.recognition) {
      this.recognition.abort()
      this.isListening = false
    }
  }
}

/**
 * Create a new VoiceRecognition instance
 */
export function createVoiceRecognition(): VoiceRecognition {
  return new VoiceRecognition()
}

/**
 * Check if voice features are supported
 */
export function isVoiceSupported(): { tts: boolean; stt: boolean } {
  if (typeof window === 'undefined') {
    return { tts: false, stt: false }
  }

  const tts = 'speechSynthesis' in window
  const stt = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window

  return { tts, stt }
}

/**
 * Initialize voices (required for some browsers)
 */
export function initVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      resolve([])
      return
    }

    const voices = window.speechSynthesis.getVoices()
    if (voices.length > 0) {
      resolve(voices)
      return
    }

    window.speechSynthesis.onvoiceschanged = () => {
      resolve(window.speechSynthesis.getVoices())
    }

    // Timeout fallback
    setTimeout(() => {
      resolve(window.speechSynthesis.getVoices())
    }, 1000)
  })
}
