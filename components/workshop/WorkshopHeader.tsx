'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function WorkshopHeader() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/images/sinsajo-logo-1.png"
              alt="Sinsajo Creators"
              width={40}
              height={40}
              className="object-contain group-hover:scale-110 transition-transform"
            />
            <span className="text-[#2CB6D7] font-bold text-lg hidden sm:block">
              SINSAJO<span className="text-[#FCFEFB]/80 font-normal ml-1">CREATORS</span>
            </span>
          </Link>

          {/* CTA Button */}
          <a
            href="#pricing"
            className="inline-flex items-center gap-2 bg-[#C7517E] hover:bg-[#b8456f] text-white font-semibold py-2.5 px-6 rounded-lg text-sm transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[#C7517E]/20"
          >
            Reservar Lugar
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  )
}
