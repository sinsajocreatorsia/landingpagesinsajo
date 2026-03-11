-- =============================================
-- 018_app_events.sql
-- Tabla unificada de eventos de la aplicación
-- Registra: signups, logins, upgrades, pagos, seguridad, errores
-- =============================================

CREATE TABLE IF NOT EXISTS app_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Tipo de evento: 'user.signup', 'user.login', 'plan.upgrade', 'payment.completed', etc.
  event_type TEXT NOT NULL,
  -- Usuario relacionado (puede ser null para eventos anónimos o del sistema)
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  -- Datos adicionales del evento (flexible por tipo)
  metadata JSONB NOT NULL DEFAULT '{}',
  -- Nivel de importancia
  severity TEXT NOT NULL DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'error', 'critical')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para queries rápidas en el admin
CREATE INDEX IF NOT EXISTS app_events_event_type_idx ON app_events(event_type);
CREATE INDEX IF NOT EXISTS app_events_user_id_idx ON app_events(user_id);
CREATE INDEX IF NOT EXISTS app_events_created_at_idx ON app_events(created_at DESC);
CREATE INDEX IF NOT EXISTS app_events_severity_idx ON app_events(severity);

-- Solo accesible via service role (admin)
ALTER TABLE app_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role only" ON app_events USING (false);
