'use client'

import Link from 'next/link'
import Image from 'next/image'
import {
  Menu,
  Settings,
  LogOut,
  Crown,
  Sparkles,
  User,
  Volume2,
  VolumeX,
} from 'lucide-react'

interface HeaderThemeColors {
  headerBg: string
  cardBorder: string
  cardBg: string
  textPrimary: string
  textMuted: string
  textSecondary: string
  accent: string
  sidebarBg: string
}

interface HeaderProps {
  user: { fullName: string; email: string }
  plan: 'free' | 'pro' | 'business'
  theme: { colors: HeaderThemeColors }
  messagesRemaining: number
  sidebarOpen: boolean
  onToggleSidebar: () => void
  voiceEnabled: boolean
  voiceSupport: { tts: boolean; stt: boolean }
  onToggleVoice: () => void
  showUserMenu: boolean
  onToggleUserMenu: (show: boolean) => void
  onLogout: () => void
  isLight: boolean
  hoverBg: string
}

export function DashboardHeader({
  user,
  plan,
  theme,
  messagesRemaining,
  onToggleSidebar,
  voiceEnabled,
  voiceSupport,
  onToggleVoice,
  showUserMenu,
  onToggleUserMenu,
  onLogout,
  isLight,
  hoverBg,
}: HeaderProps) {
  return (
    <header
      className="backdrop-blur-md border-b px-4 py-3 flex items-center gap-4"
      style={{ backgroundColor: theme.colors.headerBg, borderColor: theme.colors.cardBorder }}
    >
      <button
        onClick={onToggleSidebar}
        className={`p-2 ${hoverBg} rounded-lg transition-colors`}
        style={{ color: theme.colors.textMuted }}
      >
        <Menu className="w-6 h-6" />
      </button>

      <div className="flex-1 flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
          <Image src="/images/hanna-ai.png" alt="Hanna" width={40} height={40} className="w-full h-full object-cover" />
        </div>
        <div className="min-w-0">
          <h1 className="font-bold" style={{ color: theme.colors.textPrimary }}>Hanna</h1>
          <p className="text-xs truncate" style={{ color: theme.colors.textMuted }}>Tu asistente de marketing IA</p>
        </div>
      </div>

      {/* Message Counter (Free users) */}
      {plan === 'free' && (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: theme.colors.cardBg }}>
          <Sparkles className="w-4 h-4" style={{ color: theme.colors.accent }} />
          <span className="text-sm" style={{ color: theme.colors.textSecondary }}>
            {messagesRemaining} / 15 mensajes
          </span>
        </div>
      )}

      {/* Pro Badge */}
      {(plan === 'pro' || plan === 'business') && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#C7517E]/20 to-[#200F5D]/20 border border-[#C7517E]/30 rounded-full">
          <Crown className="w-4 h-4 text-[#C7517E]" />
          <span className="text-sm font-medium" style={{ color: theme.colors.textSecondary }}>Pro</span>
        </div>
      )}

      {/* Voice Toggle (Pro only) */}
      {(plan === 'pro' || plan === 'business') && voiceSupport.tts && (
        <button
          onClick={onToggleVoice}
          className={`p-2 rounded-full transition-colors ${
            voiceEnabled ? 'bg-[#2CB6D7] text-white' : hoverBg
          }`}
          style={voiceEnabled ? {} : { color: theme.colors.textMuted, backgroundColor: theme.colors.cardBg }}
          title={voiceEnabled ? 'Desactivar voz' : 'Activar voz'}
        >
          {voiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>
      )}

      {/* User Profile Menu */}
      <div className="relative">
        <button
          onClick={() => onToggleUserMenu(!showUserMenu)}
          className={`flex items-center p-1 rounded-full ${hoverBg} transition-colors`}
        >
          <div
            className="w-9 h-9 rounded-full bg-[#C7517E] flex items-center justify-center text-white text-sm font-medium ring-2"
            style={{ '--tw-ring-color': theme.colors.cardBorder } as React.CSSProperties}
          >
            {user.fullName.charAt(0).toUpperCase()}
          </div>
        </button>
        {showUserMenu && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => onToggleUserMenu(false)} />
            <div
              className="absolute right-0 top-full mt-2 z-50 w-56 rounded-xl border shadow-xl overflow-hidden"
              style={{ backgroundColor: theme.colors.sidebarBg, borderColor: theme.colors.cardBorder }}
            >
              <div className="p-3 border-b" style={{ borderColor: theme.colors.cardBorder }}>
                <p className="text-sm font-medium" style={{ color: theme.colors.textPrimary }}>{user.fullName}</p>
                <p className="text-xs" style={{ color: theme.colors.textMuted }}>{user.email}</p>
              </div>
              <div className="p-1">
                <Link
                  href="/hanna/profile"
                  onClick={() => onToggleUserMenu(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg ${hoverBg} transition-colors`}
                  style={{ color: theme.colors.textSecondary }}
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm">Mi Perfil</span>
                </Link>
                <Link
                  href="/hanna/settings"
                  onClick={() => onToggleUserMenu(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg ${hoverBg} transition-colors`}
                  style={{ color: theme.colors.textSecondary }}
                >
                  <Settings className="w-4 h-4" />
                  <span className="text-sm">Configuración</span>
                </Link>
                <button
                  onClick={onLogout}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg ${hoverBg} transition-colors text-left`}
                  style={{ color: theme.colors.textSecondary }}
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Cerrar sesión</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  )
}
