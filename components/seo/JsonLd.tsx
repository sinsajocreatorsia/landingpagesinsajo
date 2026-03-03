interface JsonLdProps {
  data: Record<string, unknown>
}

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Sinsajo Creators',
  url: 'https://www.screatorsai.com',
  logo: 'https://www.screatorsai.com/images/sinsajo-logo.png',
  description: 'Transformamos empresarias exitosas en líderes tecnológicas con inteligencia artificial. Agentes de IA personalizados para tu negocio.',
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'sales@sinsajocreators.com',
    contactType: 'sales',
    availableLanguage: ['Spanish', 'English'],
  },
}

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Sinsajo Creators',
  url: 'https://www.screatorsai.com',
  inLanguage: ['es', 'en'],
}

export const workshopEventSchema = {
  '@context': 'https://schema.org',
  '@type': 'EducationEvent',
  name: 'IA para Empresarias Exitosas - De Dueña Agotada a Estratega Imparable',
  description: 'Workshop exclusivo de estrategia IA para empresarias de habla hispana. Aprende a automatizar tu negocio, recuperar 10+ horas semanales y escalar sin trabajar más.',
  startDate: '2026-03-07T09:00:00-05:00',
  endDate: '2026-03-07T12:00:00-05:00',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  eventStatus: 'https://schema.org/EventScheduled',
  inLanguage: 'es',
  maximumAttendeeCapacity: 5,
  organizer: {
    '@type': 'Organization',
    name: 'Sinsajo Creators',
    url: 'https://www.screatorsai.com',
  },
  performer: {
    '@type': 'Person',
    name: 'Giovanna Rodríguez',
    jobTitle: 'CEO de Sinsajo Creators',
  },
  offers: {
    '@type': 'Offer',
    price: '100.00',
    priceCurrency: 'USD',
    availability: 'https://schema.org/LimitedAvailability',
    validFrom: '2026-01-01',
    url: 'https://www.screatorsai.com/academy/workshop#pricing',
  },
  teaches: [
    'Automatización de negocios con IA',
    'Creación de asistentes virtuales',
    'Estrategia digital para empresarias',
    'Recuperación de tiempo con automatización',
  ],
}

export const workshopFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '¿En qué idioma es el workshop?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'El workshop será en español, optimizado para fundadoras latinas. Todo el material, incluyendo el workbook digital, estará en español.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Necesito experiencia previa con IA?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '¡Para nada! Este workshop es el primer paso perfecto para comenzar a automatizar tu negocio con IA. Está diseñado para empresarias que quieren dar el salto tecnológico, sin importar tu nivel actual.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Qué incluye el workbook digital?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'El workbook incluye plantillas de estrategia AI, checklists de implementación, prompts personalizables para tu industria, y un plan de acción de 30 días post-workshop.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Cuántos lugares hay disponibles?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '¡Los 12 cupos se agotaron! Únete a la lista de espera para el próximo workshop. Es ultra-íntimo con un grupo reducido que permite una experiencia de aprendizaje personalizada con atención individual.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Cómo puedo pagar?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Aceptamos pagos con tarjeta de crédito/débito (Visa, Mastercard, Amex) a través de Stripe. Tu pago es 100% seguro con encriptación SSL.',
      },
    },
  ],
}
