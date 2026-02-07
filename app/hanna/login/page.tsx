'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { createBrowserClient } from '@supabase/ssr'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react'

// Inner component that uses useSearchParams
function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/hanna/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setError('Email o contraseña incorrectos')
        } else {
          setError(error.message)
        }
        return
      }

      router.push(redirectTo)
      router.refresh()
    } catch (err) {
      setError('Error al iniciar sesión. Intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setError(null)
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/hanna/auth/callback?redirect=${redirectTo}`,
        },
      })

      if (error) {
        setError(error.message)
      }
    } catch (err) {
      setError('Error al iniciar sesión con Google')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Logo & Title */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          className="w-20 h-20 mx-auto mb-4"
        >
          <Link href="/hanna">
            <Image
              src="/images/sinsajo-logo-1.png"
              alt="Sinsajo Creators"
              width={80}
              height={80}
              className="object-contain cursor-pointer hover:opacity-80 transition-opacity"
            />
          </Link>
        </motion.div>
        <h1 className="text-3xl font-bold text-white mb-2">Bienvenida a Hanna</h1>
        <p className="text-white/60">Tu asistente de marketing con IA</p>
      </div>

      {/* Login Form */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#2CB6D7] focus:ring-2 focus:ring-[#2CB6D7]/20 transition-all"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#2CB6D7] focus:ring-2 focus:ring-[#2CB6D7]/20 transition-all"
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

          {/* Forgot Password */}
          <div className="text-right">
            <Link
              href="/hanna/forgot-password"
              className="text-sm text-[#2CB6D7] hover:text-[#36B3AE] transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/20 border border-red-500/30 text-red-200 px-4 py-3 rounded-xl text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-gradient-to-r from-[#C7517E] to-[#b8456f] text-white font-semibold rounded-xl hover:from-[#d4608d] hover:to-[#C7517E] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Iniciando sesión...
              </>
            ) : (
              <>
                Iniciar Sesión
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-white/20" />
          <span className="text-white/40 text-sm">o continúa con</span>
          <div className="flex-1 h-px bg-white/20" />
        </div>

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full py-3 px-4 bg-white text-gray-800 font-semibold rounded-xl hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google
        </button>

        {/* Sign Up Link */}
        <p className="text-center text-white/60 mt-6">
          ¿No tienes cuenta?{' '}
          <Link
            href="/hanna/signup"
            className="text-[#2CB6D7] hover:text-[#36B3AE] font-medium transition-colors"
          >
            Crear cuenta gratis
          </Link>
        </p>
      </div>

      {/* Back to Home */}
      <div className="text-center mt-6">
        <Link
          href="/hanna"
          className="text-white/60 hover:text-white text-sm transition-colors"
        >
          ← Volver a la página principal
        </Link>
      </div>
    </>
  )
}

// Loading fallback
function LoginFormSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-full" />
      <div className="h-8 w-48 mx-auto mb-2 bg-white/20 rounded" />
      <div className="h-4 w-32 mx-auto mb-8 bg-white/20 rounded" />
      <div className="bg-white/10 rounded-2xl p-8 space-y-5">
        <div className="h-12 bg-white/20 rounded-xl" />
        <div className="h-12 bg-white/20 rounded-xl" />
        <div className="h-12 bg-white/20 rounded-xl" />
      </div>
    </div>
  )
}

// Main page component with Suspense
export default function HannaLoginPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#022133] via-[#0a2e47] to-[#200F5D] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Suspense fallback={<LoginFormSkeleton />}>
          <LoginForm />
        </Suspense>
      </motion.div>
    </main>
  )
}
