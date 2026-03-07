'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ClipboardCheck,
  Star,
  TrendingUp,
  Users,
  Download,
  ChevronDown,
  ChevronUp,
  Loader2,
  BookOpen,
} from 'lucide-react'
import type { SurveyRecord, SurveyStats } from '@/types/survey'
import {
  LIKED_OPTIONS,
  IMPROVEMENT_OPTIONS,
  FUTURE_TOPIC_OPTIONS,
  COMMUNITY_VALUE_OPTIONS,
  PLATFORM_OPTIONS,
  LEARNED_SKILL_OPTIONS,
  FIRST_IMPLEMENTATION_OPTIONS,
  IMPLEMENTATION_BARRIER_OPTIONS,
  DURATION_FEEDBACK_OPTIONS,
  SCHEDULE_FEEDBACK_OPTIONS,
  PREFERRED_FORMAT_OPTIONS,
  WILLINGNESS_TO_PAY_OPTIONS,
} from '@/types/survey'

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string
  value: string | number
  icon: React.ElementType
  color: string
}) {
  return (
    <div className="bg-white rounded-xl border p-6">
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <span className="text-sm text-gray-500">{label}</span>
      </div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  )
}

function labelFor(value: string, options: { value: string; label: string }[]): string {
  return options.find((o) => o.value === value)?.label || value
}

