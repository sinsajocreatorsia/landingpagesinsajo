import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { sendEmail, EmailType } from '@/lib/emails'
import { emailLimiter, getClientIdentifier, rateLimitHeaders } from '@/lib/security/rate-limit'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIp = getClientIdentifier(request)
    const rateCheck = emailLimiter.check(clientIp)
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: rateLimitHeaders(rateCheck) }
      )
    }

    // Auth required in ALL environments - timing-safe comparison
    const authHeader = request.headers.get('authorization') || ''
    const expectedKey = `Bearer ${process.env.INTERNAL_API_KEY || ''}`

    if (!process.env.INTERNAL_API_KEY) {
      console.error('INTERNAL_API_KEY is not configured')
      return NextResponse.json(
        { error: 'Service configuration error' },
        { status: 500 }
      )
    }

    const authBuffer = Buffer.from(authHeader)
    const expectedBuffer = Buffer.from(expectedKey)

    if (authBuffer.length !== expectedBuffer.length ||
        !crypto.timingSafeEqual(authBuffer, expectedBuffer)) {
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

    // Basic email format validation
    if (typeof to !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
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
