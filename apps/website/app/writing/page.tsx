import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts, type Post } from '@/lib/mdx'
import { Generate } from '@/components/generate'
import { HoverGroup } from '@/components/hover-group'

export const metadata: Metadata = {
  title: 'Writing',
  description: 'Notes on scoping and building software products.',
}

// Posts for someone about to start a project; everything else is about
// building with AI.
const BEFORE_YOU_BUILD = new Set(['what-i-need-from-the-first-call', 'what-belongs-in-a-first-version'])

function shortDate(date: string) {
  return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function PostList({ posts }: { posts: Post[] }) {
  return (
    <HoverGroup items="a.post" bleed={16}>
      <div className="posts">
        {posts.map((post) => (
          <Link key={post.slug} href={`/writing/${post.slug}`} className="post">
            <span className="muted num" style={{ fontSize: 14 }}>
              {shortDate(post.date)}
            </span>
            <span style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span className="post-t">{post.title}</span>
              <span className="muted" style={{ fontSize: 16 }}>
                {post.excerpt}
              </span>
            </span>
            <span className="muted" style={{ fontSize: 14 }}>
              {post.readingTime.replace(' read', '')}
            </span>
          </Link>
        ))}
      </div>
    </HoverGroup>
  )
}

export default function WritingPage() {
  const posts = getAllPosts('writing')
  // Oldest first, so the posts read in the order a project runs.
  const before = posts.filter((p) => BEFORE_YOU_BUILD.has(p.slug)).reverse()
  const ai = posts.filter((p) => !BEFORE_YOU_BUILD.has(p.slug))

  return (
    <>
      <section className="band page-head">
        <p className="label">Writing</p>
        <h1 className="display">
          <Generate>
            <em>Notes</em> from the margin
          </Generate>
        </h1>
        <p className="lede" style={{ maxWidth: '52ch' }}>
          Notes on scoping and building software products, written for founders and business owners who
          are about to start one.
        </p>
      </section>

      {before.length > 0 && (
        <section className="section" aria-labelledby="before-h">
          <div className="rail">
            <p className="label" id="before-h">
              Before you build
            </p>
            <span className="hand" style={{ fontSize: 18 }}>
              start here
            </span>
          </div>
          <div className="section-body">
            <PostList posts={before} />
          </div>
        </section>
      )}

      {ai.length > 0 && (
        <section className="section" aria-labelledby="ai-h">
          <p className="label" id="ai-h">
            Building with AI
          </p>
          <div className="section-body">
            <PostList posts={ai} />
          </div>
        </section>
      )}
    </>
  )
}
