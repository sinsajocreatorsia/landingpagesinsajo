'use client'

import { useState, useEffect } from 'react'
import { CreditCard, Loader2, Shield, Lock } from 'lucide-react'

interface PaymentButtonsProps {
  price: string
  workshopName: string
}

export default function PaymentButtons({ price, workshopName }: PaymentButtonsProps) {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [utmParams, setUtmParams] = useState({
    utm_source: '',
    utm_medium: '',
    utm_campaign: '',
  })

  // Capture UTM parameters on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search)
      setUtmParams({
        utm_source: searchParams.get('utm_source') || '',
        utm_medium: searchParams.get('utm_medium') || '',
        utm_campaign: searchParams.get('utm_campaign') || '',
      })
    }
  }, [])

  const validateForm = () => {
    if (!name.trim()) {
      setError('Por favor ingresa tu nombre')
      return false
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Por favor ingresa un email válido')
      return false
    }
    setError('')
    return true
  }

  const handleStripePayment = async () => {
    if (!validateForm()) return

    setLoading(true)
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name,
          phone,
          country: 'US',
          price,
          workshopName,
          ...utmParams,
        }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        setError('Error al procesar el pago. Intenta de nuevo.')
      }
    } catch (err) {
      console.error('Error:', err)
      setError('Error de conexión. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm animate-shake">
          {error}
        </div>
      )}

      {/* Form fields */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[#022133] mb-1">
              Tu nombre completo *
            </label>
            <input
              id="name"
              type="text"
              placeholder="María García"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-white text-[#022133] focus:border-[#2CB6D7] focus:ring-2 focus:ring-[#2CB6D7]/20 outline-none transition-all"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#022133] mb-1">
              Tu email *
            </label>
            <input
              id="email"
              type="email"
              placeholder="maria@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-white text-[#022133] focus:border-[#2CB6D7] focus:ring-2 focus:ring-[#2CB6D7]/20 outline-none transition-all"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-[#022133] mb-1">
            Teléfono / WhatsApp
          </label>
          <input
            id="phone"
            type="tel"
            placeholder="+1 555 123 4567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-white text-[#022133] focus:border-[#2CB6D7] focus:ring-2 focus:ring-[#2CB6D7]/20 outline-none transition-all"
          />
        </div>
      </div>

      {/* Stripe Button */}
      <button
        onClick={handleStripePayment}
        disabled={loading}
        className="w-full py-4 px-6 bg-gradient-to-r from-[#C7517E] to-[#b8456f] hover:from-[#d4608d] hover:to-[#C7517E] disabled:from-[#C7517E]/50 disabled:to-[#b8456f]/50 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-[#C7517E]/30 hover:shadow-xl hover:shadow-[#C7517E]/40 transform hover:scale-[1.02] disabled:transform-none"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Procesando...</span>
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            <span>Pagar con Tarjeta - ${price} USD</span>
          </>
        )}
      </button>

      {/* Security badges */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
        <div className="flex items-center gap-1.5 text-gray-500 text-xs">
          <Lock className="w-4 h-4 text-[#36B3AE]" />
          <span>Encriptación SSL</span>
        </div>
        <div className="flex items-center gap-1.5 text-gray-500 text-xs">
          <Shield className="w-4 h-4 text-[#36B3AE]" />
          <span>Pago 100% seguro</span>
        </div>
      </div>

      {/* Payment note */}
      <p className="text-center text-sm text-gray-500">
        Al completar tu compra, recibirás un email con los detalles de acceso al workshop.
      </p>
    </div>
  )
}
