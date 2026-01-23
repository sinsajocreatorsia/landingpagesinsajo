'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { Linkedin, Globe } from 'lucide-react'

export default function WorkshopSpeaker() {
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

  return (
    <section ref={sectionRef} className="py-12 bg-[#FCFEFB] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#C7517E]/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative flex justify-center animate-on-scroll opacity-0 translate-x-[-50px] transition-all duration-700">
            <div className="relative">
              {/* Decorative circle */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#2CB6D7] to-[#200F5D] rounded-full scale-105 opacity-20 animate-pulse" />
              <div className="relative w-80 h-80 rounded-full overflow-hidden border-4 border-[#2CB6D7] shadow-2xl">
                <Image
                  src="/images/giovanna.png"
                  alt="Giovanna Rodríguez - CEO de Sinsajo Creators"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Badge */}
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#022133] to-[#200F5D] text-[#FCFEFB] px-6 py-2 rounded-full font-semibold shadow-lg">
                CEO de Sinsajo Creators
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6 animate-on-scroll opacity-0 translate-x-[50px] transition-all duration-700 delay-200">
            <span className="inline-block bg-[#C7517E]/10 text-[#C7517E] font-semibold px-4 py-2 rounded-full text-sm">
              TU PRESENTADORA
            </span>

            <h2 className="text-3xl md:text-4xl font-bold text-[#022133]">
              Giovanna Rodríguez
            </h2>

            <p className="text-xl text-[#022133]/70 leading-relaxed">
              Experta en estrategias de IA para negocios de habla hispana. Fundadora de Sinsajo Creators,
              empresa dedicada a transformar negocios con agentes de inteligencia artificial
              que trabajan 24/7.
            </p>

            <p className="text-[#022133]/70 leading-relaxed">
              Con años de experiencia ayudando a empresarias a escalar sus negocios,
              Giovanna ha desarrollado la metodología IA-3 que combina arquitectura estratégica,
              producción visual de ultra-lujo y automatización radical.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 py-6">
              <div className="text-center p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="text-3xl font-bold text-[#2CB6D7]">+73</div>
                <div className="text-sm text-[#022133]/60">Empresas transformadas</div>
              </div>
              <div className="text-center p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="text-3xl font-bold text-[#C7517E]">5+</div>
                <div className="text-sm text-[#022133]/60">Años de experiencia</div>
              </div>
              <div className="text-center p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="text-3xl font-bold text-[#36B3AE]">98%</div>
                <div className="text-sm text-[#022133]/60">Satisfacción</div>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-4">
              <a
                href="https://www.linkedin.com/in/giovanna-rodriguez"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#022133] hover:bg-[#200F5D] text-[#FCFEFB] px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                <Linkedin className="w-5 h-5" />
                <span>LinkedIn</span>
              </a>
              <a
                href="https://www.screatorsai.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#2CB6D7] hover:bg-[#189FB2] text-[#FCFEFB] px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                <Globe className="w-5 h-5" />
                <span>www.screatorsai.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
