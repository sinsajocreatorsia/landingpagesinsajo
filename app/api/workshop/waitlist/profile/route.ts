import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const {
      waitlistId,
      businessName,
      businessType,
      industry,
      industryOther,
      yearsInBusiness,
      teamSize,
      challenges,
      challengeOther,
      primaryGoal,
      expectedOutcome,
      currentTools,
      aiExperience,
      communicationPreference,
      bestContactTime,
    } = await request.json()

    if (!waitlistId) {
      return NextResponse.json(
        { error: 'waitlistId es requerido' },
        { status: 400 },
      )
    }

    const finalIndustry = industry === 'Otro' && industryOther
      ? `Otro: ${industryOther}`
      : industry

    let finalChallenges = challenges || []
    if (challenges?.includes('other') && challengeOther) {
      finalChallenges = challenges.map((c: string) =>
        c === 'other' ? `Otro: ${challengeOther}` : c
      )
    }

    const profileData = {
      businessName,
      businessType: businessType || null,
      industry: finalIndustry,
      yearsInBusiness: yearsInBusiness || null,
      teamSize: teamSize || null,
      challenges: finalChallenges,
      primaryGoal: primaryGoal || null,
      expectedOutcome: expectedOutcome || null,
      currentTools: currentTools || [],
      aiExperience: aiExperience || null,
      communicationPreference: communicationPreference || null,
      bestContactTime: bestContactTime || null,
      completedAt: new Date().toISOString(),
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabaseAdmin as any)
      .from('workshop_waitlist')
      .update({
        profile_data: profileData,
        profile_completed: true,
      })
      .eq('id', waitlistId)

    if (error) {
      console.error('Waitlist profile update error:', error)
      return NextResponse.json(
        { error: 'Error al guardar el perfil' },
        { status: 500 },
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Waitlist profile API error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 },
    )
  }
}
