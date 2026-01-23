import OpenAI from 'openai'
import { supabaseAdmin } from '@/lib/supabase'

// Use OpenRouter for AI inference
const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
})

const MODEL = 'anthropic/claude-3.5-sonnet'

export interface ProfileData {
  registrationId: string
  fullName: string
  email: string
  businessName?: string
  businessType?: string
  industry?: string
  yearsInBusiness?: number
  monthlyRevenue?: string
  teamSize?: string
  challenges: string[]
  primaryGoal?: string
  expectedOutcome?: string
  currentTools: string[]
  aiExperience?: string
  communicationPreference?: string
}

export interface HannaAnalysis {
  summary: string
  readinessScore: number // 1-10
  keyInsights: string[]
  challengesPrioritized: string[]
  recommendedFocus: string
  potentialQuickWins: string[]
  customizedTips: string[]
  engagementLevel: 'high' | 'medium' | 'low'
  followUpSuggestions: string[]
}

/**
 * Generate Hanna's analysis of a participant's profile
 */
export async function analyzeProfile(profile: ProfileData): Promise<HannaAnalysis> {
  const systemPrompt = `Eres Hanna, la asistente de IA experta en negocios de Sinsajo Creators.
Tu rol es analizar el perfil de participantes del workshop "IA para Empresarias Exitosas" y generar insights
valiosos para el equipo de facilitadores.

Debes responder SIEMPRE en formato JSON válido con esta estructura exacta:
{
  "summary": "Resumen ejecutivo del perfil (2-3 oraciones)",
  "readinessScore": número del 1 al 10 indicando preparación para adoptar IA,
  "keyInsights": ["insight 1", "insight 2", "insight 3"],
  "challengesPrioritized": ["desafío prioritario 1", "desafío prioritario 2"],
  "recommendedFocus": "Área principal de enfoque durante el workshop",
  "potentialQuickWins": ["quick win 1", "quick win 2"],
  "customizedTips": ["tip personalizado 1", "tip personalizado 2"],
  "engagementLevel": "high" | "medium" | "low",
  "followUpSuggestions": ["sugerencia de seguimiento 1", "sugerencia de seguimiento 2"]
}

Criterios para readinessScore:
- 1-3: Principiante total, necesita conceptos básicos
- 4-6: Ha oído de IA pero no la usa activamente
- 7-8: Usa algunas herramientas, lista para profundizar
- 9-10: Usuario avanzado, puede servir como ejemplo

Criterios para engagementLevel:
- high: Perfil muy completo, desafíos claros, metas específicas
- medium: Perfil parcial pero con información útil
- low: Información mínima, necesitará más engagement

Analiza TODO el contexto para dar recomendaciones personalizadas y accionables.`

  const userPrompt = `Analiza el siguiente perfil de participante:

DATOS BÁSICOS:
- Nombre: ${profile.fullName}
- Email: ${profile.email}

NEGOCIO:
- Nombre del negocio: ${profile.businessName || 'No especificado'}
- Tipo: ${profile.businessType || 'No especificado'}
- Industria: ${profile.industry || 'No especificada'}
- Años en el negocio: ${profile.yearsInBusiness || 'No especificado'}
- Ingresos mensuales: ${profile.monthlyRevenue || 'No especificado'}
- Tamaño del equipo: ${profile.teamSize || 'No especificado'}

DESAFÍOS Y METAS:
- Desafíos principales: ${profile.challenges.length > 0 ? profile.challenges.join(', ') : 'No especificados'}
- Meta principal: ${profile.primaryGoal || 'No especificada'}
- Resultado esperado: ${profile.expectedOutcome || 'No especificado'}

EXPERIENCIA CON TECNOLOGÍA:
- Herramientas actuales: ${profile.currentTools.length > 0 ? profile.currentTools.join(', ') : 'No especificadas'}
- Experiencia con IA: ${profile.aiExperience || 'No especificada'}

PREFERENCIAS:
- Comunicación preferida: ${profile.communicationPreference || 'No especificada'}

Genera un análisis completo en formato JSON.`

  try {
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    })

    const responseText = completion.choices[0]?.message?.content || ''

    // Parse JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response')
    }

    const analysis: HannaAnalysis = JSON.parse(jsonMatch[0])

    // Validate and sanitize the response
    return {
      summary: analysis.summary || 'Análisis pendiente',
      readinessScore: Math.min(10, Math.max(1, analysis.readinessScore || 5)),
      keyInsights: Array.isArray(analysis.keyInsights) ? analysis.keyInsights.slice(0, 5) : [],
      challengesPrioritized: Array.isArray(analysis.challengesPrioritized) ? analysis.challengesPrioritized.slice(0, 3) : [],
      recommendedFocus: analysis.recommendedFocus || 'Fundamentos de IA para negocios',
      potentialQuickWins: Array.isArray(analysis.potentialQuickWins) ? analysis.potentialQuickWins.slice(0, 3) : [],
      customizedTips: Array.isArray(analysis.customizedTips) ? analysis.customizedTips.slice(0, 3) : [],
      engagementLevel: ['high', 'medium', 'low'].includes(analysis.engagementLevel)
        ? analysis.engagementLevel
        : 'medium',
      followUpSuggestions: Array.isArray(analysis.followUpSuggestions) ? analysis.followUpSuggestions.slice(0, 3) : [],
    }
  } catch (error) {
    console.error('Hanna analysis error:', error)

    // Return a default analysis if AI fails
    return {
      summary: `Perfil de ${profile.fullName} pendiente de análisis detallado.`,
      readinessScore: 5,
      keyInsights: ['Se requiere más información para un análisis completo'],
      challengesPrioritized: profile.challenges.slice(0, 2),
      recommendedFocus: 'Fundamentos de IA para negocios',
      potentialQuickWins: ['Automatizar emails frecuentes', 'Usar IA para generación de contenido'],
      customizedTips: ['Empezar con una herramienta a la vez', 'Documentar los procesos actuales'],
      engagementLevel: 'medium',
      followUpSuggestions: ['Completar perfil para análisis más detallado'],
    }
  }
}

