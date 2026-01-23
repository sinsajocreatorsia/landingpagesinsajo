'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface Stats {
  overview: {
    totalRegistrations: number
    paidRegistrations: number
    conversionRate: number
    totalRevenue: string
    avgTicketValue: string
  }
  profiles: {
    total: number
    completed: number
    completionRate: number
    avgCompletion: number
  }
  analysis: {
    total: number
    pendingAnalysis: number
    avgReadinessScore: string
    engagementDistribution: Record<string, number>
    followUpPriority: Record<string, number>
  }
  emails: {
    total: number
    sent: number
    delivered: number
    opened: number
    failed: number
    byType: Record<string, number>
  }
}

interface Participant {
  id: string
  email: string
  fullName: string
  phone: string | null
  country: string | null
  paymentStatus: string
  paymentMethod: string
  amountPaid: number
  createdAt: string
  profile: {
    businessName: string | null
    industry: string | null
    profileCompleted: boolean
    completionPercentage: number
    aiExperience: string | null
  } | null
  analysis: {
    summary: string
    readinessScore: number
    engagementLevel: string
    recommendedFocus: string
  } | null
}

function StatCard({
  title,
  value,
  subtitle,
  color = 'turquoise',
}: {
  title: string
  value: string | number
  subtitle?: string
  color?: 'turquoise' | 'pink' | 'navy' | 'teal'
}) {
  const colorClasses = {
    turquoise: 'bg-[#2CB6D7]/10 border-[#2CB6D7]/30 text-[#2CB6D7]',
    pink: 'bg-[#C7517E]/10 border-[#C7517E]/30 text-[#C7517E]',
    navy: 'bg-[#022133]/10 border-[#022133]/30 text-[#022133]',
    teal: 'bg-[#36B3AE]/10 border-[#36B3AE]/30 text-[#36B3AE]',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border p-6 ${colorClasses[color]}`}
    >
      <p className="text-sm font-medium text-gray-600">{title}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
      {subtitle && <p className="mt-1 text-xs text-gray-500">{subtitle}</p>}
    </motion.div>
  )
}

function ParticipantRow({
  participant,
  onAnalyze,
  isAnalyzing,
}: {
  participant: Participant
  onAnalyze: () => void
  isAnalyzing: boolean
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <>
      <tr
        className="cursor-pointer hover:bg-gray-50"
        onClick={() => setExpanded(!expanded)}
      >
        <td className="px-4 py-3 whitespace-nowrap">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-[#2CB6D7]/20 flex items-center justify-center text-sm font-medium text-[#2CB6D7]">
              {participant.fullName.charAt(0).toUpperCase()}
            </div>
            <div className="ml-3">
              <p className="font-medium text-gray-900">{participant.fullName}</p>
              <p className="text-sm text-gray-500">{participant.email}</p>
            </div>
          </div>
        </td>
        <td className="px-4 py-3 whitespace-nowrap">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              participant.paymentStatus === 'completed'
                ? 'bg-green-100 text-green-700'
                : participant.paymentStatus === 'pending'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {participant.paymentStatus}
          </span>
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
          ${participant.amountPaid || 0}
        </td>
        <td className="px-4 py-3 whitespace-nowrap">
          {participant.profile?.profileCompleted ? (
            <span className="text-green-600">✓ Completo</span>
          ) : (
            <span className="text-gray-400">
              {participant.profile?.completionPercentage || 0}%
            </span>
          )}
        </td>
        <td className="px-4 py-3 whitespace-nowrap">
          {participant.analysis ? (
            <div className="flex items-center gap-2">
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  participant.analysis.readinessScore >= 7
                    ? 'bg-green-100 text-green-700'
                    : participant.analysis.readinessScore >= 4
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {participant.analysis.readinessScore}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-xs ${
                  participant.analysis.engagementLevel === 'high'
                    ? 'bg-green-100 text-green-700'
                    : participant.analysis.engagementLevel === 'medium'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {participant.analysis.engagementLevel}
              </span>
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onAnalyze()
              }}
              disabled={isAnalyzing}
              className="text-sm text-[#2CB6D7] hover:text-[#C7517E] disabled:opacity-50"
            >
              {isAnalyzing ? 'Analizando...' : 'Analizar'}
            </button>
          )}
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
          {new Date(participant.createdAt).toLocaleDateString('es')}
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={6} className="px-4 py-4 bg-gray-50">
            <div className="grid grid-cols-2 gap-6">
              {/* Profile Info */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Perfil del Negocio</h4>
                {participant.profile ? (
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-500">Empresa:</span> {participant.profile.businessName || 'N/A'}</p>
                    <p><span className="text-gray-500">Industria:</span> {participant.profile.industry || 'N/A'}</p>
                    <p><span className="text-gray-500">Experiencia IA:</span> {participant.profile.aiExperience || 'N/A'}</p>
                    <p><span className="text-gray-500">País:</span> {participant.country || 'N/A'}</p>
                    <p><span className="text-gray-500">Teléfono:</span> {participant.phone || 'N/A'}</p>
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">Sin perfil completado</p>
                )}
              </div>

              {/* Analysis */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Análisis de Hanna</h4>
                {participant.analysis ? (
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-700">{participant.analysis.summary}</p>
                    <p className="mt-2">
                      <span className="text-gray-500">Enfoque recomendado:</span>{' '}
                      <span className="text-[#2CB6D7]">{participant.analysis.recommendedFocus}</span>
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">Sin análisis disponible</p>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'participants'>('overview')
  const [analyzingId, setAnalyzingId] = useState<string | null>(null)
  const [batchAnalyzing, setBatchAnalyzing] = useState(false)
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('completed')

  useEffect(() => {
    loadData()
  }, [filter])

  async function loadData() {
    setLoading(true)
    try {
      const [statsRes, participantsRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch(`/api/admin/participants?status=${filter}`),
      ])

      const statsData = await statsRes.json()
      const participantsData = await participantsRes.json()

      if (statsData.success) setStats(statsData.stats)
      if (participantsData.success) setParticipants(participantsData.participants)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function analyzeParticipant(registrationId: string) {
    setAnalyzingId(registrationId)
    try {
      const res = await fetch('/api/admin/hanna/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrationId }),
      })

      const data = await res.json()
      if (data.success) {
        // Refresh data
        loadData()
      }
    } catch (error) {
      console.error('Error analyzing participant:', error)
    } finally {
      setAnalyzingId(null)
    }
  }

  async function runBatchAnalysis() {
    setBatchAnalyzing(true)
    try {
      const res = await fetch('/api/admin/hanna/analyze-batch', {
        method: 'POST',
      })

      const data = await res.json()
      if (data.success) {
        alert(`Análisis completado: ${data.results.analyzed} perfiles analizados, ${data.results.failed} fallidos`)
        loadData()
      }
    } catch (error) {
      console.error('Error in batch analysis:', error)
    } finally {
      setBatchAnalyzing(false)
    }
  }

  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#2CB6D7] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">Cargando panel de administración...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#022133] text-white py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Panel de Administración</h1>
              <p className="text-gray-400 text-sm mt-1">Workshop: IA para Empresarias Exitosas</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={runBatchAnalysis}
                disabled={batchAnalyzing}
                className="bg-[#C7517E] hover:bg-[#C7517E]/90 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 transition-colors"
              >
                {batchAnalyzing ? 'Analizando...' : '🤖 Analizar Todos'}
              </button>
              <button
                onClick={loadData}
                className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                ↻ Actualizar
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'bg-[#2CB6D7] text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              📊 Overview
            </button>
            <button
              onClick={() => setActiveTab('participants')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'participants'
                  ? 'bg-[#2CB6D7] text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              👥 Participantes
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'overview' && stats && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Métricas Principales</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  title="Registros Totales"
                  value={stats.overview.totalRegistrations}
                  subtitle={`${stats.overview.paidRegistrations} pagados`}
                  color="turquoise"
                />
                <StatCard
                  title="Ingresos Totales"
                  value={`$${stats.overview.totalRevenue}`}
                  subtitle={`Ticket promedio: $${stats.overview.avgTicketValue}`}
                  color="pink"
                />
                <StatCard
                  title="Tasa de Conversión"
                  value={`${stats.overview.conversionRate}%`}
                  subtitle="Visitantes → Pagos"
                  color="teal"
                />
                <StatCard
                  title="Perfiles Completos"
                  value={stats.profiles.completed}
                  subtitle={`${stats.profiles.completionRate}% completion rate`}
                  color="navy"
                />
              </div>
            </section>

            {/* Analysis Stats */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Análisis de Hanna</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border p-6">
                  <p className="text-sm text-gray-500">Perfiles Analizados</p>
                  <p className="text-2xl font-bold text-[#2CB6D7] mt-1">
                    {stats.analysis.total}
                    <span className="text-sm font-normal text-gray-400">
                      {' '}/ {stats.profiles.completed}
                    </span>
                  </p>
                  {stats.analysis.pendingAnalysis > 0 && (
                    <p className="text-xs text-orange-500 mt-2">
                      {stats.analysis.pendingAnalysis} pendientes de análisis
                    </p>
                  )}
                </div>

                <div className="bg-white rounded-xl border p-6">
                  <p className="text-sm text-gray-500">Readiness Score Promedio</p>
                  <p className="text-2xl font-bold text-[#36B3AE] mt-1">
                    {stats.analysis.avgReadinessScore}
                    <span className="text-sm font-normal text-gray-400"> / 10</span>
                  </p>
                </div>

                <div className="bg-white rounded-xl border p-6">
                  <p className="text-sm text-gray-500 mb-3">Nivel de Engagement</p>
                  <div className="flex gap-4">
                    {Object.entries(stats.analysis.engagementDistribution).map(([level, count]) => (
                      <div key={level} className="text-center">
                        <p className="text-lg font-semibold">{count}</p>
                        <p className={`text-xs capitalize ${
                          level === 'high' ? 'text-green-600' :
                          level === 'medium' ? 'text-blue-600' : 'text-gray-500'
                        }`}>
                          {level}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Email Stats */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Emails Enviados</h2>
              <div className="bg-white rounded-xl border p-6">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#022133]">{stats.emails.total}</p>
                    <p className="text-xs text-gray-500">Total</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{stats.emails.sent}</p>
                    <p className="text-xs text-gray-500">Enviados</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{stats.emails.delivered}</p>
                    <p className="text-xs text-gray-500">Entregados</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">{stats.emails.opened}</p>
                    <p className="text-xs text-gray-500">Abiertos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">{stats.emails.failed}</p>
                    <p className="text-xs text-gray-500">Fallidos</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'participants' && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-sm ${
                    filter === 'all'
                      ? 'bg-[#022133] text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setFilter('completed')}
                  className={`px-3 py-1.5 rounded-lg text-sm ${
                    filter === 'completed'
                      ? 'bg-[#022133] text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Pagados
                </button>
                <button
                  onClick={() => setFilter('pending')}
                  className={`px-3 py-1.5 rounded-lg text-sm ${
                    filter === 'pending'
                      ? 'bg-[#022133] text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Pendientes
                </button>
              </div>
              <p className="text-sm text-gray-500">
                {participants.length} participantes
              </p>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Participante
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pago
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Perfil
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Análisis IA
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {participants.map((participant) => (
                    <ParticipantRow
                      key={participant.id}
                      participant={participant}
                      onAnalyze={() => analyzeParticipant(participant.id)}
                      isAnalyzing={analyzingId === participant.id}
                    />
                  ))}
                </tbody>
              </table>

              {participants.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No hay participantes con este filtro
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
