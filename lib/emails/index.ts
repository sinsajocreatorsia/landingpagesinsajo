import { Resend } from 'resend'
import { render } from '@react-email/components'
import WorkshopConfirmation from './templates/WorkshopConfirmation'
import WorkshopReminder from './templates/WorkshopReminder'
import WorkshopAccessLink from './templates/WorkshopAccessLink'
import WorkshopRecording from './templates/WorkshopRecording'
import WorkshopFollowUp from './templates/WorkshopFollowUp'
import { supabaseAdmin } from '@/lib/supabase'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = process.env.FROM_EMAIL || 'Sinsajo Creators <noreply@sinsajocreators.com>'

export type EmailType =
  | 'confirmation'
  | 'reminder_24h'
  | 'reminder_1h'
  | 'access_link'
  | 'recording'
  | 'follow_up'

interface SendEmailParams {
  to: string
  type: EmailType
  data: Record<string, string>
  registrationId?: string
}

interface EmailResult {
  success: boolean
  messageId?: string
  error?: string
}

// Email templates configuration
const emailConfig: Record<EmailType, { subject: string; templateFn: (data: Record<string, string>) => React.ReactElement }> = {
  confirmation: {
    subject: '¡Tu lugar está confirmado! - IA para Empresarias Exitosas',
    templateFn: (data) => WorkshopConfirmation({
      customerName: data.customerName || 'Empresaria',
      workshopDate: data.workshopDate || 'Sábado, 7 de Marzo 2026',
      workshopTime: data.workshopTime || '9:00 AM - 12:00 PM (EST)',
      amount: data.amount || '$100',
      paymentMethod: data.paymentMethod || 'tarjeta',
      zoomLink: data.zoomLink,
    }),
  },
  reminder_24h: {
    subject: '📅 ¡Mañana es el día! - Recordatorio del Workshop',
    templateFn: (data) => WorkshopReminder({
      customerName: data.customerName || 'Empresaria',
      hoursUntil: '24',
      workshopDate: data.workshopDate || 'Sábado, 7 de Marzo 2026',
      workshopTime: data.workshopTime || '9:00 AM - 12:00 PM (EST)',
      zoomLink: data.zoomLink,
    }),
  },
  reminder_1h: {
    subject: '⏰ ¡Comenzamos en 1 hora! - Link de acceso',
    templateFn: (data) => WorkshopReminder({
      customerName: data.customerName || 'Empresaria',
      hoursUntil: '1',
      workshopDate: data.workshopDate || 'Hoy',
      workshopTime: data.workshopTime || '9:00 AM - 12:00 PM (EST)',
      zoomLink: data.zoomLink,
    }),
  },
  access_link: {
    subject: '🚀 Tu link de acceso al Workshop está listo',
    templateFn: (data) => WorkshopAccessLink({
      customerName: data.customerName || 'Empresaria',
      workshopDate: data.workshopDate || 'Sábado, 7 de Marzo 2026',
      workshopTime: data.workshopTime || '9:00 AM - 12:00 PM (EST)',
      zoomLink: data.zoomLink || '',
      zoomMeetingId: data.zoomMeetingId,
      zoomPasscode: data.zoomPasscode,
    }),
  },
  recording: {
    subject: '🎬 Tu grabación del Workshop está lista',
    templateFn: (data) => WorkshopRecording({
      customerName: data.customerName || 'Empresaria',
      recordingLink: data.recordingLink || '',
      workshopDate: data.workshopDate || 'Sábado, 7 de Marzo 2026',
      expirationDate: data.expirationDate,
      bonusLinks: data.bonusLinks ? JSON.parse(data.bonusLinks) : [],
    }),
  },
  follow_up: {
    subject: '🌟 ¿Cómo va tu progreso? - Seguimiento del Workshop',
    templateFn: (data) => WorkshopFollowUp({
      customerName: data.customerName || 'Empresaria',
      daysAfter: parseInt(data.daysAfter || '7'),
      workshopTitle: data.workshopTitle || 'IA para Empresarias Exitosas',
    }),
  },
}

/**
 * Send an email using Resend
 */
