import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/admin',
          '/test-*',
          '/fantasy-football/',
          '/fantasy-football',
        ],
      },
    ],
    sitemap: 'https://xlbenefits.com/sitemap.xml',
  }
}
