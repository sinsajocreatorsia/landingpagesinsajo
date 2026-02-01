'use client'

import { useState, useEffect } from 'react'
import { Moon, Sun, Globe } from 'lucide-react'
import { motion } from 'framer-motion'
import AnimatedLogo from './AnimatedLogo'
import { useLanguage } from '@/lib/i18n'

export default function WorkshopHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [isDark, setIsDark] = useState(true)
  const { language, setLanguage, t } = useLanguage()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleTheme = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)
    document.documentElement.classList.toggle('light-mode', !newIsDark)
  }

  // Single-click language toggle
  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es')
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#022133]/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Animated Logo */}
          <AnimatedLogo size="md" showText={true} />

          {/* Right side controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Toggle - Single Click */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg bg-[#022133]/50 hover:bg-[#022133]/70 border border-[#2CB6D7]/30 transition-all"
              title={language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
            >
              <Globe className="w-4 h-4 text-[#2CB6D7]" />
              <span className="text-xs font-medium text-[#FCFEFB] uppercase">
                {language === 'es' ? 'ES' : 'EN'}
              </span>
            </motion.button>

            {/* Day/Night Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-[#022133]/50 hover:bg-[#022133]/70 border border-[#2CB6D7]/30 transition-all"
              title={isDark ? t.header.lightMode : t.header.darkMode}
            >
              <motion.div
                initial={false}
                animate={{ rotate: isDark ? 0 : 180 }}
                transition={{ duration: 0.3 }}
              >
                {isDark ? (
                  <Sun className="w-4 h-4 text-[#F9D423]" />
                ) : (
                  <Moon className="w-4 h-4 text-[#2CB6D7]" />
                )}
              </motion.div>
            </motion.button>

            {/* CTA Button */}
            <motion.a
              href="#pricing"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 bg-[#C7517E] hover:bg-[#b8456f] text-white font-semibold py-2.5 px-4 sm:px-6 rounded-lg text-sm transition-all duration-300 shadow-lg shadow-[#C7517E]/20"
            >
              <span className="hidden sm:inline">{t.header.reserveSpot}</span>
              <span className="sm:hidden">{t.header.reserve}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.a>
          </div>
        </div>
      </div>
    </header>
  )
}
