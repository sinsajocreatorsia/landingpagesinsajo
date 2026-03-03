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

interface WaitlistConfirmationProps {
  customerName: string
  position: number
}

export default function WaitlistConfirmation({
  customerName = 'Empresaria',
  position = 1,
}: WaitlistConfirmationProps) {
  const previewText = `¡Estás en la lista de espera para el próximo workshop de Sinsajo Creators!`

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

          {/* Banner */}
          <Section style={banner}>
            <Text style={bannerIcon}>📋</Text>
            <Heading style={h1}>¡Estás en la Lista de Espera!</Heading>
          </Section>

          {/* Welcome Message */}
          <Section style={content}>
            <Text style={paragraph}>
              Hola <strong>{customerName}</strong>,
            </Text>
            <Text style={paragraph}>
              Gracias por tu interés en nuestro workshop{' '}
              <strong style={{ color: '#C7517E' }}>
                &quot;IA para Empresarias Exitosas&quot;
              </strong>
              . La primera edición se llenó completamente (¡12 de 12 cupos!), lo que demuestra el
              increíble interés de empresarias como tú por transformar su negocio con IA.
            </Text>
            <Text style={paragraph}>
              Te hemos registrado en la{' '}
              <strong style={{ color: '#2CB6D7' }}>
                posición #{position}
              </strong>{' '}
              de nuestra lista de espera para el próximo workshop.
            </Text>
          </Section>

          {/* What happens next */}
          <Section style={detailsBox}>
            <Heading as="h2" style={h2}>
              ¿Qué sigue?
            </Heading>
            <Text style={listItem}>
              <strong>1.</strong> Serás de las primeras en enterarte cuando anunciemos la fecha del próximo workshop.
            </Text>
            <Text style={listItem}>
              <strong>2.</strong> Tendrás acceso prioritario para reservar tu lugar antes que nadie.
            </Text>
            <Text style={listItem}>
              <strong>3.</strong> Podrías recibir un precio especial exclusivo para la lista de espera.
            </Text>
          </Section>

          {/* Contact */}
          <Section style={content}>
            <Text style={paragraph}>
              Mientras tanto, si tienes preguntas sobre el workshop o cómo la IA puede ayudar
              a tu negocio, no dudes en contactarnos:
            </Text>
            <Button style={whatsappButton} href="https://wa.me/16092885466?text=Hola%2C%20estoy%20en%20la%20lista%20de%20espera%20del%20workshop%20y%20tengo%20una%20pregunta">
              Escríbenos por WhatsApp
            </Button>
          </Section>

          {/* Support */}
          <Section style={content}>
            <Hr style={hr} />
            <Text style={supportText}>
              ¡Gracias por confiar en Sinsajo Creators!
            </Text>
            <Text style={supportText}>
              Te notificaremos pronto con las novedades del próximo workshop.
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Sinsajo Creators - IA que trabaja mientras tú descansas
            </Text>
            <Text style={footerLinks}>
              <Link href="https://www.screatorsai.com" style={footerLink}>
                Web
              </Link>
              {' | '}
              <Link href="https://www.instagram.com/sinsajocreators" style={footerLink}>
                Instagram
              </Link>
              {' | '}
              <Link href="https://www.linkedin.com/company/sinsajocreators" style={footerLink}>
                LinkedIn
              </Link>
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

// Styles (reusing the same design system as other templates)
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

const bannerIcon = {
  fontSize: '48px',
  margin: '0 0 10px 0',
}

const h1 = {
  color: '#FCFEFB',
  fontSize: '28px',
  fontWeight: '700',
  margin: '0',
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
  padding: '24px 30px',
  margin: '0',
  borderLeft: '4px solid #2CB6D7',
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
  lineHeight: '24px',
  margin: '8px 0',
  paddingLeft: '8px',
}

const whatsappButton = {
  backgroundColor: '#25D366',
  borderRadius: '8px',
  color: '#FCFEFB',
  fontSize: '14px',
  fontWeight: '600',
  padding: '12px 24px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  marginTop: '8px',
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

const footerLinks = {
  color: '#6b7280',
  fontSize: '12px',
  margin: '12px 0',
}

const footerLink = {
  color: '#2CB6D7',
  textDecoration: 'none',
}
