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

interface ProfileReminderProps {
  customerName: string
  profileUrl: string
  hoursAfterPayment?: number
}

export default function ProfileReminder({
  customerName = 'Empresaria',
  profileUrl = 'https://www.screatorsai.com/academy/workshop/success',
  hoursAfterPayment = 24,
}: ProfileReminderProps) {
  const previewText = `${customerName}, completa tu perfil para personalizar tu experiencia en el workshop`

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

          {/* Reminder Banner */}
          <Section style={reminderBanner}>
            <Text style={reminderEmoji}>📋</Text>
            <Heading style={h1}>¡Falta Tu Perfil!</Heading>
            <Text style={subtitle}>
              Personaliza tu experiencia en el workshop
            </Text>
          </Section>

          {/* Personal Message */}
          <Section style={content}>
            <Text style={paragraph}>
              Hola <strong>{customerName}</strong>,
            </Text>
            <Text style={paragraph}>
              ¡Gracias por inscribirte en el workshop{' '}
              <strong style={{ color: '#C7517E' }}>&quot;IA para Empresarias Exitosas&quot;</strong>!
            </Text>
            <Text style={paragraph}>
              Notamos que aún no has completado tu perfil de empresaria. Este
              cuestionario de 2 minutos nos ayuda a personalizar el contenido
              del workshop a tus necesidades específicas.
            </Text>
          </Section>

          {/* Benefits */}
          <Section style={benefitsBox}>
            <Heading as="h2" style={h2White}>
              ✨ ¿Por Qué Completar Tu Perfil?
            </Heading>
            <Text style={benefitItem}>
              🎯 Contenido adaptado a tu industria y desafíos
            </Text>
            <Text style={benefitItem}>
              💡 Ejemplos prácticos relevantes para tu negocio
            </Text>
            <Text style={benefitItem}>
              🤝 Conexión con empresarias de objetivos similares
            </Text>
            <Text style={benefitItem}>
              📊 Seguimiento personalizado post-workshop
            </Text>
          </Section>

          {/* CTA */}
          <Section style={ctaSection}>
            <Text style={ctaText}>
              Solo toma 2 minutos y marca una gran diferencia:
            </Text>
            <Button style={ctaButton} href={profileUrl}>
              Completar Mi Perfil Ahora
            </Button>
          </Section>

          {/* What to expect */}
          <Section style={content}>
            <Heading as="h2" style={h2}>
              📝 ¿Qué Te Preguntamos?
            </Heading>
            <Text style={listItem}>
              • Sobre tu negocio (nombre, industria, tamaño)
            </Text>
            <Text style={listItem}>
              • Tus principales desafíos actuales
            </Text>
            <Text style={listItem}>
              • Qué esperas lograr con el workshop
            </Text>
            <Text style={listItem}>
              • Tu experiencia previa con IA
            </Text>
            <Text style={paragraph}>
              Esta información es confidencial y solo se usa para mejorar tu
              experiencia de aprendizaje.
            </Text>
          </Section>

          {/* Workshop reminder */}
          <Section style={workshopBox}>
            <Heading as="h2" style={h2}>
              📅 Recuerda: El Workshop Se Acerca
            </Heading>
            <Text style={workshopDetail}>
              <strong>Fecha:</strong> Sábado, 7 de Marzo 2026
            </Text>
            <Text style={workshopDetail}>
              <strong>Hora:</strong> 9:00 AM - 12:00 PM (EST)
            </Text>
            <Text style={workshopDetail}>
              <strong>Ubicación:</strong> 110 N Ankeny Blvd, Ste 200, Ankeny, IA 50023
            </Text>
          </Section>

          {/* Support */}
          <Section style={content}>
            <Text style={paragraph}>
              ¿Tienes preguntas o necesitas ayuda? Simplemente responde a este
              email y te ayudaremos.
            </Text>
            <Text style={signature}>
              ¡Nos vemos pronto! 💪
              <br />
              <strong>El equipo de Sinsajo Creators</strong>
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Hr style={hr} />
            <Text style={footerText}>
              Sinsajo Creators - IA que trabaja mientras tú descansas
            </Text>
            <Text style={footerLinks}>
              <Link href="https://www.screatorsai.com" style={footerLink}>Web</Link>
              {' | '}
              <Link href="https://www.instagram.com/sinsajocreators" style={footerLink}>Instagram</Link>
              {' | '}
              <Link href="https://www.linkedin.com/company/sinsajocreators" style={footerLink}>LinkedIn</Link>
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

const reminderBanner = {
  backgroundColor: '#C7517E',
  padding: '30px',
  textAlign: 'center' as const,
}

const reminderEmoji = {
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

const benefitsBox = {
  backgroundColor: '#022133',
  padding: '30px',
}

const h2White = {
  color: '#FCFEFB',
  fontSize: '20px',
  fontWeight: '600',
  margin: '0 0 20px 0',
}

const benefitItem = {
  color: '#FCFEFB',
  fontSize: '15px',
  lineHeight: '32px',
  margin: '0',
}

const ctaSection = {
  backgroundColor: '#f0f9ff',
  padding: '30px',
  textAlign: 'center' as const,
}

const ctaText = {
  color: '#374151',
  fontSize: '16px',
  margin: '0 0 20px 0',
}

const ctaButton = {
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

const h2 = {
  color: '#022133',
  fontSize: '20px',
  fontWeight: '600',
  margin: '0 0 20px 0',
}

const listItem = {
  color: '#374151',
  fontSize: '15px',
  lineHeight: '28px',
  margin: '0',
}

const workshopBox = {
  backgroundColor: '#f0fdf4',
  padding: '30px',
  borderLeft: '4px solid #36B3AE',
}

const workshopDetail = {
  color: '#374151',
  fontSize: '15px',
  lineHeight: '28px',
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
