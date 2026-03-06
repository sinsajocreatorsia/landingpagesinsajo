'use client'

import Link from 'next/link'
import Image from 'next/image'
import {
  X,
  Plus,
  MessageSquare,
  Settings,
  LogOut,
  Crown,
  History,
  User,
  CreditCard,
  Palette,
  Brain,
  LayoutGrid,
  ImageIcon,
} from 'lucide-react'
import type { ThemeId } from '@/lib/theme-context'

interface ThemeColors {
  sidebarBg: string
  cardBorder: string
  textPrimary: string
  textMuted: string
  textSecondary: string
  accent: string
  bgFrom: string
  bgTo: string
}

interface ThemeConfig {
  name: string
  colors: ThemeColors
}

interface SidebarProps {
  user: { fullName: string; email: string }
  plan: 'free' | 'pro' | 'business'
  theme: { colors: ThemeColors }
  themeId: ThemeId
  setTheme: (id: ThemeId) => void
  allThemes: Record<ThemeId, ThemeConfig>
  onClose: () => void
  onNewChat: () => void
  onLogout: () => void
  isLight: boolean
  hoverBg: string
  activeBg: string
  borderClass: string
}

export function DashboardSidebar({
  user,
  plan,
  theme,
  themeId,
  setTheme,
  allThemes,
  onClose,
  onNewChat,
  onLogout,
  isLight,
  hoverBg,
  activeBg,
  borderClass,
}: SidebarProps) {
  return (
    <aside
      className="fixed inset-y-0 left-0 w-64 border-r z-50 flex flex-col lg:sticky lg:top-0 lg:z-auto lg:h-screen flex-shrink-0"
      style={{ backgroundColor: theme.colors.sidebarBg, borderColor: theme.colors.cardBorder }}
    >
      {/* Sidebar Header */}
      <div className={`px-3 py-3 border-b ${borderClass} flex items-center justify-between flex-shrink-0`}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
            <Image src="/images/hanna-ai.png" alt="Hanna" width={32} height={32} className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="font-semibold text-sm" style={{ color: theme.colors.textPrimary }}>Hanna</h2>
            <p className="text-[10px]" style={{ color: theme.colors.textMuted }}>Tu asistente IA</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className={`p-1.5 transition-colors ${hoverBg} rounded-md`}
          style={{ color: theme.colors.textMuted }}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* New Chat Button */}
      <div className="px-3 py-2 flex-shrink-0">
        <button
          onClick={onNewChat}
          className={`w-full py-2 px-3 ${activeBg} ${hoverBg} border ${borderClass} rounded-lg text-sm flex items-center gap-2 transition-colors`}
          style={{ color: theme.colors.textPrimary }}
        >
          <Plus className="w-4 h-4" />
          Nueva conversación
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-3 py-1 space-y-0.5 overflow-y-auto min-h-0">
        <Link
          href="/hanna/dashboard"
          className={`flex items-center gap-2.5 px-3 py-2 ${activeBg} rounded-lg text-sm`}
          style={{ color: theme.colors.textPrimary }}
        >
          <MessageSquare className="w-4 h-4" />
          Chat
        </Link>
        <Link
          href="/hanna/history"
          className={`flex items-center gap-2.5 px-3 py-2 ${hoverBg} rounded-lg transition-colors text-sm`}
          style={{ color: theme.colors.textSecondary }}
        >
          <History className="w-4 h-4" />
          Historial
        </Link>
        <Link
          href="/hanna/prompts"
          className={`flex items-center gap-2.5 px-3 py-2 ${hoverBg} rounded-lg transition-colors text-sm`}
          style={{ color: theme.colors.textSecondary }}
        >
          <ImageIcon className="w-4 h-4" />
          Biblioteca de Prompts
        </Link>
        <Link
          href="/hanna/profile"
          className={`flex items-center gap-2.5 px-3 py-2 ${hoverBg} rounded-lg transition-colors text-sm`}
          style={{ color: theme.colors.textSecondary }}
        >
          <User className="w-4 h-4" />
          Perfil de Negocio
        </Link>
        <Link
          href="/hanna/architecture"
          className={`flex items-center gap-2.5 px-3 py-2 ${hoverBg} rounded-lg transition-colors text-sm`}
          style={{ color: theme.colors.textSecondary }}
        >
          <LayoutGrid className="w-4 h-4" />
          Arquitectura
          {plan === 'free' && (
            <Crown className="w-3 h-3 text-[#C7517E] ml-auto" />
          )}
        </Link>
        <Link
          href="/hanna/memory"
          className={`flex items-center gap-2.5 px-3 py-2 ${hoverBg} rounded-lg transition-colors text-sm`}
          style={{ color: theme.colors.textSecondary }}
        >
          <Brain className="w-4 h-4" />
          Memoria
        </Link>
        <Link
          href="/hanna/settings"
          className={`flex items-center gap-2.5 px-3 py-2 ${hoverBg} rounded-lg transition-colors text-sm`}
          style={{ color: theme.colors.textSecondary }}
        >
          <Settings className="w-4 h-4" />
          Configuración
        </Link>
        <Link
          href="/hanna/billing"
          className={`flex items-center gap-2.5 px-3 py-2 ${hoverBg} rounded-lg transition-colors text-sm`}
          style={{ color: theme.colors.textSecondary }}
        >
          <CreditCard className="w-4 h-4" />
          Facturación
        </Link>
      </nav>

      {/* Bottom section */}
      <div className="flex-shrink-0">
        {/* Theme Section */}
        <div className={`px-3 py-2 border-t ${borderClass}`}>
          <div className="flex items-center gap-2 mb-2">
            <Palette className="w-3.5 h-3.5" style={{ color: theme.colors.textMuted }} />
            <p className="text-[11px] font-medium" style={{ color: theme.colors.textMuted }}>Tema</p>
          </div>
          <div className="flex items-center gap-1.5">
            {(Object.keys(allThemes) as ThemeId[]).map((id) => (
              <button
                key={id}
                onClick={() => setTheme(id)}
                className="w-6 h-6 rounded-full border-2 transition-all hover:scale-110"
                style={{
                  background: `linear-gradient(135deg, ${allThemes[id].colors.bgFrom}, ${allThemes[id].colors.bgTo})`,
                  borderColor: themeId === id ? theme.colors.accent : theme.colors.cardBorder,
                  boxShadow: themeId === id ? `0 0 0 2px ${theme.colors.accent}40` : 'none',
                }}
                title={allThemes[id].name}
              />
            ))}
          </div>
        </div>

        {/* Upgrade Banner (Free users only) */}
        {plan === 'free' && (
          <div className="px-3 py-2">
            <div className="bg-gradient-to-r from-[#C7517E]/20 to-[#200F5D]/20 border border-[#C7517E]/30 rounded-lg p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Crown className="w-4 h-4 text-[#C7517E]" />
                <span className="font-medium text-xs" style={{ color: theme.colors.textPrimary }}>Hanna Pro</span>
              </div>
              <p className="text-[11px] mb-2" style={{ color: theme.colors.textMuted }}>Mensajes ilimitados, voz, y más.</p>
              <Link
                href="/hanna/upgrade"
                className="block w-full py-1.5 px-3 bg-gradient-to-r from-[#C7517E] to-[#b8456f] text-white text-center text-xs font-medium rounded-md hover:from-[#d4608d] hover:to-[#C7517E] transition-all"
              >
                Actualizar a Pro
              </Link>
            </div>
          </div>
        )}

        {/* User Section */}
        <div className={`px-3 py-2 border-t ${borderClass}`}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#C7517E] flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-xs truncate" style={{ color: theme.colors.textPrimary }}>{user.fullName}</p>
              <p className="text-[10px] truncate" style={{ color: theme.colors.textMuted }}>{user.email}</p>
            </div>
            <button
              onClick={onLogout}
              className={`p-1.5 ${hoverBg} rounded-md transition-colors`}
              style={{ color: theme.colors.textMuted }}
              title="Cerrar sesión"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}
