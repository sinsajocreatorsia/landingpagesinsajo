'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Crown, CheckCircle, ArrowRight, Sparkles, MessageSquare, Mic, User } from 'lucide-react'

export default function UpgradeSuccessPage() {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    // Trigger confetti
    if (!showConfetti) {
      setShowConfetti(true)
      const duration = 3000
      const end = Date.now() + duration

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#C7517E', '#2CB6D7', '#36B3AE'],
        })
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#C7517E', '#2CB6D7', '#36B3AE'],
        })

        if (Date.now() < end) {
          requestAnimationFrame(frame)
        }
      }
      frame()
    }
  }, [showConfetti])

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#022133] via-[#0a2e47] to-[#200F5D] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg text-center"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 15, delay: 0.2 }}
          className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-[#C7517E] to-[#200F5D] rounded-full flex items-center justify-center relative"
        >
          <Crown className="w-12 h-12 text-white" />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"
          >
            <CheckCircle className="w-5 h-5 text-white" />
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl md:text-4xl font-bold text-white mb-4"
        >
          ¡Bienvenida a Hanna Pro!
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-white/60 text-lg mb-8"
        >
          Tu suscripción está activa. Ahora tienes acceso a todas las funciones premium.
        </motion.p>

        {/* Features Unlocked */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 mb-8"
        >
          <h3 className="text-white font-medium mb-4 flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-[#2CB6D7]" />
            Funciones desbloqueadas
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: MessageSquare, label: 'Mensajes ilimitados' },
              { icon: Mic, label: 'Voz activada' },
              { icon: User, label: 'Perfil de negocio' },
            ].map((feature, index) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-gradient-to-r from-[#2CB6D7]/20 to-[#36B3AE]/20 flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-[#2CB6D7]" />
                </div>
                <p className="text-white/70 text-xs">{feature.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="space-y-3"
        >
          <Link
            href="/hanna/dashboard"
            className="w-full py-4 px-4 bg-gradient-to-r from-[#C7517E] to-[#b8456f] text-white font-semibold rounded-xl hover:from-[#d4608d] hover:to-[#C7517E] transition-all flex items-center justify-center gap-2"
          >
            Ir a chatear con Hanna
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Link
            href="/hanna/profile"
            className="w-full py-4 px-4 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all flex items-center justify-center gap-2"
          >
            Configurar mi perfil de negocio
          </Link>
        </motion.div>

        {/* Support */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-white/40 text-sm mt-8"
        >
          ¿Necesitas ayuda? Escríbenos a{' '}
          <a
            href="mailto:hanna@screatorsai.com"
            className="text-[#2CB6D7] hover:underline"
          >
            hanna@screatorsai.com
          </a>
        </motion.p>
      </motion.div>
    </main>
  )
}
