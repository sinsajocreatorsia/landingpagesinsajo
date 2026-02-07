'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, ArrowRight, CheckCircle } from 'lucide-react'

export default function SignupSuccessPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#022133] via-[#0a2e47] to-[#200F5D] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md text-center"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 15, delay: 0.2 }}
          className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center"
        >
          <CheckCircle className="w-12 h-12 text-white" />
        </motion.div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-4">
          ¡Cuenta creada!
        </h1>

        {/* Message */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-500/20 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-blue-400" />
          </div>
          <p className="text-white/80 mb-4">
            Te hemos enviado un email de confirmación a tu correo electrónico.
          </p>
          <p className="text-white/60 text-sm">
            Por favor, revisa tu bandeja de entrada y haz clic en el enlace de confirmación para activar tu cuenta.
          </p>
        </div>

        {/* What's Next */}
        <div className="bg-white/5 rounded-xl p-4 mb-6 text-left">
          <h3 className="text-white font-medium mb-3">Próximos pasos:</h3>
          <ul className="space-y-2 text-white/70 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-[#2CB6D7]">1.</span>
              Confirma tu email
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#2CB6D7]">2.</span>
              Inicia sesión en Hanna
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#2CB6D7]">3.</span>
              Empieza a chatear (5 mensajes gratis/día)
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href="/hanna/login"
            className="w-full py-3 px-4 bg-gradient-to-r from-[#C7517E] to-[#b8456f] text-white font-semibold rounded-xl hover:from-[#d4608d] hover:to-[#C7517E] transition-all flex items-center justify-center gap-2"
          >
            Ir a iniciar sesión
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Link
            href="/hanna"
            className="block text-white/60 hover:text-white text-sm transition-colors"
          >
            ← Volver a la página principal
          </Link>
        </div>

        {/* Help */}
        <p className="text-white/40 text-xs mt-8">
          ¿No recibiste el email? Revisa tu carpeta de spam o{' '}
          <button className="text-[#2CB6D7] hover:underline">
            reenviar email
          </button>
        </p>
      </motion.div>
    </main>
  )
}
