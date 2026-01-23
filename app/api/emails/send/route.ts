import { NextResponse } from 'next/server'
import { sendEmail, EmailType } from '@/lib/emails'

export async function POST(request: Request) {
  try {
    // Check for API key or admin auth
    const authHeader = request.headers.get('authorization')
    const expectedKey = `Bearer ${process.env.INTERNAL_API_KEY}`

    if (authHeader !== expectedKey && process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { to, type, data, registrationId } = await request.json()

    // Validate required fields
    if (!to || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: to, type' },
        { status: 400 }
      )
    }

    // Validate email type
    const validTypes: EmailType[] = [
      'confirmation',
      'reminder_24h',
      'reminder_1h',
      'access_link',
      'recording',
      'follow_up',
    ]

    if (!validTypes.includes(type as EmailType)) {
      return NextResponse.json(
        { error: `Invalid email type. Valid types: ${validTypes.join(', ')}` },
        { status: 400 }
      )
    }

    // Send email
    const result = await sendEmail({
      to,
      type: type as EmailType,
      data: data || {},
      registrationId,
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      messageId: result.messageId,
    })
  } catch (error) {
    console.error('Email API error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
