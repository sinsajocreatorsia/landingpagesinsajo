import { Metadata } from 'next'
import WorkshopLayout from '@/components/workshop/WorkshopLayout'
import WorkshopHeader from '@/components/workshop/WorkshopHeader'
import WorkshopHero from '@/components/workshop/WorkshopHero'
import WorkshopProblem from '@/components/workshop/WorkshopProblem'
import WorkshopAbout from '@/components/workshop/WorkshopAbout'
import WorkshopMethodology from '@/components/workshop/WorkshopMethodology'
import WorkshopRoadmap from '@/components/workshop/WorkshopRoadmap'
import WorkshopTestimonials from '@/components/workshop/WorkshopTestimonials'
import WorkshopSpeaker from '@/components/workshop/WorkshopSpeaker'
import WorkshopPricing from '@/components/workshop/WorkshopPricing'
import WorkshopFAQ from '@/components/workshop/WorkshopFAQ'
import WorkshopFooter from '@/components/workshop/WorkshopFooter'
import WorkshopChatWidget from '@/components/workshop/WorkshopChatWidget'

export const metadata: Metadata = {
  title: 'IA para Empresarias Exitosas - Workshop | Sinsajo Creators',
  description: 'Workshop exclusivo de estrategia IA para empresarias de habla hispana. De Dueña Agotada a Estratega Imparable. Recupera 10+ horas semanales. Sábado 7 de Marzo 2026.',
  keywords: ['workshop IA', 'inteligencia artificial negocios', 'automatización empresas', 'empresarias exitosas', 'Sinsajo Creators'],
  openGraph: {
    title: 'IA para Empresarias Exitosas - De Dueña Agotada a Estratega Imparable',
    description: 'Workshop exclusivo para empresarias de habla hispana. Aprende a escalar tu negocio con agentes de IA. Sábado, 7 de Marzo 2026.',
    images: ['/images/workshop-og.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IA para Empresarias Exitosas - Workshop',
    description: 'Recupera 10+ horas semanales con automatización IA. Solo 7 lugares.',
    images: ['/images/workshop-og.png'],
  },
}

export default function WorkshopPage() {
  return (
    <WorkshopLayout>
      <div className="workshop-page">
        {/* Workshop-specific Header */}
        <WorkshopHeader />

        <main className="min-h-screen">
          {/* Hero - Main value proposition */}
          <WorkshopHero />

          {/* Problem - Pain points (Plan Maestro) */}
          <WorkshopProblem />

          {/* About - What you'll learn */}
          <WorkshopAbout />

          {/* Methodology - Metodología SINSAJO IA-3 */}
          <WorkshopMethodology />

          {/* Roadmap - Workshop agenda */}
          <WorkshopRoadmap />

          {/* Testimonials - Social proof */}
          <WorkshopTestimonials />

          {/* Speaker - Giovanna */}
          <WorkshopSpeaker />

          {/* Pricing - CTA */}
          <WorkshopPricing />

          {/* FAQ */}
          <WorkshopFAQ />

          {/* Footer */}
          <WorkshopFooter />
        </main>

        {/* Workshop-specific Chat Widget with auto-greeting */}
        <WorkshopChatWidget />
      </div>
    </WorkshopLayout>
  )
}
