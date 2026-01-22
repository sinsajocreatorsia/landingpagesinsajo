import Link from 'next/link'
import { CheckCircle, Calendar, Clock, Mail, ArrowLeft } from 'lucide-react'

export default function WorkshopSuccessPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#022133] to-[#200F5D] flex items-center justify-center px-4 py-20">
      <div className="max-w-lg w-full">
        {/* Success Card */}
        <div className="bg-[#FCFEFB] rounded-3xl p-8 md:p-12 shadow-2xl text-center">
          {/* Success Icon */}
          <div className="w-24 h-24 bg-gradient-to-r from-[#36B3AE] to-[#2CB6D7] rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
            <CheckCircle className="w-14 h-14 text-white" />
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-[#022133] mb-4">
            ¡Pago Exitoso!
          </h1>

          {/* Message */}
          <p className="text-[#022133]/70 text-lg mb-8">
            Tu lugar en el workshop{' '}
            <strong className="text-[#C7517E]">&quot;Latina Smart-Scaling&quot;</strong>{' '}
            está confirmado. Recibirás un email con todos los detalles de acceso.
          </p>

          {/* Event Details */}
          <div className="bg-gradient-to-r from-[#2CB6D7]/10 to-[#36B3AE]/10 rounded-2xl p-6 mb-8 space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Calendar className="w-6 h-6 text-[#2CB6D7]" />
              <span className="text-[#022133] font-semibold text-lg">
                Sábado, 7 de Marzo 2026
              </span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Clock className="w-6 h-6 text-[#2CB6D7]" />
              <span className="text-[#022133]/80">
                9:00 AM - 12:00 PM (EST)
              </span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Mail className="w-6 h-6 text-[#2CB6D7]" />
              <span className="text-[#022133]/80">
                Revisa tu email para el link de acceso
              </span>
            </div>
          </div>

          {/* Next Steps */}
          <div className="text-left bg-[#022133]/5 rounded-xl p-6 mb-8">
            <h3 className="font-bold text-[#022133] mb-3">Próximos pasos:</h3>
            <ul className="space-y-2 text-[#022133]/70">
              <li className="flex items-start gap-2">
                <span className="text-[#36B3AE] font-bold">1.</span>
                Revisa tu email (incluyendo spam) para la confirmación
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#36B3AE] font-bold">2.</span>
                Agrega el evento a tu calendario
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#36B3AE] font-bold">3.</span>
                Únete a la comunidad privada (link en el email)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#36B3AE] font-bold">4.</span>
                ¡Prepárate para transformar tu negocio!
              </li>
            </ul>
          </div>

          {/* CTA */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#022133] hover:bg-[#200F5D] text-white font-bold py-4 px-8 rounded-xl transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al Inicio
          </Link>
        </div>

        {/* Support note */}
        <p className="text-center text-[#FCFEFB]/60 mt-6 text-sm">
          ¿Tienes preguntas? Escríbenos a{' '}
          <a href="mailto:sales@sinsajocreators.com" className="text-[#2CB6D7] hover:underline">
            sales@sinsajocreators.com
          </a>
        </p>
      </div>
    </main>
  )
}
