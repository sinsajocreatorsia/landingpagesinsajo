import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hanna - Tu Consultora de Negocios con IA',
  description: 'Hanna es tu consultora estratégica de negocios potenciada por inteligencia artificial. Crea contenido, diseña estrategias de marketing y escala tu negocio con IA.',
  keywords: [
    'consultora IA', 'asistente marketing IA', 'Hanna IA',
    'estrategia de negocios con IA', 'marketing automatizado',
    'Sinsajo Creators', 'AI business consultant',
  ],
  openGraph: {
    title: 'Hanna - Tu Consultora de Negocios con IA | Sinsajo Creators',
    description: 'Consultora estratégica de negocios potenciada por IA. Estrategias personalizadas para tu negocio.',
    images: ['/images/hanna-ai.png'],
  },
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
