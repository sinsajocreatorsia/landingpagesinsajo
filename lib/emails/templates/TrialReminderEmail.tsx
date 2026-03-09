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

interface TrialReminderEmailProps {
  customerName: string
  daysRemaining: string
  expirationDate: string
  upgradeUrl: string
}

export default function TrialReminderEmail({
  customerName = 'Empresaria',
  daysRemaining = '5',
  expirationDate = '',
  upgradeUrl = 'https://www.screatorsai.com/hanna/upgrade',
}: TrialReminderEmailProps) {
  const previewText = `Tu prueba gratuita de Hanna Pro termina en ${daysRemaining} dias`

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

          {/* Alert Banner */}
          <Section style={alertBanner}>
            <Heading style={h1}>Tu prueba gratuita termina pronto</Heading>
            <Text style={subtitle}>
              Te quedan {daysRemaining} dias de Hanna Pro
            </Text>
          </Section>

          {/* Personal Message */}
          <Section style={content}>
            <Text style={paragraph}>
              Hola <strong>{customerName}</strong>,
            </Text>
            <Text style={paragraph}>
              Esperamos que hayas disfrutado usar Hanna Pro. Tu periodo de prueba
              gratuita termina el <strong>{expirationDate}</strong>.
            </Text>
            <Text style={paragraph}>
              Para seguir disfrutando de todas las funciones Pro sin interrupcion,
              activa tu suscripcion ahora. Es rapido y puedes cancelar cuando quieras.
            </Text>
          </Section>

          {/* What you'll keep */}
          <Section style={content}>
            <Heading as="h2" style={h2}>
              Lo que conservas con Hanna Pro:
            </Heading>
            <Text style={featureItem}>
              * Mensajes ilimitados con tu asistente IA
            </Text>
            <Text style={featureItem}>
              * Historial completo de conversaciones
            </Text>
            <Text style={featureItem}>
              * Perfil de negocio personalizado
            </Text>
            <Text style={featureItem}>
              * Activacion por voz
            </Text>
            <Text style={featureItem}>
              * Modelos IA avanzados
            </Text>
            <Text style={featureItem}>
              * Soporte por email
            </Text>
          </Section>

          {/* What happens */}
          <Section style={warningSection}>
            <Heading as="h2" style={h2Warning}>
              Si no activas tu plan:
            </Heading>
            <Text style={warningText}>
              Tu cuenta cambiara al plan Gratis con limite de 5 mensajes por dia
              y sin acceso a funciones avanzadas. No perderas tu cuenta ni tus
              conversaciones guardadas.
            </Text>
          </Section>

          {/* CTA Button */}
          <Section style={ctaSection}>
            <Heading as="h2" style={h2White}>
              Continua con Hanna Pro
            </Heading>
            <Text style={ctaText}>
              Activa tu suscripcion por solo $15/mes
            </Text>
            <Button style={ctaButton} href={upgradeUrl}>
              Activar Suscripcion
            </Button>
          </Section>

          {/* Sign Off */}
          <Section style={content}>
            <Text style={paragraph}>
              Si tienes alguna pregunta, simplemente responde a este email.
            </Text>
            <Text style={signature}>
              Con carino,
              <br />
              <strong>El equipo de Sinsajo Creators</strong>
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

// Styles (matching SurveyCouponEmail)
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

const alertBanner = {
  backgroundColor: '#C7517E',
  padding: '30px',
  textAlign: 'center' as const,
}

const h1 = {
  color: '#FCFEFB',
  fontSize: '26px',
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

const h2 = {
  color: '#022133',
  fontSize: '20px',
  fontWeight: '600',
  margin: '0 0 16px 0',
}

const h2White = {
  color: '#FCFEFB',
  fontSize: '20px',
  fontWeight: '600',
  margin: '0 0 12px 0',
}

const h2Warning = {
  color: '#92400e',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 12px 0',
}

const featureItem = {
  color: '#374151',
  fontSize: '15px',
  lineHeight: '28px',
  margin: '0',
  paddingLeft: '8px',
}

const warningSection = {
  backgroundColor: '#fef3c7',
  padding: '24px 30px',
}

const warningText = {
  color: '#78350f',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0',
}

const ctaSection = {
  backgroundColor: '#2CB6D7',
  padding: '30px',
  textAlign: 'center' as const,
}

const ctaText = {
  color: '#FCFEFB',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '0 0 20px 0',
}

const ctaButton = {
  backgroundColor: '#022133',
  borderRadius: '8px',
  color: '#FCFEFB',
  fontSize: '16px',
  fontWeight: '600',
  padding: '14px 28px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
}

const signature = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '24px 0 0 0',
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
