import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { supabase } from '@/lib/supabase'

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

    console.log('New lead captured:', data)

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
