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

interface WorkshopRecordingProps {
  customerName: string
  recordingLink: string
  workshopDate: string
  expirationDate?: string
  bonusLinks?: {
    title: string
    url: string
  }[]
}

export default function WorkshopRecording({
  customerName = 'Empresaria',
  recordingLink = 'https://example.com/recording',
  workshopDate = 'Sábado, 7 de Marzo 2026',
  expirationDate = '',
  bonusLinks = [],
}: WorkshopRecordingProps) {
  const previewText = `🎬 Tu grabación del workshop está lista`

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

          {/* Recording Banner */}
          <Section style={recordingBanner}>
            <Text style={videoEmoji}>🎬</Text>
            <Heading style={h1}>Tu Grabación Está Lista</Heading>
            <Text style={subtitle}>
              &quot;IA para Empresarias Exitosas&quot;
            </Text>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Text style={paragraph}>
              Hola <strong>{customerName}</strong>,
            </Text>
            <Text style={paragraph}>
              ¡Qué increíble workshop tuvimos el {workshopDate}! Gracias por
              acompañarnos y por tu energía durante la sesión.
            </Text>
            <Text style={paragraph}>
              Como prometimos, aquí tienes acceso a la grabación completa para
              que puedas repasar el contenido cuando quieras.
            </Text>
          </Section>

          {/* Recording Access */}
          <Section style={recordingBox}>
            <Heading as="h2" style={h2White}>
              🎥 Accede a tu Grabación
            </Heading>

            <Button style={watchButton} href={recordingLink}>
              Ver Grabación del Workshop
            </Button>

            {expirationDate && (
              <Text style={expirationNote}>
                ⚠️ Este link expira el {expirationDate}. Guárdalo o descárgalo antes.
              </Text>
            )}
          </Section>

          {/* Bonus Materials */}
          {bonusLinks.length > 0 && (
            <Section style={bonusSection}>
              <Heading as="h2" style={h2}>
                🎁 Materiales Bonus
              </Heading>
              {bonusLinks.map((bonus, index) => (
                <Text key={index} style={bonusItem}>
                  <Link href={bonus.url} style={bonusLink}>
                    📎 {bonus.title}
                  </Link>
                </Text>
              ))}
            </Section>
          )}

          {/* Key Takeaways */}
          <Section style={content}>
            <Heading as="h2" style={h2}>
              📝 Puntos Clave del Workshop
            </Heading>
            <Text style={takeawayItem}>
              <strong>1.</strong> Los prompts estructurados multiplican la efectividad de la IA
            </Text>
            <Text style={takeawayItem}>
              <strong>2.</strong> La automatización debe empezar por tareas repetitivas
            </Text>
            <Text style={takeawayItem}>
              <strong>3.</strong> La IA no reemplaza tu expertise, lo amplifica
            </Text>
            <Text style={takeawayItem}>
              <strong>4.</strong> Empezar pequeño y escalar es la clave del éxito
            </Text>
          </Section>

          {/* Next Steps */}
          <Section style={nextStepsBox}>
            <Heading as="h2" style={h2White}>
              🚀 Próximos Pasos
            </Heading>
            <Text style={nextStepItem}>
              ✅ Revisa la grabación y toma notas adicionales
            </Text>
            <Text style={nextStepItem}>
              ✅ Implementa UNA estrategia esta semana
            </Text>
            <Text style={nextStepItem}>
              ✅ Comparte tus resultados en nuestra comunidad
            </Text>
            <Text style={nextStepItem}>
              ✅ Agenda tu sesión de seguimiento (si tienes una)
            </Text>
          </Section>

          {/* Feedback Request */}
          <Section style={content}>
            <Heading as="h2" style={h2}>
              💬 Tu Opinión Importa
            </Heading>
            <Text style={paragraph}>
              Nos encantaría saber qué te pareció el workshop. Tu feedback nos
              ayuda a mejorar y crear más contenido valioso para empresarias
              como tú.
            </Text>
            <Section style={buttonSection}>
              <Button style={feedbackButton} href="https://forms.gle/feedback">
                Dejar mi Feedback
              </Button>
            </Section>
          </Section>

          {/* Upgrade CTA */}
          <Section style={upgradeBox}>
            <Heading as="h2" style={h2}>
              ¿Lista para el Siguiente Nivel?
            </Heading>
            <Text style={upgradeText}>
              Si el workshop te abrió los ojos a las posibilidades de la IA,
              imagina lo que podrías lograr con acompañamiento personalizado.
            </Text>
            <Button style={upgradeButton} href="https://www.screatorsai.com/academy">
              Explorar Programas Avanzados
            </Button>
          </Section>

          {/* Support */}
          <Section style={content}>
            <Hr style={hr} />
            <Text style={supportText}>
              ¿Tienes preguntas sobre lo que aprendimos? Escríbenos a{' '}
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

const recordingBanner = {
  backgroundColor: '#200F5D',
  padding: '30px',
  textAlign: 'center' as const,
}

const videoEmoji = {
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

const recordingBox = {
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

const watchButton = {
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

const expirationNote = {
  color: '#fbbf24',
  fontSize: '13px',
  margin: '16px 0 0 0',
}

const bonusSection = {
  backgroundColor: '#f0fdf4',
  padding: '24px',
  borderLeft: '4px solid #36B3AE',
}

const h2 = {
  color: '#022133',
  fontSize: '20px',
  fontWeight: '600',
  margin: '0 0 20px 0',
}

const bonusItem = {
  margin: '10px 0',
}

const bonusLink = {
  color: '#2CB6D7',
  fontSize: '15px',
  textDecoration: 'underline',
}

const takeawayItem = {
  color: '#374151',
  fontSize: '15px',
  lineHeight: '28px',
  margin: '8px 0',
}

const nextStepsBox = {
  backgroundColor: '#2CB6D7',
  padding: '30px',
}

const nextStepItem = {
  color: '#FCFEFB',
  fontSize: '15px',
  lineHeight: '32px',
  margin: '0',
}

const buttonSection = {
  textAlign: 'center' as const,
  padding: '10px 0',
}

const feedbackButton = {
  backgroundColor: '#36B3AE',
  borderRadius: '8px',
  color: '#FCFEFB',
  fontSize: '16px',
  fontWeight: '600',
  padding: '14px 28px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
}

const upgradeBox = {
  backgroundColor: '#fff7ed',
  padding: '30px',
  textAlign: 'center' as const,
  borderLeft: '4px solid #C7517E',
}

const upgradeText = {
  color: '#374151',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '0 0 20px 0',
}

const upgradeButton = {
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
