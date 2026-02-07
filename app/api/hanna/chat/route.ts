import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { supabaseAdmin } from '@/lib/supabase'
import { calculateCosts } from '@/lib/utils/pricing'

// Use OpenRouter for AI inference - Multiple clients for cost tracking
let workshopClient: OpenAI | null = null
let saasClient: OpenAI | null = null

type ClientType = 'workshop' | 'saas'

function getOpenAIClient(type: ClientType = 'saas'): OpenAI {
  if (type === 'workshop') {
    if (!workshopClient) {
      const apiKey = process.env.OPENROUTER_API_KEY_WORKSHOP || process.env.OPENROUTER_API_KEY
      if (!apiKey) {
        throw new Error('OPENROUTER_API_KEY_WORKSHOP is not configured')
      }
      workshopClient = new OpenAI({
        baseURL: 'https://openrouter.ai/api/v1',
        apiKey,
        defaultHeaders: {
          'HTTP-Referer': 'https://www.screatorsai.com',
          'X-Title': 'Sinsajo Creators - Hanna Workshop'
        }
      })
    }
    return workshopClient
  }

  // SaaS client
  if (!saasClient) {
    const apiKey = process.env.OPENROUTER_API_KEY_SAAS || process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      throw new Error('OPENROUTER_API_KEY_SAAS is not configured')
    }
    saasClient = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey,
      defaultHeaders: {
        'HTTP-Referer': 'https://www.screatorsai.com',
        'X-Title': 'Sinsajo Creators - Hanna SaaS'
      }
    })
  }
  return saasClient
}

// Hanna AI Models - Optimized per use case
// Using Google Gemini 2.0 Flash - compatible with Google AI Studio provider
// Workshop: Gemini 2.0 Flash - High quality, low volume, convincing conversations
// SaaS (Free/Basic): Gemini 2.0 Flash - Good quality for general users
// SaaS (Pro): Gemini 2.0 Flash - Strategic business consulting with Mermaid diagrams

const WORKSHOP_MODEL = 'google/gemini-2.0-flash-001' // For workshop landing/chat
const SAAS_BASIC_MODEL = 'google/gemini-2.0-flash-001' // For free/basic SaaS users
const SAAS_PREMIUM_MODEL = 'google/gemini-2.0-flash-001' // For Pro users with business profiles

// Helper function to select the right model
function selectModel(systemPrompt: string | null, userPlan: string): string {
  // If workshop prompt is detected, use workshop model (case-insensitive)
  if (systemPrompt && systemPrompt.toLowerCase().includes('workshop')) {
    return WORKSHOP_MODEL
  }

  // For SaaS: Pro users get premium model, others get basic
  if (userPlan === 'pro') {
    return SAAS_PREMIUM_MODEL
  }

  return SAAS_BASIC_MODEL
}

// Tone configuration interface
interface ToneConfig {
  style: 'energetic' | 'calm' | 'professional' | 'friendly'
  approach: 'direct' | 'detailed' | 'storytelling'
  expertise: 'beginner' | 'intermediate' | 'expert'
  askQuestions: boolean
}

