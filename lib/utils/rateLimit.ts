/**
 * Simple in-memory rate limiter
 * For production at scale, consider using Redis-based solutions like @upstash/ratelimit
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

// In-memory store (resets on server restart, which is fine for basic protection)
const rateLimitStore = new Map<string, RateLimitEntry>()

// Clean up old entries periodically
const CLEANUP_INTERVAL = 60 * 1000 // 1 minute
let lastCleanup = Date.now()

function cleanupOldEntries() {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL) return

  lastCleanup = now
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt < now) {
      rateLimitStore.delete(key)
    }
  }
}

interface RateLimitConfig {
  /** Maximum number of requests allowed in the window */
  limit: number
  /** Time window in seconds */
  windowSec: number
}

interface RateLimitResult {
  success: boolean
  remaining: number
  resetAt: number
}

/**
 * Check if a request should be rate limited
 * @param identifier - Unique identifier (usually IP address)
 * @param config - Rate limit configuration
 * @returns Result indicating if request is allowed
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  cleanupOldEntries()

  const now = Date.now()
  const windowMs = config.windowSec * 1000
  const key = identifier

  const existing = rateLimitStore.get(key)

  // New entry or expired entry
  if (!existing || existing.resetAt < now) {
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + windowMs
    })
    return {
      success: true,
      remaining: config.limit - 1,
      resetAt: now + windowMs
    }
  }

  // Within window
  if (existing.count >= config.limit) {
    return {
      success: false,
      remaining: 0,
      resetAt: existing.resetAt
    }
  }

  // Increment count
  existing.count++
  return {
    success: true,
    remaining: config.limit - existing.count,
    resetAt: existing.resetAt
  }
}

/**
 * Get client IP from request headers
 */
export function getClientIp(request: Request): string {
  // Check various headers that might contain the real IP
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    // Get first IP if there's a chain
    return forwardedFor.split(',')[0].trim()
  }

  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }

  // Fallback
  return 'unknown'
}

// Pre-configured rate limiters for different endpoints
export const rateLimits = {
  // Chat API: 20 messages per minute per IP
  chat: { limit: 20, windowSec: 60 },

  // Leads API: 5 submissions per minute per IP
  leads: { limit: 5, windowSec: 60 },

  // Cal API: 30 requests per minute per IP
  calendar: { limit: 30, windowSec: 60 },

  // General API: 100 requests per minute per IP
  general: { limit: 100, windowSec: 60 }
}
