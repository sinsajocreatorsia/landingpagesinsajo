'use client'

import { motion } from 'framer-motion'
import { Bot, CheckCircle2, Calendar, DollarSign, Globe, MessageSquare } from 'lucide-react'
import { useLanguage } from '@/lib/contexts/LanguageContext'
import HannaAIAnimation from '@/components/effects/HannaAIAnimation'

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

        {/* Visual Representation - Meet Your New Team */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="glass-dark p-8 md:p-12 rounded-2xl mb-12 neon-border"
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Column - Professional Hanna AI Animation */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex justify-center"
            >
              <div className="w-96 h-[500px]">
                <HannaAIAnimation />
              </div>
            </motion.div>

            {/* Right Column - Text and Benefits */}
            <div className="text-center md:text-left">
              <h3 className="text-3xl md:text-4xl font-bold mb-6 gradient-text">
                Meet Your New Team
              </h3>
              <p className="text-xl text-gray-300 mb-6">
                While you sleep, eat or enjoy your family,<br />
                your AI agents:
              </p>
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-cyan-400" />
                    </div>
                    <p className="text-gray-300 text-lg">{feature.text}</p>
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
