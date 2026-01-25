'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle,
  Calendar,
  Clock,
  Mail,
  ArrowLeft,
  Gift,
  Loader2,
  Sparkles,
} from 'lucide-react'
import OnboardingForm from '@/components/workshop/OnboardingForm'
import confetti from 'canvas-confetti'

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const regIdFromUrl = searchParams.get('registrationId')
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [registrationId, setRegistrationId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [customerName, setCustomerName] = useState('')

  useEffect(() => {
    // Trigger confetti on load
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#2CB6D7', '#C7517E', '#36B3AE', '#F59E0B'],
    })

    // Fetch session details using sessionId or registrationId
    const fetchSession = async () => {
      // Build the API URL based on available parameters
      let apiUrl = '/api/workshop/session?'
      if (sessionId) {
        apiUrl += `sessionId=${sessionId}`
      } else if (regIdFromUrl) {
        apiUrl += `registrationId=${regIdFromUrl}`
        // If coming from reminder email, show onboarding immediately
        setShowOnboarding(true)
      }

      if (sessionId || regIdFromUrl) {
        try {
          const response = await fetch(apiUrl)
          if (response.ok) {
            const data = await response.json()
            setRegistrationId(data.registrationId)
            setCustomerName(data.customerName || '')
          }
        } catch (error) {
          console.error('Error fetching session:', error)
        }
      }
      setLoading(false)
    }

    fetchSession()
  }, [sessionId, regIdFromUrl])

  const handleOnboardingComplete = () => {
    // Additional confetti on completion
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#2CB6D7', '#C7517E', '#36B3AE', '#F59E0B'],
    })
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#022133] to-[#200F5D] px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Success Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#FCFEFB] rounded-3xl p-8 md:p-12 shadow-2xl"
        >
          {/* Header */}
          <div className="text-center mb-8">
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="w-24 h-24 bg-gradient-to-r from-[#36B3AE] to-[#2CB6D7] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
            >
              <CheckCircle className="w-14 h-14 text-white" />
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl font-bold text-[#022133] mb-4"
            >
              ¡Bienvenida{customerName ? `, ${customerName.split(' ')[0]}` : ''}!
            </motion.h1>

            {/* Message */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-[#022133]/70 text-lg mb-2"
            >
              Tu lugar en el workshop{' '}
              <strong className="text-[#C7517E]">&quot;IA para Empresarias Exitosas&quot;</strong>{' '}
              está confirmado.
            </motion.p>
          </div>

          {/* Event Details */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-[#2CB6D7]/10 to-[#36B3AE]/10 rounded-2xl p-6 mb-8"
          >
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center justify-center gap-3">
                <Calendar className="w-6 h-6 text-[#2CB6D7]" />
                <div>
                  <p className="text-[#022133] font-semibold">Sábado, 7 de Marzo 2026</p>
                  <p className="text-[#022133]/60 text-sm">Marca tu calendario</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Clock className="w-6 h-6 text-[#2CB6D7]" />
                <div>
                  <p className="text-[#022133] font-semibold">9:00 AM - 12:00 PM</p>
                  <p className="text-[#022133]/60 text-sm">Hora del Este (EST)</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Mail className="w-6 h-6 text-[#2CB6D7]" />
                <div>
                  <p className="text-[#022133] font-semibold">Revisa tu email</p>
                  <p className="text-[#022133]/60 text-sm">Link de acceso enviado</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Onboarding Section */}
          <AnimatePresence mode="wait">
            {!showOnboarding ? (
              <motion.div
                key="cta"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center mb-8"
              >
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C7517E]/10 to-[#F59E0B]/10 px-4 py-2 rounded-full mb-4">
                  <Gift className="w-5 h-5 text-[#C7517E]" />
                  <span className="text-[#C7517E] font-semibold text-sm">
                    Bonus: Personaliza tu experiencia
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#022133] mb-2">
                  Cuéntanos sobre tu negocio
                </h3>
                <p className="text-[#022133]/70 mb-6 max-w-lg mx-auto">
                  Completa un breve cuestionario para que podamos personalizar el workshop
                  a tus necesidades específicas. ¡Solo toma 2 minutos!
                </p>

                <button
                  onClick={() => setShowOnboarding(true)}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C7517E] to-[#b8456f] hover:from-[#d4608d] hover:to-[#C7517E] text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg shadow-[#C7517E]/30 hover:shadow-xl transform hover:scale-105"
                >
                  <Sparkles className="w-5 h-5" />
                  Personalizar Mi Experiencia
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8"
              >
                <div className="border-t border-gray-200 pt-8 mb-6">
                  <h3 className="text-xl font-bold text-[#022133] mb-2 text-center">
                    Personaliza tu experiencia del workshop
                  </h3>
                  <p className="text-[#022133]/60 text-center text-sm mb-6">
                    Esta información nos ayudará a adaptar el contenido a tus necesidades
                  </p>
                </div>

                {loading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-[#2CB6D7]" />
                  </div>
                ) : (
                  <OnboardingForm
                    registrationId={registrationId || 'demo'}
                    onComplete={handleOnboardingComplete}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-[#022133]/5 rounded-xl p-6 mb-8"
          >
            <h3 className="font-bold text-[#022133] mb-3">Próximos pasos:</h3>
            <ul className="space-y-2 text-[#022133]/70">
              <li className="flex items-start gap-2">
                <span className="text-[#36B3AE] font-bold">1.</span>
                Revisa tu email (incluyendo spam) para la confirmación
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#36B3AE] font-bold">2.</span>
                Agrega el evento a tu calendario
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#36B3AE] font-bold">3.</span>
                Únete a la comunidad privada (link en el email)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#36B3AE] font-bold">4.</span>
                {showOnboarding
                  ? '¡Completa el cuestionario arriba para personalizar tu experiencia!'
                  : '¡Prepárate para transformar tu negocio!'}
              </li>
            </ul>
          </motion.div>

          {/* CTA */}
          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-[#022133] hover:bg-[#200F5D] text-white font-bold py-4 px-8 rounded-xl transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver al Inicio
            </Link>
          </div>
        </motion.div>

        {/* Support note */}
        <p className="text-center text-[#FCFEFB]/60 mt-6 text-sm">
          ¿Tienes preguntas? Escríbenos a{' '}
          <a
            href="mailto:sales@sinsajocreators.com"
            className="text-[#2CB6D7] hover:underline"
          >
            sales@sinsajocreators.com
          </a>
        </p>
      </div>
    </main>
  )
}

export default function WorkshopSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gradient-to-br from-[#022133] to-[#200F5D] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#2CB6D7]" />
        </main>
      }
    >
      <SuccessContent />
    </Suspense>
  )
}
