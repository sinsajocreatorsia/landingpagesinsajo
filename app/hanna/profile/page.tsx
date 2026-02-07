'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, Loader2, User, Briefcase, Globe, Check } from 'lucide-react'

interface ProfileData {
  display_name: string
  gender: 'female' | 'male' | 'non_binary' | ''
  country: string
  business_name: string
  business_type: string
  target_audience: string
  brand_voice: string
  products_services: string
  unique_value_proposition: string
  custom_instructions: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  const [profile, setProfile] = useState<ProfileData>({
    display_name: '',
    gender: '',
    country: '',
    business_name: '',
    business_type: '',
    target_audience: '',
    brand_voice: '',
    products_services: '',
    unique_value_proposition: '',
    custom_instructions: '',
  })

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    loadProfile()
  }, [])

  async function loadProfile() {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/hanna/login')
        return
      }

      setUserId(session.user.id)

      const { data } = await supabase
        .from('hanna_business_profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single()

      if (data) {
        setProfile({
          display_name: data.display_name || session.user.user_metadata?.full_name || '',
          gender: data.gender || '',
          country: data.country || '',
          business_name: data.business_name || '',
          business_type: data.business_type || '',
          target_audience: data.target_audience || '',
          brand_voice: data.brand_voice || '',
          products_services: data.products_services || '',
          unique_value_proposition: data.unique_value_proposition || '',
          custom_instructions: data.custom_instructions || '',
        })
      } else {
        setProfile(prev => ({
          ...prev,
          display_name: session.user.user_metadata?.full_name || '',
        }))
      }
    } catch (err) {
      console.error('Error loading profile:', err)
    } finally {
      setLoading(false)
    }
  }

  async function saveProfile() {
    if (!userId) return
    setSaving(true)
    setError(null)
    setSaved(false)

    try {
      const { error: upsertError } = await supabase
        .from('hanna_business_profiles')
        .upsert({
          user_id: userId,
          ...profile,
        }, { onConflict: 'user_id' })

      if (upsertError) throw upsertError

      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al guardar'
      setError(message)
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field: keyof ProfileData, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#022133] to-[#200F5D] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#2CB6D7] animate-spin" />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#022133] to-[#200F5D] p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/hanna/dashboard"
            className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Mi Perfil</h1>
            <p className="text-white/60 text-sm">Personaliza tu experiencia con Hanna</p>
          </div>
        </div>

        {/* Personal Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-6"
        >
          <h2 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-[#2CB6D7]" />
            Informacion Personal
          </h2>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Nombre
              </label>
              <input
                type="text"
                value={profile.display_name}
                onChange={(e) => handleChange('display_name', e.target.value)}
                placeholder="Tu nombre"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#2CB6D7] focus:ring-2 focus:ring-[#2CB6D7]/20"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Genero
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'female', label: 'Femenino' },
                  { value: 'male', label: 'Masculino' },
                  { value: 'non_binary', label: 'No binario' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleChange('gender', option.value)}
                    className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                      profile.gender === option.value
                        ? 'bg-[#2CB6D7]/20 border-[#2CB6D7] text-[#2CB6D7]'
                        : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Pais
              </label>
              <input
                type="text"
                value={profile.country}
                onChange={(e) => handleChange('country', e.target.value)}
                placeholder="Ej: Costa Rica, Mexico, Colombia"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#2CB6D7] focus:ring-2 focus:ring-[#2CB6D7]/20"
              />
            </div>
          </div>
        </motion.div>

        {/* Business Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-6"
        >
          <h2 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-[#C7517E]" />
            Mi Negocio
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Nombre del negocio</label>
              <input
                type="text"
                value={profile.business_name}
                onChange={(e) => handleChange('business_name', e.target.value)}
                placeholder="Ej: Mi Tienda Online"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#2CB6D7] focus:ring-2 focus:ring-[#2CB6D7]/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Tipo de negocio</label>
              <input
                type="text"
                value={profile.business_type}
                onChange={(e) => handleChange('business_type', e.target.value)}
                placeholder="Ej: E-commerce, Consultoria, Servicios"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#2CB6D7] focus:ring-2 focus:ring-[#2CB6D7]/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Audiencia objetivo</label>
              <input
                type="text"
                value={profile.target_audience}
                onChange={(e) => handleChange('target_audience', e.target.value)}
                placeholder="Ej: Mujeres emprendedoras 25-45 anos"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#2CB6D7] focus:ring-2 focus:ring-[#2CB6D7]/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Productos o servicios</label>
              <textarea
                value={profile.products_services}
                onChange={(e) => handleChange('products_services', e.target.value)}
                placeholder="Describe lo que vendes u ofreces"
                rows={3}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#2CB6D7] focus:ring-2 focus:ring-[#2CB6D7]/20 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Propuesta de valor unica</label>
              <textarea
                value={profile.unique_value_proposition}
                onChange={(e) => handleChange('unique_value_proposition', e.target.value)}
                placeholder="Que te hace diferente de la competencia?"
                rows={2}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#2CB6D7] focus:ring-2 focus:ring-[#2CB6D7]/20 resize-none"
              />
            </div>
          </div>
        </motion.div>

        {/* Custom Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-6"
        >
          <h2 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#36B3AE]" />
            Instrucciones para Hanna
          </h2>

          <textarea
            value={profile.custom_instructions}
            onChange={(e) => handleChange('custom_instructions', e.target.value)}
            placeholder="Instrucciones especiales para Hanna. Ej: Siempre responde en espanol, enfocate en estrategias de redes sociales..."
            rows={4}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#2CB6D7] focus:ring-2 focus:ring-[#2CB6D7]/20 resize-none"
          />
        </motion.div>

        {/* Error */}
        {error && (
          <div className="mb-4 px-4 py-3 bg-red-500/20 border border-red-500/30 text-red-200 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={saveProfile}
            disabled={saving}
            className="w-full py-4 px-6 bg-gradient-to-r from-[#C7517E] to-[#b8456f] text-white font-semibold rounded-xl hover:from-[#d4608d] hover:to-[#C7517E] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Guardando...
              </>
            ) : saved ? (
              <>
                <Check className="w-5 h-5" />
                Guardado
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Guardar Perfil
              </>
            )}
          </button>
        </motion.div>
      </div>
    </main>
  )
}
