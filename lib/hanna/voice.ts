/**
 * Hanna Voice Module
 * Provides text-to-speech (Edge TTS) and speech-to-text capabilities for Hanna
 */

// Type declarations for Web Speech API (browser-only APIs)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SpeechRecognitionType = any

// Active audio element for Edge TTS playback
let currentAudio: HTMLAudioElement | null = null
let currentObjectUrl: string | null = null

/**
 * Speak text using Edge TTS (server-side neural voice)
 * Falls back to Web Speech API if Edge TTS fails
 */
export async function speakText(
  text: string,
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (error: Error) => void,
  onLoading?: () => void,
): Promise<void> {
  if (typeof window === 'undefined') {
    onError?.(new Error('Not in browser'))
    return
  }

  // Stop any ongoing speech
  stopSpeaking()

  try {
    onLoading?.()

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 45_000)

    const response = await fetch('/api/hanna/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
      signal: controller.signal,
    })

    clearTimeout(timeout)

    if (!response.ok) {
      throw new Error(`TTS API error: ${response.status}`)
    }

    const audioBlob = await response.blob()
    const audioUrl = URL.createObjectURL(audioBlob)
    currentObjectUrl = audioUrl

    const audio = new Audio(audioUrl)
    currentAudio = audio

    audio.onplay = () => onStart?.()
    audio.onended = () => {
      cleanupAudio()
      onEnd?.()
    }
    audio.onerror = () => {
      cleanupAudio()
      onError?.(new Error('Audio playback failed'))
    }

    await audio.play()
  } catch (error) {
    cleanupAudio()
    onError?.(error instanceof Error ? error : new Error('TTS failed'))
  }
}

function cleanupAudio(): void {
  if (currentAudio) {
    currentAudio.pause()
    currentAudio.src = ''
    currentAudio = null
  }
  if (currentObjectUrl) {
    URL.revokeObjectURL(currentObjectUrl)
    currentObjectUrl = null
  }
}

/**
 * Stop any ongoing speech
 */
export function stopSpeaking(): void {
  cleanupAudio()
}

/**
 * Check if speech synthesis is currently speaking
 */
export function isSpeaking(): boolean {
  return currentAudio !== null && !currentAudio.paused
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
        this.recognition.lang = 'es-MX'
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
 * TTS is always supported (Edge TTS via API, no browser dependency)
 * STT requires browser SpeechRecognition API
 */
export function isVoiceSupported(): { tts: boolean; stt: boolean } {
  if (typeof window === 'undefined') {
    return { tts: false, stt: false }
  }

  const tts = true // Edge TTS works via server API, no browser requirement
  const stt = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window

  return { tts, stt }
}
