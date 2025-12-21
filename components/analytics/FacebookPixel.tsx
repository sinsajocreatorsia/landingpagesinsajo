'use client'

import Script from 'next/script'

const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID

export default function FacebookPixel() {
  if (!FB_PIXEL_ID) {
    return null
  }

  return (
    <>
      <Script
        id="fb-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${FB_PIXEL_ID}');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  )
}

// Helper function for tracking events
export const fbEvent = (eventName: string, options?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', eventName, options)
  }
}

// Declare fbq on window for TypeScript
declare global {
  interface Window {
    fbq: (action: string, eventName: string, options?: Record<string, unknown>) => void
  }
}

// Standard Facebook Events
export const fbEvents = {
  // Lead generation - when user shows interest
  lead: (options?: { content_name?: string; content_category?: string; value?: number; currency?: string }) => {
    fbEvent('Lead', options)
  },

  // When user initiates contact (opens chat, clicks contact)
  contact: () => {
    fbEvent('Contact')
  },

  // When user completes registration/signup
  completeRegistration: (options?: { content_name?: string; status?: string; value?: number; currency?: string }) => {
    fbEvent('CompleteRegistration', options)
  },

  // When user schedules a demo/appointment
  schedule: (options?: { content_name?: string; value?: number; currency?: string }) => {
    fbEvent('Schedule', options)
  },

  // When user views specific content
  viewContent: (options?: { content_name?: string; content_category?: string; content_ids?: string[]; value?: number; currency?: string }) => {
    fbEvent('ViewContent', options)
  },

  // Custom event for demo booking
  bookDemo: (options?: { content_name?: string; value?: number }) => {
    fbEvent('Schedule', { content_name: 'Demo Booking', ...options })
  },

  // Custom event for chat interaction
  chatStarted: () => {
    fbEvent('Contact', { content_name: 'Chat Started' })
  },

  // Custom event for chat lead
  chatLead: (industry?: string) => {
    fbEvent('Lead', { content_name: 'Chat Lead', content_category: industry })
  }
}
