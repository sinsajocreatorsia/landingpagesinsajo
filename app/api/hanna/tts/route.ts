import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { generateChatterboxAudio } from '@/lib/hanna/chatterbox'

/**
 * Text preprocessing for natural-sounding TTS.
 * Cleans markdown, adds pauses, and formats text for speech.
 */
function preprocessTextForSpeech(text: string): string {
  let cleaned = text

  // Remove markdown formatting
  cleaned = cleaned.replace(/```[\s\S]*?```/g, ' código omitido ')
  cleaned = cleaned.replace(/`([^`]+)`/g, '$1')
  cleaned = cleaned.replace(/\*\*([^*]+)\*\*/g, '$1')
  cleaned = cleaned.replace(/\*([^*]+)\*/g, '$1')
  cleaned = cleaned.replace(/__([^_]+)__/g, '$1')
  cleaned = cleaned.replace(/_([^_]+)_/g, '$1')
  cleaned = cleaned.replace(/~~([^~]+)~~/g, '$1')
  cleaned = cleaned.replace(/^#{1,6}\s+/gm, '')

  // Remove markdown links, keep text
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')

  // Remove markdown images
  cleaned = cleaned.replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')

  // Remove bullet points and list markers
  cleaned = cleaned.replace(/^[\s]*[-*+]\s+/gm, '')
  cleaned = cleaned.replace(/^[\s]*\d+\.\s+/gm, '')

  // Remove HTML tags
  cleaned = cleaned.replace(/<[^>]+>/g, '')

  // Remove emoji (most common ranges)
  cleaned = cleaned.replace(/[\u{1F600}-\u{1F64F}]/gu, '')
  cleaned = cleaned.replace(/[\u{1F300}-\u{1F5FF}]/gu, '')
  cleaned = cleaned.replace(/[\u{1F680}-\u{1F6FF}]/gu, '')
  cleaned = cleaned.replace(/[\u{1F1E0}-\u{1F1FF}]/gu, '')
  cleaned = cleaned.replace(/[\u{2600}-\u{26FF}]/gu, '')
  cleaned = cleaned.replace(/[\u{2700}-\u{27BF}]/gu, '')

  // Clean up URLs
  cleaned = cleaned.replace(/https?:\/\/[^\s]+/g, 'enlace')

  // Add natural pauses: replace multiple newlines with period
  cleaned = cleaned.replace(/\n{2,}/g, '. ')
  cleaned = cleaned.replace(/\n/g, ', ')

  // Clean up multiple spaces and punctuation
  cleaned = cleaned.replace(/\s{2,}/g, ' ')
  cleaned = cleaned.replace(/[,.]{2,}/g, '.')
  cleaned = cleaned.replace(/\.\s*,/g, '.')

  return cleaned.trim()
}

/**
 * Voice configuration per plan tier (Edge TTS fallback settings).
 * Pro/Business try Chatterbox first (15s timeout), then fall back here.
 */
function getVoiceConfig(plan: string) {
  switch (plan) {
    case 'business':
      return {
        voice: 'es-MX-DaliaNeural',
        rate: '+5%',
        pitch: '+3Hz',
      }
    case 'pro':
      return {
        voice: 'es-MX-DaliaNeural',
        rate: '+5%',
        pitch: '+3Hz',
      }
    default:
      return {
        voice: 'es-MX-DaliaNeural',
        rate: '+3%',
        pitch: '+2Hz',
      }
  }
}

export async function POST(request: NextRequest) {
  try {
    // Auth check - all authenticated users can use TTS now
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch { /* safe to ignore in Server Components */ }
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check plan for voice quality tier
    const { data: profile } = await supabase
      .from('profiles')
      .select('plan')
      .eq('id', user.id)
      .single()

    const plan = profile?.plan || 'free'

    const { text, voiceRefUrl } = await request.json()
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 })
    }

    // Plan-based text limits: Free 1000, Pro 3000, Business 5000
    const maxChars = plan === 'business' ? 5000 : plan === 'pro' ? 3000 : 1000
    const trimmedText = text.slice(0, maxChars)

    // Preprocess text for natural speech
    const speechText = preprocessTextForSpeech(trimmedText)

    if (!speechText || speechText.length < 2) {
      return NextResponse.json({ error: 'No speakable text' }, { status: 400 })
    }

    // Pro/Business: Try Chatterbox HD voice (15s timeout), fallback to Edge TTS
    if (plan === 'pro' || plan === 'business') {
      try {
        const audioBuffer = await generateChatterboxAudio({
          text: speechText,
          language: 'es',
          audioRef: plan === 'business' && voiceRefUrl ? voiceRefUrl : undefined,
          exaggeration: 0.5,
        })

        return new NextResponse(new Uint8Array(audioBuffer), {
          headers: {
            'Content-Type': 'audio/wav',
            'Content-Length': audioBuffer.length.toString(),
            'Cache-Control': 'no-cache',
          },
        })
      } catch (error) {
        console.error('Chatterbox failed/timeout, falling back to Edge TTS:', error)
      }
    }

    // Free plan or Chatterbox fallback: Edge TTS (fast, consistent)
    const voiceConfig = getVoiceConfig(plan)

    const { Communicate } = await import('edge-tts-universal')
    const communicate = new Communicate(speechText, {
      voice: voiceConfig.voice,
      rate: voiceConfig.rate,
      pitch: voiceConfig.pitch,
    })

    const audioChunks: Buffer[] = []

    for await (const chunk of communicate.stream()) {
      if (chunk.type === 'audio' && chunk.data) {
        audioChunks.push(Buffer.from(chunk.data))
      }
    }

    if (audioChunks.length === 0) {
      return NextResponse.json({ error: 'No audio generated' }, { status: 500 })
    }

    const audioBuffer = Buffer.concat(audioChunks)

    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.length.toString(),
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error) {
    console.error('TTS error:', error)
    return NextResponse.json(
      { error: 'TTS generation failed' },
      { status: 500 }
    )
  }
}
