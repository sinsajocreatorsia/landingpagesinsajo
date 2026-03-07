import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendEmail } from '@/lib/emails'
import {
  surveyLimiter,
  getClientIdentifier,
  rateLimitHeaders,
} from '@/lib/security/rate-limit'

// Universal coupon for workshop participants (exists in Stripe as 100% off)
const WORKSHOP_COUPON_CODE = 'CHICASPRO2026'

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(request: Request) {
  // Rate limit
  const ip = getClientIdentifier(request)
  const rl = surveyLimiter.check(`survey:${ip}`)
  if (!rl.success) {
    return NextResponse.json(
      { success: false, error: 'Demasiados intentos. Espera un momento.' },
      { status: 429, headers: rateLimitHeaders(rl) }
    )
  }

  try {
    const body = await request.json()

    const {
      overallRating,
      likedMost,
      improvements,
      suggestions,
      learnedSkills,
      knowledgeBefore,
      knowledgeAfter,
      firstImplementation,
      implementationBarriers,
      expectationsMet,
      durationFeedback,
      scheduleFeedback,
      preferredFormat,
      futureTopics,
      futureTopicsOther,
      continuingInterest,
      willingnessToPay,
      npsScore,
      communityInterest,
      communityValues,
      preferredPlatform,
      email,
      fullName,
      googleRating,
    } = body

    // Validate required fields
    if (!email || !validateEmail(email)) {
      return NextResponse.json(
        { success: false, error: 'Email valido es requerido' },
        { status: 400 }
      )
    }
    if (!fullName || fullName.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Nombre es requerido' },
        { status: 400 }
      )
    }
    if (!overallRating || overallRating < 1 || overallRating > 5) {
      return NextResponse.json(
        { success: false, error: 'Calificacion general es requerida (1-5)' },
        { status: 400 }
      )
    }
    if (!knowledgeBefore || knowledgeBefore < 1 || knowledgeBefore > 5) {
      return NextResponse.json(
        { success: false, error: 'Nivel de conocimiento antes es requerido (1-5)' },
        { status: 400 }
      )
    }
    if (!knowledgeAfter || knowledgeAfter < 1 || knowledgeAfter > 5) {
      return NextResponse.json(
        { success: false, error: 'Nivel de conocimiento despues es requerido (1-5)' },
        { status: 400 }
      )
    }
    if (!expectationsMet || expectationsMet < 1 || expectationsMet > 5) {
      return NextResponse.json(
        { success: false, error: 'Expectativas es requerido (1-5)' },
        { status: 400 }
      )
    }
    if (!durationFeedback || !['too_short', 'just_right', 'too_long'].includes(durationFeedback)) {
      return NextResponse.json(
        { success: false, error: 'Feedback de duracion es requerido' },
        { status: 400 }
      )
    }
    if (continuingInterest === undefined || continuingInterest < 1 || continuingInterest > 5) {
      return NextResponse.json(
        { success: false, error: 'Interes en continuar es requerido (1-5)' },
        { status: 400 }
      )
    }
    if (npsScore === undefined || npsScore < 0 || npsScore > 10) {
      return NextResponse.json(
        { success: false, error: 'Puntuacion NPS es requerida (0-10)' },
        { status: 400 }
      )
    }
    if (!communityInterest || !['yes', 'no', 'maybe'].includes(communityInterest)) {
      return NextResponse.json(
        { success: false, error: 'Interes en comunidad es requerido' },
        { status: 400 }
      )
    }
    if (!googleRating || googleRating < 1 || googleRating > 5) {
      return NextResponse.json(
        { success: false, error: 'Calificacion de Google es requerida (1-5)' },
        { status: 400 }
      )
    }

    // Check for duplicate email
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: existing } = await (supabaseAdmin as any)
      .from('workshop_surveys')
      .select('id')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle()

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Ya completaste la encuesta anteriormente.' },
        { status: 409 }
      )
    }

    // Insert survey response
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: surveyError } = await (supabaseAdmin as any)
      .from('workshop_surveys')
      .insert({
        email: email.toLowerCase().trim(),
        full_name: fullName.trim(),
        overall_rating: overallRating,
        liked_most: likedMost || [],
        improvements: improvements || [],
        suggestions: suggestions || null,
        learned_skills: learnedSkills || [],
        knowledge_before: knowledgeBefore,
        knowledge_after: knowledgeAfter,
        first_implementation: firstImplementation || null,
        implementation_barriers: implementationBarriers || [],
        expectations_met: expectationsMet,
        duration_feedback: durationFeedback,
        schedule_feedback: scheduleFeedback || null,
        preferred_format: preferredFormat || null,
        future_topics: futureTopics || [],
        future_topics_other: futureTopicsOther || null,
        continuing_interest: continuingInterest,
        willingness_to_pay: willingnessToPay || null,
        nps_score: npsScore,
        community_interest: communityInterest,
        community_values: communityValues || [],
        preferred_platform: preferredPlatform || null,
        google_rating: googleRating,
        google_review_clicked: false,
        coupon_code: WORKSHOP_COUPON_CODE,
      })

    if (surveyError) {
      console.error('Error saving survey:', surveyError)
      return NextResponse.json(
        { success: false, error: 'Error al guardar la encuesta' },
        { status: 500 }
      )
    }

    // Send email with coupon (non-blocking)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.screatorsai.com'

    sendEmail({
      to: email.toLowerCase().trim(),
      type: 'survey_coupon',
      data: {
        customerName: fullName.trim(),
        couponCode: WORKSHOP_COUPON_CODE,
        signupUrl: `${baseUrl}/hanna/signup`,
        expirationDate: '',
      },
    }).catch((err) => {
      console.error('Error sending survey coupon email:', err)
    })

    // Determine Google redirect
    const shouldRedirectToGoogle = googleRating === 5
    const googleReviewUrl = shouldRedirectToGoogle
      ? process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL || null
      : null

    return NextResponse.json({
      success: true,
      couponCode: WORKSHOP_COUPON_CODE,
      message: 'Encuesta enviada exitosamente',
      shouldRedirectToGoogle,
      googleReviewUrl,
    })
  } catch (error) {
    console.error('Survey submission error:', error)
    return NextResponse.json(
      { success: false, error: 'Error al procesar la encuesta' },
      { status: 500 }
    )
  }
}
