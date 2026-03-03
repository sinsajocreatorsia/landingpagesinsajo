/**
 * Centralized analytics event wrapper for Hanna.
 * Fires both GA and FB Pixel events in one call.
 */

// Dynamic imports to avoid SSR issues
function getGaEvent(): ((action: string, params?: Record<string, unknown>) => void) | null {
  if (typeof window === 'undefined') return null
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { gaEvent } = require('@/components/analytics/GoogleAnalytics')
    return gaEvent
  } catch {
    return null
  }
}

function getFbEvent(): ((eventName: string, options?: Record<string, unknown>) => void) | null {
  if (typeof window === 'undefined') return null
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { fbEvent } = require('@/components/analytics/FacebookPixel')
    return fbEvent
  } catch {
    return null
  }
}

function trackEvent(eventName: string, data?: Record<string, unknown>) {
  const gaEvent = getGaEvent()
  const fbEvent = getFbEvent()

  if (gaEvent) gaEvent(eventName, data)
  if (fbEvent) fbEvent(eventName, data)
}

export const hannaEvents = {
  chatStarted: () => trackEvent('chat_started'),
  firstMessageSent: () => trackEvent('first_message_sent'),
  templateUsed: (templateId: string, category: string) =>
    trackEvent('template_used', { template_id: templateId, category }),
  upgradeClicked: (source: string) =>
    trackEvent('upgrade_clicked', { source }),
  profileCompleted: () => trackEvent('profile_completed'),
  architectureSectionCompleted: (section: string) =>
    trackEvent('architecture_section_completed', { section }),
  onboardingCompleted: () => trackEvent('onboarding_completed'),
  onboardingSkipped: (atStep: number) =>
    trackEvent('onboarding_skipped', { step: atStep }),
  sessionCompleted: (messageCount: number) =>
    trackEvent('session_completed', { message_count: messageCount }),
  signupCompleted: (plan: string) =>
    trackEvent('signup_completed', { plan }),
}
