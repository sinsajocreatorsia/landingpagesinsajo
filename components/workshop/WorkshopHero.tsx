'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import CountdownTimer from './CountdownTimer'
import { useLanguage } from '@/lib/i18n'

export default function WorkshopHero() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { t, language } = useLanguage()

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrollY = window.scrollY
        const elements = heroRef.current.querySelectorAll('[data-parallax]')
        elements.forEach((el) => {
          const speed = parseFloat((el as HTMLElement).dataset.parallax || '0.5')
          ;(el as HTMLElement).style.transform = `translateY(${scrollY * speed}px)`
        })
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen bg-gradient-to-br from-[#022133] via-[#022133] to-[#200F5D] overflow-hidden"
    >
      {/* Animated Background Effects */}
      <div className="absolute inset-0">
        <div
          data-parallax="0.3"
          className="absolute top-20 right-20 w-96 h-96 bg-[#2CB6D7] rounded-full blur-[150px] opacity-20 animate-pulse"
        />
        <div
          data-parallax="0.2"
          className="absolute bottom-20 left-20 w-80 h-80 bg-[#C7517E] rounded-full blur-[120px] opacity-15 animate-pulse"
          style={{ animationDelay: '1s' }}
        />
        <div
          data-parallax="0.4"
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#36B3AE] rounded-full blur-[100px] opacity-10 animate-pulse"
          style={{ animationDelay: '2s' }}
        />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-5" />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[#2CB6D7]/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 animate-fadeInUp">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[#36B3AE]/20 border border-[#36B3AE] rounded-full px-4 py-2 animate-slideInLeft">
              <span className="w-2 h-2 bg-[#36B3AE] rounded-full animate-pulse" />
              <span className="text-[#36B3AE] text-sm font-semibold uppercase tracking-wide">
                {t.hero.badge}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#FCFEFB] leading-tight">
              <span className="text-[#2CB6D7]">IA</span>{' '}
              {language === 'es' ? 'para' : 'for'}{' '}
              <span className="text-[#C7517E]">{language === 'es' ? 'Empresarias Exitosas' : 'Successful Business Women'}</span>
              <br />
              <span className="text-2xl md:text-3xl lg:text-4xl font-normal text-[#FCFEFB]/80 block mt-2">
                {t.hero.title} <span className="text-[#2CB6D7]">{t.hero.titleHighlight}</span>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-[#FCFEFB]/80 max-w-xl leading-relaxed">
              {t.hero.subtitle}
            </p>

            {/* Key Benefits */}
            <div className="flex flex-wrap gap-3">
              {(language === 'es'
                ? ['Automatización Real', 'Resultados Inmediatos', 'Sin Conocimientos Técnicos']
                : ['Real Automation', 'Immediate Results', 'No Technical Knowledge Required']
              ).map((benefit, i) => (
                <span
                  key={i}
                  className="bg-[#200F5D]/50 text-[#FCFEFB]/90 px-3 py-1.5 rounded-full text-sm border border-[#2CB6D7]/20"
                >
                  {benefit}
                </span>
              ))}
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-3 py-4">
              {(language === 'es'
                ? [
                    { value: '78%', label: 'de clientes compran al primero que responde' },
                    { value: '35%', label: 'más costos operativos sin IA' },
                    { value: '40%', label: 'más visibilidad con respuesta instantánea' },
                  ]
                : [
                    { value: '78%', label: 'of clients buy from the first to respond' },
                    { value: '35%', label: 'higher operational costs without AI' },
                    { value: '40%', label: 'more visibility with instant response' },
                  ]
              ).map((stat, i) => (
                <div
                  key={i}
                  className="text-center p-3 bg-[#200F5D]/50 rounded-xl border border-[#2CB6D7]/20"
                >
                  <div className="text-2xl md:text-3xl font-bold text-[#2CB6D7]">{stat.value}</div>
                  <div className="text-xs text-[#FCFEFB]/70 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Date & Time */}
            <div className="flex flex-wrap items-center gap-4 text-[#FCFEFB]">
              <div className="flex items-center gap-2 bg-[#200F5D]/50 rounded-lg px-4 py-3 border border-[#2CB6D7]/10">
                <svg className="w-5 h-5 text-[#2CB6D7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="font-semibold">{language === 'es' ? 'Sábado, 7 de Marzo 2026' : 'Saturday, March 7, 2026'}</span>
              </div>
              <div className="flex items-center gap-2 bg-[#200F5D]/50 rounded-lg px-4 py-3 border border-[#2CB6D7]/10">
                <svg className="w-5 h-5 text-[#2CB6D7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold">9:00 AM - 12:00 PM (EST)</span>
              </div>
              {/* Workshop Language Indicator */}
              <div className="flex items-center gap-2 bg-[#C7517E]/20 rounded-lg px-4 py-3 border border-[#C7517E]/30">
                <span className="text-lg">🇪🇸</span>
                <span className="font-semibold text-[#C7517E]">{language === 'es' ? 'Workshop en Español' : 'Workshop in Spanish'}</span>
              </div>
            </div>

            {/* Countdown */}
            <CountdownTimer targetDate="2026-03-07T09:00:00-05:00" />

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <a
                href="#pricing"
                className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#C7517E] to-[#b8456f] hover:from-[#d4608d] hover:to-[#C7517E] text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-xl shadow-[#C7517E]/30 hover:shadow-2xl hover:shadow-[#C7517E]/40"
              >
                {t.hero.cta}
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <div className="flex items-center gap-2 text-[#FCFEFB]">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-red-400 font-semibold">{t.hero.spots}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Hanna Image with Parallax */}
          <div className="relative flex justify-center lg:justify-end z-20" data-parallax="-0.1">
            <div className="relative animate-fadeInRight">
              {/* Glow effect behind image */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#2CB6D7] to-[#C7517E] rounded-full blur-3xl opacity-30 scale-90 animate-pulse -z-10" />
              <Image
                src="/images/hanna-ai.png"
                alt="Hanna - Tu Asistente AI"
                width={500}
                height={600}
                className="relative z-30 object-contain drop-shadow-2xl"
                priority
              />
              {/* Floating badge */}
              <div className="absolute bottom-10 left-0 z-40 bg-[#022133]/90 backdrop-blur-sm border border-[#2CB6D7]/30 rounded-xl p-4 shadow-xl animate-bounce-slow">
                <p className="text-[#2CB6D7] font-semibold text-sm">ASISTENTE IA SINSAJO</p>
                <p className="text-[#FCFEFB] font-bold text-lg">HANNA</p>
                <p className="text-[#FCFEFB]/70 text-sm">Tu guía en este workshop</p>
              </div>

              {/* Stats floating */}
              <div className="absolute top-10 right-0 z-40 bg-[#022133]/90 backdrop-blur-sm border border-[#36B3AE]/30 rounded-xl p-3 shadow-xl animate-float">
                <p className="text-[#36B3AE] font-bold text-2xl">+73</p>
                <p className="text-[#FCFEFB]/70 text-xs">Empresas transformadas</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-[#FCFEFB]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}
