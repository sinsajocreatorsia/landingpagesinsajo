import Image from 'next/image'
import { Linkedin, Globe } from 'lucide-react'

export default function WorkshopSpeaker() {
  return (
    <section className="py-20 bg-[#FCFEFB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative flex justify-center">
            <div className="relative">
              {/* Decorative circle */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#2CB6D7] to-[#200F5D] rounded-full scale-105 opacity-20" />
              <div className="relative w-80 h-80 rounded-full overflow-hidden border-4 border-[#2CB6D7]">
                <Image
                  src="/images/giovanna.png"
                  alt="Giovanna Rodríguez - CEO de Sinsajo Creators"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Badge */}
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-[#022133] text-[#FCFEFB] px-6 py-2 rounded-full font-semibold shadow-lg">
                CEO de Sinsajo Creators
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <span className="inline-block bg-[#C7517E]/10 text-[#C7517E] font-semibold px-4 py-2 rounded-full text-sm">
              TU PRESENTADORA
            </span>

            <h2 className="text-3xl md:text-4xl font-bold text-[#022133]">
              Giovanna Rodríguez
            </h2>

            <p className="text-xl text-[#022133]/70 leading-relaxed">
              Experta en estrategias de IA para negocios latinos. Fundadora de Sinsajo Creators,
              empresa dedicada a transformar negocios con agentes de inteligencia artificial
              que trabajan 24/7.
            </p>

            <p className="text-[#022133]/70 leading-relaxed">
              Con años de experiencia ayudando a emprendedoras latinas a escalar sus negocios,
              Giovanna ha desarrollado metodologías únicas que combinan la calidez del servicio
              latino con el poder de la automatización inteligente.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 py-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#2CB6D7]">100+</div>
                <div className="text-sm text-[#022133]/60">Empresas transformadas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#C7517E]">5+</div>
                <div className="text-sm text-[#022133]/60">Años de experiencia</div>
              </div>
              <div className="text-center">
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
                className="flex items-center gap-2 bg-[#022133] hover:bg-[#200F5D] text-[#FCFEFB] px-4 py-2 rounded-lg transition-colors"
              >
                <Linkedin className="w-5 h-5" />
                <span>LinkedIn</span>
              </a>
              <a
                href="https://www.screatorsai.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#2CB6D7] hover:bg-[#189FB2] text-[#FCFEFB] px-4 py-2 rounded-lg transition-colors"
              >
                <Globe className="w-5 h-5" />
                <span>Website</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
