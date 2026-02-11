'use client'

import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/lib/i18n'

interface SectionCTAProps {
  text?: string
  href?: string
  variant?: 'primary' | 'secondary'
  showSpots?: boolean
  spotsText?: string
}

export default function SectionCTA({
  text,
  href = '#pricing',
  variant = 'primary',
  showSpots = true,
  spotsText,
}: SectionCTAProps) {
  const { language } = useLanguage()

  const defaultText = text || (language === 'es' ? 'Reserva Tu Lugar Ahora' : 'Reserve Your Spot Now')
  const defaultSpotsText = spotsText || (language === 'es' ? 'Solo 7 lugares disponibles' : 'Only 7 spots available')
  const isPrimary = variant === 'primary'

  return (
    <div className="text-center pt-4 pb-2">
      <motion.a
        href={href}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`
          inline-flex items-center justify-center gap-2 font-bold py-4 px-8 rounded-xl text-lg
          transition-all duration-300 shadow-xl group
          ${
            isPrimary
              ? 'bg-gradient-to-r from-[#C7517E] to-[#b8456f] hover:from-[#d4608d] hover:to-[#C7517E] text-white shadow-[#C7517E]/30 hover:shadow-2xl hover:shadow-[#C7517E]/40'
              : 'bg-[#2CB6D7] hover:bg-[#189FB2] text-white shadow-[#2CB6D7]/30 hover:shadow-[#2CB6D7]/40'
          }
        `}
      >
        {defaultText}
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </motion.a>

      {showSpots && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-2 mt-2"
        >
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-red-400 font-semibold text-sm">{defaultSpotsText}</span>
        </motion.div>
      )}
    </div>
  )
}
