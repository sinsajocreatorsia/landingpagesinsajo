'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronRight,
  ChevronLeft,
  Building2,
  Target,
  Sparkles,
  CheckCircle,
  Loader2,
  Users,
  Clock,
  TrendingUp,
  MessageCircle,
} from 'lucide-react'
import confetti from 'canvas-confetti'

interface OnboardingFormProps {
  registrationId: string
  onComplete?: () => void
  apiEndpoint?: string
  idFieldName?: string
}

interface FormData {
  businessName: string
  businessType: string
  industry: string
  industryOther: string
  yearsInBusiness: string
  monthlyRevenue: string
  teamSize: string
  challenges: string[]
  challengeOther: string
  primaryGoal: string
  expectedOutcome: string
  currentTools: string[]
  aiExperience: string
  communicationPreference: string
  bestContactTime: string
}

const STEPS = [
  { id: 1, title: 'Tu Negocio', icon: Building2 },
  { id: 2, title: 'Desafíos', icon: Target },
  { id: 3, title: 'Objetivos', icon: Sparkles },
  { id: 4, title: 'Preferencias', icon: MessageCircle },
]

const CHALLENGES = [
  { id: 'time_management', label: 'Gestión del tiempo', emoji: '⏰' },
  { id: 'lead_generation', label: 'Generación de leads', emoji: '🎯' },
  { id: 'customer_service', label: 'Servicio al cliente', emoji: '💬' },
  { id: 'content_creation', label: 'Creación de contenido', emoji: '✍️' },
  { id: 'sales_closing', label: 'Cierre de ventas', emoji: '💰' },
  { id: 'team_management', label: 'Gestión de equipo', emoji: '👥' },
  { id: 'scaling', label: 'Escalar operaciones', emoji: '📈' },
  { id: 'automation', label: 'Automatización', emoji: '🤖' },
  { id: 'other', label: 'Otro desafío', emoji: '➕' },
]

const INDUSTRIES = [
  'Consultoría / Coaching',
  'Marketing / Publicidad',
  'E-commerce',
  'Servicios Profesionales',
  'Salud / Bienestar',
  'Educación / Formación',
  'Moda / Belleza',
  'Tecnología',
  'Real Estate',
  'Otro',
]

const CURRENT_TOOLS = [
  { id: 'chatgpt', label: 'ChatGPT' },
  { id: 'canva', label: 'Canva' },
  { id: 'notion', label: 'Notion' },
  { id: 'zapier', label: 'Zapier' },
  { id: 'calendly', label: 'Calendly' },
  { id: 'mailchimp', label: 'Mailchimp/Email Marketing' },
  { id: 'crm', label: 'CRM (Salesforce, HubSpot)' },
  { id: 'none', label: 'Ninguna herramienta IA' },
]

