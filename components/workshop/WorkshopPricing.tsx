import { Check, Shield, Users, Clock, Video, FileText, MessageCircle } from 'lucide-react'
import PaymentButtons from './PaymentButtons'

export default function WorkshopPricing() {
  const benefits = [
    { icon: Video, text: 'Acceso al workshop en vivo (3 horas)' },
    { icon: FileText, text: 'Workbook digital descargable' },
    { icon: Clock, text: 'Grabación disponible por 30 días' },
    { icon: Users, text: 'Acceso a comunidad privada' },
    { icon: MessageCircle, text: 'Sesión Q&A en vivo con Giovanna' },
    { icon: Shield, text: 'Garantía de satisfacción 7 días' },
  ]

  return (
    <section id="pricing" className="py-20 bg-gradient-to-br from-[#022133] to-[#200F5D] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-[#C7517E] rounded-full blur-[150px] opacity-20" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#2CB6D7] rounded-full blur-[180px] opacity-15" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
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
        <div className="bg-[#FCFEFB] rounded-3xl p-8 md:p-12 shadow-2xl">
          {/* Limited spots badge */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2 bg-[#C7517E]/10 border border-[#C7517E]/30 rounded-full px-4 py-2">
              <span className="w-2 h-2 bg-[#C7517E] rounded-full animate-pulse" />
              <span className="text-[#C7517E] font-semibold text-sm">
                Solo 50 lugares disponibles
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-2xl text-[#022133]/50 line-through">$197</span>
              <span className="bg-[#36B3AE] text-white text-sm font-bold px-3 py-1 rounded-full">
                PRECIO ESPECIAL
              </span>
            </div>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-6xl md:text-7xl font-bold text-[#022133]">$100</span>
              <span className="text-2xl text-[#022133]/60">USD</span>
            </div>
            <p className="text-[#022133]/60 mt-2">Pago único - Sin suscripciones</p>
          </div>

          {/* Benefits */}
          <div className="grid md:grid-cols-2 gap-4 mb-10">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-[#2CB6D7]/5 rounded-lg">
                <div className="w-10 h-10 bg-[#2CB6D7]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="w-5 h-5 text-[#2CB6D7]" />
                </div>
                <span className="text-[#022133]">{benefit.text}</span>
              </div>
            ))}
          </div>

          {/* Payment Buttons */}
          <PaymentButtons price="100" workshopName="Latina Smart-Scaling Workshop" />

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-6 mt-8 pt-8 border-t border-gray-200">
            <div className="flex items-center gap-2 text-[#022133]/60">
              <Shield className="w-5 h-5 text-[#36B3AE]" />
              <span className="text-sm">Pago 100% seguro</span>
            </div>
            <div className="flex items-center gap-2 text-[#022133]/60">
              <Check className="w-5 h-5 text-[#36B3AE]" />
              <span className="text-sm">Garantía 7 días</span>
            </div>
            <div className="flex items-center gap-2 text-[#022133]/60">
              <svg className="w-5 h-5 text-[#36B3AE]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
              <span className="text-sm">Acceso inmediato</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
