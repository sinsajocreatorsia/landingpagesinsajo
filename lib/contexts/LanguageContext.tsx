'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { en } from '../translations/en'
import { es } from '../translations/es'

type Language = 'en' | 'es'
type Translations = typeof en

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')

  useEffect(() => {
    // Always default to English - clear any old Spanish preference
    const saved = localStorage.getItem('language') as Language
    if (!saved || saved !== 'en') {
      localStorage.setItem('language', 'en')
      setLanguageState('en')
    } else {
      setLanguageState(saved)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('language', lang)
  }

  const t = language === 'en' ? en : es

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
