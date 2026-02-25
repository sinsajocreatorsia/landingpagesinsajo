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

interface ProfileSummaryProps {
  customerName: string
  businessName: string
  industry: string
  challenges: string[]
  primaryGoal: string
  currentTools: string[]
  aiExperience: string
  communicationPreference: string
  expectedOutcome?: string
}

const CHALLENGE_LABELS: Record<string, string> = {
  time_management: '⏰ Gestión del tiempo',
  lead_generation: '🎯 Generación de leads',
  customer_service: '💬 Servicio al cliente',
  content_creation: '✍️ Creación de contenido',
  sales_closing: '💰 Cierre de ventas',
  team_management: '👥 Gestión de equipo',
  scaling: '📈 Escalar operaciones',
  automation: '🤖 Automatización',
}

const TOOL_LABELS: Record<string, string> = {
  chatgpt: 'ChatGPT',
  canva: 'Canva',
  notion: 'Notion',
  zapier: 'Zapier',
  calendly: 'Calendly',
  mailchimp: 'Mailchimp/Email Marketing',
  crm: 'CRM (Salesforce, HubSpot)',
  none: 'Ninguna herramienta IA',
}

const AI_EXPERIENCE_LABELS: Record<string, string> = {
  none: 'Ninguna',
  basic: 'Básica',
  intermediate: 'Intermedia',
  advanced: 'Avanzada',
}

const COMMUNICATION_LABELS: Record<string, string> = {
  email: '📧 Email',
  whatsapp: '💬 WhatsApp',
  phone: '📞 Teléfono',
  both: '✅ Todos los medios',
}

