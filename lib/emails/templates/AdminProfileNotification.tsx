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
  Row,
  Column,
} from '@react-email/components'

interface HannaAnalysis {
  summary: string
  readinessScore: number
  keyInsights: string[]
  challengesPrioritized: string[]
  recommendedFocus: string
  potentialQuickWins: string[]
  customizedTips: string[]
  engagementLevel: 'high' | 'medium' | 'low'
  followUpSuggestions: string[]
}

interface AdminProfileNotificationProps {
  customerName: string
  customerEmail: string
  businessName: string
  industry: string
  yearsInBusiness?: string
  teamSize?: string
  challenges: string[]
  primaryGoal: string
  currentTools: string[]
  aiExperience: string
  communicationPreference: string
  expectedOutcome?: string
  hannaAnalysis?: HannaAnalysis
}

const CHALLENGE_LABELS: Record<string, string> = {
  time_management: 'Gestion del tiempo',
  lead_generation: 'Generacion de leads',
  customer_service: 'Servicio al cliente',
  content_creation: 'Creacion de contenido',
  sales_closing: 'Cierre de ventas',
  team_management: 'Gestion de equipo',
  scaling: 'Escalar operaciones',
  automation: 'Automatizacion',
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
  basic: 'Basica',
  intermediate: 'Intermedia',
  advanced: 'Avanzada',
}

const COMMUNICATION_LABELS: Record<string, string> = {
  email: 'Email',
  whatsapp: 'WhatsApp',
  phone: 'Telefono',
  both: 'Todos los medios',
}

const ENGAGEMENT_COLORS: Record<string, string> = {
  high: '#22c55e',
  medium: '#f59e0b',
  low: '#ef4444',
}

const ENGAGEMENT_LABELS: Record<string, string> = {
  high: 'ALTO',
  medium: 'MEDIO',
  low: 'BAJO',
}

