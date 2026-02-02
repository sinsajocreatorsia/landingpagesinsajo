'use client'

import { useEffect, useRef } from 'react'
import { AlertTriangle, Clock, DollarSign, Brain, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'

export default function WorkshopProblem() {
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
      badge: 'EL DESAFÍO DE LA EMPRESARIA MODERNA',
      title: '¿Te Suena Familiar?',
      subtitle: 'Si estás aquí, probablemente vives alguno de estos escenarios...',
      problems: [
        {
          icon: Clock,
          title: 'Trabajas MÁS pero ganas IGUAL',
          description: 'Tu negocio crece pero tú trabajas el doble. Cada cliente nuevo significa más horas de tu tiempo.',
        },
        {
          icon: DollarSign,
          title: 'Atrapada en tareas operativas',
          description: 'Haces tareas de $15/hora cuando tu hora vale $500. Contestas emails, agendas citas, creas contenido...',
        },
        {
          icon: Brain,
          title: 'Tu conocimiento está atrapado en tu cabeza',
          description: 'No puedes delegar porque nadie conoce tu negocio como tú. Entrenar a alguien tomaría meses.',
        },
        {
          icon: AlertTriangle,
          title: 'La competencia te está pasando',
          description: 'Mientras tú sigues haciendo todo manual, otros usan IA para hacer en 1 hora lo que tú haces en 1 día.',
        },
      ],
      question: '¿Eres la dueña estratégica o estás atrapada en lo operativo?',
      questionCta: 'Si esta pregunta te incomoda, este workshop es para ti.',
      ctaButton: 'Quiero Ser la Dueña de Verdad',
    },
    en: {
      badge: 'THE MODERN BUSINESSWOMAN CHALLENGE',
      title: 'Does This Sound Familiar?',
      subtitle: "If you're here, you probably live one of these scenarios...",
      problems: [
        {
          icon: Clock,
          title: 'You Work MORE but Earn the SAME',
          description: 'Your business grows but you work twice as hard. Every new client means more hours of your time.',
        },
        {
          icon: DollarSign,
          title: 'Trapped in Operational Tasks',
          description: 'You do $15/hour tasks when your hour is worth $500. You answer emails, schedule appointments, create content...',
        },
        {
          icon: Brain,
          title: 'Your Knowledge is Trapped in Your Head',
          description: "You can't delegate because no one knows your business like you. Training someone would take months.",
        },
        {
          icon: AlertTriangle,
          title: 'The Competition is Passing You By',
          description: 'While you keep doing everything manually, others use AI to do in 1 hour what takes you 1 day.',
        },
      ],
      question: 'Are you the strategic owner or trapped in daily operations?',
      questionCta: 'If this question makes you uncomfortable, this workshop is for you.',
      ctaButton: 'I Want to Be the Real Owner',
    },
  }

  const t = content[language]

  return (
    <section
      ref={sectionRef}
      className="py-8 bg-gradient-to-br from-[#022133] to-[#200F5D] relative overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-5" />
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#C7517E] rounded-full blur-[200px] opacity-10" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
          <span className="inline-block bg-[#C7517E]/20 text-[#C7517E] font-semibold px-4 py-2 rounded-full text-sm mb-4">
            {t.badge}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#FCFEFB] mb-4">
            {t.title}
          </h2>
          <p className="text-xl text-[#FCFEFB]/70 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        {/* Problems Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {t.problems.map((problem, index) => (
            <div
              key={index}
              className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 bg-[#022133]/50 backdrop-blur-sm border border-[#C7517E]/20 rounded-2xl p-6 hover:border-[#C7517E]/50 group"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#C7517E]/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <problem.icon className="w-6 h-6 text-[#C7517E]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#FCFEFB] mb-2">{problem.title}</h3>
                  <p className="text-[#FCFEFB]/70">{problem.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* The Question */}
        <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-500 text-center bg-gradient-to-r from-[#C7517E]/20 to-[#2CB6D7]/20 border border-[#2CB6D7]/30 rounded-2xl p-8 max-w-3xl mx-auto">
          <p className="text-2xl md:text-3xl font-bold text-[#FCFEFB] mb-4">
            &quot;{t.question}&quot;
          </p>
          <p className="text-[#FCFEFB]/80 mb-6">
            {t.questionCta}
          </p>
          <a
            href="#pricing"
            className="inline-flex items-center gap-2 bg-[#C7517E] hover:bg-[#b8456f] text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            {t.ctaButton}
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  )
}
