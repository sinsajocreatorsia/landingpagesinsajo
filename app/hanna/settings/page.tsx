'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Volume2,
  Palette,
  MessageSquare,
  Check,
  RotateCcw,
} from 'lucide-react'

interface ToneConfig {
  style: 'energetic' | 'calm' | 'professional' | 'friendly'
  approach: 'direct' | 'detailed' | 'storytelling'
  expertise: 'beginner' | 'intermediate' | 'expert'
  askQuestions: boolean
}

const STYLE_OPTIONS = [
  { value: 'energetic', label: 'Enérgica', emoji: '🔥', desc: 'Directa, con mucha energía' },
  { value: 'calm', label: 'Calmada', emoji: '🧘', desc: 'Reflexiva y pausada' },
  { value: 'professional', label: 'Profesional', emoji: '💼', desc: 'Formal y técnica' },
  { value: 'friendly', label: 'Amigable', emoji: '💙', desc: 'Cercana y cálida' },
] as const

const APPROACH_OPTIONS = [
  { value: 'direct', label: 'Directa', desc: 'Respuestas cortas al grano' },
  { value: 'detailed', label: 'Detallada', desc: 'Análisis profundo con métricas' },
  { value: 'storytelling', label: 'Storytelling', desc: 'Ejemplos y analogías' },
] as const

const EXPERTISE_OPTIONS = [
  { value: 'beginner', label: 'Principiante', desc: 'Explica todo desde cero' },
  { value: 'intermediate', label: 'Intermedio', desc: 'Conocimiento básico de negocios' },
  { value: 'expert', label: 'Experta', desc: 'Terminología avanzada' },
] as const

export default function SettingsPage() {
  const [toneConfig, setToneConfig] = useState<ToneConfig>({
    style: 'friendly',
    approach: 'detailed',
    expertise: 'intermediate',
    askQuestions: true,
  })
  const [saved, setSaved] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  // Load existing config from localStorage
  useEffect(() => {
    // Get userId from any stored tone config key
    const keys = Object.keys(localStorage)
    const toneKey = keys.find(k => k.startsWith('hanna-tone-'))
    if (toneKey) {
      const id = toneKey.replace('hanna-tone-', '')
      setUserId(id)
      try {
        const stored = JSON.parse(localStorage.getItem(toneKey) || '{}')
        if (stored.style) setToneConfig(stored)
      } catch {
        // ignore
      }
    }
  }, [])

  const handleSave = () => {
    if (userId) {
      localStorage.setItem(`hanna-tone-${userId}`, JSON.stringify(toneConfig))
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleReset = () => {
    setToneConfig({
      style: 'friendly',
      approach: 'detailed',
      expertise: 'intermediate',
      askQuestions: true,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#022133] to-[#200F5D]">
      {/* Header */}
      <header className="bg-[#022133]/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            href="/hanna/dashboard"
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm hidden sm:inline">Volver al chat</span>
          </Link>
          <h1 className="text-white font-bold text-lg">Configuración</h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        {/* Tone Style */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Volume2 className="w-5 h-5 text-[#2CB6D7]" />
            <h2 className="text-white font-semibold">Personalidad de Hanna</h2>
          </div>
          <p className="text-white/50 text-sm mb-4">¿Cómo quieres que Hanna te hable?</p>
          <div className="grid grid-cols-2 gap-3">
            {STYLE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setToneConfig(c => ({ ...c, style: opt.value }))}
                className={`p-4 rounded-xl border text-left transition-all ${
                  toneConfig.style === opt.value
                    ? 'bg-[#2CB6D7]/20 border-[#2CB6D7]/50'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <span className="text-2xl">{opt.emoji}</span>
                <p className="text-white font-medium mt-2">{opt.label}</p>
                <p className="text-white/50 text-xs mt-1">{opt.desc}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Approach */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="w-5 h-5 text-[#C7517E]" />
            <h2 className="text-white font-semibold">Estilo de Respuesta</h2>
          </div>
          <div className="space-y-3">
            {APPROACH_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setToneConfig(c => ({ ...c, approach: opt.value }))}
                className={`w-full p-4 rounded-xl border text-left transition-all ${
                  toneConfig.approach === opt.value
                    ? 'bg-[#C7517E]/20 border-[#C7517E]/50'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <p className="text-white font-medium">{opt.label}</p>
                <p className="text-white/50 text-xs mt-1">{opt.desc}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Expertise Level */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Palette className="w-5 h-5 text-[#36B3AE]" />
            <h2 className="text-white font-semibold">Nivel de Expertise</h2>
          </div>
          <div className="space-y-3">
            {EXPERTISE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setToneConfig(c => ({ ...c, expertise: opt.value }))}
                className={`w-full p-4 rounded-xl border text-left transition-all ${
                  toneConfig.expertise === opt.value
                    ? 'bg-[#36B3AE]/20 border-[#36B3AE]/50'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <p className="text-white font-medium">{opt.label}</p>
                <p className="text-white/50 text-xs mt-1">{opt.desc}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Ask Questions Toggle */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white font-semibold">Modo Consultora</h2>
              <p className="text-white/50 text-sm mt-1">
                Hanna hace preguntas antes de dar consejos para personalizar mejor sus respuestas
              </p>
            </div>
            <button
              onClick={() => setToneConfig(c => ({ ...c, askQuestions: !c.askQuestions }))}
              className={`w-14 h-8 rounded-full transition-colors relative ${
                toneConfig.askQuestions ? 'bg-[#2CB6D7]' : 'bg-white/20'
              }`}
            >
              <div
                className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-all ${
                  toneConfig.askQuestions ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Restaurar
          </button>
          <button
            onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#C7517E] to-[#b8456f] text-white font-medium rounded-xl hover:from-[#d4608d] hover:to-[#C7517E] transition-all"
          >
            {saved ? (
              <>
                <Check className="w-5 h-5" />
                Guardado
              </>
            ) : (
              'Guardar Cambios'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
