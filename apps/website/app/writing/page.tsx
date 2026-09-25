import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts } from '@/lib/mdx'

export const metadata: Metadata = {
  title: 'Writing',
  description: 'Notes on scoping and building software products.',
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
          Notes on scoping and building software products, written for founders and
          business owners who are about to start one.
        </p>
      </header>

      <ul className="mt-14 grid max-w-4xl gap-5">
        {posts.map((post) => (
          <li key={post.slug} className="fade-up">
            <Link
              href={`/writing/${post.slug}`}
              className="group block rounded-3xl border border-border bg-card p-7 transition duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-[0_24px_48px_-28px_rgba(1,41,135,0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent md:p-8"
            >
              <p className="font-sans text-sm text-text-muted">
                {formatDate(post.date)}, {post.readingTime}
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-text-primary transition-colors group-hover:text-accent">
                {post.title}
              </h2>
              <p className="mt-2 max-w-2xl leading-relaxed text-text-muted">{post.excerpt}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
