const SINSAJO_PURPLE = '#8B5CF6'

export function formatMessage(text: string): string {
  let formatted = text

  // Replace **text** with styled bold
  formatted = formatted.replace(
    /\*\*([^*]+)\*\*/g,
    `<b style="color: ${SINSAJO_PURPLE};">$1</b>`
  )

  // Replace URLs with clickable links
  formatted = formatted.replace(
    /(https?:\/\/[^\s<]+)/g,
    (url) => {
      // Check if it's a cal.com link
      if (url.includes('cal.com')) {
        return `<a href="${url}" target="_blank" style="color: ${SINSAJO_PURPLE}; text-decoration: underline;">📅 Agenda tu demo</a>`
      }
      // Check if it's a WhatsApp link
      if (url.includes('wa.me')) {
        return `<a href="${url}" target="_blank" style="color: #25D366; text-decoration: underline;">💬 WhatsApp</a>`
      }
      // Generic link
      return `<a href="${url}" target="_blank" style="color: ${SINSAJO_PURPLE}; text-decoration: underline;">${url}</a>`
    }
  )

  return formatted
}

export interface HumanizerConfig {
  charsPerSecond: number
  minDelay: number
  maxDelay: number
  maxCharsPerMessage: number
  maxParagraphsPerMessage: number
  randomVariation: number
}

const DEFAULT_CONFIG: HumanizerConfig = {
  charsPerSecond: 40,
  minDelay: 800,
  maxDelay: 3500,
  maxCharsPerMessage: 350,
  maxParagraphsPerMessage: 2,
  randomVariation: 0.2
}

export function calculateTypingDelay(text: string, config: HumanizerConfig = DEFAULT_CONFIG): number {
  const baseDelay = (text.length / config.charsPerSecond) * 1000
  const variation = 1 + (Math.random() * 2 - 1) * config.randomVariation
  let delay = baseDelay * variation
  delay = Math.max(config.minDelay, delay)
  delay = Math.min(config.maxDelay, delay)
  return Math.round(delay)
}

export function splitMessage(text: string, config: HumanizerConfig = DEFAULT_CONFIG): string[] {
  const { maxCharsPerMessage, maxParagraphsPerMessage } = config

  if (text.length <= maxCharsPerMessage) {
    return [text]
  }

  const paragraphs = text.split(/\n\n+/).filter(p => p.trim())

  if (paragraphs.length <= maxParagraphsPerMessage && text.length < maxCharsPerMessage * 1.5) {
    return [text]
  }

  const chunks: string[] = []
  let currentChunk: string[] = []
  let currentLength = 0

  for (const paragraph of paragraphs) {
    const paragraphLength = paragraph.length

    if (
      currentChunk.length >= maxParagraphsPerMessage ||
      (currentLength + paragraphLength > maxCharsPerMessage && currentChunk.length > 0)
    ) {
      chunks.push(currentChunk.join('\n\n'))
      currentChunk = []
      currentLength = 0
    }

    currentChunk.push(paragraph)
    currentLength += paragraphLength
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join('\n\n'))
  }

  return chunks
}

export interface MessagePart {
  text: string
  delay: number
  formattedText: string
}

export function processMessage(rawMessage: string): MessagePart[] {
  const parts = splitMessage(rawMessage)

  return parts.map(part => ({
    text: part,
    delay: calculateTypingDelay(part),
    formattedText: formatMessage(part)
  }))
}
