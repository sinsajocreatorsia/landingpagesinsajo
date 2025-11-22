'use client'

import { motion } from 'framer-motion'
import { X, Check } from 'lucide-react'
import { useLanguage } from '@/lib/contexts/LanguageContext'

export default function ComparisonSection() {
  const { t } = useLanguage()

  return (
    <section className="relative py-20 px-4 bg-gradient-to-b from-[#0A1628]/50 to-transparent">
      <div className="max-w-5xl mx-auto">
        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {t.comparison.headline}{' '}
            <span className="gradient-text">{t.comparison.headlineHighlight}</span>
          </h2>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="glass-dark rounded-2xl overflow-hidden neon-border"
        >
          {/* Header */}
          <div className="grid grid-cols-2 bg-gradient-to-r from-[#0A1628] to-[#1E3A8A] p-4">
            <div className="text-center font-bold text-gray-300">{t.comparison.without}</div>
            <div className="text-center font-bold text-[#F59E0B]">{t.comparison.with}</div>
          </div>

          {/* Rows */}
          {t.comparison.items.map((comparison, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`grid grid-cols-2 p-4 ${index % 2 === 0 ? 'bg-white/5' : 'bg-transparent'}`}
            >
              <div className="flex items-center gap-2 text-gray-300">
                <X className="w-5 h-5 text-red-500 flex-shrink-0" />
                <span>{comparison.without}</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="font-semibold">{comparison.with}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-12"
        >
          <a href="#hero" className="btn-primary inline-block text-lg text-xl font-bold px-8 py-4">
            {t.comparison.cta}
          </a>
        </motion.div>
      </div>
    </section>
  )
}
