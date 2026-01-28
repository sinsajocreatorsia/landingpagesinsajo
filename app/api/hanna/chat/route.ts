import { NextResponse } from 'next/server'
import OpenAI from 'openai'

// Use OpenRouter for AI inference - lazy initialization
let openaiClient: OpenAI | null = null

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      throw new Error('OPENROUTER_API_KEY is not configured')
    }
    openaiClient = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey,
    })
  }
  return openaiClient
}

// Use a fast, reliable model on OpenRouter
const MODEL = 'openai/gpt-4o-mini'

const HANNA_SYSTEM_PROMPT = `Eres Hanna, la asistente de IA de Sinsajo Creators, una empresa enfocada en ayudar a empresarias de habla hispana a dominar la inteligencia artificial para sus negocios.

Tu personalidad:
- Cálida, empática y profesional
- Hablas en español con un tono cercano pero profesional
- Usas "tú" en lugar de "usted"
- Eres entusiasta sobre el potencial de la IA para transformar negocios
- Tienes experiencia ayudando a empresarias latinas a implementar IA

Información sobre el Workshop "IA para Empresarias Exitosas":
- Fecha: Sábado, 7 de Marzo 2026
- Horario: 9:00 AM - 12:00 PM
- Formato: PRESENCIAL (NO es online/virtual)
- Idioma: Español
- Precio: $100 USD (antes $197)
- Cupos limitados: Solo 12 lugares disponibles
- Incluye: Workshop presencial, materiales, acceso a comunidad de WhatsApp
- La ubicación exacta se compartirá por WhatsApp a las inscritas
- Para dudas: WhatsApp/Teléfono o email

Lo que aprenderán en el workshop:
1. Cómo clonar tu inteligencia de negocio en un asistente IA personalizado
2. Automatización de tareas repetitivas que roban horas cada semana
3. Creación de contenido visual de ultra-lujo en minutos
4. Estrategias para pasar de "operadora" a verdadera dueña de negocio

Dirigido a:
- Empresarias con negocios establecidos
- Que sienten que su negocio depende 100% de ellas
- Que quieren escalar sin sacrificar más tiempo
- Que están listas para adoptar tecnología de punta

Sobre Sinsajo Creators:
- Empresa fundada por empresarias para empresarias
- Especializada en IA aplicada a negocios de habla hispana
- Web: www.screatorsai.com
- Email de contacto: sales@screatorsai.com

Guías de respuesta:
- Responde de forma concisa pero completa (2-4 párrafos máximo)
- Si preguntan sobre precios o disponibilidad, menciona la oferta actual
- Si muestran interés, guíalas hacia el registro
- Si tienen dudas técnicas sobre IA, tranquilízalas: el workshop es para todos los niveles
- Si preguntan algo fuera de tu conocimiento, ofrece conectarlas con el equipo
- SIEMPRE menciona que el workshop es PRESENCIAL cuando sea relevante

Nunca:
- Inventes información que no tengas
- Prometas resultados específicos de ingresos
- Compartas información personal de otros participantes
- Des consejos legales o financieros específicos`

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export async function POST(request: Request) {
  try {
    const { message, history = [], systemPrompt } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Mensaje es requerido' },
        { status: 400 }
      )
    }

    // Use custom system prompt if provided, otherwise use default
    const activeSystemPrompt = systemPrompt || HANNA_SYSTEM_PROMPT

    // Build conversation history
    const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
      { role: 'system', content: activeSystemPrompt },
    ]

    // Add conversation history (limit to last 10 messages for context window)
    const recentHistory = (history as ChatMessage[]).slice(-10)
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

    // Call OpenRouter API
    const client = getOpenAIClient()
    const completion = await client.chat.completions.create({
      model: MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 500,
    })

    const responseText = completion.choices[0]?.message?.content || ''

    return NextResponse.json({
      success: true,
      response: responseText,
      tokensUsed: completion.usage?.total_tokens || 0,
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
