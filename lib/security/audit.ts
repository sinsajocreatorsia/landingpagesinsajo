/**
 * Security audit logging.
 * Logs security-relevant events in a structured format for monitoring.
 * Also provides admin action audit trail via Supabase.
 */

import { supabaseAdmin } from '@/lib/supabase'
import { logAppEvent, type AppEventType } from '@/lib/app-events'

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

const SECURITY_TYPE_TO_APP_EVENT: Record<SecurityEventType, AppEventType | null> = {
  injection_attempt: 'security.injection',
  rate_limit_exceeded: 'security.rate_limit',
  auth_failure: 'security.auth_failure',
  suspicious_activity: 'security.suspicious',
  coupon_abuse: 'security.suspicious',
  admin_action: null, // admin actions tienen su propio log en admin_audit_logs
}

const SEVERITY_MAP: Record<string, 'info' | 'warning' | 'error' | 'critical'> = {
  low: 'info',
  medium: 'warning',
  high: 'error',
  critical: 'critical',
}

/**
 * Log a security event in structured JSON format.
 * Persiste a app_events en Supabase además de consola.
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

  // Persistir a DB (best-effort, non-blocking)
  const appEventType = SECURITY_TYPE_TO_APP_EVENT[event.type]
  if (appEventType) {
    logAppEvent({
      event_type: appEventType,
      user_id: event.userId,
      severity: SEVERITY_MAP[event.severity] ?? 'warning',
      metadata: {
        endpoint: event.endpoint,
        ip: event.ip,
        details: event.details.slice(0, 500),
      },
    }).catch(() => { /* best-effort */ })
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
