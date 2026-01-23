'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
}

const faqData: FAQItem[] = [
  {
    question: '¿En qué idioma es el workshop?',
    answer: 'El workshop será en español, optimizado para fundadoras latinas. Todo el material, incluyendo el workbook y la grabación, estará en español.',
  },
  {
    question: '¿Necesito experiencia previa con IA?',
    answer: 'No necesitas experiencia técnica en IA. Lo que sí necesitas es un negocio establecido que ya genere ingresos. El workshop está diseñado para empresarias que quieren escalar, no para principiantes.',
  },
  {
    question: '¿Qué pasa si no puedo asistir en vivo?',
    answer: 'Tendrás acceso a la grabación completa por 30 días. Sin embargo, recomendamos asistir en vivo para participar en la sesión de Q&A y obtener el máximo valor del workshop.',
  },
  {
    question: '¿Cuál es la política de reembolso?',
    answer: 'Ofrecemos garantía de satisfacción de 7 días. Si el workshop no cumple tus expectativas, te devolvemos el 100% de tu inversión, sin preguntas.',
  },
  {
    question: '¿Cómo accedo a la comunidad privada?',
    answer: 'Después de tu compra, recibirás un email con el enlace de invitación a nuestra comunidad privada en Slack/Discord donde podrás conectar con otras fundadoras latinas.',
  },
  {
    question: '¿Qué incluye el workbook digital?',
    answer: 'El workbook incluye plantillas de estrategia AI, checklists de implementación, prompts personalizables para tu industria, y un plan de acción de 30 días post-workshop.',
  },
  {
    question: '¿Puedo pagar con PayPal o tarjeta de crédito?',
    answer: 'Sí, aceptamos pagos con tarjeta de crédito/débito (Visa, Mastercard, Amex) a través de Stripe, y también PayPal. Ambos métodos son 100% seguros.',
  },
  {
    question: '¿Cuántos lugares hay disponibles?',
    answer: 'Limitamos cada workshop a 50 participantes para garantizar atención personalizada y que todas las preguntas sean respondidas durante la sesión Q&A.',
  },
]

export default function WorkshopFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-12 bg-[#FCFEFB]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block bg-[#2CB6D7]/10 text-[#2CB6D7] font-semibold px-4 py-2 rounded-full text-sm mb-4">
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#022133] mb-4">
            Preguntas Frecuentes
          </h2>
          <p className="text-xl text-[#022133]/70">
            Todo lo que necesitas saber antes de reservar tu lugar.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:border-[#2CB6D7]/50"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left"
              >
                <span className="text-lg font-semibold text-[#022133] pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-[#2CB6D7] flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 pb-5">
                  <p className="text-[#022133]/70 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-[#022133]/70 mb-4">
            ¿Tienes más preguntas?
          </p>
          <a
            href="mailto:sales@sinsajocreators.com"
            className="inline-flex items-center gap-2 text-[#2CB6D7] hover:text-[#189FB2] font-semibold transition-colors"
          >
            Escríbenos a sales@sinsajocreators.com
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
