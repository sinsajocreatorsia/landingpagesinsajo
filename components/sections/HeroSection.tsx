'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Rocket, TrendingUp, Clock, Zap } from 'lucide-react'
import { useLanguage } from '@/lib/contexts/LanguageContext'
import TeslaOptimusRobot from '@/components/effects/TeslaOptimusRobot'

export default function HeroSection() {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    challenge: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setIsSuccess(true)
        setFormData({ name: '', email: '', company: '', phone: '', challenge: '' })
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden grid-pattern">
      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">

        {/* Left Column - Main Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-left"
        >
          {/* Logo with Slogan */}
          <motion.div
            className="relative mb-8"
            animate={{
              y: [-10, 10, -10],
              rotate: [-2, 2, -2]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {/* Rocket Logo */}
            <div className="relative w-24 h-24 md:w-32 md:h-32 mx-auto">
              <motion.div
                className="w-full h-full rounded-full bg-gradient-to-br from-[#F59E0B] via-[#06B6D4] to-[#7C3AED] flex items-center justify-center relative"
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(245, 158, 11, 0.4)",
                    "0 0 40px rgba(6, 182, 212, 0.6)",
                    "0 0 20px rgba(124, 58, 237, 0.4)",
                    "0 0 40px rgba(245, 158, 11, 0.6)",
                    "0 0 20px rgba(245, 158, 11, 0.4)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <motion.div
                  animate={{
                    rotate: [0, -5, 5, -5, 0],
                    y: [0, -2, 0, -2, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Rocket className="w-12 h-12 md:w-16 md:h-16 text-white" />
                </motion.div>
              </motion.div>

              {/* Trail effect behind rocket */}
              <motion.div
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-24 bg-gradient-to-b from-cyan-400/50 to-transparent blur-xl"
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>

            {/* Animated Slogan */}
            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.h2
                className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  backgroundSize: '200% auto',
                }}
              >
                We Make Your Brand Fly
              </motion.h2>
              <motion.div
                className="flex items-center justify-center gap-2 mt-3"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-cyan-400 text-lg md:text-xl">✨</span>
                <span className="text-[#F59E0B] text-xs md:text-sm tracking-wider font-semibold">Powered by AI</span>
                <span className="text-cyan-400 text-lg md:text-xl">✨</span>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            {t.hero.headline}{' '}
            <span className="gradient-text">
              {t.hero.headlineHighlight}
            </span>
          </motion.h1>

          {/* Subcopy */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-300 mb-8"
          >
            {t.hero.subheadline}
            <br />
            <span className="text-[#F59E0B]">{t.hero.subheadlineHighlight}</span>
          </motion.p>

          {/* Stats Bar with Robot */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-8"
          >
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="glass p-4 rounded-lg text-center neon-border">
                <div className="text-3xl font-bold gradient-text">80%</div>
                <div className="text-sm text-gray-400">{t.hero.stats.lessCosts}</div>
              </div>
              <div className="glass p-4 rounded-lg text-center neon-border">
                <div className="text-3xl font-bold gradient-text">10x</div>
                <div className="text-sm text-gray-400">{t.hero.stats.moreClients}</div>
              </div>
              <div className="glass p-4 rounded-lg text-center neon-border">
                <div className="text-3xl font-bold gradient-text">24/7</div>
                <div className="text-sm text-gray-400">{t.hero.stats.availability}</div>
              </div>
            </div>

            {/* Tesla Optimus Robot Section */}
            <motion.div
              className="glass-dark p-6 rounded-2xl neon-border"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="flex items-center justify-center gap-6">
                {/* Robot */}
                <div className="w-32 h-40 flex-shrink-0">
                  <TeslaOptimusRobot />
                </div>

                {/* Text */}
                <div className="flex-1">
                  <p className="text-lg md:text-xl font-bold text-white mb-1">
                    Your AI agent working
                  </p>
                  <p className="text-3xl md:text-4xl font-bold gradient-text">
                    24/7
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Right Column - Lead Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative"
        >
          {isSuccess ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass-dark p-8 rounded-2xl text-center"
            >
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-10 h-10 text-green-400" />
              </div>
              <h3 className="text-3xl font-bold mb-4">{t.hero.form.successTitle}</h3>
              <p className="text-gray-300 text-lg">
                {t.hero.form.successMessage}
              </p>
            </motion.div>
          ) : (
            <div className="glass-dark p-8 rounded-2xl neon-border">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-6 h-6 text-[#F59E0B]" />
                <h3 className="text-3xl font-bold gradient-text">{t.hero.form.title}</h3>
              </div>
              <p className="text-gray-400 mb-6">
                {t.hero.form.subtitle}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t.hero.form.name}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/50 transition-all"
                />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t.hero.form.email}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/50 transition-all"
                />

                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder={t.hero.form.company}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/50 transition-all"
                />

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={t.hero.form.phone}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/50 transition-all"
                />

                <textarea
                  name="challenge"
                  value={formData.challenge}
                  onChange={handleChange}
                  placeholder={t.hero.form.challenge}
                  required
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/50 transition-all resize-none"
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full text-lg font-bold py-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? t.hero.form.buttonLoading : t.hero.form.button}
                </button>

                <p className="text-center text-sm text-gray-400">
                  {t.hero.form.orChat}
                </p>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
