import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import {
  DevisData,
  buildDevisLines,
  computeTotal,
  formatEuro,
  CONTACT_INFO,
} from '@/lib/devis';

interface Props {
  data: DevisData;
}

export default function DevisNotificationEmail({ data }: Props) {
  const lines = buildDevisLines(data);
  const total = computeTotal(data);
  const subjectCompany = data.company ? ` — ${data.company}` : '';

  return (
    <Html>
      <Head />
      <Preview>Nouveau devis en ligne — {data.fullName}{subjectCompany}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={headerTitle}>Nouveau devis en ligne</Heading>
            <div style={yellowBar} />
          </Section>

          <Section style={content}>
            <Text style={label}>Nom complet</Text>
            <Text style={value}>{data.fullName}</Text>
            <Hr style={divider} />

            <Text style={label}>Email</Text>
            <Text style={value}>{data.email}</Text>
            <Hr style={divider} />

            {data.company && (
              <>
                <Text style={label}>Entreprise</Text>
                <Text style={value}>{data.company}</Text>
                <Hr style={divider} />
              </>
            )}

            {data.message && (
              <>
                <Text style={label}>Message libre</Text>
                <Text style={descriptionValue}>{data.message}</Text>
                <Hr style={divider} />
              </>
            )}

            <Heading style={sectionTitle}>Récapitulatif du devis</Heading>
            <Text style={meta}>
              Durée chantier : {data.months} mois
              {' • '}
              Caméras : {data.camerasUnknown ? 'non défini (1 par défaut)' : `${data.cameras}`}
              {' • '}
              Reportage complet : {data.reportageComplet ? 'oui' : 'non'}
              {' • '}
              Reportages complémentaires : {data.reportagesComplementaires}
            </Text>

            <table style={table}>
              {lines.map((line, i) => (
                <tr key={i}>
                  <td style={cellLabel}>
                    {line.label}
                    {line.detail && <div style={cellDetail}>{line.detail}</div>}
                  </td>
                  <td style={cellAmount}>{formatEuro(line.amount)}</td>
                </tr>
              ))}
              <tr>
                <td style={totalCellLabel}>TOTAL ESTIMÉ HT</td>
                <td style={totalCellAmount}>{formatEuro(total)}</td>
              </tr>
            </table>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              Notification automatique — formulaire Devis en ligne de {CONTACT_INFO.site}
            </Text>
            <Text style={footerSubtext}>
              {new Date().toLocaleString('fr-FR')}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#f5f5f5',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '0',
  maxWidth: '600px',
  border: '1px solid #e5e5e5',
};

const header = {
  backgroundColor: '#212125',
  padding: '32px 40px',
};

const headerTitle = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: '700',
  margin: '0 0 12px 0',
  lineHeight: '1.3',
};

const yellowBar = {
  width: '60px',
  height: '4px',
  backgroundColor: '#FACC15',
  borderRadius: '2px',
};

const content = {
  padding: '40px',
};

const label = {
  color: '#6b7280',
  fontSize: '12px',
  fontWeight: '600',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  margin: '0 0 8px 0',
};

const value = {
  color: '#1a1a1a',
  fontSize: '16px',
  fontWeight: '500',
  margin: '0 0 24px 0',
  lineHeight: '1.5',
};

const descriptionValue = {
  color: '#1a1a1a',
  fontSize: '15px',
  fontWeight: '400',
  margin: '0 0 24px 0',
  lineHeight: '1.6',
  whiteSpace: 'pre-wrap' as const,
};

const divider = {
  borderColor: '#e5e5e5',
  margin: '0 0 24px 0',
};

const sectionTitle = {
  color: '#212125',
  fontSize: '16px',
  fontWeight: '700',
  margin: '0 0 12px 0',
};

const meta = {
  color: '#6b7280',
  fontSize: '13px',
  margin: '0 0 16px 0',
  lineHeight: '1.5',
};

const table = {
  width: '100%',
  borderCollapse: 'collapse' as const,
};

const cellLabel = {
  padding: '12px 0',
  borderBottom: '1px solid #e5e5e5',
  color: '#1a1a1a',
  fontSize: '14px',
  fontWeight: '500',
  verticalAlign: 'top' as const,
};

const cellDetail = {
  color: '#6b7280',
  fontSize: '12px',
  fontWeight: '400',
  marginTop: '4px',
};

const cellAmount = {
  padding: '12px 0',
  borderBottom: '1px solid #e5e5e5',
  color: '#1a1a1a',
  fontSize: '14px',
  fontWeight: '600',
  textAlign: 'right' as const,
  whiteSpace: 'nowrap' as const,
};

const totalCellLabel = {
  padding: '16px 0 4px 0',
  color: '#212125',
  fontSize: '15px',
  fontWeight: '700',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
};

const totalCellAmount = {
  padding: '16px 0 4px 0',
  color: '#212125',
  fontSize: '18px',
  fontWeight: '800',
  textAlign: 'right' as const,
  whiteSpace: 'nowrap' as const,
};

const footer = {
  backgroundColor: '#f9fafb',
  padding: '24px 40px',
  borderTop: '1px solid #e5e5e5',
};

const footerText = {
  color: '#6b7280',
  fontSize: '13px',
  margin: '0 0 8px 0',
  lineHeight: '1.4',
};

const footerSubtext = {
  color: '#9ca3af',
  fontSize: '12px',
  margin: '0',
};
