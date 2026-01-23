import { FileWarning, Settings, Brain } from 'lucide-react'
import SectionCTA from './SectionCTA'

export default function WorkshopRoadmap() {
  const phases = [
    {
      phase: 1,
      title: 'Manual Chaos',
      subtitle: 'UNFILTERED',
      description: 'Del caos manual a la claridad. Identificamos los puntos de fricción en tu negocio.',
      icon: FileWarning,
      gradient: 'from-red-500 to-orange-500',
      bgColor: 'bg-red-500/10',
    },
    {
      phase: 2,
      title: 'Implementation Phase',
      subtitle: 'STREAMLINED',
      description: 'Implementación estratégica de herramientas AI adaptadas a tu industria.',
      icon: Settings,
      gradient: 'from-yellow-500 to-amber-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      phase: 3,
      title: 'Optimized AI Ecosystem',
      subtitle: 'ORGANIZED',
      description: 'Ecosistema AI optimizado y funcionando. Tu negocio trabaja mientras descansas.',
      icon: Brain,
      gradient: 'from-[#36B3AE] to-[#2CB6D7]',
      bgColor: 'bg-[#36B3AE]/10',
    },
  ]

  return (
    <section className="py-12 bg-gradient-to-br from-[#022133] to-[#200F5D] relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#2CB6D7] rounded-full blur-[200px] opacity-10" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#C7517E] rounded-full blur-[150px] opacity-10" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-[#2CB6D7]/20 text-[#2CB6D7] font-semibold px-4 py-2 rounded-full text-sm mb-4">
            AI STRATEGIC ROADMAP
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#FCFEFB] mb-4">
            Tu Transformación en{' '}
            <span className="text-[#2CB6D7]">3 Fases</span>
          </h2>
          <p className="text-xl text-[#FCFEFB]/70 max-w-2xl mx-auto">
            Un roadmap probado para llevar tu negocio del caos a la claridad con inteligencia artificial.
          </p>
        </div>

        {/* Roadmap Timeline */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-yellow-500 to-[#36B3AE] transform -translate-y-1/2" />

          <div className="grid lg:grid-cols-3 gap-8">
            {phases.map((phase, index) => (
              <div key={index} className="relative">
                {/* Phase Card */}
                <div className="bg-[#022133]/80 backdrop-blur-sm border border-[#2CB6D7]/20 rounded-2xl p-8 h-full hover:border-[#2CB6D7]/50 transition-all duration-300">
                  {/* Phase Number */}
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${phase.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                    <phase.icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <div className="mb-4">
                    <span className="text-xs font-bold tracking-wider text-[#FCFEFB]/50">
                      FASE {phase.phase}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#FCFEFB] mb-2">
                    {phase.title}
                  </h3>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${phase.bgColor} mb-4`}>
                    <span className={`bg-gradient-to-r ${phase.gradient} bg-clip-text text-transparent`}>
                      {phase.subtitle}
                    </span>
                  </span>
                  <p className="text-[#FCFEFB]/70">
                    {phase.description}
                  </p>
                </div>

                {/* Arrow (hidden on mobile) */}
                {index < 2 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <svg className="w-8 h-8 text-[#2CB6D7]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Section CTA */}
        <div className="mt-12">
          <SectionCTA text="Comienza Tu Transformación" />
        </div>
      </div>
    </section>
  )
}
