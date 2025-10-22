import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const inter = Inter({ subsets: ['latin'] })

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://xlbenefits.com'),
  title: {
    default: 'XL Benefits | Stop-Loss Insurance Expertise for Brokers',
    template: '%s | XL Benefits',
  },
  description: 'Interactive tools and expert guidance to help insurance brokers navigate stop-loss challenges. COBRA calculators, deductible analysis, and self-funding assessments.',
  keywords: ['stop-loss insurance', 'self-funding', 'insurance brokers', 'COBRA calculator', 'deductible analysis', 'FIE calculator', 'medical stop-loss', 'reinsurance'],
  authors: [{ name: 'XL Benefits' }],
  creator: 'XL Benefits',
  publisher: 'XL Benefits',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://xlbenefits.com',
    siteName: 'XL Benefits',
    title: 'XL Benefits | Stop-Loss Insurance Expertise for Brokers',
    description: 'Interactive tools and expert guidance to help insurance brokers navigate stop-loss challenges.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'XL Benefits | Stop-Loss Insurance Expertise',
    description: 'Expert guidance and tools for insurance brokers navigating stop-loss challenges.',
  },
  verification: {
    // Add Google Search Console verification here when available
    // google: 'your-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script async src="https://plausible.io/js/pa-bvHO7XghmXJAaTSsTrJEL.js"></script>
        <script dangerouslySetInnerHTML={{__html: `window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init()`}}></script>
      </head>
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
