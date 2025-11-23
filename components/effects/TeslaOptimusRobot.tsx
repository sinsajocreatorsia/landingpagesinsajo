'use client'
import { motion } from 'framer-motion'

export default function TeslaOptimusRobot() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Resplandor de fondo */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-blue-500/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
        }}
      />

      {/* Robot principal */}
      <motion.div
        className="relative z-10"
        animate={{
          y: [-15, 15, -15],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* CABEZA - Diseño Tesla mejorado */}
        <motion.div
          className="relative mx-auto mb-2"
          style={{ width: '80px', height: '100px' }}
          animate={{
            rotate: [-2, 2, -2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Casco principal con gradiente metálico */}
          <div className="absolute inset-0 rounded-t-[2rem] bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 shadow-2xl border-2 border-gray-700">
            {/* Brillo superior del casco */}
            <div className="absolute top-0 left-0 right-0 h-8 rounded-t-[2rem] bg-gradient-to-b from-gray-600/30 to-transparent" />

            {/* VISOR - Icónico de Tesla */}
            <motion.div
              className="absolute top-[30px] left-1/2 -translate-x-1/2 w-[65px] h-[35px] rounded-full overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #f0f0f0 0%, #ffffff 50%, #e0e0e0 100%)',
                boxShadow: '0 0 20px rgba(6, 182, 212, 0.6), inset 0 2px 4px rgba(255,255,255,0.5)',
              }}
              animate={{
                boxShadow: [
                  '0 0 20px rgba(6, 182, 212, 0.4), inset 0 2px 4px rgba(255,255,255,0.5)',
                  '0 0 30px rgba(6, 182, 212, 0.8), inset 0 2px 4px rgba(255,255,255,0.5)',
                  '0 0 20px rgba(6, 182, 212, 0.4), inset 0 2px 4px rgba(255,255,255,0.5)',
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              {/* Reflejo del visor */}
              <div className="absolute top-1 left-2 w-12 h-4 rounded-full bg-gradient-to-r from-cyan-200 to-blue-200 opacity-70 blur-sm" />

              {/* Línea de escaneo */}
              <motion.div
                className="absolute top-0 left-0 right-0 h-1 bg-cyan-400 opacity-60"
                animate={{
                  y: [0, 30, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </motion.div>

            {/* Líneas de diseño en casco */}
            <div className="absolute top-[20px] left-2 right-2 h-[1px] bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
            <div className="absolute bottom-4 left-2 right-2 h-[1px] bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
          </div>

          {/* Antena superior */}
          <motion.div
            className="absolute -top-4 left-1/2 -translate-x-1/2 w-1.5 h-8 bg-gradient-to-t from-gray-700 to-transparent"
            animate={{
              scaleY: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            <motion.div
              className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-cyan-400"
              style={{
                boxShadow: '0 0 10px rgba(6, 182, 212, 0.8)',
              }}
              animate={{
                boxShadow: [
                  '0 0 10px rgba(6, 182, 212, 0.8)',
                  '0 0 20px rgba(6, 182, 212, 1)',
                  '0 0 10px rgba(6, 182, 212, 0.8)',
                ],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
            />
          </motion.div>
        </motion.div>

        {/* CUELLO */}
        <div className="relative mx-auto w-12 h-10 bg-gradient-to-b from-gray-800 via-gray-700 to-gray-800 border-x-2 border-gray-600 shadow-lg">
          <div className="absolute inset-x-2 top-1/2 h-[1px] bg-gray-600" />
        </div>

        {/* TORSO - Blanco premium estilo Tesla */}
        <div className="relative mx-auto w-36 h-48 rounded-3xl bg-gradient-to-b from-gray-50 via-white to-gray-100 border-4 border-gray-300 shadow-2xl overflow-hidden">
          {/* Brillo superior */}
          <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white/60 to-transparent" />

          {/* LOGO/CORE en pecho */}
          <motion.div
            className="absolute top-6 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full"
            style={{
              background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%)',
              boxShadow: '0 0 30px rgba(6, 182, 212, 0.6), inset 0 0 20px rgba(255,255,255,0.3)',
            }}
            animate={{
              boxShadow: [
                '0 0 30px rgba(6, 182, 212, 0.6), inset 0 0 20px rgba(255,255,255,0.3)',
                '0 0 50px rgba(59, 130, 246, 0.8), inset 0 0 20px rgba(255,255,255,0.3)',
                '0 0 30px rgba(6, 182, 212, 0.6), inset 0 0 20px rgba(255,255,255,0.3)',
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            {/* Core interno */}
            <div className="absolute inset-3 rounded-full bg-gradient-to-br from-cyan-300 to-blue-400 shadow-inner">
              <motion.div
                className="absolute inset-1 rounded-full bg-gradient-to-br from-white/40 to-transparent"
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </div>
          </motion.div>

          {/* Paneles del pecho */}
          <div className="absolute top-28 left-4 right-4 space-y-3">
            <div className="h-[2px] bg-gradient-to-r from-transparent via-gray-300 to-transparent rounded-full" />
            <div className="h-[2px] bg-gradient-to-r from-transparent via-gray-300 to-transparent rounded-full" />
          </div>

          {/* Sección negra inferior (cintura) */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-gray-800 via-gray-900 to-black rounded-b-3xl border-t-2 border-gray-700">
            <div className="absolute inset-x-4 top-2 h-[1px] bg-gray-600" />
          </div>

          {/* Detalles laterales */}
          <div className="absolute top-24 left-2 w-1 h-20 bg-gradient-to-b from-gray-300 to-gray-400 rounded-full" />
          <div className="absolute top-24 right-2 w-1 h-20 bg-gradient-to-b from-gray-300 to-gray-400 rounded-full" />
        </div>

        {/* BRAZO IZQUIERDO */}
        <motion.div
          className="absolute top-32 -left-10 w-7 h-36 origin-top"
          animate={{
            rotate: [-8, 8, -8],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Hombro */}
          <div className="absolute top-0 left-0 w-full h-16 rounded-full bg-gradient-to-b from-gray-100 to-gray-200 border-2 border-gray-300 shadow-lg" />

          {/* Codo */}
          <div className="absolute top-14 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-700 shadow-xl z-10" />

          {/* Antebrazo */}
          <motion.div
            className="absolute top-16 left-0 w-full h-24 rounded-full bg-gradient-to-b from-gray-200 to-gray-300 border-2 border-gray-300 shadow-lg origin-top"
            animate={{
              rotate: [0, -12, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          >
            {/* Mano */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-9 rounded-b-xl bg-gradient-to-b from-gray-700 to-gray-900 border-2 border-gray-600 shadow-xl">
              {/* Dedos */}
              <div className="absolute -bottom-1 left-0 w-4 h-3 bg-gray-800 rounded-bl-md" />
              <div className="absolute -bottom-1 right-0 w-4 h-3 bg-gray-800 rounded-br-md" />
            </div>
          </motion.div>
        </motion.div>

        {/* BRAZO DERECHO */}
        <motion.div
          className="absolute top-32 -right-10 w-7 h-36 origin-top"
          animate={{
            rotate: [8, -8, 8],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Hombro */}
          <div className="absolute top-0 right-0 w-full h-16 rounded-full bg-gradient-to-b from-gray-100 to-gray-200 border-2 border-gray-300 shadow-lg" />

          {/* Codo */}
          <div className="absolute top-14 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-700 shadow-xl z-10" />

          {/* Antebrazo */}
          <motion.div
            className="absolute top-16 right-0 w-full h-24 rounded-full bg-gradient-to-b from-gray-200 to-gray-300 border-2 border-gray-300 shadow-lg origin-top"
            animate={{
              rotate: [0, 12, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          >
            {/* Mano */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-9 rounded-b-xl bg-gradient-to-b from-gray-700 to-gray-900 border-2 border-gray-600 shadow-xl">
              {/* Dedos */}
              <div className="absolute -bottom-1 left-0 w-4 h-3 bg-gray-800 rounded-bl-md" />
              <div className="absolute -bottom-1 right-0 w-4 h-3 bg-gray-800 rounded-br-md" />
            </div>
          </motion.div>
        </motion.div>

        {/* PIERNA IZQUIERDA */}
        <div className="absolute bottom-0 left-[38%] -translate-x-1/2 w-8 h-40">
          {/* Muslo */}
          <div className="absolute top-0 left-0 w-full h-20 rounded-full bg-gradient-to-b from-gray-100 to-gray-200 border-2 border-gray-300 shadow-lg" />

          {/* Rodilla */}
          <div className="absolute top-[70px] left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-gradient-to-br from-gray-900 to-black border-2 border-gray-700 shadow-2xl z-10" />

          {/* Pantorrilla */}
          <div className="absolute top-20 left-0 w-full h-24 rounded-full bg-gradient-to-b from-gray-200 to-gray-300 border-2 border-gray-300 shadow-lg" />

          {/* Pie */}
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-11 h-7 rounded-b-2xl bg-gradient-to-b from-gray-900 to-black border-2 border-gray-700 shadow-2xl" />
        </div>

        {/* PIERNA DERECHA */}
        <div className="absolute bottom-0 right-[38%] translate-x-1/2 w-8 h-40">
          {/* Muslo */}
          <div className="absolute top-0 right-0 w-full h-20 rounded-full bg-gradient-to-b from-gray-100 to-gray-200 border-2 border-gray-300 shadow-lg" />

          {/* Rodilla */}
          <div className="absolute top-[70px] left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-gradient-to-br from-gray-900 to-black border-2 border-gray-700 shadow-2xl z-10" />

          {/* Pantorrilla */}
          <div className="absolute top-20 right-0 w-full h-24 rounded-full bg-gradient-to-b from-gray-200 to-gray-300 border-2 border-gray-300 shadow-lg" />

          {/* Pie */}
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-11 h-7 rounded-b-2xl bg-gradient-to-b from-gray-900 to-black border-2 border-gray-700 shadow-2xl" />
        </div>

        {/* SOMBRA DEL ROBOT */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-40 h-6 bg-black/40 rounded-full blur-xl" />
      </motion.div>

      {/* Partículas de energía flotantes */}
      {[...Array(16)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
          style={{
            left: `${50 + Math.cos((i * Math.PI * 2) / 16) * 160}px`,
            top: `${50 + Math.sin((i * Math.PI * 2) / 16) * 160}%`,
            boxShadow: '0 0 10px rgba(6, 182, 212, 0.6)',
          }}
          animate={{
            scale: [0, 1.5, 0],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  )
}
