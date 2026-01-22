import { Metadata } from 'next'
import WorkshopHero from '@/components/workshop/WorkshopHero'
import WorkshopAbout from '@/components/workshop/WorkshopAbout'
import WorkshopRoadmap from '@/components/workshop/WorkshopRoadmap'
import WorkshopSpeaker from '@/components/workshop/WorkshopSpeaker'
import WorkshopPricing from '@/components/workshop/WorkshopPricing'
import WorkshopFAQ from '@/components/workshop/WorkshopFAQ'

export const metadata: Metadata = {
  title: 'Latina Smart-Scaling Workshop | Sinsajo Creators',
  description: 'Workshop exclusivo de estrategia AI para fundadoras latinas. Aprende a escalar tu negocio con inteligencia artificial. 7 de Marzo 2026.',
  openGraph: {
    title: 'Latina Smart-Scaling: AI for Inspiring Businesses',
    description: 'Workshop exclusivo para fundadoras latinas establecidas. Sábado 7 de Marzo 2026.',
    images: ['/images/workshop-og.png'],
  },
}

export default function WorkshopPage() {
  return (
    <main className="min-h-screen">
      <WorkshopHero />
      <WorkshopAbout />
      <WorkshopRoadmap />
      <WorkshopSpeaker />
      <WorkshopPricing />
      <WorkshopFAQ />
    </main>
  )
}
