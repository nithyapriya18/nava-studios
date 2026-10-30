const STUDIO = 'https://studionpv.com'

// Until October 2026 the studio site lived on this domain. Its pages now live
// on studionpv.com, so old links and search results land in the right place.
// `:path*` also matches the bare path, so '/writing/:path*' covers /writing.
const STUDIO_PATHS = [
  '/start',
  '/contact',
  '/products/:path*',
  '/writing/:path*',
  '/comments/:path*',
  '/support',
  '/privacy',
  '/terms',
  '/refunds',
  '/roast',
  '/review',
  '/work/:path*',
  '/lab/:path*',
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      ...STUDIO_PATHS.map((source) => ({
        source,
        destination: `${STUDIO}${source}`,
        permanent: false,
      })),
      // This whole site is the about page now.
      { source: '/about', destination: '/', permanent: true },
      { source: '/resume', destination: '/Nithyapriya-Veeraraghavan.pdf', permanent: false },
      { source: '/linkedin', destination: 'https://linkedin.com/in/npv', permanent: false },
    ]
  },
}

export default nextConfig
