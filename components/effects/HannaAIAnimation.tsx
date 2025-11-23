'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function HannaAIAnimation() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Resplandor de fondo pulsante */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-blue-500/30 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Anillos orbitales */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 border-2 border-cyan-500/30 rounded-full" />
      </motion.div>

      <motion.div
        className="absolute inset-0"
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-purple-500/20 rounded-full" />
      </motion.div>

      {/* Imagen de Hanna con animación flotante */}
      <motion.div
        className="relative z-10 w-64 h-64"
        animate={{
          y: [-15, 15, -15],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-cyan-400/30 shadow-2xl">
          <Image
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=faces"
            alt="Hanna - AI & Marketing Specialist"
            fill
            className="object-cover"
            priority
          />

          {/* Efecto de escaneo holográfico */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent"
            animate={{
              y: ['-100%', '200%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>
      </motion.div>

      {/* Partículas de datos flotantes */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Puntos de conexión orbitales */}
      {[...Array(8)].map((_, i) => {
        const angle = (i * Math.PI * 2) / 8
        const radius = 160
        return (
          <motion.div
            key={`dot-${i}`}
            className="absolute w-3 h-3 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500"
            style={{
              left: '50%',
              top: '50%',
              transform: `translate(-50%, -50%) translate(${Math.cos(angle) * radius}px, ${Math.sin(angle) * radius}px)`,
              boxShadow: '0 0 15px rgba(6, 182, 212, 0.8)',
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        )
      })}

      {/* Líneas de conexión de datos */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <motion.circle
          cx="50%"
          cy="50%"
          r="140"
          fill="none"
          stroke="url(#gradient1)"
          strokeWidth="1"
          strokeDasharray="10 5"
          animate={{
            strokeDashoffset: [0, -100],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.3" />
          </linearGradient>
        </defs>
      </svg>

      {/* Texto holográfico "AI POWERED" debajo */}
      <motion.div
        className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-center"
        animate={{
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      >
        <div className="text-cyan-400 font-bold text-sm tracking-wider">
          AI POWERED
        </div>
        <div className="flex items-center justify-center gap-1 mt-1">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 bg-cyan-400 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Efecto de resplandor exterior */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, transparent 40%, rgba(6, 182, 212, 0.1) 70%, transparent 100%)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
        }}
      />
    </div>
  )
}
