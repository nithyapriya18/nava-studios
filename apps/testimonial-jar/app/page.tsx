import type { Metadata } from 'next'
import { ToolShell } from '@nava-studios/ui'
import { TestimonialJarApp } from '@/components/TestimonialJarApp'

export const metadata: Metadata = {
  title: "Testimonial Jar",
  description: "Collect testimonials with one link, show them with one embed.",
}

export default function Page() {
  return (
    <>
      <ToolShell slug="testimonial-jar">
        <TestimonialJarApp />
      </ToolShell>
    </>
  )
}
