'use client'

import { motion } from 'framer-motion'
import { Rocket, CheckCircle2, Clock, Zap } from 'lucide-react'
import { useLanguage } from '@/lib/contexts/LanguageContext'

export default function FinalCTASection() {
  const { t } = useLanguage()
  return (
    <section className="relative px-4 md:px-6 bg-gradient-to-b from-[#0A1628]/50 to-[#0A1628] grid-pattern">
      <div className="max-w-4xl mx-auto text-center">
        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            {t.finalCTA.headline}
            <br />
            <span className="gradient-text">{t.finalCTA.headlineHighlight}</span>
          </h2>

          <p className="text-xl md:text-2xl text-gray-300 mb-12">
            {t.finalCTA.subtitle}
            <br />
            {t.finalCTA.subtitleHighlight}
          </p>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <a
            href="#hero"
            className="btn-primary inline-flex items-center gap-3 text-2xl font-bold px-12 py-6 rounded-xl shadow-2xl"
          >
            <Rocket className="w-8 h-8" />
            {t.finalCTA.button}
          </a>
        </motion.div>

        {/* Guarantees */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="glass-dark p-8 rounded-2xl neon-border mb-8"
        >
          <div className="grid md:grid-cols-2 gap-4">
            {t.finalCTA.guarantees.map((guarantee, index) => (
              <div key={index} className="flex items-center gap-3 text-left">
                <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0" />
                <span className="text-gray-300">{guarantee}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Urgency */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex items-center justify-center gap-2 text-[#F59E0B]"
        >
          <Zap className="w-6 h-6" />
          <span className="text-lg font-semibold">{t.finalCTA.urgency}</span>
        </motion.div>
      </div>
    </section>
  )
}
