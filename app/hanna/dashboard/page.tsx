import { redirect } from 'next/navigation'
import { getUserWithProfile } from '@/lib/hanna/auth'
import HannaDashboardClient from './HannaDashboardClient'

export default async function HannaDashboardPage() {
  const { user, profile } = await getUserWithProfile()

  if (!user) {
    redirect('/hanna/login')
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
