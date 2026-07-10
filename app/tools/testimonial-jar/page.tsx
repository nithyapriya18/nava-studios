import type { Metadata } from 'next'
import { ToolShell } from '@/apps/getpaid/components/ToolShell'
import { TestimonialJarApp } from '@/apps/tools/TestimonialJarApp'

export const metadata: Metadata = {
  title: 'Testimonial Jar — collect and show social proof',
  description:
    'One link to collect testimonials, one embed to show them. Social proof without a monthly platform.',
}

export default function TestimonialJarPage() {
  return (
    <ToolShell slug="testimonial-jar">
      <TestimonialJarApp />
    </ToolShell>
  )
}
