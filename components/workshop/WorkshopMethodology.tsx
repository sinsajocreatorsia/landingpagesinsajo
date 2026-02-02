'use client'

import { useEffect, useRef } from 'react'
import { Brain, Palette, Rocket } from 'lucide-react'
import SectionCTA from './SectionCTA'
import { useLanguage } from '@/lib/i18n'

export default function WorkshopMethodology() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { language } = useLanguage()

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

  const content = {
    es: {
      badge: 'METODOLOGÍA SINSAJO IA-3',
      title: 'Los 3 Pilares de la',
      titleHighlight: 'Transformación',
      subtitle: 'Basada en la Ecuación de Valor: Maximizar el resultado soñado y la probabilidad de éxito, mientras reducimos al mínimo el tiempo y el esfuerzo percibido.',
      pillars: [
        {
          icon: Brain,
          title: 'ARQUITECTURA',
          subtitle: 'La Mente',
          description: 'Clonación de tu inteligencia de negocio. No usamos IA para "chatear", la usamos para construir la estructura estratégica de tu empresa.',
          color: '#2CB6D7',
          features: ['Clon Asistente Personal', 'Avatar de Cliente Ideal', 'Oferta Irresistible'],
        },
        {
          icon: Palette,
          title: 'PRODUCCIÓN',
          subtitle: 'La Cara',
          description: 'Generación de activos visuales de ultra-lujo. Si tu marca no se ve de $10M, eres invisible en el mercado actual.',
          color: '#C7517E',
          features: ['Fotografía IA Profesional', 'Videos Cinematográficos', 'Contenido que Detiene el Scroll'],
        },
        {
          icon: Rocket,
          title: 'LIBERTAD',
          subtitle: 'El Músculo',
          description: 'Automatización radical de la operación diaria. Dejar de ser operadora para ser la verdadera dueña de tu negocio.',
          color: '#36B3AE',
          features: ['Inbox Zero Automático', 'Calificación de Leads', 'Agendamiento Inteligente'],
        },
      ],
      cta: 'Aprende la Metodología IA-3',
    },
    en: {
      badge: 'SINSAJO AI-3 METHODOLOGY',
      title: 'The 3 Pillars of',
      titleHighlight: 'Transformation',
      subtitle: 'Based on the Value Equation: Maximize the dream outcome and probability of success, while minimizing time and perceived effort.',
      pillars: [
        {
          icon: Brain,
          title: 'ARCHITECTURE',
          subtitle: 'The Mind',
          description: 'Cloning your business intelligence. We don\'t use AI to "chat", we use it to build the strategic structure of your company.',
          color: '#2CB6D7',
          features: ['Personal Assistant Clone', 'Ideal Client Avatar', 'Irresistible Offer'],
        },
        {
          icon: Palette,
          title: 'PRODUCTION',
          subtitle: 'The Face',
          description: 'Ultra-luxury visual asset generation. If your brand doesn\'t look like $10M, you\'re invisible in today\'s market.',
          color: '#C7517E',
          features: ['Professional AI Photography', 'Cinematic Videos', 'Scroll-Stopping Content'],
        },
        {
          icon: Rocket,
          title: 'FREEDOM',
          subtitle: 'The Muscle',
          description: 'Radical automation of daily operations. Stop being an operator to become the true owner of your business.',
          color: '#36B3AE',
          features: ['Automatic Inbox Zero', 'Lead Qualification', 'Smart Scheduling'],
        },
      ],
      cta: 'Learn the AI-3 Methodology',
    },
  }

  const t = content[language]

  return (
    <section ref={sectionRef} className="py-8 bg-[#FCFEFB] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#2CB6D7]/5 rounded-full blur-3xl transform -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-[#C7517E]/5 rounded-full blur-3xl transform -translate-y-1/2" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
          <span className="inline-block bg-[#36B3AE]/10 text-[#36B3AE] font-semibold px-4 py-2 rounded-full text-sm mb-4">
            {t.badge}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#022133] mb-4">
            {t.title}{' '}
            <span className="text-[#2CB6D7]">{t.titleHighlight}</span>
          </h2>
          <p className="text-xl text-[#022133]/70 max-w-3xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        {/* Pillars */}
        <div className="grid md:grid-cols-3 gap-8">
          {t.pillars.map((pillar, index) => (
            <div
              key={index}
              className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 group"
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 h-full relative overflow-hidden">
                {/* Gradient border on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                  style={{
                    background: `linear-gradient(135deg, ${pillar.color}20, transparent)`,
                  }}
                />

                <div className="relative z-10">
                  {/* Icon */}
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: `${pillar.color}20` }}
                  >
                    <pillar.icon className="w-8 h-8" style={{ color: pillar.color }} />
                  </div>

                  {/* Title */}
                  <div className="mb-4">
                    <span
                      className="text-xs font-bold tracking-wider"
                      style={{ color: pillar.color }}
                    >
                      {pillar.subtitle}
                    </span>
                    <h3 className="text-2xl font-bold text-[#022133]">{pillar.title}</h3>
                  </div>

                  {/* Description */}
                  <p className="text-[#022133]/70 mb-6">{pillar.description}</p>

                  {/* Features */}
                  <ul className="space-y-2">
                    {pillar.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 flex-shrink-0"
                          style={{ color: pillar.color }}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-[#022133]/80">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Section CTA */}
        <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-500">
          <SectionCTA text={t.cta} variant="secondary" />
        </div>
      </div>
    </section>
  )
}