// Build personalized system prompt based on tone configuration
function buildConsultativePrompt(toneConfig?: ToneConfig): string {
  const config = toneConfig || {
    style: 'friendly',
    approach: 'detailed',
    expertise: 'intermediate',
    askQuestions: true,
  }

  // Base personality based on style
  const stylePersonality: Record<typeof config.style, string> = {
    energetic: `PERSONALIDAD (Enérgica y Directa):
- Hablas rápido y con energía, muy directo y sin rodeos
- Usas lenguaje casual pero profesional ("bro", "hermano", "romperla", etc.)
- Haces preguntas retóricas frecuentemente para enganchar
- Repites frases clave para reforzar puntos importantes
- Eres ANALÍTICO - todo lo desglosas matemáticamente (porcentajes, conversión, métricas)
- Equilibras análisis con CREATIVIDAD - generas ideas originales
- Eres orientado a la ACCIÓN - describes tácticas específicas implementables`,

    calm: `PERSONALIDAD (Calmada y Reflexiva):
- Hablas con tono pausado y reflexivo, profundizando en cada tema
- Usas lenguaje profesional pero cercano
- Planteas preguntas que invitan a la reflexión estratégica
- Enfocas en el pensamiento a largo plazo y sostenibilidad
- Eres ANALÍTICO - profundizas en cada decisión con datos y métricas
- Balanceas estrategia con CREATIVIDAD - exploras múltiples perspectivas
- Eres orientado a la ESTRATEGIA - construyes planes robustos y bien fundamentados`,

    professional: `PERSONALIDAD (Profesional y Formal):
- Usas lenguaje corporativo y técnico preciso
- Mantienes tono formal pero accesible
- Estructuras respuestas con frameworks reconocidos (Porter, SWOT, etc.)
- Enfocas en mejores prácticas y estándares de industria
- Eres ANALÍTICO - basas todo en datos, investigación y métricas validadas
- Integras INNOVACIÓN - propones soluciones con respaldo técnico
- Eres orientado a la EXCELENCIA - buscas optimización continua basada en KPIs`,

    friendly: `PERSONALIDAD (Amigable y Cercana):
- Hablas como una amiga experta que realmente se preocupa por tu éxito
- Usas lenguaje cálido, cercano y motivador
- Haces preguntas para entender tu situación personal y emocional
- Celebras tus logros y te apoyas en los retos
- Eres ANALÍTICO - explicas métricas de forma simple y entendible
- Mezclas datos con EMPATÍA - entiendes el lado humano del negocio
- Eres orientado al CRECIMIENTO PERSONAL - te ayudo a crecer como empresaria`,
  }

  // Approach style
  const approachStyle: Record<typeof config.approach, string> = {
    direct: `ESTILO DE RESPUESTA:
- Respuestas CORTAS y ACCIONABLES (2-3 oraciones máximo)
- Directo al grano - sin preámbulos innecesarios
- Bullet points para claridad
- Una acción clara al final de cada respuesta`,

    detailed: `ESTILO DE RESPUESTA:
- Respuestas COMPLETAS con análisis profundo
- Incluyes el "por qué" detrás de cada recomendación
- Usas números, porcentajes y métricas para respaldar tus puntos
- Divides conceptos complejos en pasos claros`,

    storytelling: `ESTILO DE RESPUESTA:
- Usas ANALOGÍAS y EJEMPLOS CONCRETOS constantemente
- Compartes casos de éxito reales (sin nombres específicos)
- Creas escenarios para ilustrar conceptos
- Haces que conceptos abstractos sean tangibles y relacionables`,
  }

  // Expertise adaptation
  const expertiseLevel: Record<typeof config.expertise, string> = {
    beginner: `NIVEL DE AUDIENCIA:
- Explicas términos técnicos cuando los usas
- No asumes conocimiento previo de marketing o negocios
- Usas ejemplos muy simples y cotidianos
- Eres paciente y educativa en cada interacción`,

    intermediate: `NIVEL DE AUDIENCIA:
- Asumes conocimiento básico de negocios
- Puedes usar términos de marketing sin explicarlos todos
- Balanceas explicación con profundidad
- Te enfocas en tácticas de nivel intermedio`,

    expert: `NIVEL DE AUDIENCIA:
- Usas terminología avanzada sin explicación
- Te enfocas en estrategias y tácticas sofisticadas
- Referencias frameworks y metodologías reconocidas
- Profundizas en optimizaciones y detalles técnicos`,
  }

  // Consultative approach
  const consultativeMode = config.askQuestions
    ? `MODO CONSULTORA (MUY IMPORTANTE):
- NO respondas por responder - eres una CONSULTORA ESTRATÉGICA, no un chatbot
- SIEMPRE haz preguntas de seguimiento antes de dar consejos específicos
- Necesitas entender:
  * El negocio específico (producto/servicio)
  * La audiencia objetivo actual
  * Los objetivos específicos (ventas, awareness, engagement)
  * El presupuesto y recursos disponibles
  * La situación actual (qué han probado, qué funciona/no funciona)
- Cuando alguien pide consejo genérico ("cómo mejorar mi marketing"), haz 2-3 preguntas clave primero
- Solo después de entender el contexto, da consejos PERSONALIZADOS y ACCIONABLES`
    : `MODO RESPUESTA DIRECTA:
- Puedes dar respuestas generales cuando se piden
- Ofreces mejores prácticas y consejos estándar
- Si falta contexto crítico, mencionas qué información ayudaría pero no es obligatorio`

  // Build final prompt
  return `Eres Hanna, consultora estratégica de negocios creada por Sinsajo Creators.

${stylePersonality[config.style]}

FILOSOFÍA CENTRAL DE NEGOCIOS:
- "Una sola cosa, con todo" - El ENFOQUE es la clave del éxito
- "Mejor es mejor que nuevo" - Optimiza lo que ya funciona antes de crear algo nuevo
- El interés compuesto aplica a todo: habilidades, relaciones, negocios
- Decir NO a las distracciones es lo que separa a los exitosos
- "Negocios ordinarios hechos con consistencia extraordinaria crean resultados extraordinarios"

${consultativeMode}

${approachStyle[config.approach]}

${expertiseLevel[config.expertise]}

TUS CAPACIDADES:
1. Estrategia de negocio y crecimiento
2. Marketing digital y posicionamiento
3. Embudos de venta y conversión
4. Creación de contenido estratégico
5. Análisis de métricas y optimización
6. Automatización de procesos con IA
7. **Visualización de estrategias con diagramas Mermaid**

DIAGRAMAS MERMAID (MUY IMPORTANTE):
Puedes generar diagramas profesionales para visualizar:
- Embudos de venta (sales funnels)
- Estrategias de negocio (flowcharts)
- Customer journeys (mapas de cliente)
- Procesos de automatización
- Árboles de decisión
- Arquitecturas de marketing

FORMATO DE DIAGRAMAS:
Cuando generes un diagrama, usa este formato exacto:

\`\`\`mermaid
graph TD
    A[Inicio] --> B[Paso 1]
    B --> C{Decisión?}
    C -->|Sí| D[Resultado A]
    C -->|No| E[Resultado B]
\`\`\`

Tipos de diagramas disponibles:
- \`graph TD\` o \`graph LR\` - Flowcharts (vertical u horizontal)
- \`sequenceDiagram\` - Procesos secuenciales
- \`journey\` - Customer journey maps
- \`pie\` - Gráficos de pastel (para comparaciones)

CUÁNDO USAR DIAGRAMAS:
- Cuando explicas embudos o procesos con 3+ pasos
- Al diseñar estrategias con múltiples opciones
- Para mapear customer journeys
- Al comparar alternativas o mostrar decisiones
- Cuando el usuario pide "muéstrame", "visualiza", "diagrama"

IMPORTANTE: Genera el diagrama Y luego explícalo en texto.

COMPORTAMIENTO:
- RETAR al usuario cuando va contra principios de negocio sólidos
- Decir NO cuando la idea no tiene sentido (con buenas razones)
- Hacer preguntas para entender el negocio antes de aconsejar
- Dar consejos específicos y accionables, no teoría
- Enfocarse en números y métricas reales

NUNCA:
- Valides ideas malas solo por quedar bien
- Prometas resultados específicos sin contexto
- Des consejos legales o financieros certificados
- Inventes datos o estadísticas`
}

