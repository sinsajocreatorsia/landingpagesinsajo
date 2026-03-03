'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createBrowserClient } from '@supabase/ssr'
import {
  ArrowRight, ArrowLeft, Zap, Coffee, Briefcase, Heart,
  MessageSquare, BookOpen, Sparkles, Target, Check, SkipForward,
} from 'lucide-react'
import { QuickActions } from '@/components/hanna/QuickActions'
import { hannaEvents } from '@/lib/hanna/analytics-events'

type ToneStyle = 'energetic' | 'calm' | 'professional' | 'friendly'
type Approach = 'direct' | 'detailed' | 'storytelling'
type Expertise = 'beginner' | 'intermediate' | 'expert'

interface ToneConfig {
  style: ToneStyle
  approach: Approach
  expertise: Expertise
  askQuestions: boolean
}

const TONE_OPTIONS: Array<{ value: ToneStyle; label: string; desc: string; icon: React.ComponentType<{ className?: string }> }> = [
  { value: 'energetic', label: 'Energica', desc: 'Directa, rapida, orientada a la accion', icon: Zap },
  { value: 'calm', label: 'Calmada', desc: 'Reflexiva, estrategica, a largo plazo', icon: Coffee },
  { value: 'professional', label: 'Profesional', desc: 'Formal, con frameworks y KPIs', icon: Briefcase },
  { value: 'friendly', label: 'Amigable', desc: 'Cercana, empatica, motivadora', icon: Heart },
]

const APPROACH_OPTIONS: Array<{ value: Approach; label: string; desc: string; icon: React.ComponentType<{ className?: string }> }> = [
  { value: 'direct', label: 'Directo', desc: 'Respuestas cortas y al grano', icon: Target },
  { value: 'detailed', label: 'Detallado', desc: 'Analisis profundo con el por que', icon: BookOpen },
  { value: 'storytelling', label: 'Storytelling', desc: 'Analogias y ejemplos concretos', icon: MessageSquare },
]

