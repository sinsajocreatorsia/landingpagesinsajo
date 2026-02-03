'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function WorkshopTestimonials() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const { t } = useLanguage()

  const testimonials = t.testimonials.items

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in')
          }
        })
      },
      { threshold: 0.1 }
    )

    const elements = sectionRef.current?.querySelectorAll('.animate-on-scroll')
    elements?.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [testimonials.length])

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section
      ref={sectionRef}
      className="py-8 bg-gradient-to-br from-[#022133] to-[#200F5D] relative overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-5" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#2CB6D7] rounded-full blur-[200px] opacity-10" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#C7517E] rounded-full blur-[150px] opacity-10" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
          <span className="inline-block bg-[#36B3AE]/20 text-[#36B3AE] font-semibold px-4 py-2 rounded-full text-sm mb-4">
            {t.testimonials.badge}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#FCFEFB] mb-4">
            {t.testimonials.title}{' '}
            <span className="text-[#2CB6D7]">{t.testimonials.titleHighlight}</span> {t.testimonials.titleEnd}
          </h2>
          <p className="text-xl text-[#FCFEFB]/70 max-w-2xl mx-auto">
            {t.testimonials.subtitle}
          </p>
        </div>

        {/* Featured Testimonial */}
        <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-200">
          <div className="bg-[#022133]/50 backdrop-blur-sm border border-[#2CB6D7]/20 rounded-3xl p-8 md:p-12 max-w-4xl mx-auto relative">
            {/* Quote icon */}
            <div className="absolute -top-6 left-8 bg-gradient-to-r from-[#2CB6D7] to-[#36B3AE] rounded-full p-4">
              <Quote className="w-6 h-6 text-white" />
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-center">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-r from-[#2CB6D7] to-[#C7517E] p-1">
                  <div className="w-full h-full rounded-full bg-[#022133] flex items-center justify-center">
                    <span className="text-3xl md:text-4xl font-bold text-[#2CB6D7]">
                      {testimonials[currentIndex].name.charAt(0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 text-center md:text-left">
                {/* Stars */}
                <div className="flex justify-center md:justify-start gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-lg md:text-xl text-[#FCFEFB]/90 italic mb-6 leading-relaxed">
                  &quot;{testimonials[currentIndex].quote}&quot;
                </p>

                {/* Author */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="font-bold text-[#FCFEFB] text-lg">
                      {testimonials[currentIndex].name}
                    </p>
                    <p className="text-[#FCFEFB]/60">{testimonials[currentIndex].role}</p>
                  </div>
                  <div className="bg-[#36B3AE]/20 border border-[#36B3AE]/30 rounded-full px-4 py-2">
                    <span className="text-[#36B3AE] font-semibold text-sm">
                      {testimonials[currentIndex].result}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={prevTestimonial}
                className="p-2 rounded-full bg-[#2CB6D7]/20 hover:bg-[#2CB6D7]/40 text-[#2CB6D7] transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === currentIndex
                        ? 'bg-[#2CB6D7] w-6'
                        : 'bg-[#FCFEFB]/30 hover:bg-[#FCFEFB]/50'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={nextTestimonial}
                className="p-2 rounded-full bg-[#2CB6D7]/20 hover:bg-[#2CB6D7]/40 text-[#2CB6D7] transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-400">
          {t.testimonials.stats.map((stat, i) => (
            <div key={i} className="text-center p-4">
              <div className="text-2xl md:text-3xl font-bold text-[#2CB6D7]">{stat.value}</div>
              <div className="text-sm text-[#FCFEFB]/60">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