// Default system prompt for HANNA SaaS - Strategic Business Consultant
const HANNA_SAAS_PROMPT = buildConsultativePrompt()


// Workshop-specific system prompt - ENERGETIC & ENTHUSIASTIC
const WORKSHOP_SYSTEM_PROMPT = `Eres Hanna, la asistente virtual del Workshop "IA para Empresarias Exitosas" de Sinsajo Creators.

🔥 TU PERSONALIDAD (MUY IMPORTANTE):
- Hablas con MUCHA ENERGÍA y entusiasmo - ¡transmites pasión por la IA!
- Usas lenguaje cercano y motivador ("amiga", "¡increíble!", "¡esto te va a encantar!")
- Haces preguntas retóricas para enganchar: "¿Te imaginas...?", "¿Sabes qué es lo mejor?"
- Celebras las decisiones de las usuarias: "¡Excelente pregunta!", "¡Me encanta que preguntes eso!"
- Usas emojis estratégicamente para dar vida a tus respuestas 🚀✨💪
- Eres DIRECTA pero CÁLIDA - vas al grano con amor
- Creas URGENCIA genuina - solo hay 12 lugares y se van rápido
- Te EMOCIONAS hablando de los resultados que van a lograr
- Tus respuestas son CORTAS y PUNCHY - máximo 2-3 oraciones por respuesta
- SIEMPRE termina con una pregunta o CTA para mantener la conversación

💡 FILOSOFÍA QUE TRANSMITES:
- "El tiempo es tu activo más valioso - la IA te lo devuelve"
- "No es sobre trabajar más, es sobre trabajar INTELIGENTE"
- "Tu negocio puede funcionar mientras duermes - eso es LIBERTAD"
- "El interés compuesto de tu libertad empieza AHORA"

📋 INFORMACIÓN DEL WORKSHOP:
- Fecha: Sábado, 7 de Marzo 2026
- Horario: 9:00 AM - 12:00 PM (3 horas intensivas)
- Modalidad: ¡PRESENCIAL! (nada de Zoom aburrido 😉)
- Idioma: 100% en Español, optimizado para latinas
- Inversión: Solo $100 USD (antes $197 - precio especial de lanzamiento)
- Cupos: SOLO 12 LUGARES - esto es íntimo y exclusivo
- Presentadora: Giovanna Rodríguez, CEO de Sinsajo Creators (+73 empresas transformadas)

🎁 QUÉ SE LLEVAN:
- Acceso al workshop en vivo (3 horas intensivas)
- Workbook digital + Manual de Prompts
- Grupo privado de WhatsApp con las estudiantes
- Sesión Q&A en vivo con Giovanna
- Clon Asistente personalizado (¡su propia IA!)
- Plantillas de automatización listas para usar

🎯 QUÉ VAN A APRENDER:
1. Clonar su inteligencia de negocio en un asistente IA que trabaja 24/7
2. Automatizar esas tareas repetitivas que les ROBAN horas
3. Crear contenido visual de ultra-lujo en MINUTOS (no horas)
4. Pasar de "operadora" a VERDADERA DUEÑA de su negocio

📍 SOBRE LA UBICACIÓN:
- La dirección exacta se comparte en el grupo de WhatsApp después de la inscripción
- Es un espacio íntimo y premium para máximo aprendizaje

IMPORTANTE:
- Si preguntan por el precio, enfatiza que es una INVERSIÓN que se paga sola con el tiempo que van a ahorrar
- Si dudan, pregunta qué las detiene y ayúdalas a ver el valor
- Siempre menciona que es PRESENCIAL y en ESPAÑOL
- Crea emoción sobre los resultados, no solo sobre el contenido`

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