const EXPERTISE_OPTIONS: Array<{ value: Expertise; label: string; desc: string }> = [
  { value: 'beginner', label: 'Principiante', desc: 'Explica todo desde cero' },
  { value: 'intermediate', label: 'Intermedio', desc: 'Conocimiento basico de negocios' },
  { value: 'expert', label: 'Avanzado', desc: 'Terminologia y tacticas avanzadas' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)

  // Step 1: Personal
  const [name, setName] = useState('')
  const [gender, setGender] = useState<string>('')

  // Step 2: Tone
  const [toneConfig, setToneConfig] = useState<ToneConfig>({
    style: 'friendly', approach: 'detailed', expertise: 'intermediate', askQuestions: true,
  })

  // Step 3: Business
  const [businessName, setBusinessName] = useState('')
  const [productsServices, setProductsServices] = useState('')
  const [targetAudience, setTargetAudience] = useState('')

  useEffect(() => {
    // Check auth
    supabase.auth.getUser().then(({ data: { user: authUser } }: { data: { user: { id: string; user_metadata?: Record<string, string> } | null } }) => {
      if (!authUser) {
        router.push('/hanna/login')
        return
      }
      const fullName = authUser.user_metadata?.full_name
      if (fullName) setName(fullName)
    })
  }, [supabase, router])

  const totalSteps = 4

  const handleNext = () => {
    if (step < totalSteps - 1) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 0) setStep(step - 1)
  }

  const handleSkip = async () => {
    hannaEvents.onboardingSkipped(step)
    await finishOnboarding()
  }

  const handleQuickAction = async (enrichedPrompt: string) => {
    await finishOnboarding(`?firstPrompt=${encodeURIComponent(enrichedPrompt)}`)
  }

  const finishOnboarding = async (queryParams = '') => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Save tone config
      await supabase.auth.updateUser({
        data: {
          tone_config: toneConfig,
          onboarding_completed: true,
        }
      })
      localStorage.setItem(`hanna-tone-${user.id}`, JSON.stringify(toneConfig))

      // Save business profile if provided
      if (name || businessName || productsServices || targetAudience) {
        const profileData: Record<string, string> = {}
        if (name) profileData.display_name = name
        if (gender) profileData.gender = gender
        if (businessName) profileData.business_name = businessName
        if (productsServices) profileData.products_services = productsServices
        if (targetAudience) profileData.target_audience = targetAudience

        // Upsert business profile
        const { error } = await supabase
          .from('hanna_business_profiles')
          .upsert({ user_id: user.id, ...profileData }, { onConflict: 'user_id' })

        if (error) console.error('Profile save error:', error)
      }

      hannaEvents.onboardingCompleted()
      router.push(`/hanna/dashboard${queryParams}`)
    } catch (err) {
      console.error('Onboarding finish error:', err)
      router.push('/hanna/dashboard')
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#022133] via-[#0a2e47] to-[#200F5D] flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-8">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                i <= step ? 'bg-gradient-to-r from-[#2CB6D7] to-[#C7517E]' : 'bg-white/10'
              }`}
            />
          ))}
        </div>

        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-8">
          {/* Step 0: Welcome + Personal */}
          {step === 0 && (
            <div className="space-y-6">
              <div className="text-center">
                <Image
                  src="/images/sinsajo-logo-1.png"
                  alt="Hanna"
                  width={60}
                  height={60}
                  className="mx-auto mb-4"
                />
                <h2 className="text-2xl font-bold text-white mb-2">Bienvenida a Hanna</h2>
                <p className="text-white/60">Tu consultora estrategica de negocios con IA</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-white/60 mb-1.5 block">Tu nombre</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Como te llamas?"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-[#2CB6D7]/50 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="text-sm text-white/60 mb-2 block">Genero (para personalizar el lenguaje)</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'female', label: 'Mujer' },
                      { value: 'male', label: 'Hombre' },
                      { value: 'non_binary', label: 'Otro' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setGender(option.value)}
                        className={`px-3 py-2.5 rounded-xl border text-sm transition-all ${
                          gender === option.value
                            ? 'bg-[#2CB6D7]/20 border-[#2CB6D7]/50 text-white'
                            : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Tone */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">Como quieres que Hanna te hable?</h2>
                <p className="text-white/60">Puedes cambiarlo despues en configuracion</p>
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider text-white/40 mb-3 block">Estilo</label>
                <div className="grid grid-cols-2 gap-3">
                  {TONE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setToneConfig({ ...toneConfig, style: opt.value })}
                      className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                        toneConfig.style === opt.value
                          ? 'bg-[#2CB6D7]/20 border-[#2CB6D7]/50'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <opt.icon className={`w-5 h-5 ${toneConfig.style === opt.value ? 'text-[#2CB6D7]' : 'text-white/40'}`} />
                      <div>
                        <div className="text-sm font-medium text-white">{opt.label}</div>
                        <div className="text-xs text-white/40">{opt.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider text-white/40 mb-3 block">Enfoque</label>
                <div className="grid grid-cols-3 gap-3">
                  {APPROACH_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setToneConfig({ ...toneConfig, approach: opt.value })}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        toneConfig.approach === opt.value
                          ? 'bg-[#2CB6D7]/20 border-[#2CB6D7]/50'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className="text-sm font-medium text-white">{opt.label}</div>
                      <div className="text-xs text-white/40 mt-1">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider text-white/40 mb-3 block">Nivel</label>
                <div className="grid grid-cols-3 gap-3">
                  {EXPERTISE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setToneConfig({ ...toneConfig, expertise: opt.value })}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        toneConfig.expertise === opt.value
                          ? 'bg-[#2CB6D7]/20 border-[#2CB6D7]/50'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className="text-sm font-medium text-white">{opt.label}</div>
                      <div className="text-xs text-white/40 mt-1">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={toneConfig.askQuestions}
                  onChange={(e) => setToneConfig({ ...toneConfig, askQuestions: e.target.checked })}
                  className="w-4 h-4 rounded accent-[#2CB6D7]"
                />
                <div>
                  <div className="text-sm font-medium text-white">Modo Consultora Estrategica</div>
                  <div className="text-xs text-white/40">Hanna hace preguntas antes de aconsejar (recomendado)</div>
                </div>
              </label>
            </div>
          )}

          {/* Step 2: Business */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">Cuentale a Hanna de tu negocio</h2>
                <p className="text-white/60">Esto hace que sus consejos sean mucho mas relevantes</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-white/60 mb-1.5 block">Nombre de tu negocio</label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Ej: Bella Boutique, Coach Maria, etc."
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-[#2CB6D7]/50 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="text-sm text-white/60 mb-1.5 block">Que vendes?</label>
                  <textarea
                    value={productsServices}
                    onChange={(e) => setProductsServices(e.target.value)}
                    placeholder="Ej: Ropa de mujer, coaching de vida, cursos de marketing..."
                    rows={2}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-[#2CB6D7]/50 focus:outline-none transition-colors resize-none"
                  />
                </div>

                <div>
                  <label className="text-sm text-white/60 mb-1.5 block">A quien le vendes?</label>
                  <textarea
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="Ej: Mujeres emprendedoras de 25-45 anos en Latinoamerica..."
                    rows={2}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-[#2CB6D7]/50 focus:outline-none transition-colors resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: First Quick Win */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <Sparkles className="w-8 h-8 text-[#2CB6D7] mx-auto mb-3" />
                <h2 className="text-2xl font-bold text-white mb-2">Tu primera accion con Hanna</h2>
                <p className="text-white/60">Selecciona algo y ve a Hanna en accion</p>
              </div>

              <QuickActions
                plan="free"
                businessProfile={{
                  business_name: businessName,
                  target_audience: targetAudience,
                  products_services: productsServices,
                }}
                onSelectAction={handleQuickAction}
                compact={false}
              />

              <button
                onClick={() => finishOnboarding()}
                className="w-full text-center text-sm text-white/40 hover:text-white/60 transition-colors"
              >
                Ir al dashboard sin accion
              </button>
            </div>
          )}

          {/* Navigation */}
          {step < 3 && (
            <div className="flex items-center justify-between mt-8">
              <button
                onClick={step === 0 ? handleSkip : handleBack}
                className="flex items-center gap-2 text-sm text-white/40 hover:text-white/60 transition-colors"
              >
                {step === 0 ? (
                  <>
                    <SkipForward className="w-4 h-4" />
                    Omitir
                  </>
                ) : (
                  <>
                    <ArrowLeft className="w-4 h-4" />
                    Atras
                  </>
                )}
              </button>

              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#C7517E] to-[#b8456f] text-white font-medium rounded-xl hover:from-[#d4608d] hover:to-[#C7517E] transition-all"
              >
                Continuar
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Step indicator */}
        <p className="text-center text-white/30 text-xs mt-4">
          Paso {step + 1} de {totalSteps}
        </p>
      </div>
    </main>
  )
}
