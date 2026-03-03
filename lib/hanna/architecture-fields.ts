import type { ArchitectureSection } from '@/types/marketing-architecture'

export interface FieldConfig {
  key: string
  label: string
  placeholder: string
  type: 'text' | 'textarea' | 'list' | 'object-list'
  group?: string
  hint?: string
  objectFields?: Array<{ key: string; label: string; placeholder: string }>
}

export interface SectionFieldConfig {
  title: string
  description: string
  groups: Array<{ id: string; label: string }>
  fields: FieldConfig[]
}

export const SECTION_FIELDS: Record<ArchitectureSection, SectionFieldConfig> = {
  avatar: {
    title: 'Avatar de Cliente Ideal',
    description: 'Define quien es tu cliente ideal para que cada mensaje, oferta y estrategia conecte profundamente.',
    groups: [
      { id: 'identity', label: 'Identidad' },
      { id: 'emotions', label: 'Emociones' },
      { id: 'behavior', label: 'Comportamiento' },
      { id: 'language', label: 'Lenguaje' },
    ],
    fields: [
      { key: 'identity.selfDefinition', label: 'Como se define a si misma', placeholder: 'Ej: "Soy emprendedora digital, mama de 2..."', type: 'textarea', group: 'identity' },
      { key: 'identity.aspiredRole', label: 'Rol al que aspira', placeholder: 'Ej: "Quiere ser reconocida como experta en..."', type: 'text', group: 'identity' },
      { key: 'identity.identifiesWith', label: 'Con que se identifica', placeholder: 'Ej: "Se identifica con marcas como..."', type: 'text', group: 'identity' },
      { key: 'hell.mainFrustration', label: 'Frustracion principal', placeholder: 'Ej: "Trabaja 12 horas y no ve resultados..."', type: 'textarea', group: 'emotions', hint: 'El dolor mas intenso que siente' },
      { key: 'hell.failedAttempts', label: 'Intentos fallidos', placeholder: 'Agrega cada intento que ha hecho...', type: 'list', group: 'emotions' },
      { key: 'hell.consequences', label: 'Consecuencias de no resolver', placeholder: 'Agrega cada consecuencia...', type: 'list', group: 'emotions' },
      { key: 'heaven.dreamResult', label: 'Resultado sonado', placeholder: 'Ej: "Facturar $10K/mes trabajando 4 horas/dia..."', type: 'textarea', group: 'emotions', hint: 'El sueno mas profundo de tu cliente' },
      { key: 'buyingBehavior.trigger', label: 'Que dispara la compra', placeholder: 'Ej: "Ver que alguien similar tuvo exito..."', type: 'text', group: 'behavior' },
      { key: 'buyingBehavior.trustSignals', label: 'Senales de confianza', placeholder: 'Ej: "Testimonios reales, garantia..."', type: 'text', group: 'behavior' },
      { key: 'buyingBehavior.objections', label: 'Objeciones principales', placeholder: 'Ej: "No tengo tiempo, es muy caro..."', type: 'text', group: 'behavior' },
      { key: 'language.wordsToUse', label: 'Palabras que resuenan', placeholder: 'Agrega palabras que conectan...', type: 'list', group: 'language' },
      { key: 'language.wordsToAvoid', label: 'Palabras que repelen', placeholder: 'Agrega palabras a evitar...', type: 'list', group: 'language' },
      { key: 'summary', label: 'Resumen del avatar', placeholder: 'Describe a tu avatar en 2-3 oraciones...', type: 'textarea', group: 'language' },
    ],
  },
  offer: {
    title: 'Tu Oferta Irresistible',
    description: 'Construye una oferta tan buena que la gente se sienta tonta diciendo que no.',
    groups: [
      { id: 'basic', label: 'Basico' },
      { id: 'pricing', label: 'Precios' },
      { id: 'differentiation', label: 'Diferenciacion' },
      { id: 'closing', label: 'Cierre' },
    ],
    fields: [
      { key: 'basicInfo.name', label: 'Nombre de la oferta', placeholder: 'Ej: "Programa Scale to $10K"', type: 'text', group: 'basic' },
      { key: 'basicInfo.type', label: 'Tipo de producto', placeholder: 'Ej: Curso, consultoria, SaaS, membresía...', type: 'text', group: 'basic' },
      { key: 'basicInfo.oneLiner', label: 'One-liner de la oferta', placeholder: 'En una oracion, que ofreces y para quien', type: 'textarea', group: 'basic' },
      { key: 'hook', label: 'Gancho principal', placeholder: 'Ej: "Duplica tus ventas en 90 dias o te devolvemos tu dinero"', type: 'textarea', group: 'basic', hint: 'La frase que hace que quieran saber mas' },
      { key: 'pricing.model', label: 'Modelo de precios', placeholder: 'Ej: Pago unico, suscripcion, tier...', type: 'text', group: 'pricing' },
      { key: 'guarantee.type', label: 'Tipo de garantia', placeholder: 'Ej: 30 dias, resultados, condicional...', type: 'text', group: 'differentiation' },
      { key: 'guarantee.text', label: 'Texto de la garantia', placeholder: 'Ej: "Si no ves resultados en 90 dias, te reembolsamos el 100%"', type: 'textarea', group: 'differentiation' },
      { key: 'unfairAdvantage', label: 'Ventaja competitiva', placeholder: 'Que tienes tu que nadie mas puede replicar?', type: 'textarea', group: 'differentiation', hint: 'Lo que te hace imposible de copiar' },
      { key: 'cta', label: 'Call to Action', placeholder: 'Ej: "Empieza tu transformacion hoy"', type: 'text', group: 'closing' },
      { key: 'summary', label: 'Resumen de la oferta', placeholder: 'Describe tu oferta en 2-3 oraciones...', type: 'textarea', group: 'closing' },
    ],
  },
  communication: {
    title: 'Comunicacion Estrategica',
    description: 'Define tu voz, tu mensaje central y los pilares que guian todo tu contenido.',
    groups: [
      { id: 'message', label: 'Mensaje' },
      { id: 'pillars', label: 'Pilares' },
      { id: 'tone', label: 'Tono' },
      { id: 'hooks', label: 'Hooks' },
    ],
    fields: [
      { key: 'coreMessage', label: 'Mensaje central', placeholder: 'La idea central que quieres que todo el mundo entienda...', type: 'textarea', group: 'message', hint: 'El corazon de toda tu comunicacion' },
      { key: 'positioning', label: 'Posicionamiento', placeholder: 'Ej: "La unica consultora de marketing para mamás emprendedoras"', type: 'textarea', group: 'message' },
      { key: 'positioningPhrase', label: 'Frase de posicionamiento', placeholder: 'Tu frase memorable y repetible...', type: 'text', group: 'message' },
      { key: 'contentPillars', label: 'Pilares de contenido', placeholder: '', type: 'object-list', group: 'pillars', objectFields: [
        { key: 'pillar', label: 'Pilar', placeholder: 'Ej: Mindset de crecimiento' },
        { key: 'description', label: 'Descripcion', placeholder: 'De que trata este pilar' },
        { key: 'keyMessage', label: 'Mensaje clave', placeholder: 'Lo principal que comunica' },
      ] },
      { key: 'tone.adjectives', label: 'Adjetivos de tu tono', placeholder: 'Agrega adjetivos que describen tu voz...', type: 'list', group: 'tone', hint: 'Ej: "Directo", "Empatico", "Inspirador"' },
      { key: 'originStory', label: 'Tu historia de origen', placeholder: 'La historia que conecta emocionalmente con tu audiencia...', type: 'textarea', group: 'tone' },
      { key: 'hooks', label: 'Hooks que funcionan', placeholder: 'Agrega frases gancho...', type: 'list', group: 'hooks', hint: 'Frases que capturan atencion' },
      { key: 'manifesto', label: 'Manifiesto de marca', placeholder: 'Tu declaracion de principios...', type: 'textarea', group: 'hooks' },
    ],
  },
  content_strategy: {
    title: 'Estrategia de Contenido',
    description: 'Planifica que contenido crear, donde publicarlo y como medir su impacto.',
    groups: [
      { id: 'insight', label: 'Insight' },
      { id: 'categories', label: 'Categorias' },
      { id: 'channels', label: 'Canales' },
      { id: 'metrics', label: 'Metricas' },
    ],
    fields: [
      { key: 'insight.currentBelief', label: 'Creencia actual de tu audiencia', placeholder: 'Lo que tu audiencia cree hoy que necesitas cambiar...', type: 'textarea', group: 'insight' },
      { key: 'insight.truthNeeded', label: 'Verdad que necesitan escuchar', placeholder: 'La verdad que cambiaria su perspectiva...', type: 'textarea', group: 'insight', hint: 'El insight que mueve de la creencia limitante a la accion' },
      { key: 'insight.creatorRole', label: 'Tu rol como creadora', placeholder: 'Ej: "Soy la guia que ya recorrio el camino..."', type: 'text', group: 'insight' },
      { key: 'categories', label: 'Categorias de contenido', placeholder: '', type: 'object-list', group: 'categories', objectFields: [
        { key: 'name', label: 'Nombre', placeholder: 'Ej: Educativo' },
        { key: 'description', label: 'Descripcion', placeholder: 'Que tipo de contenido es' },
        { key: 'reason', label: 'Por que', placeholder: 'Por que esta categoria' },
      ] },
      { key: 'channels', label: 'Canales principales', placeholder: '', type: 'object-list', group: 'channels', objectFields: [
        { key: 'name', label: 'Canal', placeholder: 'Ej: Instagram' },
        { key: 'format', label: 'Formato', placeholder: 'Ej: Reels, carruseles' },
        { key: 'frequency', label: 'Frecuencia', placeholder: 'Ej: 3x por semana' },
      ] },
      { key: 'hookFormulas', label: 'Formulas de hooks', placeholder: 'Agrega formulas que funcionan...', type: 'list', group: 'metrics', hint: 'Ej: "El error #1 que cometen..."' },
      { key: 'northStarMetric', label: 'Metrica norte', placeholder: 'La unica metrica que mas importa...', type: 'text', group: 'metrics', hint: 'La metrica que define tu exito en contenido' },
    ],
  },
  branding: {
    title: 'Branding de Marca',
    description: 'Define la esencia, voz y personalidad de tu marca para que sea memorable.',
    groups: [
      { id: 'essence', label: 'Esencia' },
      { id: 'verbal', label: 'Verbal' },
      { id: 'personality', label: 'Personalidad' },
    ],
    fields: [
      { key: 'essence.archetype', label: 'Arquetipo de marca', placeholder: 'Ej: "El Sabio", "El Explorador", "El Heroe"...', type: 'text', group: 'essence', hint: 'El arquetipo jungiano de tu marca' },
      { key: 'essence.threeWords', label: 'Tu marca en 3 palabras', placeholder: 'Agrega 3 palabras...', type: 'list', group: 'essence' },
      { key: 'essence.aesthetic', label: 'Estetica general', placeholder: 'Ej: "Minimalista y profesional con toques calidos"', type: 'text', group: 'essence' },
      { key: 'verbal.brandName', label: 'Nombre de marca', placeholder: 'El nombre de tu marca/negocio', type: 'text', group: 'verbal' },
      { key: 'verbal.tagline', label: 'Tagline', placeholder: 'Tu frase de batalla...', type: 'text', group: 'verbal', hint: 'Corta, memorable, aspiracional' },
      { key: 'verbal.oneLiner', label: 'One-liner', placeholder: 'En una linea, que haces y para quien...', type: 'textarea', group: 'verbal' },
      { key: 'personality.personality', label: 'Rasgos de personalidad', placeholder: 'Agrega rasgos...', type: 'list', group: 'personality', hint: 'Ej: "Confiada", "Empatica", "Directa"' },
      { key: 'personality.howSpeaks', label: 'Como habla tu marca', placeholder: 'Describe el estilo de comunicacion...', type: 'textarea', group: 'personality' },
    ],
  },
  funnel: {
    title: 'Embudo de Conversion',
    description: 'Disena el camino completo que recorre tu cliente desde desconocido hasta fan.',
    groups: [
      { id: 'traffic', label: 'Trafico' },
      { id: 'capture', label: 'Captura' },
      { id: 'conversion', label: 'Conversion' },
      { id: 'retention', label: 'Retencion' },
    ],
    fields: [
      { key: 'capture.mechanism', label: 'Mecanismo de captura', placeholder: 'Ej: Landing page, formulario, chatbot...', type: 'text', group: 'capture' },
      { key: 'capture.leadMagnetName', label: 'Nombre del lead magnet', placeholder: 'Ej: "Guia de 7 pasos para..."', type: 'text', group: 'capture' },
      { key: 'capture.leadMagnetDescription', label: 'Descripcion del lead magnet', placeholder: 'Que recibe la persona a cambio de su email...', type: 'textarea', group: 'capture' },
      { key: 'capture.ctaButton', label: 'Texto del boton CTA', placeholder: 'Ej: "Descarga gratis ahora"', type: 'text', group: 'capture' },
      { key: 'conversion.model', label: 'Modelo de venta', placeholder: 'Ej: Webinar, llamada de descubrimiento, carrito...', type: 'text', group: 'conversion' },
      { key: 'conversion.paymentPlatform', label: 'Plataforma de pago', placeholder: 'Ej: Stripe, PayPal, Hotmart...', type: 'text', group: 'conversion' },
      { key: 'conversion.upsell', label: 'Upsell o cross-sell', placeholder: 'Que mas ofreces despues de la venta principal?', type: 'textarea', group: 'conversion' },
      { key: 'retention.strategy', label: 'Estrategia de retencion', placeholder: 'Como haces que el cliente se quede y vuelva...', type: 'textarea', group: 'retention' },
      { key: 'metrics.conversionRate', label: 'Tasa de conversion actual', placeholder: 'Ej: 2.5%', type: 'text', group: 'retention' },
      { key: 'metrics.traffic', label: 'Trafico mensual', placeholder: 'Ej: 5,000 visitas/mes', type: 'text', group: 'traffic' },
    ],
  },
}
