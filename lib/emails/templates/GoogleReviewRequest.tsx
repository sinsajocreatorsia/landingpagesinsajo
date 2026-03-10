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

interface GoogleReviewRequestProps {
  customerName: string
  googleReviewUrl: string
}

export default function GoogleReviewRequest({
  customerName = 'Empresaria',
  googleReviewUrl = 'https://g.page/r/CSiIgCvkI4XiEBI/review',
}: GoogleReviewRequestProps) {
  const previewText = `${customerName}, tu opinion vale mucho para nosotras`

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

          {/* Emotional Banner */}
          <Section style={banner}>
            <Heading style={h1}>Gracias por ser parte del taller!</Heading>
            <Text style={bannerSubtitle}>
              Tu experiencia puede inspirar a otras emprendedoras
            </Text>
          </Section>

          {/* Personal Message */}
          <Section style={content}>
            <Text style={paragraph}>
              Hola <strong>{customerName}</strong>,
            </Text>
            <Text style={paragraph}>
              Queremos agradecerte de corazon por asistir al taller
              <strong> "IA para Empresarias Exitosas"</strong>. Fue increible
              compartir contigo y con todas las participantes esa energia de
              mujeres que quieren crecer sus negocios.
            </Text>
            <Text style={paragraph}>
              Nos encantaria que compartieras tu experiencia en Google.
              Tu resena no solo nos ayuda a nosotras{' '}
              <strong>sino que tambien ayuda a que otras emprendedoras
              como tu nos encuentren</strong> y se animen a dar el paso.
            </Text>
          </Section>

          {/* Google Review CTA */}
          <Section style={googleSection}>
            <Img
              src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png"
              width="92"
              height="30"
              alt="Google"
              style={{ margin: '0 auto 16px' }}
            />
            <Heading as="h2" style={h2White}>
              Solo toma 30 segundos
            </Heading>
            <Text style={googleText}>
              Haz click en el boton, selecciona las estrellas y escribe
              una o dos frases sobre lo que mas te gusto. Eso es todo!
            </Text>
            <Button style={googleButton} href={googleReviewUrl}>
              Dejar mi resena en Google
            </Button>
          </Section>

          {/* Ideas for the review */}
          <Section style={content}>
            <Heading as="h2" style={h2}>
              No sabes que escribir? Aqui van algunas ideas:
            </Heading>
            <Text style={ideaItem}>
              - Que fue lo que mas te gusto del taller?
            </Text>
            <Text style={ideaItem}>
              - Aprendiste algo nuevo sobre IA para tu negocio?
            </Text>
            <Text style={ideaItem}>
              - Lo recomendarias a otra emprendedora?
            </Text>
            <Text style={ideaItem}>
              - Como te sentiste durante la experiencia?
            </Text>
            <Text style={tipText}>
              Tip: Las resenas mas utiles son honestas y especificas.
              No tiene que ser larga, unas pocas palabras hacen la diferencia!
            </Text>
          </Section>

          {/* Hanna reminder */}
          <Section style={hannaSection}>
            <Heading as="h2" style={h2Hanna}>
              Recuerda: Tienes a Hanna esperandote
            </Heading>
            <Text style={hannaText}>
              Si aun no has activado tu mes gratis de{' '}
              <strong>Hanna Estratega Pro</strong>, usa tu codigo del taller:
            </Text>
            <Section style={couponBox}>
              <Text style={couponCode}>CHICASPRO2026</Text>
            </Section>
            <Button
              style={hannaButton}
              href="https://www.screatorsai.com/hanna/signup?coupon=CHICASPRO2026"
            >
              Activar mi mes gratis de Hanna
            </Button>
          </Section>

          {/* Sign Off */}
          <Section style={content}>
            <Text style={paragraph}>
              Gracias por confiar en Sinsajo Creators. Tu apoyo significa
              el mundo para nosotras.
            </Text>
            <Text style={signature}>
              Con mucho carino,
              <br />
              <strong>Brenda y el equipo de Sinsajo Creators</strong>
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

const banner = {
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

const bannerSubtitle = {
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
  lineHeight: '26px',
  margin: '16px 0',
}

const googleSection = {
  backgroundColor: '#FCFEFB',
  padding: '30px',
  textAlign: 'center' as const,
  borderTop: '2px solid #e5e7eb',
  borderBottom: '2px solid #e5e7eb',
}

const h2White = {
  color: '#374151',
  fontSize: '22px',
  fontWeight: '700',
  margin: '0 0 12px 0',
}

const googleText = {
  color: '#6b7280',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '0 0 24px 0',
}

const googleButton = {
  backgroundColor: '#4285F4',
  borderRadius: '8px',
  color: '#FCFEFB',
  fontSize: '16px',
  fontWeight: '600',
  padding: '14px 32px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
}

const h2 = {
  color: '#022133',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 16px 0',
}

const ideaItem = {
  color: '#374151',
  fontSize: '15px',
  lineHeight: '28px',
  margin: '0',
  paddingLeft: '8px',
}

const tipText = {
  color: '#9ca3af',
  fontSize: '13px',
  lineHeight: '20px',
  margin: '16px 0 0 0',
  fontStyle: 'italic' as const,
}

const hannaSection = {
  backgroundColor: '#f0fdf4',
  padding: '30px',
  textAlign: 'center' as const,
  borderTop: '3px solid #36B3AE',
}

const h2Hanna = {
  color: '#022133',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 12px 0',
}

const hannaText = {
  color: '#374151',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '0 0 16px 0',
}

const couponBox = {
  backgroundColor: '#fff7ed',
  border: '2px dashed #C7517E',
  borderRadius: '8px',
  padding: '12px',
  margin: '0 auto 16px',
  maxWidth: '250px',
}

const couponCode = {
  color: '#C7517E',
  fontSize: '24px',
  fontWeight: '800',
  fontFamily: 'monospace',
  letterSpacing: '3px',
  margin: '0',
}

const hannaButton = {
  backgroundColor: '#36B3AE',
  borderRadius: '8px',
  color: '#FCFEFB',
  fontSize: '14px',
  fontWeight: '600',
  padding: '12px 24px',
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
