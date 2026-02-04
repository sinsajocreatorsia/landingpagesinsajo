import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendAdminProfileNotification } from '@/lib/emails'
import { analyzeProfile, saveAnalysis, ProfileData } from '@/lib/hanna/analysis'

export async function POST(request: Request) {
  try {
    const {
      registrationId,
      businessName,
      businessType,
      industry,
      industryOther,
      yearsInBusiness,
      monthlyRevenue,
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

    // If "Otro" is selected, use the custom industry text
    const finalIndustry = industry === 'Otro' && industryOther
      ? `Otro: ${industryOther}`
      : industry

    // Process challenges: if "other" is selected, replace with custom text
    let finalChallenges = challenges || []
    if (challenges?.includes('other') && challengeOther) {
      finalChallenges = challenges.map((c: string) =>
        c === 'other' ? `Otro: ${challengeOther}` : c
      )
    }

    // Calculate profile completion percentage
    const fields = [
      businessName,
      finalIndustry,
      yearsInBusiness,
      teamSize,
      finalChallenges?.length > 0,
      primaryGoal,
      aiExperience,
      communicationPreference,
    ]
    const completedFields = fields.filter(Boolean).length
    const completionPercentage = Math.round((completedFields / fields.length) * 100)

    // Update profile in database
    const profileData = {
      business_name: businessName,
      business_type: businessType || null,
      industry: finalIndustry,
      years_in_business: yearsInBusiness ? parseInt(yearsInBusiness) : null,
      monthly_revenue: monthlyRevenue || null,
      team_size: teamSize || null,
      challenges: finalChallenges,
      primary_goal: primaryGoal || null,
      expected_outcome: expectedOutcome || null,
      current_tools: currentTools || [],
      ai_experience: aiExperience || null,
      communication_preference: communicationPreference || null,
      best_contact_time: bestContactTime || null,
      profile_completed: completionPercentage >= 80,
      profile_completion_percentage: completionPercentage,
      completed_at: new Date().toISOString(),
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabaseAdmin as any)
      .from('workshop_profiles')
      .update(profileData)
      .eq('registration_id', registrationId)
      .select()
      .single()

    let savedProfile = data

    if (error) {
      console.error('Profile update error:', error)

      // If no profile exists, try to create one
      if (error.code === 'PGRST116') {
        const newProfileData = {
          registration_id: registrationId,
          ...profileData,
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: newProfile, error: createError } = await (supabaseAdmin as any)
          .from('workshop_profiles')
          .insert(newProfileData)
          .select()
          .single()

        if (createError) {
          return NextResponse.json(
            { error: 'Error al guardar el perfil' },
            { status: 500 }
          )
        }

        savedProfile = newProfile
      } else {
        return NextResponse.json(
          { error: 'Error al actualizar el perfil' },
          { status: 500 }
        )
      }
    }

    // Update registration to mark profile as completed
    if (savedProfile?.profile_completed) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabaseAdmin as any)
        .from('workshop_registrations')
        .update({ profile_completed: true })
        .eq('id', registrationId)
    }

    // Get registration info for analysis and admin notification
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: registration } = await (supabaseAdmin as any)
      .from('workshop_registrations')
      .select('email, full_name')
      .eq('id', registrationId)
      .single()

    // Run Hanna analysis and send admin notification
    if (registration) {
      try {
        // Prepare profile data for Hanna analysis
        const profileForAnalysis: ProfileData = {
          registrationId,
          fullName: registration.full_name || 'Participante',
          email: registration.email || '',
          businessName: businessName || undefined,
          businessType: businessType || undefined,
          industry: finalIndustry || undefined,
          yearsInBusiness: yearsInBusiness ? parseInt(yearsInBusiness) : undefined,
          monthlyRevenue: monthlyRevenue || undefined,
          teamSize: teamSize || undefined,
          challenges: finalChallenges,
          primaryGoal: primaryGoal || undefined,
          expectedOutcome: expectedOutcome || undefined,
          currentTools: currentTools || [],
          aiExperience: aiExperience || undefined,
          communicationPreference: communicationPreference || undefined,
        }

        // Run Hanna analysis
        console.log('Running Hanna analysis for:', registration.email)
        const hannaAnalysis = await analyzeProfile(profileForAnalysis)

        // Save analysis to database
        const saveResult = await saveAnalysis(registrationId, hannaAnalysis)
        if (saveResult.success) {
          console.log('Hanna analysis saved for:', registration.email)
        } else {
          console.error('Failed to save Hanna analysis:', saveResult.error)
        }

        // Send admin notification with profile + Hanna analysis
        const emailResult = await sendAdminProfileNotification({
          customerName: registration.full_name || 'Participante',
          customerEmail: registration.email || '',
          businessName: businessName || '',
          industry: finalIndustry || '',
          yearsInBusiness: yearsInBusiness || '',
          teamSize: teamSize || '',
          challenges: finalChallenges,
          primaryGoal: primaryGoal || '',
          currentTools: currentTools || [],
          aiExperience: aiExperience || '',
          communicationPreference: communicationPreference || '',
          expectedOutcome: expectedOutcome || '',
          hannaAnalysis,
          registrationId,
        })

        if (emailResult.success) {
          console.log('Admin notification sent for:', registration.email)
        } else {
          console.error('Failed to send admin notification:', emailResult.error)
        }
      } catch (analysisError) {
        console.error('Error in Hanna analysis or admin notification:', analysisError)
        // Don't fail the request if analysis/notification fails
      }
    }

    return NextResponse.json({
      success: true,
      profile: savedProfile,
    })
  } catch (error) {
    console.error('Profile API error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// GET endpoint to retrieve profile
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const registrationId = searchParams.get('registrationId')

    if (!registrationId) {
      return NextResponse.json(
        { error: 'Registration ID es requerido' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('workshop_profiles')
      .select('*')
      .eq('registration_id', registrationId)
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Perfil no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Profile GET error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
