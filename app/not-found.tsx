import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#022133] to-[#200F5D] px-4">
      <div className="text-center max-w-md">
        <h1 className="text-8xl font-bold text-[#2CB6D7] mb-4">404</h1>
        <h2 className="text-2xl font-bold text-[#FCFEFB] mb-4">
          Página no encontrada
        </h2>
        <p className="text-[#FCFEFB]/70 mb-8">
          Lo sentimos, la página que buscas no existe o fue movida.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#C7517E] to-[#b8456f] text-white font-semibold rounded-xl hover:from-[#d4608d] hover:to-[#C7517E] transition-all"
          >
            Ir al inicio
          </Link>
          <Link
            href="/academy/workshop"
            className="inline-flex items-center justify-center px-6 py-3 bg-[#2CB6D7] text-white font-semibold rounded-xl hover:bg-[#189FB2] transition-all"
          >
            Ver Workshop
          </Link>
        </div>
      </div>
    </main>
  )
}
