/**
 * Sistema unificado de logging de eventos de la aplicación.
 * Persiste todos los eventos importantes a la tabla app_events en Supabase.
 *
 * Tipos de eventos:
 *   user.signup       - Usuario nuevo registrado
 *   user.login        - Usuario inició sesión
 *   plan.upgrade      - Plan subió de nivel
 *   plan.downgrade    - Plan bajó de nivel
 *   coupon.redeemed   - Cupón canjeado exitosamente
 *   coupon.failed     - Intento de canjear cupón inválido
 *   payment.completed - Pago completado (Stripe)
 *   payment.failed    - Pago fallido
 *   payment.refunded  - Pago reembolsado
 *   security.injection        - Intento de prompt injection detectado
 *   security.rate_limit       - Rate limit excedido
 *   security.auth_failure     - Fallo de autenticación
 *   security.suspicious       - Actividad sospechosa
 *   api.error                 - Error en la API de chat
 */

import { supabaseAdmin } from '@/lib/supabase'

export type AppEventType =
  | 'user.signup'
  | 'user.login'
  | 'plan.upgrade'
  | 'plan.downgrade'
  | 'coupon.redeemed'
  | 'coupon.failed'
  | 'payment.completed'
  | 'payment.failed'
  | 'payment.refunded'
  | 'security.injection'
  | 'security.rate_limit'
  | 'security.auth_failure'
  | 'security.suspicious'
  | 'api.error'

export type AppEventSeverity = 'info' | 'warning' | 'error' | 'critical'

export interface AppEvent {
  event_type: AppEventType
  user_id?: string | null
  metadata?: Record<string, unknown>
  severity?: AppEventSeverity
}

/**
 * Persiste un evento en app_events. Best-effort: nunca bloquea la operación principal.
 */
export async function logAppEvent(event: AppEvent): Promise<void> {
  try {
    await (supabaseAdmin.from('app_events') as ReturnType<typeof supabaseAdmin.from>).insert({
      event_type: event.event_type,
      user_id: event.user_id ?? null,
      metadata: event.metadata ?? {},
      severity: event.severity ?? 'info',
    })
  } catch (err) {
    // Best-effort: no bloquear la operación principal
    console.error('[app-events] Failed to log event:', event.event_type, err)
  }
}
