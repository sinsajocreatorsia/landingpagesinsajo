'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Briefcase, Code, GraduationCap, Heart } from 'lucide-react'
import { useLanguage } from '@/lib/contexts/LanguageContext'

export default function UseCasesSection() {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState(0)

  const useCases = [
    {
      id: 0,
      icon: ShoppingCart,
      name: t.useCases.tabs[0].name,
      scenario: t.useCases.cases[0].scenario,
      challenge: t.useCases.cases[0].challenge,
      solutions: t.useCases.cases[0].solutions,
      results: t.useCases.cases[0].results
    },
    {
      id: 1,
      icon: Briefcase,
      name: t.useCases.tabs[1].name,
      scenario: t.useCases.cases[1].scenario,
      challenge: t.useCases.cases[1].challenge,
      solutions: t.useCases.cases[1].solutions,
      results: t.useCases.cases[1].results
    },
    {
      id: 2,
      icon: Code,
      name: t.useCases.tabs[2].name,
      scenario: t.useCases.cases[2].scenario,
      challenge: t.useCases.cases[2].challenge,
      solutions: t.useCases.cases[2].solutions,
      results: t.useCases.cases[2].results
    },
    {
      id: 3,
      icon: GraduationCap,
      name: t.useCases.tabs[3].name,
      scenario: t.useCases.cases[3].scenario,
      challenge: t.useCases.cases[3].challenge,
      solutions: t.useCases.cases[3].solutions,
      results: t.useCases.cases[3].results
    },
    {
      id: 4,
      icon: Heart,
      name: t.useCases.tabs[4].name,
      scenario: t.useCases.cases[4].scenario,
      challenge: t.useCases.cases[4].challenge,
      solutions: t.useCases.cases[4].solutions,
      results: t.useCases.cases[4].results
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
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {t.useCases.headline}{' '}
            <span className="gradient-text">{t.useCases.headlineHighlight}</span>
          </h2>
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {useCases.map((useCase, index) => (
            <button
              key={useCase.id}
              onClick={() => setActiveTab(index)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === index
                  ? 'bg-gradient-to-r from-[#F59E0B] to-[#06B6D4] text-white shadow-lg scale-105'
                  : 'glass border border-white/20 text-gray-300 hover:border-[#F59E0B]/50'
              }`}
            >
              <useCase.icon className="w-5 h-5" />
              {useCase.name}
            </button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="glass-dark p-8 md:p-12 rounded-2xl neon-border"
          >
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column - Scenario & Solutions */}
              <div>
                <div className="mb-6">
                  <p className="text-sm text-gray-400 mb-1">{t.useCases.client}</p>
                  <h3 className="text-2xl font-bold text-white mb-2">{useCases[activeTab].scenario}</h3>
                  <p className="text-sm text-gray-400 mb-1">{t.useCases.challenge}</p>
                  <p className="text-lg text-red-400">{useCases[activeTab].challenge}</p>
                </div>

                <div>
                  <h4 className="text-xl font-bold mb-4 text-[#06B6D4]">{t.useCases.solution}</h4>
                  <ul className="space-y-3">
                    {useCases[activeTab].solutions.map((solution, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.1 }}
                        className="flex items-start gap-2"
                      >
                        <span className="text-green-400 mt-1">✓</span>
                        <span className="text-gray-300">{solution}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right Column - Results */}
              <div>
                <h4 className="text-xl font-bold mb-6 text-[#F59E0B]">{t.useCases.results}</h4>
                <div className="grid grid-cols-2 gap-4">
                  {useCases[activeTab].results.map((result, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: idx * 0.1 }}
                      className="glass p-4 rounded-lg text-center neon-border"
                    >
                      <div className="text-3xl font-bold gradient-text mb-1">{result.metric}</div>
                      <div className="text-sm text-gray-400">{result.label}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center mt-12"
        >
          <a href="#hero" className="btn-primary inline-block text-lg">
            {t.useCases.cta}
          </a>
        </motion.div>
      </div>
    </section>
  )
}
