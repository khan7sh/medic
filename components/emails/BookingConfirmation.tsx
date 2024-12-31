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

interface BookingConfirmationEmailProps {
  customerName: string
  serviceName: string
  location: string
  date: string
  time: string
  price: string
  paymentMethod: string
  paymentStatus: string
}

const BookingConfirmationEmail = ({
  customerName,
  serviceName,
  location,
  date,
  time,
  price,
  paymentMethod,
  paymentStatus,
}: BookingConfirmationEmailProps) => {
  return (
    <Html>
      <Preview>Your medical assessment booking confirmation</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={logo}>MedicalD4</Heading>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Heading style={h1}>Booking Confirmation</Heading>
            
            <Text style={text}>Dear {customerName},</Text>
            
            <Text style={text}>
              Thank you for booking your medical assessment with MedicalD4. Your appointment has been confirmed with the following details:
            </Text>

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

            {/* Receipt */}
            <Section style={receipt}>
              <Heading as="h2" style={h2}>Payment Receipt</Heading>
              <Row style={detailRow}>
                <Column style={detailLabel}>Service Fee:</Column>
                <Column style={detailValue}>£{price}</Column>
              </Row>
              <Hr style={hr} />
              <Row style={detailRow}>
                <Column style={detailLabel}>Total Paid:</Column>
                <Column style={detailValue}>£{price}</Column>
              </Row>
              <Row style={detailRow}>
                <Column style={detailLabel}>Payment Method:</Column>
                <Column style={detailValue}>{paymentMethod}</Column>
              </Row>
              <Row style={detailRow}>
                <Column style={detailLabel}>Payment Status:</Column>
                <Column style={detailValue}>{paymentStatus}</Column>
              </Row>
            </Section>

            {/* Location Details */}
            <Section style={locationInfo}>
              <Heading as="h2" style={h2}>Clinic Location</Heading>
              <Text style={text}>
                Your appointment is at our {location} clinic. Please arrive 10 minutes before your scheduled time and bring a valid form of ID.
              </Text>
              <Link 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`}
                style={{ ...link, ...mapButton }}
              >
                View on Google Maps
              </Link>
            </Section>

            {/* Contact Info */}
            <Section style={contact}>
              <Text style={text}>
                If you need to make any changes to your booking or have any questions, 
                please contact us at{' '}
                <Link href="mailto:info@medicald4.com" style={link}>
                  info@medicald4.com
                </Link>
                {' '}or call us at 07415788851.
              </Text>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              © {new Date().getFullYear()} MedicalD4. All rights reserved.
            </Text>
            <Text style={footerText}>
              17 Emery Avenue, Newcastle Under Lyme, Staffordshire ST5 2JG
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
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
}

const logo = {
  color: '#0066cc',
  fontSize: '32px',
  fontWeight: '700',
  margin: '0',
}

const content = {
  padding: '20px',
}

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '1.25',
  marginBottom: '24px',
  textAlign: 'center' as const,
}

const h2 = {
  color: '#444',
  fontSize: '18px',
  fontWeight: '600',
  lineHeight: '1.25',
  marginBottom: '16px',
}

const text = {
  color: '#444',
  fontSize: '16px',
  lineHeight: '1.5',
  marginBottom: '16px',
}

const details = {
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '24px',
}

const receipt = {
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '24px',
}

const locationInfo = {
  marginBottom: '24px',
}

const contact = {
  marginBottom: '24px',
}

const detailRow = {
  marginBottom: '8px',
}

const detailLabel = {
  color: '#666',
  width: '40%',
  paddingRight: '12px',
}

const detailValue = {
  color: '#333',
  width: '60%',
  fontWeight: '500',
}

const link = {
  color: '#0066cc',
  textDecoration: 'underline',
}

const hr = {
  borderTop: '1px solid #ddd',
  margin: '12px 0',
}

const footer = {
  textAlign: 'center' as const,
  padding: '24px',
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
}

const footerText = {
  color: '#666',
  fontSize: '14px',
  margin: '4px 0',
}

const mapButton = {
  display: 'inline-block',
  backgroundColor: '#0066cc',
  color: '#ffffff',
  padding: '10px 20px',
  borderRadius: '6px',
  textDecoration: 'none',
  marginTop: '12px',
}

export default BookingConfirmationEmail 