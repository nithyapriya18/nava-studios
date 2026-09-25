/** @type {import('next').NextConfig} */
const nextConfig = {
  // Bundle next-mdx-remote with Next's own React, so MDX output on /writing
  // doesn't clash with the separately installed React copy.
  transpilePackages: ['next-mdx-remote'],
  async redirects() {
    return [
      { source: '/work', destination: '/products', permanent: false },
      { source: '/work/:slug', destination: '/products', permanent: false },
      { source: '/lab', destination: '/products', permanent: false },
      { source: '/lab/:slug', destination: '/products', permanent: false },
      { source: '/roast', destination: '/products/second-opinion', permanent: false },
      { source: '/review', destination: '/products/second-opinion', permanent: false },
      { source: '/products/landing-page-review', destination: '/products/second-opinion', permanent: false },
    ]
  },
}

export default nextConfig
