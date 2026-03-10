import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
  Hr,
} from '@react-email/components'

interface WeeklySummaryEmailProps {
  customerName: string
  weekRange: string
  totalMessages: number
  totalSessions: number
  topTopics: string[]
  keyInsights: string[]
  actionItems: string[]
  dashboardUrl: string
}

export default function WeeklySummaryEmail({
  customerName,
  weekRange,
  totalMessages,
  totalSessions,
  topTopics,
  keyInsights,
  actionItems,
  dashboardUrl,
}: WeeklySummaryEmailProps) {
  return (
    <Html>
      <Head>
        <meta charSet="UTF-8" />
      </Head>
      <Body style={{ backgroundColor: '#0a0a0a', fontFamily: 'Arial, sans-serif', margin: 0, padding: 0 }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 20px' }}>
          {/* Header */}
          <Section style={{ textAlign: 'center', marginBottom: '32px' }}>
            <Text style={{ fontSize: '28px', fontWeight: 'bold', color: '#C7517E', margin: '0 0 8px' }}>
              Hanna
            </Text>
            <Text style={{ fontSize: '16px', color: '#999', margin: 0 }}>
              Tu resumen semanal
            </Text>
          </Section>

          {/* Greeting */}
          <Section style={{ backgroundColor: '#1a1a1a', borderRadius: '12px', padding: '24px', marginBottom: '24px', border: '1px solid #333' }}>
            <Text style={{ color: '#fff', fontSize: '18px', margin: '0 0 8px' }}>
              Hola {customerName},
            </Text>
            <Text style={{ color: '#ccc', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
              Aqui tienes el resumen de tu actividad con Hanna durante la semana del {weekRange}.
            </Text>
          </Section>

          {/* Stats */}
          <Section style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <table width="100%" cellPadding={0} cellSpacing={0}>
              <tr>
                <td width="50%" style={{ padding: '0 6px 0 0' }}>
                  <div style={{ backgroundColor: '#1a1a1a', borderRadius: '12px', padding: '20px', textAlign: 'center', border: '1px solid #333' }}>
                    <Text style={{ color: '#2CB6D7', fontSize: '28px', fontWeight: 'bold', margin: '0 0 4px' }}>
                      {totalMessages}
                    </Text>
                    <Text style={{ color: '#999', fontSize: '12px', margin: 0 }}>
                      Mensajes
                    </Text>
                  </div>
                </td>
                <td width="50%" style={{ padding: '0 0 0 6px' }}>
                  <div style={{ backgroundColor: '#1a1a1a', borderRadius: '12px', padding: '20px', textAlign: 'center', border: '1px solid #333' }}>
                    <Text style={{ color: '#C7517E', fontSize: '28px', fontWeight: 'bold', margin: '0 0 4px' }}>
                      {totalSessions}
                    </Text>
                    <Text style={{ color: '#999', fontSize: '12px', margin: 0 }}>
                      Conversaciones
                    </Text>
                  </div>
                </td>
              </tr>
            </table>
          </Section>

          {/* Top Topics */}
          {topTopics.length > 0 && (
            <Section style={{ backgroundColor: '#1a1a1a', borderRadius: '12px', padding: '24px', marginBottom: '24px', border: '1px solid #333' }}>
              <Text style={{ color: '#2CB6D7', fontSize: '14px', fontWeight: 'bold', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Temas principales
              </Text>
              {topTopics.map((topic, i) => (
                <Text key={i} style={{ color: '#ccc', fontSize: '14px', margin: '0 0 6px', paddingLeft: '12px', borderLeft: '3px solid #2CB6D7' }}>
                  {topic}
                </Text>
              ))}
            </Section>
          )}

          {/* Key Insights */}
          {keyInsights.length > 0 && (
            <Section style={{ backgroundColor: '#1a1a1a', borderRadius: '12px', padding: '24px', marginBottom: '24px', border: '1px solid #333' }}>
              <Text style={{ color: '#F59E0B', fontSize: '14px', fontWeight: 'bold', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Insights clave
              </Text>
              {keyInsights.map((insight, i) => (
                <Text key={i} style={{ color: '#ccc', fontSize: '14px', margin: '0 0 8px', lineHeight: '1.5' }}>
                  - {insight}
                </Text>
              ))}
            </Section>
          )}

          {/* Action Items */}
          {actionItems.length > 0 && (
            <Section style={{ backgroundColor: '#1a1a1a', borderRadius: '12px', padding: '24px', marginBottom: '24px', border: '1px solid #10B981', borderWidth: '1px' }}>
              <Text style={{ color: '#10B981', fontSize: '14px', fontWeight: 'bold', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Acciones pendientes
              </Text>
              {actionItems.map((item, i) => (
                <Text key={i} style={{ color: '#ccc', fontSize: '14px', margin: '0 0 8px', lineHeight: '1.5' }}>
                  {i + 1}. {item}
                </Text>
              ))}
            </Section>
          )}

          <Hr style={{ borderColor: '#333', margin: '24px 0' }} />

          {/* CTA */}
          <Section style={{ textAlign: 'center', marginBottom: '24px' }}>
            <Link
              href={dashboardUrl}
              style={{
                display: 'inline-block',
                backgroundColor: '#C7517E',
                color: '#fff',
                padding: '14px 32px',
                borderRadius: '24px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 'bold',
              }}
            >
              Continuar con Hanna
            </Link>
          </Section>

          {/* Footer */}
          <Section style={{ textAlign: 'center' }}>
            <Text style={{ color: '#666', fontSize: '12px', margin: 0 }}>
              Hanna - Tu consultora estrategica de negocios
            </Text>
            <Text style={{ color: '#555', fontSize: '11px', margin: '4px 0 0' }}>
              Sinsajo Creators | screatorsai.com
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
