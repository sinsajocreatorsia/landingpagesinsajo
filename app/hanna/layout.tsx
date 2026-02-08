import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hanna - Tu Asistente de Marketing con IA | Sinsajo Creators',
  description: 'Hanna te ayuda a crear contenido, responder clientes y vender más con inteligencia artificial.',
}

export default function HannaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: '#main-site-header { display: none !important; }' }} />
      {children}
    </>
  )
}
