'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { createBrowserClient } from '@supabase/ssr'
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Loader2, Gift, Check } from 'lucide-react'

export default function HannaSignupPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    couponCode: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [couponValid, setCouponValid] = useState<boolean | null>(null)
  const [couponMessage, setCouponMessage] = useState<string | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (e.target.name === 'couponCode') {
      setCouponValid(null)
      setCouponMessage(null)
    }
  }

  const validateCoupon = async () => {
    if (!formData.couponCode.trim()) return

    try {
      const response = await fetch('/api/hanna/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: formData.couponCode.toUpperCase() }),
      })

      const data = await response.json()

      if (data.valid) {
        setCouponValid(true)
        setCouponMessage(data.message || '3 meses gratis de Hanna Pro')
      } else {
        setCouponValid(false)
        setCouponMessage(data.error || 'Cupón no válido')
      }
    } catch (err) {
      setCouponValid(false)
      setCouponMessage('Error al validar cupón')
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      setIsLoading(false)
      return
    }

    // Validate password strength
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      setIsLoading(false)
      return
    }

    try {
      // Sign up with Supabase
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          },
          emailRedirectTo: `${window.location.origin}/hanna/auth/callback`,
        },
      })

      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          setError('Este email ya está registrado. ¿Quieres iniciar sesión?')
        } else {
          setError(signUpError.message)
        }
        return
      }

      // If coupon is valid, redeem it
      if (couponValid && formData.couponCode && data.user) {
        await fetch('/api/hanna/coupons/redeem', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code: formData.couponCode.toUpperCase(),
            userId: data.user.id,
          }),
        })
      }

      // Redirect to confirmation page
      router.push('/hanna/signup/success')
    } catch (err) {
      setError('Error al crear la cuenta. Intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    setError(null)
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/hanna/auth/callback`,
        },
      })

      if (error) {
        setError(error.message)
      }
    } catch (err) {
      setError('Error al registrarse con Google')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#022133] via-[#0a2e47] to-[#200F5D] flex items-center justify-center p-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 15 }}
            className="w-20 h-20 mx-auto mb-4"
          >
            <Image
              src="/images/sinsajo-logo-1.png"
              alt="Sinsajo Creators"
              width={80}
              height={80}
              className="object-contain"
            />
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">Crear Cuenta</h1>
          <p className="text-white/60">Comienza gratis - 5 mensajes/día</p>
        </div>

        {/* Signup Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <form onSubmit={handleSignup} className="space-y-4">
            {/* Name Field */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-white/80 mb-2">
                Nombre completo
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="María García"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#2CB6D7] focus:ring-2 focus:ring-[#2CB6D7]/20 transition-all"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
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
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  minLength={6}
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

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/80 mb-2">
                Confirmar contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#2CB6D7] focus:ring-2 focus:ring-[#2CB6D7]/20 transition-all"
                />
              </div>
            </div>

            {/* Coupon Code Field */}
            <div>
              <label htmlFor="couponCode" className="block text-sm font-medium text-white/80 mb-2">
                <Gift className="inline w-4 h-4 mr-1" />
                Código de cupón (opcional)
              </label>
              <div className="relative flex gap-2">
                <input
                  id="couponCode"
                  name="couponCode"
                  type="text"
                  value={formData.couponCode}
                  onChange={handleChange}
                  placeholder="WORKSHOP2026"
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#2CB6D7] focus:ring-2 focus:ring-[#2CB6D7]/20 transition-all uppercase"
                />
                <button
                  type="button"
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
              className="w-full py-3 px-4 bg-gradient-to-r from-[#C7517E] to-[#b8456f] text-white font-semibold rounded-xl hover:from-[#d4608d] hover:to-[#C7517E] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creando cuenta...
                </>
              ) : (
                <>
                  Crear Cuenta Gratis
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

          {/* Google Signup */}
          <button
            onClick={handleGoogleSignup}
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

          {/* Login Link */}
          <p className="text-center text-white/60 mt-6">
            ¿Ya tienes cuenta?{' '}
            <Link
              href="/hanna/login"
              className="text-[#2CB6D7] hover:text-[#36B3AE] font-medium transition-colors"
            >
              Iniciar sesión
            </Link>
          </p>
        </div>

        {/* Terms */}
        <p className="text-center text-white/40 text-xs mt-6 px-4">
          Al crear una cuenta, aceptas nuestros{' '}
          <Link href="/terms" className="text-white/60 hover:text-white underline">
            Términos de Servicio
          </Link>{' '}
          y{' '}
          <Link href="/privacy" className="text-white/60 hover:text-white underline">
            Política de Privacidad
          </Link>
        </p>

        {/* Back to Home */}
        <div className="text-center mt-4">
          <Link
            href="/hanna"
            className="text-white/60 hover:text-white text-sm transition-colors"
          >
            ← Volver a la página principal
          </Link>
        </div>
      </motion.div>
    </main>
  )
}
