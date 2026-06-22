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

export default function DevisConfirmationEmail({ data }: Props) {
  const lines = buildDevisLines(data);
  const total = computeTotal(data);

  return (
    <Html>
      <Head />
      <Preview>Votre estimation Chantier Film — {data.fullName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={headerTitle}>Votre estimation Chantier Film</Heading>
            <div style={yellowBar} />
          </Section>

          <Section style={content}>
            <Text style={intro}>
              Bonjour {data.fullName.split(' ')[0]},
            </Text>
            <Text style={intro}>
              Merci pour votre demande. Voici le récapitulatif de votre estimation.
              Notre équipe vous contactera dans les 48h ouvrées pour affiner ce devis
              et répondre à vos questions.
            </Text>

            <Heading style={sectionTitle}>Détail de votre estimation</Heading>
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

            <Text style={disclaimer}>
              Estimation indicative HT. Un devis personnalisé vous sera envoyé par mail.
            </Text>

            {data.message && (
              <>
                <Heading style={sectionTitle}>Votre message</Heading>
                <Text style={messageText}>{data.message}</Text>
              </>
            )}
          </Section>

          <Section style={footer}>
            <Text style={footerTitle}>Chantier Film</Text>
            <Text style={footerText}>{CONTACT_INFO.phone}</Text>
            <Text style={footerText}>{CONTACT_INFO.email}</Text>
            <Text style={footerText}>{CONTACT_INFO.address}</Text>
            <Text style={footerSubtext}>{CONTACT_INFO.site}</Text>
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
  fontSize: '22px',
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

const intro = {
  color: '#1a1a1a',
  fontSize: '15px',
  fontWeight: '400',
  margin: '0 0 16px 0',
  lineHeight: '1.6',
};

const sectionTitle = {
  color: '#212125',
  fontSize: '16px',
  fontWeight: '700',
  margin: '24px 0 12px 0',
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

const disclaimer = {
  color: '#6b7280',
  fontSize: '12px',
  fontStyle: 'italic' as const,
  margin: '8px 0 0 0',
};

const messageText = {
  color: '#1a1a1a',
  fontSize: '14px',
  fontWeight: '400',
  margin: '0',
  lineHeight: '1.6',
  whiteSpace: 'pre-wrap' as const,
};

const footer = {
  backgroundColor: '#f9fafb',
  padding: '24px 40px',
  borderTop: '1px solid #e5e5e5',
};

const footerTitle = {
  color: '#212125',
  fontSize: '15px',
  fontWeight: '700',
  margin: '0 0 8px 0',
};

const footerText = {
  color: '#6b7280',
  fontSize: '13px',
  margin: '0 0 4px 0',
  lineHeight: '1.4',
};

const footerSubtext = {
  color: '#9ca3af',
  fontSize: '12px',
  margin: '8px 0 0 0',
};
