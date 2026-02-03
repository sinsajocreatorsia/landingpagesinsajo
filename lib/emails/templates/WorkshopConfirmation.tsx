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

interface WorkshopConfirmationProps {
  customerName: string
  workshopDate: string
  workshopTime: string
  amount: string
  paymentMethod: string
  location?: string
  whatsappLink?: string
}

export default function WorkshopConfirmation({
  customerName = 'Empresaria',
  workshopDate = 'Sábado, 7 de Marzo 2026',
  workshopTime = '9:00 AM - 12:00 PM',
  amount = '$100',
  paymentMethod = 'tarjeta',
  location = 'Se confirmará vía WhatsApp',
  whatsappLink = '',
}: WorkshopConfirmationProps) {
  const previewText = `¡Tu lugar en el workshop "IA para Empresarias Exitosas" está confirmado!`

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

          {/* Success Banner */}
          <Section style={successBanner}>
            <Text style={checkmark}>✓</Text>
            <Heading style={h1}>¡Pago Confirmado!</Heading>
          </Section>

          {/* Welcome Message */}
          <Section style={content}>
            <Text style={paragraph}>
              Hola <strong>{customerName}</strong>,
            </Text>
            <Text style={paragraph}>
              ¡Felicidades! Tu lugar en el workshop{' '}
              <strong style={{ color: '#C7517E' }}>
                &quot;IA para Empresarias Exitosas&quot;
              </strong>{' '}
              está oficialmente confirmado.
            </Text>
            <Text style={paragraph}>
              Estamos emocionadas de tenerte con nosotras. Este workshop transformará
              la manera en que operas tu negocio con inteligencia artificial.
            </Text>
          </Section>

          {/* Event Details Box */}
          <Section style={detailsBox}>
            <Heading as="h2" style={h2}>
              Detalles del Workshop
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
              <Column style={iconCol}>💳</Column>
              <Column style={textCol}>
                <Text style={detailLabel}>Pago</Text>
                <Text style={detailValue}>{amount} USD via {paymentMethod}</Text>
              </Column>
            </Row>

            <Row style={detailRow}>
              <Column style={iconCol}>📍</Column>
              <Column style={textCol}>
                <Text style={detailLabel}>Modalidad</Text>
                <Text style={detailValue}>PRESENCIAL</Text>
              </Column>
            </Row>

            <Row style={detailRow}>
              <Column style={iconCol}>🌎</Column>
              <Column style={textCol}>
                <Text style={detailLabel}>Idioma</Text>
                <Text style={detailValue}>Español</Text>
              </Column>
            </Row>

            <Row style={detailRow}>
              <Column style={iconCol}>📌</Column>
              <Column style={textCol}>
                <Text style={detailLabel}>Ubicación</Text>
                <Text style={detailValue}>{location}</Text>
              </Column>
            </Row>
          </Section>

          {/* Next Steps */}
          <Section style={content}>
            <Heading as="h2" style={h2}>
              Próximos Pasos
            </Heading>
            <Text style={listItem}>
              <strong>1.</strong> 📱 Únete a nuestro grupo de WhatsApp (recibirás el link pronto)
            </Text>
            <Text style={listItem}>
              <strong>2.</strong> 📍 En el grupo de WhatsApp te daremos todas las indicaciones previas al workshop (ubicación exacta, qué traer, etc.)
            </Text>
            <Text style={listItem}>
              <strong>3.</strong> 📅 Agrega el evento a tu calendario
            </Text>
            <Text style={listItem}>
              <strong>4.</strong> ✍️ Prepara tus preguntas para la sesión Q&amp;A
            </Text>
          </Section>

          {/* Contact Info */}
          <Section style={contactBox}>
            <Heading as="h2" style={h2}>
              ¿Tienes Dudas?
            </Heading>
            <Text style={contactText}>
              Puedes contactarnos por cualquiera de estos medios:
            </Text>
            <Text style={contactItem}>
              📞 <strong>Teléfono/WhatsApp:</strong> +1 (609) 288-5466
            </Text>
            <Text style={contactItem}>
              ✉️ <strong>Email:</strong> sales@sinsajocreators.com
            </Text>
            <Button style={whatsappButton} href="https://wa.me/16092885466?text=Hola%2C%20acabo%20de%20registrarme%20en%20el%20workshop%20y%20tengo%20una%20pregunta">
              💬 Escríbenos por WhatsApp
            </Button>
          </Section>

          {/* CTA Button */}
          <Section style={buttonSection}>
            <Button style={button} href="https://www.screatorsai.com/academy/workshop">
              Ver Detalles del Workshop
            </Button>
          </Section>

          {/* What You'll Learn */}
          <Section style={highlightBox}>
            <Heading as="h2" style={h2White}>
              Lo Que Aprenderás
            </Heading>
            <Text style={highlightItem}>
              ✨ Clonar tu inteligencia de negocio en un asistente IA
            </Text>
            <Text style={highlightItem}>
              ✨ Automatizar tareas que te roban horas cada semana
            </Text>
            <Text style={highlightItem}>
              ✨ Crear contenido visual de ultra-lujo en minutos
            </Text>
            <Text style={highlightItem}>
              ✨ Pasar de operadora a verdadera dueña de tu negocio
            </Text>
          </Section>

          {/* Support */}
          <Section style={content}>
            <Hr style={hr} />
            <Text style={supportText}>
              ¡Nos vemos pronto en persona! 🎉
            </Text>
            <Text style={supportText}>
              Recuerda que todas las indicaciones las recibirás en el grupo de WhatsApp.
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

const successBanner = {
  backgroundColor: '#2CB6D7',
  padding: '30px',
  textAlign: 'center' as const,
}

const checkmark = {
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

const listItem = {
  color: '#374151',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '8px 0',
  paddingLeft: '8px',
}

const buttonSection = {
  backgroundColor: '#FCFEFB',
  padding: '0 30px 30px 30px',
  textAlign: 'center' as const,
}

const button = {
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

const highlightBox = {
  backgroundColor: '#022133',
  padding: '30px',
}

const h2White = {
  color: '#FCFEFB',
  fontSize: '20px',
  fontWeight: '600',
  margin: '0 0 20px 0',
}

const highlightItem = {
  color: '#FCFEFB',
  fontSize: '15px',
  lineHeight: '28px',
  margin: '0',
}

const contactBox = {
  backgroundColor: '#fef3c7',
  padding: '24px',
  margin: '0',
  borderLeft: '4px solid #f59e0b',
}

const contactText = {
  color: '#374151',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '0 0 12px 0',
}

const contactItem = {
  color: '#374151',
  fontSize: '15px',
  lineHeight: '28px',
  margin: '4px 0',
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
  marginTop: '16px',
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

const footerLinks = {
  color: '#6b7280',
  fontSize: '12px',
  margin: '12px 0',
}

const footerLink = {
  color: '#2CB6D7',
  textDecoration: 'none',
}
