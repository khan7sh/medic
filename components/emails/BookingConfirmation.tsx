import {
  Html,
  Body,
  Container,
  Text,
  Link,
  Preview,
  Section,
  Heading,
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
          <Heading style={h1}>Booking Confirmation</Heading>
          
          <Text style={text}>Dear {customerName},</Text>
          
          <Text style={text}>
            Thank you for booking your medical assessment. Here are your booking details:
          </Text>

          <Section style={details}>
            <Text style={detailRow}>
              <strong>Service:</strong> {serviceName}
            </Text>
            <Text style={detailRow}>
              <strong>Location:</strong> {location}
            </Text>
            <Text style={detailRow}>
              <strong>Date:</strong> {date}
            </Text>
            <Text style={detailRow}>
              <strong>Time:</strong> {time}
            </Text>
            <Text style={detailRow}>
              <strong>Price:</strong> £{price}
            </Text>
            <Text style={detailRow}>
              <strong>Payment Method:</strong> {paymentMethod}
            </Text>
            <Text style={detailRow}>
              <strong>Payment Status:</strong> {paymentStatus}
            </Text>
          </Section>

          <Text style={text}>
            If you need to make any changes to your booking or have any questions, 
            please contact us at{' '}
            <Link href="mailto:support@example.com">support@example.com</Link>
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export default BookingConfirmationEmail

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '580px',
}

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '1.25',
  marginBottom: '24px',
}

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '1.5',
  marginBottom: '16px',
}

const details = {
  backgroundColor: '#f9f9f9',
  borderRadius: '4px',
  padding: '20px',
  marginBottom: '24px',
}

const detailRow = {
  margin: '8px 0',
} 