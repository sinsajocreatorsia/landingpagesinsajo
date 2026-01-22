'use client'

import { useState } from 'react'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import { CreditCard, Loader2 } from 'lucide-react'

interface PaymentButtonsProps {
  price: string
  workshopName: string
}

export default function PaymentButtons({ price, workshopName }: PaymentButtonsProps) {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')

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
        body: JSON.stringify({ email, name, price, workshopName }),
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

  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || ''

  return (
    <div className="space-y-6">
      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Form fields */}
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-[#022133] mb-1">
            Tu nombre completo
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
            Tu email
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

      {/* Stripe Button */}
      <button
        onClick={handleStripePayment}
        disabled={loading}
        className="w-full py-4 px-6 bg-[#C7517E] hover:bg-[#b8456f] disabled:bg-[#C7517E]/50 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-[#C7517E]/30 hover:shadow-xl hover:shadow-[#C7517E]/40 transform hover:scale-[1.02] disabled:transform-none"
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

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-gray-200"></div>
        <span className="text-gray-400 text-sm font-medium">o paga con</span>
        <div className="flex-1 h-px bg-gray-200"></div>
      </div>

      {/* PayPal Button */}
      {paypalClientId && (
        <PayPalScriptProvider
          options={{
            clientId: paypalClientId,
            currency: 'USD',
            intent: 'capture',
          }}
        >
          <PayPalButtons
            style={{
              layout: 'horizontal',
              color: 'gold',
              shape: 'rect',
              label: 'pay',
              height: 50,
            }}
            disabled={!name || !email}
            createOrder={async () => {
              if (!validateForm()) {
                throw new Error('Invalid form')
              }

              const response = await fetch('/api/paypal/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, name, price, workshopName }),
              })
              const order = await response.json()

              if (order.error) {
                setError(order.error)
                throw new Error(order.error)
              }

              return order.id
            }}
            onApprove={async (data) => {
              try {
                const response = await fetch('/api/paypal/capture-order', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    orderID: data.orderID,
                    email,
                    name,
                  }),
                })
                const details = await response.json()

                if (details.status === 'COMPLETED') {
                  window.location.href = '/academy/workshop/success'
                } else {
                  setError('El pago no se completó. Intenta de nuevo.')
                }
              } catch (err) {
                console.error('PayPal capture error:', err)
                setError('Error al completar el pago con PayPal.')
              }
            }}
            onError={(err) => {
              console.error('PayPal error:', err)
              setError('Error con PayPal. Intenta con tarjeta.')
            }}
          />
        </PayPalScriptProvider>
      )}

      {/* Payment note */}
      <p className="text-center text-sm text-gray-500">
        Al completar tu compra, recibirás un email con los detalles de acceso al workshop.
      </p>
    </div>
  )
}
