import type { Metadata } from 'next'
import { getAllPosts } from '@/lib/mdx'
import { HoverList } from '@/components/ui/hover-list'

export const metadata: Metadata = {
  title: 'Writing',
  description: 'Notes on building first versions: what belongs in one, and how a project starts.',
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function WritingPage() {
  const posts = getAllPosts('writing')

  return (
    <div className="mx-auto max-w-layout px-6 pt-16 md:px-8 md:pt-24">
      <header className="max-w-2xl">
        <h1 className="text-5xl font-semibold text-text-primary md:text-6xl">Writing</h1>
        <p className="mt-6 text-xl leading-relaxed text-text-primary">
          Short notes on building first versions.
        </p>
      </header>

      <div className="mt-14 max-w-3xl">
        <HoverList
          id="writing"
          items={posts.map((post) => ({
            href: `/writing/${post.slug}`,
            title: post.title,
            description: post.excerpt,
            meta: `${formatDate(post.date)}, ${post.readingTime}`,
          }))}
        />
      </div>
    </div>
  )
}
