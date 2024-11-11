import './globals.css'
import type { Metadata } from 'next'
import { Montserrat, Lora } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'

const montserrat = Montserrat({ 
  subsets: ['latin'], 
  variable: '--font-montserrat' 
})

const lora = Lora({ 
  subsets: ['latin'], 
  variable: '--font-lora' 
})

export const metadata: Metadata = {
  title: 'Medical D4 Assessments',
  description: 'Affordable medical assessments for drivers nationwide, including eye tests.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${montserrat.className} ${montserrat.variable} ${lora.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
          storageKey="medicald4-theme"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}