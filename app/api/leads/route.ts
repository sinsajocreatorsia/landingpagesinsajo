import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const leadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  company: z.string().min(2, 'Company name required'),
  phone: z.string().min(10, 'Phone number required'),
  challenge: z.string().min(10, 'Please describe your challenge'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = leadSchema.parse(body)

    // Here you would typically:
    // 1. Save to database
    // 2. Send email notification
    // 3. Add to CRM
    // 4. Trigger automation workflows

    console.log('New lead captured:', validatedData)

    // For now, just return success
    // In production, integrate with your email service or CRM

    return NextResponse.json({
      success: true,
      message: 'Lead captured successfully'
    })
  } catch (error: any) {
    console.error('Error capturing lead:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'Failed to capture lead' },
      { status: 500 }
    )
  }
}
