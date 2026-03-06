import { Metadata } from 'next'
import PromptsGalleryClient from './PromptsGalleryClient'

export const metadata: Metadata = {
  title: 'Biblioteca de Prompts para IA - Hanna | Sinsajo Creators',
  description: 'Explora +10,000 prompts para generacion de imagenes con IA. Filtra por estilo, tema y uso. Copia y refina prompts con Hanna, tu asistente de IA.',
  openGraph: {
    title: 'Biblioteca de Prompts para IA - Hanna',
    description: 'Explora +10,000 prompts para generacion de imagenes con IA.',
    type: 'website',
  },
}

export default function PromptsGalleryPage() {
  return <PromptsGalleryClient />
}
