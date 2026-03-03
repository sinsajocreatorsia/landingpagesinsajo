'use client'

import { useState, useEffect, useRef } from 'react'
import { Check, Shield, Users, Video, FileText, MessageCircle, Gift, Sparkles, Loader2, Mail, CheckCircle } from 'lucide-react'
import OnboardingForm from './OnboardingForm'

export default function WorkshopPricing() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [position, setPosition] = useState(0)
  const [waitlistId, setWaitlistId] = useState<string | null>(null)
  const [showProfile, setShowProfile] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in')
          }
        })
      },
      { threshold: 0.1 }
    )

    const elements = sectionRef.current?.querySelectorAll('.animate-on-scroll')
    elements?.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  const handleWaitlistSubmit = async () => {
    if (!name.trim()) {
      setError('Por favor ingresa tu nombre')
      return
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Por favor ingresa un email válido')
      return
    }
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/workshop/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, phone }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Error al registrar. Intenta de nuevo.')
        return
      }

      setSuccess(true)
      setPosition(data.position || 1)
      setWaitlistId(data.waitlistId || null)
    } catch {
      setError('Error de conexión. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const benefits = [
    { icon: Video, text: 'Acceso al workshop en vivo (3 horas)' },
    { icon: FileText, text: 'Workbook digital + Manual de Prompts' },
    { icon: Users, text: 'Grupo privado de WhatsApp con las estudiantes' },
    { icon: MessageCircle, text: 'Sesión Q&A en vivo con Giovanna' },
    { icon: Gift, text: 'Clon Asistente personalizado' },
    { icon: Sparkles, text: 'Plantillas de automatización listas para usar' },
  ]

  return (
    <section
      ref={sectionRef}
      id="pricing"
      className="py-12 bg-gradient-to-br from-[#022133] to-[#200F5D] relative overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-[#C7517E] rounded-full blur-[150px] opacity-20 animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#2CB6D7] rounded-full blur-[180px] opacity-15 animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 animate-on-scroll transition-all duration-700">
          <span className="inline-block bg-[#C7517E]/20 text-[#C7517E] font-semibold px-4 py-2 rounded-full text-sm mb-4">
            LISTA DE ESPERA
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#FCFEFB] mb-4">
            Próximo Workshop
          </h2>
          <p className="text-xl text-[#FCFEFB]/70">
            La primera edición se llenó en tiempo récord. Sé la primera en enterarte del próximo.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="animate-on-scroll transition-all duration-700 delay-200 bg-[#FCFEFB] rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
          {/* Decorative corner */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#2CB6D7]/10 to-transparent rounded-bl-full" />

          {/* SOLD OUT badge */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2 bg-[#022133] border-2 border-[#022133] rounded-full px-5 py-2.5 shadow-lg">
              <span className="text-white font-bold text-sm tracking-wide">
                CUPOS AGOTADOS — 12/12
              </span>
            </div>
          </div>

          {/* Price reference */}
          <div className="text-center mb-8">
            <div className="mb-3">
              <span className="inline-flex items-center gap-2 bg-[#2CB6D7]/10 border border-[#2CB6D7]/30 text-[#2CB6D7] rounded-full px-4 py-1.5 text-sm font-bold">
                Precio de la primera edición
              </span>
            </div>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-5xl md:text-6xl font-bold text-[#022133]/30 line-through">$100</span>
              <span className="text-xl text-[#022133]/40">USD</span>
            </div>
            <p className="text-[#022133]/60 mt-2">
              Regístrate en la lista de espera para recibir un precio especial para la próxima edición.
            </p>
          </div>

          {/* Benefits */}
          <div className="grid md:grid-cols-2 gap-4 mb-10">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-gradient-to-r from-[#2CB6D7]/5 to-transparent rounded-lg hover:from-[#2CB6D7]/10 transition-all group"
              >
                <div className="w-10 h-10 bg-[#2CB6D7]/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <benefit.icon className="w-5 h-5 text-[#2CB6D7]" />
                </div>
                <span className="text-[#022133]">{benefit.text}</span>
              </div>
            ))}
          </div>

          {/* Waitlist Form or Success Message */}
          {success ? (
            <div className="py-6 px-4">
              {!showProfile ? (
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#022133] mb-2">
                    ¡Estás en la lista!
                  </h3>
                  <p className="text-[#022133]/70 text-lg mb-2">
                    Tu posición: <span className="font-bold text-[#C7517E]">#{position}</span>
                  </p>
                  <p className="text-[#022133]/60 mb-6">
                    Te enviaremos un email de confirmación y te notificaremos cuando abramos las inscripciones para el próximo workshop.
                  </p>

                  {/* CTA to fill profile */}
                  {waitlistId && (
                    <div className="bg-gradient-to-r from-[#C7517E]/10 to-[#2CB6D7]/10 rounded-2xl p-6 mt-4">
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <Gift className="w-5 h-5 text-[#C7517E]" />
                        <span className="text-[#C7517E] font-semibold text-sm">Bonus: Personaliza tu experiencia</span>
                      </div>
                      <p className="text-[#022133]/70 text-sm mb-4">
                        Completa un breve cuestionario (2 min) para que Hanna, nuestra IA, pueda personalizar el próximo workshop a tus necesidades.
                      </p>
                      <button
                        onClick={() => setShowProfile(true)}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C7517E] to-[#b8456f] hover:from-[#d4608d] hover:to-[#C7517E] text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-[#C7517E]/30 hover:shadow-xl transform hover:scale-105"
                      >
                        <Sparkles className="w-5 h-5" />
                        Completar Mi Perfil
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div className="border-b border-gray-200 pb-4 mb-6">
                    <h3 className="text-xl font-bold text-[#022133] text-center mb-1">
                      Cuéntanos sobre tu negocio
                    </h3>
                    <p className="text-[#022133]/60 text-center text-sm">
                      Esta información nos ayudará a adaptar el workshop a tus necesidades
                    </p>
                  </div>
                  <OnboardingForm
                    registrationId={waitlistId!}
                    onComplete={() => {}}
                    apiEndpoint="/api/workshop/waitlist/profile"
                    idFieldName="waitlistId"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Error message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Form fields */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="waitlist-name" className="block text-sm font-medium text-[#022133] mb-1">
                      Tu nombre completo *
                    </label>
                    <input
                      id="waitlist-name"
                      type="text"
                      placeholder="María García"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-white text-[#022133] focus:border-[#2CB6D7] focus:ring-2 focus:ring-[#2CB6D7]/20 outline-none transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="waitlist-email" className="block text-sm font-medium text-[#022133] mb-1">
                      Tu email *
                    </label>
                    <input
                      id="waitlist-email"
                      type="email"
                      placeholder="maria@ejemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-white text-[#022133] focus:border-[#2CB6D7] focus:ring-2 focus:ring-[#2CB6D7]/20 outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="waitlist-phone" className="block text-sm font-medium text-[#022133] mb-1">
                    Teléfono / WhatsApp
                  </label>
                  <input
                    id="waitlist-phone"
                    type="tel"
                    placeholder="+1 555 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-white text-[#022133] focus:border-[#2CB6D7] focus:ring-2 focus:ring-[#2CB6D7]/20 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleWaitlistSubmit}
                disabled={loading}
                className="w-full py-4 px-6 bg-gradient-to-r from-[#C7517E] to-[#b8456f] hover:from-[#d4608d] hover:to-[#C7517E] disabled:from-[#C7517E]/50 disabled:to-[#b8456f]/50 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-[#C7517E]/30 hover:shadow-xl hover:shadow-[#C7517E]/40 transform hover:scale-[1.02] disabled:transform-none"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Registrando...</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5" />
                    <span>Unirme a la Lista de Espera</span>
                  </>
                )}
              </button>

              <p className="text-center text-sm text-gray-500">
                Te notificaremos cuando abramos inscripciones para el próximo workshop.
              </p>
            </div>
          )}

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-6 mt-8 pt-8 border-t border-gray-200">
            <div className="flex items-center gap-2 text-[#022133]/60">
              <Shield className="w-5 h-5 text-[#36B3AE]" />
              <span className="text-sm">Sin compromiso</span>
            </div>
            <div className="flex items-center gap-2 text-[#022133]/60">
              <Check className="w-5 h-5 text-[#36B3AE]" />
              <span className="text-sm">Acceso prioritario</span>
            </div>
            <div className="flex items-center gap-2 text-[#022133]/60">
              <Users className="w-5 h-5 text-[#36B3AE]" />
              <span className="text-sm">Lista de espera activa</span>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-8 animate-on-scroll transition-all duration-700 delay-400">
          <p className="text-[#FCFEFB]/80 mb-2">
            &quot;El interés compuesto de tu libertad empieza ahora.&quot;
          </p>
          <p className="text-[#FCFEFB]/60 text-sm">
            - Metodología Sinsajo IA-3
          </p>
        </div>
      </div>
    </section>
  )
}
