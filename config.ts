export const siteConfig = {
  name: 'Verity Studios',
  tagline: 'I take your idea from messy to working.',
  availability: {
    available: true,
    bookedUntil: null as string | null, // Set to "May 2026" when booked out
  },
  calendlyUrl: 'https://calendly.com/[your-handle]',
  email: 'nithyapriya1808@gmail.com',
  linkedin: 'https://linkedin.com/in/[your-handle]',
  currentlyBuilding: 'A GST Calculator for Indian businesses',
  showMarqueeStrip: true,
  // Where the standalone apps run. Local ports for testing; replace with
  // deployed URLs (e.g. https://easycook.vercel.app) when they go live.
  appLinks: {
    easycook: 'http://localhost:3001',
    snugglefox: 'http://localhost:3002',
  },
}
