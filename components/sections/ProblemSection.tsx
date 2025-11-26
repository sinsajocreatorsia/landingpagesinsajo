'use client'

import { motion } from 'framer-motion'
import { Smartphone, DollarSign, Clock, TrendingDown } from 'lucide-react'
import { useLanguage } from '@/lib/contexts/LanguageContext'

export default function ProblemSection() {
  const { t } = useLanguage()

  const problems = [
    {
      icon: Smartphone,
      title: t.problem.points[0].title,
      description: t.problem.points[0].description
    },
    {
      icon: DollarSign,
      title: t.problem.points[1].title,
      description: t.problem.points[1].description
    },
    {
      icon: Clock,
      title: t.problem.points[2].title,
      description: t.problem.points[2].description
    },
    {
      icon: TrendingDown,
      title: t.problem.points[3].title,
      description: t.problem.points[3].description
    }
  ]

  return (
    <section className="relative px-4 md:px-6 bg-gradient-to-b from-transparent to-[#0A1628]/50">
      <div className="max-w-6xl mx-auto">
        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            {t.problem.headline}{' '}
            <span className="gradient-text">{t.problem.headlineHighlight}</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {t.problem.subtitle}
          </p>
        </motion.div>

        {/* Pain Points Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-dark p-8 rounded-xl neon-border hover:scale-[1.02] transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500/20 to-red-600/20 flex items-center justify-center flex-shrink-0">
                  <problem.icon className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-white">{problem.title}</h3>
                  <p className="text-gray-400">{problem.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center"
        >
          <a href="#hero" className="btn-primary inline-block text-lg">
            {t.problem.cta}
          </a>
        </motion.div>
      </div>
    </section>
  )
}
