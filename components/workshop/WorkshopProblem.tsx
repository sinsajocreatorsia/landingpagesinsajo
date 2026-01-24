'use client'

import { useEffect, useRef } from 'react'
import { AlertTriangle, Clock, DollarSign, Brain, ArrowRight } from 'lucide-react'

export default function WorkshopProblem() {
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

  const problems = [
    {
      icon: Clock,
      title: 'Trabajas MÁS pero ganas IGUAL',
      description: 'Tu negocio crece pero tú trabajas el doble. Cada cliente nuevo significa más horas de tu tiempo.',
    },
    {
      icon: DollarSign,
      title: 'Eres la empleada más barata',
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
  ]

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
            EL DESAFÍO DE LA EMPRESARIA MODERNA
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#FCFEFB] mb-4">
            ¿Te Suena Familiar?
          </h2>
          <p className="text-xl text-[#FCFEFB]/70 max-w-2xl mx-auto">
            Si estás aquí, probablemente vives alguno de estos escenarios...
          </p>
        </div>

        {/* Problems Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {problems.map((problem, index) => (
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
            &quot;¿Eres la dueña o la empleada más barata de tu negocio?&quot;
          </p>
          <p className="text-[#FCFEFB]/80 mb-6">
            Si esta pregunta te incomoda, este workshop es para ti.
          </p>
          <a
            href="#pricing"
            className="inline-flex items-center gap-2 bg-[#C7517E] hover:bg-[#b8456f] text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            Quiero Ser la Dueña de Verdad
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  )
}
