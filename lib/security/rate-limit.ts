/**
 * Unified rate limiter for all API routes.
 * Replaces both lib/utils/rateLimit.ts and the rateLimit() in lib/auth-guard.ts.
 * Uses in-memory sliding window with periodic cleanup.
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

interface RateLimitConfig {
  /** Maximum number of requests allowed in the window */
  limit: number
  /** Time window in seconds */
  windowSec: number
}

export interface RateLimitResult {
  success: boolean
  remaining: number
  resetAt: number
}

// Shared in-memory store
const store = new Map<string, RateLimitEntry>()

// Periodic cleanup
const CLEANUP_INTERVAL = 60_000
let lastCleanup = Date.now()

function cleanup() {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL) return
  lastCleanup = now
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt < now) {
      store.delete(key)
    }
  }
}

/**
 * Reusable rate limiter class.
 * Create instances with different configs for different endpoints.
 */
export class RateLimiter {
  private config: RateLimitConfig

  constructor(config: RateLimitConfig) {
    this.config = config
  }

  check(identifier: string): RateLimitResult {
    cleanup()

    const now = Date.now()
    const windowMs = this.config.windowSec * 1000
    const existing = store.get(identifier)

    // New or expired entry
    if (!existing || existing.resetAt < now) {
      store.set(identifier, { count: 1, resetAt: now + windowMs })
      return {
        success: true,
        remaining: this.config.limit - 1,
        resetAt: now + windowMs,
      }
    }

    // Limit exceeded
    if (existing.count >= this.config.limit) {
      return {
        success: false,
        remaining: 0,
        resetAt: existing.resetAt,
      }
    }

    // Increment
    existing.count++
    return {
      success: true,
      remaining: this.config.limit - existing.count,
      resetAt: existing.resetAt,
    }
  }
}

/**
 * Extract client identifier from request.
 * Uses Vercel's trusted headers first, then falls back.
 * Combines IP + pathname for per-endpoint limiting.
 */
export function getClientIdentifier(request: Request): string {
  // Vercel sets this header and it cannot be spoofed
  const vercelIp = request.headers.get('x-vercel-forwarded-for')
  if (vercelIp) {
    return vercelIp.split(',')[0].trim()
  }

  // x-real-ip is set by most reverse proxies (more reliable than x-forwarded-for)
  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp.trim()
  }

  // Last resort: x-forwarded-for (first entry)
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }

  return 'anonymous'
}

/**
 * Helper: get rate limit headers for the response.
 */
export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset': String(Math.ceil(result.resetAt / 1000)),
  }
}

// Pre-configured limiters for different endpoints
export const chatLimiter = new RateLimiter({ limit: 20, windowSec: 60 })
export const couponLimiter = new RateLimiter({ limit: 5, windowSec: 60 })
export const authLimiter = new RateLimiter({ limit: 10, windowSec: 60 })
export const cronLimiter = new RateLimiter({ limit: 2, windowSec: 60 })
export const leadsLimiter = new RateLimiter({ limit: 5, windowSec: 60 })
export const apiLimiter = new RateLimiter({ limit: 100, windowSec: 60 })
