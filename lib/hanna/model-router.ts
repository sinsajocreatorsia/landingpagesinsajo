/**
 * Smart Model Router for Hanna
 *
 * Dynamically selects the best AI model via OpenRouter based on query type and plan.
 * - Free users: Always use Gemini 2.0 Flash (fast, economical)
 * - Pro users: Flash-tier routing (Gemini 2.0 Flash + 2.5 Flash)
 * - Business users: Premium routing (Gemini 2.5 Pro + Claude Sonnet 4)
 * - Fallback: If primary model fails, retry with a fallback model
 */

// Available models for routing
export const MODELS = {
  // Fast & economical - free users + simple Pro queries
  flash: 'google/gemini-2.0-flash-001',
  // Advanced reasoning - strategic/complex Pro queries
  pro: 'google/gemini-2.5-pro-preview-06-05',
  // Creative excellence - content/copy Pro queries
  creative: 'anthropic/claude-sonnet-4',
  // Fast mid-tier - balanced Pro queries
  flashPro: 'google/gemini-2.5-flash-preview-05-20',
} as const

export type ModelId = typeof MODELS[keyof typeof MODELS]

// Query categories for classification and analytics
export type QueryCategory = 'strategy' | 'marketing' | 'content' | 'analytics' | 'prompt_creation' | 'general'

interface RouteResult {
  model: ModelId
  fallbackModel: ModelId
  category: QueryCategory
  temperature: number
  maxTokens: number
}

// Keyword patterns for query classification
const STRATEGY_PATTERNS = [
  /\b(estrateg|plan\s+de\s+negocio|modelo\s+de\s+negocio|ventaja\s+competitiva|análisis\s+(?:de\s+mercado|FODA|SWOT|competencia)|posicionamiento|escalab|pricing|precios|inversión|financ|rentab|ROI|margen|flujo\s+de\s+caja|proyecci[oó]n|forecast|gananci|pérdida|utilidad|capital)/i,
  /\b(SWOT|FODA|Porter|Canvas|OKR|KPI|unit\s+economics|CAC|LTV|churn|retention|break\s*even|pivote?|diferenciaci[oó]n|expansi[oó]n|diversificaci[oó]n|alianza|partnership|joint\s+venture|fusión|adquisición)/i,
  /\b(crecimiento|escalar|estructura|organiz|proceso|operaci[oó]n|optimiz|eficiencia|productividad|automatiz|sistema|framework|metodolog)/i,
]

const MARKETING_PATTERNS = [
  /\b(marketing|embudo|funnel|campaña|publicidad|ads|facebook\s+ads|google\s+ads|instagram|tiktok|redes\s+sociales|social\s+media|SEO|SEM|email\s+marketing|newsletter|landing\s+page|conversi[oó]n|CTA|CTR|CPM|CPC|CPL|CPA|ROAS|leads?|prospectos?|audiencia|segmentaci[oó]n|targeting|retargeting|remarketing)/i,
  /\b(branding|marca|identidad|logo|slogan|tagline|storytelling|copywriting|propuesta\s+de\s+valor|UVP|mensaje|posicionamiento\s+de\s+marca|awareness|reconocimiento|reputaci[oó]n)/i,
  /\b(lanzamiento|launch|pre-launch|webinar|evento|comunidad|engagement|alcance|reach|impresiones|viral|orgánico|growth\s+hack)/i,
]

const CONTENT_PATTERNS = [
  /\b(contenido|content|post|publicaci[oó]n|blog|artículo|video|reel|story|stories|carousel|carrusel|infograf[ií]a|podcast|guión|script|caption|copy|texto|escribir|redact|creativo|creativa|creatividad|idea|inspiraci[oó]n|brainstorm)/i,
  /\b(calendario\s+(?:de\s+contenido|editorial)|parrilla|plan\s+de\s+contenido|grilla|schedule|frecuencia\s+de\s+publicaci[oó]n|content\s+strategy|formato|hook|gancho|titular|headline)/i,
]

const ANALYTICS_PATTERNS = [
  /\b(métrica|métricas|analítica|analytics|dato|datos|estadística|medir|medición|dashboard|reporte|informe|KPI|indicador|benchmark|comparar|tendencia|patrón|insight|resultado|performance|rendimiento)/i,
  /\b(Excel|spreadsheet|hoja\s+de\s+cálculo|gráfic|chart|tabla|porcentaje|promedio|media|mediana|crecimiento\s+porcentual|tasa\s+de|ratio)/i,
]

const PROMPT_CREATION_PATTERNS = [
  /\b(prompt|prompts|imagen\s+(?:con\s+)?(?:ia|ai)|generar?\s+imagen|generaci[oó]n\s+de\s+im[aá]genes?|ai\s+(?:art|image)|crear?\s+imagen)/i,
  /\b(midjourney|dall-?e|stable\s+diffusion|nano\s+banana|leonardo|firefly|ideogram|flux)/i,
  /\b(estilo\s+(?:fotogr[aá]fico|anime|3d|pixel|acuarela|cin[eé]|realista)|composici[oó]n|iluminaci[oó]n|textura|renderizado|fotorrealista|hiperrealista)/i,
  /\b(refinar?\s+(?:el\s+)?prompt|mejorar?\s+(?:el\s+)?prompt|prompt\s+(?:de\s+)?imagen|biblioteca\s+de\s+prompts)/i,
]

