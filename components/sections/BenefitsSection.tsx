'use client'

import { motion } from 'framer-motion'
import { Clock, DollarSign, Heart, Zap, Target, TrendingUp } from 'lucide-react'
import { useLanguage } from '@/lib/contexts/LanguageContext'

export default function BenefitsSection() {
  const { t } = useLanguage()

  const benefits = [
    {
      icon: Clock,
      title: t.benefits.items[0].title,
      description: t.benefits.items[0].description
    },
    {
      icon: DollarSign,
      title: t.benefits.items[1].title,
      description: t.benefits.items[1].description
    },
    {
      icon: Heart,
      title: t.benefits.items[2].title,
      description: t.benefits.items[2].description
    },
    {
      icon: Zap,
      title: t.benefits.items[3].title,
      description: t.benefits.items[3].description
    },
    {
      icon: Target,
      title: t.benefits.items[4].title,
      description: t.benefits.items[4].description
    },
    {
      icon: TrendingUp,
      title: t.benefits.items[5].title,
      description: t.benefits.items[5].description
    }
  ]

  return (
    <section className="relative px-4 md:px-6 bg-gradient-to-b from-[#0A1628]/50 to-transparent">
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
            {t.benefits.headline}{' '}
            <span className="gradient-text">{t.benefits.headlineHighlight}</span>
          </h2>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-dark p-8 rounded-xl neon-border hover:scale-[1.02] transition-all duration-300 group"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#F59E0B]/20 to-[#06B6D4]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <benefit.icon className="w-7 h-7 text-[#F59E0B]" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">{benefit.title}</h3>
              <p className="text-gray-400 leading-relaxed">{benefit.description}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <a href="#hero" className="btn-primary inline-block text-lg">
            {t.benefits.cta}
          </a>
        </motion.div>
      </div>
    </section>
  )
}
