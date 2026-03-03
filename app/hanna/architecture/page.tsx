'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createBrowserClient } from '@supabase/ssr'
import {
  ArrowLeft, Users, Gift, MessageSquare, FileText, Palette, Filter,
  CheckCircle2, Lock, ChevronRight, Sparkles, Crown,
} from 'lucide-react'
import { SECTION_ORDER, SECTION_LABELS, type ArchitectureSection } from '@/types/marketing-architecture'

const SECTION_ICON_MAP: Record<ArchitectureSection, React.ReactNode> = {
  avatar: <Users className="w-6 h-6" />,
  offer: <Gift className="w-6 h-6" />,
  communication: <MessageSquare className="w-6 h-6" />,
  content_strategy: <FileText className="w-6 h-6" />,
  branding: <Palette className="w-6 h-6" />,
  funnel: <Filter className="w-6 h-6" />,
}

const SECTION_DESCRIPTIONS: Record<ArchitectureSection, string> = {
  avatar: 'Define a tu cliente ideal: identidad, frustraciones, suenos, comportamiento de compra.',
  offer: 'Construye una oferta irresistible: precio, gancho, garantia, diferenciacion.',
  communication: 'Define tu mensaje central, pilares de contenido, tono y hooks.',
  content_strategy: 'Planifica tu estrategia: categorias, canales, formulas y metrica norte.',
  branding: 'Crea tu marca: esencia, verbal, visual, personalidad.',
  funnel: 'Disena tu embudo: trafico, captura, conversion, retencion.',
}

export default function ArchitectureDashboard() {
  const router = useRouter()
  const [completionStatus, setCompletionStatus] = useState<Record<string, number>>({})
  const [overallCompletion, setOverallCompletion] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isPro, setIsPro] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/hanna/login')
        return
      }

      // Check plan
      const { data: profile } = await supabase.from('profiles').select('plan').eq('id', user.id).single()
      const userIsPro = profile?.plan === 'pro' || profile?.plan === 'business'
      setIsPro(userIsPro)

      if (!userIsPro) {
        setLoading(false)
        return
      }

      // Fetch architecture data
      try {
        const res = await fetch('/api/hanna/architecture')
        const data = await res.json()
        if (data.success) {
          setCompletionStatus(data.completionStatus || {})
          setOverallCompletion(data.architecture?.completion_percentage || 0)
        }
      } catch (error) {
        console.error('Error loading architecture:', error)
      }
      setLoading(false)
    }
    loadData()
  }, [supabase, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0118] to-[#1a0a2e] flex items-center justify-center">
        <div className="animate-pulse text-white/60">Cargando...</div>
      </div>
    )
  }

  if (!isPro) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0118] to-[#1a0a2e] flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <Lock className="w-16 h-16 text-[#C7517E] mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Arquitectura de Marketing</h1>
          <p className="text-white/60 mb-6">
            La Arquitectura de Marketing es una herramienta exclusiva de Hanna Pro.
            Construye los 6 pilares de tu negocio para que Hanna te de consejos hiper-personalizados.
          </p>
          <Link
            href="/hanna/upgrade"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#C7517E] to-[#b8456f] text-white font-medium rounded-lg hover:from-[#d4608d] hover:to-[#C7517E] transition-all"
          >
            <Crown className="w-5 h-5" />
            Actualizar a Pro
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0118] to-[#1a0a2e]">
      {/* Header */}
      <div className="border-b border-white/10 bg-white/5 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/hanna/dashboard" className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
            <Image src="/images/hanna-ai.png" alt="Hanna" width={40} height={40} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-white">Arquitectura de Marketing</h1>
            <p className="text-xs text-white/50">Los 6 pilares de tu negocio</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-[#2CB6D7]">{overallCompletion}%</div>
            <p className="text-xs text-white/50">completado</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-5xl mx-auto px-4 py-4">
        <div className="w-full bg-white/10 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-[#C7517E] to-[#2CB6D7] h-2 rounded-full transition-all duration-500"
            style={{ width: `${overallCompletion}%` }}
          />
        </div>
      </div>

      {/* Section Cards */}
      <div className="max-w-5xl mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SECTION_ORDER.map((section, index) => {
            const completion = completionStatus[section] || 0
            const isComplete = completion >= 80

            return (
              <Link
                key={section}
                href={`/hanna/architecture/${section}`}
                className="group relative bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 hover:border-white/20 transition-all"
              >
                {/* Section number */}
                <div className="absolute top-3 right-3 text-xs font-mono text-white/20">
                  {String(index + 1).padStart(2, '0')}
                </div>

                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                  isComplete
                    ? 'bg-green-500/20 text-green-400'
                    : completion > 0
                    ? 'bg-[#C7517E]/20 text-[#C7517E]'
                    : 'bg-white/10 text-white/40'
                }`}>
                  {isComplete ? <CheckCircle2 className="w-6 h-6" /> : SECTION_ICON_MAP[section]}
                </div>

                {/* Title and description */}
                <h3 className="text-white font-semibold mb-1">{SECTION_LABELS[section]}</h3>
                <p className="text-white/50 text-sm mb-4 line-clamp-2">{SECTION_DESCRIPTIONS[section]}</p>

                {/* Progress bar */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-white/10 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all ${
                        isComplete ? 'bg-green-400' : 'bg-[#C7517E]'
                      }`}
                      style={{ width: `${completion}%` }}
                    />
                  </div>
                  <span className="text-xs text-white/40 w-8 text-right">{completion}%</span>
                </div>

                {/* Arrow */}
                <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight className="w-5 h-5 text-white/40" />
                </div>
              </Link>
            )
          })}
        </div>

        {/* Helper message */}
        <div className="mt-8 bg-[#2CB6D7]/10 border border-[#2CB6D7]/20 rounded-xl p-4 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-[#2CB6D7] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-white text-sm font-medium">Hanna usa tu arquitectura</p>
            <p className="text-white/60 text-sm">
              Cada seccion que completas hace que los consejos de Hanna sean mas personalizados.
              No necesitas completar todo de una vez — cada campo suma.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
