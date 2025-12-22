'use client'

import Script from 'next/script'

// Google Analytics Measurement ID (G-G9B8YDFLCP)
const GA_ID = process.env.NEXT_PUBLIC_GA_ID

export default function GoogleAnalytics() {
  if (!GA_ID) {
    return null
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `,
        }}
      />
    </>
  )
}

// Declare gtag on window for TypeScript
declare global {
  interface Window {
    gtag: (command: string, ...args: unknown[]) => void
    dataLayer: unknown[]
  }
}

// Helper function for tracking events
export const gaEvent = (action: string, params?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', action, params)
  }
}

// Common Google Analytics Events
export const gaEvents = {
  // Page view (automatic, but can be called manually for SPAs)
  pageView: (pagePath?: string, pageTitle?: string) => {
    gaEvent('page_view', { page_path: pagePath, page_title: pageTitle })
  },

  // When user starts a chat
  chatStarted: () => {
    gaEvent('chat_started', { event_category: 'engagement' })
  },

  // When user sends first message (lead)
  chatLead: (industry?: string) => {
    gaEvent('generate_lead', {
      event_category: 'engagement',
      event_label: industry || 'Chat Lead'
    })
  },

  // When user clicks contact button
  contact: (method?: string) => {
    gaEvent('contact', {
      event_category: 'engagement',
      method: method || 'chat'
    })
  },

  // When user schedules a demo
  scheduleDemo: () => {
    gaEvent('schedule_demo', { event_category: 'conversion' })
  },

  // When user clicks CTA button
  ctaClick: (buttonName: string) => {
    gaEvent('cta_click', {
      event_category: 'engagement',
      event_label: buttonName
    })
  },

  // Scroll depth tracking
  scrollDepth: (percentage: number) => {
    gaEvent('scroll', {
      event_category: 'engagement',
      percent_scrolled: percentage
    })
  }
}
