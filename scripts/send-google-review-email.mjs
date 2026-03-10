/**
 * Script to send Google Review request email to workshop participants
 *
 * Usage:
 *   node scripts/send-google-review-email.mjs --test     # Send test to sales@sinsajocreators.com
 *   node scripts/send-google-review-email.mjs --send     # Send to all registered participants
 */

import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'
import { render } from '@react-email/components'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Load env
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Try to load dotenv
try {
  const dotenv = await import('dotenv')
  dotenv.config({ path: join(__dirname, '..', '.env.local') })
  dotenv.config({ path: join(__dirname, '..', '.env') })
} catch {
  console.log('dotenv not found, using existing env vars')
}

const RESEND_API_KEY = process.env.RESEND_API_KEY
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const GOOGLE_REVIEW_URL = process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL || 'https://g.page/r/CSiIgCvkI4XiEBI/review'
const FROM_EMAIL = process.env.FROM_EMAIL || 'Sinsajo Creators <noreply@screatorsai.com>'

if (!RESEND_API_KEY || !SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing env vars: RESEND_API_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const resend = new Resend(RESEND_API_KEY)
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const isTest = process.argv.includes('--test')
const isSend = process.argv.includes('--send')

if (!isTest && !isSend) {
  console.log('Usage:')
  console.log('  node scripts/send-google-review-email.mjs --test   # Test email to sales@')
  console.log('  node scripts/send-google-review-email.mjs --send   # Send to all participants')
  process.exit(0)
}

// Build HTML email inline (since we can't easily import TSX in mjs)
function buildEmailHtml(customerName) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Ubuntu,sans-serif;margin:0;padding:0;">
  <div style="margin:0 auto;padding:20px 0;max-width:600px;">

    <!-- Header -->
    <div style="background-color:#022133;padding:30px;text-align:center;border-radius:12px 12px 0 0;">
      <img src="https://www.screatorsai.com/images/sinsajo-logo-1.png" width="80" height="80" alt="Sinsajo Creators" style="margin:0 auto;display:block;" />
      <p style="color:#FCFEFB;font-size:14px;font-weight:600;letter-spacing:2px;margin:10px 0 0 0;">SINSAJO CREATORS</p>
    </div>

    <!-- Banner -->
    <div style="background-color:#C7517E;padding:30px;text-align:center;">
      <h1 style="color:#FCFEFB;font-size:26px;font-weight:700;margin:0;">Gracias por ser parte del taller!</h1>
      <p style="color:#FCFEFB;font-size:16px;opacity:0.9;margin:10px 0 0 0;">Tu experiencia puede inspirar a otras emprendedoras</p>
    </div>

    <!-- Personal Message -->
    <div style="background-color:#FCFEFB;padding:30px;">
      <p style="color:#374151;font-size:16px;line-height:26px;margin:16px 0;">
        Hola <strong>${customerName}</strong>,
      </p>
      <p style="color:#374151;font-size:16px;line-height:26px;margin:16px 0;">
        Queremos agradecerte de corazon por asistir al taller
        <strong>"IA para Empresarias Exitosas"</strong>. Fue increible
        compartir contigo y con todas las participantes esa energia de
        mujeres que quieren crecer sus negocios.
      </p>
      <p style="color:#374151;font-size:16px;line-height:26px;margin:16px 0;">
        Nos encantaria que compartieras tu experiencia en Google.
        Tu resena no solo nos ayuda a nosotras
        <strong>sino que tambien ayuda a que otras emprendedoras
        como tu nos encuentren</strong> y se animen a dar el paso.
      </p>
    </div>

    <!-- Google Review CTA -->
    <div style="background-color:#FCFEFB;padding:30px;text-align:center;border-top:2px solid #e5e7eb;border-bottom:2px solid #e5e7eb;">
      <img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" width="92" height="30" alt="Google" style="margin:0 auto 16px;display:block;" />
      <h2 style="color:#374151;font-size:22px;font-weight:700;margin:0 0 12px 0;">Solo toma 30 segundos</h2>
      <p style="color:#6b7280;font-size:15px;line-height:24px;margin:0 0 24px 0;">
        Haz click en el boton, selecciona las estrellas y escribe
        una o dos frases sobre lo que mas te gusto. Eso es todo!
      </p>
      <a href="${GOOGLE_REVIEW_URL}" style="background-color:#4285F4;border-radius:8px;color:#FCFEFB;font-size:16px;font-weight:600;padding:14px 32px;text-decoration:none;display:inline-block;">
        Dejar mi resena en Google
      </a>
    </div>

    <!-- Ideas -->
    <div style="background-color:#FCFEFB;padding:30px;">
      <h2 style="color:#022133;font-size:18px;font-weight:600;margin:0 0 16px 0;">
        No sabes que escribir? Aqui van algunas ideas:
      </h2>
      <p style="color:#374151;font-size:15px;line-height:28px;margin:0;padding-left:8px;">- Que fue lo que mas te gusto del taller?</p>
      <p style="color:#374151;font-size:15px;line-height:28px;margin:0;padding-left:8px;">- Aprendiste algo nuevo sobre IA para tu negocio?</p>
      <p style="color:#374151;font-size:15px;line-height:28px;margin:0;padding-left:8px;">- Lo recomendarias a otra emprendedora?</p>
      <p style="color:#374151;font-size:15px;line-height:28px;margin:0;padding-left:8px;">- Como te sentiste durante la experiencia?</p>
      <p style="color:#9ca3af;font-size:13px;line-height:20px;margin:16px 0 0 0;font-style:italic;">
        Tip: Las resenas mas utiles son honestas y especificas.
        No tiene que ser larga, unas pocas palabras hacen la diferencia!
      </p>
    </div>

    <!-- Hanna Reminder -->
    <div style="background-color:#f0fdf4;padding:30px;text-align:center;border-top:3px solid #36B3AE;">
      <h2 style="color:#022133;font-size:18px;font-weight:600;margin:0 0 12px 0;">
        Recuerda: Tienes a Hanna esperandote
      </h2>
      <p style="color:#374151;font-size:15px;line-height:24px;margin:0 0 16px 0;">
        Si aun no has activado tu mes gratis de
        <strong>Hanna Estratega Pro</strong>, usa tu codigo del taller:
      </p>
      <div style="background-color:#fff7ed;border:2px dashed #C7517E;border-radius:8px;padding:12px;margin:0 auto 16px;max-width:250px;">
        <p style="color:#C7517E;font-size:24px;font-weight:800;font-family:monospace;letter-spacing:3px;margin:0;">CHICASPRO2026</p>
      </div>
      <a href="https://www.screatorsai.com/hanna/signup?coupon=CHICASPRO2026" style="background-color:#36B3AE;border-radius:8px;color:#FCFEFB;font-size:14px;font-weight:600;padding:12px 24px;text-decoration:none;display:inline-block;">
        Activar mi mes gratis de Hanna
      </a>
    </div>

    <!-- Sign Off -->
    <div style="background-color:#FCFEFB;padding:30px;">
      <p style="color:#374151;font-size:16px;line-height:26px;margin:16px 0;">
        Gracias por confiar en Sinsajo Creators. Tu apoyo significa
        el mundo para nosotras.
      </p>
      <p style="color:#374151;font-size:16px;line-height:24px;margin:24px 0 0 0;">
        Con mucho carino,<br />
        <strong>Brenda y el equipo de Sinsajo Creators</strong>
      </p>
    </div>

    <!-- Footer -->
    <div style="background-color:#f4f4f5;padding:20px 30px 30px;text-align:center;border-radius:0 0 12px 12px;">
      <hr style="border-color:#e5e7eb;margin:0 0 20px 0;border-style:solid;border-width:1px 0 0 0;" />
      <p style="color:#6b7280;font-size:12px;margin:8px 0;">Sinsajo Creators - IA que trabaja mientras tu descansas</p>
      <p style="color:#6b7280;font-size:12px;margin:12px 0;">
        <a href="https://www.screatorsai.com" style="color:#2CB6D7;text-decoration:none;">Web</a> |
        <a href="https://www.instagram.com/sinsajocreators" style="color:#2CB6D7;text-decoration:none;">Instagram</a> |
        <a href="https://www.linkedin.com/company/sinsajocreators" style="color:#2CB6D7;text-decoration:none;">LinkedIn</a>
      </p>
      <p style="color:#6b7280;font-size:12px;margin:8px 0;">&copy; 2026 Sinsajo Creators. Todos los derechos reservados.</p>
    </div>

  </div>
</body>
</html>`
}

async function sendTestEmail() {
  console.log('Sending TEST email to sales@sinsajocreators.com...\n')

  const html = buildEmailHtml('Equipo Sinsajo (TEST)')

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: ['sales@sinsajocreators.com'],
      subject: '[TEST] Tu experiencia en el taller puede inspirar a otras!',
      html,
    })

    if (error) {
      console.error('Error:', error)
      return
    }

    console.log('TEST email sent successfully!')
    console.log('Message ID:', data?.id)
    console.log('\nRevisa sales@sinsajocreators.com para ver el email.')
    console.log('Cuando estes lista, ejecuta: node scripts/send-google-review-email.mjs --send')
  } catch (err) {
    console.error('Error sending test:', err)
  }
}

async function sendToAllParticipants() {
  console.log('Fetching registered participants...\n')

  // Get all registered participants (unique emails, exclude test accounts)
  const { data: registrations, error } = await supabase
    .from('workshop_registrations')
    .select('full_name, email')
    .eq('payment_status', 'completed')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching registrations:', error)
    return
  }

  // Deduplicate by email, exclude test accounts
  const seen = new Set()
  const participants = registrations.filter(r => {
    const email = r.email.toLowerCase()
    if (seen.has(email)) return false
    if (email.includes('luisrs0000') || email.includes('ceo@sinsajo') || email.includes('giova.rodriguez')) return false
    seen.add(email)
    return true
  })

  console.log(`Found ${participants.length} unique participants:\n`)
  participants.forEach(p => console.log(`  - ${p.full_name} (${p.email})`))
  console.log('')

  let sent = 0
  let failed = 0

  for (const participant of participants) {
    const firstName = participant.full_name.split(' ')[0]
    const html = buildEmailHtml(firstName)

    try {
      const { data, error } = await resend.emails.send({
        from: FROM_EMAIL,
        to: [participant.email],
        subject: `${firstName}, tu experiencia en el taller puede inspirar a otras!`,
        html,
      })

      if (error) {
        console.error(`  FAIL: ${participant.email} - ${error.message}`)
        failed++
      } else {
        console.log(`  OK: ${participant.email} (${data?.id})`)
        sent++
      }

      // Small delay between emails to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 500))
    } catch (err) {
      console.error(`  FAIL: ${participant.email} - ${err.message}`)
      failed++
    }
  }

  console.log(`\nDone! Sent: ${sent}, Failed: ${failed}`)
}

if (isTest) {
  await sendTestEmail()
} else if (isSend) {
  await sendToAllParticipants()
}
