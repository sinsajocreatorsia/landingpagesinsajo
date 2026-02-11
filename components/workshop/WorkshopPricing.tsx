'use client'

import { useEffect, useRef } from 'react'
import { Check, Shield, Users, Video, FileText, MessageCircle, Gift, Sparkles } from 'lucide-react'
import PaymentButtons from './PaymentButtons'

export default function WorkshopPricing() {
  const sectionRef = useRef<HTMLDivElement>(null)

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
        <div className="text-center mb-12 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
          <span className="inline-block bg-[#C7517E]/20 text-[#C7517E] font-semibold px-4 py-2 rounded-full text-sm mb-4">
            INVERSIÓN
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#FCFEFB] mb-4">
            Reserva Tu Lugar Ahora
          </h2>
          <p className="text-xl text-[#FCFEFB]/70">
            Una inversión que transformará tu negocio para siempre.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-200 bg-[#FCFEFB] rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
          {/* Decorative corner */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#2CB6D7]/10 to-transparent rounded-bl-full" />

          {/* Limited spots badge */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-full px-4 py-2 animate-pulse">
              <span className="w-2 h-2 bg-red-500 rounded-full" />
              <span className="text-red-600 font-semibold text-sm">
                Solo 7 lugares disponibles - Cupo limitado
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-2xl text-[#022133]/50 line-through">$197</span>
              <span className="bg-gradient-to-r from-[#36B3AE] to-[#2CB6D7] text-white text-sm font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <Sparkles className="w-4 h-4" />
                PRECIO ESPECIAL
              </span>
            </div>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-[#022133] to-[#200F5D] bg-clip-text text-transparent">$100</span>
              <span className="text-2xl text-[#022133]/60">USD</span>
            </div>
            <p className="text-[#022133]/60 mt-2">Pago único - Sin suscripciones - Resultados garantizados</p>
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

          {/* Payment Buttons */}
          <PaymentButtons price="100" workshopName="IA para Empresarias Exitosas - Workshop" />

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-6 mt-8 pt-8 border-t border-gray-200">
            <div className="flex items-center gap-2 text-[#022133]/60">
              <Shield className="w-5 h-5 text-[#36B3AE]" />
              <span className="text-sm">Pago 100% seguro</span>
            </div>
            <div className="flex items-center gap-2 text-[#022133]/60">
              <Check className="w-5 h-5 text-[#36B3AE]" />
              <span className="text-sm">Cupo limitado a 7 personas</span>
            </div>
            <div className="flex items-center gap-2 text-[#022133]/60">
              <svg className="w-5 h-5 text-[#36B3AE]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
              <span className="text-sm">Confirmación inmediata</span>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-8 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-400">
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
