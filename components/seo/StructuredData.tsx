import Script from 'next/script'

interface OrganizationDataProps {
  type: 'organization'
}

interface ArticleDataProps {
  type: 'article'
  headline: string
  datePublished: string
  dateModified?: string
  author: string
}

interface FAQDataProps {
  type: 'faq'
  questions: Array<{
    question: string
    answer: string
  }>
}

interface HowToDataProps {
  type: 'howto'
  name: string
  description: string
  steps: Array<{
    name: string
    text: string
  }>
}

type StructuredDataProps = OrganizationDataProps | ArticleDataProps | FAQDataProps | HowToDataProps

export default function StructuredData(props: StructuredDataProps) {
  let structuredData: any = {}

  switch (props.type) {
    case 'organization':
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'XL Benefits',
        url: process.env.NEXT_PUBLIC_SITE_URL || 'https://xlbenefits.com',
        description: 'Stop-Loss Insurance Expertise for Brokers',
        logo: `${process.env.NEXT_PUBLIC_SITE_URL}/images/logos/xl-benefits-logo.png`,
      }
      break

    case 'article':
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: props.headline,
        datePublished: props.datePublished,
        dateModified: props.dateModified || props.datePublished,
        author: {
          '@type': 'Person',
          name: props.author,
        },
      }
      break

    case 'faq':
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: props.questions.map((q) => ({
          '@type': 'Question',
          name: q.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: q.answer,
          },
        })),
      }
      break

    case 'howto':
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: props.name,
        description: props.description,
        step: props.steps.map((step, index) => ({
          '@type': 'HowToStep',
          position: index + 1,
          name: step.name,
          text: step.text,
        })),
      }
      break
  }

  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
