'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import { ArrowLeft, Mail, Check, Loader2 } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/hanna/login`,
      })

      if (resetError) {
        setError(resetError.message)
      } else {
        setSent(true)
      }
    } catch {
      setError('Error al enviar el correo. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#022133] to-[#200F5D] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Correo Enviado</h1>
          <p className="text-white/60 mb-2">
            Hemos enviado un enlace de recuperación a:
          </p>
          <p className="text-[#2CB6D7] font-medium mb-6">{email}</p>
          <p className="text-white/40 text-sm mb-8">
            Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña. Si no lo encuentras, revisa la carpeta de spam.
          </p>
          <Link
            href="/hanna/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#C7517E] to-[#b8456f] text-white font-medium rounded-xl hover:from-[#d4608d] hover:to-[#C7517E] transition-all"
          >
            Volver al Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#022133] to-[#200F5D] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Back Link */}
        <Link
          href="/hanna/login"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al Login
        </Link>

        {/* Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="w-14 h-14 bg-[#2CB6D7]/20 rounded-full flex items-center justify-center mb-6">
            <Mail className="w-7 h-7 text-[#2CB6D7]" />
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">
            ¿Olvidaste tu contraseña?
          </h1>
          <p className="text-white/60 mb-6">
            Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white/70 text-sm mb-2">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#2CB6D7]"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !email}
              className="w-full py-3 bg-gradient-to-r from-[#C7517E] to-[#b8456f] text-white font-medium rounded-xl hover:from-[#d4608d] hover:to-[#C7517E] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Enviando...
                </>
              ) : (
                'Enviar enlace de recuperación'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