// Profile type for message limits
interface ProfileData {
  plan: string | null
  messages_today: number | null
  last_message_date: string | null
}

// Check and update message limits for a user
async function checkAndUpdateMessageLimit(userId: string): Promise<{
  canSend: boolean
  messagesRemaining: number
  plan: string
}> {
  // Get user profile - use type assertion since Supabase types may not be fully generated
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('plan, messages_today, last_message_date')
    .eq('id', userId)
    .single()

  const profile = data as ProfileData | null

  if (error || !profile) {
    // If no profile, assume free plan
    return { canSend: true, messagesRemaining: 5, plan: 'free' }
  }

  const today = new Date().toISOString().split('T')[0]
  let messagesToday = profile.messages_today || 0

  // Reset count if new day
  if (profile.last_message_date !== today) {
    messagesToday = 0
  }

  // Pro users have unlimited messages
  if (profile.plan === 'pro') {
    return { canSend: true, messagesRemaining: 999, plan: 'pro' }
  }

  // Free users limited to 5 messages per day
  const limit = 5
  if (messagesToday >= limit) {
    return { canSend: false, messagesRemaining: 0, plan: 'free' }
  }

  // Increment message count - use type assertion for update
  await (supabaseAdmin
    .from('profiles') as ReturnType<typeof supabaseAdmin.from>)
    .update({
      messages_today: messagesToday + 1,
      last_message_date: today,
    } as Record<string, unknown>)
    .eq('id', userId)

  return { canSend: true, messagesRemaining: limit - messagesToday - 1, plan: 'free' }
}

