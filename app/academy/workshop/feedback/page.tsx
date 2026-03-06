import type { Metadata } from 'next'
import WorkshopLayout from '@/components/workshop/WorkshopLayout'
import SurveyPage from '@/components/workshop/SurveyPage'

export const metadata: Metadata = {
  title: 'Feedback del Workshop | Sinsajo Creators',
  description: 'Comparte tu experiencia del workshop y recibe un mes gratis de Hanna Estratega Pro.',
  robots: 'noindex, nofollow',
}

export default function WorkshopFeedbackPage() {
  return (
    <WorkshopLayout>
      <SurveyPage />
    </WorkshopLayout>
  )
}
