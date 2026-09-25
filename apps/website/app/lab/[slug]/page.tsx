import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getAllPosts, getPostBySlug } from '@/lib/mdx'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllPosts('work').map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const post = getPostBySlug('work', slug)
    return { title: post.title, description: post.excerpt }
  } catch {
    return { title: 'Lab' }
  }
}

export default async function LabItemPage({ params }: Props) {
  const { slug } = await params
  let post
  try {
    post = getPostBySlug('work', slug)
  } catch {
    notFound()
  }

  return (
    <article className="mx-auto max-w-content px-6 pt-12 md:px-8 md:pt-16">
      <Link href="/lab" className="font-sans text-[0.9375rem] text-link">
        Back to the lab
      </Link>

      <header className="mt-10 border-b border-border pb-8">
        <p className="font-sans text-sm text-text-muted">Personal project</p>
        <h1 className="mt-2 text-4xl font-semibold text-text-primary md:text-5xl">
          {post.title}
        </h1>
        <p className="mt-4 text-xl leading-relaxed text-text-muted">{post.excerpt}</p>
      </header>

      <div className="prose pt-8">
        <MDXRemote source={post.content} />
      </div>
    </article>
  )
}