/**
 * Classify a user query into a category based on keyword matching.
 */
export function classifyQuery(message: string, history: Array<{ role: string; content: string }> = []): QueryCategory {
  // Also consider recent context (last 2 messages) for better classification
  const contextWindow = [
    ...history.slice(-2).map(m => m.content),
    message,
  ].join(' ')

  // Score each category
  const scores: Record<QueryCategory, number> = {
    strategy: 0,
    marketing: 0,
    content: 0,
    analytics: 0,
    prompt_creation: 0,
    general: 0,
  }

  for (const pattern of STRATEGY_PATTERNS) {
    if (pattern.test(contextWindow)) scores.strategy += 2
    if (pattern.test(message)) scores.strategy += 1 // Extra weight for current message
  }

  for (const pattern of MARKETING_PATTERNS) {
    if (pattern.test(contextWindow)) scores.marketing += 2
    if (pattern.test(message)) scores.marketing += 1
  }

  for (const pattern of CONTENT_PATTERNS) {
    if (pattern.test(contextWindow)) scores.content += 2
    if (pattern.test(message)) scores.content += 1
  }

  for (const pattern of ANALYTICS_PATTERNS) {
    if (pattern.test(contextWindow)) scores.analytics += 2
    if (pattern.test(message)) scores.analytics += 1
  }

  for (const pattern of PROMPT_CREATION_PATTERNS) {
    if (pattern.test(contextWindow)) scores.prompt_creation += 2
    if (pattern.test(message)) scores.prompt_creation += 1
  }

  // Find highest scoring category
  const maxScore = Math.max(...Object.values(scores))

  // If no strong signal, classify as general
  if (maxScore < 2) return 'general'

  const topCategory = (Object.entries(scores) as [QueryCategory, number][])
    .filter(([, score]) => score === maxScore)
    .map(([cat]) => cat)[0]

  return topCategory || 'general'
}

/**
 * Select optimal model for a Pro user based on query classification.
 * Pro tier uses Flash-only models (economical, fast).
 */
export function routeProQuery(
  message: string,
  history: Array<{ role: string; content: string }> = []
): RouteResult {
  const category = classifyQuery(message, history)

  switch (category) {
    case 'strategy':
    case 'analytics':
    case 'content':
    case 'marketing':
    case 'prompt_creation':
      // All specialized queries → Gemini 2.5 Flash (best Flash-tier model)
      return {
        model: MODELS.flashPro,
        fallbackModel: MODELS.flash,
        category,
        temperature: (category === 'content' || category === 'prompt_creation') ? 0.85 : 0.7,
        maxTokens: 1500,
      }

    case 'general':
    default:
      // Quick/simple → Gemini 2.0 Flash (speed)
      return {
        model: MODELS.flash,
        fallbackModel: MODELS.flashPro,
        category,
        temperature: 0.7,
        maxTokens: 1000,
      }
  }
}

/**
 * Select optimal model for a Business user based on query classification.
 * Business tier has access to premium models (Gemini 2.5 Pro, Claude Sonnet 4).
 */
export function routeBusinessQuery(
  message: string,
  history: Array<{ role: string; content: string }> = []
): RouteResult {
  const category = classifyQuery(message, history)

  switch (category) {
    case 'strategy':
    case 'analytics':
      // Complex reasoning → Gemini 2.5 Pro
      return {
        model: MODELS.pro,
        fallbackModel: MODELS.flashPro,
        category,
        temperature: 0.7,
        maxTokens: 2500,
      }

    case 'content':
    case 'prompt_creation':
      // Creative writing & prompt crafting → Claude Sonnet 4
      return {
        model: MODELS.creative,
        fallbackModel: MODELS.flashPro,
        category,
        temperature: 0.85,
        maxTokens: 2500,
      }

    case 'marketing':
      // Marketing → Gemini 2.5 Flash (balanced)
      return {
        model: MODELS.flashPro,
        fallbackModel: MODELS.flash,
        category,
        temperature: 0.8,
        maxTokens: 2000,
      }

    case 'general':
    default:
      // Quick/simple → Gemini 2.0 Flash (speed)
      return {
        model: MODELS.flash,
        fallbackModel: MODELS.flashPro,
        category,
        temperature: 0.7,
        maxTokens: 1500,
      }
  }
}

/**
 * Select model based on plan and context.
 * Free users get Flash. Pro users get Flash-tier routing. Business users get premium routing.
 */
export function selectModelForUser(
  plan: string,
  mode: string | null,
  message: string,
  history: Array<{ role: string; content: string }> = []
): RouteResult {
  // Workshop mode → always Flash
  if (mode === 'workshop') {
    return {
      model: MODELS.flash,
      fallbackModel: MODELS.flash,
      category: 'general',
      temperature: 0.8,
      maxTokens: 500,
    }
  }

  // Business users → premium model routing
  if (plan === 'business') {
    return routeBusinessQuery(message, history)
  }

  // Pro users → Flash-tier smart routing
  if (plan === 'pro') {
    return routeProQuery(message, history)
  }

  // Free users → always Flash
  return {
    model: MODELS.flash,
    fallbackModel: MODELS.flash,
    category: classifyQuery(message, history),
    temperature: 0.7,
    maxTokens: 600,
  }
}
