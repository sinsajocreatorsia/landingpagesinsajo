import { redirect } from 'next/navigation'
import { getUserWithProfile, createServerSupabaseClient } from '@/lib/hanna/auth'
import HannaDashboardClient from './HannaDashboardClient'

export default async function HannaDashboardPage() {
  let { user, profile } = await getUserWithProfile()

  if (!user) {
    redirect('/hanna/login')
  }

  // Safety net: create profile if it doesn't exist (e.g., callback failed)
  if (!profile) {
    const supabase = await createServerSupabaseClient()
    await supabase.from('profiles').insert({
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || user.user_metadata?.name,
      avatar_url: user.user_metadata?.avatar_url,
      plan: 'free',
      subscription_status: 'active',
      messages_today: 0,
    })

    // Re-fetch profile
    const fresh = await getUserWithProfile()
    profile = fresh.profile
  }

  return (
    <HannaDashboardClient
      user={{
        id: user.id,
        email: user.email || '',
        fullName: profile?.full_name || user.user_metadata?.full_name || 'Usuario',
        avatarUrl: profile?.avatar_url || user.user_metadata?.avatar_url,
      }}
      profile={{
        plan: profile?.plan || 'free',
        subscriptionStatus: profile?.subscription_status || 'active',
        messagesRemaining: profile?.plan === 'pro' ? 999 : Math.max(0, 5 - (profile?.messages_today || 0)),
      }}
    />
  )
}
