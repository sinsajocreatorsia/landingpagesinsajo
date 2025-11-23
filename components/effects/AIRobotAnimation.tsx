'use client'
import { motion } from 'framer-motion'

interface AIRobotAnimationProps {
  variant?: 'decorative' | 'showcase'
}

export default function AIRobotAnimation({ variant = 'decorative' }: AIRobotAnimationProps) {
  const isShowcase = variant === 'showcase'
  const opacity = isShowcase ? 'opacity-80' : 'opacity-10 md:opacity-15'
  const size = isShowcase ? 'w-64 h-80' : 'w-80 h-96'
  const positioning = isShowcase ? 'relative mx-auto' : 'absolute right-0 top-1/2 -translate-y-1/2 hidden lg:block'

  return (
    <div className={`${positioning} ${size} pointer-events-none ${opacity}`}>
      {/* Robot humanoide estilo Optimus */}
      <motion.div
        className="relative w-full h-full"
        animate={{
          y: [-15, 15, -15],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Cabeza */}
        <motion.div
          className="absolute top-8 left-1/2 -translate-x-1/2"
          animate={{
            rotate: [-3, 3, -3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Casco/Cabeza principal */}
          <div className="relative w-20 h-24 rounded-t-full bg-gradient-to-b from-cyan-400/40 to-purple-600/40 backdrop-blur-sm">
            {/* Visor */}
            <motion.div
              className="absolute top-8 left-1/2 -translate-x-1/2 w-14 h-6 rounded-full bg-cyan-400/60"
              animate={{
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              {/* Ojos del visor */}
              <div className="absolute top-1 left-2 w-2 h-2 rounded-full bg-cyan-300" />
              <div className="absolute top-1 right-2 w-2 h-2 rounded-full bg-cyan-300" />
            </motion.div>
          </div>

          {/* Antena */}
          <motion.div
            className="absolute -top-3 left-1/2 -translate-x-1/2 w-1 h-6 bg-gradient-to-t from-cyan-400/50 to-transparent"
            animate={{
              scaleY: [1, 1.3, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50" />
          </motion.div>
        </motion.div>

        {/* Cuello */}
        <div className="absolute top-32 left-1/2 -translate-x-1/2 w-8 h-6 bg-gradient-to-b from-purple-600/30 to-cyan-400/30" />

        {/* Torso */}
        <div className="absolute top-38 left-1/2 -translate-x-1/2 w-32 h-40 rounded-2xl bg-gradient-to-br from-purple-600/40 to-cyan-400/40 backdrop-blur-sm">
          {/* Panel de pecho tipo Iron Man */}
          <motion.div
            className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400/50 to-purple-600/50"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            {/* Core energético */}
            <div className="absolute inset-2 rounded-full bg-cyan-400/60 shadow-lg shadow-cyan-400/50" />
          </motion.div>

          {/* Líneas de armadura */}
          <div className="absolute top-20 left-4 right-4 h-px bg-cyan-400/30" />
          <div className="absolute top-28 left-4 right-4 h-px bg-cyan-400/30" />
        </div>

        {/* Brazo izquierdo */}
        <motion.div
          className="absolute top-40 -left-8 w-6 h-32 rounded-full bg-gradient-to-b from-cyan-400/30 to-purple-600/30"
          animate={{
            rotate: [-15, 15, -15],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Articulación del codo */}
          <div className="absolute top-16 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-cyan-400/40" />

          {/* Antebrazo */}
          <motion.div
            className="absolute top-16 left-0 w-5 h-20 rounded-full bg-gradient-to-b from-purple-600/30 to-cyan-400/30"
            animate={{
              rotate: [0, -20, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          >
            {/* Mano */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-6 rounded-b-full bg-cyan-400/40" />
          </motion.div>
        </motion.div>

        {/* Brazo derecho */}
        <motion.div
          className="absolute top-40 -right-8 w-6 h-32 rounded-full bg-gradient-to-b from-cyan-400/30 to-purple-600/30"
          animate={{
            rotate: [15, -15, 15],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Articulación del codo */}
          <div className="absolute top-16 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-cyan-400/40" />

          {/* Antebrazo */}
          <motion.div
            className="absolute top-16 right-0 w-5 h-20 rounded-full bg-gradient-to-b from-purple-600/30 to-cyan-400/30"
            animate={{
              rotate: [0, 20, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          >
            {/* Mano */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-6 rounded-b-full bg-cyan-400/40" />
          </motion.div>
        </motion.div>

        {/* Pierna izquierda */}
        <div className="absolute bottom-8 left-1/3 -translate-x-1/2 w-7 h-28 rounded-full bg-gradient-to-b from-purple-600/30 to-cyan-400/30">
          {/* Rodilla */}
          <div className="absolute top-14 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-cyan-400/40" />
          {/* Pie */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-4 rounded-b-lg bg-cyan-400/40" />
        </div>

        {/* Pierna derecha */}
        <div className="absolute bottom-8 right-1/3 translate-x-1/2 w-7 h-28 rounded-full bg-gradient-to-b from-purple-600/30 to-cyan-400/30">
          {/* Rodilla */}
          <div className="absolute top-14 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-cyan-400/40" />
          {/* Pie */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-4 rounded-b-lg bg-cyan-400/40" />
        </div>

        {/* Partículas de energía flotantes alrededor */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-cyan-400/40"
            style={{
              left: `${50 + Math.cos((i * Math.PI * 2) / 12) * 140}px`,
              top: `${50 + Math.sin((i * Math.PI * 2) / 12) * 140}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.25,
            }}
          />
        ))}

        {/* Glow effect general */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-purple-600/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
        />
      </motion.div>
    </div>
  )
}
