'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Crown,
  Check,
  ArrowLeft,
  Gift,
  Loader2,
  MessageSquare,
  History,
  Mic,
  User,
  Sparkles,
} from 'lucide-react'

const proFeatures = [
  {
    icon: MessageSquare,
    title: 'Mensajes ilimitados',
    description: 'Sin límite de conversaciones con Hanna',
  },
  {
    icon: History,
    title: 'Historial completo',
    description: 'Acceso a todas tus conversaciones anteriores',
  },
  {
    icon: User,
    title: 'Perfil de negocio',
    description: 'Hanna aprende sobre tu marca y se adapta',
  },
  {
    icon: Mic,
    title: 'Voz activada',
    description: 'Habla con Hanna usando tu voz',
  },
  {
    icon: Sparkles,
    title: 'Respuestas personalizadas',
    description: 'Contenido adaptado a tu tono y estilo',
  },
]

// Inner component that uses useSearchParams
function UpgradeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const cancelled = searchParams.get('cancelled')

  const [couponCode, setCouponCode] = useState('')
  const [couponValid, setCouponValid] = useState<boolean | null>(null)
  const [couponMessage, setCouponMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validateCoupon = async () => {
    if (!couponCode.trim()) return

    try {
      const response = await fetch('/api/hanna/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode.toUpperCase() }),
      })

      const data = await response.json()

      if (data.valid) {
        setCouponValid(true)
        setCouponMessage(data.message)
      } else {
        setCouponValid(false)
        setCouponMessage(data.error || 'Cupón no válido')
      }
    } catch (err) {
      setCouponValid(false)
      setCouponMessage('Error al validar cupón')
    }
  }

  const handleUpgrade = async () => {
    setError(null)
    setIsLoading(true)

    try {
      const response = await fetch('/api/hanna/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          couponCode: couponValid ? couponCode.toUpperCase() : undefined,
        }),
      })

      const data = await response.json()

      if (data.success && data.url) {
        window.location.href = data.url
      } else {
        setError(data.error || 'Error al procesar el pago')
      }
    } catch (err) {
      setError('Error al conectar con el servidor')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Link */}
      <Link
        href="/hanna/dashboard"
        className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Volver al chat
      </Link>

      {/* Cancelled Banner */}
      {cancelled && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-500/20 border border-yellow-500/30 text-yellow-200 px-4 py-3 rounded-xl mb-6"
        >
          Pago cancelado. Puedes intentarlo de nuevo cuando quieras.
        </motion.div>
      )}

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#C7517E]/20 to-[#200F5D]/20 border border-[#C7517E]/30 rounded-full mb-6">
          <Crown className="w-5 h-5 text-[#C7517E]" />
          <span className="text-white font-medium">Hanna Pro</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Desbloquea todo el poder de Hanna
        </h1>
        <p className="text-white/60 text-lg max-w-2xl mx-auto">
          Mensajes ilimitados, perfil de negocio personalizado, y mucho más por solo $19/mes.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Features */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-white font-bold text-xl mb-6">
            Todo lo que incluye Pro:
          </h2>
          <div className="space-y-4">
            {proFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/10"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#2CB6D7]/20 to-[#36B3AE]/20 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-5 h-5 text-[#2CB6D7]" />
                </div>
                <div>
                  <h3 className="text-white font-medium">{feature.title}</h3>
                  <p className="text-white/60 text-sm">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Pricing Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-gradient-to-br from-[#C7517E]/20 to-[#200F5D]/20 border-2 border-[#C7517E] rounded-2xl p-8 sticky top-8">
            {/* Price */}
            <div className="text-center mb-8">
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-5xl font-bold text-white">$19</span>
                <span className="text-white/60">/mes</span>
              </div>
              <p className="text-white/60 mt-2">Cancela cuando quieras</p>
            </div>

            {/* Coupon Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-white/80 mb-2">
                <Gift className="inline w-4 h-4 mr-1" />
                ¿Tienes un cupón?
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value)
                    setCouponValid(null)
                    setCouponMessage(null)
                  }}
                  placeholder="WORKSHOP2026"
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#2CB6D7] uppercase"
                />
                <button
                  onClick={validateCoupon}
                  className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white/80 hover:bg-white/20 transition-all"
                >
                  Validar
                </button>
              </div>
              {couponMessage && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`mt-2 text-sm flex items-center gap-1 ${
                    couponValid ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {couponValid && <Check className="w-4 h-4" />}
                  {couponMessage}
                </motion.p>
              )}
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/20 border border-red-500/30 text-red-200 px-4 py-3 rounded-xl text-sm mb-4"
              >
                {error}
              </motion.div>
            )}

            {/* CTA Button */}
            <button
              onClick={handleUpgrade}
              disabled={isLoading}
              className="w-full py-4 px-4 bg-gradient-to-r from-[#C7517E] to-[#b8456f] text-white font-semibold rounded-xl hover:from-[#d4608d] hover:to-[#C7517E] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <Crown className="w-5 h-5" />
                  {couponValid ? 'Continuar con cupón' : 'Actualizar a Pro'}
                </>
              )}
            </button>

            {/* Security Note */}
            <p className="text-center text-white/40 text-xs mt-4">
              Pago seguro con Stripe. Cancela cuando quieras.
            </p>

            {/* What's included */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <ul className="space-y-2">
                {['Mensajes ilimitados', 'Historial completo', 'Voz activada', 'Perfil de negocio'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-white/80 text-sm">
                    <Check className="w-4 h-4 text-[#2CB6D7]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>

      {/* FAQ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-16"
      >
        <h2 className="text-white font-bold text-xl mb-6 text-center">
          Preguntas frecuentes
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              q: '¿Puedo cancelar en cualquier momento?',
              a: 'Sí, puedes cancelar tu suscripción cuando quieras. Mantendrás acceso Pro hasta el final del período pagado.',
            },
            {
              q: '¿Qué métodos de pago aceptan?',
              a: 'Aceptamos todas las tarjetas de crédito y débito principales a través de Stripe.',
            },
            {
              q: '¿Qué pasa con mi historial si cancelo?',
              a: 'Tu historial se mantiene, pero solo podrás ver los últimos 7 días como usuario gratuito.',
            },
            {
              q: '¿El cupón del workshop sigue vigente?',
              a: 'El cupón WORKSHOP2026 te da 3 meses gratis de Hanna Pro. Válido hasta Junio 2026.',
            },
          ].map((faq) => (
            <div
              key={faq.q}
              className="bg-white/5 rounded-xl p-6 border border-white/10"
            >
              <h3 className="text-white font-medium mb-2">{faq.q}</h3>
              <p className="text-white/60 text-sm">{faq.a}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

// Loading skeleton
function UpgradeSkeleton() {
  return (
    <div className="max-w-4xl mx-auto animate-pulse">
      <div className="h-6 w-32 bg-white/20 rounded mb-8" />
      <div className="text-center mb-12">
        <div className="h-10 w-32 mx-auto bg-white/20 rounded-full mb-6" />
        <div className="h-10 w-96 mx-auto bg-white/20 rounded mb-4" />
        <div className="h-6 w-72 mx-auto bg-white/20 rounded" />
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-white/10 rounded-xl" />
          ))}
        </div>
        <div className="h-96 bg-white/10 rounded-2xl" />
      </div>
    </div>
  )
}

// Main page component with Suspense
export default function HannaUpgradePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#022133] via-[#0a2e47] to-[#200F5D] py-12 px-4">
      <Suspense fallback={<UpgradeSkeleton />}>
        <UpgradeContent />
      </Suspense>
    </main>
  )
}
