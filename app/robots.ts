import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/hanna/dashboard',
          '/hanna/profile',
          '/hanna/billing',
          '/hanna/upgrade',
          '/unauthorized',
        ],
      },
    ],
    sitemap: 'https://www.screatorsai.com/sitemap.xml',
  }
}
