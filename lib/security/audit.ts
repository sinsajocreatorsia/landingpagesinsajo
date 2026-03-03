/**
 * Security audit logging.
 * Logs security-relevant events in a structured format for monitoring.
 * Also provides admin action audit trail via Supabase.
 */

import { supabaseAdmin } from '@/lib/supabase'

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

/**
 * Log an admin action to the audit trail in Supabase.
 * Best-effort: failures are logged but don't block the operation.
 */
export async function logAdminAction(params: {
  adminUserId: string
  action: string
  targetType: string
  targetId?: string
  details?: Record<string, unknown>
  ip?: string
}): Promise<void> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabaseAdmin as any)
      .from('admin_audit_logs')
      .insert({
        admin_user_id: params.adminUserId,
        action: params.action,
        target_type: params.targetType,
        target_id: params.targetId || null,
        details: params.details || {},
        ip_address: params.ip || null,
      })
  } catch (error) {
    // Audit logging is best-effort - don't block the operation
    console.error('[AUDIT] Failed to log admin action:', error)
  }
}
