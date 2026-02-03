'use client'

import { useState, useEffect } from 'react'

interface Particle {
  left: string
  top: string
  animationDelay: string
  animationDuration: string
}

export default function ParticleBackground() {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    // Generate particles only on client side to avoid hydration mismatch
    const newParticles = [...Array(50)].map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${5 + Math.random() * 10}s`,
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A1628] via-[#1E3A8A] to-[#0A1628]" />

      {/* CSS-only floating particles */}
      <div className="absolute inset-0 opacity-30">
        {particles.map((particle, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-float"
            style={{
              left: particle.left,
              top: particle.top,
              animationDelay: particle.animationDelay,
              animationDuration: particle.animationDuration,
            }}
          />
        ))}
      </div>
    </div>
  )
}
