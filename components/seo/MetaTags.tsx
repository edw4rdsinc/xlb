import Head from 'next/head'

interface MetaTagsProps {
  title: string
  description: string
  pageType?: 'standard' | 'white-paper' | 'state-guide'
  canonical?: string
}

export default function MetaTags({
  title,
  description,
  pageType = 'standard',
  canonical,
}: MetaTagsProps) {
  const fullTitle = `${title} | XL Benefits`
  const robotsContent = pageType === 'white-paper' || pageType === 'state-guide'
    ? 'max-snippet:-1, index, follow'
    : 'index, follow'

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robotsContent} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      {canonical && <link rel="canonical" href={canonical} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
  )
}
