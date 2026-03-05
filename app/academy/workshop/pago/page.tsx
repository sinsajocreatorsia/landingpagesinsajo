'use client'

import Image from 'next/image'
import Link from 'next/link'
import PaymentButtons from '@/components/workshop/PaymentButtons'

export default function WorkshopPagoPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#022133] to-[#200F5D] px-4 py-12">
      <div className="max-w-xl mx-auto">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/sinsajo-logo-1.png"
              alt="Sinsajo Creators"
              width={48}
              height={48}
              className="object-contain"
            />
            <div className="text-xl font-bold">
              <span className="bg-gradient-to-r from-[#2CB6D7] to-[#36B3AE] bg-clip-text text-transparent">
                SINSAJO
              </span>
              <span className="text-[#FCFEFB]/80 font-normal ml-1">CREATORS</span>
            </div>
          </Link>
        </div>

        {/* Payment Card */}
        <div className="bg-[#FCFEFB] rounded-3xl p-8 md:p-10 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-[#C7517E]/10 px-4 py-2 rounded-full mb-4">
              <span className="text-[#C7517E] font-semibold text-sm">
                Inscripcion Exclusiva
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-[#022133] mb-3">
              Workshop: IA para Empresarias Exitosas
            </h1>

            <p className="text-[#022133]/70 text-sm mb-4">
              Sabado, 7 de Marzo 2026 &bull; 9:00 AM - 12:00 PM &bull; Presencial
            </p>

            <div className="flex items-center justify-center gap-2">
              <span className="text-3xl font-bold text-[#022133]">$100</span>
              <span className="text-[#022133]/50 text-lg">USD</span>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 mb-8" />

          {/* Payment Form */}
          <PaymentButtons price="100" workshopName="IA para Empresarias Exitosas" />
        </div>

        {/* Support */}
        <p className="text-center text-[#FCFEFB]/60 mt-6 text-sm">
          Preguntas? Escribenos a{' '}
          <a
            href="mailto:sales@sinsajocreators.com"
            className="text-[#2CB6D7] hover:underline"
          >
            sales@sinsajocreators.com
          </a>
        </p>
      </div>
    </main>
  )
}
