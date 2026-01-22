import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { supabase } from '@/lib/supabase'
import { checkRateLimit, getClientIp, rateLimits } from '@/lib/utils/rateLimit'

// Allowed origins for CORS validation
const ALLOWED_ORIGINS = [
  'https://www.screatorsai.com',
  'https://screatorsai.com',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002'
]

// Enhanced validation schema with security constraints
const leadSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name too long')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\-'.]+$/, 'Invalid characters in name'),
  email: z.string()
    .email('Invalid email address')
    .max(255, 'Email too long'),
  company: z.string()
    .min(2, 'Company name required')
    .max(200, 'Company name too long'),
  phone: z.string()
    .min(10, 'Phone number required')
    .max(20, 'Phone number too long')
    .regex(/^[\d\s\-\(\)\+]+$/, 'Invalid phone format'),
  challenge: z.string()
    .min(10, 'Please describe your challenge')
    .max(5000, 'Challenge description too long'),
})

export async function POST(request: NextRequest) {
  try {
    // CORS validation - only allow requests from known origins
    const origin = request.headers.get('origin')
    if (origin && !ALLOWED_ORIGINS.includes(origin)) {
      return NextResponse.json(
        { error: 'CORS policy violation' },
        { status: 403 }
      )
    }

    // Rate limiting - 5 submissions per minute per IP
    const clientIp = getClientIp(request)
    const rateLimit = checkRateLimit(clientIp, rateLimits.leads)

    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Too many submissions. Please wait a moment.' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimit.resetAt.toString()
          }
        }
      )
    }

    const body = await request.json()
    const validatedData = leadSchema.parse(body)

    // Send email via Web3Forms
    const emailContent = `
NUEVO LEAD - Sinsajo Creators

Nombre: ${validatedData.name}
Email: ${validatedData.email}
Empresa: ${validatedData.company}
Teléfono: ${validatedData.phone}
Desafío: ${validatedData.challenge}

Fecha: ${new Date().toLocaleString()}
    `

    // Send email (Web3Forms)
    if (process.env.WEB3FORMS_KEY) {
      try {
        await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_key: process.env.WEB3FORMS_KEY,
            subject: '🚀 Nuevo Lead - Sinsajo Creators',
            from_name: 'Landing Page Sinsajo',
            email: 'sales@sinsajocreators.com',
            message: emailContent,
            replyto: validatedData.email,
          })
        })
      } catch (emailError) {
        console.error('Web3Forms error (non-blocking):', emailError)
        // Continue even if email fails - Supabase is primary storage
      }
    }

    // Save lead to Supabase
    const { data, error } = await supabase
      .from('leads')
      .insert([
        {
          name: validatedData.name,
          email: validatedData.email,
          company: validatedData.company,
          phone: validatedData.phone,
          challenge: validatedData.challenge,
          created_at: new Date().toISOString(),
        }
      ])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      throw new Error('Failed to save lead to database')
    }

    // Log only non-sensitive info
    console.log('Lead captured successfully, id:', data?.[0]?.id)

    return NextResponse.json({
      success: true,
      message: 'Lead captured successfully',
      data: data
    })
  } catch (error: any) {
    console.error('Error capturing lead:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'Failed to capture lead' },
      { status: 500 }
    )
  }
}
