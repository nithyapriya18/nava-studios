/** @type {import('next').NextConfig} */
const nextConfig = {
  // The monorepo's root .eslintrc.json + this app's resolved eslint-config-next
  // version hit a known circular-JSON bug in Next's build-time lint step.
  // Type safety is still enforced via `tsc --noEmit`; run `next lint` manually.
  eslint: { ignoreDuringBuilds: true },
}

export default nextConfig
