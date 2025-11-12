import type { Metadata } from 'next'

/**
 * Base metadata for the XL Benefits site
 */
const BASE_URL = 'https://xlbenefits.com'
const SITE_NAME = 'XL Benefits'
const DEFAULT_IMAGE = '/images/og/default.png'

interface MetadataOptions {
  title: string
  description: string
  path?: string
  image?: string
  keywords?: string[]
  noindex?: boolean
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  author?: string
}

/**
 * Create standardized metadata for Next.js pages
 */
export function createMetadata(options: MetadataOptions): Metadata {
  const {
    title,
    description,
    path = '',
    image = DEFAULT_IMAGE,
    keywords = [],
    noindex = false,
    type = 'website',
    publishedTime,
    modifiedTime,
    author
  } = options

  const url = `${BASE_URL}${path}`
  const imageUrl = image.startsWith('http') ? image : `${BASE_URL}${image}`

  const metadata: Metadata = {
    title,
    description,
    keywords: [
      'stop-loss insurance',
      'self-funded health plans',
      'insurance brokers',
      'XL Benefits',
      ...keywords
    ].join(', '),
    alternates: {
      canonical: url
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl]
    }
  }

  // Add article-specific metadata
  if (type === 'article') {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: 'article',
      publishedTime,
      modifiedTime,
      authors: author ? [author] : undefined
    }
  }

  // Add noindex if specified
  if (noindex) {
    metadata.robots = {
      index: false,
      follow: false
    }
  }

  return metadata
}

/**
 * Create metadata for tool pages
 */
export function createToolMetadata(
  toolName: string,
  description: string,
  path: string
): Metadata {
  return createMetadata({
    title: `${toolName} | Free Stop-Loss Calculator | XL Benefits`,
    description: `${description} Free tool for insurance brokers. No login required.`,
    path,
    keywords: [toolName.toLowerCase(), 'calculator', 'tool', 'free']
  })
}

/**
 * Create metadata for resource pages (blog, white papers, etc.)
 */
export function createResourceMetadata(
  title: string,
  description: string,
  path: string,
  publishedDate?: string
): Metadata {
  return createMetadata({
    title: `${title} | XL Benefits Resources`,
    description,
    path,
    type: 'article',
    publishedTime: publishedDate,
    keywords: ['resources', 'education', 'stop-loss guide']
  })
}

/**
 * Create metadata for team member pages
 */
export function createTeamMetadata(
  name: string,
  title: string,
  bio: string,
  path: string
): Metadata {
  return createMetadata({
    title: `${name}, ${title} | XL Benefits Team`,
    description: bio.length > 160 ? bio.substring(0, 157) + '...' : bio,
    path,
    author: name,
    keywords: [name.toLowerCase(), 'team', 'expert', title.toLowerCase()]
  })
}