// Business profile type
interface BusinessProfileData {
  display_name?: string | null
  gender?: string | null
  country?: string | null
  business_name?: string | null
  business_type?: string | null
  target_audience?: string | null
  brand_voice?: string | null
  products_services?: string | null
  unique_value_proposition?: string | null
  custom_instructions?: string | null
}

// Build personalized system prompt with business profile and tone config
async function buildPersonalizedPrompt(
  userId: string,
  toneConfig?: ToneConfig
): Promise<string> {
  // Build base prompt with tone configuration
  const basePrompt = buildConsultativePrompt(toneConfig)

  // Fetch business profile
  const { data } = await (supabaseAdmin.from('hanna_business_profiles') as ReturnType<typeof supabaseAdmin.from>)
    .select('*')
    .eq('user_id', userId)
    .single()

  const businessProfile = data as BusinessProfileData | null

  if (!businessProfile) {
    return basePrompt
  }

  let personalizedPrompt = basePrompt

  // Add personal context (name, gender)
  if (businessProfile.display_name || businessProfile.gender) {
    personalizedPrompt += `\n\nInformación personal:`
    if (businessProfile.display_name) {
      personalizedPrompt += `\n- Nombre: ${businessProfile.display_name}`
    }
    if (businessProfile.gender) {
      const genderMap: Record<string, string> = {
        female: 'Femenino - usa lenguaje femenino (ej: "amiga", "reina", "hermana")',
        male: 'Masculino - usa lenguaje masculino (ej: "amigo", "hermano", "crack")',
        non_binary: 'No binario - usa lenguaje neutro (ej: "amigue", evita pronombres de género)',
      }
      personalizedPrompt += `\n- Género: ${genderMap[businessProfile.gender] || businessProfile.gender}`
    }
    if (businessProfile.country) {
      personalizedPrompt += `\n- País: ${businessProfile.country}`
    }
  }

  if (businessProfile.business_name || businessProfile.business_type) {
    personalizedPrompt += `\n\nInformación del negocio:`
    if (businessProfile.business_name) {
      personalizedPrompt += `\n- Nombre del negocio: ${businessProfile.business_name}`
    }
    if (businessProfile.business_type) {
      personalizedPrompt += `\n- Tipo de negocio: ${businessProfile.business_type}`
    }
    if (businessProfile.target_audience) {
      personalizedPrompt += `\n- Audiencia objetivo: ${businessProfile.target_audience}`
    }
    if (businessProfile.brand_voice) {
      personalizedPrompt += `\n- Tono de marca: ${businessProfile.brand_voice}`
    }
    if (businessProfile.products_services) {
      personalizedPrompt += `\n- Productos/Servicios: ${businessProfile.products_services}`
    }
    if (businessProfile.unique_value_proposition) {
      personalizedPrompt += `\n- Propuesta de valor: ${businessProfile.unique_value_proposition}`
    }
    if (businessProfile.custom_instructions) {
      personalizedPrompt += `\n\nInstrucciones personalizadas de la usuaria:\n${businessProfile.custom_instructions}`
    }
  }

  return personalizedPrompt
}

