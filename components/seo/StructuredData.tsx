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

interface BreadcrumbDataProps {
  type: 'breadcrumb'
  items: Array<{
    name: string
    url: string
  }>
}

interface ServiceDataProps {
  type: 'service'
  name: string
  description: string
  provider?: string
}

interface SoftwareAppDataProps {
  type: 'software'
  name: string
  description: string
  category: string
}

type StructuredDataProps =
  | OrganizationDataProps
  | ArticleDataProps
  | FAQDataProps
  | HowToDataProps
  | BreadcrumbDataProps
  | ServiceDataProps
  | SoftwareAppDataProps

export default function StructuredData(props: StructuredDataProps) {
  let structuredData: any = {}

  switch (props.type) {
    case 'organization':
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'XL Benefits',
        url: process.env.NEXT_PUBLIC_SITE_URL || 'https://xlbenefits.com',
        description: 'Stop-Loss Insurance Expertise for Brokers - Interactive tools and expert guidance to help insurance brokers navigate stop-loss challenges.',
        logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://xlbenefits.com'}/images/logos/xl-benefits-logo.png`,
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'Customer Service',
          url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://xlbenefits.com'}/contact`,
        },
        sameAs: [],
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'US',
        },
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

    case 'breadcrumb':
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: props.items.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      }
      break

    case 'service':
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: props.name,
        description: props.description,
        provider: {
          '@type': 'Organization',
          name: props.provider || 'XL Benefits',
        },
      }
      break

    case 'software':
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: props.name,
        description: props.description,
        applicationCategory: props.category,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
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
