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

interface WorkshopAccessLinkProps {
  customerName: string
  workshopDate: string
  workshopTime: string
  zoomLink: string
  zoomMeetingId?: string
  zoomPasscode?: string
}

export default function WorkshopAccessLink({
  customerName = 'Empresaria',
  workshopDate = 'Sábado, 7 de Marzo 2026',
  workshopTime = '9:00 AM - 12:00 PM (EST)',
  zoomLink = 'https://zoom.us/j/example',
  zoomMeetingId = '',
  zoomPasscode = '',
}: WorkshopAccessLinkProps) {
  const previewText = `🎥 Tu link de acceso para el workshop está listo`

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

          {/* Access Banner */}
          <Section style={accessBanner}>
            <Text style={rocketEmoji}>🚀</Text>
            <Heading style={h1}>¡Todo Listo!</Heading>
            <Text style={subtitle}>Tu acceso al workshop</Text>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Text style={paragraph}>
              Hola <strong>{customerName}</strong>,
            </Text>
            <Text style={paragraph}>
              ¡Es hora! Aquí tienes tu link de acceso para el workshop
              <strong style={{ color: '#C7517E' }}> &quot;IA para Empresarias Exitosas&quot;</strong>.
            </Text>
          </Section>

          {/* Zoom Access Box */}
          <Section style={zoomBox}>
            <Heading as="h2" style={h2White}>
              🎥 Tu Link de Zoom
            </Heading>

            <Button style={zoomButton} href={zoomLink}>
              Unirse al Workshop Ahora
            </Button>

            {(zoomMeetingId || zoomPasscode) && (
              <Section style={credentialsBox}>
                {zoomMeetingId && (
                  <Text style={credential}>
                    <strong>Meeting ID:</strong> {zoomMeetingId}
                  </Text>
                )}
                {zoomPasscode && (
                  <Text style={credential}>
                    <strong>Passcode:</strong> {zoomPasscode}
                  </Text>
                )}
              </Section>
            )}

            <Text style={zoomNote}>
              Si tienes problemas con el link, copia y pega la URL en tu navegador.
            </Text>
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
              <Column style={iconCol}>⏱️</Column>
              <Column style={textCol}>
                <Text style={detailLabel}>Duración</Text>
                <Text style={detailValue}>3 horas (incluye Q&amp;A)</Text>
              </Column>
            </Row>
          </Section>

          {/* Tips */}
          <Section style={content}>
            <Heading as="h2" style={h2}>
              💡 Tips para una Mejor Experiencia
            </Heading>
            <Text style={tipItem}>
              • Únete 5-10 minutos antes para probar tu audio y video
            </Text>
            <Text style={tipItem}>
              • Usa auriculares para mejor calidad de sonido
            </Text>
            <Text style={tipItem}>
              • Busca un lugar tranquilo sin distracciones
            </Text>
            <Text style={tipItem}>
              • Ten a mano papel y bolígrafo para tomar notas
            </Text>
            <Text style={tipItem}>
              • Prepara tus preguntas para el Q&amp;A final
            </Text>
          </Section>

          {/* Excitement Note */}
          <Section style={excitementBox}>
            <Text style={excitementText}>
              ✨ Estamos muy emocionadas de tenerte hoy. Este workshop
              marcará un antes y después en tu negocio.
            </Text>
          </Section>

          {/* Support */}
          <Section style={content}>
            <Hr style={hr} />
            <Text style={supportText}>
              ¿Problemas técnicos? Responde a este email o envía un mensaje a{' '}
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

const accessBanner = {
  backgroundColor: '#36B3AE',
  padding: '30px',
  textAlign: 'center' as const,
}

const rocketEmoji = {
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

const zoomBox = {
  backgroundColor: '#022133',
  padding: '30px',
  textAlign: 'center' as const,
}

const h2White = {
  color: '#FCFEFB',
  fontSize: '20px',
  fontWeight: '600',
  margin: '0 0 20px 0',
}

const zoomButton = {
  backgroundColor: '#C7517E',
  borderRadius: '8px',
  color: '#FCFEFB',
  fontSize: '18px',
  fontWeight: '600',
  padding: '18px 36px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
}

const credentialsBox = {
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  padding: '16px',
  borderRadius: '8px',
  marginTop: '20px',
}

const credential = {
  color: '#FCFEFB',
  fontSize: '14px',
  margin: '8px 0',
}

const zoomNote = {
  color: '#9ca3af',
  fontSize: '13px',
  margin: '16px 0 0 0',
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

const tipItem = {
  color: '#374151',
  fontSize: '15px',
  lineHeight: '28px',
  margin: '0',
}

const excitementBox = {
  backgroundColor: '#fff7ed',
  padding: '20px 30px',
  borderLeft: '4px solid #C7517E',
}

const excitementText = {
  color: '#374151',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '0',
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
