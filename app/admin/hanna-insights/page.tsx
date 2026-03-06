'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Brain,
  Users,
  MessageSquare,
  TrendingUp,
  UserCheck,
  Repeat,
  Clock,
  Briefcase,
  Bell,
  BookOpen,
  ThumbsUp,
  ThumbsDown,
  Lightbulb,
  Crown,
  Loader2,
  RefreshCw,
  Zap,
  Calendar,
  Target,
} from 'lucide-react'

interface InsightsData {
  period: string
  userBase: { total: number; pro: number; business: number; free: number }
  engagement: {
    activeUsers: number
    engagementRate: number
    avgMsgsPerSession: number
    avgSessionsPerUser: number
    returningUsers: number
    retentionRate: number
    powerUsers: number
    totalSessions: number
    totalMessages: number
  }
  featureAdoption: {
    businessProfiles: number
    avgProfileCompleteness: number
    memories: { users: number; total: number }
    reminders: { users: number; total: number; completed: number }
  }
  temporal: {
    peakHourUTC: string
    peakDay: string
    hourlyUsage: Record<string, number>
    dailyUsage: Record<string, number>
  }
  quality: {
    thumbsUp: number
    thumbsDown: number
    totalFeedback: number
    satisfactionRate: number | null
  }
  categories: Record<string, number>
  conversion: { activeFreeUsers: number; freeUsersAtLimit: number }
  opportunities: string[]
}

