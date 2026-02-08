'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon, Globe, Menu, X } from 'lucide-react'
import Image from 'next/image'
import { useLanguage } from '@/lib/contexts/LanguageContext'
import { useTheme } from '@/lib/contexts/ThemeContext'

export default function Header() {
  const pathname = usePathname()
  const { language, setLanguage, t } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const [showVideo, setShowVideo] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Hide this header on pages that have their own header/navigation
  if (pathname?.startsWith('/academy/workshop') || pathname?.startsWith('/hanna')) {
    return null
  }

  const navLinks = [
    { href: '#agents', label: language === 'en' ? 'Agents' : 'Agentes' },
    { href: '#benefits', label: language === 'en' ? 'Benefits' : 'Beneficios' },
    { href: '#cases', label: language === 'en' ? 'Use Cases' : 'Casos de Uso' },
    { href: '#faq', label: 'FAQ' },
  ]

  // Logo animation: Show video for 3s, then static image for 27s, repeat every 30s
  useEffect(() => {
    const playAnimation = () => {
      setShowVideo(true)
      setTimeout(() => {
        setShowVideo(false)
      }, 3000) // Show video for 3 seconds
    }

    // Play on mount
    playAnimation()

    // Repeat every 30 seconds
    const interval = setInterval(() => {
      playAnimation()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header
      id="main-site-header"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass-dark shadow-2xl border-b border-white/10'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          className="flex items-center gap-3"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <div className="relative w-14 h-14">
            <AnimatePresence mode="wait">
              {showVideo ? (
                <motion.div
                  key="video"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover rounded-full"
                  >
                    <source src="/images/sinsajo-animation.mp4" type="video/mp4" />
                  </video>
                </motion.div>
              ) : (
                <motion.div
                  key="image"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <Image
                    src="/images/sinsajo-logo-1.png"
                    alt="Sinsajo Creators"
                    fill
                    className="object-contain drop-shadow-2xl"
                    priority
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Glow effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#F59E0B] via-[#06B6D4] to-[#7C3AED] blur-xl opacity-50 animate-pulse"></div>
          </div>

          <div className="flex flex-col">
            <motion.h1
              className="text-xl md:text-2xl font-bold gradient-text leading-tight"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              SINSAJO
            </motion.h1>
            <span className="text-[10px] md:text-xs text-gray-400 tracking-wider">CREATORS</span>
          </div>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative text-gray-300 hover:text-white transition-colors font-medium group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#F59E0B] to-[#06B6D4] transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Language Toggle */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <button
              onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
              className="glass px-4 py-2 rounded-lg flex items-center gap-2 border border-white/20 hover:border-[#F59E0B]/50 transition-all duration-300 group"
            >
              <Globe className="w-5 h-5 text-[#06B6D4] group-hover:text-[#F59E0B] transition-colors" />
              <span className="font-semibold text-white uppercase text-sm">
                {language}
              </span>
            </button>

            {/* Tooltip */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileHover={{ opacity: 1, y: 0 }}
              className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/90 rounded-lg text-xs text-white whitespace-nowrap pointer-events-none"
            >
              {language === 'en' ? t.language.spanish : t.language.english}
            </motion.div>
          </motion.div>

          {/* Theme Toggle */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <button
              onClick={toggleTheme}
              className="glass w-12 h-12 rounded-lg flex items-center justify-center border border-white/20 hover:border-[#F59E0B]/50 transition-all duration-300 group relative overflow-hidden"
            >
              <AnimatePresence mode="wait">
                {theme === 'dark' ? (
                  <motion.div
                    key="moon"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Moon className="w-5 h-5 text-[#06B6D4] group-hover:text-[#F59E0B] transition-colors" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="sun"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Sun className="w-5 h-5 text-[#F59E0B] group-hover:text-[#06B6D4] transition-colors" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Animated background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#F59E0B]/20 to-[#06B6D4]/20 rounded-lg"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </button>

            {/* Tooltip */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileHover={{ opacity: 1, y: 0 }}
              className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/90 rounded-lg text-xs text-white whitespace-nowrap pointer-events-none"
            >
              {theme === 'dark' ? t.theme.light : t.theme.dark}
            </motion.div>
          </motion.div>

          {/* CTA Button (mobile hidden) */}
          <motion.a
            href="#hero"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden md:block btn-primary text-sm px-6 py-2 rounded-lg"
          >
            {t.hero.form.button.replace(' Ahora', '').replace(' Now', '')}
          </motion.a>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden glass w-12 h-12 rounded-lg flex items-center justify-center border border-white/20"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden glass-dark border-t border-white/10"
          >
            <nav className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-300 hover:text-white transition-colors font-medium py-2 border-b border-white/5"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#hero"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-primary text-center py-3 rounded-lg mt-2"
              >
                {t.hero.form.button.replace(' Ahora', '').replace(' Now', '')}
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress bar on scroll */}
      <motion.div
        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#F59E0B] via-[#06B6D4] to-[#7C3AED]"
        style={{
          scaleX: scrolled ? 1 : 0,
          transformOrigin: 'left',
        }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: scrolled ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.header>
  )
}
