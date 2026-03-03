'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, ArrowRight, Users, CheckCircle } from 'lucide-react'

export default function LastSpotPopup() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    const dismissed = sessionStorage.getItem('lastSpotPopupDismissed')
    if (dismissed) {
      setIsDismissed(true)
      return
    }

    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    setIsDismissed(true)
    sessionStorage.setItem('lastSpotPopupDismissed', 'true')
  }

  const handleCTA = () => {
    handleDismiss()
    const pricingSection = document.getElementById('pricing')
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  if (isDismissed || !isVisible) return null

  return (
    <div className="fixed inset-0 z-[9998]">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleDismiss}
      />

      {/* Popup */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none"
      >
        <div className="pointer-events-auto relative w-full max-w-md bg-gradient-to-br from-[#022133] via-[#0a2d45] to-[#200F5D] rounded-3xl shadow-2xl overflow-hidden">
          {/* Animated background effects */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#C7517E] rounded-full blur-[80px] opacity-30 animate-pulse" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#2CB6D7] rounded-full blur-[80px] opacity-25 animate-pulse" style={{ animationDelay: '1s' }} />
          </div>

          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4 text-white/70" />
          </button>

          {/* Content */}
          <div className="relative z-10 p-6 sm:p-8 text-center">
            {/* CUPOS AGOTADOS badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-5">
              <CheckCircle className="w-4 h-4 text-[#2CB6D7]" />
              <span className="text-[#2CB6D7] font-bold text-xs tracking-widest uppercase">
                Cupos Agotados
              </span>
            </div>

            {/* Main message */}
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight">
              ¡Workshop{' '}
              <span className="bg-gradient-to-r from-[#2CB6D7] to-[#36B3AE] bg-clip-text text-transparent">
                Completo
              </span>
              !
            </h3>

            <p className="text-[#FCFEFB]/80 text-base sm:text-lg mb-6 leading-relaxed">
              Las{' '}
              <span className="text-[#2CB6D7] font-semibold">12 participantes</span>{' '}
              ya aseguraron su lugar. Únete a la{' '}
              <span className="text-[#C7517E] font-semibold">lista de espera</span>{' '}
              para ser la primera en enterarte del próximo workshop.
            </p>

            <p className="text-[#FCFEFB]/60 text-sm mb-6 italic">
              &quot;El interés compuesto de tu libertad empieza ahora.&quot;
            </p>

            {/* Info pills */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1.5">
                <Users className="w-3.5 h-3.5 text-[#C7517E]" />
                <span className="text-white/80 text-xs font-medium">12/12 Cupos llenos</span>
              </div>
            </div>

            {/* CTA Button */}
            <motion.button
              onClick={handleCTA}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#C7517E] to-[#b8456f] hover:from-[#d4608d] hover:to-[#C7517E] text-white font-bold py-4 px-8 rounded-xl text-lg shadow-xl shadow-[#C7517E]/30 hover:shadow-2xl hover:shadow-[#C7517E]/40 transition-all duration-300 group"
            >
              Unirme a la Lista de Espera
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <p className="text-white/40 text-xs mt-3">
              Sin compromiso — Te avisamos cuando abramos inscripciones
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
