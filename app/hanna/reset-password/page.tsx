'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createBrowserClient } from '@supabase/ssr'
import { Lock, Eye, EyeOff, Check, Loader2, AlertTriangle } from 'lucide-react'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [sessionReady, setSessionReady] = useState(false)
  const [noSession, setNoSession] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    // Supabase automatically picks up the recovery token from the URL hash
    // and establishes a session. We just need to wait for it.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setSessionReady(true)
      }
    })

    // Also check if there's already a session (user might have already been redirected)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSessionReady(true)
      } else {
        // Give Supabase a moment to process the hash
        setTimeout(() => {
          supabase.auth.getSession().then(({ data: { session: s } }) => {
            if (s) {
              setSessionReady(true)
            } else {
              setNoSession(true)
            }
          })
        }, 2000)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Las contrasenas no coinciden')
      return
    }
    if (password.length < 8) {
      setError('La contrasena debe tener al menos 8 caracteres')
      return
    }
    if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      setError('La contrasena debe incluir al menos una letra y un numero')
      return
    }

    setLoading(true)

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      })

      if (updateError) {
        setError(updateError.message)
      } else {
        setSuccess(true)
        setTimeout(() => {
          router.push('/hanna/dashboard')
        }, 3000)
      }
    } catch {
      setError('Error al actualizar la contrasena. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#022133] to-[#200F5D] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Contrasena Actualizada</h1>
          <p className="text-white/60 mb-6">
            Tu contrasena ha sido cambiada exitosamente. Redirigiendo al dashboard...
          </p>
          <Link
            href="/hanna/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#C7517E] to-[#b8456f] text-white font-medium rounded-xl hover:from-[#d4608d] hover:to-[#C7517E] transition-all"
          >
            Ir al Dashboard
          </Link>
        </div>
      </div>
    )
  }

  // No session - invalid or expired link
  if (noSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#022133] to-[#200F5D] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-yellow-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Enlace Invalido</h1>
          <p className="text-white/60 mb-6">
            Este enlace de recuperacion ha expirado o ya fue utilizado. Solicita uno nuevo.
          </p>
          <Link
            href="/hanna/forgot-password"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#C7517E] to-[#b8456f] text-white font-medium rounded-xl hover:from-[#d4608d] hover:to-[#C7517E] transition-all"
          >
            Solicitar nuevo enlace
          </Link>
        </div>
      </div>
    )
  }

  // Loading - waiting for session
  if (!sessionReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#022133] to-[#200F5D] flex items-center justify-center px-4">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-[#2CB6D7] animate-spin mx-auto mb-4" />
          <p className="text-white/60">Verificando enlace de recuperacion...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#022133] to-[#200F5D] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/hanna">
            <Image
              src="/images/sinsajo-logo-1.png"
              alt="Sinsajo Creators"
              width={64}
              height={64}
              className="object-contain mx-auto mb-4 hover:opacity-80 transition-opacity"
            />
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">Nueva Contrasena</h1>
          <p className="text-white/60">Ingresa tu nueva contrasena</p>
        </div>

        {/* Form */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-white/70 text-sm mb-2">
                Nueva contrasena
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimo 8 caracteres"
                  required
                  minLength={8}
                  className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#2CB6D7]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-white/70 text-sm mb-2">
                Confirmar contrasena
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repite tu contrasena"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#2CB6D7]"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !password || !confirmPassword}
              className="w-full py-3 bg-gradient-to-r from-[#C7517E] to-[#b8456f] text-white font-medium rounded-xl hover:from-[#d4608d] hover:to-[#C7517E] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Actualizando...
                </>
              ) : (
                'Actualizar Contrasena'
              )}
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <Link
            href="/hanna/login"
            className="text-white/60 hover:text-white text-sm transition-colors"
          >
            Volver al Login
          </Link>
        </div>
      </div>
    </div>
  )
}
