'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'

// Dynamically import VoiceHanna to avoid SSR issues with Web Speech API
const VoiceHanna = dynamic(() => import('./VoiceHanna'), {
  ssr: false,
  loading: () => null,
})

interface HannaWidgetProps {
  initialMessage?: string
}

export default function HannaWidget({ initialMessage }: HannaWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  const handleOpen = () => {
    setIsOpen(true)
    setHasInteracted(true)
  }

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="fixed bottom-4 right-4 z-40"
          >
            <motion.button
              onClick={handleOpen}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group"
            >
              {/* Main Button */}
              <div className="w-16 h-16 bg-gradient-to-br from-[#C7517E] to-[#200F5D] rounded-full shadow-lg flex items-center justify-center">
                <span className="text-3xl">🤖</span>
              </div>

              {/* Pulse Animation */}
              <div className="absolute inset-0 rounded-full bg-[#C7517E]/30 animate-ping" />

              {/* Tooltip */}
              {!hasInteracted && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap"
                >
                  <div className="bg-white rounded-lg shadow-lg px-4 py-2 text-sm text-gray-800 border">
                    <p className="font-medium">¡Hola! Soy Hanna 👋</p>
                    <p className="text-xs text-gray-500">Tu asistente con voz</p>
                  </div>
                  {/* Arrow */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1">
                    <div className="border-8 border-transparent border-l-white" />
                  </div>
                </motion.div>
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Widget */}
      <AnimatePresence>
        {isOpen && (
          <VoiceHanna
            onClose={() => setIsOpen(false)}
            initialMessage={initialMessage}
          />
        )}
      </AnimatePresence>
    </>
  )
}
