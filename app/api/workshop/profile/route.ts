import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const {
      registrationId,
      businessName,
      businessType,
      industry,
      yearsInBusiness,
      monthlyRevenue,
      teamSize,
      challenges,
      primaryGoal,
      expectedOutcome,
      currentTools,
      aiExperience,
      communicationPreference,
      bestContactTime,
    } = await request.json()

    // Calculate profile completion percentage
    const fields = [
      businessName,
      industry,
      yearsInBusiness,
      teamSize,
      challenges?.length > 0,
      primaryGoal,
      aiExperience,
      communicationPreference,
    ]
    const completedFields = fields.filter(Boolean).length
    const completionPercentage = Math.round((completedFields / fields.length) * 100)

    // Update profile in database (using type assertion to bypass strict typing)
    const profileData = {
      business_name: businessName,
      business_type: businessType || null,
      industry: industry,
      years_in_business: yearsInBusiness ? parseInt(yearsInBusiness) : null,
      monthly_revenue: monthlyRevenue || null,
      team_size: teamSize || null,
      challenges: challenges || [],
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

        return NextResponse.json({
          success: true,
          profile: newProfile,
        })
      }

      return NextResponse.json(
        { error: 'Error al actualizar el perfil' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      profile: data,
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
