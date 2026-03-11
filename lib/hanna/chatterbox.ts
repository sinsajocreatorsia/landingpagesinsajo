/**
 * Chatterbox TTS Service via Replicate API
 *
 * Generates high-quality speech using Chatterbox Multilingual model.
 * Used for Pro (standard voice) and Business (voice cloning) plans.
 * Supports Spanish and 22 other languages.
 */

import Replicate from 'replicate'

const CHATTERBOX_MODEL = 'resemble-ai/chatterbox-multilingual' as const
const GENERATION_TIMEOUT_MS = 15_000

interface ChatterboxOptions {
  text: string
  language?: string
  audioRef?: string
  exaggeration?: number
}

export async function generateChatterboxAudio(
  options: ChatterboxOptions
): Promise<Buffer> {
  const { text, language = 'es', audioRef, exaggeration = 0.5 } = options

  if (!process.env.REPLICATE_API_TOKEN) {
    throw new Error('REPLICATE_API_TOKEN not configured')
  }

  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  })

  const input: Record<string, unknown> = {
    text,
    language,
    exaggeration,
  }

  if (audioRef) {
    input.audio_ref = audioRef
  }

  const output = await Promise.race([
    replicate.run(CHATTERBOX_MODEL, { input }),
    new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error('Chatterbox generation timed out')),
        GENERATION_TIMEOUT_MS
      )
    ),
  ])

  if (!output) {
    throw new Error('Chatterbox returned empty output')
  }

  // Replicate returns a ReadableStream or URL string for file outputs
  const audioUrl = typeof output === 'string'
    ? output
    : output instanceof ReadableStream
      ? null
      : String(output)

  if (audioUrl) {
    const audioResponse = await fetch(audioUrl)
    if (!audioResponse.ok) {
      throw new Error(`Failed to download Chatterbox audio: ${audioResponse.status}`)
    }
    const arrayBuffer = await audioResponse.arrayBuffer()
    return Buffer.from(arrayBuffer)
  }

  // Handle ReadableStream output
  if (output instanceof ReadableStream) {
    const reader = output.getReader()
    const chunks: Uint8Array[] = []
    let done = false
    while (!done) {
      const result = await reader.read()
      done = result.done
      if (result.value) {
        chunks.push(result.value)
      }
    }
    return Buffer.concat(chunks)
  }

  throw new Error('Unexpected Chatterbox output format')
}
