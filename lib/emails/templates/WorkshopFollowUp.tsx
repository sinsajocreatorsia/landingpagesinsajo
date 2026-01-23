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

interface WorkshopFollowUpProps {
  customerName: string
  daysAfter: number
  workshopTitle: string
}

export default function WorkshopFollowUp({
  customerName = 'Empresaria',
  daysAfter = 7,
  workshopTitle = 'IA para Empresarias Exitosas',
}: WorkshopFollowUpProps) {
  const previewText = `¿Cómo va tu progreso desde el workshop? 🌟`

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

          {/* Follow Up Banner */}
          <Section style={followUpBanner}>
            <Text style={starEmoji}>🌟</Text>
            <Heading style={h1}>¿Cómo Vas?</Heading>
            <Text style={subtitle}>
              {daysAfter} días después del workshop
            </Text>
          </Section>

          {/* Personal Message */}
          <Section style={content}>
            <Text style={paragraph}>
              Hola <strong>{customerName}</strong>,
            </Text>
            <Text style={paragraph}>
              Han pasado {daysAfter} días desde que participaste en
              <strong style={{ color: '#C7517E' }}> &quot;{workshopTitle}&quot;</strong>,
              y quería saber cómo te va.
            </Text>
            <Text style={paragraph}>
              El verdadero valor de un workshop no está en lo que aprendes,
              sino en lo que implementas. Por eso te escribo...
            </Text>
          </Section>

          {/* Progress Questions */}
          <Section style={questionsBox}>
            <Heading as="h2" style={h2White}>
              💭 Me Encantaría Saber...
            </Heading>
            <Text style={questionItem}>
              ✦ ¿Has empezado a usar alguna de las herramientas de IA que vimos?
            </Text>
            <Text style={questionItem}>
              ✦ ¿Qué parte del workshop te resultó más útil?
            </Text>
            <Text style={questionItem}>
              ✦ ¿Encontraste algún obstáculo que pueda ayudarte a superar?
            </Text>
            <Text style={questionItem}>
              ✦ ¿Hay algo que te gustaría profundizar más?
            </Text>
          </Section>

          {/* Quick Wins */}
          <Section style={content}>
            <Heading as="h2" style={h2}>
              ⚡ Quick Wins para Esta Semana
            </Heading>
            <Text style={paragraph}>
              Si aún no has implementado nada, aquí hay 3 cosas simples que
              puedes hacer HOY:
            </Text>
            <Text style={quickWin}>
              <strong>1. Crea un prompt para responder emails comunes</strong>
              <br />
              <span style={quickWinDetail}>
                Ahorra 30 minutos diarios automatizando respuestas frecuentes.
              </span>
            </Text>
            <Text style={quickWin}>
              <strong>2. Genera tu primera imagen de contenido con IA</strong>
              <br />
              <span style={quickWinDetail}>
                Usa las técnicas que vimos para crear un post para redes.
              </span>
            </Text>
            <Text style={quickWin}>
              <strong>3. Automatiza UNA tarea repetitiva</strong>
              <br />
              <span style={quickWinDetail}>
                Identifica algo que haces cada semana y crea un flujo para ello.
              </span>
            </Text>
          </Section>

          {/* Support Offer */}
          <Section style={supportBox}>
            <Heading as="h2" style={h2}>
              🤝 Estoy Aquí Para Ayudarte
            </Heading>
            <Text style={supportOffer}>
              Si te sientes estancada o tienes preguntas específicas,
              simplemente responde a este email. Me encanta ver a mis alumnas
              tener éxito, y estoy aquí para apoyarte.
            </Text>
            <Button style={replyButton} href="mailto:sales@sinsajocreators.com?subject=Pregunta sobre el Workshop">
              Responder Este Email
            </Button>
          </Section>

          {/* Resources Reminder */}
          <Section style={content}>
            <Heading as="h2" style={h2}>
              📚 No Olvides Tus Recursos
            </Heading>
            <Text style={resourceItem}>
              📹 <Link href="https://www.screatorsai.com/academy" style={link}>Grabación del Workshop</Link> - Repasa cualquier sección
            </Text>
            <Text style={resourceItem}>
              📋 <Link href="https://www.screatorsai.com/academy" style={link}>Guías y Plantillas</Link> - Descargables incluidos
            </Text>
            <Text style={resourceItem}>
              👥 <Link href="https://www.screatorsai.com/community" style={link}>Comunidad Privada</Link> - Conecta con otras empresarias
            </Text>
          </Section>

          {/* Next Steps CTA */}
          <Section style={nextStepsBox}>
            <Heading as="h2" style={h2White}>
              🚀 ¿Lista Para Más?
            </Heading>
            <Text style={nextStepsText}>
              Si el workshop despertó tu curiosidad y quieres llevar tu negocio
              al siguiente nivel con IA, tenemos programas más profundos
              diseñados para empresarias como tú.
            </Text>
            <Button style={ctaButton} href="https://www.screatorsai.com/academy">
              Ver Programas Avanzados
            </Button>
          </Section>

          {/* Testimonial */}
          <Section style={testimonialBox}>
            <Text style={testimonialQuote}>
              &quot;Después del workshop implementé solo UNA cosa y recuperé 5 horas
              semanales. Ahora puedo enfocarme en lo que realmente importa en
              mi negocio.&quot;
            </Text>
            <Text style={testimonialAuthor}>
              — María G., Consultora de Marketing
            </Text>
          </Section>

          {/* Sign Off */}
          <Section style={content}>
            <Text style={paragraph}>
              Recuerda: el progreso no tiene que ser perfecto, solo tiene que
              ser constante. Un pequeño paso hoy es mejor que un gran plan
              mañana.
            </Text>
            <Text style={paragraph}>
              ¡Mucho éxito esta semana! 💪
            </Text>
            <Text style={signature}>
              Con cariño,
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
            <Text style={unsubscribe}>
              <Link href="https://www.screatorsai.com/unsubscribe" style={unsubscribeLink}>
                Cancelar suscripción
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

const followUpBanner = {
  backgroundColor: '#36B3AE',
  padding: '30px',
  textAlign: 'center' as const,
}

const starEmoji = {
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

const questionsBox = {
  backgroundColor: '#022133',
  padding: '30px',
}

const h2White = {
  color: '#FCFEFB',
  fontSize: '20px',
  fontWeight: '600',
  margin: '0 0 20px 0',
}

const questionItem = {
  color: '#FCFEFB',
  fontSize: '15px',
  lineHeight: '32px',
  margin: '0',
}

const h2 = {
  color: '#022133',
  fontSize: '20px',
  fontWeight: '600',
  margin: '0 0 20px 0',
}

const quickWin = {
  color: '#374151',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '16px 0',
  padding: '16px',
  backgroundColor: '#f0f9ff',
  borderRadius: '8px',
}

const quickWinDetail = {
  color: '#6b7280',
  fontSize: '14px',
}

const supportBox = {
  backgroundColor: '#fff7ed',
  padding: '30px',
  textAlign: 'center' as const,
  borderLeft: '4px solid #C7517E',
}

const supportOffer = {
  color: '#374151',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '0 0 20px 0',
}

const replyButton = {
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

const resourceItem = {
  color: '#374151',
  fontSize: '15px',
  lineHeight: '32px',
  margin: '0',
}

const link = {
  color: '#2CB6D7',
  textDecoration: 'underline',
}

const nextStepsBox = {
  backgroundColor: '#2CB6D7',
  padding: '30px',
  textAlign: 'center' as const,
}

const nextStepsText = {
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

const testimonialBox = {
  backgroundColor: '#f0f9ff',
  padding: '30px',
  borderLeft: '4px solid #36B3AE',
}

const testimonialQuote = {
  color: '#374151',
  fontSize: '15px',
  lineHeight: '24px',
  fontStyle: 'italic' as const,
  margin: '0 0 12px 0',
}

const testimonialAuthor = {
  color: '#6b7280',
  fontSize: '14px',
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
