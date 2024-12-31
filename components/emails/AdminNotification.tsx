import {
  Html,
  Body,
  Container,
  Text,
  Link,
  Preview,
  Section,
  Heading,
  Hr,
  Row,
  Column,
} from '@react-email/components'

interface AdminNotificationEmailProps {
  customerName: string
  serviceName: string
  location: string
  date: string
  time: string
  price: string
  email: string
  paymentStatus: string
}

const AdminNotificationEmail = ({
  customerName,
  serviceName,
  location,
  date,
  time,
  price,
  email,
  paymentStatus,
}: AdminNotificationEmailProps) => {
  return (
    <Html>
      <Preview>New Booking: {serviceName} - {customerName}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={logo}>MedicalD4 Admin</Heading>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Heading style={h1}>New Booking Received</Heading>
            
            <Text style={text}>
              A new booking has been made with the following details:
            </Text>

            {/* Customer Details */}
            <Section style={details}>
              <Heading as="h2" style={h2}>Customer Details</Heading>
              <Row style={detailRow}>
                <Column style={detailLabel}>Name:</Column>
                <Column style={detailValue}>{customerName}</Column>
              </Row>
              <Row style={detailRow}>
                <Column style={detailLabel}>Email:</Column>
                <Column style={detailValue}>
                  <Link href={`mailto:${email}`} style={link}>
                    {email}
                  </Link>
                </Column>
              </Row>
            </Section>

            {/* Appointment Details */}
            <Section style={details}>
              <Heading as="h2" style={h2}>Appointment Details</Heading>
              <Row style={detailRow}>
                <Column style={detailLabel}>Service:</Column>
                <Column style={detailValue}>{serviceName}</Column>
              </Row>
              <Row style={detailRow}>
                <Column style={detailLabel}>Location:</Column>
                <Column style={detailValue}>{location}</Column>
              </Row>
              <Row style={detailRow}>
                <Column style={detailLabel}>Date:</Column>
                <Column style={detailValue}>{date}</Column>
              </Row>
              <Row style={detailRow}>
                <Column style={detailLabel}>Time:</Column>
                <Column style={detailValue}>{time}</Column>
              </Row>
            </Section>

            {/* Payment Details */}
            <Section style={receipt}>
              <Heading as="h2" style={h2}>Payment Details</Heading>
              <Row style={detailRow}>
                <Column style={detailLabel}>Amount:</Column>
                <Column style={detailValue}>£{price}</Column>
              </Row>
              <Row style={detailRow}>
                <Column style={detailLabel}>Status:</Column>
                <Column style={detailValue}>
                  <Text style={{
                    ...statusBadge,
                    backgroundColor: paymentStatus.toLowerCase() === 'paid' ? '#dcfce7' : '#fee2e2',
                    color: paymentStatus.toLowerCase() === 'paid' ? '#166534' : '#991b1b',
                  }}>
                    {paymentStatus}
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* Actions */}
            <Section style={actions}>
              <Link 
                href="https://medicald4.com/appointed/bookings" 
                style={actionButton}
              >
                View in Dashboard
              </Link>
              <Link 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`}
                style={{ ...actionButton, backgroundColor: '#4b5563' }}
              >
                View Location
              </Link>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              © {new Date().getFullYear()} MedicalD4. All rights reserved.
            </Text>
            <Text style={footerText}>
              This is an automated message, please do not reply directly.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '600px',
}

const header = {
  padding: '24px',
  textAlign: 'center' as const,
  backgroundColor: '#1e293b',
  borderRadius: '8px',
}

const logo = {
  color: '#ffffff',
  fontSize: '32px',
  fontWeight: '700',
  margin: '0',
}

const content = {
  padding: '20px',
}

const h1 = {
  color: '#1e293b',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '1.25',
  marginBottom: '24px',
  textAlign: 'center' as const,
}

const h2 = {
  color: '#1e293b',
  fontSize: '18px',
  fontWeight: '600',
  lineHeight: '1.25',
  marginBottom: '16px',
}

const text = {
  color: '#4b5563',
  fontSize: '16px',
  lineHeight: '1.5',
  marginBottom: '16px',
}

const details = {
  backgroundColor: '#f8fafc',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '24px',
}

const receipt = {
  backgroundColor: '#f8fafc',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '24px',
}

const detailRow = {
  marginBottom: '8px',
}

const detailLabel = {
  color: '#64748b',
  width: '40%',
  paddingRight: '12px',
}

const detailValue = {
  color: '#1e293b',
  width: '60%',
  fontWeight: '500',
}

const link = {
  color: '#2563eb',
  textDecoration: 'underline',
}

const statusBadge = {
  display: 'inline-block',
  padding: '4px 12px',
  borderRadius: '9999px',
  fontSize: '14px',
  fontWeight: '500',
}

const actions = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '12px',
  marginTop: '32px',
}

const actionButton = {
  display: 'inline-block',
  backgroundColor: '#2563eb',
  color: '#ffffff',
  padding: '12px 24px',
  borderRadius: '6px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  fontSize: '16px',
  fontWeight: '500',
}

const footer = {
  textAlign: 'center' as const,
  padding: '24px',
  backgroundColor: '#f8fafc',
  borderRadius: '8px',
}

const footerText = {
  color: '#64748b',
  fontSize: '14px',
  margin: '4px 0',
}

export default AdminNotificationEmail 