function StatCard({ icon: Icon, label, value, subtitle, color = 'purple' }: {
  icon: typeof Brain
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
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-9 h-9 rounded-lg ${colorMap[color]} flex items-center justify-center`}>
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-gray-500 text-xs font-medium">{label}</span>
      </div>
      <p className="text-xl font-bold text-gray-900">{value}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
  )
}

function BarChart({ data, color = '#7c3aed' }: { data: Record<string, number>; color?: string }) {
  const entries = Object.entries(data)
  const max = Math.max(...entries.map(([, v]) => v), 1)

  return (
    <div className="flex items-end gap-1 h-28">
      {entries.map(([label, value]) => (
        <div key={label} className="flex-1 flex flex-col items-center gap-1">
          <span className="text-[9px] text-gray-500">{value > 0 ? value : ''}</span>
          <div
            className="w-full rounded-t-sm min-h-[2px]"
            style={{ height: `${(value / max) * 100}%`, backgroundColor: color, opacity: 0.8 }}
            title={`${label}: ${value}`}
          />
          <span className="text-[9px] text-gray-400 whitespace-nowrap">{label}</span>
        </div>
      ))}
    </div>
  )
}

function ProgressBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="text-gray-900 font-medium">{value} ({pct}%)</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  )
}

const CATEGORY_LABELS: Record<string, string> = {
  strategy: 'Estrategia',
  marketing: 'Marketing',
  content: 'Contenido',
  analytics: 'Analitica',
  general: 'General',
}

const CATEGORY_COLORS: Record<string, string> = {
  strategy: '#7c3aed',
  marketing: '#2563eb',
  content: '#db2777',
  analytics: '#059669',
  general: '#6b7280',
}

export default function HannaInsightsPage() {
  const [data, setData] = useState<InsightsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [period, setPeriod] = useState('30d')

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/hanna-insights?period=${period}`)
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

  useEffect(() => { fetchData() }, [fetchData])

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
        <button onClick={fetchData} className="px-4 py-2 bg-purple-600 text-white rounded-lg">Reintentar</button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hanna Insights</h1>
          <p className="text-gray-500 text-sm">Metricas para mejorar la experiencia de Hanna</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {['7d', '30d', '90d'].map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  period === p ? 'bg-white text-purple-600 font-medium shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}>
                {p}
              </button>
            ))}
          </div>
          <button onClick={fetchData} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Improvement Opportunities */}
      {data.opportunities.length > 0 && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            Oportunidades de Mejora ({data.opportunities.length})
          </h3>
          <div className="space-y-2">
            {data.opportunities.map((opp, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-purple-500 mt-0.5">&#x25CF;</span>
                {opp}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User Base Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatCard icon={Users} label="Total Usuarios" value={data.userBase.total} color="blue" />
        <StatCard icon={Crown} label="Pro" value={data.userBase.pro} subtitle={`$${(data.userBase.pro * 19.99).toFixed(0)}/mes`} color="purple" />
        <StatCard icon={Zap} label="Business" value={data.userBase.business} subtitle={`$${(data.userBase.business * 49).toFixed(0)}/mes`} color="teal" />
        <StatCard icon={Users} label="Free" value={data.userBase.free} subtitle="potencial conversion" color="orange" />
        <StatCard icon={UserCheck} label="Activos" value={data.engagement.activeUsers} subtitle={`${data.engagement.engagementRate}% engagement`} color="green" />
      </div>

      {/* Engagement Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={MessageSquare} label="Msgs/Sesion" value={data.engagement.avgMsgsPerSession} subtitle="profundidad conversacion" color="blue" />
        <StatCard icon={Repeat} label="Retornos" value={data.engagement.returningUsers} subtitle={`${data.engagement.retentionRate}% retencion`} color="green" />
        <StatCard icon={TrendingUp} label="Sesiones/Usuario" value={data.engagement.avgSessionsPerUser} subtitle={`${data.engagement.totalSessions} total`} color="purple" />
        <StatCard icon={Zap} label="Power Users" value={data.engagement.powerUsers} subtitle="5+ sesiones" color="teal" />
      </div>

      {/* Feature Adoption + Quality */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feature Adoption */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-500" />
            Adopcion de Features
          </h3>
          <div className="space-y-4">
            <ProgressBar
              label="Perfil de Negocio"
              value={data.featureAdoption.businessProfiles}
              max={data.userBase.total}
              color="#7c3aed"
            />
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Completitud promedio</span>
              <span className="font-medium">{data.featureAdoption.avgProfileCompleteness}%</span>
            </div>
            <ProgressBar
              label="Memoria (usuarios)"
              value={data.featureAdoption.memories.users}
              max={data.userBase.pro + data.userBase.business}
              color="#059669"
            />
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total memorias guardadas</span>
              <span className="font-medium">{data.featureAdoption.memories.total}</span>
            </div>
            <ProgressBar
              label="Recordatorios (usuarios)"
              value={data.featureAdoption.reminders.users}
              max={data.userBase.pro + data.userBase.business}
              color="#2CB6D7"
            />
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total recordatorios / completados</span>
              <span className="font-medium">{data.featureAdoption.reminders.total} / {data.featureAdoption.reminders.completed}</span>
            </div>
          </div>
        </div>

        {/* Quality & Satisfaction */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <ThumbsUp className="w-5 h-5 text-green-500" />
            Calidad & Satisfaccion
          </h3>
          {data.quality.totalFeedback > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <ThumbsUp className="w-5 h-5 text-green-500" />
                  <span className="text-2xl font-bold text-green-600">{data.quality.thumbsUp}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ThumbsDown className="w-5 h-5 text-red-500" />
                  <span className="text-2xl font-bold text-red-600">{data.quality.thumbsDown}</span>
                </div>
                <span className="text-lg font-medium text-gray-600">
                  {data.quality.satisfactionRate !== null ? `${data.quality.satisfactionRate}%` : 'N/A'} satisfaccion
                </span>
              </div>
              <div className="w-full bg-red-100 rounded-full h-4 overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: `${data.quality.satisfactionRate || 0}%` }} />
              </div>
              <p className="text-sm text-gray-500">{data.quality.totalFeedback} valoraciones totales</p>
            </div>
          ) : (
            <p className="text-gray-400 text-sm py-8 text-center">Sin feedback en este periodo</p>
          )}

          {/* Conversion Opportunities */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Crown className="w-4 h-4 text-orange-500" />
              Conversion
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Free activos (potencial Pro)</span>
                <span className="font-medium text-orange-600">{data.conversion.activeFreeUsers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Free en limite hoy</span>
                <span className="font-medium text-red-600">{data.conversion.freeUsersAtLimit}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Temporal Patterns + Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hourly Usage */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" />
            Uso por Hora (UTC)
          </h3>
          <p className="text-xs text-gray-400 mb-3">Pico: {data.temporal.peakHourUTC}</p>
          <BarChart data={data.temporal.hourlyUsage} color="#3b82f6" />
        </div>

        {/* Daily Usage */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-500" />
            Uso por Dia
          </h3>
          <p className="text-xs text-gray-400 mb-3">Pico: {data.temporal.peakDay}</p>
          <BarChart data={data.temporal.dailyUsage} color="#22c55e" />
        </div>

        {/* Categories */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-purple-500" />
            Temas de Consulta
          </h3>
          {Object.keys(data.categories).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(data.categories)
                .sort(([, a], [, b]) => b - a)
                .map(([cat, count]) => {
                  const total = Object.values(data.categories).reduce((a, b) => a + b, 0)
                  const pct = Math.round((count / total) * 100)
                  return (
                    <div key={cat}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">{CATEGORY_LABELS[cat] || cat}</span>
                        <span className="text-gray-500">{count} ({pct}%)</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: CATEGORY_COLORS[cat] || '#6b7280' }} />
                      </div>
                    </div>
                  )
                })}
            </div>
          ) : (
            <p className="text-gray-400 text-sm text-center py-6">Sin datos</p>
          )}
        </div>
      </div>
    </div>
  )
}