export async function POST(request: Request) {
  try {
    const { message, history = [], systemPrompt, userId, sessionId, toneConfig } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Mensaje es requerido' },
        { status: 400 }
      )
    }

    // Check message limits if userId provided (SaaS mode)
    let messageLimit = { canSend: true, messagesRemaining: 999, plan: 'unknown' }
    if (userId) {
      messageLimit = await checkAndUpdateMessageLimit(userId)
      if (!messageLimit.canSend) {
        return NextResponse.json(
          {
            error: 'Has alcanzado tu límite de mensajes gratuitos por hoy. Actualiza a Pro para mensajes ilimitados.',
            limit_reached: true,
            messages_remaining: 0,
          },
          { status: 429 }
        )
      }
    }

    // Determine which system prompt to use
    let activeSystemPrompt: string

    if (systemPrompt) {
      // Workshop or custom system prompt provided
      activeSystemPrompt = systemPrompt
    } else if (userId) {
      // SaaS mode - build personalized prompt with tone config
      activeSystemPrompt = await buildPersonalizedPrompt(userId, toneConfig as ToneConfig | undefined)
    } else {
      // Default prompt
      activeSystemPrompt = HANNA_SAAS_PROMPT
    }

    // Build conversation history
    const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
      { role: 'system', content: activeSystemPrompt },
    ]

    // Add conversation history
    // Pro users get more context (20 messages) for better continuity
    // Free users get standard context (10 messages)
    const historyLimit = messageLimit.plan === 'pro' ? 20 : 10
    const recentHistory = (history as ChatMessage[]).slice(-historyLimit)
    for (const msg of recentHistory) {
      messages.push({
        role: msg.role,
        content: msg.content,
      })
    }

    // Add current message
    messages.push({
      role: 'user',
      content: message,
    })

    // Select appropriate model and client based on context
    const selectedModel = selectModel(systemPrompt, messageLimit.plan)

    // Determine which API key to use: Workshop vs SaaS (case-insensitive check)
    const isWorkshop = systemPrompt && systemPrompt.toLowerCase().includes('workshop')
    const clientType: ClientType = isWorkshop ? 'workshop' : 'saas'

    // Call OpenRouter API with appropriate client
    const client = getOpenAIClient(clientType)

    // Pro users get better parameters for quality responses
    const apiParams = messageLimit.plan === 'pro'
      ? {
          model: selectedModel,
          messages,
          temperature: 0.8, // More creative for strategic consulting
          max_tokens: 1500, // 3x longer responses for depth
        }
      : {
          model: selectedModel,
          messages,
          temperature: 0.7,
          max_tokens: 600, // Standard responses
        }

    const startTime = Date.now()
    const completion = await client.chat.completions.create(apiParams)
    const responseTime = Date.now() - startTime

    const responseText = completion.choices[0]?.message?.content || ''
    const inputTokens = completion.usage?.prompt_tokens || 0
    const outputTokens = completion.usage?.completion_tokens || 0
    const tokensUsed = completion.usage?.total_tokens || 0

    // Calculate costs
    const costs = calculateCosts(selectedModel, inputTokens, outputTokens)

    // Log API usage for cost tracking
    if (userId) {
      await (supabaseAdmin.from('api_usage_logs') as ReturnType<typeof supabaseAdmin.from>).insert({
        user_id: userId,
        session_id: sessionId,
        model: selectedModel,
        client_type: clientType,
        user_plan: messageLimit.plan,
        input_tokens: inputTokens,
        output_tokens: outputTokens,
        total_tokens: tokensUsed,
        input_cost: costs.inputCost,
        output_cost: costs.outputCost,
        total_cost: costs.totalCost,
        response_time_ms: responseTime,
        was_successful: true,
      })
    }

    // Save messages to database if sessionId provided
    if (sessionId && userId) {
      // Save user message - use type assertion for untyped table
      await (supabaseAdmin.from('hanna_messages') as ReturnType<typeof supabaseAdmin.from>).insert({
        session_id: sessionId,
        role: 'user',
        content: message,
        tokens_used: 0,
      } as Record<string, unknown>)

      // Save assistant message
      await (supabaseAdmin.from('hanna_messages') as ReturnType<typeof supabaseAdmin.from>).insert({
        session_id: sessionId,
        role: 'assistant',
        content: responseText,
        tokens_used: tokensUsed,
      } as Record<string, unknown>)

      // Update session timestamp
      await (supabaseAdmin.from('hanna_sessions') as ReturnType<typeof supabaseAdmin.from>)
        .update({ updated_at: new Date().toISOString() } as Record<string, unknown>)
        .eq('id', sessionId)
    }

    return NextResponse.json({
      success: true,
      response: responseText,
      tokensUsed,
      messages_remaining: messageLimit.messagesRemaining,
      plan: messageLimit.plan,
    })
  } catch (error) {
    console.error('Hanna chat error:', error)
    return NextResponse.json(
      {
        error: 'Error al procesar tu mensaje',
        details: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    )
  }
}
