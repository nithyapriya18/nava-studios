import { notFound } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { db, schema } from '@/lib/db/client'
import { StoryView } from '@/components/story/StoryView'
import type { Story } from '@/lib/types'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export default async function StoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!UUID_RE.test(id)) notFound()

  const [row] = await db
    .select()
    .from(schema.stories)
    .where(eq(schema.stories.id, id))
    .limit(1)

  if (!row) notFound()

  const story: Story = { ...row, createdAt: row.createdAt?.toISOString() ?? null }

  return <StoryView story={story} />
}
