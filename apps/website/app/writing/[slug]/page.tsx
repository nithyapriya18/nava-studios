import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getAllPosts, getPostBySlug } from '@/lib/mdx'
import { contactHref, contactLabel, contactIsExternal } from '@/config'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllPosts('writing').map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const post = getPostBySlug('writing', slug)
    return { title: post.title, description: post.excerpt }
  } catch {
    return { title: 'Writing' }
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  let post
  try {
    post = getPostBySlug('writing', slug)
  } catch {
    notFound()
  }

  const date = new Date(post.date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const ctaProps = contactIsExternal
    ? { target: '_blank' as const, rel: 'noopener noreferrer' }
    : {}

  return (
    <article className="mx-auto max-w-content px-6 pt-12 md:px-8 md:pt-16">
      <Link href="/writing" className="font-sans text-[0.9375rem] text-link">
        All writing
      </Link>

      <header className="mt-10 border-b border-border pb-8">
        <h1 className="text-4xl font-semibold text-text-primary md:text-5xl">{post.title}</h1>
        <p className="mt-4 font-sans text-sm text-text-muted">
          <time dateTime={post.date}>{date}</time>, {post.readingTime}
        </p>
      </header>

      <div className="prose pt-8">
        <MDXRemote source={post.content} />
      </div>

      <aside className="mt-12 rounded-3xl bg-surface p-6 md:p-8">
        <p className="font-sans text-lg font-medium text-text-primary">
          Have an idea for a first version?
        </p>
        <p className="mt-1 text-text-muted">Send me a few lines about it.</p>
        <a href={contactHref} className="btn-primary mt-5" {...ctaProps}>
          {contactLabel}
        </a>
      </aside>
    </article>
  )
}
