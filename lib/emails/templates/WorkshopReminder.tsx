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
  Row,
  Column,
} from '@react-email/components'

interface WorkshopReminderProps {
  customerName: string
  hoursUntil: '24' | '1'
  workshopDate: string
  workshopTime: string
  zoomLink?: string
}

export default function WorkshopReminder({
  customerName = 'Empresaria',
  hoursUntil = '24',
  workshopDate = 'Sábado, 7 de Marzo 2026',
  workshopTime = '9:00 AM - 12:00 PM (EST)',
  zoomLink = '',
}: WorkshopReminderProps) {
  const isOneHour = hoursUntil === '1'
  const previewText = isOneHour
    ? `⏰ ¡El workshop comienza en 1 HORA!`
    : `📅 Recordatorio: Tu workshop es MAÑANA`

  const urgencyColor = isOneHour ? '#C7517E' : '#2CB6D7'
  const urgencyText = isOneHour
    ? '¡EMPIEZA EN 1 HORA!'
    : 'Es Mañana'

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
            <Heading style={logoText}>SINSAJO CREATORS</Heading>
          </Section>

          {/* Urgency Banner */}
          <Section style={{ ...urgencyBanner, backgroundColor: urgencyColor }}>
            <Text style={clockEmoji}>{isOneHour ? '⏰' : '📅'}</Text>
            <Heading style={h1}>{urgencyText}</Heading>
            <Text style={subtitle}>
              &quot;IA para Empresarias Exitosas&quot;
            </Text>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Text style={paragraph}>
              Hola <strong>{customerName}</strong>,
            </Text>

            {isOneHour ? (
              <>
                <Text style={paragraph}>
                  🚨 <strong>¡El workshop está a punto de comenzar!</strong>
                </Text>
                <Text style={paragraph}>
                  Asegúrate de tener todo listo: un lugar tranquilo, buena conexión
                  a internet, y tu mente abierta para aprender.
                </Text>
              </>
            ) : (
              <>
                <Text style={paragraph}>
                  Este es un recordatorio amistoso de que tu workshop
                  <strong style={{ color: '#C7517E' }}> &quot;IA para Empresarias Exitosas&quot;</strong> es mañana.
                </Text>
                <Text style={paragraph}>
                  ¡Prepárate para transformar tu negocio con inteligencia artificial!
                </Text>
              </>
            )}
          </Section>

          {/* Event Details */}
          <Section style={detailsBox}>
            <Heading as="h2" style={h2}>
              Detalles del Evento
            </Heading>

            <Row style={detailRow}>
              <Column style={iconCol}>📅</Column>
              <Column style={textCol}>
                <Text style={detailLabel}>Fecha</Text>
                <Text style={detailValue}>{workshopDate}</Text>
              </Column>
            </Row>

            <Row style={detailRow}>
              <Column style={iconCol}>🕐</Column>
              <Column style={textCol}>
                <Text style={detailLabel}>Hora</Text>
                <Text style={detailValue}>{workshopTime}</Text>
              </Column>
            </Row>

            <Row style={detailRow}>
              <Column style={iconCol}>📍</Column>
              <Column style={textCol}>
                <Text style={detailLabel}>Ubicación</Text>
                <Text style={detailValue}>Virtual (Zoom)</Text>
              </Column>
            </Row>
          </Section>

          {/* Zoom Link (if available) */}
          {zoomLink && (
            <Section style={zoomSection}>
              <Heading as="h2" style={h2}>
                Tu Link de Acceso
              </Heading>
              <Button style={zoomButton} href={zoomLink}>
                🎥 Unirse al Workshop
              </Button>
              <Text style={zoomNote}>
                Guarda este link. Lo necesitarás para unirte al workshop.
              </Text>
            </Section>
          )}

          {/* Checklist */}
          <Section style={content}>
            <Heading as="h2" style={h2}>
              ✅ Lista de Preparación
            </Heading>
            <Text style={checklistItem}>
              ☐ Conexión a internet estable
            </Text>
            <Text style={checklistItem}>
              ☐ Audífonos o parlantes listos
            </Text>
            <Text style={checklistItem}>
              ☐ Libreta y bolígrafo para notas
            </Text>
            <Text style={checklistItem}>
              ☐ Tu café o té favorito ☕
            </Text>
            <Text style={checklistItem}>
              ☐ Mente abierta para aprender
            </Text>
          </Section>

          {/* CTA */}
          {!zoomLink && (
            <Section style={buttonSection}>
              <Text style={waitingNote}>
                El link de Zoom será enviado 1 hora antes del evento.
              </Text>
            </Section>
          )}

          {/* Support */}
          <Section style={content}>
            <Hr style={hr} />
            <Text style={supportText}>
              ¿Problemas para conectarte? Escríbenos a{' '}
              <Link href="mailto:sales@sinsajocreators.com" style={link}>
                sales@sinsajocreators.com
              </Link>
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Sinsajo Creators - IA que trabaja mientras tú descansas
            </Text>
            <Text style={footerText}>
              © 2026 Sinsajo Creators. Todos los derechos reservados.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
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

const urgencyBanner = {
  padding: '30px',
  textAlign: 'center' as const,
}

const clockEmoji = {
  fontSize: '48px',
  margin: '0 0 10px 0',
}

const h1 = {
  color: '#FCFEFB',
  fontSize: '28px',
  fontWeight: '700',
  margin: '0',
}

const subtitle = {
  color: '#FCFEFB',
  fontSize: '16px',
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

const detailsBox = {
  backgroundColor: '#f0f9ff',
  padding: '24px',
  margin: '0',
  borderLeft: '4px solid #2CB6D7',
}

const h2 = {
  color: '#022133',
  fontSize: '20px',
  fontWeight: '600',
  margin: '0 0 20px 0',
}

const detailRow = {
  marginBottom: '12px',
}

const iconCol = {
  width: '40px',
  fontSize: '20px',
  verticalAlign: 'top' as const,
}

const textCol = {
  verticalAlign: 'top' as const,
}

const detailLabel = {
  color: '#6b7280',
  fontSize: '12px',
  margin: '0',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
}

const detailValue = {
  color: '#022133',
  fontSize: '16px',
  fontWeight: '500',
  margin: '2px 0 0 0',
}

const zoomSection = {
  backgroundColor: '#022133',
  padding: '30px',
  textAlign: 'center' as const,
}

const zoomButton = {
  backgroundColor: '#C7517E',
  borderRadius: '8px',
  color: '#FCFEFB',
  fontSize: '18px',
  fontWeight: '600',
  padding: '16px 32px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
}

const zoomNote = {
  color: '#9ca3af',
  fontSize: '14px',
  margin: '16px 0 0 0',
}

const checklistItem = {
  color: '#374151',
  fontSize: '15px',
  lineHeight: '32px',
  margin: '0',
}

const buttonSection = {
  backgroundColor: '#FCFEFB',
  padding: '0 30px 30px 30px',
  textAlign: 'center' as const,
}

const waitingNote = {
  color: '#6b7280',
  fontSize: '14px',
  fontStyle: 'italic' as const,
}

const hr = {
  borderColor: '#e5e7eb',
  margin: '20px 0',
}

const supportText = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '22px',
  textAlign: 'center' as const,
}

const link = {
  color: '#2CB6D7',
  textDecoration: 'underline',
}

const footer = {
  backgroundColor: '#f4f4f5',
  padding: '30px',
  textAlign: 'center' as const,
  borderRadius: '0 0 12px 12px',
}

const footerText = {
  color: '#6b7280',
  fontSize: '12px',
  margin: '8px 0',
}
