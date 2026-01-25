'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { translations, Language, Translations } from './translations'

interface LanguageContextType {
  language: Language
  t: Translations
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('es')

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
    // Store preference
    if (typeof window !== 'undefined') {
      localStorage.setItem('workshop-language', lang)
    }
  }, [])

  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'es' ? 'en' : 'es')
  }, [language, setLanguage])

  const t = translations[language] as Translations

  return (
    <LanguageContext.Provider value={{ language, t, setLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
