/**
 * Security audit logging.
 * Logs security-relevant events in a structured format for monitoring.
 */

type SecurityEventType =
  | 'injection_attempt'
  | 'rate_limit_exceeded'
  | 'auth_failure'
  | 'suspicious_activity'
  | 'coupon_abuse'
  | 'admin_action'

interface SecurityEvent {
  type: SecurityEventType
  userId?: string | null
  ip?: string
  endpoint?: string
  details: string
  severity: 'low' | 'medium' | 'high' | 'critical'
}

/**
 * Log a security event in structured JSON format.
 * In production, these logs can be ingested by monitoring tools (Datadog, Sentry, etc.)
 */
export function logSecurityEvent(event: SecurityEvent): void {
  const entry = {
    timestamp: new Date().toISOString(),
    category: 'SECURITY',
    ...event,
  }

  // Use console.warn for security events so they stand out in logs
  if (event.severity === 'critical' || event.severity === 'high') {
    console.warn(`[SECURITY:${event.severity.toUpperCase()}]`, JSON.stringify(entry))
  } else {
    console.log(`[SECURITY:${event.severity}]`, JSON.stringify(entry))
  }
}