export async function sendEmail({ to, type, data, registrationId }: SendEmailParams): Promise<EmailResult> {
  const config = emailConfig[type]

  if (!config) {
    return { success: false, error: `Unknown email type: ${type}` }
  }

  try {
    // Render the email template
    const html = await render(config.templateFn(data))

    // Send via Resend
    const { data: result, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: config.subject,
      html,
    })

    if (error) {
      console.error('Resend error:', error)

      // Log failed email
      if (registrationId) {
        await logEmail({
          registrationId,
          emailType: type,
          recipientEmail: to,
          subject: config.subject,
          status: 'failed',
          errorMessage: error.message,
        })
      }

      return { success: false, error: error.message }
    }

    // Log successful email
    if (registrationId) {
      await logEmail({
        registrationId,
        emailType: type,
        recipientEmail: to,
        subject: config.subject,
        status: 'sent',
        providerMessageId: result?.id,
      })
    }

    return { success: true, messageId: result?.id }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Email send error:', error)

    // Log failed email
    if (registrationId) {
      await logEmail({
        registrationId,
        emailType: type,
        recipientEmail: to,
        subject: config.subject,
        status: 'failed',
        errorMessage,
      })
    }

    return { success: false, error: errorMessage }
  }
}

/**
 * Log email to database
 */
async function logEmail({
  registrationId,
  emailType,
  recipientEmail,
  subject,
  status,
  providerMessageId,
  errorMessage,
}: {
  registrationId: string
  emailType: EmailType
  recipientEmail: string
  subject: string
  status: 'pending' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'failed'
  providerMessageId?: string
  errorMessage?: string
) {
  try {
    // Using type assertion to bypass strict Supabase typing
    const emailLogData = {
      registration_id: registrationId,
      email_type: emailType,
      recipient_email: recipientEmail,
      subject,
      status,
      provider: 'resend',
      provider_message_id: providerMessageId || null,
      error_message: errorMessage || null,
      sent_at: status === 'sent' ? new Date().toISOString() : null,
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabaseAdmin as any).from('email_logs').insert(emailLogData)
  } catch (error) {
    console.error('Error logging email:', error)
  }
}

/**
 * Send confirmation email after successful payment
 */
export async function sendConfirmationEmail({
  to,
  customerName,
  amount,
  paymentMethod,
  registrationId,
}: {
  to: string
  customerName: string
  amount: string
  paymentMethod: string
  registrationId: string
}): Promise<EmailResult> {
  return sendEmail({
    to,
    type: 'confirmation',
    data: {
      customerName,
      workshopDate: 'Sábado, 7 de Marzo 2026',
      workshopTime: '9:00 AM - 12:00 PM (EST)',
      amount: `$${amount}`,
      paymentMethod,
    },
    registrationId,
  })
}

/**
 * Send reminder email (24h or 1h before)
 */
export async function sendReminderEmail({
  to,
  customerName,
  hoursUntil,
  zoomLink,
  registrationId,
}: {
  to: string
  customerName: string
  hoursUntil: 24 | 1
  zoomLink?: string
  registrationId: string
}): Promise<EmailResult> {
  const type = hoursUntil === 24 ? 'reminder_24h' : 'reminder_1h'

  return sendEmail({
    to,
    type,
    data: {
      customerName,
      zoomLink: zoomLink || '',
    },
    registrationId,
  })
}

/**
 * Send access link email with Zoom details
 */
export async function sendAccessLinkEmail({
  to,
  customerName,
  zoomLink,
  zoomMeetingId,
  zoomPasscode,
  registrationId,
}: {
  to: string
  customerName: string
  zoomLink: string
  zoomMeetingId?: string
  zoomPasscode?: string
  registrationId: string
}): Promise<EmailResult> {
  return sendEmail({
    to,
    type: 'access_link',
    data: {
      customerName,
      zoomLink,
      zoomMeetingId: zoomMeetingId || '',
      zoomPasscode: zoomPasscode || '',
    },
    registrationId,
  })
}

/**
 * Send recording email after workshop
 */
export async function sendRecordingEmail({
  to,
  customerName,
  recordingLink,
  expirationDate,
  registrationId,
}: {
  to: string
  customerName: string
  recordingLink: string
  expirationDate?: string
  registrationId: string
}): Promise<EmailResult> {
  return sendEmail({
    to,
    type: 'recording',
    data: {
      customerName,
      recordingLink,
      expirationDate: expirationDate || '',
    },
    registrationId,
  })
}

/**
 * Send follow-up email days after workshop
 */
export async function sendFollowUpEmail({
  to,
  customerName,
  daysAfter,
  registrationId,
}: {
  to: string
  customerName: string
  daysAfter: number
  registrationId: string
}): Promise<EmailResult> {
  return sendEmail({
    to,
    type: 'follow_up',
    data: {
      customerName,
      daysAfter: String(daysAfter),
    },
    registrationId,
  })
}
