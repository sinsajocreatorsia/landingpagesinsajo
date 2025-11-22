'use client'

import { motion } from 'framer-motion'
import { Bot, CheckCircle2, Calendar, DollarSign, Globe, MessageSquare } from 'lucide-react'
import { useLanguage } from '@/lib/contexts/LanguageContext'

export default function SolutionSection() {
  const { t } = useLanguage()

  const features = [
    {
      icon: MessageSquare,
      text: t.solution.features[0]
    },
    {
      icon: CheckCircle2,
      text: t.solution.features[1]
    },
    {
      icon: Calendar,
      text: t.solution.features[2]
    },
    {
      icon: DollarSign,
      text: t.solution.features[3]
    },
    {
      icon: Globe,
      text: t.solution.features[4]
    }
  ]

  return (
    <section className="relative py-20 px-4">
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
            {t.solution.headline}
            <br />
            <span className="gradient-text">{t.solution.headlineHighlight}</span>
          </h2>
        </motion.div>

        {/* Visual Representation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="glass-dark p-8 md:p-12 rounded-2xl mb-12 neon-border"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-[#F59E0B] via-[#06B6D4] to-[#7C3AED] flex items-center justify-center mb-4">
                <Bot className="w-16 h-16 text-white" />
              </div>
              <p className="text-center text-gray-400">{t.solution.subtitle}</p>
            </div>

            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold mb-4">
                {t.solution.intro}
              </h3>
              <div className="space-y-3">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-5 h-5 text-green-400" />
                    </div>
                    <p className="text-gray-300">{feature.text}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center"
        >
          <a href="#hero" className="btn-primary inline-block text-lg">
            {t.solution.cta}
          </a>
        </motion.div>
      </div>
    </section>
  )
}
