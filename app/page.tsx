import ClientWrapper from '@/components/ClientWrapper'
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
        <AgentTypesSection />
        <BenefitsSection />
        <UseCasesSection />
        <TechnologySection />
        <SocialProofSection />
        <ComparisonSection />
        <FAQSection />
        <FinalCTASection />
        <Footer />
      </ClientWrapper>
    </main>
  )
}
