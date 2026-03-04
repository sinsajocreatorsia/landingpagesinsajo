'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  BarChart3,
  TrendingUp,
  Users,
  MessageSquare,
  DollarSign,
  ThumbsUp,
  ThumbsDown,
  Clock,
  Cpu,
  Loader2,
  RefreshCw,
  Zap,
  Target,
  AlertTriangle,
} from 'lucide-react'

interface AnalyticsData {
  period: string
  periodDays: number
  usage: {
    totalMessages: number
    uniqueUsers: number
    uniqueSessions: number
    messagesPerDay: Record<string, number>
    avgMessagesPerDay: number
  }
  costs: {
    totalCost: number
    totalInputTokens: number
    totalOutputTokens: number
    costPerModel: Record<string, { cost: number; count: number; tokens: number }>
    costPerDay: Record<string, number>
    avgCostPerSession: number
    avgCostPerMessage: number
  }
  quality: {
    thumbsUp: number
    thumbsDown: number
    totalFeedback: number
    satisfactionRate: number | null
    avgResponseLength: number
    avgResponseTimeMs: number
  }
  distribution: {
    plan: Record<string, number>
    category: Record<string, number>
    model: Record<string, number>
  }
  errors: {
    totalErrors: number
    errorRate: number
    errorsByModel: Record<string, number>
    errorsPerDay: Record<string, number>
    recentErrors: Array<{
      model: string
      error_message: string
      user_plan: string
      created_at: string
    }>
  }
  profitability: {
    proUsers: number
    estimatedMonthlyRevenue: number
    projectedMonthlyCost: number
    projectedMonthlyMargin: number
    marginPercentage: number
  }
}

function StatCard({ icon: Icon, label, value, subtitle, color = 'purple' }: {
  icon: typeof BarChart3
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
  const entries = Object.entries(data).slice(-14) // Last 14 entries max
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
            {label.slice(5)} {/* Show MM-DD */}
          </span>
        </div>
      ))}
    </div>
  )
}

