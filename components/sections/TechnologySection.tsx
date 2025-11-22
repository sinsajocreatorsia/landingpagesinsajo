'use client'

import { motion } from 'framer-motion'
import { Blocks, Cpu, Shield, Zap, Globe, BarChart } from 'lucide-react'
import { useLanguage } from '@/lib/contexts/LanguageContext'

export default function TechnologySection() {
  const { t } = useLanguage()

  return (
    <section className="relative py-20 px-4 bg-gradient-to-b from-transparent to-[#0A1628]/50">
      <div className="max-w-6xl mx-auto">
        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {t.technology.headline}{' '}
            <span className="gradient-text">{t.technology.headlineHighlight}</span>
          </h2>
        </motion.div>

        {/* 3 Columns */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-dark p-6 rounded-xl neon-border text-center"
          >
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#F59E0B]/20 to-[#06B6D4]/20 flex items-center justify-center mx-auto mb-4">
              <Blocks className="w-8 h-8 text-[#F59E0B]" />
            </div>
            <h3 className="text-2xl font-bold mb-3">{t.technology.columns[0].title}</h3>
            <p className="text-gray-300 mb-2">{t.technology.columns[0].subtitle}</p>
            <p className="text-gray-400">{t.technology.columns[0].description}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-dark p-6 rounded-xl neon-border text-center"
          >
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#06B6D4]/20 to-[#7C3AED]/20 flex items-center justify-center mx-auto mb-4">
              <Cpu className="w-8 h-8 text-[#06B6D4]" />
            </div>
            <h3 className="text-2xl font-bold mb-3">{t.technology.columns[1].title}</h3>
            <p className="text-gray-300 mb-2">{t.technology.columns[1].subtitle}</p>
            <p className="text-gray-400">{t.technology.columns[1].description}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-dark p-6 rounded-xl neon-border text-center"
          >
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#7C3AED]/20 to-[#F59E0B]/20 flex items-center justify-center mx-auto mb-4">
              <BarChart className="w-8 h-8 text-[#7C3AED]" />
            </div>
            <h3 className="text-2xl font-bold mb-3">{t.technology.columns[2].title}</h3>
            <p className="text-gray-300 mb-2">{t.technology.columns[2].subtitle}</p>
            <p className="text-gray-400">{t.technology.columns[2].description}</p>
          </motion.div>
        </div>

        {/* Features List */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="glass-dark p-8 rounded-xl neon-border"
        >
          <h4 className="text-2xl font-bold mb-6 text-center">{t.technology.featuresTitle}</h4>
          <div className="grid md:grid-cols-2 gap-4">
            {t.technology.features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center gap-2"
              >
                <span className="text-green-400">✓</span>
                <span className="text-gray-300">{feature}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-12"
        >
          <a href="#hero" className="btn-primary inline-block text-lg">
            {t.technology.cta}
          </a>
        </motion.div>
      </div>
    </section>
  )
}
