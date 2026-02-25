import { Metadata } from 'next'
import ClientWrapper from '@/components/ClientWrapper'

export const metadata: Metadata = {
  title: 'Sinsajo Creators - Agentes de IA que Trabajan Mientras Duermes',
  description: 'Automatiza atención al cliente, califica leads y cierra ventas 24/7 con agentes de IA personalizados. Reduce costos 80% y escala tu negocio sin límites.',
  keywords: [
    'agentes de IA personalizados', 'automatización de negocios', 'chatbot inteligente',
    'inteligencia artificial para empresas', 'atención al cliente automatizada',
    'calificar leads con IA', 'ventas automatizadas 24/7', 'Sinsajo Creators',
    'AI agents for business', 'business automation AI',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Sinsajo Creators - Agentes de IA que Trabajan Mientras Duermes',
    description: 'Agentes de IA personalizados que automatizan ventas, atienden clientes y califican leads 24/7. Reduce costos 80%.',
    images: ['/images/sinsajo-logo.png'],
  },
}
import HeroSection from '@/components/sections/HeroSection'
import ProblemSection from '@/components/sections/ProblemSection'
import SolutionSection from '@/components/sections/SolutionSection'
import AgentTypesSection from '@/components/sections/AgentTypesSection'
import BenefitsSection from '@/components/sections/BenefitsSection'
import UseCasesSection from '@/components/sections/UseCasesSection'
import TechnologySection from '@/components/sections/TechnologySection'
import SocialProofSection from '@/components/sections/SocialProofSection'
import ComparisonSection from '@/components/sections/ComparisonSection'
import FAQSection from '@/components/sections/FAQSection'
import FinalCTASection from '@/components/sections/FinalCTASection'
import Footer from '@/components/sections/Footer'

export default function Home() {
  return (
    <main className="relative min-h-screen pt-20">
      <ClientWrapper>
        {/* All Sections */}
        <div id="hero">
          <HeroSection />
        </div>

        <ProblemSection />
        <SolutionSection />
        <div id="agents">
          <AgentTypesSection />
        </div>
        <div id="benefits">
          <BenefitsSection />
        </div>
        <div id="cases">
          <UseCasesSection />
        </div>
        <TechnologySection />
        <SocialProofSection />
        <ComparisonSection />
        <div id="faq">
          <FAQSection />
        </div>
        <FinalCTASection />
        <Footer />
      </ClientWrapper>
    </main>
  )
}
