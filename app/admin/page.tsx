'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  DollarSign,
  TrendingUp,
  Activity,
  Ticket,
  Database,
} from 'lucide-react'

interface DashboardStats {
  users: {
    total: number
    pro: number
    free: number
    active_30d: number
  }
  revenue: {
    mrr: number
    total_lifetime: number
  }
  costs: {
    total_30d: number
    pro_costs: number
    free_costs: number
    avg_cost_per_user: number
  }
  margin: {
    revenue_30d: number
    costs_30d: number
    profit_30d: number
    margin_percentage: number
  }
  coupons: {
    total: number
    active: number
    total_redemptions: number
    total_discount_given: number
  }
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'blue',
  trend,
}: {
  title: string
  value: string | number
  subtitle?: string
  icon: any
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red'
  trend?: { value: number; isPositive: boolean }
}) {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
          {trend && (
            <div
              className={`mt-2 inline-flex items-center text-sm ${
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              }`}
            >
              <span className="font-medium">{trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadStats()
  }, [])

  async function loadStats() {
    try {
      const res = await fetch('/api/admin/dashboard/stats')
      const data = await res.json()

      if (data.success) {
        setStats(data.stats)
      } else {
        setError(data.error || 'Error al cargar estadísticas')
      }
    } catch (err) {
      console.error('Error loading stats:', err)
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">Cargando métricas...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-600">⚠️ {error}</p>
        <button
          onClick={loadStats}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Reintentar
        </button>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
        <p className="text-yellow-700">No hay datos disponibles</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600 mt-1">
          Métricas principales de Hanna SaaS
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Usuarios Totales"
          value={stats.users.total}
          subtitle={`${stats.users.pro} Pro • ${stats.users.free} Free`}
          icon={Users}
          color="blue"
        />

        <StatCard
          title="MRR (Monthly Recurring Revenue)"
          value={`$${stats.revenue.mrr.toFixed(2)}`}
          subtitle="Ingresos recurrentes mensuales"
          icon={DollarSign}
          color="green"
        />

        <StatCard
          title="Costos de API (30d)"
          value={`$${stats.costs.total_30d.toFixed(2)}`}
          subtitle={`$${stats.costs.avg_cost_per_user.toFixed(4)} por usuario`}
          icon={Activity}
          color="orange"
        />

        <StatCard
          title="Margen de Ganancia"
          value={`${stats.margin.margin_percentage.toFixed(1)}%`}
          subtitle={`Profit: $${stats.margin.profit_30d.toFixed(2)}/mes`}
          icon={TrendingUp}
          color={stats.margin.margin_percentage >= 80 ? 'green' : 'orange'}
        />
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            Ingresos
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">MRR</span>
              <span className="font-bold text-gray-900">
                ${stats.revenue.mrr.toFixed(2)}/mes
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">ARR (Proyectado)</span>
              <span className="font-bold text-gray-900">
                ${(stats.revenue.mrr * 12).toFixed(2)}/año
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total Histórico</span>
              <span className="font-bold text-gray-900">
                ${stats.revenue.total_lifetime.toFixed(2)}
              </span>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-medium">Usuarios Pro</span>
                <span className="font-bold text-green-600">
                  {stats.users.pro} × $19.99 = ${(stats.users.pro * 19.99).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Costs Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-orange-600" />
            Costos de API (Últimos 30 días)
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Usuarios Pro</span>
              <span className="font-bold text-gray-900">
                ${stats.costs.pro_costs.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">Usuarios Free</span>
              <span className="font-bold text-gray-900">
                ${stats.costs.free_costs.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total</span>
              <span className="font-bold text-orange-600">
                ${stats.costs.total_30d.toFixed(2)}
              </span>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-medium">Costo Promedio/Usuario</span>
                <span className="font-bold text-gray-900">
                  ${stats.costs.avg_cost_per_user.toFixed(4)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profit Analysis */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          Análisis de Rentabilidad (30 días)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Ingresos</p>
            <p className="text-2xl font-bold text-green-600">
              ${stats.margin.revenue_30d.toFixed(2)}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-1">Costos</p>
            <p className="text-2xl font-bold text-orange-600">
              -${stats.margin.costs_30d.toFixed(2)}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-1">Ganancia Neta</p>
            <p className="text-2xl font-bold text-blue-600">
              ${stats.margin.profit_30d.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Margen: {stats.margin.margin_percentage.toFixed(1)}%
            </p>
          </div>
        </div>

        {stats.margin.margin_percentage < 70 && (
          <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
            <p className="text-sm text-yellow-800 flex items-center gap-2">
              <span>⚠️</span>
              <span>Margen por debajo del 70%. Considera optimizar costos o ajustar precios.</span>
            </p>
          </div>
        )}
      </div>

      {/* Coupons Stats */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Ticket className="w-5 h-5 text-purple-600" />
          Cupones de Descuento
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600">Cupones Totales</p>
            <p className="text-2xl font-bold text-gray-900">{stats.coupons.total}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Activos</p>
            <p className="text-2xl font-bold text-green-600">{stats.coupons.active}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Redenciones</p>
            <p className="text-2xl font-bold text-blue-600">{stats.coupons.total_redemptions}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Descuento Total Dado</p>
            <p className="text-2xl font-bold text-orange-600">
              ${stats.coupons.total_discount_given.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4">
        <button
          onClick={loadStats}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          🔄 Actualizar Datos
        </button>

        <a
          href="/admin/coupons"
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          🎫 Gestionar Cupones
        </a>

        <a
          href="/admin/analytics"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          📊 Ver Analytics Detallados
        </a>
      </div>
    </div>
  )
}
