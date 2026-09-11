import type { Metadata } from 'next'
import { getAllPosts } from '@/lib/mdx'
import { PostCard } from '@/components/post-card'
import { AnimateIn } from '@/components/animate-in'

export const metadata: Metadata = {
  title: 'Writing',
  description: 'Notes on first products: what belongs in v1, and how an engagement starts.',
}

export default async function WritingPage() {
  const posts = getAllPosts('writing')

  return (
    <div>
      <section className="bg-background py-24 md:py-32">
        <div className="max-w-layout mx-auto px-6 md:px-8">
          <AnimateIn>
            <h1 className="text-4xl md:text-5xl font-medium text-text-primary mb-4">
              Writing
            </h1>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <p className="text-text-muted text-lg md:text-xl max-w-xl leading-relaxed">
              Notes from building first versions for small and mid-size work.
            </p>
          </AnimateIn>
        </div>
      </section>

      <section className="bg-surface py-16 md:py-20">
        <div className="max-w-layout mx-auto px-6 md:px-8">
          <div className="flex flex-col gap-4">
            {posts.map((post) => (
              <AnimateIn key={post.slug}>
                <PostCard
                  slug={post.slug}
                  title={post.title}
                  date={post.date}
                  excerpt={post.excerpt}
                  readingTime={post.readingTime}
                  tags={post.tags}
                  variant="horizontal"
                />
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
