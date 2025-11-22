'use client'

import { motion } from 'framer-motion'

export default function AIRobotAnimation() {
  return (
    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-48 h-48 md:w-64 md:h-64 pointer-events-none opacity-20 md:opacity-30 hidden md:block">
      {/* Cuerpo del robot */}
      <motion.div
        className="relative w-full h-full"
        animate={{
          y: [-20, 20, -20],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Cabeza */}
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-gradient-to-br from-cyan-400/30 to-purple-600/30 backdrop-blur-sm border-2 border-cyan-400/50"
          animate={{
            rotate: [-5, 5, -5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Ojos */}
          <motion.div
            className="absolute top-6 md:top-8 left-4 md:left-6 w-4 h-4 md:w-6 md:h-6 rounded-full bg-cyan-400"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0.7, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
          <motion.div
            className="absolute top-6 md:top-8 right-4 md:right-6 w-4 h-4 md:w-6 md:h-6 rounded-full bg-cyan-400"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0.7, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: 0.1,
            }}
          />

          {/* Antena */}
          <motion.div
            className="absolute -top-3 md:-top-4 left-1/2 -translate-x-1/2 w-1 h-6 md:h-8 bg-gradient-to-t from-cyan-400 to-transparent"
            animate={{
              scaleY: [1, 1.3, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
          >
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-2 md:w-3 md:h-3 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50" />
          </motion.div>
        </motion.div>

        {/* Cuerpo */}
        <div className="absolute top-28 md:top-36 left-1/2 -translate-x-1/2 w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-gradient-to-br from-purple-600/30 to-cyan-400/30 backdrop-blur-sm border-2 border-purple-600/50">
          {/* Panel de control */}
          <div className="absolute inset-3 md:inset-4 border border-cyan-400/30 rounded-lg p-2">
            <motion.div
              className="grid grid-cols-3 gap-1 md:gap-2"
              animate={{
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              {[...Array(9)].map((_, i) => (
                <motion.div
                  key={i}
                  className="h-1.5 md:h-2 bg-cyan-400/50 rounded-full"
                  animate={{
                    scaleX: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                />
              ))}
            </motion.div>
          </div>
        </div>

        {/* Brazos */}
        <motion.div
          className="absolute top-32 md:top-40 -left-6 md:-left-8 w-12 h-2 md:w-16 md:h-3 rounded-full bg-gradient-to-r from-cyan-400/30 to-transparent"
          animate={{
            rotate: [-20, 20, -20],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
        />
        <motion.div
          className="absolute top-32 md:top-40 -right-6 md:-right-8 w-12 h-2 md:w-16 md:h-3 rounded-full bg-gradient-to-l from-cyan-400/30 to-transparent"
          animate={{
            rotate: [20, -20, 20],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
        />

        {/* Partículas flotantes alrededor */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-cyan-400/50"
            style={{
              left: `${Math.cos((i * Math.PI * 2) / 8) * 120 + 50}%`,
              top: `${Math.sin((i * Math.PI * 2) / 8) * 120 + 50}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.25,
            }}
          />
        ))}
      </motion.div>

      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-600/20 rounded-full blur-3xl"
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
