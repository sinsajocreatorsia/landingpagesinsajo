'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { useLanguage } from '@/lib/contexts/LanguageContext'

export default function SocialProofSection() {
  const { t } = useLanguage()

  const testimonials = [
    {
      name: 'Carlos Mendez',
      company: 'CEO, TechFlow Solutions',
      text: 'El agente de IA de Sinsajo transformo completamente nuestro servicio al cliente. Pasamos de responder 50 consultas diarias a 500, sin contratar mas personal.',
      rating: 5,
      improvement: '+300% leads calificados'
    },
    {
      name: 'Maria Rodriguez',
      company: 'Fundadora, Boutique Online',
      text: 'Antes perdia ventas porque no podia responder de noche. Ahora mi agente de IA cierra ventas mientras duermo. Es como tener un equipo trabajando 24/7.',
      rating: 5,
      improvement: '+$60K revenue mensual'
    },
    {
      name: 'Roberto Sanchez',
      company: 'Director, Academia Digital',
      text: 'La implementacion fue increiblemente rapida. En 48 horas teniamos el agente funcionando. Los estudiantes estan encantados con la atencion instantanea.',
      rating: 5,
      improvement: '+40% inscripciones'
    }
  ]

  return (
    <section className="relative py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {t.socialProof.headline}{' '}
            <span className="gradient-text">{t.socialProof.headlineHighlight}</span>
          </h2>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {t.socialProof.stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-dark p-6 rounded-xl text-center neon-border"
            >
              <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">{stat.number}</div>
              <div className="text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-dark p-6 rounded-xl neon-border"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#F59E0B] text-[#F59E0B]" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-300 mb-4 italic">"{testimonial.text}"</p>

              {/* Improvement */}
              <div className="mb-4 p-2 bg-green-500/10 rounded-lg">
                <p className="text-green-400 font-bold text-center">{testimonial.improvement}</p>
              </div>

              {/* Author */}
              <div className="border-t border-white/10 pt-4">
                <p className="font-bold text-white">{testimonial.name}</p>
                <p className="text-sm text-gray-400">{testimonial.company}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-12"
        >
          <a href="#hero" className="btn-primary inline-block text-lg">
            {t.socialProof.cta}
          </a>
        </motion.div>
      </div>
    </section>
  )
}
