/** @type {import('next').NextConfig} */
const nextConfig = {
  // Bundle next-mdx-remote with Next's own React, so MDX output on /writing
  // doesn't clash with the separately installed React copy.
  transpilePackages: ['next-mdx-remote'],
  async redirects() {
    return [
      { source: '/products/:slug', destination: '/', permanent: false },
      { source: '/work', destination: '/review', permanent: false },
      { source: '/work/:slug', destination: '/review', permanent: false },
      { source: '/lab', destination: '/review', permanent: false },
      { source: '/lab/:slug', destination: '/review', permanent: false },
      { source: '/roast', destination: '/review', permanent: true },
    ]
  },
}

export default nextConfig
