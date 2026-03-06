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

interface SurveyCouponEmailProps {
  customerName: string
  couponCode: string
  signupUrl: string
  expirationDate: string
}

export default function SurveyCouponEmail({
  customerName = 'Empresaria',
  couponCode = 'CHICASPRO2026',
  signupUrl = 'https://www.screatorsai.com/hanna/signup',
  expirationDate = '',
}: SurveyCouponEmailProps) {
  const previewText = 'Tu primer mes GRATIS de Hanna Estratega Pro esta listo'

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

          {/* Thank You Banner */}
          <Section style={thankYouBanner}>
            <Heading style={h1}>Gracias por tu feedback!</Heading>
            <Text style={subtitle}>
              Tu opinion nos ayuda a crear mejores talleres
            </Text>
          </Section>

          {/* Personal Message */}
          <Section style={content}>
            <Text style={paragraph}>
              Hola <strong>{customerName}</strong>,
            </Text>
            <Text style={paragraph}>
              Gracias por completar la encuesta del workshop. Tu feedback es muy
              valioso para nosotros y nos ayuda a mejorar cada taller.
            </Text>
            <Text style={paragraph}>
              Como agradecimiento, te regalamos tu{' '}
              <strong style={{ color: '#C7517E' }}>
                primer mes 100% GRATIS de Hanna Estratega Pro
              </strong>
              , tu asistente de IA personal para hacer crecer tu negocio.
            </Text>
          </Section>

          {/* Coupon Code Box */}
          <Section style={couponSection}>
            <Text style={couponLabel}>Tu codigo exclusivo:</Text>
            <Section style={couponBox}>
              <Text style={couponCodeStyle}>{couponCode}</Text>
            </Section>
            <Text style={couponNote}>
              Usa este codigo al registrarte para obtener tu primer mes 100% gratis.
              Despues del mes gratuito, puedes elegir continuar con un plan de pago.
            </Text>
          </Section>

          {/* What you get */}
          <Section style={content}>
            <Heading as="h2" style={h2}>
              Que incluye Hanna Pro:
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
              * Soporte por email
            </Text>
          </Section>

          {/* CTA Button */}
          <Section style={ctaSection}>
            <Heading as="h2" style={h2White}>
              Activa tu mes gratis ahora
            </Heading>
            <Text style={ctaText}>
              Registrate con tu codigo y empieza a usar Hanna hoy mismo.
            </Text>
            <Button style={ctaButton} href={`${signupUrl}?coupon=${couponCode}`}>
              Activar Mi Mes Gratis
            </Button>
          </Section>

          {/* Expiration Notice */}
          {expirationDate && (
            <Section style={content}>
              <Text style={expirationText}>
                Este codigo es valido hasta el {expirationDate}. Usalo antes de
                que expire.
              </Text>
            </Section>
          )}

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

const thankYouBanner = {
  backgroundColor: '#36B3AE',
  padding: '30px',
  textAlign: 'center' as const,
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

const couponSection = {
  backgroundColor: '#FCFEFB',
  padding: '20px 30px',
  textAlign: 'center' as const,
}

const couponLabel = {
  color: '#6b7280',
  fontSize: '14px',
  margin: '0 0 12px 0',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
}

const couponBox = {
  backgroundColor: '#fff7ed',
  border: '3px dashed #C7517E',
  borderRadius: '12px',
  padding: '20px',
  margin: '0 auto',
  maxWidth: '300px',
}

const couponCodeStyle = {
  color: '#C7517E',
  fontSize: '32px',
  fontWeight: '800',
  fontFamily: 'monospace',
  letterSpacing: '4px',
  margin: '0',
}

const couponNote = {
  color: '#6b7280',
  fontSize: '13px',
  lineHeight: '20px',
  margin: '16px 0 0 0',
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

const featureItem = {
  color: '#374151',
  fontSize: '15px',
  lineHeight: '28px',
  margin: '0',
  paddingLeft: '8px',
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

const expirationText = {
  color: '#9ca3af',
  fontSize: '13px',
  textAlign: 'center' as const,
  margin: '0',
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
