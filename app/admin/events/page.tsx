'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Activity,
  UserPlus,
  LogIn,
  TrendingUp,
  Ticket,
  CreditCard,
  AlertTriangle,
  ShieldAlert,
  RefreshCw,
  Loader2,
  Filter,
} from 'lucide-react'

interface AppEvent {
  id: string
  event_type: string
  user_id: string | null
  metadata: Record<string, unknown>
  severity: 'info' | 'warning' | 'error' | 'critical'
  created_at: string
}

interface EventsData {
  events: AppEvent[]
  total: number
  summary: {
    byType: Record<string, number>
    bySeverity: Record<string, number>
  }
  period: string
  periodDays: number
}

const EVENT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'user.signup': UserPlus,
  'user.login': LogIn,
  'plan.upgrade': TrendingUp,
  'plan.downgrade': TrendingUp,
  'coupon.redeemed': Ticket,
  'coupon.failed': Ticket,
  'payment.completed': CreditCard,
  'payment.failed': CreditCard,
  'payment.refunded': CreditCard,
  'security.injection': ShieldAlert,
  'security.rate_limit': ShieldAlert,
  'security.auth_failure': ShieldAlert,
  'security.suspicious': ShieldAlert,
  'api.error': AlertTriangle,
}

const EVENT_LABELS: Record<string, string> = {
  'user.signup': 'Signup',
  'user.login': 'Login',
  'plan.upgrade': 'Upgrade de plan',
  'plan.downgrade': 'Downgrade de plan',
  'coupon.redeemed': 'Cupón canjeado',
  'coupon.failed': 'Cupón fallido',
  'payment.completed': 'Pago completado',
  'payment.failed': 'Pago fallido',
  'payment.refunded': 'Reembolso',
  'security.injection': 'Intento de inyección',
  'security.rate_limit': 'Rate limit excedido',
  'security.auth_failure': 'Fallo de autenticación',
  'security.suspicious': 'Actividad sospechosa',
  'api.error': 'Error de API',
}

const SEVERITY_COLORS: Record<string, string> = {
  info: 'bg-blue-100 text-blue-700',
  warning: 'bg-yellow-100 text-yellow-700',
  error: 'bg-red-100 text-red-700',
  critical: 'bg-red-200 text-red-900 font-bold',
}

const SEVERITY_DOT: Record<string, string> = {
  info: 'bg-blue-400',
  warning: 'bg-yellow-400',
  error: 'bg-red-500',
  critical: 'bg-red-700',
}

const ALL_EVENT_TYPES = Object.keys(EVENT_LABELS)

export default function AdminEventsPage() {
  const [data, setData] = useState<EventsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('7d')
  const [filterType, setFilterType] = useState('')
  const [filterSeverity, setFilterSeverity] = useState('')

  const fetchEvents = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ period, limit: '200' })
      if (filterType) params.set('type', filterType)
      if (filterSeverity) params.set('severity', filterSeverity)
      const res = await fetch(`/api/admin/events?${params}`)
      const json = await res.json()
      setData(json)
    } catch (err) {
      console.error('Error fetching events:', err)
    } finally {
      setLoading(false)
    }
  }, [period, filterType, filterSeverity])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('es-ES', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    })

  const summaryCards = data
    ? [
        { label: 'Signups', value: data.summary.byType['user.signup'] ?? 0, icon: UserPlus, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Logins', value: data.summary.byType['user.login'] ?? 0, icon: LogIn, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Upgrades', value: data.summary.byType['plan.upgrade'] ?? 0, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Pagos', value: data.summary.byType['payment.completed'] ?? 0, icon: CreditCard, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Cupones', value: data.summary.byType['coupon.redeemed'] ?? 0, icon: Ticket, color: 'text-orange-600', bg: 'bg-orange-50' },
        {
          label: 'Seguridad',
          value: (data.summary.byType['security.injection'] ?? 0) +
                 (data.summary.byType['security.rate_limit'] ?? 0) +
                 (data.summary.byType['security.auth_failure'] ?? 0) +
                 (data.summary.byType['security.suspicious'] ?? 0),
          icon: ShieldAlert,
          color: 'text-red-600',
          bg: 'bg-red-50',
        },
      ]
    : []

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Activity className="w-7 h-7 text-[#2CB6D7]" />
            Eventos del Sistema
          </h1>
          <p className="text-gray-500 mt-1 text-sm">Registro en tiempo real de todo lo que ocurre en la app</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={period}
            onChange={e => setPeriod(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
          >
            <option value="7d">Últimos 7 días</option>
            <option value="30d">Últimos 30 días</option>
            <option value="90d">Últimos 90 días</option>
          </select>

          <button
            onClick={fetchEvents}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-[#2CB6D7] text-white rounded-lg text-sm hover:bg-[#1a9ab8] disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Actualizar
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      {data && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {summaryCards.map(card => {
            const Icon = card.icon
            return (
              <div key={card.label} className={`${card.bg} rounded-xl p-4`}>
                <div className={`${card.color} mb-2`}>
                  <Icon className="w-5 h-5" />
                </div>
                <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
                <p className="text-xs text-gray-500 mt-1">{card.label}</p>
              </div>
            )
          })}
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <Filter className="w-4 h-4 text-gray-400" />

        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">Todos los eventos</option>
          {ALL_EVENT_TYPES.map(t => (
            <option key={t} value={t}>{EVENT_LABELS[t]}</option>
          ))}
        </select>

        <select
          value={filterSeverity}
          onChange={e => setFilterSeverity(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">Toda la severidad</option>
          <option value="info">Info</option>
          <option value="warning">Warning</option>
          <option value="error">Error</option>
          <option value="critical">Critical</option>
        </select>

        {(filterType || filterSeverity) && (
          <button
            onClick={() => { setFilterType(''); setFilterSeverity('') }}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">
            {loading ? 'Cargando...' : `${data?.total ?? 0} eventos`}
          </h3>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-[#2CB6D7]" />
          </div>
        ) : !data?.events.length ? (
          <div className="text-center py-16 text-gray-400">
            <Activity className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No hay eventos en este período</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50 max-h-[600px] overflow-y-auto">
            {data.events.map(event => {
              const Icon = EVENT_ICONS[event.event_type] ?? Activity
              return (
                <div key={event.id} className="flex items-start gap-4 px-6 py-3 hover:bg-gray-50 transition-colors">
                  {/* Severity dot */}
                  <div className="flex-shrink-0 mt-1">
                    <div className={`w-2.5 h-2.5 rounded-full ${SEVERITY_DOT[event.severity] ?? 'bg-gray-300'}`} />
                  </div>

                  {/* Icon */}
                  <div className="flex-shrink-0 text-gray-400 mt-0.5">
                    <Icon className="w-4 h-4" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-gray-800 text-sm">
                        {EVENT_LABELS[event.event_type] ?? event.event_type}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${SEVERITY_COLORS[event.severity] ?? 'bg-gray-100 text-gray-600'}`}>
                        {event.severity}
                      </span>
                    </div>

                    {/* Metadata summary */}
                    {Object.keys(event.metadata).length > 0 && (
                      <p className="text-xs text-gray-400 mt-0.5 truncate">
                        {Object.entries(event.metadata)
                          .filter(([, v]) => v !== null && v !== undefined)
                          .slice(0, 4)
                          .map(([k, v]) => `${k}: ${String(v)}`)
                          .join(' · ')}
                      </p>
                    )}
                  </div>

                  {/* Date */}
                  <div className="flex-shrink-0 text-xs text-gray-400 whitespace-nowrap">
                    {formatDate(event.created_at)}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
