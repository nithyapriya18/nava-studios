import Link from 'next/link'

export interface WorkCardProps {
  slug: string
  title: string
  problem: string
  outcome: string
  metric: string
  tags: string[]
  beforeText: string
  afterText: string
}

export function WorkCard({ slug, title, outcome, tags }: WorkCardProps) {
  return (
    <Link
      href={`/lab/${slug}`}
      className="flex flex-col border border-border bg-background p-6 hover:border-accent/40 transition-colors"
    >
      <p className="text-xs uppercase tracking-widest text-text-muted mb-3">
        {tags.join(' · ')}
      </p>
      <h3 className="text-lg font-medium text-text-primary leading-snug">{title}</h3>
      <p className="mt-3 text-sm text-text-muted leading-relaxed flex-1">{outcome}</p>
      <span className="mt-6 text-sm text-accent">Read the story</span>
    </Link>
  )
}
