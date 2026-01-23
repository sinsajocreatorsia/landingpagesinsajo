import { NextResponse } from 'next/server'
import { analyzeAllPendingProfiles } from '@/lib/hanna/analysis'

// Admin API key check
function isAuthorized(request: Request): boolean {
  const authHeader = request.headers.get('authorization')
  const expectedKey = `Bearer ${process.env.ADMIN_API_KEY}`

  if (process.env.NODE_ENV !== 'production') {
    return true // Allow in development
  }

  return authHeader === expectedKey
}

/**
 * POST /api/admin/hanna/analyze-batch
 * Analyze all participants who have completed profiles but no analysis yet
 */
export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

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