export default function OnboardingForm({
  registrationId,
  onComplete,
  apiEndpoint = '/api/workshop/profile',
  idFieldName = 'registrationId',
}: OnboardingFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    businessType: '',
    industry: '',
    industryOther: '',
    yearsInBusiness: '',
    monthlyRevenue: '',
    teamSize: '',
    challenges: [],
    challengeOther: '',
    primaryGoal: '',
    expectedOutcome: '',
    currentTools: [],
    aiExperience: '',
    communicationPreference: '',
    bestContactTime: '',
  })

  const updateFormData = (field: keyof FormData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleChallenge = (challengeId: string) => {
    setFormData((prev) => ({
      ...prev,
      challenges: prev.challenges.includes(challengeId)
        ? prev.challenges.filter((c) => c !== challengeId)
        : [...prev.challenges, challengeId],
    }))
  }

  const toggleTool = (toolId: string) => {
    setFormData((prev) => ({
      ...prev,
      currentTools: prev.currentTools.includes(toolId)
        ? prev.currentTools.filter((t) => t !== toolId)
        : [...prev.currentTools, toolId],
    }))
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        // If "Otro" is selected, require the custom industry text
        if (formData.industry === 'Otro') {
          return formData.businessName && formData.industryOther.trim()
        }
        return formData.businessName && formData.industry
      case 2:
        // If "other" is selected, require the custom challenge text
        if (formData.challenges.includes('other')) {
          return formData.challenges.length > 0 && formData.challengeOther.trim()
        }
        return formData.challenges.length > 0
      case 3:
        return formData.primaryGoal
      case 4:
        return formData.communicationPreference
      default:
        return true
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [idFieldName]: registrationId,
          ...formData,
        }),
      })

      if (response.ok) {
        setIsCompleted(true)
        // Trigger confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#2CB6D7', '#C7517E', '#36B3AE', '#F59E0B'],
        })
        onComplete?.()
      }
    } catch (error) {
      console.error('Error submitting profile:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1)
    } else {
      handleSubmit()
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  if (isCompleted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="w-20 h-20 bg-gradient-to-r from-[#36B3AE] to-[#2CB6D7] rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="w-10 h-10 text-white" />
        </motion.div>
        <h3 className="text-2xl font-bold text-[#022133] mb-2">
          ¡Perfil Completado!
        </h3>
        <p className="text-[#022133]/70">
          Gracias por compartir esta información. Personalizaremos tu experiencia en el workshop.
        </p>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex justify-between items-center mb-8">
        {STEPS.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <motion.div
              initial={false}
              animate={{
                backgroundColor: currentStep >= step.id ? '#2CB6D7' : '#E5E7EB',
                scale: currentStep === step.id ? 1.1 : 1,
              }}
              className="w-10 h-10 rounded-full flex items-center justify-center"
            >
              <step.icon
                className={`w-5 h-5 ${
                  currentStep >= step.id ? 'text-white' : 'text-gray-400'
                }`}
              />
            </motion.div>
            {index < STEPS.length - 1 && (
              <div
                className={`w-12 md:w-20 h-1 mx-2 rounded ${
                  currentStep > step.id ? 'bg-[#2CB6D7]' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Title */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-[#022133]">
          {STEPS[currentStep - 1].title}
        </h3>
        <p className="text-[#022133]/60 text-sm">
          Paso {currentStep} de {STEPS.length}
        </p>
      </div>

      {/* Form Steps */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          {/* Step 1: Business Info */}
          {currentStep === 1 && (
            <>
              <div>
                <label className="block text-sm font-medium text-[#022133] mb-2">
                  Nombre de tu negocio/empresa *
                </label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => updateFormData('businessName', e.target.value)}
                  placeholder="Ej: María García Coaching"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#2CB6D7] outline-none transition-all bg-white text-[#022133] placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#022133] mb-2">
                  Industria *
                </label>
                <select
                  value={formData.industry}
                  onChange={(e) => {
                    updateFormData('industry', e.target.value)
                    // Clear the custom field if not "Otro"
                    if (e.target.value !== 'Otro') {
                      updateFormData('industryOther', '')
                    }
                  }}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#2CB6D7] outline-none transition-all bg-white text-[#022133]"
                >
                  <option value="">Selecciona tu industria</option>
                  {INDUSTRIES.map((ind) => (
                    <option key={ind} value={ind}>
                      {ind}
                    </option>
                  ))}
                </select>
              </div>

              {/* Show text input when "Otro" is selected */}
              {formData.industry === 'Otro' && (
                <div className="animate-fade-in">
                  <label className="block text-sm font-medium text-[#022133] mb-2">
                    Describe tu industria *
                  </label>
                  <input
                    type="text"
                    value={formData.industryOther}
                    onChange={(e) => updateFormData('industryOther', e.target.value)}
                    placeholder="Ej: Agricultura orgánica, Manufactura textil, etc."
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#2CB6D7] outline-none transition-all bg-white text-[#022133] placeholder:text-gray-400"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#022133] mb-2">
                    Años en el negocio
                  </label>
                  <select
                    value={formData.yearsInBusiness}
                    onChange={(e) => updateFormData('yearsInBusiness', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#2CB6D7] outline-none transition-all bg-white text-[#022133]"
                  >
                    <option value="">Selecciona</option>
                    <option value="<1">Menos de 1 año</option>
                    <option value="1-3">1-3 años</option>
                    <option value="3-5">3-5 años</option>
                    <option value="5-10">5-10 años</option>
                    <option value="10+">Más de 10 años</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#022133] mb-2">
                    Tamaño del equipo
                  </label>
                  <select
                    value={formData.teamSize}
                    onChange={(e) => updateFormData('teamSize', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#2CB6D7] outline-none transition-all bg-white text-[#022133]"
                  >
                    <option value="">Selecciona</option>
                    <option value="solo">Solo yo</option>
                    <option value="2-5">2-5 personas</option>
                    <option value="6-10">6-10 personas</option>
                    <option value="11-20">11-20 personas</option>
                    <option value="20+">Más de 20</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Step 2: Challenges */}
          {currentStep === 2 && (
            <>
              <p className="text-sm text-[#022133]/70 mb-4">
                Selecciona los principales desafíos que enfrentas en tu negocio (puedes seleccionar varios):
              </p>
              <div className="grid grid-cols-2 gap-3">
                {CHALLENGES.map((challenge) => (
                  <motion.button
                    key={challenge.id}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleChallenge(challenge.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      formData.challenges.includes(challenge.id)
                        ? 'border-[#2CB6D7] bg-[#2CB6D7]/10'
                        : 'border-gray-200 hover:border-[#2CB6D7]/50'
                    }`}
                  >
                    <span className="text-xl mb-1 block">{challenge.emoji}</span>
                    <span className="text-sm font-medium text-[#022133]">
                      {challenge.label}
                    </span>
                  </motion.button>
                ))}
              </div>

              {/* Show text input when "Otro" is selected */}
              {formData.challenges.includes('other') && (
                <div className="mt-4 animate-fade-in">
                  <label className="block text-sm font-medium text-[#022133] mb-2">
                    Describe tu desafío *
                  </label>
                  <input
                    type="text"
                    value={formData.challengeOther}
                    onChange={(e) => updateFormData('challengeOther', e.target.value)}
                    placeholder="Ej: Integración de sistemas, Retención de clientes, etc."
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#2CB6D7] outline-none transition-all bg-white text-[#022133] placeholder:text-gray-400"
                  />
                </div>
              )}
            </>
          )}

          {/* Step 3: Goals */}
          {currentStep === 3 && (
            <>
              <div>
                <label className="block text-sm font-medium text-[#022133] mb-2">
                  ¿Cuál es tu objetivo principal con este workshop? *
                </label>
                <textarea
                  value={formData.primaryGoal}
                  onChange={(e) => updateFormData('primaryGoal', e.target.value)}
                  placeholder="Ej: Quiero automatizar mi atención al cliente y liberar tiempo para enfocarme en estrategia..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#2CB6D7] outline-none transition-all resize-none bg-white text-[#022133] placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#022133] mb-2">
                  ¿Qué herramientas de IA usas actualmente?
                </label>
                <div className="flex flex-wrap gap-2">
                  {CURRENT_TOOLS.map((tool) => (
                    <button
                      key={tool.id}
                      type="button"
                      onClick={() => toggleTool(tool.id)}
                      className={`px-3 py-2 rounded-lg text-sm transition-all ${
                        formData.currentTools.includes(tool.id)
                          ? 'bg-[#2CB6D7] text-white'
                          : 'bg-gray-100 text-[#022133] hover:bg-gray-200'
                      }`}
                    >
                      {tool.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#022133] mb-2">
                  Tu experiencia con IA
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'none', label: 'Ninguna' },
                    { value: 'basic', label: 'Básica' },
                    { value: 'intermediate', label: 'Intermedia' },
                    { value: 'advanced', label: 'Avanzada' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => updateFormData('aiExperience', opt.value)}
                      className={`px-4 py-2 rounded-lg text-sm transition-all ${
                        formData.aiExperience === opt.value
                          ? 'bg-[#2CB6D7] text-white'
                          : 'bg-gray-100 text-[#022133] hover:bg-gray-200'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Step 4: Communication Preferences */}
          {currentStep === 4 && (
            <>
              <div>
                <label className="block text-sm font-medium text-[#022133] mb-2">
                  ¿Cómo prefieres que te contactemos? *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { value: 'email', label: 'Email', icon: '📧' },
                    { value: 'whatsapp', label: 'WhatsApp', icon: '💬' },
                    { value: 'phone', label: 'Teléfono', icon: '📞' },
                    { value: 'both', label: 'Todos', icon: '✅' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => updateFormData('communicationPreference', opt.value)}
                      className={`p-4 rounded-xl border-2 text-center transition-all ${
                        formData.communicationPreference === opt.value
                          ? 'border-[#2CB6D7] bg-[#2CB6D7]/10'
                          : 'border-gray-200 hover:border-[#2CB6D7]/50'
                      }`}
                    >
                      <span className="text-2xl block mb-1">{opt.icon}</span>
                      <span className="text-sm font-medium text-[#022133]">
                        {opt.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#022133] mb-2">
                  Mejor horario para contactarte
                </label>
                <select
                  value={formData.bestContactTime}
                  onChange={(e) => updateFormData('bestContactTime', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#2CB6D7] outline-none transition-all bg-white text-[#022133]"
                >
                  <option value="">Selecciona un horario</option>
                  <option value="morning">Mañana (8am - 12pm)</option>
                  <option value="afternoon">Tarde (12pm - 5pm)</option>
                  <option value="evening">Noche (5pm - 9pm)</option>
                  <option value="anytime">Cualquier momento</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#022133] mb-2">
                  ¿Qué esperas lograr en 30 días después del workshop? (opcional)
                </label>
                <textarea
                  value={formData.expectedOutcome}
                  onChange={(e) => updateFormData('expectedOutcome', e.target.value)}
                  placeholder="Ej: Tener mi asistente IA funcionando, automatizar mis respuestas..."
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#2CB6D7] outline-none transition-all resize-none bg-white text-[#022133] placeholder:text-gray-400"
                />
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={prevStep}
          disabled={currentStep === 1}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            currentStep === 1
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-[#022133] hover:bg-gray-100'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
          Anterior
        </button>

        <button
          type="button"
          onClick={nextStep}
          disabled={!canProceed() || isSubmitting}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all ${
            canProceed() && !isSubmitting
              ? 'bg-gradient-to-r from-[#C7517E] to-[#b8456f] text-white hover:from-[#d4608d] hover:to-[#C7517E]'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Guardando...
            </>
          ) : currentStep === STEPS.length ? (
            <>
              Completar
              <CheckCircle className="w-5 h-5" />
            </>
          ) : (
            <>
              Siguiente
              <ChevronRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  )
}
