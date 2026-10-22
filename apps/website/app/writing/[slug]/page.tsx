import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getAllPosts, getPostBySlug } from '@/lib/mdx'
import { siteConfig, contactHref, contactLabel, contactIsExternal } from '@/config'
import { reviewHref } from '@/lib/products'
import { Arrow } from '@/components/pen'
import { Comments } from '@/components/comments'

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

  const date = new Date(post.date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const ctaProps = contactIsExternal
    ? { target: '_blank' as const, rel: 'noopener noreferrer' }
    : {}
  const readNext = getAllPosts('writing')
    .filter((p) => p.slug !== slug)
    .slice(0, 2)

  return (
    <>
      <article className="article" style={{ padding: '64px 0 24px' }}>
        <p style={{ margin: '0 0 40px' }}>
          <Link href="/writing" className="more" style={{ fontSize: 15 }}>
            <span aria-hidden>←</span> All writing
          </Link>
        </p>
        <p className="label" style={{ margin: '0 0 18px' }}>
          <time dateTime={post.date}>{date}</time> · {post.readingTime}
        </p>
        <h1 className="display" style={{ fontSize: 'clamp(40px, 5.4vw, 60px)', marginBottom: 26 }}>
          {post.title}
        </h1>
        <div
          className="byline"
          style={{ marginBottom: 44, paddingBottom: 28, borderBottom: '1px solid var(--rule)' }}
        >
          <span className="avatar" style={{ width: 38, height: 38 }}>
            <Image src="/nithya.jpeg" alt="" fill sizes="38px" className="object-cover" />
          </span>
          <span style={{ fontSize: 15 }}>
            {siteConfig.founderFull} <span className="muted">· {siteConfig.name}</span>
          </span>
        </div>

        <div className="prose">
          <MDXRemote source={post.content} />
        </div>

        <p
          className="muted"
          style={{ fontSize: 14, marginTop: 36, paddingTop: 20, borderTop: '1px solid var(--rule)' }}
        >
          AI tools help me draft these posts. I edit them, and the views are my own.
        </p>
      </article>

      <aside className="article" style={{ marginTop: 28 }} aria-labelledby="cta-h">
        <div className="aside band-card" style={{ padding: 32, gap: 16 }}>
          <span className="hand">if you’ve got an idea like this</span>
          <h2 id="cta-h" className="h2" style={{ fontSize: 32 }}>
            Have an idea you want <em>built?</em>
          </h2>
          <p className="muted">
            I design and build software for founders and small businesses, for a fixed price agreed before
            work starts.
          </p>
          <div className="btns">
            <a href={contactHref} className="btn-primary" {...ctaProps}>
              {contactLabel} <Arrow />
            </a>
            <Link href={reviewHref} className="more">
              Try Second Opinion <Arrow />
            </Link>
          </div>
        </div>
      </aside>

      {readNext.length > 0 && (
        <nav className="article" style={{ marginTop: 64 }} aria-labelledby="more-h">
          <p id="more-h" className="label" style={{ marginBottom: 8 }}>
            Read next
          </p>
          <div className="posts">
            {readNext.map((p) => (
              <Link key={p.slug} href={`/writing/${p.slug}`} className="post short">
                <span className="post-t">{p.title}</span>
                <span className="muted" style={{ fontSize: 14 }}>
                  {p.readingTime.replace(' read', '')}
                </span>
              </Link>
            ))}
          </div>
        </nav>
      )}

      <div className="article" style={{ paddingBottom: 48 }}>
        <Comments slug={slug} />
      </div>
    </>
  )
}
