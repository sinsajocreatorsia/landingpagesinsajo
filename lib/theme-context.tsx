'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export type ThemeId = 'dark' | 'light' | 'purple' | 'midnight'

interface ThemeColors {
  bgFrom: string
  bgTo: string
  headerBg: string
  sidebarBg: string
  inputBg: string
  inputBorder: string
  cardBg: string
  cardBorder: string
  textPrimary: string
  textSecondary: string
  textMuted: string
  bubbleAssistant: string
  bubbleAssistantBorder: string
  bubbleUser: string
  accent: string
  inputAreaBg: string
}

interface Theme {
  id: ThemeId
  name: string
  colors: ThemeColors
}

const themes: Record<ThemeId, Theme> = {
  dark: {
    id: 'dark',
    name: 'Oscuro',
    colors: {
      bgFrom: '#022133',
      bgTo: '#200F5D',
      headerBg: 'rgba(2, 33, 51, 0.8)',
      sidebarBg: '#022133',
      inputBg: 'rgba(255, 255, 255, 0.1)',
      inputBorder: 'rgba(255, 255, 255, 0.2)',
      cardBg: 'rgba(255, 255, 255, 0.1)',
      cardBorder: 'rgba(255, 255, 255, 0.1)',
      textPrimary: '#ffffff',
      textSecondary: 'rgba(255, 255, 255, 0.7)',
      textMuted: 'rgba(255, 255, 255, 0.5)',
      bubbleAssistant: 'rgba(255, 255, 255, 0.1)',
      bubbleAssistantBorder: 'rgba(255, 255, 255, 0.1)',
      bubbleUser: '#C7517E',
      accent: '#2CB6D7',
      inputAreaBg: 'rgba(2, 33, 51, 0.5)',
    },
  },
  light: {
    id: 'light',
    name: 'Claro',
    colors: {
      bgFrom: '#f0f4f8',
      bgTo: '#e8ecf1',
      headerBg: 'rgba(255, 255, 255, 0.9)',
      sidebarBg: '#ffffff',
      inputBg: 'rgba(0, 0, 0, 0.05)',
      inputBorder: 'rgba(0, 0, 0, 0.15)',
      cardBg: 'rgba(0, 0, 0, 0.03)',
      cardBorder: 'rgba(0, 0, 0, 0.1)',
      textPrimary: '#1a1a2e',
      textSecondary: '#4a4a6a',
      textMuted: '#8a8aa0',
      bubbleAssistant: '#ffffff',
      bubbleAssistantBorder: 'rgba(0, 0, 0, 0.1)',
      bubbleUser: '#C7517E',
      accent: '#2CB6D7',
      inputAreaBg: 'rgba(255, 255, 255, 0.8)',
    },
  },
  purple: {
    id: 'purple',
    name: 'Purpura',
    colors: {
      bgFrom: '#1a0533',
      bgTo: '#2d1b69',
      headerBg: 'rgba(26, 5, 51, 0.8)',
      sidebarBg: '#1a0533',
      inputBg: 'rgba(255, 255, 255, 0.1)',
      inputBorder: 'rgba(255, 255, 255, 0.2)',
      cardBg: 'rgba(255, 255, 255, 0.08)',
      cardBorder: 'rgba(168, 85, 247, 0.3)',
      textPrimary: '#ffffff',
      textSecondary: 'rgba(255, 255, 255, 0.7)',
      textMuted: 'rgba(255, 255, 255, 0.5)',
      bubbleAssistant: 'rgba(168, 85, 247, 0.15)',
      bubbleAssistantBorder: 'rgba(168, 85, 247, 0.3)',
      bubbleUser: '#a855f7',
      accent: '#a855f7',
      inputAreaBg: 'rgba(26, 5, 51, 0.5)',
    },
  },
  midnight: {
    id: 'midnight',
    name: 'Midnight',
    colors: {
      bgFrom: '#0a0a0a',
      bgTo: '#111111',
      headerBg: 'rgba(10, 10, 10, 0.9)',
      sidebarBg: '#0a0a0a',
      inputBg: 'rgba(255, 255, 255, 0.07)',
      inputBorder: 'rgba(255, 255, 255, 0.15)',
      cardBg: 'rgba(255, 255, 255, 0.05)',
      cardBorder: 'rgba(255, 255, 255, 0.1)',
      textPrimary: '#e0e0e0',
      textSecondary: 'rgba(255, 255, 255, 0.6)',
      textMuted: 'rgba(255, 255, 255, 0.4)',
      bubbleAssistant: 'rgba(255, 255, 255, 0.07)',
      bubbleAssistantBorder: 'rgba(255, 255, 255, 0.1)',
      bubbleUser: '#C7517E',
      accent: '#00d4aa',
      inputAreaBg: 'rgba(10, 10, 10, 0.8)',
    },
  },
}

interface ThemeContextType {
  theme: Theme
  themeId: ThemeId
  setTheme: (id: ThemeId) => void
  themes: Record<ThemeId, Theme>
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({ children, userId }: { children: ReactNode; userId?: string }) {
  const [themeId, setThemeId] = useState<ThemeId>('dark')

  useEffect(() => {
    const key = userId ? `hanna-theme-${userId}` : 'hanna-theme'
    const saved = localStorage.getItem(key)
    if (saved && saved in themes) {
      setThemeId(saved as ThemeId)
    }
  }, [userId])

  const setTheme = (id: ThemeId) => {
    setThemeId(id)
    const key = userId ? `hanna-theme-${userId}` : 'hanna-theme'
    localStorage.setItem(key, id)
  }

  return (
    <ThemeContext.Provider value={{ theme: themes[themeId], themeId, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    return {
      theme: themes.dark,
      themeId: 'dark' as ThemeId,
      setTheme: () => {},
      themes,
    }
  }
  return context
}
