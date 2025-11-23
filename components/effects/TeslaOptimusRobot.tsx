'use client'
import { motion } from 'framer-motion'

export default function TeslaOptimusRobot() {
  return (
    <div className="relative w-full h-full pointer-events-none">
      {/* Robot estilo Tesla Optimus - Blanco y Negro */}
      <motion.div
        className="relative w-full h-full flex items-center justify-center"
        animate={{
          y: [-10, 10, -10],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Cabeza - Diseño Tesla */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-20">
          {/* Casco negro con visor */}
          <div className="relative w-full h-full rounded-t-3xl bg-gradient-to-b from-gray-900 to-gray-800 border border-gray-700">
            {/* Visor blanco característico */}
            <motion.div
              className="absolute top-6 left-1/2 -translate-x-1/2 w-12 h-8 rounded-full bg-gradient-to-r from-gray-100 to-white"
              animate={{
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              {/* Reflejo del visor */}
              <div className="absolute top-1 left-2 w-8 h-2 rounded-full bg-cyan-200 opacity-60" />
            </motion.div>
          </div>

          {/* Línea de diseño en cabeza */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-600" />
        </div>

        {/* Cuello */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-10 h-8 bg-gradient-to-b from-gray-800 to-gray-700 border-x border-gray-600" />

        {/* Torso - Blanco estilo Tesla */}
        <div className="absolute top-28 left-1/2 -translate-x-1/2 w-28 h-36 rounded-2xl bg-gradient-to-b from-gray-100 to-gray-200 border-2 border-gray-300 shadow-lg">
          {/* Logo Tesla en pecho */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-8 h-8 flex items-center justify-center">
            <div className="text-gray-700 font-bold text-xs">TESLA</div>
          </div>

          {/* Líneas de paneles */}
          <div className="absolute top-16 left-2 right-2 h-px bg-gray-300" />
          <div className="absolute top-24 left-2 right-2 h-px bg-gray-300" />

          {/* Sección negra en cintura */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-b from-gray-800 to-gray-900 rounded-b-2xl border-t border-gray-600" />
        </div>

        {/* Brazo izquierdo - Blanco */}
        <motion.div
          className="absolute top-32 -left-6 w-5 h-28 rounded-full bg-gradient-to-b from-gray-100 to-gray-200 border border-gray-300"
          animate={{
            rotate: [-10, 10, -10],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Articulación del codo */}
          <div className="absolute top-14 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-gray-800 border-2 border-gray-600" />

          {/* Antebrazo */}
          <motion.div
            className="absolute top-14 left-0 w-5 h-20 rounded-full bg-gradient-to-b from-gray-200 to-gray-300 border border-gray-300"
            animate={{
              rotate: [0, -15, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          >
            {/* Mano */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-7 rounded-b-lg bg-gray-700 border border-gray-600">
              {/* Dedos */}
              <div className="absolute -bottom-1 left-0 w-3 h-2 bg-gray-600 rounded" />
            </div>
          </motion.div>
        </motion.div>

        {/* Brazo derecho - Blanco */}
        <motion.div
          className="absolute top-32 -right-6 w-5 h-28 rounded-full bg-gradient-to-b from-gray-100 to-gray-200 border border-gray-300"
          animate={{
            rotate: [10, -10, 10],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Articulación del codo */}
          <div className="absolute top-14 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-gray-800 border-2 border-gray-600" />

          {/* Antebrazo */}
          <motion.div
            className="absolute top-14 right-0 w-5 h-20 rounded-full bg-gradient-to-b from-gray-200 to-gray-300 border border-gray-300"
            animate={{
              rotate: [0, 15, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          >
            {/* Mano */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-7 rounded-b-lg bg-gray-700 border border-gray-600">
              {/* Dedos */}
              <div className="absolute -bottom-1 right-0 w-3 h-2 bg-gray-600 rounded" />
            </div>
          </motion.div>
        </motion.div>

        {/* Pierna izquierda - Blanca */}
        <div className="absolute bottom-4 left-1/3 -translate-x-1/2 w-6 h-32 rounded-full bg-gradient-to-b from-gray-100 to-gray-200 border border-gray-300">
          {/* Rodilla negra */}
          <div className="absolute top-16 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-gray-900 border-2 border-gray-700" />
          {/* Pie negro */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-9 h-5 rounded-b-xl bg-gray-900 border border-gray-700" />
        </div>

        {/* Pierna derecha - Blanca */}
        <div className="absolute bottom-4 right-1/3 translate-x-1/2 w-6 h-32 rounded-full bg-gradient-to-b from-gray-100 to-gray-200 border border-gray-300">
          {/* Rodilla negra */}
          <div className="absolute top-16 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-gray-900 border-2 border-gray-700" />
          {/* Pie negro */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-9 h-5 rounded-b-xl bg-gray-900 border border-gray-700" />
        </div>

        {/* Sombra debajo */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-32 h-4 bg-gray-900/30 rounded-full blur-md" />

        {/* Brillo sutil */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-transparent rounded-full blur-2xl"
          animate={{
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
        />
      </motion.div>
    </div>
  )
}
