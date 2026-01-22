'use client'

import Image from 'next/image'
import CountdownTimer from './CountdownTimer'

export default function WorkshopHero() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-[#022133] via-[#022133] to-[#200F5D] overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-10" />
      <div className="absolute top-20 right-20 w-96 h-96 bg-[#2CB6D7] rounded-full blur-[150px] opacity-20" />
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#C7517E] rounded-full blur-[120px] opacity-15" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <Image
            src="/images/sinsajo-logo-1.png"
            alt="Sinsajo Creators"
            width={50}
            height={50}
            className="object-contain"
          />
          <span className="text-[#2CB6D7] font-bold text-xl">
            sinsajo<span className="text-[#36B3AE]">creators</span>
          </span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[#36B3AE]/20 border border-[#36B3AE] rounded-full px-4 py-2">
              <span className="w-2 h-2 bg-[#36B3AE] rounded-full animate-pulse" />
              <span className="text-[#36B3AE] text-sm font-semibold uppercase tracking-wide">
                Exclusivo - Solo para Fundadoras Latinas
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#FCFEFB] leading-tight">
              Escalado Inteligente con{' '}
              <span className="text-[#2CB6D7]">IA</span>{' '}
              para Negocios de{' '}
              <span className="text-[#C7517E]">Latinas Inspiradoras</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-[#FCFEFB]/80 max-w-xl">
              Esto no es un webinar genérico para principiantes; es un asiento en la mesa para líderes probados.
              Nuestro intensivo de IA curado ofrece estrategias personalizadas y herramientas de automatización
              para prosperar en el mercado actual.
            </p>

            {/* Date & Time */}
            <div className="flex flex-wrap items-center gap-4 text-[#FCFEFB]">
              <div className="flex items-center gap-2 bg-[#200F5D]/50 rounded-lg px-4 py-3">
                <svg className="w-5 h-5 text-[#2CB6D7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="font-semibold">Sábado, 7 de Marzo 2026</span>
              </div>
              <div className="flex items-center gap-2 bg-[#200F5D]/50 rounded-lg px-4 py-3">
                <svg className="w-5 h-5 text-[#2CB6D7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold">9:00 AM - 12:00 PM (EST)</span>
              </div>
            </div>

            {/* Countdown */}
            <CountdownTimer targetDate="2026-03-07T09:00:00-05:00" />

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#pricing"
                className="inline-flex items-center justify-center gap-2 bg-[#C7517E] hover:bg-[#b8456f] text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[#C7517E]/30"
              >
                Reserva Tu Lugar Ahora
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <div className="flex items-center gap-2 text-[#FCFEFB]/70">
                <svg className="w-5 h-5 text-[#36B3AE]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Solo 50 lugares disponibles</span>
              </div>
            </div>
          </div>

          {/* Right Content - Hanna Image */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              {/* Glow effect behind image */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#2CB6D7] to-[#C7517E] rounded-full blur-3xl opacity-30 scale-90" />
              <Image
                src="/images/hanna-ai.png"
                alt="Hanna - Tu Asistente AI"
                width={500}
                height={600}
                className="relative z-10 object-contain"
                priority
              />
              {/* Floating badge */}
              <div className="absolute bottom-10 left-0 bg-[#022133]/90 backdrop-blur-sm border border-[#2CB6D7]/30 rounded-xl p-4 shadow-xl">
                <p className="text-[#2CB6D7] font-semibold text-sm">EL MODELO DE IA SINSAJO</p>
                <p className="text-[#FCFEFB] font-bold text-lg">HANNA</p>
                <p className="text-[#FCFEFB]/70 text-sm">Tu Socio de Escalabilidad Digital</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