/**
 * Save Hanna's analysis to the database
 */
export async function saveAnalysis(
  registrationId: string,
  analysis: HannaAnalysis
): Promise<{ success: boolean; error?: string }> {
  try {
    // Using type assertion to bypass strict Supabase typing
    const analysisData = {
      registration_id: registrationId,
      analysis_type: 'profile',
      summary: analysis.summary,
      readiness_score: analysis.readinessScore,
      key_insights: analysis.keyInsights,
      challenges_prioritized: analysis.challengesPrioritized,
      recommended_focus: analysis.recommendedFocus,
      potential_quick_wins: analysis.potentialQuickWins,
      customized_tips: analysis.customizedTips,
      engagement_level: analysis.engagementLevel,
      follow_up_suggestions: analysis.followUpSuggestions,
      analyzed_at: new Date().toISOString(),
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabaseAdmin as any)
      .from('hanna_analysis')
      .upsert(analysisData, {
        onConflict: 'registration_id,analysis_type'
      })

    if (error) {
      console.error('Error saving analysis:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Save analysis error:', error)
    return { success: false, error: errorMessage }
  }
}

/**
 * Get analysis for a registration
 */
export async function getAnalysis(
  registrationId: string
): Promise<HannaAnalysis | null> {
  try {
    // Using type assertion to bypass strict Supabase typing
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: rawData, error } = await (supabaseAdmin as any)
      .from('hanna_analysis')
      .select('*')
      .eq('registration_id', registrationId)
      .eq('analysis_type', 'profile')
      .single()

    // Type assertion for result
    const data = rawData as {
      summary: string
      readiness_score: number
      key_insights: string[]
      challenges_prioritized: string[]
      recommended_focus: string
      potential_quick_wins: string[]
      customized_tips: string[]
      engagement_level: 'high' | 'medium' | 'low'
      follow_up_suggestions: string[]
    } | null

    if (error || !data) {
      return null
    }

    return {
      summary: data.summary,
      readinessScore: data.readiness_score,
      keyInsights: data.key_insights || [],
      challengesPrioritized: data.challenges_prioritized || [],
      recommendedFocus: data.recommended_focus,
      potentialQuickWins: data.potential_quick_wins || [],
      customizedTips: data.customized_tips || [],
      engagementLevel: data.engagement_level,
      followUpSuggestions: data.follow_up_suggestions || [],
    }
  } catch (error) {
    console.error('Get analysis error:', error)
    return null
  }
}