export default function AdminProfileNotification({
  customerName = 'Participante',
  customerEmail = '',
  businessName = '',
  industry = '',
  yearsInBusiness = '',
  teamSize = '',
  challenges = [],
  primaryGoal = '',
  currentTools = [],
  aiExperience = '',
  communicationPreference = '',
  expectedOutcome = '',
  hannaAnalysis,
}: AdminProfileNotificationProps) {
  const previewText = `Nuevo perfil completado: ${customerName} - ${businessName || industry}`

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
              width="60"
              height="60"
              alt="Sinsajo Creators"
              style={{ margin: '0 auto' }}
            />
            <Heading style={logoText}>ADMIN - WORKSHOP</Heading>
          </Section>

          {/* Alert Banner */}
          <Section style={alertBanner}>
            <Text style={alertIcon}>🎉</Text>
            <Heading style={h1}>Nuevo Perfil Completado</Heading>
            <Text style={timestamp}>
              {new Date().toLocaleString('es-ES', {
                timeZone: 'America/Mexico_City',
                dateStyle: 'full',
                timeStyle: 'short'
              })}
            </Text>
          </Section>

          {/* Student Info */}
          <Section style={studentSection}>
            <Heading as="h2" style={h2}>
              👤 Datos del Estudiante
            </Heading>

            <Row style={infoRow}>
              <Column style={labelCol}>Nombre:</Column>
              <Column style={valueCol}><strong>{customerName}</strong></Column>
            </Row>

            <Row style={infoRow}>
              <Column style={labelCol}>Email:</Column>
              <Column style={valueCol}>
                <Link href={`mailto:${customerEmail}`} style={emailLink}>
                  {customerEmail}
                </Link>
              </Column>
            </Row>

            <Row style={infoRow}>
              <Column style={labelCol}>Contacto preferido:</Column>
              <Column style={valueCol}>
                {COMMUNICATION_LABELS[communicationPreference] || communicationPreference}
              </Column>
            </Row>
          </Section>

          {/* Business Info */}
          <Section style={businessSection}>
            <Heading as="h2" style={h2White}>
              🏢 Negocio
            </Heading>

            <Row style={infoRowDark}>
              <Column style={labelColDark}>Nombre:</Column>
              <Column style={valueColDark}>{businessName || 'No especificado'}</Column>
            </Row>

            <Row style={infoRowDark}>
              <Column style={labelColDark}>Industria:</Column>
              <Column style={valueColDark}>{industry || 'No especificada'}</Column>
            </Row>

            <Row style={infoRowDark}>
              <Column style={labelColDark}>Anos en negocio:</Column>
              <Column style={valueColDark}>{yearsInBusiness || 'No especificado'}</Column>
            </Row>

            <Row style={infoRowDark}>
              <Column style={labelColDark}>Tamano equipo:</Column>
              <Column style={valueColDark}>{teamSize || 'No especificado'}</Column>
            </Row>
          </Section>

          {/* Challenges & Goals */}
          <Section style={content}>
            <Heading as="h2" style={h2}>
              🎯 Desafios y Objetivos
            </Heading>

            <Text style={subheading}>Desafios principales:</Text>
            <Text style={listText}>
              {challenges.length > 0
                ? challenges.map(c => CHALLENGE_LABELS[c] || c).join(' | ')
                : 'No especificados'}
            </Text>

            <Text style={subheading}>Meta principal:</Text>
            <Text style={goalBox}>
              {primaryGoal || 'No especificada'}
            </Text>

            {expectedOutcome && (
              <>
                <Text style={subheading}>Expectativa a 30 dias:</Text>
                <Text style={goalBox}>
                  {expectedOutcome}
                </Text>
              </>
            )}
          </Section>

          {/* Tech Experience */}
          <Section style={techSection}>
            <Heading as="h2" style={h2}>
              🛠️ Experiencia Tecnologica
            </Heading>

            <Text style={subheading}>Herramientas actuales:</Text>
            <Text style={listText}>
              {currentTools.length > 0
                ? currentTools.map(t => TOOL_LABELS[t] || t).join(', ')
                : 'Ninguna'}
            </Text>

            <Text style={subheading}>Nivel de experiencia con IA:</Text>
            <Text style={experienceBadge}>
              {AI_EXPERIENCE_LABELS[aiExperience] || aiExperience || 'No especificado'}
            </Text>
          </Section>

          {/* Hanna Analysis */}
          {hannaAnalysis && (
            <Section style={hannaSection}>
              <Heading as="h2" style={h2Hanna}>
                🤖 Analisis de Hanna
              </Heading>

              {/* Scores */}
              <Row style={scoresRow}>
                <Column style={scoreBox}>
                  <Text style={scoreLabel}>Readiness Score</Text>
                  <Text style={scoreValue}>{hannaAnalysis.readinessScore}/10</Text>
                </Column>
                <Column style={scoreBox}>
                  <Text style={scoreLabel}>Engagement</Text>
                  <Text style={{
                    ...engagementBadge,
                    backgroundColor: ENGAGEMENT_COLORS[hannaAnalysis.engagementLevel],
                  }}>
                    {ENGAGEMENT_LABELS[hannaAnalysis.engagementLevel]}
                  </Text>
                </Column>
              </Row>

              {/* Summary */}
              <Text style={hannaSummary}>
                {hannaAnalysis.summary}
              </Text>

              {/* Key Insights */}
              <Text style={hannaSubheading}>💡 Insights Clave:</Text>
              {hannaAnalysis.keyInsights.map((insight, i) => (
                <Text key={i} style={hannaListItem}>• {insight}</Text>
              ))}

              {/* Recommended Focus */}
              <Text style={hannaSubheading}>🎯 Enfoque Recomendado:</Text>
              <Text style={focusBox}>
                {hannaAnalysis.recommendedFocus}
              </Text>

              {/* Quick Wins */}
              <Text style={hannaSubheading}>⚡ Quick Wins Potenciales:</Text>
              {hannaAnalysis.potentialQuickWins.map((win, i) => (
                <Text key={i} style={hannaListItem}>• {win}</Text>
              ))}

              {/* Tips */}
              <Text style={hannaSubheading}>📝 Tips Personalizados:</Text>
              {hannaAnalysis.customizedTips.map((tip, i) => (
                <Text key={i} style={hannaListItem}>• {tip}</Text>
              ))}

              {/* Follow-up */}
              <Text style={hannaSubheading}>📞 Sugerencias de Seguimiento:</Text>
              {hannaAnalysis.followUpSuggestions.map((suggestion, i) => (
                <Text key={i} style={hannaListItem}>• {suggestion}</Text>
              ))}
            </Section>
          )}

          {/* Footer */}
          <Section style={footer}>
            <Hr style={hr} />
            <Text style={footerText}>
              Este es un email automatico del sistema de Workshop.
            </Text>
            <Text style={footerText}>
              <Link href="https://www.screatorsai.com/admin" style={footerLink}>
                Ir al Panel de Admin
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
  backgroundColor: '#1f2937',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0',
  maxWidth: '650px',
}

const header = {
  backgroundColor: '#022133',
  padding: '20px',
  textAlign: 'center' as const,
  borderRadius: '12px 12px 0 0',
}

