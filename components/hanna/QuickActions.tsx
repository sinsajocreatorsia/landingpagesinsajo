'use client'

import {
  Image, Smartphone, Mail, Video, MessageCircle, Send,
  ShieldCheck, Target, Calendar, Rocket, BarChart3, Lock,
} from 'lucide-react'
import { QUICK_ACTION_TEMPLATES, CATEGORY_LABELS, enrichTemplate, type QuickActionTemplate } from '@/lib/hanna/quick-action-templates'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Image, Smartphone, Mail, Video, MessageCircle, Send,
  ShieldCheck, Target, Calendar, Rocket, BarChart3,
}

interface QuickActionsProps {
  plan: string
  businessProfile?: {
    business_name?: string
    target_audience?: string
    products_services?: string
    brand_voice?: string
  }
  onSelectAction: (enrichedPrompt: string, templateId: string) => void
  compact?: boolean
}

export function QuickActions({ plan, businessProfile, onSelectAction, compact = false }: QuickActionsProps) {
  const isPro = plan === 'pro' || plan === 'business'

  const categories = Object.keys(CATEGORY_LABELS) as Array<QuickActionTemplate['category']>

  const handleClick = (template: QuickActionTemplate) => {
    if (template.proOnly && !isPro) return
    const enrichedPrompt = enrichTemplate(template, businessProfile || {})
    onSelectAction(enrichedPrompt, template.id)
  }

  if (compact) {
    // Show only free templates as horizontal scrollable chips (for onboarding)
    const freeTemplates = QUICK_ACTION_TEMPLATES.filter(t => !t.proOnly).slice(0, 4)
    return (
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {freeTemplates.map((template) => {
          const IconComponent = iconMap[template.icon]
          return (
            <button
              key={template.id}
              onClick={() => handleClick(template)}
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-[#2CB6D7]/30 transition-all"
            >
              {IconComponent && <IconComponent className="w-4 h-4 text-[#2CB6D7]" />}
              <span className="text-sm text-white/80 whitespace-nowrap">{template.title}</span>
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-white mb-1">Acciones Rapidas</h3>
        <p className="text-sm text-white/50">Selecciona una accion y Hanna la personaliza para tu negocio</p>
      </div>

      {categories.map((category) => {
        const templates = QUICK_ACTION_TEMPLATES.filter(t => t.category === category)
        return (
          <div key={category}>
            <h4 className="text-xs uppercase tracking-wider text-white/40 mb-3 px-1">
              {CATEGORY_LABELS[category]}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {templates.map((template) => {
                const IconComponent = iconMap[template.icon]
                const locked = template.proOnly && !isPro

                return (
                  <button
                    key={template.id}
                    onClick={() => handleClick(template)}
                    disabled={locked}
                    className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                      locked
                        ? 'bg-white/[0.02] border-white/5 opacity-50 cursor-not-allowed'
                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-[#2CB6D7]/30 cursor-pointer'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                      {locked ? (
                        <Lock className="w-4 h-4 text-white/30" />
                      ) : (
                        IconComponent && <IconComponent className="w-4 h-4 text-[#2CB6D7]" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">{template.title}</span>
                        {locked && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-[#C7517E]/20 text-[#C7517E] rounded-full">
                            Pro
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-white/50 mt-0.5">{template.description}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
