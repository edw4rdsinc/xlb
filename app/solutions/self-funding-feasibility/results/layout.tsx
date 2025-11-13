import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Self-Funding Readiness Assessment Results | XL Benefits',
  description: 'View your personalized self-funding readiness assessment results. Get detailed insights on your organization\'s financial readiness, risk tolerance, and administrative infrastructure for self-funded health insurance.',
  openGraph: {
    title: 'Self-Funding Readiness Assessment Results | XL Benefits',
    description: 'View your personalized self-funding readiness assessment results. Get detailed insights on financial readiness, risk tolerance, and administrative infrastructure for self-funded health insurance.',
    type: 'website',
    url: 'https://xlbenefits.com/solutions/self-funding-feasibility/results',
    images: [
      {
        url: '/images/og/self-funding-readiness-assessment.png',
        width: 1200,
        height: 630,
        alt: 'Self-Funding Readiness Assessment Results',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Self-Funding Readiness Assessment Results | XL Benefits',
    description: 'View your personalized self-funding readiness assessment results and get expert recommendations.',
    images: ['/images/og/self-funding-readiness-assessment.png'],
  },
}

export default function ResultsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
