import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Stop-Loss Insurance Glossary | XL Benefits',
  description: 'Comprehensive glossary of stop-loss insurance, self-funding, and reinsurance terms. Definitions for brokers covering FIE rates, specific deductibles, aggregate corridors, and more.',
  openGraph: {
    title: 'Stop-Loss Insurance Glossary | XL Benefits',
    description: 'Complete reference guide for stop-loss insurance, self-funding, and reinsurance terminology. Essential definitions for brokers.',
    type: 'website',
    url: 'https://xlbenefits.com/resources/glossary',
    images: [
      {
        url: '/images/og-glossary.jpg',
        width: 1200,
        height: 630,
        alt: 'Stop-Loss Insurance Glossary',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stop-Loss Insurance Glossary | XL Benefits',
    description: 'Comprehensive stop-loss and self-funding terminology reference for insurance brokers.',
    images: ['/images/og-glossary.jpg'],
  },
}

export default function GlossaryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
