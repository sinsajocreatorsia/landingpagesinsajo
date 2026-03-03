import { NextResponse } from 'next/server'
import { analyzeAllPendingProfiles } from '@/lib/hanna/analysis'
import { requireAdmin } from '@/lib/auth-guard'

/**
 * POST /api/admin/hanna/analyze-batch
 * Analyze all participants who have completed profiles but no analysis yet (requires admin auth)
 */
export async function POST() {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  try {
    console.log('Starting batch analysis...')

    const results = await analyzeAllPendingProfiles()

    console.log(`Batch analysis complete: ${results.analyzed} analyzed, ${results.failed} failed`)

    return NextResponse.json({
      success: true,
      results: {
        analyzed: results.analyzed,
        failed: results.failed,
        errors: results.errors.length > 0 ? results.errors.slice(0, 10) : [], // Limit errors in response
      },
    })
  } catch (error) {
    console.error('Batch analysis API error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