export default function ProfileSummary({
  customerName = 'Empresaria',
  businessName = '',
  industry = '',
  challenges = [],
  primaryGoal = '',
  currentTools = [],
  aiExperience = '',
  communicationPreference = '',
  expectedOutcome = '',
}: ProfileSummaryProps) {
  const previewText = `¡Gracias por completar tu perfil, ${customerName}! Aquí está el resumen de tu información.`

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
            <Text style={checkmark}>📋</Text>
            <Heading style={h1}>¡Perfil Completado!</Heading>
          </Section>

          {/* Welcome Message */}
          <Section style={content}>
            <Text style={paragraph}>
              Hola <strong>{customerName}</strong>,
            </Text>
            <Text style={paragraph}>
              ¡Gracias por tomarte el tiempo de completar tu perfil! Esta información nos ayudará a personalizar tu experiencia en el workshop{' '}
              <strong style={{ color: '#C7517E' }}>
                &quot;IA para Empresarias Exitosas&quot;
              </strong>.
            </Text>
            <Text style={paragraph}>
              A continuación encontrarás un resumen de la información que compartiste:
            </Text>
          </Section>

          {/* Business Info */}
          <Section style={detailsBox}>
            <Heading as="h2" style={h2}>
              🏢 Tu Negocio
            </Heading>

            <Row style={detailRow}>
              <Column style={iconCol}>🏷️</Column>
              <Column style={textCol}>
                <Text style={detailLabel}>Nombre del Negocio</Text>
                <Text style={detailValue}>{businessName || 'No especificado'}</Text>
              </Column>
            </Row>

            <Row style={detailRow}>
              <Column style={iconCol}>📊</Column>
              <Column style={textCol}>
                <Text style={detailLabel}>Industria</Text>
                <Text style={detailValue}>{industry || 'No especificada'}</Text>
              </Column>
            </Row>
          </Section>

          {/* Challenges */}
          <Section style={challengesBox}>
            <Heading as="h2" style={h2}>
              🎯 Desafíos Identificados
            </Heading>
            {challenges.length > 0 ? (
              challenges.map((challenge, index) => (
                <Text key={index} style={challengeItem}>
                  {CHALLENGE_LABELS[challenge] || challenge}
                </Text>
              ))
            ) : (
              <Text style={challengeItem}>No se especificaron desafíos</Text>
            )}
          </Section>

          {/* Goals */}
          <Section style={content}>
            <Heading as="h2" style={h2}>
              ✨ Tu Objetivo Principal
            </Heading>
            <Text style={goalText}>
              {primaryGoal || 'No especificado'}
            </Text>

            {expectedOutcome && (
              <>
                <Heading as="h3" style={h3}>
                  🎯 Lo que esperas lograr en 30 días:
                </Heading>
                <Text style={goalText}>
                  {expectedOutcome}
                </Text>
              </>
            )}
          </Section>

          {/* Tools & Experience */}
          <Section style={toolsBox}>
            <Heading as="h2" style={h2White}>
              🛠️ Herramientas y Experiencia
            </Heading>

            <Text style={toolsLabel}>Herramientas que usas actualmente:</Text>
            <Text style={toolsValue}>
              {currentTools.length > 0
                ? currentTools.map(t => TOOL_LABELS[t] || t).join(', ')
                : 'Ninguna especificada'}
            </Text>

            <Text style={toolsLabel}>Tu experiencia con IA:</Text>
            <Text style={toolsValue}>
              {AI_EXPERIENCE_LABELS[aiExperience] || aiExperience || 'No especificada'}
            </Text>
          </Section>

          {/* Communication Preference */}
          <Section style={content}>
            <Heading as="h2" style={h2}>
              📬 Preferencia de Contacto
            </Heading>
            <Text style={paragraph}>
              {COMMUNICATION_LABELS[communicationPreference] || communicationPreference || 'No especificada'}
            </Text>
          </Section>

          {/* Next Steps */}
          <Section style={highlightBox}>
            <Heading as="h2" style={h2White}>
              📅 Próximos Pasos
            </Heading>
            <Text style={highlightItem}>
              ✅ Tu perfil está completo - ¡Excelente!
            </Text>
            <Text style={highlightItem}>
              📱 Únete al grupo de WhatsApp para recibir indicaciones
            </Text>
            <Text style={highlightItem}>
              📅 Marca el 7 de Marzo 2026 en tu calendario
            </Text>
            <Text style={highlightItem}>
              🎯 Prepara tus preguntas para el workshop
            </Text>
          </Section>

          {/* CTA Button */}
          <Section style={buttonSection}>
            <Button style={button} href="https://www.screatorsai.com/academy/workshop">
              Ver Detalles del Workshop
            </Button>
          </Section>

          {/* Support */}
          <Section style={content}>
            <Hr style={hr} />
            <Text style={supportText}>
              Usaremos esta información para personalizar tu experiencia en el workshop.
            </Text>
            <Text style={supportText}>
              ¿Tienes preguntas? Escríbenos a{' '}
              <Link href="mailto:sales@screatorsai.com" style={link}>
                sales@screatorsai.com
              </Link>
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
  backgroundColor: '#36B3AE',
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

const challengesBox = {
  backgroundColor: '#fef3c7',
  padding: '24px',
  margin: '0',
  borderLeft: '4px solid #f59e0b',
}

const h2 = {
  color: '#022133',
  fontSize: '20px',
  fontWeight: '600',
  margin: '0 0 20px 0',
}

const h3 = {
  color: '#022133',
  fontSize: '16px',
  fontWeight: '600',
  margin: '20px 0 10px 0',
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

const challengeItem = {
  color: '#374151',
  fontSize: '15px',
  lineHeight: '28px',
  margin: '4px 0',
}

const goalText = {
  color: '#374151',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '8px 0',
  padding: '12px',
  backgroundColor: '#f0fdf4',
  borderRadius: '8px',
  borderLeft: '4px solid #36B3AE',
}

const toolsBox = {
  backgroundColor: '#022133',
  padding: '24px',
  margin: '0',
}

const h2White = {
  color: '#FCFEFB',
  fontSize: '20px',
  fontWeight: '600',
  margin: '0 0 20px 0',
}

const toolsLabel = {
  color: '#9ca3af',
  fontSize: '12px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  margin: '16px 0 4px 0',
}

const toolsValue = {
  color: '#FCFEFB',
  fontSize: '15px',
  margin: '0 0 12px 0',
}

const highlightBox = {
  backgroundColor: '#C7517E',
  padding: '30px',
}

const highlightItem = {
  color: '#FCFEFB',
  fontSize: '15px',
  lineHeight: '28px',
  margin: '0',
}

const buttonSection = {
  backgroundColor: '#FCFEFB',
  padding: '0 30px 30px 30px',
  textAlign: 'center' as const,
}

const button = {
  backgroundColor: '#2CB6D7',
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

const footerLinks = {
  color: '#6b7280',
  fontSize: '12px',
  margin: '12px 0',
}

const footerLink = {
  color: '#2CB6D7',
  textDecoration: 'none',
}