const logoText = {
  color: '#9ca3af',
  fontSize: '12px',
  fontWeight: '600',
  letterSpacing: '2px',
  margin: '8px 0 0 0',
}

const alertBanner = {
  backgroundColor: '#059669',
  padding: '24px',
  textAlign: 'center' as const,
}

const alertIcon = {
  fontSize: '36px',
  margin: '0 0 8px 0',
}

const h1 = {
  color: '#FCFEFB',
  fontSize: '24px',
  fontWeight: '700',
  margin: '0 0 8px 0',
}

const timestamp = {
  color: '#d1fae5',
  fontSize: '13px',
  margin: '0',
}

const studentSection = {
  backgroundColor: '#FCFEFB',
  padding: '24px',
}

const h2 = {
  color: '#022133',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 16px 0',
}

const h2White = {
  color: '#FCFEFB',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 16px 0',
}

const infoRow = {
  marginBottom: '8px',
}

const labelCol = {
  width: '140px',
  color: '#6b7280',
  fontSize: '14px',
  verticalAlign: 'top' as const,
}

const valueCol = {
  color: '#022133',
  fontSize: '14px',
  verticalAlign: 'top' as const,
}

const emailLink = {
  color: '#2CB6D7',
  textDecoration: 'none',
}

const businessSection = {
  backgroundColor: '#022133',
  padding: '24px',
}

const infoRowDark = {
  marginBottom: '8px',
}

const labelColDark = {
  width: '140px',
  color: '#9ca3af',
  fontSize: '14px',
  verticalAlign: 'top' as const,
}

const valueColDark = {
  color: '#FCFEFB',
  fontSize: '14px',
  verticalAlign: 'top' as const,
}

const content = {
  backgroundColor: '#FCFEFB',
  padding: '24px',
}

const subheading = {
  color: '#6b7280',
  fontSize: '12px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  margin: '16px 0 4px 0',
}

const listText = {
  color: '#374151',
  fontSize: '14px',
  margin: '0 0 8px 0',
}

const goalBox = {
  backgroundColor: '#f0fdf4',
  borderLeft: '3px solid #22c55e',
  padding: '12px',
  color: '#374151',
  fontSize: '14px',
  margin: '4px 0 16px 0',
}

const techSection = {
  backgroundColor: '#f3f4f6',
  padding: '24px',
}

const experienceBadge = {
  display: 'inline-block',
  backgroundColor: '#2CB6D7',
  color: '#FCFEFB',
  padding: '4px 12px',
  borderRadius: '12px',
  fontSize: '13px',
  fontWeight: '500',
}

const hannaSection = {
  backgroundColor: '#581c87',
  padding: '24px',
}

const h2Hanna = {
  color: '#FCFEFB',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 20px 0',
}

const scoresRow = {
  marginBottom: '20px',
}

const scoreBox = {
  textAlign: 'center' as const,
  width: '50%',
}

const scoreLabel = {
  color: '#c4b5fd',
  fontSize: '11px',
  textTransform: 'uppercase' as const,
  margin: '0 0 4px 0',
}

const scoreValue = {
  color: '#FCFEFB',
  fontSize: '28px',
  fontWeight: '700',
  margin: '0',
}

const engagementBadge = {
  display: 'inline-block',
  color: '#FCFEFB',
  padding: '4px 12px',
  borderRadius: '12px',
  fontSize: '13px',
  fontWeight: '600',
}

const hannaSummary = {
  color: '#e9d5ff',
  fontSize: '15px',
  lineHeight: '22px',
  margin: '0 0 20px 0',
  padding: '12px',
  backgroundColor: 'rgba(255,255,255,0.1)',
  borderRadius: '8px',
}

const hannaSubheading = {
  color: '#FCFEFB',
  fontSize: '13px',
  fontWeight: '600',
  margin: '16px 0 8px 0',
}

const hannaListItem = {
  color: '#e9d5ff',
  fontSize: '13px',
  lineHeight: '20px',
  margin: '4px 0',
  paddingLeft: '8px',
}

const focusBox = {
  backgroundColor: '#7c3aed',
  color: '#FCFEFB',
  padding: '12px',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: '500',
  margin: '4px 0 16px 0',
}

const footer = {
  backgroundColor: '#111827',
  padding: '20px',
  textAlign: 'center' as const,
  borderRadius: '0 0 12px 12px',
}

const hr = {
  borderColor: '#374151',
  margin: '0 0 16px 0',
}

const footerText = {
  color: '#6b7280',
  fontSize: '12px',
  margin: '8px 0',
}

const footerLink = {
  color: '#2CB6D7',
  textDecoration: 'none',
}
