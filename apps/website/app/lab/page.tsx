import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts } from '@/lib/mdx'
import { HoverList, type HoverListItem } from '@/components/ui/hover-list'

export const metadata: Metadata = {
  title: 'Lab',
  description: 'Apps Nithya built for her own use. They show how she works when she owns the brief.',
}

export default function LabPage() {
  const projects: HoverListItem[] = [
    {
      href: '/roast',
      title: 'Roast My Launch',
      description:
        "Paste a landing page or a pitch and get a short, blunt review in about 20 seconds. It's free.",
    },
    ...getAllPosts('work').map((post) => ({
      href: `/lab/${post.slug}`,
      title: post.title,
      description: post.excerpt,
    })),
  ]

  return (
    <div className="mx-auto max-w-layout px-6 pt-16 md:px-8 md:pt-24">
      <header className="max-w-2xl">
        <h1 className="text-5xl font-semibold text-text-primary md:text-6xl">Lab</h1>
        <p className="mt-6 text-xl leading-relaxed text-text-primary">
          Things I built for myself. They show how I work when I own the brief, and
          none of them are client projects.
        </p>
      </header>

      <div className="mt-14">
        <HoverList id="lab" items={projects} columns={2} />
      </div>

      <p className="mt-14 font-sans text-text-muted">
        Want a first version of your own idea?{' '}
        <Link href="/start" className="text-link">
          See how a project works
        </Link>
        .
      </p>
    </div>
  )
}
