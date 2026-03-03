import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/hanna/auth'
import { getArchitecture, getCompletionStatus, saveSection } from '@/lib/hanna/marketing-architecture'
import type { ArchitectureSection } from '@/types/marketing-architecture'

const VALID_SECTIONS: ArchitectureSection[] = ['avatar', 'offer', 'communication', 'content_strategy', 'branding', 'funnel']

/**
 * GET /api/hanna/architecture
 * Returns the full marketing architecture for the authenticated user.
 */
export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const architecture = await getArchitecture(user.id)
    const completionStatus = await getCompletionStatus(user.id)

    return NextResponse.json({
      success: true,
      architecture: architecture || {
        avatar: {}, offer: {}, communication: {},
        content_strategy: {}, branding: {}, funnel: {},
        completion_percentage: 0,
      },
      completionStatus,
    })
  } catch (error) {
    console.error('Architecture GET error:', error)
    return NextResponse.json({ error: 'Error al cargar arquitectura' }, { status: 500 })
  }
}

/**
 * PUT /api/hanna/architecture
 * Updates a specific section of the marketing architecture.
 * Body: { section: ArchitectureSection, data: object }
 */
export async function PUT(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { section, data } = body

    if (!section || !VALID_SECTIONS.includes(section)) {
      return NextResponse.json(
        { error: `Seccion invalida. Opciones: ${VALID_SECTIONS.join(', ')}` },
        { status: 400 }
      )
    }

    if (!data || typeof data !== 'object') {
      return NextResponse.json({ error: 'Datos de seccion requeridos' }, { status: 400 })
    }

    const result = await saveSection(user.id, section as ArchitectureSection, data)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    const completionStatus = await getCompletionStatus(user.id)

    return NextResponse.json({
      success: true,
      completionStatus,
    })
  } catch (error) {
    console.error('Architecture PUT error:', error)
    return NextResponse.json({ error: 'Error al guardar seccion' }, { status: 500 })
  }
}
