'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, Home, User, Utensils, Briefcase, ShoppingBag, Heart, Check, X, Sparkles, Zap } from 'lucide-react'
import { useLanguage } from '@/lib/contexts/LanguageContext'

const iconMap = {
  home: Home,
  user: User,
  utensils: Utensils,
  briefcase: Briefcase,
  'shopping-bag': ShoppingBag,
  heart: Heart
}

export default function AgentTypesSection() {
  const { t } = useLanguage()
  const [expandedAgent, setExpandedAgent] = useState<number | null>(null)

  return (
    <section className="relative px-4 md:px-6 bg-gradient-to-b from-transparent via-[#0A1628]/30 to-transparent">
      <div className="max-w-7xl mx-auto">

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            {t.agentTypes.headline}{' '}
            <span className="gradient-text">{t.agentTypes.headlineHighlight}</span>
          </h2>
          <p className="text-xl text-red-400 max-w-3xl mx-auto font-semibold">
            {t.agentTypes.subtitle}
          </p>
        </motion.div>

        {/* TROJAN HORSE - WhatsApp Agent (BIG FEATURE) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="relative glass-dark p-8 md:p-12 rounded-3xl neon-border overflow-hidden">
            {/* Badge */}
            <div className="absolute top-4 right-4 bg-gradient-to-r from-[#F59E0B] to-[#06B6D4] px-4 py-2 rounded-full">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-white" />
                <span className="text-sm font-bold text-white">{t.agentTypes.trojanHorse.badge}</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              {/* Left - The Pain */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center">
                    <MessageCircle className="w-8 h-8 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold gradient-text">{t.agentTypes.trojanHorse.title}</h3>
                    <p className="text-gray-400 text-sm">{t.agentTypes.trojanHorse.subtitle}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
                    <X className="w-5 h-5" />
                    {t.agentTypes.trojanHorse.pain}
                  </h4>
                  <ul className="space-y-3">
                    {t.agentTypes.trojanHorse.painPoints.map((point, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: idx * 0.1 }}
                        className="flex items-start gap-2 text-gray-300"
                      >
                        <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <div className="glass p-4 rounded-xl border border-red-500/30">
                  <p className="text-red-400 font-semibold text-center">
                    <Zap className="w-4 h-4 inline mr-2" />
                    Every missed message = $100-$500 lost revenue
                  </p>
                </div>
              </div>

              {/* Right - The Solution */}
              <div>
                <h4 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  {t.agentTypes.trojanHorse.solution}
                </h4>
                <ul className="space-y-3 mb-6">
                  {t.agentTypes.trojanHorse.benefits.map((benefit, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: idx * 0.1 }}
                      className="flex items-start gap-2 text-gray-200"
                    >
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="font-medium">{benefit}</span>
                    </motion.li>
                  ))}
                </ul>

                <div className="glass p-6 rounded-xl neon-border mb-6">
                  <p className="text-2xl font-bold gradient-text text-center mb-2">
                    {t.agentTypes.trojanHorse.roi}
                  </p>
                  <p className="text-gray-400 text-sm text-center">
                    Average client results after implementing WhatsApp AI
                  </p>
                </div>

                <motion.a
                  href="#hero"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary w-full text-center text-lg py-4 rounded-xl block"
                >
                  {t.agentTypes.trojanHorse.cta}
                </motion.a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Other Agents */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              {t.agentTypes.otherAgents.title}
            </h3>
            <p className="text-xl text-gray-400">{t.agentTypes.otherAgents.subtitle}</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {t.agentTypes.otherAgents.agents.map((agent, index) => {
              const Icon = iconMap[agent.icon as keyof typeof iconMap]
              const isExpanded = expandedAgent === index

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass-dark p-8 rounded-xl neon-border hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                  onClick={() => setExpandedAgent(isExpanded ? null : index)}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#F59E0B]/20 to-[#06B6D4]/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-[#F59E0B]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-white mb-1">{agent.name}</h4>
                      <p className="text-sm text-[#06B6D4] italic">{agent.tagline}</p>
                    </div>
                  </div>

                  <p className="text-gray-300 mb-4">{agent.description}</p>

                  <div className="glass p-3 rounded-lg mb-4">
                    <p className="text-sm font-bold text-green-400">{agent.results}</p>
                  </div>

                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-white/10 pt-4 mt-4"
                    >
                      <p className="text-sm font-semibold text-gray-400 mb-2">Use Cases:</p>
                      <ul className="space-y-1">
                        {agent.useCases.map((useCase, idx) => (
                          <li key={idx} className="text-sm text-gray-400 flex items-center gap-2">
                            <Check className="w-3 h-3 text-green-500" />
                            {useCase}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}

                  <button className="text-sm text-[#F59E0B] mt-2 hover:text-[#06B6D4] transition-colors">
                    {isExpanded ? t.agentTypes.showLess : t.agentTypes.learnMore}
                  </button>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Comparison Table - Why WhatsApp First */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="glass-dark p-8 rounded-2xl neon-border"
        >
          <h3 className="text-3xl font-bold text-center mb-8 gradient-text">
            {t.agentTypes.comparison.title}
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-5 text-gray-400 font-semibold">Feature</th>
                  <th className="text-center py-4 px-5 text-red-400 font-semibold">Without AI</th>
                  <th className="text-center py-4 px-5 text-green-400 font-semibold">With WhatsApp Agent</th>
                </tr>
              </thead>
              <tbody>
                {t.agentTypes.comparison.points.map((point, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="border-b border-white/5"
                  >
                    <td className="py-4 px-5 font-semibold text-white">{point.feature}</td>
                    <td className="py-4 px-5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <X className="w-4 h-4 text-red-500" />
                        <span className="text-gray-400">{point.without}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span className="text-white font-semibold">{point.with}</span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 text-center">
            <motion.a
              href="#hero"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary inline-block text-lg px-8 py-4 rounded-xl"
            >
              {t.agentTypes.cta}
            </motion.a>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
