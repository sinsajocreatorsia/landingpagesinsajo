import Link from 'next/link'
import { ShieldAlert } from 'lucide-react'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#022133] to-[#200F5D] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center">
            <ShieldAlert className="w-10 h-10 text-red-500" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white mb-4">
          Acceso No Autorizado
        </h1>

        <p className="text-white/70 mb-8">
          No tienes permisos para acceder a esta página. Si crees que esto es un error, contacta al administrador del sistema.
        </p>

        <div className="space-y-3">
          <Link
            href="/hanna/dashboard"
            className="block w-full py-3 px-6 bg-gradient-to-r from-[#2CB6D7] to-[#36B3AE] text-white font-medium rounded-xl hover:from-[#36B3AE] hover:to-[#2CB6D7] transition-all"
          >
            Volver a Hanna
          </Link>

          <Link
            href="mailto:sales@screatorsai.com"
            className="block w-full py-3 px-6 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-all"
          >
            Contactar Soporte
          </Link>
        </div>

        <p className="mt-6 text-white/40 text-sm">
          Error 403 - Forbidden
        </p>
      </div>
    </div>
  )
}
