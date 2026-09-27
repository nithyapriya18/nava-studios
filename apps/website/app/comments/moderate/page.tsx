import type { Metadata } from 'next'
import Link from 'next/link'
import { commentForModeration } from '@/lib/comments'
import { getAllPosts } from '@/lib/mdx'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Review a comment',
  robots: { index: false, follow: false },
}

interface Props {
  searchParams: Promise<{ id?: string; t?: string; done?: string }>
}

/**
 * Opened from the new-comment email. Shows the comment with Approve and
 * Delete buttons. Acting needs a click on this page, so email security
 * scanners that open links automatically can't approve anything.
 */
export default async function ModeratePage({ searchParams }: Props) {
  const { id, t, done } = await searchParams

  if (done === 'deleted') {
    return (
      <Shell>
        <h1 className="text-3xl font-semibold text-text-primary">Comment deleted</h1>
        <p className="mt-3 text-text-muted">It has been removed and won&apos;t appear on the site.</p>
      </Shell>
    )
  }
  if (done === 'failed') {
    return (
      <Shell>
        <h1 className="text-3xl font-semibold text-text-primary">That didn&apos;t work</h1>
        <p className="mt-3 text-text-muted">
          The comment may already have been deleted, or the link is incomplete. You can
          still manage comments in Supabase, under Table Editor, post_comments.
        </p>
      </Shell>
    )
  }

  const comment = id && t ? await commentForModeration(Number(id), t) : null
  if (!comment) {
    return (
      <Shell>
        <h1 className="text-3xl font-semibold text-text-primary">Link not valid</h1>
        <p className="mt-3 text-text-muted">
          This link doesn&apos;t match a comment. It may have been deleted already.
        </p>
      </Shell>
    )
  }

  const post = getAllPosts('writing').find((p) => p.slug === comment.post_slug)
  const postHref = `/writing/${comment.post_slug}`

  return (
    <Shell>
      <p className="text-sm text-text-muted">
        Comment on{' '}
        <Link href={postHref} className="text-link">
          {post?.title ?? comment.post_slug}
        </Link>
      </p>
      <div className="mt-4 rounded-2xl border border-border bg-card p-5">
        <p className="text-sm">
          <span className="font-semibold text-text-primary">{comment.name}</span>{' '}
          <span className="text-text-muted">
            {new Date(comment.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
          </span>
        </p>
        <p className="mt-2 whitespace-pre-line leading-relaxed text-text-primary">{comment.body}</p>
      </div>

      {comment.approved ? (
        <div className="mt-6 rounded-2xl bg-accent-light p-4 text-[0.9375rem] text-text-primary">
          {done === 'approved' ? 'Approved. ' : 'This comment is already published. '}
          <Link href={postHref} className="text-link">
            See it on the post
          </Link>
        </div>
      ) : (
        <p className="mt-6 text-[0.9375rem] text-text-muted">This comment is hidden until you approve it.</p>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        {!comment.approved && (
          <form action="/api/comments/moderate" method="post">
            <input type="hidden" name="id" value={id} />
            <input type="hidden" name="t" value={t} />
            <input type="hidden" name="action" value="approve" />
            <button type="submit" className="btn-primary !px-6">
              Approve and publish
            </button>
          </form>
        )}
        <form action="/api/comments/moderate" method="post">
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="t" value={t} />
          <input type="hidden" name="action" value="delete" />
          <button type="submit" className="btn-default !px-6">
            Delete
          </button>
        </form>
      </div>
    </Shell>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-content px-6 pb-8 pt-16 md:px-8 md:pt-24">{children}</div>
}
