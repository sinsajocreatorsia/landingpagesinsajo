'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Sparkles, MessageCircle, Zap, Brain } from 'lucide-react'

export interface ToneConfig {
  style: 'energetic' | 'calm' | 'professional' | 'friendly'
  approach: 'direct' | 'detailed' | 'storytelling'
  expertise: 'beginner' | 'intermediate' | 'expert'
  askQuestions: boolean
}

interface ToneConfigDialogProps {
  onComplete: (config: ToneConfig) => void
  userName: string
}

export function ToneConfigDialog({ onComplete, userName }: ToneConfigDialogProps) {
  const [config, setConfig] = useState<ToneConfig>({
    style: 'friendly',
    approach: 'detailed',
    expertise: 'intermediate',
    askQuestions: true,
  })

  const handleSubmit = () => {
    onComplete(config)
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-[#022133] to-[#200F5D] border border-white/20 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                ¡Hola {userName.split(' ')[0]}! 👋
              </h2>
              <p className="text-white/70">
                Soy Hanna, tu consultora estratégica de negocios. Antes de empezar, ayúdame a conocerte mejor para poder asesorarte de la manera que más te funcione.
              </p>
            </div>
          </div>
        </div>

        {/* Configuration Options */}
        <div className="p-6 space-y-6">
          {/* Communication Style */}
          <div>
            <label className="block text-white font-medium mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#2CB6D7]" />
              ¿Cómo te gustaría que me comunique contigo?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => setConfig({ ...config, style: 'energetic' })}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  config.style === 'energetic'
                    ? 'border-[#2CB6D7] bg-[#2CB6D7]/10'
                    : 'border-white/20 bg-white/5 hover:border-white/40'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-[#2CB6D7]" />
                  <span className="text-white font-medium">Enérgica y Directa</span>
                </div>
                <p className="text-white/60 text-sm">
                  Directa, sin rodeos, muy analítica y orientada a resultados
                </p>
              </button>

              <button
                onClick={() => setConfig({ ...config, style: 'calm' })}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  config.style === 'calm'
                    ? 'border-[#2CB6D7] bg-[#2CB6D7]/10'
                    : 'border-white/20 bg-white/5 hover:border-white/40'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-5 h-5 text-[#36B3AE]" />
                  <span className="text-white font-medium">Calmada y Reflexiva</span>
                </div>
                <p className="text-white/60 text-sm">
                  Análisis profundo, pensamiento estratégico pausado
                </p>
              </button>

              <button
                onClick={() => setConfig({ ...config, style: 'professional' })}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  config.style === 'professional'
                    ? 'border-[#2CB6D7] bg-[#2CB6D7]/10'
                    : 'border-white/20 bg-white/5 hover:border-white/40'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <MessageCircle className="w-5 h-5 text-[#C7517E]" />
                  <span className="text-white font-medium">Profesional y Formal</span>
                </div>
                <p className="text-white/60 text-sm">
                  Tono corporativo, lenguaje técnico y preciso
                </p>
              </button>

              <button
                onClick={() => setConfig({ ...config, style: 'friendly' })}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  config.style === 'friendly'
                    ? 'border-[#2CB6D7] bg-[#2CB6D7]/10'
                    : 'border-white/20 bg-white/5 hover:border-white/40'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-[#FFD700]" />
                  <span className="text-white font-medium">Amigable y Cercana</span>
                </div>
                <p className="text-white/60 text-sm">
                  Como una amiga experta que te entiende y apoya
                </p>
              </button>
            </div>
          </div>

          {/* Approach Style */}
          <div>
            <label className="block text-white font-medium mb-3">
              ¿Cómo prefieres que te dé consejos?
            </label>
            <div className="space-y-2">
              <button
                onClick={() => setConfig({ ...config, approach: 'direct' })}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  config.approach === 'direct'
                    ? 'border-[#2CB6D7] bg-[#2CB6D7]/10'
                    : 'border-white/20 bg-white/5 hover:border-white/40'
                }`}
              >
                <span className="text-white font-medium">Directo al grano</span>
                <p className="text-white/60 text-sm mt-1">
                  Dame la respuesta rápida y accionable (2-3 oraciones)
                </p>
              </button>

              <button
                onClick={() => setConfig({ ...config, approach: 'detailed' })}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  config.approach === 'detailed'
                    ? 'border-[#2CB6D7] bg-[#2CB6D7]/10'
                    : 'border-white/20 bg-white/5 hover:border-white/40'
                }`}
              >
                <span className="text-white font-medium">Explicaciones detalladas</span>
                <p className="text-white/60 text-sm mt-1">
                  Quiero entender el por qué, con números y análisis
                </p>
              </button>

              <button
                onClick={() => setConfig({ ...config, approach: 'storytelling' })}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  config.approach === 'storytelling'
                    ? 'border-[#2CB6D7] bg-[#2CB6D7]/10'
                    : 'border-white/20 bg-white/5 hover:border-white/40'
                }`}
              >
                <span className="text-white font-medium">Con ejemplos y casos reales</span>
                <p className="text-white/60 text-sm mt-1">
                  Usa analogías, historias y ejemplos concretos
                </p>
              </button>
            </div>
          </div>

          {/* Expertise Level */}
          <div>
            <label className="block text-white font-medium mb-3">
              ¿Cuál es tu nivel de experiencia en negocios?
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setConfig({ ...config, expertise: 'beginner' })}
                className={`p-4 rounded-xl border-2 transition-all text-center ${
                  config.expertise === 'beginner'
                    ? 'border-[#2CB6D7] bg-[#2CB6D7]/10'
                    : 'border-white/20 bg-white/5 hover:border-white/40'
                }`}
              >
                <span className="text-white font-medium block">Principiante</span>
                <p className="text-white/60 text-xs mt-1">Explícame todo</p>
              </button>

              <button
                onClick={() => setConfig({ ...config, expertise: 'intermediate' })}
                className={`p-4 rounded-xl border-2 transition-all text-center ${
                  config.expertise === 'intermediate'
                    ? 'border-[#2CB6D7] bg-[#2CB6D7]/10'
                    : 'border-white/20 bg-white/5 hover:border-white/40'
                }`}
              >
                <span className="text-white font-medium block">Intermedio</span>
                <p className="text-white/60 text-xs mt-1">Sé lo básico</p>
              </button>

              <button
                onClick={() => setConfig({ ...config, expertise: 'expert' })}
                className={`p-4 rounded-xl border-2 transition-all text-center ${
                  config.expertise === 'expert'
                    ? 'border-[#2CB6D7] bg-[#2CB6D7]/10'
                    : 'border-white/20 bg-white/5 hover:border-white/40'
                }`}
              >
                <span className="text-white font-medium block">Avanzado</span>
                <p className="text-white/60 text-xs mt-1">Soy experta</p>
              </button>
            </div>
          </div>

          {/* Consultative Approach */}
          <div className="bg-[#2CB6D7]/10 border border-[#2CB6D7]/30 rounded-xl p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={config.askQuestions}
                onChange={(e) => setConfig({ ...config, askQuestions: e.target.checked })}
                className="mt-1 w-5 h-5 rounded border-[#2CB6D7] text-[#2CB6D7] focus:ring-[#2CB6D7]"
              />
              <div>
                <span className="text-white font-medium block">
                  Modo Consultora Estratégica (Recomendado)
                </span>
                <p className="text-white/70 text-sm mt-1">
                  Haré preguntas sobre tu negocio antes de darte consejos. No respondo por responder - necesito entender tu contexto para ayudarte mejor.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10">
          <button
            onClick={handleSubmit}
            className="w-full py-4 px-6 bg-gradient-to-r from-[#2CB6D7] to-[#36B3AE] text-white font-medium rounded-xl hover:from-[#36B3AE] hover:to-[#2CB6D7] transition-all shadow-lg shadow-[#2CB6D7]/20"
          >
            Empezar a chatear con Hanna
          </button>
          <p className="text-white/50 text-xs text-center mt-3">
            Puedes cambiar estas preferencias en cualquier momento desde Configuración
          </p>
        </div>
      </motion.div>
    </div>
  )
}