function SurveyRow({ survey }: { survey: SurveyRecord }) {
  const [expanded, setExpanded] = useState(false)

  const knowledgeGain = (survey.knowledge_after || 0) - (survey.knowledge_before || 0)

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors text-left"
      >
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-800 truncate">{survey.full_name}</p>
          <p className="text-sm text-gray-500 truncate">{survey.email}</p>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < survey.overall_rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-200'
              }`}
            />
          ))}
        </div>
        <div className="w-12 text-center">
          <span
            className={`text-sm font-medium ${
              survey.nps_score >= 9
                ? 'text-green-600'
                : survey.nps_score >= 7
                ? 'text-yellow-600'
                : 'text-red-500'
            }`}
          >
            {survey.nps_score}
          </span>
        </div>
        <div className="w-16 text-center">
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              survey.community_interest === 'yes'
                ? 'bg-green-100 text-green-700'
                : survey.community_interest === 'maybe'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {survey.community_interest === 'yes' ? 'Si' : survey.community_interest === 'maybe' ? 'Tal vez' : 'No'}
          </span>
        </div>
        <div className="w-20 text-right text-sm text-gray-400">
          {new Date(survey.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {/* Satisfaction */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-700 mb-2">Lo que mas gusto</h4>
                <div className="flex flex-wrap gap-1">
                  {survey.liked_most.map((v) => (
                    <span key={v} className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">
                      {labelFor(v, LIKED_OPTIONS)}
                    </span>
                  ))}
                  {survey.liked_most.length === 0 && <span className="text-gray-400">-</span>}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-700 mb-2">Areas de mejora</h4>
                <div className="flex flex-wrap gap-1">
                  {survey.improvements.map((v) => (
                    <span key={v} className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-xs">
                      {labelFor(v, IMPROVEMENT_OPTIONS)}
                    </span>
                  ))}
                  {survey.improvements.length === 0 && <span className="text-gray-400">-</span>}
                </div>
              </div>
              {survey.suggestions && (
                <div className="bg-gray-50 rounded-lg p-4 md:col-span-2">
                  <h4 className="font-medium text-gray-700 mb-1">Sugerencias</h4>
                  <p className="text-gray-600">{survey.suggestions}</p>
                </div>
              )}

              {/* Learning Impact (NEW) */}
              <div className="bg-indigo-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-700 mb-2">Habilidades aprendidas</h4>
                <div className="flex flex-wrap gap-1">
                  {(survey.learned_skills || []).map((v) => (
                    <span key={v} className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs">
                      {labelFor(v, LEARNED_SKILL_OPTIONS)}
                    </span>
                  ))}
                  {(!survey.learned_skills || survey.learned_skills.length === 0) && <span className="text-gray-400">-</span>}
                </div>
              </div>
              <div className="bg-indigo-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-700 mb-2">Impacto de conocimiento</h4>
                <div className="space-y-1">
                  <p className="text-gray-600">Antes: {survey.knowledge_before || '-'}/5 | Despues: {survey.knowledge_after || '-'}/5</p>
                  {knowledgeGain > 0 && (
                    <span className="inline-block bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-medium">
                      +{knowledgeGain} nivel{knowledgeGain > 1 ? 'es' : ''}
                    </span>
                  )}
                  {survey.first_implementation && (
                    <p className="text-gray-500 mt-1">Implementara: {labelFor(survey.first_implementation, FIRST_IMPLEMENTATION_OPTIONS)}</p>
                  )}
                </div>
              </div>
              {(survey.implementation_barriers || []).length > 0 && (
                <div className="bg-red-50 rounded-lg p-4 md:col-span-2">
                  <h4 className="font-medium text-gray-700 mb-2">Barreras de implementacion</h4>
                  <div className="flex flex-wrap gap-1">
                    {survey.implementation_barriers.map((v) => (
                      <span key={v} className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs">
                        {labelFor(v, IMPLEMENTATION_BARRIER_OPTIONS)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Logistics (NEW) */}
              <div className="bg-amber-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-700 mb-2">Logistica</h4>
                <div className="space-y-1 text-gray-600">
                  <p>Expectativas: {survey.expectations_met || '-'}/5</p>
                  {survey.duration_feedback && <p>Duracion: {labelFor(survey.duration_feedback, DURATION_FEEDBACK_OPTIONS)}</p>}
                  {survey.schedule_feedback && <p>Horario: {labelFor(survey.schedule_feedback, SCHEDULE_FEEDBACK_OPTIONS)}</p>}
                  {survey.preferred_format && <p>Formato: {labelFor(survey.preferred_format, PREFERRED_FORMAT_OPTIONS)}</p>}
                </div>
              </div>

              {/* Future */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-700 mb-2">Temas de interes</h4>
                <div className="flex flex-wrap gap-1">
                  {survey.future_topics.map((v) => (
                    <span key={v} className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs">
                      {labelFor(v, FUTURE_TOPIC_OPTIONS)}
                    </span>
                  ))}
                </div>
                {survey.future_topics_other && (
                  <p className="text-gray-500 mt-1 text-xs">Otro: {survey.future_topics_other}</p>
                )}
                {survey.willingness_to_pay && (
                  <p className="text-gray-500 mt-1 text-xs">Dispuesta a pagar: {labelFor(survey.willingness_to_pay, WILLINGNESS_TO_PAY_OPTIONS)}</p>
                )}
              </div>

              {/* Community */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-700 mb-2">Comunidad</h4>
                <p className="text-gray-600">
                  Interes continuo: {survey.continuing_interest}/5
                </p>
                {survey.community_values.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {survey.community_values.map((v) => (
                      <span key={v} className="bg-teal-100 text-teal-700 px-2 py-0.5 rounded text-xs">
                        {labelFor(v, COMMUNITY_VALUE_OPTIONS)}
                      </span>
                    ))}
                  </div>
                )}
                {survey.preferred_platform && (
                  <p className="text-gray-500 mt-1 text-xs">
                    Plataforma: {labelFor(survey.preferred_platform, PLATFORM_OPTIONS)}
                  </p>
                )}
              </div>

              {/* Google + Coupon */}
              <div className="bg-gray-50 rounded-lg p-4 flex gap-6">
                <div>
                  <h4 className="font-medium text-gray-700 mb-1">Google Rating</h4>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < (survey.google_rating || 0)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-200'
                        }`}
                      />
                    ))}
                    {survey.google_review_clicked && (
                      <span className="text-xs text-green-600 ml-2">Fue a Google</span>
                    )}
                  </div>
                </div>
                {survey.coupon_code && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-1">Cupon</h4>
                    <code className="text-sm text-purple-600 font-bold">{survey.coupon_code}</code>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function AdminSurveysPage() {
  const [surveys, setSurveys] = useState<SurveyRecord[]>([])
  const [stats, setStats] = useState<SurveyStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'promoters' | 'passives' | 'detractors'>('all')

  useEffect(() => {
    fetchSurveys()
  }, [filter])

  async function fetchSurveys() {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filter !== 'all') params.set('npsCategory', filter)

      const res = await fetch(`/api/admin/surveys?${params}`)
      const data = await res.json()

      if (data.success) {
        setSurveys(data.surveys)
        setStats(data.stats)
      }
    } catch (err) {
      console.error('Error fetching surveys:', err)
    } finally {
      setLoading(false)
    }
  }

  function exportCSV() {
    if (!surveys.length) return

    const headers = [
      'Nombre', 'Email', 'Rating', 'NPS', 'Interes Continuo',
      'Lo que gusto', 'Mejoras', 'Sugerencias',
      'Habilidades aprendidas', 'Conocimiento antes', 'Conocimiento despues',
      'Primera implementacion', 'Barreras',
      'Expectativas', 'Duracion', 'Horario', 'Formato preferido',
      'Temas futuros', 'Dispuesta a pagar',
      'Comunidad', 'Valores comunidad', 'Plataforma',
      'Google Rating', 'Cupon', 'Fecha',
    ]
    const rows = surveys.map((s) => [
      s.full_name,
      s.email,
      s.overall_rating,
      s.nps_score,
      s.continuing_interest,
      s.liked_most.join('; '),
      s.improvements.join('; '),
      s.suggestions || '',
      (s.learned_skills || []).join('; '),
      s.knowledge_before || '',
      s.knowledge_after || '',
      s.first_implementation || '',
      (s.implementation_barriers || []).join('; '),
      s.expectations_met || '',
      s.duration_feedback || '',
      s.schedule_feedback || '',
      s.preferred_format || '',
      s.future_topics.join('; '),
      s.willingness_to_pay || '',
      s.community_interest,
      s.community_values.join('; '),
      s.preferred_platform || '',
      s.google_rating || '',
      s.coupon_code || '',
      new Date(s.created_at).toLocaleDateString('es-ES'),
    ])

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `encuestas-workshop-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <ClipboardCheck className="w-7 h-7 text-purple-600" />
            Encuestas del Workshop
          </h1>
          <p className="text-gray-500 mt-1">Feedback y resultados de las participantes</p>
        </div>
        <button
          onClick={exportCSV}
          disabled={!surveys.length}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          <Download className="w-4 h-4" />
          Exportar CSV
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <StatCard
            label="Total Respuestas"
            value={stats.totalResponses}
            icon={ClipboardCheck}
            color="bg-purple-500"
          />
          <StatCard
            label="Rating Promedio"
            value={`${stats.avgRating.toFixed(1)} / 5`}
            icon={Star}
            color="bg-yellow-500"
          />
          <StatCard
            label="NPS Score"
            value={stats.npsCalculated.toFixed(0)}
            icon={TrendingUp}
            color={stats.npsCalculated > 50 ? 'bg-green-500' : stats.npsCalculated >= 0 ? 'bg-yellow-500' : 'bg-red-500'}
          />
          <StatCard
            label="Interes Comunidad"
            value={`${stats.totalResponses > 0 ? Math.round(((stats.communityYes + stats.communityMaybe) / stats.totalResponses) * 100) : 0}%`}
            icon={Users}
            color="bg-teal-500"
          />
          <StatCard
            label="Interes Continuo"
            value={`${stats.avgContinuingInterest.toFixed(1)} / 5`}
            icon={BookOpen}
            color="bg-indigo-500"
          />
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {[
          { value: 'all' as const, label: 'Todas' },
          { value: 'promoters' as const, label: 'Promotores (9-10)' },
          { value: 'passives' as const, label: 'Pasivos (7-8)' },
          { value: 'detractors' as const, label: 'Detractores (0-6)' },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f.value
                ? 'bg-purple-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border overflow-hidden">
        {/* Table header */}
        <div className="flex items-center gap-4 px-6 py-3 bg-gray-50 border-b text-xs font-medium text-gray-500 uppercase">
          <div className="flex-1">Participante</div>
          <div className="w-[120px]">Rating</div>
          <div className="w-12 text-center">NPS</div>
          <div className="w-16 text-center">Comunidad</div>
          <div className="w-20 text-right">Fecha</div>
          <div className="w-4" />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
          </div>
        ) : surveys.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            No hay encuestas aun
          </div>
        ) : (
          surveys.map((survey) => (
            <SurveyRow key={survey.id} survey={survey} />
          ))
        )}
      </div>
    </div>
  )
}
