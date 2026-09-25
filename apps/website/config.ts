export const siteConfig = {
  url: 'https://nithyapriya.com',
  name: 'Nava Studios',
  spoken: 'NAH-vuh',
  tagline: 'I build the first version of your product.',
  description:
    'Nava Studios is Nithya, a one-person product studio in Bengaluru. Bring an idea and I build the first version your team can use.',
  founder: 'Nithya',
  founderFull: 'Nithyapriya Veeraraghavan',
  title: 'Founder, Nava Studios',
  location: 'Bengaluru',
  calendlyUrl: 'https://calendly.com/[your-handle]',
  email: 'nava.blr@zohomail.in',
  linkedin: 'https://linkedin.com/in/npv',
  resumeFile: '/Nithyapriya-Veeraraghavan.pdf',
}

const calendlyReady = !siteConfig.calendlyUrl.includes('[')

const contactSubject = 'An idea for a first version'

const contactBody = `Hi Nithya,

Here's what I want to build:


Who it's for:


Thanks`

export const contactHref = calendlyReady
  ? siteConfig.calendlyUrl
  : `mailto:${siteConfig.email}?subject=${encodeURIComponent(contactSubject)}&body=${encodeURIComponent(contactBody)}`

// The button says what it does: books a call once a calendar exists,
// opens an email until then.
export const contactLabel = calendlyReady ? 'Book a call' : 'Email me'

export const contactIsExternal = calendlyReady

export const linkedinHref = siteConfig.linkedin.includes('[')
  ? null
  : siteConfig.linkedin
