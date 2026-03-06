'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Star,
  ArrowRight,
  ArrowLeft,
  Send,
  Check,
  ExternalLink,
  Loader2,
} from 'lucide-react'
import type {
  SurveyFormData,
  SurveySubmitResponse,
  LikedOption,
  ImprovementOption,
  FutureTopicOption,
  CommunityValueOption,
  PlatformOption,
} from '@/types/survey'
import {
  LIKED_OPTIONS,
  IMPROVEMENT_OPTIONS,
  FUTURE_TOPIC_OPTIONS,
  COMMUNITY_VALUE_OPTIONS,
  PLATFORM_OPTIONS,
} from '@/types/survey'

const TOTAL_STEPS = 4

const initialFormData: SurveyFormData = {
  overallRating: 0,
  likedMost: [],
  improvements: [],
  suggestions: '',
  futureTopics: [],
  futureTopicsOther: '',
  continuingInterest: 0,
  npsScore: -1,
  communityInterest: '',
  communityValues: [],
  preferredPlatform: '',
  email: '',
  fullName: '',
  googleRating: 0,
}

export default function SurveyPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<SurveyFormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<SurveySubmitResponse | null>(null)
  const [error, setError] = useState('')

  const [direction, setDirection] = useState(1)

  function updateField<K extends keyof SurveyFormData>(key: K, value: SurveyFormData[K]) {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  function toggleArrayField<T extends string>(key: keyof SurveyFormData, value: T) {
    setFormData((prev) => {
      const arr = prev[key] as T[]
      const next = arr.includes(value)
        ? arr.filter((v) => v !== value)
        : [...arr, value]
      return { ...prev, [key]: next }
    })
  }

  function validateStep(): string | null {
    switch (step) {
      case 1:
        if (formData.overallRating === 0) return 'Por favor selecciona una calificacion general'
        return null
      case 2:
        if (formData.continuingInterest === 0) return 'Por favor indica tu interes en seguir formandote'
        if (formData.npsScore < 0) return 'Por favor indica si recomendarias el taller'
        return null
      case 3:
        if (!formData.communityInterest) return 'Por favor indica si te interesa la comunidad'
        return null
      case 4:
        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
          return 'Por favor ingresa un email valido'
        if (!formData.fullName.trim()) return 'Por favor ingresa tu nombre'
        if (formData.googleRating === 0) return 'Por favor califica a Sinsajo en Google'
        return null
      default:
        return null
    }
  }

  function nextStep() {
    const err = validateStep()
    if (err) {
      setError(err)
      return
    }
    setError('')
    setDirection(1)
    setStep((s) => Math.min(s + 1, TOTAL_STEPS))
  }

  function prevStep() {
    setError('')
    setDirection(-1)
    setStep((s) => Math.max(s - 1, 1))
  }

  async function handleSubmit() {
    const err = validateStep()
    if (err) {
      setError(err)
      return
    }
    setError('')
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/workshop/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data: SurveySubmitResponse = await res.json()

      if (!res.ok || !data.success) {
        setError(data.error || 'Error al enviar la encuesta')
        setIsSubmitting(false)
        return
      }

      setResult(data)

      // If 5 stars → redirect to Google Reviews immediately
      if (data.shouldRedirectToGoogle && data.googleReviewUrl) {
        window.open(data.googleReviewUrl, '_blank')
      }
    } catch {
      setError('Error de conexion. Intenta de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Completed state
  if (result) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#022133] to-[#200F5D] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg bg-[#FCFEFB] rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Success header */}
          <div className="bg-gradient-to-r from-[#36B3AE] to-[#2CB6D7] p-8 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Gracias, {formData.fullName}!</h2>
            <p className="text-white/90 mt-2">Tu feedback es muy valioso para nosotros</p>
          </div>

          <div className="p-8 space-y-6">
            {/* Email notice */}
            <div className="text-center">
              <div className="bg-orange-50 border border-[#C7517E]/30 rounded-xl p-6">
                <p className="text-gray-700 font-medium mb-2">
                  Revisa tu correo electronico
                </p>
                <p className="text-gray-500 text-sm">
                  Te enviamos tu codigo de descuento para activar tu primer mes 100% gratis de Hanna Estratega Pro.
                </p>
              </div>
            </div>

            {/* Google Review - only shows if 5 stars and redirected */}
            {result.shouldRedirectToGoogle && result.googleReviewUrl && (
              <div className="bg-blue-50 rounded-xl p-5 text-center border border-blue-100">
                <p className="text-gray-700 mb-3">
                  Se abrio una nueva pestana para dejar tu resena en Google.
                  Si no se abrio, haz click aqui:
                </p>
                <a
                  href={result.googleReviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Dejar resena en Google
                </a>
              </div>
            )}

            <p className="text-center text-sm text-gray-400">
              Gracias por compartir tu experiencia! Tu feedback nos ayuda a mejorar cada taller.
            </p>
          </div>
        </motion.div>
      </div>
    )
  }

  // Survey form
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#022133] to-[#200F5D] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Tu opinion nos importa
          </h1>
          <p className="text-white/70">
            Completa la encuesta y recibe 1 mes gratis de Hanna Estratega Pro
          </p>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-6">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <div key={i} className="flex-1">
              <div
                className={`h-2 rounded-full transition-colors ${
                  i + 1 <= step ? 'bg-[#2CB6D7]' : 'bg-white/20'
                }`}
              />
            </div>
          ))}
          <span className="text-white/60 text-sm ml-2">
            {step}/{TOTAL_STEPS}
          </span>
        </div>

        {/* Form card */}
        <div className="bg-[#FCFEFB] rounded-3xl shadow-2xl overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              initial={{ opacity: 0, x: direction * 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -50 }}
              transition={{ duration: 0.25 }}
              className="p-6 md:p-8"
            >
              {step === 1 && (
                <Step1Satisfaction
                  formData={formData}
                  updateField={updateField}
                  toggleArrayField={toggleArrayField}
                />
              )}
              {step === 2 && (
                <Step2FutureInterest
                  formData={formData}
                  updateField={updateField}
                  toggleArrayField={toggleArrayField}
                />
              )}
              {step === 3 && (
                <Step3Community
                  formData={formData}
                  updateField={updateField}
                  toggleArrayField={toggleArrayField}
                />
              )}
              {step === 4 && (
                <Step4Contact
                  formData={formData}
                  updateField={updateField}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Error message */}
          {error && (
            <div className="px-6 md:px-8 pb-2">
              <p className="text-red-500 text-sm text-center bg-red-50 rounded-lg py-2 px-4">
                {error}
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center p-6 md:p-8 pt-2 border-t border-gray-100">
            {step > 1 ? (
              <button
                onClick={prevStep}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Anterior
              </button>
            ) : (
              <div />
            )}

            {step < TOTAL_STEPS ? (
              <button
                onClick={nextStep}
                className="flex items-center gap-2 bg-[#2CB6D7] text-white font-semibold py-3 px-6 rounded-xl hover:bg-[#2CB6D7]/90 transition-colors"
              >
                Siguiente
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-gradient-to-r from-[#C7517E] to-[#2CB6D7] text-white font-semibold py-3 px-6 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Enviar Encuesta
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// STEP COMPONENTS
// ============================================================

interface StepProps {
  formData: SurveyFormData
  updateField: <K extends keyof SurveyFormData>(key: K, value: SurveyFormData[K]) => void
  toggleArrayField?: <T extends string>(key: keyof SurveyFormData, value: T) => void
}

function StarRating({
  value,
  onChange,
  count = 5,
  size = 'lg',
}: {
  value: number
  onChange: (v: number) => void
  count?: number
  size?: 'sm' | 'lg'
}) {
  const sizeClass = size === 'lg' ? 'w-10 h-10' : 'w-7 h-7'
  return (
    <div className="flex gap-1">
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i + 1)}
          className="transition-transform hover:scale-110"
        >
          <Star
            className={`${sizeClass} ${
              i < value
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            } transition-colors`}
          />
        </button>
      ))}
    </div>
  )
}

function CheckboxGroup<T extends string>({
  options,
  selected,
  onToggle,
}: {
  options: { value: T; label: string }[]
  selected: T[]
  onToggle: (value: T) => void
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {options.map((opt) => {
        const isSelected = selected.includes(opt.value)
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onToggle(opt.value)}
            className={`text-left px-4 py-3 rounded-xl border-2 transition-all text-sm ${
              isSelected
                ? 'border-[#2CB6D7] bg-[#2CB6D7]/10 text-[#022133]'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
            }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

// Step 1: Satisfaction
function Step1Satisfaction({ formData, updateField, toggleArrayField }: StepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#022133] mb-1">Satisfaccion General</h2>
        <p className="text-gray-500 text-sm">Cuentanos como fue tu experiencia en el taller</p>
      </div>

      {/* Overall rating */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Calificacion general del taller *
        </label>
        <StarRating
          value={formData.overallRating}
          onChange={(v) => updateField('overallRating', v)}
        />
      </div>

      {/* What they liked */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Que fue lo que mas te gusto? (selecciona todas las que apliquen)
        </label>
        <CheckboxGroup<LikedOption>
          options={LIKED_OPTIONS}
          selected={formData.likedMost}
          onToggle={(v) => toggleArrayField!('likedMost', v)}
        />
      </div>

      {/* Improvements */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Que podriamos mejorar? (selecciona todas las que apliquen)
        </label>
        <CheckboxGroup<ImprovementOption>
          options={IMPROVEMENT_OPTIONS}
          selected={formData.improvements}
          onToggle={(v) => toggleArrayField!('improvements', v)}
        />
      </div>

      {/* Suggestions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sugerencias adicionales (opcional)
        </label>
        <textarea
          value={formData.suggestions}
          onChange={(e) => updateField('suggestions', e.target.value)}
          rows={3}
          placeholder="Comparte tus sugerencias..."
          className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm text-gray-900 focus:border-[#2CB6D7] focus:outline-none transition-colors resize-none"
        />
      </div>
    </div>
  )
}

// Step 2: Future Interest
function Step2FutureInterest({ formData, updateField, toggleArrayField }: StepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#022133] mb-1">Interes Futuro</h2>
        <p className="text-gray-500 text-sm">Ayudanos a crear los talleres que necesitas</p>
      </div>

      {/* Future topics */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Que temas te interesarian para futuros talleres?
        </label>
        <CheckboxGroup<FutureTopicOption>
          options={FUTURE_TOPIC_OPTIONS}
          selected={formData.futureTopics}
          onToggle={(v) => toggleArrayField!('futureTopics', v)}
        />
        {formData.futureTopics.includes('other') && (
          <input
            type="text"
            value={formData.futureTopicsOther}
            onChange={(e) => updateField('futureTopicsOther', e.target.value)}
            placeholder="Especifica el tema..."
            className="mt-2 w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm text-gray-900 focus:border-[#2CB6D7] focus:outline-none transition-colors"
          />
        )}
      </div>

      {/* Continuing interest scale */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Que tan interesada estas en seguir formandote en IA? *
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => updateField('continuingInterest', v)}
              className={`flex-1 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                formData.continuingInterest === v
                  ? 'border-[#2CB6D7] bg-[#2CB6D7] text-white'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1 px-1">
          <span>Poco interesada</span>
          <span>Muy interesada</span>
        </div>
      </div>

      {/* NPS */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Del 0 al 10, recomendarias este taller a una amiga o colega? *
        </label>
        <div className="grid grid-cols-11 gap-1">
          {Array.from({ length: 11 }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => updateField('npsScore', i)}
              className={`py-2.5 rounded-lg border text-xs font-medium transition-all ${
                formData.npsScore === i
                  ? i >= 9
                    ? 'border-green-500 bg-green-500 text-white'
                    : i >= 7
                    ? 'border-yellow-500 bg-yellow-500 text-white'
                    : 'border-red-400 bg-red-400 text-white'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300'
              }`}
            >
              {i}
            </button>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1 px-1">
          <span>Nada probable</span>
          <span>Muy probable</span>
        </div>
      </div>
    </div>
  )
}

// Step 3: Community
function Step3Community({ formData, updateField, toggleArrayField }: StepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#022133] mb-1">Comunidad Virtual</h2>
        <p className="text-gray-500 text-sm">Estamos creando una comunidad de formacion en IA</p>
      </div>

      {/* Community interest */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Te interesaria unirte a una comunidad virtual de formacion en IA? *
        </label>
        <div className="flex gap-3">
          {[
            { value: 'yes' as const, label: 'Si, me interesa' },
            { value: 'maybe' as const, label: 'Tal vez' },
            { value: 'no' as const, label: 'No por ahora' },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => updateField('communityInterest', opt.value)}
              className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all ${
                formData.communityInterest === opt.value
                  ? 'border-[#2CB6D7] bg-[#2CB6D7]/10 text-[#022133]'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Community values */}
      {formData.communityInterest !== 'no' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Que es lo que mas valorarias en una comunidad?
          </label>
          <CheckboxGroup<CommunityValueOption>
            options={COMMUNITY_VALUE_OPTIONS}
            selected={formData.communityValues}
            onToggle={(v) => toggleArrayField!('communityValues', v)}
          />
        </div>
      )}

      {/* Preferred platform */}
      {formData.communityInterest !== 'no' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Que plataforma prefieres?
          </label>
          <div className="grid grid-cols-2 gap-2">
            {PLATFORM_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => updateField('preferredPlatform', opt.value as PlatformOption)}
                className={`py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all ${
                  formData.preferredPlatform === opt.value
                    ? 'border-[#2CB6D7] bg-[#2CB6D7]/10 text-[#022133]'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Step 4: Contact + Google Review
function Step4Contact({ formData, updateField }: StepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#022133] mb-1">Tus Datos y Resena</h2>
        <p className="text-gray-500 text-sm">Para enviarte tu codigo de 1 mes gratis</p>
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nombre completo *
        </label>
        <input
          type="text"
          value={formData.fullName}
          onChange={(e) => updateField('fullName', e.target.value)}
          placeholder="Tu nombre"
          className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm text-gray-900 focus:border-[#2CB6D7] focus:outline-none transition-colors"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email *
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => updateField('email', e.target.value)}
          placeholder="tu@email.com"
          className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm text-gray-900 focus:border-[#2CB6D7] focus:outline-none transition-colors"
        />
        <p className="text-xs text-gray-400 mt-1">
          Aqui te enviaremos tu codigo de descuento
        </p>
      </div>

      {/* Google rating */}
      <div className="bg-gray-50 rounded-xl p-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Como calificarias a Sinsajo Creators en Google? *
        </label>
        <div className="flex justify-center">
          <StarRating
            value={formData.googleRating}
            onChange={(v) => updateField('googleRating', v)}
          />
        </div>
        <p className="text-xs text-gray-400 text-center mt-2">
          {formData.googleRating === 5
            ? 'Excelente! Te invitaremos a dejar tu resena en Google'
            : formData.googleRating > 0
            ? 'Gracias por tu calificacion!'
            : 'Selecciona de 1 a 5 estrellas'}
        </p>
      </div>
    </div>
  )
}
