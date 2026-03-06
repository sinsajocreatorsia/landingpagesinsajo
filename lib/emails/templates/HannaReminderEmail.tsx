import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Button,
} from '@react-email/components'

interface ReminderItem {
  task: string
  due: string
  strategic_context?: string
  approach_suggestion?: string
}

interface HannaReminderEmailProps {
  customerName: string
  reminders: ReminderItem[]
  dashboardUrl: string
}

export default function HannaReminderEmail({
  customerName = 'Empresaria',
  reminders = [],
  dashboardUrl = 'https://www.screatorsai.com/hanna/dashboard',
}: HannaReminderEmailProps) {
  const count = reminders.length
  const previewText = `Hanna te recuerda: Tienes ${count} tarea${count !== 1 ? 's' : ''} pendiente${count !== 1 ? 's' : ''}`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Img
              src="https://www.screatorsai.com/images/sinsajo-logo-1.png"
              width="80"
              height="80"
              alt="Sinsajo Creators"
              style={{ margin: '0 auto' }}
            />
            <Heading style={logoText}>HANNA - Tu Consultora IA</Heading>
          </Section>

          {/* Banner */}
          <Section style={banner}>
            <Heading style={h1}>Tienes Tareas Pendientes</Heading>
            <Text style={subtitle}>
              {count} recordatorio{count !== 1 ? 's' : ''} que necesita{count !== 1 ? 'n' : ''} tu atencion
            </Text>
          </Section>

          {/* Greeting */}
          <Section style={content}>
            <Text style={paragraph}>
              Hola <strong>{customerName}</strong>,
            </Text>
            <Text style={paragraph}>
              Soy Hanna, y te escribo porque tienes tareas importantes que completar.
              Recuerda: la consistencia es lo que separa a los negocios ordinarios
              de los extraordinarios.
            </Text>
          </Section>

          {/* Reminders List */}
          {reminders.map((r, i) => (
            <Section key={i} style={reminderCard}>
              <Text style={reminderNumber}>Tarea {i + 1}</Text>
              <Heading as="h3" style={reminderTask}>{r.task}</Heading>
              <Text style={reminderDue}>
                Fecha: <strong>{r.due}</strong>
              </Text>
              {r.strategic_context && (
                <Text style={reminderDetail}>
                  <strong>Por que importa:</strong> {r.strategic_context}
                </Text>
              )}
              {r.approach_suggestion && (
                <Text style={reminderDetail}>
                  <strong>Como abordarlo:</strong> {r.approach_suggestion}
                </Text>
              )}
            </Section>
          ))}

          {/* CTA */}
          <Section style={ctaSection}>
            <Text style={ctaText}>
              Abre Hanna y trabaja en tus tareas. Te puedo ayudar
              a organizarte y avanzar paso a paso.
            </Text>
            <Button style={ctaButton} href={dashboardUrl}>
              Abrir Hanna y Empezar
            </Button>
          </Section>

          {/* Motivational */}
          <Section style={motivationalBox}>
            <Text style={motivationalQuote}>
              &quot;Negocios ordinarios hechos con consistencia extraordinaria
              crean resultados extraordinarios.&quot;
            </Text>
            <Text style={motivationalAuthor}>
              -- Filosofia Hanna
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Hr style={hr} />
            <Text style={footerText}>
              Sinsajo Creators - IA que trabaja mientras tu descansas
            </Text>
            <Text style={footerLinks}>
              <Link href="https://www.screatorsai.com" style={footerLink}>Web</Link>
              {' | '}
              <Link href="https://www.instagram.com/sinsajocreators" style={footerLink}>Instagram</Link>
              {' | '}
              <Link href="https://www.linkedin.com/company/sinsajocreators" style={footerLink}>LinkedIn</Link>
            </Text>
            <Text style={footerText}>
              &copy; 2026 Sinsajo Creators. Todos los derechos reservados.
            </Text>
            <Text style={unsubscribe}>
              <Link href="https://www.screatorsai.com/unsubscribe" style={unsubscribeLink}>
                Cancelar suscripcion
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// Styles (same brand palette as other emails)
const main = {
  backgroundColor: '#f4f4f5',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0',
  maxWidth: '600px',
}

const header = {
  backgroundColor: '#022133',
  padding: '30px',
  textAlign: 'center' as const,
  borderRadius: '12px 12px 0 0',
}

const logoText = {
  color: '#FCFEFB',
  fontSize: '14px',
  fontWeight: '600',
  letterSpacing: '2px',
  margin: '10px 0 0 0',
}

const banner = {
  backgroundColor: '#C7517E',
  padding: '30px',
  textAlign: 'center' as const,
}

const h1 = {
  color: '#FCFEFB',
  fontSize: '24px',
  fontWeight: '700',
  margin: '0',
}

const subtitle = {
  color: '#FCFEFB',
  fontSize: '15px',
  opacity: '0.9',
  margin: '10px 0 0 0',
}

const content = {
  backgroundColor: '#FCFEFB',
  padding: '30px',
}

const paragraph = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
}

const reminderCard = {
  backgroundColor: '#FCFEFB',
  padding: '20px 30px',
  borderLeft: '4px solid #2CB6D7',
  borderBottom: '1px solid #e5e7eb',
}

const reminderNumber = {
  color: '#2CB6D7',
  fontSize: '12px',
  fontWeight: '700',
  letterSpacing: '1px',
  textTransform: 'uppercase' as const,
  margin: '0 0 4px 0',
}

const reminderTask = {
  color: '#022133',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 8px 0',
}

const reminderDue = {
  color: '#C7517E',
  fontSize: '14px',
  margin: '0 0 12px 0',
}

const reminderDetail = {
  color: '#4b5563',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '8px 0',
}

const ctaSection = {
  backgroundColor: '#FCFEFB',
  padding: '30px',
  textAlign: 'center' as const,
}

const ctaText = {
  color: '#374151',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '0 0 20px 0',
}

const ctaButton = {
  backgroundColor: '#C7517E',
  borderRadius: '8px',
  color: '#FCFEFB',
  fontSize: '16px',
  fontWeight: '600',
  padding: '14px 28px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
}

const motivationalBox = {
  backgroundColor: '#f0f9ff',
  padding: '24px 30px',
  borderLeft: '4px solid #36B3AE',
}

const motivationalQuote = {
  color: '#374151',
  fontSize: '15px',
  lineHeight: '24px',
  fontStyle: 'italic' as const,
  margin: '0 0 8px 0',
}

const motivationalAuthor = {
  color: '#6b7280',
  fontSize: '13px',
  margin: '0',
}

const footer = {
  backgroundColor: '#f4f4f5',
  padding: '20px 30px 30px',
  textAlign: 'center' as const,
  borderRadius: '0 0 12px 12px',
}

const hr = {
  borderColor: '#e5e7eb',
  margin: '0 0 20px 0',
}

const footerText = {
  color: '#6b7280',
  fontSize: '12px',
  margin: '8px 0',
}

const footerLinks = {
  color: '#6b7280',
  fontSize: '12px',
  margin: '12px 0',
}

const footerLink = {
  color: '#2CB6D7',
  textDecoration: 'none',
}

const unsubscribe = {
  margin: '16px 0 0 0',
}

const unsubscribeLink = {
  color: '#9ca3af',
  fontSize: '11px',
  textDecoration: 'underline',
}
