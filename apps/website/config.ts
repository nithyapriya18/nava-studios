export const siteConfig = {
  url: 'https://studionpv.com',
  name: 'Studio NPV',
  tagline: "Have an idea? Let's build it.",
  description:
    'Studio NPV designs and builds software for founders and small businesses: new products, customer-facing apps and internal tools, for a fixed price agreed before work starts.',
  founder: 'Nithya',
  founderFull: 'Nithyapriya Veeraraghavan',
  title: 'Founder, Studio NPV',
  location: 'Bengaluru',
  calendlyUrl: 'https://calendly.com/[your-handle]',
  email: 'studio.npv@outlook.com',
  linkedin: 'https://linkedin.com/in/npv',
  resumeFile: '/Nithyapriya-Veeraraghavan.pdf',
  // My own profile, resume and career live on my personal site.
  profileUrl: 'https://www.nithyapriya.com',
}

const calendlyReady = !siteConfig.calendlyUrl.includes('[')

// Until a calendar link exists, every "Get in touch" button goes to the
// contact form on /contact, which emails the message to me.
export const contactHref = calendlyReady ? siteConfig.calendlyUrl : '/contact'

export const contactLabel = calendlyReady ? 'Book a call' : 'Get in touch'

export const contactIsExternal = calendlyReady

export const mailtoHref = `mailto:${siteConfig.email}`

export const linkedinHref = siteConfig.linkedin.includes('[')
  ? null
  : siteConfig.linkedin
