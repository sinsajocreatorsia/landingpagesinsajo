import { Target, Lightbulb, XCircle } from 'lucide-react'

export default function WorkshopAbout() {
  const cards = [
    {
      icon: Target,
      title: '¿Para quién es?',
      color: '#2CB6D7',
      items: [
        'Fundadoras latinas con negocios establecidos',
        'Emprendedoras que ya generan ingresos',
        'Líderes que quieren escalar, no empezar desde cero',
        'Empresarias listas para implementar IA estratégicamente',
      ],
    },
    {
      icon: Lightbulb,
      title: '¿Qué aprenderás?',
      color: '#36B3AE',
      items: [
        'Estrategias de automatización personalizadas para tu industria',
        'Herramientas de IA que realmente funcionan para negocios latinos',
        'Claridad de nivel ejecutivo para liderar en el mercado actual',
        'Plan de implementación paso a paso',
      ],
    },
    {
      icon: XCircle,
      title: '¿Qué NO es este workshop?',
      color: '#C7517E',
      items: [
        'No es para principiantes sin negocio',
        'No es teoría genérica sin aplicación práctica',
        'No es otro webinar aburrido de 2 horas',
        'No es contenido que encontrarás gratis en YouTube',
      ],
    },
  ]

  return (
    <section className="py-20 bg-[#FCFEFB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-[#2CB6D7]/10 text-[#2CB6D7] font-semibold px-4 py-2 rounded-full text-sm mb-4">
            SOBRE EL WORKSHOP
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#022133] mb-4">
            Un Intensivo Diseñado para{' '}
            <span className="text-[#C7517E]">Líderes Probadas</span>
          </h2>
          <p className="text-xl text-[#022133]/70 max-w-2xl mx-auto">
            3 horas de estrategia, implementación y claridad para transformar tu negocio con IA.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
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
      </div>
    </section>
  )
}
