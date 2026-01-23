'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

interface AnimatedLogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
}

export default function AnimatedLogo({ size = 'md', showText = true }: AnimatedLogoProps) {
  const sizes = {
    sm: { logo: 32, text: 'text-base' },
    md: { logo: 40, text: 'text-lg' },
    lg: { logo: 56, text: 'text-2xl' },
  }

  return (
    <Link href="/" className="flex items-center gap-2 group">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        className="relative"
      >
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 bg-[#2CB6D7]/30 rounded-full blur-lg"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <Image
          src="/images/sinsajo-logo-1.png"
          alt="Sinsajo Creators"
          width={sizes[size].logo}
          height={sizes[size].logo}
          className="object-contain relative z-10"
        />
      </motion.div>

      {showText && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`${sizes[size].text} font-bold hidden sm:block`}
        >
          <span className="bg-gradient-to-r from-[#2CB6D7] to-[#36B3AE] bg-clip-text text-transparent">
            SINSAJO
          </span>
          <span className="text-[#FCFEFB]/80 font-normal ml-1">CREATORS</span>
        </motion.div>
      )}
    </Link>
  )
}
