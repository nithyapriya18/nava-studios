export const siteConfig = {
  url: 'https://nithyapriya.com',
  name: 'Nava Studios',
  spoken: 'NAH-vuh',
  tagline: 'From idea to a first product you can use.',
  founder: 'Nithya',
  founderFull: 'Nithyapriya Veeraraghavan',
  title: 'Founder, Nava Studios',
  location: 'Bengaluru · working worldwide',
  availability: {
    available: true,
    bookedUntil: null as string | null,
  },
  calendlyUrl: 'https://calendly.com/[your-handle]',
  email: 'nava.blr@zohomail.in',
  linkedin: 'https://linkedin.com/in/[your-handle]',
  resumeFile: '/Nithyapriya-Veeraraghavan.pdf',
  showMarqueeStrip: false,
}

const calendlyReady = !siteConfig.calendlyUrl.includes('[')

const contactSubject = 'Nava Studios — a requirement'

const contactBody = `Hi Nithya,

I am interested in connecting with you about a requirement.

A short note on what I need:


Thanks`

export const contactHref = calendlyReady
  ? siteConfig.calendlyUrl
  : `mailto:${siteConfig.email}?subject=${encodeURIComponent(contactSubject)}&body=${encodeURIComponent(contactBody)}`

export const contactLabel = calendlyReady ? 'Book a call' : 'Get in touch'

export const contactIsExternal = calendlyReady

export const linkedinHref = siteConfig.linkedin.includes('[')
  ? null
  : siteConfig.linkedin
