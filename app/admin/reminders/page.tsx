'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Bell,
  CheckCircle2,
  XCircle,
  Clock,
  Mail,
  Users,
  AlertTriangle,
  Loader2,
  RefreshCw,
  TrendingUp,
  Timer,
} from 'lucide-react'

interface RemindersData {
  overview: {
    total: number
    pending: number
    completed: number
    dismissed: number
    overdue: number
    emailsSent: number
    uniqueUsers: number
    completionRate: number
    dismissRate: number
    avgCompletionHours: number
  }
  allTime: {
    total: number
    completed: number
  }
  perDay: Record<string, { created: number; completed: number; dismissed: number }>
  recent: Array<{
    id: string
    task: string
    status: string
    due_at: string
    email_sent: boolean
    created_at: string
  }>
}

function StatCard({ icon: Icon, label, value, subtitle, color = 'purple' }: {
  icon: typeof Bell
  label: string
  value: string | number
  subtitle?: string
  color?: 'purple' | 'green' | 'blue' | 'orange' | 'red' | 'teal'
}) {
  const colorMap = {
    purple: 'bg-purple-100 text-purple-600',
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
    orange: 'bg-orange-100 text-orange-600',
    red: 'bg-red-100 text-red-600',
    teal: 'bg-teal-100 text-teal-600',
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-lg ${colorMap[color]} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-gray-500 text-sm font-medium">{label}</span>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
  )
}

function BarSimple({ data, color = '#7c3aed' }: { data: Record<string, number>; color?: string }) {
  const entries = Object.entries(data).slice(-14)
  const max = Math.max(...entries.map(([, v]) => v), 1)

  return (
    <div className="flex items-end gap-1 h-32">
      {entries.map(([label, value]) => (
        <div key={label} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full rounded-t-sm min-h-[2px] transition-all"
            style={{
              height: `${(value / max) * 100}%`,
              backgroundColor: color,
              opacity: 0.8,
            }}
            title={`${label}: ${value}`}
          />
          <span className="text-[10px] text-gray-400 -rotate-45 origin-center whitespace-nowrap">
            {label.slice(5)}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function AdminRemindersPage() {
  const [data, setData] = useState<RemindersData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [period, setPeriod] = useState('7d')

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/reminders?period=${period}`)
      const json = await res.json()
      if (json.success) {
        setData(json)
      } else {
        setError(json.error || 'Error desconocido')
      }
    } catch {
      setError('Error de conexion')
    } finally {
      setLoading(false)
    }
  }, [period])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="text-center py-16">
        <p className="text-red-500 mb-4">{error || 'Error cargando datos'}</p>
        <button onClick={fetchData} className="px-4 py-2 bg-purple-600 text-white rounded-lg">
          Reintentar
        </button>
      </div>
    )
  }

  const { overview, allTime, perDay, recent } = data
  const createdPerDay: Record<string, number> = {}
  for (const [day, v] of Object.entries(perDay)) {
    createdPerDay[day] = v.created
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recordatorios</h1>
          <p className="text-gray-500 mt-1">Monitoreo del sistema de recordatorios estrategicos</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Period selector */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {['7d', '30d', '90d'].map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  period === p
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <button
            onClick={fetchData}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={Bell}
          label="Total Creados"
          value={overview.total}
          subtitle={`${allTime.total} historico`}
          color="purple"
        />
        <StatCard
          icon={CheckCircle2}
          label="Completados"
          value={overview.completed}
          subtitle={`${overview.completionRate}% tasa de completado`}
          color="green"
        />
        <StatCard
          icon={Clock}
          label="Pendientes"
          value={overview.pending}
          subtitle={`${overview.overdue} vencidos`}
          color="orange"
        />
        <StatCard
          icon={Users}
          label="Usuarios Activos"
          value={overview.uniqueUsers}
          subtitle="usando recordatorios"
          color="blue"
        />
      </div>

      {/* Second row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={XCircle}
          label="Descartados"
          value={overview.dismissed}
          subtitle={`${overview.dismissRate}% tasa descarte`}
          color="red"
        />
        <StatCard
          icon={Mail}
          label="Emails Enviados"
          value={overview.emailsSent}
          subtitle="notificaciones email"
          color="teal"
        />
        <StatCard
          icon={Timer}
          label="Tiempo Promedio"
          value={`${overview.avgCompletionHours}h`}
          subtitle="para completar tarea"
          color="blue"
        />
        <StatCard
          icon={AlertTriangle}
          label="Vencidos"
          value={overview.overdue}
          subtitle="requieren atencion"
          color={overview.overdue > 0 ? 'red' : 'green'}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Reminders per day */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-gray-900">Recordatorios por Dia</h3>
          </div>
          {Object.keys(createdPerDay).length > 0 ? (
            <BarSimple data={createdPerDay} color="#7c3aed" />
          ) : (
            <p className="text-gray-400 text-sm text-center py-8">Sin datos en este periodo</p>
          )}
        </div>

        {/* Status distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-gray-900">Distribucion de Estado</h3>
          </div>
          {overview.total > 0 ? (
            <div className="space-y-4">
              <StatusBar label="Completados" value={overview.completed} total={overview.total} color="#22c55e" />
              <StatusBar label="Pendientes" value={overview.pending} total={overview.total} color="#f59e0b" />
              <StatusBar label="Descartados" value={overview.dismissed} total={overview.total} color="#ef4444" />
            </div>
          ) : (
            <p className="text-gray-400 text-sm text-center py-8">Sin datos en este periodo</p>
          )}
        </div>
      </div>

      {/* Recent Reminders Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Recordatorios Recientes</h3>
        </div>
        {recent.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarea</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vencimiento</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Creado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recent.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-[300px] truncate">{r.task}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={r.status} dueAt={r.due_at} />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(r.due_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                    </td>
                    <td className="px-6 py-4">
                      {r.email_sent ? (
                        <span className="text-green-600 text-xs font-medium">Enviado</span>
                      ) : (
                        <span className="text-gray-400 text-xs">Pendiente</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(r.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-400 text-sm text-center py-8">No hay recordatorios en este periodo</p>
        )}
      </div>
    </div>
  )
}

function StatusBar({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="text-gray-900 font-medium">{value} ({pct}%)</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div
          className="h-2 rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}

function StatusBadge({ status, dueAt }: { status: string; dueAt: string }) {
  const isOverdue = status === 'pending' && new Date(dueAt) < new Date()

  if (isOverdue) {
    return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">Vencido</span>
  }

  const styles: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    completed: 'bg-green-100 text-green-700',
    dismissed: 'bg-gray-100 text-gray-600',
  }

  const labels: Record<string, string> = {
    pending: 'Pendiente',
    completed: 'Completado',
    dismissed: 'Descartado',
  }

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status] || styles.pending}`}>
      {labels[status] || status}
    </span>
  )
}