/**
 * Generate batch analysis for all profiles without analysis
 */
export async function analyzeAllPendingProfiles(): Promise<{
  analyzed: number
  failed: number
  errors: string[]
}> {
  const results = {
    analyzed: 0,
    failed: 0,
    errors: [] as string[],
  }

  try {
    // Get all registrations with completed profiles but no analysis
    // Using type assertion to bypass strict Supabase typing
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: rawRegistrations, error } = await (supabaseAdmin as any)
      .from('workshop_registrations')
      .select(`
        id,
        full_name,
        email,
        workshop_profiles (
          business_name,
          business_type,
          industry,
          years_in_business,
          monthly_revenue,
          team_size,
          challenges,
          primary_goal,
          expected_outcome,
          current_tools,
          ai_experience,
          communication_preference,
          profile_completed
        )
      `)
      .eq('workshop_profiles.profile_completed', true)

    // Type assertion for registrations
    interface RegistrationWithProfile {
      id: string
      full_name: string
      email: string
      workshop_profiles: Array<{
        business_name: string | null
        business_type: string | null
        industry: string | null
        years_in_business: number | null
        monthly_revenue: string | null
        team_size: string | null
        challenges: string[] | null
        primary_goal: string | null
        expected_outcome: string | null
        current_tools: string[] | null
        ai_experience: string | null
        communication_preference: string | null
        profile_completed: boolean
      }> | null
    }
    const registrations = rawRegistrations as RegistrationWithProfile[] | null

    if (error) {
      results.errors.push(`Database error: ${error.message}`)
      return results
    }

    for (const reg of registrations || []) {
      // Check if analysis already exists
      const existingAnalysis = await getAnalysis(reg.id)
      if (existingAnalysis) {
        continue
      }

      const profile = reg.workshop_profiles?.[0]
      if (!profile) {
        continue
      }

      try {
        const analysis = await analyzeProfile({
          registrationId: reg.id,
          fullName: reg.full_name,
          email: reg.email,
          businessName: profile.business_name ?? undefined,
          businessType: profile.business_type ?? undefined,
          industry: profile.industry ?? undefined,
          yearsInBusiness: profile.years_in_business ?? undefined,
          monthlyRevenue: profile.monthly_revenue ?? undefined,
          teamSize: profile.team_size ?? undefined,
          challenges: profile.challenges || [],
          primaryGoal: profile.primary_goal ?? undefined,
          expectedOutcome: profile.expected_outcome ?? undefined,
          currentTools: profile.current_tools || [],
          aiExperience: profile.ai_experience ?? undefined,
          communicationPreference: profile.communication_preference ?? undefined,
        })

        const saveResult = await saveAnalysis(reg.id, analysis)
        if (saveResult.success) {
          results.analyzed++
        } else {
          results.failed++
          results.errors.push(`Failed to save analysis for ${reg.email}: ${saveResult.error}`)
        }
      } catch (err) {
        results.failed++
        const errorMsg = err instanceof Error ? err.message : 'Unknown error'
        results.errors.push(`Failed to analyze ${reg.email}: ${errorMsg}`)
      }

      // Add a small delay between API calls to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    return results
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    results.errors.push(`Batch analysis error: ${errorMessage}`)
    return results
  }
}