function DistributionBar({ data, colorMap }: {
  data: Record<string, number>
  colorMap: Record<string, string>
}) {
  const total = Object.values(data).reduce((a, b) => a + b, 0)
  if (total === 0) return <p className="text-gray-400 text-sm">Sin datos</p>

  return (
    <div className="space-y-2">
      {Object.entries(data)
        .sort(([, a], [, b]) => b - a)
        .map(([key, value]) => (
          <div key={key} className="flex items-center gap-3">
            <span className="text-sm text-gray-600 w-28 truncate" title={key}>
              {key.split('/').pop() || key}
            </span>
            <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${(value / total) * 100}%`,
                  backgroundColor: colorMap[key] || '#7c3aed',
                }}
              />
            </div>
            <span className="text-sm text-gray-500 w-16 text-right">
              {value} ({Math.round((value / total) * 100)}%)
            </span>
          </div>
        ))}
    </div>
  )
}

const MODEL_COLORS: Record<string, string> = {
  'google/gemini-2.0-flash-001': '#4285F4',
  'google/gemini-2.5-pro-preview-06-05': '#0F9D58',
  'google/gemini-2.5-flash-preview-05-20': '#F4B400',
  'anthropic/claude-sonnet-4': '#D97706',
}

const CATEGORY_COLORS: Record<string, string> = {
  strategy: '#7c3aed',
  marketing: '#2563eb',
  content: '#db2777',
  analytics: '#059669',
  general: '#6b7280',
  uncategorized: '#9ca3af',
}

const PLAN_COLORS: Record<string, string> = {
  pro: '#7c3aed',
  free: '#6b7280',
  unknown: '#d1d5db',
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('7d')

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/analytics?period=${period}`)
      if (!res.ok) throw new Error('Error al cargar datos')
      const json = await res.json()
      setData(json)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setIsLoading(false)
    }
  }, [period])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <p className="text-red-500">{error || 'Error al cargar datos'}</p>
        <button onClick={fetchData} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-500 text-sm">Rendimiento y métricas de Hanna</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {(['7d', '30d', '90d'] as const).map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  period === p
                    ? 'bg-white text-purple-600 font-medium shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {p === '7d' ? '7 días' : p === '30d' ? '30 días' : '90 días'}
              </button>
            ))}
          </div>
          <button
            onClick={fetchData}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Actualizar"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={MessageSquare}
          label="Mensajes totales"
          value={data.usage.totalMessages.toLocaleString()}
          subtitle={`~${Math.round(data.usage.avgMessagesPerDay)} / día`}
          color="blue"
        />
        <StatCard
          icon={Users}
          label="Usuarios activos"
          value={data.usage.uniqueUsers}
          subtitle={`${data.usage.uniqueSessions} sesiones`}
          color="green"
        />
        <StatCard
          icon={DollarSign}
          label="Costo total tokens"
          value={`$${data.costs.totalCost.toFixed(4)}`}
          subtitle={`$${data.costs.avgCostPerMessage.toFixed(4)} / mensaje`}
          color="orange"
        />
        <StatCard
          icon={ThumbsUp}
          label="Satisfacción"
          value={data.quality.satisfactionRate !== null ? `${data.quality.satisfactionRate}%` : 'N/A'}
          subtitle={`${data.quality.thumbsUp} positivos, ${data.quality.thumbsDown} negativos`}
          color="purple"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Messages per Day */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Mensajes por día
          </h3>
          <BarSimple data={data.usage.messagesPerDay} color="#3b82f6" />
        </div>

        {/* Cost per Day */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-orange-500" />
            Costo por día (USD)
          </h3>
          <BarSimple data={data.costs.costPerDay} color="#f59e0b" />
        </div>
      </div>

      {/* Distributions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Model Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-teal-500" />
            Uso por modelo
          </h3>
          <DistributionBar data={data.distribution.model} colorMap={MODEL_COLORS} />
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-500" />
            Tipo de consulta
          </h3>
          <DistributionBar data={data.distribution.category} colorMap={CATEGORY_COLORS} />
        </div>

        {/* Plan Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-green-500" />
            Distribución por plan
          </h3>
          <DistributionBar data={data.distribution.plan} colorMap={PLAN_COLORS} />
        </div>
      </div>

      {/* Performance & Profitability Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Metrics */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Rendimiento
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Tiempo de respuesta promedio
              </span>
              <span className="font-medium text-gray-900">
                {data.quality.avgResponseTimeMs > 0
                  ? `${(data.quality.avgResponseTimeMs / 1000).toFixed(1)}s`
                  : 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Largo promedio de respuesta</span>
              <span className="font-medium text-gray-900">
                {data.quality.avgResponseLength > 0
                  ? `${data.quality.avgResponseLength} chars`
                  : 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Tokens input totales</span>
              <span className="font-medium text-gray-900">
                {data.costs.totalInputTokens.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Tokens output totales</span>
              <span className="font-medium text-gray-900">
                {data.costs.totalOutputTokens.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Costo promedio / sesión</span>
              <span className="font-medium text-gray-900">
                ${data.costs.avgCostPerSession.toFixed(4)}
              </span>
            </div>

            {/* Cost per Model Table */}
            {Object.keys(data.costs.costPerModel).length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm font-medium text-gray-700 mb-2">Costo por modelo</p>
                <div className="space-y-2">
                  {Object.entries(data.costs.costPerModel)
                    .sort(([, a], [, b]) => b.cost - a.cost)
                    .map(([model, info]) => (
                      <div key={model} className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 truncate max-w-[60%]" title={model}>
                          {model.split('/').pop()}
                        </span>
                        <span className="text-gray-700 font-medium">
                          ${info.cost.toFixed(4)} ({info.count} msgs)
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Profitability */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-green-500" />
            Rentabilidad (proyección mensual)
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Usuarios Pro activos</span>
              <span className="font-medium text-gray-900">{data.profitability.proUsers}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Ingresos mensuales (est.)</span>
              <span className="font-medium text-green-600">
                ${data.profitability.estimatedMonthlyRevenue.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Costo mensual tokens (proy.)</span>
              <span className="font-medium text-orange-600">
                ${data.profitability.projectedMonthlyCost.toFixed(2)}
              </span>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">Margen mensual (proy.)</span>
                <span className={`text-xl font-bold ${
                  data.profitability.projectedMonthlyMargin >= 0
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}>
                  ${data.profitability.projectedMonthlyMargin.toFixed(2)}
                </span>
              </div>
              <div className="mt-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Margen %</span>
                  <span className={`font-medium ${
                    data.profitability.marginPercentage >= 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}>
                    {data.profitability.marginPercentage}%
                  </span>
                </div>
                <div className="mt-2 w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      data.profitability.marginPercentage >= 50
                        ? 'bg-green-500'
                        : data.profitability.marginPercentage >= 20
                          ? 'bg-yellow-500'
                          : data.profitability.marginPercentage >= 0
                            ? 'bg-orange-500'
                            : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.max(0, Math.min(100, data.profitability.marginPercentage))}%` }}
                  />
                </div>
              </div>
            </div>

            {data.profitability.proUsers > 0 && (
              <div className="border-t border-gray-100 pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Ingreso por usuario Pro</span>
                  <span className="text-gray-700 font-medium">$19.99/mes</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-gray-500">Costo por usuario Pro (proy.)</span>
                  <span className="text-gray-700 font-medium">
                    ${data.profitability.proUsers > 0
                      ? (data.profitability.projectedMonthlyCost / data.profitability.proUsers).toFixed(2)
                      : '0.00'
                    }/mes
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error Metrics */}
      {data.errors && (data.errors.totalErrors > 0 || true) && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Errores de API
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-red-50 rounded-lg p-4">
              <p className="text-sm text-red-600 mb-1">Total errores</p>
              <p className="text-2xl font-bold text-red-700">{data.errors.totalErrors}</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <p className="text-sm text-orange-600 mb-1">Error rate</p>
              <p className="text-2xl font-bold text-orange-700">{data.errors.errorRate}%</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-green-600 mb-1">Requests exitosos</p>
              <p className="text-2xl font-bold text-green-700">
                {data.usage.totalMessages - data.errors.totalErrors}
              </p>
            </div>
          </div>

          {Object.keys(data.errors.errorsByModel).length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-2">Errores por modelo</p>
              <div className="space-y-2">
                {Object.entries(data.errors.errorsByModel)
                  .sort(([, a], [, b]) => b - a)
                  .map(([model, count]) => (
                    <div key={model} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 truncate max-w-[60%]" title={model}>
                        {model.split('/').pop() || model}
                      </span>
                      <span className="text-red-600 font-medium">{count} errores</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {data.errors.recentErrors.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Errores recientes</p>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {data.errors.recentErrors.map((err, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm p-2 bg-gray-50 rounded-lg">
                    <span className="text-gray-400 whitespace-nowrap">
                      {new Date(err.created_at).toLocaleDateString('es-ES', {
                        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
                      })}
                    </span>
                    <span className="text-gray-500 whitespace-nowrap">
                      {(err.model as string)?.split('/').pop() || 'N/A'}
                    </span>
                    <span className="text-red-600 truncate" title={err.error_message}>
                      {err.error_message}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Feedback Detail */}
      {data.quality.totalFeedback > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <ThumbsUp className="w-5 h-5 text-purple-500" />
            Feedback de usuarios
          </h3>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <ThumbsUp className="w-5 h-5 text-green-500" />
              <span className="text-2xl font-bold text-green-600">{data.quality.thumbsUp}</span>
              <span className="text-gray-500">positivos</span>
            </div>
            <div className="flex items-center gap-2">
              <ThumbsDown className="w-5 h-5 text-red-500" />
              <span className="text-2xl font-bold text-red-600">{data.quality.thumbsDown}</span>
              <span className="text-gray-500">negativos</span>
            </div>
            <div className="flex-1">
              <div className="w-full bg-red-100 rounded-full h-6 overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all flex items-center justify-center"
                  style={{ width: `${data.quality.satisfactionRate || 0}%` }}
                >
                  {(data.quality.satisfactionRate || 0) > 15 && (
                    <span className="text-xs text-white font-medium">
                      {data.quality.satisfactionRate}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
