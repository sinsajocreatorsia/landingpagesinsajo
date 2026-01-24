'use client'

import { useEffect, useRef } from 'react'
import { Target, Lightbulb, XCircle, Clock, TrendingUp, Zap } from 'lucide-react'
import SectionCTA from './SectionCTA'

export default function WorkshopAbout() {
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

  const cards = [
    {
      icon: Target,
      title: '¿Para quién es?',
      color: '#2CB6D7',
      items: [
        'Dueñas de negocio que ya generan ingresos',
        'Empresarias de habla hispana listas para escalar',
        'Líderes que quieren dejar de ser "la empleada más barata"',
        'Mujeres de negocios que valoran su tiempo',
      ],
    },
    {
      icon: Lightbulb,
      title: '¿Qué lograrás?',
      color: '#36B3AE',
      items: [
        'Recuperar 10+ horas semanales con automatización',
        'Clonar tu inteligencia de negocio en un asistente IA',
        'Crear contenido visual de ultra-lujo en minutos',
        'Pasar de operadora a verdadera dueña de tu negocio',
      ],
    },
    {
      icon: XCircle,
      title: '¿Qué NO es este workshop?',
      color: '#C7517E',
      items: [
        'No es para principiantes sin negocio',
        'No es teoría genérica sin aplicación',
        'No es un webinar de 2 horas que olvidarás',
        'No es contenido que encuentras gratis en YouTube',
      ],
    },
  ]

  const stats = [
    { icon: Clock, value: '10+', label: 'Horas semanales recuperadas', color: '#2CB6D7' },
    { icon: TrendingUp, value: '3x', label: 'Productividad aumentada', color: '#36B3AE' },
    { icon: Zap, value: '3', label: 'Horas de transformación', color: '#C7517E' },
  ]

  return (
    <section ref={sectionRef} className="py-8 bg-[#FCFEFB] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#2CB6D7]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#C7517E]/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
          <span className="inline-block bg-[#2CB6D7]/10 text-[#2CB6D7] font-semibold px-4 py-2 rounded-full text-sm mb-4">
            SOBRE EL WORKSHOP
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#022133] mb-4">
            Un Intensivo de 3 Horas que{' '}
            <span className="text-[#C7517E]">Cambiará Tu Negocio</span>
          </h2>
          <p className="text-xl text-[#022133]/70 max-w-2xl mx-auto">
            Basado en la metodología probada de Alex Hormozi: maximizar resultados mientras reduces tiempo y esfuerzo.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 md:gap-8 mb-16 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-100">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: `${stat.color}20` }}
              >
                <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
              </div>
              <div className="text-3xl md:text-4xl font-bold" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="text-sm text-[#022133]/60 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <div
              key={index}
              className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl group"
              style={{ transitionDelay: `${(index + 2) * 100}ms` }}
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                style={{ backgroundColor: `${card.color}20` }}
              >
                <card.icon className="w-7 h-7" style={{ color: card.color }} />
              </div>
              <h3 className="text-xl font-bold text-[#022133] mb-4">{card.title}</h3>
              <ul className="space-y-3">
                {card.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 mt-0.5 flex-shrink-0"
                      style={{ color: card.color }}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-[#022133]/80">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Section CTA */}
        <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-500">
          <SectionCTA text="Quiero Transformar Mi Negocio" />
        </div>
      </div>
    </section>
  )
}
