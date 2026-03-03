/**
 * Robust prompt injection sanitization.
 * Replaces the bypassable regex blocklist in chat/route.ts with
 * multi-layer defense: Unicode normalization + leet-speak decoding + pattern matching.
 */

// Zero-width and invisible characters to strip
const INVISIBLE_CHARS = /[\u200B\u200C\u200D\u200E\u200F\uFEFF\u00AD\u034F\u061C\u180E\u2000-\u200F\u202A-\u202F\u205F-\u2064\u2066-\u206F]/g

// Leet-speak substitution map
const LEET_MAP: Record<string, string> = {
  '@': 'a', '4': 'a',
  '3': 'e',
  '1': 'i', '!': 'i',
  '0': 'o',
  '5': 's', '$': 's',
  '7': 't',
  '8': 'b',
}

/**
 * Normalize text for consistent pattern matching.
 * Applies Unicode NFKC normalization, strips invisible chars,
 * decodes leet-speak, and collapses whitespace.
 */
export function normalizeText(input: string): string {
  // Unicode NFKC normalization (canonical decomposition + compatibility composition)
  let normalized = input.normalize('NFKC')

  // Strip zero-width and invisible characters
  normalized = normalized.replace(INVISIBLE_CHARS, '')

  // Remove control characters (except newline and tab)
  normalized = normalized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')

  // Decode leet-speak substitutions
  normalized = normalized.replace(/[@43!105$78]/g, (char) => LEET_MAP[char] || char)

  // Collapse multiple whitespace (including tabs, newlines) into single space
  normalized = normalized.replace(/\s+/g, ' ')

  return normalized.toLowerCase().trim()
}

// Injection patterns checked against NORMALIZED text
const INJECTION_PATTERNS = [
  // Instruction override attempts
  /ignore\s+(all\s+)?(previous|prior|above|earlier|original|initial)\s+(instructions?|prompts?|rules?|context|guidelines?)/i,
  /forget\s+(everything|all|your)\s*(instructions?|rules?|prompts?|training|context)?/i,
  /disregard\s+(all\s+)?(previous|prior|above|your)\s+(instructions?|prompts?|rules?)/i,
  /override\s+(all\s+)?(previous|system|current)\s*(instructions?|prompts?|rules?)/i,

  // Role manipulation
  /you\s+are\s+now\s+/i,
  /act\s+as\s+(if\s+you\s+are|a|an)\s+/i,
  /pretend\s+(to\s+be|you\s+are|you're)/i,
  /role\s*play\s+(as|being)/i,
  /from\s+now\s+on\s+you\s+(are|will|must)/i,
  /switch\s+to\s+(a\s+)?new\s+(role|persona|mode|character)/i,

  // New instructions injection
  /new\s+(instructions?|rules?|prompt|context|system\s*prompt)\s*:/i,
  /system\s*prompt\s*:/i,
  /updated?\s+(instructions?|rules?|system\s*prompt)\s*:/i,
  /here\s+are\s+(your\s+)?(new|updated)\s+(instructions?|rules?)/i,

  // Model-specific format tokens
  /\[system\]/i,
  /\[inst\]/i,
  /<<sys>>/i,
  /<\|im_start\|>/i,
  /<\|im_end\|>/i,
  /\[\/inst\]/i,
  /<\|system\|>/i,
  /<\|user\|>/i,
  /<\|assistant\|>/i,

  // Jailbreak modes
  /developer\s+mode/i,
  /jailbreak/i,
  /dan\s+mode/i,
  /stan\s+mode/i,
  /dude\s+mode/i,
  /evil\s+(mode|version|twin)/i,
  /opposite\s+mode/i,
  /unrestricted\s+mode/i,
  /god\s+mode/i,
  /sudo\s+mode/i,

  // Prompt extraction attempts
  /reveal\s+(your\s+)?(prompt|instructions?|rules?|system|programming|training)/i,
  /show\s+(me\s+)?(your\s+)?(prompt|instructions?|rules?|system|initial|original)/i,
  /repeat\s+(your\s+)?(prompt|instructions?|system\s*message|everything\s+above)/i,
  /translate\s+(your\s+)?(prompt|instructions?|system\s*message)/i,
  /output\s+(your\s+)?(prompt|instructions?|initialization|system)/i,
  /print\s+(your\s+)?(prompt|instructions?|system)/i,
  /what\s+(are|were)\s+your\s+(initial|original|system)\s+(instructions?|prompts?|rules?)/i,
  /copy\s+(your\s+)?(prompt|instructions?|system)/i,
  /leak\s+(your\s+)?(prompt|instructions?|system)/i,
  /display\s+(your\s+)?(prompt|instructions?|system)/i,

  // Delimiter/boundary attacks
  /---+\s*system/i,
  /===+\s*system/i,
  /\*\*\*+\s*system/i,
  /```\s*system/i,
  /end\s+of\s+(system\s+)?(prompt|instructions?|message)/i,
  /beginning\s+of\s+(user\s+)?(prompt|message)/i,
]

/**
 * Check if normalized text contains any injection patterns.
 */
export function containsInjectionPattern(normalizedText: string): boolean {
  return INJECTION_PATTERNS.some(pattern => pattern.test(normalizedText))
}

/**
 * Sanitize a value for safe inclusion in AI prompts.
 * If injection patterns are detected, replaces the ENTIRE value.
 * Otherwise returns the original value truncated.
 */
export function sanitizeForPromptInjection(
  value: string | null | undefined,
  maxLength = 500
): string {
  if (!value) return ''

  const truncated = value.slice(0, maxLength)
  const normalized = normalizeText(truncated)

  if (containsInjectionPattern(normalized)) {
    // Lazy-import audit to avoid circular dependencies
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { logSecurityEvent } = require('./audit')
      logSecurityEvent({
        type: 'injection_attempt',
        details: `Prompt injection detected. Normalized snippet: ${normalized.slice(0, 100)}`,
        severity: 'high',
      })
    } catch { /* audit logging is best-effort */ }
    return '[contenido no permitido]'
  }

  return truncated.trim()
}

/**
 * Sanitize memory content before injection into system prompts.
 * Additional protection: strips markdown boundaries and excessive newlines.
 */
export function sanitizeMemoryContent(
  content: string | null | undefined,
  maxLength = 200
): string {
  if (!content) return ''

  let sanitized = content.slice(0, maxLength)

  // Strip markdown that could confuse prompt boundaries
  sanitized = sanitized
    .replace(/```[\s\S]*?```/g, '[code block removed]')
    .replace(/```\w*/g, '')
    .replace(/---+/g, '')
    .replace(/===+/g, '')
    .replace(/\*\*\*+/g, '')

  // Collapse excessive newlines (max 2 consecutive)
  sanitized = sanitized.replace(/\n{3,}/g, '\n\n')

  // Now check for injection patterns
  const normalized = normalizeText(sanitized)
  if (containsInjectionPattern(normalized)) {
    return '[memoria no permitida]'
  }

  return sanitized.trim()
}
