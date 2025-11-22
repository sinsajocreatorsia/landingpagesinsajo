'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Rocket, TrendingUp, Clock, Zap } from 'lucide-react'
import { useLanguage } from '@/lib/contexts/LanguageContext'

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
          {/* Logo */}
          <motion.div
            className="flex items-center gap-3 mb-8"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#F59E0B] via-[#06B6D4] to-[#7C3AED] flex items-center justify-center">
              <Rocket className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold gradient-text">SINSAJO</h3>
              <p className="text-sm text-gray-400">CREATORS</p>
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            Agentes de IA que Trabajan{' '}
            <span className="gradient-text">
              Mientras Tu Duermes
            </span>
          </motion.h1>

          {/* Subcopy */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-300 mb-8"
          >
            Automatiza atencion al cliente, califica leads y cierra ventas 24/7.
            <br />
            <span className="text-[#F59E0B]">Sin contratar personal. Sin limites. Sin descanso.</span>
          </motion.p>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-3 gap-4 mb-8"
          >
            <div className="glass p-4 rounded-lg text-center neon-border">
              <div className="text-3xl font-bold gradient-text">80%</div>
              <div className="text-sm text-gray-400">Menos Costos</div>
            </div>
            <div className="glass p-4 rounded-lg text-center neon-border">
              <div className="text-3xl font-bold gradient-text">10x</div>
              <div className="text-sm text-gray-400">Mas Clientes</div>
            </div>
            <div className="glass p-4 rounded-lg text-center neon-border">
              <div className="text-3xl font-bold gradient-text">24/7</div>
              <div className="text-sm text-gray-400">Disponibilidad</div>
            </div>
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
              <h3 className="text-3xl font-bold mb-4">Gracias!</h3>
              <p className="text-gray-300 text-lg">
                Nos pondremos en contacto contigo pronto para agendar tu demo personalizada.
              </p>
            </motion.div>
          ) : (
            <div className="glass-dark p-8 rounded-2xl neon-border">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-6 h-6 text-[#F59E0B]" />
                <h3 className="text-3xl font-bold gradient-text">Agenda tu Demo Gratuita</h3>
              </div>
              <p className="text-gray-400 mb-6">
                Descubre como un agente de IA puede transformar tu negocio
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nombre completo *"
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/50 transition-all"
                />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email corporativo *"
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/50 transition-all"
                />

                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Empresa *"
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/50 transition-all"
                />

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="WhatsApp/Telefono *"
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/50 transition-all"
                />

                <textarea
                  name="challenge"
                  value={formData.challenge}
                  onChange={handleChange}
                  placeholder="Cual es tu mayor desafio? *"
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
