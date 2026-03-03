export interface QuickActionTemplate {
  id: string
  category: 'content' | 'communication' | 'strategy' | 'analytics'
  icon: string
  title: string
  description: string
  promptTemplate: string
  proOnly: boolean
}

export const CATEGORY_LABELS: Record<QuickActionTemplate['category'], string> = {
  content: 'Contenido',
  communication: 'Comunicacion',
  strategy: 'Estrategia',
  analytics: 'Metricas',
}

export const QUICK_ACTION_TEMPLATES: QuickActionTemplate[] = [
  // Content Creation
  {
    id: 'instagram-post',
    category: 'content',
    icon: 'Image',
    title: 'Post para Instagram',
    description: 'Crea un post atractivo para tu feed',
    promptTemplate: 'Crea un post de Instagram para {{business_name}} dirigido a {{target_audience}}. Mi negocio ofrece {{products_services}}. Incluye caption, hashtags relevantes y una llamada a la accion.',
    proOnly: false,
  },
  {
    id: 'story-caption',
    category: 'content',
    icon: 'Smartphone',
    title: 'Caption para Story',
    description: 'Texto para historia con enganche',
    promptTemplate: 'Dame 3 ideas de historias de Instagram para {{business_name}} que generen interaccion con {{target_audience}}. Incluye texto para cada slide y un CTA final.',
    proOnly: false,
  },
  {
    id: 'promo-email',
    category: 'content',
    icon: 'Mail',
    title: 'Email Promocional',
    description: 'Email de venta o promocion',
    promptTemplate: 'Redacta un email promocional para {{business_name}} dirigido a {{target_audience}}. Nuestros productos/servicios son: {{products_services}}. Incluye asunto, cuerpo y CTA.',
    proOnly: false,
  },
  {
    id: 'reel-idea',
    category: 'content',
    icon: 'Video',
    title: 'Idea de Reel',
    description: 'Concepto viral para Reels',
    promptTemplate: 'Dame una idea de Reel viral para {{business_name}} que conecte con {{target_audience}}. Incluye: hook de los primeros 3 segundos, estructura del video, texto en pantalla y audio sugerido.',
    proOnly: true,
  },

  // Communication
  {
    id: 'client-response',
    category: 'communication',
    icon: 'MessageCircle',
    title: 'Respuesta a Cliente',
    description: 'Responde profesionalmente',
    promptTemplate: 'Necesito una respuesta profesional para un cliente interesado en {{products_services}} de {{business_name}}. El cliente pregunta sobre precios y disponibilidad. Dame 2 versiones: una corta para WhatsApp y una mas detallada para email.',
    proOnly: false,
  },
  {
    id: 'follow-up',
    category: 'communication',
    icon: 'Send',
    title: 'Seguimiento',
    description: 'Mensaje de seguimiento a prospecto',
    promptTemplate: 'Redacta un mensaje de seguimiento para un prospecto que mostro interes en {{products_services}} de {{business_name}} pero no ha respondido en 3 dias. Que sea amable pero con sentido de urgencia.',
    proOnly: true,
  },
  {
    id: 'complaint-response',
    category: 'communication',
    icon: 'ShieldCheck',
    title: 'Respuesta a Queja',
    description: 'Maneja una queja con profesionalismo',
    promptTemplate: 'Un cliente de {{business_name}} tiene una queja. Necesito una respuesta empatica y profesional que resuelva la situacion y retenga al cliente. Dame un template que pueda adaptar.',
    proOnly: true,
  },

  // Strategy
  {
    id: 'value-proposition',
    category: 'strategy',
    icon: 'Target',
    title: 'Analizar Propuesta de Valor',
    description: 'Evalua y mejora tu PUV',
    promptTemplate: 'Analiza la propuesta de valor de {{business_name}}: ofrecemos {{products_services}} a {{target_audience}}. Dame feedback honesto: que funciona, que no, y como mejorarla para diferenciarnos.',
    proOnly: true,
  },
  {
    id: 'weekly-content-plan',
    category: 'strategy',
    icon: 'Calendar',
    title: 'Plan de Contenido Semanal',
    description: 'Planifica tu semana de publicaciones',
    promptTemplate: 'Crea un plan de contenido para esta semana para {{business_name}} en Instagram. Mi audiencia es {{target_audience}} y ofrezco {{products_services}}. Dame: dia, tipo de post, tema y caption sugerido.',
    proOnly: true,
  },
  {
    id: 'launch-ideas',
    category: 'strategy',
    icon: 'Rocket',
    title: 'Ideas de Lanzamiento',
    description: 'Estrategia para lanzar algo nuevo',
    promptTemplate: 'Estoy por lanzar algo nuevo en {{business_name}} para {{target_audience}}. Dame una estrategia de lanzamiento de 7 dias con: pre-lanzamiento, dia de lanzamiento y post-lanzamiento.',
    proOnly: true,
  },

  // Analytics
  {
    id: 'kpi-suggestions',
    category: 'analytics',
    icon: 'BarChart3',
    title: 'Sugerir KPIs',
    description: 'Metricas clave para tu negocio',
    promptTemplate: '{{business_name}} ofrece {{products_services}} a {{target_audience}}. Sugiereme los 5 KPIs mas importantes que deberia estar midiendo y como medirlos de forma practica.',
    proOnly: true,
  },
]

/**
 * Enriches a template prompt with actual business profile data.
 */
export function enrichTemplate(
  template: QuickActionTemplate,
  profile: {
    business_name?: string
    target_audience?: string
    products_services?: string
    brand_voice?: string
  }
): string {
  let prompt = template.promptTemplate
  prompt = prompt.replace(/\{\{business_name\}\}/g, profile.business_name || 'mi negocio')
  prompt = prompt.replace(/\{\{target_audience\}\}/g, profile.target_audience || 'mi audiencia')
  prompt = prompt.replace(/\{\{products_services\}\}/g, profile.products_services || 'mis productos/servicios')
  prompt = prompt.replace(/\{\{brand_voice\}\}/g, profile.brand_voice || 'profesional y cercano')
  return prompt
}
